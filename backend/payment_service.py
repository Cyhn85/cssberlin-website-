# backend/payment_service.py
"""
CSS BERLIN - PRODUCTION STRIPE PAYMENT SERVICE
Handles: Checkout Sessions, Webhooks, Payment Verification
NO MOCKS. PRODUCTION READY.
"""

import stripe
import os
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models import Order, Product, User, Offer
from database import AsyncSessionLocal

# ─── STRIPE CONFIGURATION ────────────────────────────────────
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5500")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

# Initialize Stripe
if STRIPE_SECRET_KEY and STRIPE_SECRET_KEY.startswith("sk_"):
    stripe.api_key = STRIPE_SECRET_KEY
    print(f"[STRIPE] Initialized with key: {STRIPE_SECRET_KEY[:12]}...")
else:
    print("[STRIPE] WARNING: No valid Stripe key configured!")

# Platform fee (CSS Berlin commission)
PLATFORM_FEE_FIXED = 1.00  # 1€ per transaction
PLATFORM_FEE_PERCENT = 0.00  # Or 0.05 for 5%


# ═══════════════════════════════════════════════════════════
# ORDER NUMBER GENERATOR
# ═══════════════════════════════════════════════════════════

def generate_order_number() -> str:
    """Generate unique order number: ORD_XXXXXX"""
    timestamp = datetime.utcnow().strftime("%y%m%d")
    random = secrets.token_hex(3).upper()
    return f"ORD_{timestamp}{random}"


# ═══════════════════════════════════════════════════════════
# STRIPE CHECKOUT SESSION CREATION
# ═══════════════════════════════════════════════════════════

async def create_checkout_session(
    product_id: int,
    buyer_id: int,
    offer_id: Optional[int] = None,
    shipping_address: Optional[Dict] = None,
    db: AsyncSession = None
) -> Dict[str, Any]:
    """
    Create Stripe Checkout Session for product purchase
    
    Args:
        product_id: Product to purchase
        buyer_id: Buyer user ID
        offer_id: Optional - if buying via accepted offer
        shipping_address: Shipping details
        db: Database session
    
    Returns:
        {
            "session_id": "cs_xxx",
            "url": "https://checkout.stripe.com/...",
            "order_id": 123,
            "order_number": "ORD_260206ABC"
        }
    """
    
    if not STRIPE_SECRET_KEY or not STRIPE_SECRET_KEY.startswith("sk_"):
        raise Exception("Stripe not configured. Add STRIPE_SECRET_KEY to .env")
    
    # 1. Get product details
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    
    if not product:
        raise Exception(f"Product {product_id} not found")
    
    if product.is_sold:
        raise Exception("Product already sold")
    
    # 2. Determine price (negotiated or original)
    final_price = product.price
    
    if offer_id:
        result = await db.execute(select(Offer).where(Offer.id == offer_id))
        offer = result.scalar_one_or_none()
        
        if not offer or offer.status != "accepted":
            raise Exception("Invalid or unaccepted offer")
        
        final_price = offer.offer_amount if offer.counter_amount is None else offer.counter_amount
    
    # 3. Calculate fees
    platform_fee = PLATFORM_FEE_FIXED + (final_price * PLATFORM_FEE_PERCENT)
    shipping_cost = 0.00  # TODO: Calculate based on shipping method
    total_amount = final_price + platform_fee + shipping_cost
    
    # 4. Create Order in database (pending payment)
    order_number = generate_order_number()
    
    order = Order(
        order_number=order_number,
        buyer_id=buyer_id,
        seller_id=product.seller_id,
        product_id=product_id,
        offer_id=offer_id,
        product_price=final_price,
        platform_fee=platform_fee,
        shipping_cost=shipping_cost,
        total_amount=total_amount,
        shipping_address=shipping_address or {},
        payment_status="pending",
        status="pending_payment"
    )
    
    db.add(order)
    await db.commit()
    await db.refresh(order)
    
    # 5. Create Stripe Checkout Session
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card", "paypal", "klarna"],
            line_items=[
                {
                    "price_data": {
                        "currency": "eur",
                        "product_data": {
                            "name": product.name,
                            "description": f"{product.brand} - {product.condition}",
                            "images": product.images[:1] if product.images else [],
                        },
                        "unit_amount": int(final_price * 100),  # Stripe uses cents
                    },
                    "quantity": 1,
                },
                {
                    "price_data": {
                        "currency": "eur",
                        "product_data": {
                            "name": "CSS Berlin Service Fee",
                            "description": "Platform commission",
                        },
                        "unit_amount": int(platform_fee * 100),
                    },
                    "quantity": 1,
                },
            ],
            mode="payment",
            success_url=f"{FRONTEND_URL}/order-success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/product/{product_id}?checkout=cancelled",
            customer_email=None,  # TODO: Get buyer email
            metadata={
                "order_id": order.id,
                "order_number": order_number,
                "product_id": product_id,
                "buyer_id": buyer_id,
                "seller_id": product.seller_id,
            },
            payment_intent_data={
                "metadata": {
                    "order_id": order.id,
                    "order_number": order_number,
                }
            },
            expires_at=int((datetime.utcnow() + timedelta(hours=24)).timestamp()),
        )
        
        # 6. Update order with Stripe session ID
        order.stripe_checkout_session_id = session.id
        await db.commit()
        
        print(f"[STRIPE] Created checkout session: {session.id} for order {order_number}")
        
        return {
            "session_id": session.id,
            "url": session.url,
            "order_id": order.id,
            "order_number": order_number,
            "total_amount": total_amount,
        }
        
    except stripe.error.StripeError as e:
        print(f"[STRIPE ERROR] {str(e)}")
        # Mark order as failed
        order.payment_status = "failed"
        order.status = "cancelled"
        order.cancel_reason = f"Stripe error: {str(e)}"
        await db.commit()
        raise Exception(f"Payment processing error: {str(e)}")


