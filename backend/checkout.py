# backend/checkout.py
"""
CSS BERLIN - CHECKOUT & ORDER MANAGEMENT API
Endpoints for: Checkout, Order tracking, Negotiations
"""

from fastapi import APIRouter, HTTPException, Depends, Request, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

from database import get_db
from models import Order, Product, User, Offer
from auth import get_current_user
import payment_service

router = APIRouter(prefix="/api/checkout", tags=["Checkout & Orders"])


# ═══════════════════════════════════════════════════════════
# PYDANTIC SCHEMAS
# ═══════════════════════════════════════════════════════════

class CheckoutRequest(BaseModel):
    product_id: int
    offer_id: Optional[int] = None
    shipping_address: Optional[dict] = None


class OrderResponse(BaseModel):
    id: int
    order_number: str
    buyer_id: int
    seller_id: int
    product_id: int
    product_price: float
    platform_fee: float
    total_amount: float
    payment_status: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class NegotiationRequest(BaseModel):
    product_id: int
    offer_amount: float
    message: Optional[str] = None


class NegotiationResponse(BaseModel):
    action: str  # accept, decline, counter
    counter_amount: Optional[float] = None
    message: Optional[str] = None


# ═══════════════════════════════════════════════════════════
# CHECKOUT ENDPOINTS
# ═══════════════════════════════════════════════════════════

