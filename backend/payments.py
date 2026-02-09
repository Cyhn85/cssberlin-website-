# backend/payments.py
"""
CSS Berlin — Payments Router (V4 Updated)
Stripe PaymentIntent + mock PayPal/Klarna flow
models.py → Payment + Order (Escrow via status)
"""

from fastapi import APIRouter, HTTPException, Depends, Header as _Header
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import Product, Order, Payment, EscrowStatus
from auth import get_current_user
import os, uuid

router = APIRouter(prefix="/api/payment", tags=["Payments"])

# ─── Env ─────────────────────────────────────────────────
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
KLARNA_API_URL = os.getenv("KLARNA_API_URL", "https://api.playground.klarna.com")
KLARNA_USERNAME = os.getenv("KLARNA_USERNAME", "")
KLARNA_PASSWORD = os.getenv("KLARNA_PASSWORD", "")


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
        "klarna_enabled": bool(KLARNA_USERNAME and KLARNA_PASSWORD),
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


# ─── MOCK CHECKOUTS ──────────────────────────────────────
# Simplified for compatibility with new Order model
@router.post("/confirm")
async def confirm_payment(
    payload: dict,
    db: AsyncSession = Depends(get_db),
):
    """
    Mock payment confirmation.
    Creates Order with V4 logic (Held in Escrow by default)
    """
    product_id = payload.get("product_id")
    buyer_id = payload.get("buyer_id")
    amount = payload.get("amount", 0)
    method = payload.get("method", "card")
    
    if not product_id or not buyer_id:
        raise HTTPException(status_code=400, detail="Missing required fields")

    # Get Product
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Generate Order Number
    order_number = f"ORD_{uuid.uuid4().hex[:8].upper()}"

    # Create Order (V4 Compliant)
    order = Order(
        order_number=order_number,
        buyer_id=buyer_id,
        seller_id=product.seller_id,
        product_id=product.id,
        product_price=product.price,
        shipping_cost=0.0, # Simplified
        platform_fee=1.00 + (product.price * 0.05), # 1€ + 5%
        buyer_protection_fee=0.70 + (product.price * 0.04), # 0.70€ + 4%
        total_amount=amount, # assumed to include fees
        
        status="paid",
        escrow_status=EscrowStatus.HELD, # Money is held!
        payment_method=method,
        payment_status="paid"
    )
    db.add(order)
    await db.flush()

    # Disable Product
    product.status = "sold"
    product.is_sold = True

    # Payment Record
    payment = Payment(
        order_id=order.id,
        user_id=buyer_id,
        amount=amount,
        currency="EUR",
        method=method,
        status="paid"
    )
    db.add(payment)

    await db.commit()
    await db.refresh(order)

    return {
        "order_id": order.id,
        "order_number": order_number,
        "status": "confirmed",
        "escrow": "HELD",
        "message": "Zahlung erfolgreich. Betrag wird treuhänderisch verwaltet."
    }
