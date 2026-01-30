from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any, Optional
from urllib.parse import quote

from playwright.async_api import APIRequestContext


class ApiError(RuntimeError):
    pass


@dataclass(frozen=True)
class TokenBundle:
    access_token: str
    token_type: str
    user: dict[str, Any]


class ApiClient:
    """
    Playwright-native API client for our FastAPI backend.

    Important: APIRequestContext `.post(..., data=dict)` turns into form-encoding.
    Our backend expects JSON bodies for these endpoints, so we send JSON strings.
    """

    def __init__(self, request: APIRequestContext, api_base_url: str):
        self._request = request
        self.api_base_url = api_base_url.rstrip("/")
        self._token: Optional[str] = None

    @property
    def token(self) -> Optional[str]:
        return self._token

    def _auth_headers(self) -> dict[str, str]:
        if not self._token:
            return {}
        return {"Authorization": f"Bearer {self._token}"}

    async def _json(self, resp) -> Any:
        try:
            return await resp.json()
        except Exception:
            txt = await resp.text()
            raise ApiError(f"Non-JSON response: {txt[:500]}")

    async def _post_json(self, path: str, payload: dict[str, Any], *, auth: bool = False):
        headers = {"Content-Type": "application/json"}
        if auth:
            headers.update(self._auth_headers())
        return await self._request.post(f"{self.api_base_url}{path}", headers=headers, data=json.dumps(payload))

    async def _put_json(self, path: str, payload: dict[str, Any], *, auth: bool = False):
        headers = {"Content-Type": "application/json"}
        if auth:
            headers.update(self._auth_headers())
        return await self._request.put(f"{self.api_base_url}{path}", headers=headers, data=json.dumps(payload))

    async def register(self, *, email: str, password: str, first_name: str, last_name: str) -> None:
        # /register returns UserResponse, not a token.
        resp = await self._post_json(
            "/api/auth/register",
            {"email": email, "password": password, "first_name": first_name, "last_name": last_name},
            auth=False,
        )
        if resp.ok or resp.status == 400:
            return
        raise ApiError(f"register failed: {resp.status} {await self._json(resp)}")

    async def login(self, *, email: str, password: str) -> TokenBundle:
        resp = await self._post_json("/api/auth/login", {"email": email, "password": password}, auth=False)
        if not resp.ok:
            raise ApiError(f"login failed: {resp.status} {await self._json(resp)}")
        data = await self._json(resp)
        token = data.get("access_token")
        if not token:
            raise ApiError(f"login missing access_token: {data}")
        self._token = token
        return TokenBundle(access_token=token, token_type=data.get("token_type", "bearer"), user=data.get("user") or {})

    async def register_or_login(self, *, email: str, password: str, first_name: str, last_name: str) -> TokenBundle:
        try:
            await self.register(email=email, password=password, first_name=first_name, last_name=last_name)
        except ApiError:
            # user exists etc -> ignore
            pass
        return await self.login(email=email, password=password)

    async def create_product(
        self,
        *,
        name: str,
        description: str,
        price: float,
        brand: str,
        category: str,
        condition: str,
        size: str,
        images: list[str],
    ) -> dict[str, Any]:
        resp = await self._post_json(
            "/api/products",
            {
                "name": name,
                "description": description,
                "price": price,
                "brand": brand,
                "category": category,
                "condition": condition,
                "size": size,
                "images": images,
            },
            auth=True,
        )
        if not resp.ok:
            raise ApiError(f"create_product failed: {resp.status} {await self._json(resp)}")
        return await self._json(resp)

    async def search_products(self, *, query: str, limit: int = 20) -> list[dict[str, Any]]:
        q = quote(query)
        resp = await self._request.get(f"{self.api_base_url}/api/products?search={q}&limit={limit}")
        if not resp.ok:
            raise ApiError(f"search_products failed: {resp.status} {await self._json(resp)}")
        data = await self._json(resp)
        return data.get("products", [])

    async def add_favorite(self, *, product_id: int) -> None:
        resp = await self._request.post(
            f"{self.api_base_url}/api/favorites/{product_id}",
            headers=self._auth_headers(),
        )
        if not resp.ok:
            raise ApiError(f"add_favorite failed: {resp.status} {await self._json(resp)}")

    async def create_offer(self, *, product_id: int, offer_amount: float, message: str | None = None) -> dict[str, Any]:
        payload: dict[str, Any] = {"product_id": product_id, "offer_amount": offer_amount}
        if message:
            payload["message"] = message
        resp = await self._post_json("/api/offers", payload, auth=True)
        if not resp.ok:
            raise ApiError(f"create_offer failed: {resp.status} {await self._json(resp)}")
        return await self._json(resp)

    async def get_offers(self) -> list[dict[str, Any]]:
        resp = await self._request.get(f"{self.api_base_url}/api/offers", headers=self._auth_headers())
        if not resp.ok:
            raise ApiError(f"get_offers failed: {resp.status} {await self._json(resp)}")
        data = await self._json(resp)
        return data.get("offers", [])

    async def decline_offer(self, *, offer_id: int) -> None:
        resp = await self._request.put(
            f"{self.api_base_url}/api/offers/{offer_id}/decline",
            headers=self._auth_headers(),
        )
        if not resp.ok:
            raise ApiError(f"decline_offer failed: {resp.status} {await self._json(resp)}")

    async def counter_offer(self, *, offer_id: int, counter_amount: float) -> None:
        resp = await self._put_json(f"/api/offers/{offer_id}/counter", {"counter_amount": counter_amount}, auth=True)
        if not resp.ok:
            raise ApiError(f"counter_offer failed: {resp.status} {await self._json(resp)}")

    async def accept_offer(self, *, offer_id: int) -> dict[str, Any]:
        resp = await self._request.put(
            f"{self.api_base_url}/api/offers/{offer_id}/accept",
            headers=self._auth_headers(),
        )
        if not resp.ok:
            raise ApiError(f"accept_offer failed: {resp.status} {await self._json(resp)}")
        return await self._json(resp)

    async def create_order(
        self,
        *,
        product_id: int,
        price: float,
        offer_id: int | None,
        shipping_cost: float = 4.99,
    ) -> int:
        resp = await self._post_json(
            "/api/orders",
            {
                "items": [{"product_id": product_id, "price": price, "original_price": None, "offer_id": offer_id}],
                "shipping_address": {
                    "firstName": "Matrix",
                    "lastName": "Buyer",
                    "email": "matrix-buyer@cssberlin.de",
                    "phone": "+49 000 000000",
                    "street": "Matrix Str. 1",
                    "postalCode": "10115",
                    "city": "Berlin",
                    "country": "DE",
                },
                "payment_method": "card",
                "shipping_method": "dhl",
                "shipping_cost": shipping_cost,
                "total_amount": price + shipping_cost,
            },
            auth=True,
        )
        if not resp.ok:
            raise ApiError(f"create_order failed: {resp.status} {await self._json(resp)}")
        data = await self._json(resp)
        orders = data.get("orders") or []
        if not orders:
            raise ApiError(f"create_order missing orders: {data}")
        return int(orders[0]["id"])

    async def pay_dummy_card(self, *, order_id: int) -> dict[str, Any]:
        resp = await self._post_json(
            "/api/payment/card/intent",
            {
                "order_id": order_id,
                "method": "card",
                "card_number": "4242424242424242",
                "card_exp_month": "12",
                "card_exp_year": "30",
                "card_cvc": "123",
            },
            auth=True,
        )
        if not resp.ok:
            raise ApiError(f"pay_dummy_card failed: {resp.status} {await self._json(resp)}")
        return await self._json(resp)

    async def create_shipment(self, *, order_id: int) -> dict[str, Any]:
        resp = await self._post_json(
            "/api/shipments",
            {
                "order_id": order_id,
                "carrier": "dhl",
                "tracking_number": f"MATRIX-{order_id}",
                "weight_kg": 1.2,
                "package_size": "M",
            },
            auth=True,
        )
        if not resp.ok:
            raise ApiError(f"create_shipment failed: {resp.status} {await self._json(resp)}")
        return await self._json(resp)

    async def leave_review(self, *, order_id: int, rating: int, comment: str) -> dict[str, Any]:
        resp = await self._post_json(
            "/api/reviews/user",
            {"order_id": order_id, "rating": rating, "comment": comment},
            auth=True,
        )
        if not resp.ok:
            raise ApiError(f"leave_review failed: {resp.status} {await self._json(resp)}")
        return await self._json(resp)