@router.post("/create-session")
async def create_checkout_session(
    data: CheckoutRequest,
    authorization: Optional[str] = Header(default=None),
    db: AsyncSession = Depends(get_db)
):
    """
    Create Stripe Checkout Session
    
    Flow:
    1. Verify user is authenticated
    2. Verify product is available
    3. If offer_id provided, verify offer is accepted
    4. Create Order in database (pending_payment)
    5. Create Stripe Checkout Session
    6. Return session URL for redirect
    """
    
    # Get current user
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization[len("Bearer "):]
    user = await get_current_user(token, db)
    
    # Verify product exists and is available
    result = await db.execute(select(Product).where(Product.id == data.product_id))
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product.is_sold:
        raise HTTPException(status_code=400, detail="Product already sold")
    
    if not product.is_active:
        raise HTTPException(status_code=400, detail="Product not available")
    
    # Cannot buy your own product
    if product.seller_id == user.id:
        raise HTTPException(status_code=400, detail="Cannot purchase your own product")
    
    # If offer_id provided, verify it
    if data.offer_id:
        result = await db.execute(select(Offer).where(Offer.id == data.offer_id))
        offer = result.scalar_one_or_none()
        
        if not offer:
            raise HTTPException(status_code=404, detail="Offer not found")
        
        if offer.status != "accepted":
            raise HTTPException(status_code=400, detail="Offer not accepted")
        
        if offer.buyer_id != user.id:
            raise HTTPException(status_code=403, detail="Not your offer")
        
        if offer.product_id != data.product_id:
            raise HTTPException(status_code=400, detail="Offer product mismatch")
    
    # Create checkout session
    try:
        session_data = await payment_service.create_checkout_session(
            product_id=data.product_id,
            buyer_id=user.id,
            offer_id=data.offer_id,
            shipping_address=data.shipping_address,
            db=db
        )
        
        return {
            "success": True,
            **session_data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/verify/{order_id}")
async def verify_order(
    order_id: int,
    authorization: Optional[str] = Header(default=None),
    db: AsyncSession = Depends(get_db)
):
    """
    Verify order payment status
    Used by frontend to poll after redirect from Stripe
    """
    
    # Get current user
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization[len("Bearer "):]
    user = await get_current_user(token, db)
    
    # Verify order belongs to user
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.buyer_id != user.id:
        raise HTTPException(status_code=403, detail="Not your order")
    
    # Check payment status
    verification = await payment_service.verify_order_payment(order_id, db)
    
    return verification


# ═══════════════════════════════════════════════════════════
# STRIPE WEBHOOK (CRITICAL!)
# ═══════════════════════════════════════════════════════════

@router.post("/webhook")
async def stripe_webhook(request: Request):
    """
    Stripe webhook endpoint
    CRITICAL: This ensures payments are recorded even if user closes browser
    
    Configure in Stripe Dashboard:
    URL: https://api.cssberlin.de/api/checkout/webhook
    Events: checkout.session.completed, payment_intent.succeeded, payment_intent.payment_failed
    """
    
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    if not sig_header:
        raise HTTPException(status_code=400, detail="Missing signature")
    
    result = await payment_service.handle_stripe_webhook(payload, sig_header)
    
    return result


# ═══════════════════════════════════════════════════════════
# ORDER MANAGEMENT (USER DASHBOARD)
# ═══════════════════════════════════════════════════════════

@router.get("/orders/buying", response_model=List[OrderResponse])
async def get_buying_orders(
    authorization: Optional[str] = Header(default=None),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all orders where user is the BUYER
    """
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization[len("Bearer "):]
    user = await get_current_user(token, db)
    
    result = await db.execute(
        select(Order)
        .where(Order.buyer_id == user.id)
        .order_by(Order.created_at.desc())
    )
    orders = result.scalars().all()
    
    return orders


@router.get("/orders/selling", response_model=List[OrderResponse])
async def get_selling_orders(
    authorization: Optional[str] = Header(default=None),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all orders where user is the SELLER
    """
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization[len("Bearer "):]
    user = await get_current_user(token, db)
    
    result = await db.execute(
        select(Order)
        .where(Order.seller_id == user.id)
        .order_by(Order.created_at.desc())
    )
    orders = result.scalars().all()
    
    return orders


@router.get("/orders/{order_id}", response_model=OrderResponse)
async def get_order_details(
    order_id: int,
    authorization: Optional[str] = Header(default=None),
    db: AsyncSession = Depends(get_db)
):
    """
    Get detailed order information
    """
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization[len("Bearer "):]
    user = await get_current_user(token, db)
    
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Verify user is buyer or seller
    if order.buyer_id != user.id and order.seller_id != user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return order


# ═══════════════════════════════════════════════════════════
# NEGOTIATION ENDPOINTS (VINTED-STYLE)
# ═══════════════════════════════════════════════════════════

@router.post("/negotiate/offer")
async def make_offer(
    data: NegotiationRequest,
    authorization: Optional[str] = Header(default=None),
    db: AsyncSession = Depends(get_db)
):
    """
    Make an offer on a product (Vinted-style negotiation)
    """
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization[len("Bearer "):]
    user = await get_current_user(token, db)
    
    # Get product
    result = await db.execute(select(Product).where(Product.id == data.product_id))
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product.is_sold:
        raise HTTPException(status_code=400, detail="Product already sold")
    
    if product.seller_id == user.id:
        raise HTTPException(status_code=400, detail="Cannot make offer on your own product")
    
    # Validate offer amount (minimum 50% of asking price)
    min_offer = product.price * 0.5
    if data.offer_amount < min_offer:
        raise HTTPException(
            status_code=400,
            detail=f"Offer too low. Minimum: €{min_offer:.2f}"
        )
    
    # Check if user already has pending offer
    result = await db.execute(
        select(Offer).where(
            and_(
                Offer.product_id == data.product_id,
                Offer.buyer_id == user.id,
                Offer.status == "pending"
            )
        )
    )
    existing_offer = result.scalar_one_or_none()
    
    if existing_offer:
        raise HTTPException(status_code=400, detail="You already have a pending offer on this product")
    
    # Create offer
    offer = Offer(
        product_id=data.product_id,
        buyer_id=user.id,
        seller_id=product.seller_id,
        offer_amount=data.offer_amount,
        message=data.message,
        status="pending"
    )
    
    db.add(offer)
    await db.commit()
    await db.refresh(offer)
    
    # TODO: Send notification to seller
    
    return {
        "success": True,
        "offer_id": offer.id,
        "status": "pending",
        "message": "Offer sent to seller"
    }


@router.post("/negotiate/{offer_id}/respond")
async def respond_to_offer(
    offer_id: int,
    response: NegotiationResponse,
    authorization: Optional[str] = Header(default=None),
    db: AsyncSession = Depends(get_db)
):
    """
    Seller responds to an offer: accept, decline, or counter
    """
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization[len("Bearer "):]
    user = await get_current_user(token, db)
    
    # Get offer
    result = await db.execute(select(Offer).where(Offer.id == offer_id))
    offer = result.scalar_one_or_none()
    
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    if offer.seller_id != user.id:
        raise HTTPException(status_code=403, detail="Not your offer to respond to")
    
    if offer.status != "pending":
        raise HTTPException(status_code=400, detail="Offer already responded to")
    
    # Handle response
    if response.action == "accept":
        offer.status = "accepted"
        # TODO: Send notification to buyer with checkout link
        
    elif response.action == "decline":
        offer.status = "declined"
        # TODO: Send notification to buyer
        
    elif response.action == "counter":
        if not response.counter_amount:
            raise HTTPException(status_code=400, detail="Counter amount required")
        
        offer.status = "countered"
        offer.counter_amount = response.counter_amount
        # TODO: Send notification to buyer
        
    else:
        raise HTTPException(status_code=400, detail="Invalid action")
    
    await db.commit()
    
    return {
        "success": True,
        "offer_id": offer.id,
        "status": offer.status,
        "message": f"Offer {response.action}ed"
    }


@router.get("/negotiate/offers/received")
async def get_received_offers(
    authorization: Optional[str] = Header(default=None),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all offers received (seller view)
    """
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization[len("Bearer "):]
    user = await get_current_user(token, db)
    
    result = await db.execute(
        select(Offer)
        .where(Offer.seller_id == user.id)
        .order_by(Offer.created_at.desc())
    )
    offers = result.scalars().all()
    
    return offers


@router.get("/negotiate/offers/sent")
async def get_sent_offers(
    authorization: Optional[str] = Header(default=None),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all offers sent (buyer view)
    """
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization[len("Bearer "):]
    user = await get_current_user(token, db)
    
    result = await db.execute(
        select(Offer)
        .where(Offer.buyer_id == user.id)
        .order_by(Offer.created_at.desc())
    )
    offers = result.scalars().all()
    
    return offers