# ═══════════════════════════════════════════════════════════
# WEBHOOK HANDLER (CRITICAL FOR PRODUCTION)
# ═══════════════════════════════════════════════════════════

async def handle_stripe_webhook(payload: bytes, sig_header: str) -> Dict[str, Any]:
    """
    Handle Stripe webhook events
    CRITICAL: This ensures payment is recorded even if user closes browser
    
    Events handled:
    - checkout.session.completed: Payment successful
    - payment_intent.succeeded: Payment confirmed
    - payment_intent.payment_failed: Payment failed
    """
    
    if not STRIPE_WEBHOOK_SECRET:
        print("[STRIPE WEBHOOK] ⚠️  WARNING: No webhook secret configured!")
        return {"status": "error", "message": "Webhook secret not configured"}
    
    try:
        # Verify webhook signature
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        print("[STRIPE WEBHOOK] Invalid payload")
        return {"status": "error", "message": "Invalid payload"}
    except stripe.error.SignatureVerificationError:
        print("[STRIPE WEBHOOK] Invalid signature")
        return {"status": "error", "message": "Invalid signature"}
    
    event_type = event["type"]
    data = event["data"]["object"]
    
    print(f"[STRIPE WEBHOOK] Received: {event_type}")
    
    # Handle checkout.session.completed
    if event_type == "checkout.session.completed":
        session_id = data["id"]
        payment_intent_id = data.get("payment_intent")
        
        async with AsyncSessionLocal() as db:
            # Find order by session ID
            result = await db.execute(
                select(Order).where(Order.stripe_checkout_session_id == session_id)
            )
            order = result.scalar_one_or_none()
            
            if not order:
                print(f"[STRIPE WEBHOOK] Order not found for session {session_id}")
                return {"status": "error", "message": "Order not found"}
            
            # Update order status
            order.payment_status = "paid"
            order.status = "paid"
            order.stripe_payment_intent_id = payment_intent_id
            order.paid_at = datetime.utcnow()
            
            # Mark product as sold
            result = await db.execute(select(Product).where(Product.id == order.product_id))
            product = result.scalar_one_or_none()
            if product:
                product.is_sold = True
                product.is_active = False
            
            await db.commit()
            
            print(f"[STRIPE WEBHOOK] ✅ Order {order.order_number} marked as PAID")
            
            # TODO: Send confirmation emails to buyer and seller
            # TODO: Create shipment record
            
            return {
                "status": "success",
                "order_id": order.id,
                "order_number": order.order_number
            }
    
    # Handle payment_intent.succeeded
    elif event_type == "payment_intent.succeeded":
        payment_intent_id = data["id"]
        
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(Order).where(Order.stripe_payment_intent_id == payment_intent_id)
            )
            order = result.scalar_one_or_none()
            
            if order and order.payment_status != "paid":
                order.payment_status = "paid"
                order.status = "paid"
                order.paid_at = datetime.utcnow()
                await db.commit()
                print(f"[STRIPE WEBHOOK] ✅ Payment confirmed for order {order.order_number}")
    
    # Handle payment_intent.payment_failed
    elif event_type == "payment_intent.payment_failed":
        payment_intent_id = data["id"]
        
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(Order).where(Order.stripe_payment_intent_id == payment_intent_id)
            )
            order = result.scalar_one_or_none()
            
            if order:
                order.payment_status = "failed"
                order.status = "cancelled"
                order.cancel_reason = "Payment failed"
                await db.commit()
                print(f"[STRIPE WEBHOOK] ❌ Payment failed for order {order.order_number}")
    
    return {"status": "success", "event_type": event_type}


