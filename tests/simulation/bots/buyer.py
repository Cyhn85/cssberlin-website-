from __future__ import annotations

import time
from pathlib import Path

from playwright.async_api import BrowserContext, APIRequestContext

from ..api import ApiClient
from ..state import MatrixState
from ..utils.artifacts import RunArtifacts
from ..utils.logging import log
from ..utils.screenshot import screenshot_on_error
from .base import ActorIdentity, BaseBot


class BuyerBot(BaseBot):
    def __init__(
        self,
        *,
        identity: ActorIdentity,
        context: BrowserContext,
        request: APIRequestContext,
        base_url: str,
        api_url: str,
        state: MatrixState,
        screenshots_dir: Path,
        artifacts: RunArtifacts | None = None,
    ):
        super().__init__(identity=identity, context=context, base_url=base_url, artifacts=artifacts)
        self.api = ApiClient(request=request, api_base_url=api_url)
        self.state = state
        self.screenshots_dir = screenshots_dir

    async def _ui_click_product_card(self, product_name: str) -> None:
        if not self.page:
            return
        page = self.page
        await page.goto(f"{self.base_url}/index.html", wait_until="domcontentloaded")
        # Wait for product cards to actually render (grid can be 0px tall when empty)
        await page.wait_for_function("() => document.querySelectorAll('.product-card').length > 0", timeout=30000)
        await page.locator(".product-card").get_by_text(product_name, exact=False).first.wait_for(timeout=30000)
        log("ALICI", f"UI: '{product_name}' ürününü ekranda gördü.", "OK")

    async def run(self) -> None:
        bot = "ALICI"
        page = None
        try:
            page = await self.new_page()

            # API auth
            token = await self.api.register_or_login(
                email=self.identity.email,
                password=self.identity.password,
                first_name=self.identity.first_name,
                last_name=self.identity.last_name,
            )
            self.state.buyer_user_id = int(token.user.get("id"))
            await self.inject_auth_storage(access_token=token.access_token, user=token.user)
            log(bot, "Farklı context ile giriş yaptı.", "OK")

            # Wait for product
            await self.state.product_created.wait()
            if not self.state.product_id:
                raise RuntimeError("product_created signaled but product_id missing")

            # Visible: search/browse in UI
            await self._ui_click_product_card("Vintage Ceket")

            # Favorites (API real)
            await self.api.add_favorite(product_id=self.state.product_id)
            log(bot, "Ürünü favorilere ekledi.", "OK")

            # Visible: click negotiate button if present (doesn't drive backend reliably)
            try:
                await page.locator(f".negotiate-btn[data-product-id='{self.state.product_id}']").first.click(timeout=3000)
                log(bot, "UI: “Pazarlık Yap” butonuna bastı.", "INFO")
            except Exception:
                log(bot, "UI: “Pazarlık Yap” butonu bulunamadı (API akışı devam ediyor).", "WARN")

            # Offer via API: 70€
            offer = await self.api.create_offer(
                product_id=self.state.product_id,
                offer_amount=70.0,
                message="Matrix: 70€ teklif ediyorum.",
            )
            self.state.offer_id = int(offer["id"])
            self.state.offer_created.set()
            log(bot, f"Teklif verdi: 70€ [offer_id={self.state.offer_id}]", "OK")

            # Wait seller response
            await self.state.offer_responded.wait()

            # Fetch offer status
            offers = await self.api.get_offers()
            current = next((o for o in offers if int(o.get("id")) == self.state.offer_id), None)
            if not current:
                raise RuntimeError("Offer not found after response")

            status = current.get("status")
            counter = current.get("counter_amount")
            if status == "declined":
                log(bot, "Satıcı reddetti -> 90€ yeni teklif gönderiliyor.", "WARN")
                offer2 = await self.api.create_offer(
                    product_id=self.state.product_id,
                    offer_amount=90.0,
                    message="Matrix: 90€ olur mu?",
                )
                self.state.offer_id = int(offer2["id"])
                self.state.offer_created.set()
                # seller bot only responds once; accept ourselves for demo flow
                await self.api.accept_offer(offer_id=self.state.offer_id)
                self.state.agreed_price = 90.0
                log(bot, "Anlaşma sağlandı (buyer-side accept): 90€", "OK")
            elif status == "countered" and counter:
                self.state.agreed_price = float(counter)
                await self.api.accept_offer(offer_id=self.state.offer_id)
                log(bot, f"Karşı teklifi kabul etti: {self.state.agreed_price:.2f}€", "OK")
            else:
                # pending/accepted without counter - accept at 70
                self.state.agreed_price = 70.0
                await self.api.accept_offer(offer_id=self.state.offer_id)
                log(bot, "Teklif kabul edildi (varsayılan): 70€", "OK")

            # “Sepete ekle” (UI/localStorage) + Backend Order+Payment (real DB)
            agreed = float(self.state.agreed_price or 70.0)

            # Put into cart for visuals (checkout.html reads this), even though purchase uses API below.
            cart_item = {
                "id": self.state.product_id,
                "name": "Vintage Ceket",
                "price": f"{agreed:.2f}€",
                "image": f"{self.base_url}/seed_data/vintage_ceket_01.svg",
                "category": "Vintage",
                "size": "M",
                "quantity": 1,
                "isNegotiated": True,
                "originalPrice": 100.0,
            }
            await page.evaluate(
                """(item) => localStorage.setItem('cssberlin_cart', JSON.stringify([item]))""",
                cart_item,
            )
            log(bot, "Sepete ekledi (UI için localStorage).", "OK")

            # Create backend order
            order_id = await self.api.create_order(
                product_id=self.state.product_id,
                price=agreed,
                offer_id=self.state.offer_id,
                shipping_cost=4.99,
            )
            self.state.order_id = int(order_id)
            log(bot, f"Sipariş oluşturdu (backend): order_id={self.state.order_id}", "OK")

            # Dummy credit card payment (backend)
            await self.api.pay_dummy_card(order_id=self.state.order_id)
            self.state.order_paid.set()
            log(bot, "Dummy Credit Card ile ödedi (backend).", "OK")

            # Visible: go checkout page and click (demo UI)
            await page.goto(f"{self.base_url}/checkout.html", wait_until="domcontentloaded")
            try:
                await page.fill("#firstName", self.identity.first_name, timeout=3000)
                await page.fill("#lastName", self.identity.last_name, timeout=3000)
                await page.fill("#email", self.identity.email, timeout=3000)
                await page.fill("#phone", "+49 000 000000", timeout=3000)
                await page.fill("#street", "Matrix Str. 1", timeout=3000)
                await page.fill("#postalCode", "10115", timeout=3000)
                await page.fill("#city", "Berlin", timeout=3000)
                # click order button if exists
                await page.locator(".place-order-btn").first.click(timeout=3000)
                log(bot, "UI: Checkout ekranında sipariş butonuna bastı (demo).", "INFO")
            except Exception:
                log(bot, "UI: Checkout form alanları bulunamadı (demo), backend akışı tamamlandı.", "WARN")

            # Wait seller shipment
            await self.state.shipped.wait()

            # Review
            await self.api.leave_review(order_id=self.state.order_id, rating=5, comment="Hızlı kargo!")
            self.state.review_left.set()
            log(bot, "Satıcıya 5 yıldız + “Hızlı kargo!” yorumu bıraktı.", "OK")

        except Exception as e:
            shot = await screenshot_on_error(page, self.screenshots_dir, "buyer")
            log(bot, f"HATA: {e} (screenshot={shot})", "ERR")
            raise
        finally:
            if page:
                await page.wait_for_timeout(300)

