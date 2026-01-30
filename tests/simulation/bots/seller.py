from __future__ import annotations

import random
import time
from pathlib import Path

from playwright.async_api import BrowserContext, APIRequestContext

from ..api import ApiClient
from ..state import MatrixState
from ..utils.logging import log
from ..utils.screenshot import screenshot_on_error
from .base import ActorIdentity, BaseBot


class SellerBot(BaseBot):
    def __init__(
        self,
        *,
        identity: ActorIdentity,
        context: BrowserContext,
        request: APIRequestContext,
        base_url: str,
        api_url: str,
        seed_data_dir: Path,
        state: MatrixState,
        screenshots_dir: Path,
    ):
        super().__init__(identity=identity, context=context, base_url=base_url)
        self.api = ApiClient(request=request, api_base_url=api_url)
        self.seed_data_dir = seed_data_dir
        self.state = state
        self.screenshots_dir = screenshots_dir

    def _pick_random_seed_image(self) -> Path:
        candidates = sorted([p for p in self.seed_data_dir.glob("*.svg") if p.is_file()])
        if not candidates:
            raise RuntimeError(f"No seed images found in {self.seed_data_dir}")
        return random.choice(candidates)

    async def run(self) -> None:
        bot = "SATICI"
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
            self.state.seller_user_id = int(token.user.get("id"))
            await self.inject_auth_storage(access_token=token.access_token, user=token.user)

            log(bot, "Siteye giriş yaptı (API token hazır).", "OK")

            # Visible: open inserieren and upload random seed image
            await page.goto(f"{self.base_url}/inserieren.html", wait_until="domcontentloaded")
            img = self._pick_random_seed_image()
            await page.set_input_files("#imageInput", str(img))
            log(bot, f"Seed resim seçti: {img.name}", "INFO")

            # Create product via API (real DB)
            product = await self.api.create_product(
                name="Vintage Ceket",
                description="Matrix simülasyonu için vintage ceket ilanı. (demo)",
                price=100.0,
                brand="Vintage",
                category="damen",
                condition="Sehr gut",
                size="M",
                images=[f"{self.base_url}/seed_data/{img.name}"],
            )
            self.state.product_id = int(product["id"])
            self.state.product_created.set()
            log(bot, f"İlan açtı: Vintage Ceket (100€) [product_id={self.state.product_id}]", "OK")

            # Wait for offer
            await self.state.offer_created.wait()
            if not self.state.offer_id:
                raise RuntimeError("offer_created signaled but offer_id missing")

            # Poll offer details and react
            log(bot, f"Teklif bekleniyor... [offer_id={self.state.offer_id}]", "INFO")

            decision = random.random()
            if decision < 0.5:
                await self.api.decline_offer(offer_id=self.state.offer_id)
                log(bot, "Alıcı teklifini reddetti (%50 ihtimal).", "WARN")
                self.state.offer_responded.set()
            else:
                await self.api.counter_offer(offer_id=self.state.offer_id, counter_amount=90.0)
                log(bot, "Karşı teklif verdi: 90€ (%50 ihtimal).", "OK")
                self.state.offer_responded.set()

            # Wait for payment
            await self.state.order_paid.wait()
            log(bot, f"Satış gerçekleşti (order_id={self.state.order_id}).", "OK")

            # Create shipment
            if not self.state.order_id:
                raise RuntimeError("order_paid signaled but order_id missing")
            shipment = await self.api.create_shipment(order_id=self.state.order_id)
            self.state.shipment_id = int(shipment["id"])
            self.state.shipped.set()
            log(bot, "“Kargolandı” yaptı (shipment oluşturuldu).", "OK")

            # Wait for review / end
            await self.state.review_left.wait()
            log(bot, "Simülasyon bitti: Alıcı yorum bıraktı.", "OK")

        except Exception as e:
            shot = await screenshot_on_error(page, self.screenshots_dir, "seller")
            log(bot, f"HATA: {e} (screenshot={shot})", "ERR")
            raise
        finally:
            # keep page open a bit for visibility when headed
            if page:
                try:
                    await page.wait_for_timeout(300)
                except Exception:
                    pass