# ═══════════════════════════════════════════════════════════
# ORDER VERIFICATION (For frontend polling)
# ═══════════════════════════════════════════════════════════

async def verify_order_payment(order_id: int, db: AsyncSession) -> Dict[str, Any]:
    """
    Verify if order payment is complete
    Used by frontend to poll payment status
    """
    
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    
    if not order:
        return {"status": "error", "message": "Order not found"}
    
    # If already paid, return success
    if order.payment_status == "paid":
        return {
            "status": "success",
            "paid": True,
            "order_number": order.order_number,
            "total_amount": order.total_amount
        }
    
    # If has Stripe session, check status
    if order.stripe_checkout_session_id:
        try:
            session = stripe.checkout.Session.retrieve(order.stripe_checkout_session_id)
            
            if session.payment_status == "paid":
                # Update order
                order.payment_status = "paid"
                order.status = "paid"
                order.stripe_payment_intent_id = session.payment_intent
                order.paid_at = datetime.utcnow()
                
                # Mark product as sold
                result = await db.execute(select(Product).where(Product.id == order.product_id))
                product = result.scalar_one_or_none()
                if product:
                    product.is_sold = True
                    product.is_active = False
                
                await db.commit()
                
                return {
                    "status": "success",
                    "paid": True,
                    "order_number": order.order_number,
                    "total_amount": order.total_amount
                }
            
            return {
                "status": "pending",
                "paid": False,
                "payment_status": session.payment_status
            }
            
        except stripe.error.StripeError as e:
            print(f"[STRIPE] Error retrieving session: {str(e)}")
            return {"status": "error", "message": str(e)}
    
    return {
        "status": "pending",
        "paid": False,
        "payment_status": order.payment_status
    }


# ═══════════════════════════════════════════════════════════
# REFUND HANDLING
# ═══════════════════════════════════════════════════════════

async def refund_order(order_id: int, reason: str, db: AsyncSession) -> Dict[str, Any]:
    """
    Refund an order via Stripe
    """
    
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    
    if not order:
        return {"status": "error", "message": "Order not found"}
    
    if order.payment_status != "paid":
        return {"status": "error", "message": "Order not paid, cannot refund"}
    
    if not order.stripe_payment_intent_id:
        return {"status": "error", "message": "No payment intent found"}
    
    try:
        refund = stripe.Refund.create(
            payment_intent=order.stripe_payment_intent_id,
            reason="requested_by_customer",
            metadata={
                "order_id": order.id,
                "order_number": order.order_number,
                "reason": reason
            }
        )
        
        # Update order
        order.payment_status = "refunded"
        order.status = "refunded"
        order.cancel_reason = reason
        order.cancelled_at = datetime.utcnow()
        
        # Unmark product as sold
        result = await db.execute(select(Product).where(Product.id == order.product_id))
        product = result.scalar_one_or_none()
        if product:
            product.is_sold = False
            product.is_active = True
        
        await db.commit()
        
        print(f"[STRIPE] ✅ Refunded order {order.order_number}")
        
        return {
            "status": "success",
            "refund_id": refund.id,
            "amount": refund.amount / 100
        }
        
    except stripe.error.StripeError as e:
        print(f"[STRIPE] Refund error: {str(e)}")
        return {"status": "error", "message": str(e)}
