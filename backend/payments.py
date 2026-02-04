# backend/payments.py
"""
CSS Berlin — Payments Router
Stripe PaymentIntent + mock PayPal/Klarna flow
models.py → Payment + Order + Escrow tabloları

ÖNEMLI: Stripe API key .env'den okunur.
Test modunda çalışır — production'da gerçek key gerekir.
"""

from fastapi import APIRouter, HTTPException, Depends, Header as _Header
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import Product, Order, Payment, Escrow
from auth import get_current_user
import os, uuid

router = APIRouter(prefix="/api/payment", tags=["Payments"])

# ─── Env ─────────────────────────────────────────────────
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "")


# ─── Schemas ─────────────────────────────────────────────
class PaymentIntentRequest(BaseModel):
    product_id: int
    quantity: int = 1


class PaymentIntentResponse(BaseModel):
    client_secret: str
    publishable_key: str
    amount: int  # cents
    currency: str


class CheckoutCreateRequest(BaseModel):
    product_id: int
    quantity: int = 1


# ─── Helper ──────────────────────────────────────────────
async def _get_user(authorization: Optional[str], db: AsyncSession):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token eksik")
    token = authorization[len("Bearer "):]
    return await get_current_user(token, db)


# ─── CONFIG ──────────────────────────────────────────────
@router.get("/config")
async def payment_config():
    """Frontend bu endpoint'ten ödeme config'ı alır."""
    return {
        "stripe_enabled": bool(STRIPE_SECRET_KEY),
        "paypal_enabled": True,   # mock
        "klarna_enabled": True,   # mock
        "publishable_key": STRIPE_PUBLISHABLE_KEY or "pk_test_placeholder",
    }


# ─── STRIPE: PaymentIntent ───────────────────────────────
@router.post("/card/intent", response_model=PaymentIntentResponse)
async def create_payment_intent(
    req: PaymentIntentRequest,
    authorization: Optional[str] = _Header(default=None),
    db: AsyncSession = Depends(get_db),
):
    """
    Stripe PaymentIntent oluştur.
    Frontend → Stripe.js confirmCardPayment() ile kullanır.
    """
    user = await _get_user(authorization, db)

    # Ürün fiyatını al
    result = await db.execute(select(Product).where(Product.id == req.product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    amount_cents = int(product.price * 100 * req.quantity)

    # Stripe API var mı?
    if STRIPE_SECRET_KEY and STRIPE_SECRET_KEY.startswith("sk_"):
        try:
            import stripe
            stripe.api_key = STRIPE_SECRET_KEY

            intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency="eur",
                metadata={
                    "product_id": str(product.id),
                    "buyer_id": str(user.id),
                    "seller_id": str(product.seller_id),
                },
            )

            return {
                "client_secret": intent.client_secret,
                "publishable_key": STRIPE_PUBLISHABLE_KEY,
                "amount": amount_cents,
                "currency": "eur",
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Stripe hata: {str(e)}")
    else:
        # TEST MODE — mock client_secret
        mock_secret = f"pi_test_mock_{uuid.uuid4().hex[:16]}_secret_{uuid.uuid4().hex[:16]}"
        return {
            "client_secret": mock_secret,
            "publishable_key": "pk_test_placeholder",
            "amount": amount_cents,
            "currency": "eur",
        }


# ─── STRIPE: Checkout Session (redirect flow) ───────────
@router.post("/stripe/create-checkout")
async def stripe_create_checkout(
    req: CheckoutCreateRequest,
    authorization: Optional[str] = _Header(default=None),
    db: AsyncSession = Depends(get_db),
):
    """Stripe Checkout Session oluştur → redirect URL ver."""
    user = await _get_user(authorization, db)

    result = await db.execute(select(Product).where(Product.id == req.product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    if STRIPE_SECRET_KEY and STRIPE_SECRET_KEY.startswith("sk_"):
        try:
            import stripe
            stripe.api_key = STRIPE_SECRET_KEY

            session = stripe.checkout.Session.create(
                mode="payment",
                line_items=[{
                    "price_data": {
                        "currency": "eur",
                        "product_data": {"name": product.name},
                        "unit_amount": int(product.price * 100),
                    },
                    "quantity": req.quantity,
                }],
                success_url="https://www.cssberlin.de/bestellung-bestaetigung.html?session={CHECKOUT_SESSION_ID}",
                cancel_url="https://www.cssberlin.de/warenkorb.html",
            )
            return {"checkout_url": session.url}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Stripe Checkout hata: {str(e)}")
    else:
        # TEST: mock URL
        return {"checkout_url": "/bestellung-bestaetigung.html?mock=true&product=" + str(req.product_id)}


# ─── PAYPAL ──────────────────────────────────────────────
@router.post("/paypal/create-order")
async def paypal_create_order(
    req: CheckoutCreateRequest,
    authorization: Optional[str] = _Header(default=None),
    db: AsyncSession = Depends(get_db),
):
    """PayPal order oluştur (mock — real PayPal SDK gerekir)."""
    user = await _get_user(authorization, db)

    result = await db.execute(select(Product).where(Product.id == req.product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    # Mock: gerçek PayPal SDK entegrasyonu için PayPal REST API kullan
    return {
        "approve_url": f"/bestellung-bestaetigung.html?mock=true&method=paypal&product={req.product_id}",
        "order_id": f"PAYPAL_ORDER_{uuid.uuid4().hex[:12]}",
        "amount": product.price * req.quantity,
    }


# ─── KLARNA ──────────────────────────────────────────────
@router.post("/klarna/create-session")
async def klarna_create_session(
    req: dict,
    authorization: Optional[str] = _Header(default=None),
    db: AsyncSession = Depends(get_db),
):
    """Klarna session oluştur (mock — real Klarna Payments API gerekir)."""
    user = await _get_user(authorization, db)

    product_id = req.get("product_id", 1)
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    # Mock Klarna
    return {
        "redirect_url": f"/bestellung-bestaetigung.html?mock=true&method=klarna&product={product_id}",
        "session_id": f"KLARNA_SESSION_{uuid.uuid4().hex[:12]}",
        "amount": product.price,
    }


# ─── PAYMENT CONFIRMATION (webhook-style) ──────────────
@router.post("/confirm")
async def confirm_payment(
    payload: dict,
    db: AsyncSession = Depends(get_db),
):
    """
    Stripe webhook veya mock confirmation endpoint.
    Order + Payment kayıt oluştur.
    """
    product_id = payload.get("product_id")
    buyer_id = payload.get("buyer_id")
    amount = payload.get("amount", 0)
    method = payload.get("method", "card")
    payment_intent_id = payload.get("payment_intent_id", "")

    if not product_id or not buyer_id:
        raise HTTPException(status_code=400, detail="product_id ve buyer_id zorunlu")

    # Order oluştur
    order = Order(
        buyer_id=buyer_id,
        product_id=product_id,
        total_amount=amount,
        status="paid",
        payment_intent_id=payment_intent_id,
    )
    db.add(order)
    await db.flush()

    # Payment kayıt
    payment = Payment(
        order_id=order.id,
        user_id=buyer_id,
        amount=amount,
        currency="EUR",
        method=method,
        status="paid",
        provider="stripe" if method == "card" else method,
        provider_reference=payment_intent_id,
    )
    db.add(payment)

    # Ürünü satıldı olarak işaret et
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if product:
        product.is_sold = True

    await db.commit()
    await db.refresh(order)

    return {
        "order_id": order.id,
        "status": "confirmed",
        "message": "Ödeme başarılı. Siparişiniz onaylandı.",
    }
