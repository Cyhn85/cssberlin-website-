"""
CSS Berlin Backend API
FastAPI backend for cssberlin.de e-commerce platform
"""

from __future__ import annotations

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta
from typing import Optional
import os

from database import get_db, engine, Base
from models import User, Product, Offer, Message, Order, Shipment, Escrow, Appointment, BundleOffer, SecurityLog
import re
import random
from schemas import (
    UserCreate, UserResponse, UserLogin, Token,
    ProductCreate, ProductResponse, ProductUpdate,
    OfferCreate, OfferResponse, OfferUpdate,
    MessageCreate, MessageResponse,
    ShipmentCreate, ShipmentResponse, ShipmentUpdate
)
from auth import (
    get_password_hash, verify_password,
    create_access_token, get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# Initialize FastAPI app
app = FastAPI(
    title="CSS Berlin API",
    description="Backend API for CSS Berlin - Second-hand Fashion Marketplace",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8080",
        "http://127.0.0.1:5500",
        "https://cssberlin.de",
        "https://www.cssberlin.de",
        "https://css-berlin.pages.dev",
        "https://cssberlin-website.pages.dev"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created successfully")

# Health check
@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "CSS Berlin API",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}


# ============== AUTH ENDPOINTS ==============

@app.post("/api/auth/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new user"""
    from sqlalchemy import select

    # Check if email exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Diese E-Mail-Adresse ist bereits registriert"
        )

    # Create user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        is_verified=False
    )

    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)

    return db_user


@app.post("/api/auth/login", response_model=Token)
async def login(form_data: UserLogin, db: AsyncSession = Depends(get_db)):
    """Login and get access token"""
    from sqlalchemy import select

    # Find user
    result = await db.execute(select(User).where(User.email == form_data.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-Mail oder Passwort ist falsch",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        }
    }


@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return current_user


# ============== PRODUCT ENDPOINTS ==============

@app.get("/api/products")
async def get_products(
    skip: int = 0,
    limit: int = 20,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all products with optional filters"""
    from sqlalchemy import select, or_

    query = select(Product).where(Product.is_active == True)

    if category:
        query = query.where(Product.category == category)
    if brand:
        query = query.where(Product.brand.ilike(f"%{brand}%"))
    if search:
        query = query.where(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.description.ilike(f"%{search}%"),
                Product.brand.ilike(f"%{search}%")
            )
        )

    query = query.order_by(Product.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    products = result.scalars().all()

    return {"products": products, "total": len(products)}


@app.get("/api/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    """Get single product by ID"""
    from sqlalchemy import select

    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(status_code=404, detail="Produkt nicht gefunden")

    return product


@app.post("/api/products", response_model=ProductResponse)
async def create_product(
    product_data: ProductCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new product listing"""
    db_product = Product(
        **product_data.dict(),
        seller_id=current_user.id
    )

    db.add(db_product)
    await db.commit()
    await db.refresh(db_product)

    return db_product


@app.put("/api/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_data: ProductUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a product"""
    from sqlalchemy import select

    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(status_code=404, detail="Produkt nicht gefunden")

    if product.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Nicht berechtigt")

    for key, value in product_data.dict(exclude_unset=True).items():
        setattr(product, key, value)

    await db.commit()
    await db.refresh(product)

    return product


@app.delete("/api/products/{product_id}")
async def delete_product(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a product"""
    from sqlalchemy import select

    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(status_code=404, detail="Produkt nicht gefunden")

    if product.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Nicht berechtigt")

    product.is_active = False
    await db.commit()

    return {"success": True, "message": "Produkt gelöscht"}


# ============== OFFER ENDPOINTS ==============

@app.post("/api/offers", response_model=OfferResponse)
async def create_offer(
    offer_data: OfferCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new price offer"""
    from sqlalchemy import select

    # Get product
    result = await db.execute(select(Product).where(Product.id == offer_data.product_id))
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(status_code=404, detail="Produkt nicht gefunden")

    if product.seller_id == current_user.id:
        raise HTTPException(status_code=400, detail="Sie können nicht für Ihr eigenes Produkt bieten")

    # Create offer
    db_offer = Offer(
        product_id=offer_data.product_id,
        buyer_id=current_user.id,
        seller_id=product.seller_id,
        offer_amount=offer_data.offer_amount,
        message=offer_data.message,
        status="pending",
        expires_at=datetime.utcnow() + timedelta(days=2)
    )

    db.add(db_offer)
    await db.commit()
    await db.refresh(db_offer)

    return db_offer


@app.get("/api/offers")
async def get_user_offers(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all offers for current user (as buyer or seller)"""
    from sqlalchemy import select, or_

    query = select(Offer).where(
        or_(
            Offer.buyer_id == current_user.id,
            Offer.seller_id == current_user.id
        )
    ).order_by(Offer.created_at.desc())

    result = await db.execute(query)
    offers = result.scalars().all()

    # Enrich with product data
    enriched_offers = []
    for offer in offers:
        prod_result = await db.execute(select(Product).where(Product.id == offer.product_id))
        product = prod_result.scalar_one_or_none()

        offer_dict = {
            "id": offer.id,
            "product_id": offer.product_id,
            "product_name": product.name if product else "Unknown",
            "product_price": product.price if product else 0,
            "product_image": product.images[0] if product and product.images else None,
            "buyer_id": offer.buyer_id,
            "seller_id": offer.seller_id,
            "offer_amount": offer.offer_amount,
            "counter_amount": offer.counter_amount,
            "status": offer.status,
            "message": offer.message,
            "created_at": offer.created_at.isoformat(),
            "expires_at": offer.expires_at.isoformat() if offer.expires_at else None
        }
        enriched_offers.append(offer_dict)

    return {"offers": enriched_offers}


@app.put("/api/offers/{offer_id}/accept")
async def accept_offer(
    offer_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Accept an offer"""
    from sqlalchemy import select

    result = await db.execute(select(Offer).where(Offer.id == offer_id))
    offer = result.scalar_one_or_none()

    if not offer:
        raise HTTPException(status_code=404, detail="Angebot nicht gefunden")

    # Check authorization
    if offer.seller_id != current_user.id and offer.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Nicht berechtigt")

    offer.status = "accepted"
    await db.commit()
    await db.refresh(offer)

    # Get product info for response
    prod_result = await db.execute(select(Product).where(Product.id == offer.product_id))
    product = prod_result.scalar_one_or_none()

    return {
        "success": True,
        "message": "Angebot angenommen",
        "offer": {
            "id": offer.id,
            "product_id": offer.product_id,
            "product_name": product.name if product else "Unknown",
            "product_price": product.price if product else 0,
            "product_image": product.images[0] if product and product.images else None,
            "offer_amount": offer.offer_amount,
            "counter_amount": offer.counter_amount,
            "status": offer.status
        }
    }


@app.put("/api/offers/{offer_id}/counter")
async def counter_offer(
    offer_id: int,
    counter_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Send counter offer"""
    from sqlalchemy import select

    result = await db.execute(select(Offer).where(Offer.id == offer_id))
    offer = result.scalar_one_or_none()

    if not offer:
        raise HTTPException(status_code=404, detail="Angebot nicht gefunden")

    if offer.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Nur der Verkäufer kann Gegenangebote machen")

    offer.counter_amount = counter_data.get("counter_amount")
    offer.status = "countered"
    offer.expires_at = datetime.utcnow() + timedelta(days=2)

    await db.commit()

    return {"success": True, "message": "Gegenangebot gesendet"}


@app.put("/api/offers/{offer_id}/decline")
async def decline_offer(
    offer_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Decline an offer"""
    from sqlalchemy import select

    result = await db.execute(select(Offer).where(Offer.id == offer_id))
    offer = result.scalar_one_or_none()

    if not offer:
        raise HTTPException(status_code=404, detail="Angebot nicht gefunden")

    if offer.seller_id != current_user.id and offer.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Nicht berechtigt")

    offer.status = "declined"
    await db.commit()

    return {"success": True, "message": "Angebot abgelehnt"}


# ============== MESSAGE ENDPOINTS ==============

@app.post("/api/messages", response_model=MessageResponse)
async def send_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Send a message"""
    db_message = Message(
        sender_id=current_user.id,
        receiver_id=message_data.receiver_id,
        product_id=message_data.product_id,
        content=message_data.content
    )

    db.add(db_message)
    await db.commit()
    await db.refresh(db_message)

    return db_message


@app.get("/api/messages/{user_id}")
async def get_conversation(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get messages between current user and another user"""
    from sqlalchemy import select, or_, and_

    query = select(Message).where(
        or_(
            and_(Message.sender_id == current_user.id, Message.receiver_id == user_id),
            and_(Message.sender_id == user_id, Message.receiver_id == current_user.id)
        )
    ).order_by(Message.created_at.asc())

    result = await db.execute(query)
    messages = result.scalars().all()

    return {"messages": messages}


# ============== SHIPMENT ENDPOINTS ==============

# Carrier tracking URLs
CARRIER_TRACKING_URLS = {
    "dhl": "https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=",
    "hermes": "https://www.myhermes.de/empfangen/sendungsverfolgung/?tracking=",
    "dpd": "https://tracking.dpd.de/status/de_DE/parcel/",
    "gls": "https://gls-group.eu/DE/de/paketverfolgung?match="
}


@app.post("/api/shipments", response_model=ShipmentResponse)
async def create_shipment(
    shipment_data: ShipmentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create shipment for an order (seller only)"""
    from sqlalchemy import select

    # Get order
    result = await db.execute(select(Order).where(Order.id == shipment_data.order_id))
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(status_code=404, detail="Bestellung nicht gefunden")

    # Get product to verify seller
    prod_result = await db.execute(select(Product).where(Product.id == order.product_id))
    product = prod_result.scalar_one_or_none()

    if not product or product.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Nur der Verkäufer kann den Versand erstellen")

    # Check if shipment already exists
    existing = await db.execute(select(Shipment).where(Shipment.order_id == order.id))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Versand existiert bereits für diese Bestellung")

    # Create shipment
    db_shipment = Shipment(
        order_id=order.id,
        seller_id=current_user.id,
        buyer_id=order.buyer_id,
        carrier=shipment_data.carrier.lower(),
        tracking_number=shipment_data.tracking_number,
        weight_kg=shipment_data.weight_kg,
        package_size=shipment_data.package_size,
        status="pending",
        tracking_history=[{
            "status": "pending",
            "location": "Berlin",
            "timestamp": datetime.utcnow().isoformat(),
            "description": "Versandetikett erstellt"
        }]
    )

    db.add(db_shipment)

    # Update order status
    order.status = "shipped"

    await db.commit()
    await db.refresh(db_shipment)

    return db_shipment


@app.get("/api/shipments")
async def get_user_shipments(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all shipments for current user (as buyer or seller)"""
    from sqlalchemy import select, or_

    query = select(Shipment).where(
        or_(
            Shipment.buyer_id == current_user.id,
            Shipment.seller_id == current_user.id
        )
    ).order_by(Shipment.created_at.desc())

    result = await db.execute(query)
    shipments = result.scalars().all()

    # Enrich with product and order data
    enriched_shipments = []
    for shipment in shipments:
        # Get order
        order_result = await db.execute(select(Order).where(Order.id == shipment.order_id))
        order = order_result.scalar_one_or_none()

        # Get product
        product = None
        if order:
            prod_result = await db.execute(select(Product).where(Product.id == order.product_id))
            product = prod_result.scalar_one_or_none()

        # Get buyer info
        buyer_result = await db.execute(select(User).where(User.id == shipment.buyer_id))
        buyer = buyer_result.scalar_one_or_none()

        # Get seller info
        seller_result = await db.execute(select(User).where(User.id == shipment.seller_id))
        seller = seller_result.scalar_one_or_none()

        shipment_dict = {
            "id": shipment.id,
            "order_id": shipment.order_id,
            "carrier": shipment.carrier,
            "tracking_number": shipment.tracking_number,
            "tracking_url": f"{CARRIER_TRACKING_URLS.get(shipment.carrier, '')}{shipment.tracking_number or ''}",
            "status": shipment.status,
            "shipped_at": shipment.shipped_at.isoformat() if shipment.shipped_at else None,
            "delivered_at": shipment.delivered_at.isoformat() if shipment.delivered_at else None,
            "estimated_delivery": shipment.estimated_delivery.isoformat() if shipment.estimated_delivery else None,
            "last_location": shipment.last_location,
            "tracking_history": shipment.tracking_history or [],
            "created_at": shipment.created_at.isoformat(),

            # Product info
            "product_name": product.name if product else "Unknown",
            "product_image": product.images[0] if product and product.images else None,
            "product_price": order.total_amount if order else 0,

            # User info
            "seller_name": f"{seller.first_name} {seller.last_name}" if seller else "Unknown",
            "buyer_name": f"{buyer.first_name} {buyer.last_name}" if buyer else "Unknown",
            "is_seller": shipment.seller_id == current_user.id,

            # Address
            "shipping_address": order.shipping_address if order else None
        }
        enriched_shipments.append(shipment_dict)

    return {"shipments": enriched_shipments}


@app.get("/api/shipments/{shipment_id}")
async def get_shipment(
    shipment_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get single shipment details"""
    from sqlalchemy import select

    result = await db.execute(select(Shipment).where(Shipment.id == shipment_id))
    shipment = result.scalar_one_or_none()

    if not shipment:
        raise HTTPException(status_code=404, detail="Versand nicht gefunden")

    # Check authorization
    if shipment.buyer_id != current_user.id and shipment.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Nicht berechtigt")

    # Get order
    order_result = await db.execute(select(Order).where(Order.id == shipment.order_id))
    order = order_result.scalar_one_or_none()

    # Get product
    product = None
    if order:
        prod_result = await db.execute(select(Product).where(Product.id == order.product_id))
        product = prod_result.scalar_one_or_none()

    # Get users
    buyer_result = await db.execute(select(User).where(User.id == shipment.buyer_id))
    buyer = buyer_result.scalar_one_or_none()

    seller_result = await db.execute(select(User).where(User.id == shipment.seller_id))
    seller = seller_result.scalar_one_or_none()

    return {
        "id": shipment.id,
        "order_id": shipment.order_id,
        "carrier": shipment.carrier,
        "tracking_number": shipment.tracking_number,
        "tracking_url": f"{CARRIER_TRACKING_URLS.get(shipment.carrier, '')}{shipment.tracking_number or ''}",
        "status": shipment.status,
        "shipped_at": shipment.shipped_at.isoformat() if shipment.shipped_at else None,
        "in_transit_at": shipment.in_transit_at.isoformat() if shipment.in_transit_at else None,
        "out_for_delivery_at": shipment.out_for_delivery_at.isoformat() if shipment.out_for_delivery_at else None,
        "delivered_at": shipment.delivered_at.isoformat() if shipment.delivered_at else None,
        "estimated_delivery": shipment.estimated_delivery.isoformat() if shipment.estimated_delivery else None,
        "last_location": shipment.last_location,
        "tracking_history": shipment.tracking_history or [],
        "weight_kg": shipment.weight_kg,
        "package_size": shipment.package_size,
        "created_at": shipment.created_at.isoformat(),

        "product_name": product.name if product else "Unknown",
        "product_image": product.images[0] if product and product.images else None,
        "product_price": order.total_amount if order else 0,

        "seller_name": f"{seller.first_name} {seller.last_name}" if seller else "Unknown",
        "buyer_name": f"{buyer.first_name} {buyer.last_name}" if buyer else "Unknown",
        "is_seller": shipment.seller_id == current_user.id,

        "shipping_address": order.shipping_address if order else None
    }


@app.put("/api/shipments/{shipment_id}")
async def update_shipment(
    shipment_id: int,
    update_data: ShipmentUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update shipment (add tracking number, update status)"""
    from sqlalchemy import select

    result = await db.execute(select(Shipment).where(Shipment.id == shipment_id))
    shipment = result.scalar_one_or_none()

    if not shipment:
        raise HTTPException(status_code=404, detail="Versand nicht gefunden")

    if shipment.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Nur der Verkäufer kann den Versand aktualisieren")

    # Update fields
    if update_data.tracking_number:
        shipment.tracking_number = update_data.tracking_number

    if update_data.status:
        old_status = shipment.status
        shipment.status = update_data.status

        # Update timestamp based on status
        now = datetime.utcnow()
        if update_data.status == "shipped" and not shipment.shipped_at:
            shipment.shipped_at = now
        elif update_data.status == "in_transit" and not shipment.in_transit_at:
            shipment.in_transit_at = now
        elif update_data.status == "out_for_delivery" and not shipment.out_for_delivery_at:
            shipment.out_for_delivery_at = now
        elif update_data.status == "delivered" and not shipment.delivered_at:
            shipment.delivered_at = now

        # Add to tracking history
        history = shipment.tracking_history or []
        history.append({
            "status": update_data.status,
            "location": update_data.last_location or shipment.last_location or "Berlin",
            "timestamp": now.isoformat(),
            "description": f"Status geändert: {old_status} → {update_data.status}"
        })
        shipment.tracking_history = history

    if update_data.last_location:
        shipment.last_location = update_data.last_location

    if update_data.estimated_delivery:
        shipment.estimated_delivery = update_data.estimated_delivery

    await db.commit()
    await db.refresh(shipment)

    return {
        "success": True,
        "message": "Versand aktualisiert",
        "shipment": {
            "id": shipment.id,
            "status": shipment.status,
            "tracking_number": shipment.tracking_number,
            "tracking_url": f"{CARRIER_TRACKING_URLS.get(shipment.carrier, '')}{shipment.tracking_number or ''}"
        }
    }


@app.get("/api/shipments/track/{tracking_number}")
async def track_shipment_public(tracking_number: str, db: AsyncSession = Depends(get_db)):
    """Public tracking endpoint - no auth required"""
    from sqlalchemy import select

    result = await db.execute(
        select(Shipment).where(Shipment.tracking_number == tracking_number)
    )
    shipment = result.scalar_one_or_none()

    if not shipment:
        raise HTTPException(status_code=404, detail="Sendung nicht gefunden")

    # Get order for product info
    order_result = await db.execute(select(Order).where(Order.id == shipment.order_id))
    order = order_result.scalar_one_or_none()

    product = None
    if order:
        prod_result = await db.execute(select(Product).where(Product.id == order.product_id))
        product = prod_result.scalar_one_or_none()

    return {
        "tracking_number": shipment.tracking_number,
        "carrier": shipment.carrier,
        "tracking_url": f"{CARRIER_TRACKING_URLS.get(shipment.carrier, '')}{shipment.tracking_number or ''}",
        "status": shipment.status,
        "shipped_at": shipment.shipped_at.isoformat() if shipment.shipped_at else None,
        "delivered_at": shipment.delivered_at.isoformat() if shipment.delivered_at else None,
        "estimated_delivery": shipment.estimated_delivery.isoformat() if shipment.estimated_delivery else None,
        "last_location": shipment.last_location,
        "tracking_history": shipment.tracking_history or [],
        "product_name": product.name if product else "Paket"
    }


@app.get("/api/carriers")
async def get_carriers():
    """Get available carriers and their info"""
    return {
        "carriers": [
            {
                "id": "dhl",
                "name": "DHL",
                "logo": "https://www.dhl.de/static/de/images/dhl-logo.svg",
                "tracking_url_base": CARRIER_TRACKING_URLS["dhl"],
                "estimated_days": "1-3"
            },
            {
                "id": "hermes",
                "name": "Hermes",
                "logo": "https://www.myhermes.de/assets/hermes-logo.svg",
                "tracking_url_base": CARRIER_TRACKING_URLS["hermes"],
                "estimated_days": "2-4"
            },
            {
                "id": "dpd",
                "name": "DPD",
                "logo": "https://www.dpd.com/de/de/logo/",
                "tracking_url_base": CARRIER_TRACKING_URLS["dpd"],
                "estimated_days": "1-3"
            },
            {
                "id": "gls",
                "name": "GLS",
                "logo": "https://gls-group.eu/logo.svg",
                "tracking_url_base": CARRIER_TRACKING_URLS["gls"],
                "estimated_days": "1-3"
            }
        ]
    }


# ============== FAVORITES ENDPOINTS ==============

@app.post("/api/favorites/{product_id}")
async def add_to_favorites(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Add product to user's favorites"""
    from sqlalchemy import select, and_
    from models import Favorite

    # Check if product exists
    product = await db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Produkt nicht gefunden")

    # Check if already in favorites
    result = await db.execute(
        select(Favorite).where(
            and_(Favorite.user_id == current_user.id, Favorite.product_id == product_id)
        )
    )
    existing = result.scalar_one_or_none()

    if existing:
        return {"message": "Bereits in Favoriten", "favorite_id": existing.id}

    # Add to favorites
    favorite = Favorite(user_id=current_user.id, product_id=product_id)
    db.add(favorite)
    await db.commit()
    await db.refresh(favorite)

    return {"message": "Zu Favoriten hinzugefügt", "favorite_id": favorite.id}


@app.delete("/api/favorites/{product_id}")
async def remove_from_favorites(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Remove product from user's favorites"""
    from sqlalchemy import select, and_, delete
    from models import Favorite

    result = await db.execute(
        delete(Favorite).where(
            and_(Favorite.user_id == current_user.id, Favorite.product_id == product_id)
        )
    )
    await db.commit()

    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Nicht in Favoriten gefunden")

    return {"message": "Aus Favoriten entfernt"}


@app.get("/api/favorites")
async def get_favorites(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's favorite products"""
    from sqlalchemy import select
    from models import Favorite

    result = await db.execute(
        select(Favorite).where(Favorite.user_id == current_user.id).order_by(Favorite.created_at.desc())
    )
    favorites = result.scalars().all()

    # Get product details for each favorite
    favorite_products = []
    for fav in favorites:
        product = await db.get(Product, fav.product_id)
        if product and product.is_active and not product.is_sold:
            favorite_products.append({
                "id": product.id,
                "name": product.name,
                "price": product.price,
                "brand": product.brand,
                "category": product.category,
                "condition": product.condition,
                "size": product.size,
                "images": product.images,
                "favorited_at": fav.created_at.isoformat() if fav.created_at else None
            })

    return {"favorites": favorite_products, "count": len(favorite_products)}


@app.get("/api/favorites/check/{product_id}")
async def check_favorite(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Check if product is in user's favorites"""
    from sqlalchemy import select, and_
    from models import Favorite

    result = await db.execute(
        select(Favorite).where(
            and_(Favorite.user_id == current_user.id, Favorite.product_id == product_id)
        )
    )
    favorite = result.scalar_one_or_none()

    return {"is_favorite": favorite is not None}


# ============================================================================
# ESCROW SİSTEMİ - 1€ HİZMET BEDELİ
# ============================================================================

SERVICE_FEE = 1.00  # Sabit 1€ hizmet bedeli
MIN_OFFER_PERCENT = 50  # Minimum teklif yüzdesi

# Anti-bypass regex patterns
PHONE_PATTERNS = [
    r'(\+?\d{1,4}[\s.-]?)?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}',
    r'\b0\d{3,4}[\s.-]?\d{6,8}\b',
    r'\b\+49[\s.-]?\d{3,4}[\s.-]?\d{6,8}\b',
    r'\b01[567]\d[\s.-]?\d{7,8}\b',
]

LINK_PATTERNS = [
    r'https?://[^\s]+',
    r'www\.[^\s]+',
    r'[a-zA-Z0-9.-]+\.(com|de|net|org|io|app|xyz)[^\s]*',
    r'wa\.me/\d+',
    r't\.me/[^\s]+',
]


def generate_pin():
    """4 haneli PIN oluştur"""
    return str(random.randint(1000, 9999))


def generate_code(prefix: str):
    """Benzersiz kod oluştur (ESC_, APT_, BND_)"""
    import time
    return f"{prefix}{int(time.time())}_{random.randint(1000, 9999)}"


@app.post("/api/escrow/create")
async def create_escrow(
    escrow_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Yeni escrow işlemi oluştur"""
    from sqlalchemy import select

    product_id = escrow_data.get("product_id")
    transaction_type = escrow_data.get("type", "online")  # online veya abholung

    # Ürünü bul
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(status_code=404, detail="Produkt nicht gefunden")

    if product.seller_id == current_user.id:
        raise HTTPException(status_code=400, detail="Sie können nicht Ihr eigenes Produkt kaufen")

    # Escrow oluştur
    escrow = Escrow(
        escrow_code=generate_code("ESC_"),
        buyer_id=current_user.id,
        seller_id=product.seller_id,
        product_id=product_id,
        product_price=product.price,
        service_fee=SERVICE_FEE,
        total_amount=product.price + SERVICE_FEE,
        transaction_type=transaction_type,
        status="pending",
        confirmation_pin=generate_pin(),
        expires_at=datetime.utcnow() + timedelta(hours=24)
    )

    db.add(escrow)
    await db.commit()
    await db.refresh(escrow)

    return {
        "success": True,
        "escrow": {
            "id": escrow.id,
            "code": escrow.escrow_code,
            "product_price": escrow.product_price,
            "service_fee": escrow.service_fee,
            "total_amount": escrow.total_amount,
            "type": escrow.transaction_type,
            "expires_at": escrow.expires_at.isoformat()
        }
    }


@app.post("/api/escrow/{escrow_id}/pay")
async def pay_escrow(
    escrow_id: int,
    payment_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Escrow ödemesi yap"""
    from sqlalchemy import select

    result = await db.execute(select(Escrow).where(Escrow.id == escrow_id))
    escrow = result.scalar_one_or_none()

    if not escrow:
        raise HTTPException(status_code=404, detail="Escrow nicht gefunden")

    if escrow.buyer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Nicht berechtigt")

    if escrow.status != "pending":
        raise HTTPException(status_code=400, detail="Escrow kann nicht bezahlt werden")

    # Ödemeyi işle (gerçek ödeme entegrasyonu burada yapılacak)
    escrow.status = "paid"
    escrow.payment_method = payment_data.get("method", "card")
    escrow.paid_at = datetime.utcnow()

    await db.commit()

    # Abholung ise konum bilgisini hazırla
    location_data = None
    if escrow.transaction_type == "abholung":
        # Satıcı bilgilerini al
        seller_result = await db.execute(select(User).where(User.id == escrow.seller_id))
        seller = seller_result.scalar_one_or_none()

        location_data = {
            "revealed": True,
            "pin": escrow.confirmation_pin,
            "seller_name": f"{seller.first_name} {seller.last_name}" if seller else "Verkäufer"
        }

    return {
        "success": True,
        "message": "Zahlung erfolgreich",
        "escrow": {
            "id": escrow.id,
            "status": escrow.status,
            "pin": escrow.confirmation_pin if escrow.transaction_type == "abholung" else None
        },
        "location": location_data
    }


@app.post("/api/escrow/{escrow_id}/confirm")
async def confirm_escrow(
    escrow_id: int,
    confirm_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """PIN ile escrow onayla (buluşma sonrası)"""
    from sqlalchemy import select

    result = await db.execute(select(Escrow).where(Escrow.id == escrow_id))
    escrow = result.scalar_one_or_none()

    if not escrow:
        raise HTTPException(status_code=404, detail="Escrow nicht gefunden")

    # Satıcı veya alıcı onaylayabilir
    if escrow.buyer_id != current_user.id and escrow.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Nicht berechtigt")

    if escrow.status != "paid":
        raise HTTPException(status_code=400, detail="Escrow muss zuerst bezahlt werden")

    entered_pin = confirm_data.get("pin", "")
    if escrow.confirmation_pin != entered_pin:
        raise HTTPException(status_code=400, detail="Falscher PIN-Code")

    escrow.status = "confirmed"
    escrow.confirmed_at = datetime.utcnow()

    await db.commit()

    return {
        "success": True,
        "message": "Transaktion bestätigt",
        "platform_fee": SERVICE_FEE,
        "seller_amount": escrow.product_price
    }


# ============================================================================
# RANDEVU SİSTEMİ
# ============================================================================

@app.post("/api/appointments/create")
async def create_appointment(
    appointment_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Yeni randevu oluştur"""
    from sqlalchemy import select

    product_id = appointment_data.get("product_id")
    appointment_date = appointment_data.get("date")
    appointment_time = appointment_data.get("time")

    # Ürünü bul
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(status_code=404, detail="Produkt nicht gefunden")

    # Randevu oluştur
    appointment = Appointment(
        appointment_code=generate_code("APT_"),
        buyer_id=current_user.id,
        seller_id=product.seller_id,
        product_id=product_id,
        appointment_date=datetime.fromisoformat(appointment_date),
        appointment_time=appointment_time,
        status="pending_payment"
    )

    db.add(appointment)
    await db.commit()
    await db.refresh(appointment)

    return {
        "success": True,
        "appointment": {
            "id": appointment.id,
            "code": appointment.appointment_code,
            "date": appointment.appointment_date.isoformat(),
            "time": appointment.appointment_time,
            "status": appointment.status,
            "fee_required": SERVICE_FEE
        }
    }


@app.get("/api/appointments")
async def get_user_appointments(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Kullanıcının randevularını getir"""
    from sqlalchemy import select, or_

    result = await db.execute(
        select(Appointment).where(
            or_(
                Appointment.buyer_id == current_user.id,
                Appointment.seller_id == current_user.id
            )
        ).order_by(Appointment.appointment_date.desc())
    )
    appointments = result.scalars().all()

    enriched = []
    for apt in appointments:
        # Ürün bilgisi
        prod_result = await db.execute(select(Product).where(Product.id == apt.product_id))
        product = prod_result.scalar_one_or_none()

        enriched.append({
            "id": apt.id,
            "code": apt.appointment_code,
            "product_name": product.name if product else "Unknown",
            "product_image": product.images[0] if product and product.images else None,
            "date": apt.appointment_date.isoformat(),
            "time": apt.appointment_time,
            "status": apt.status,
            "location_revealed": apt.location_revealed,
            "location_address": apt.location_address if apt.location_revealed else None,
            "is_buyer": apt.buyer_id == current_user.id
        })

    return {"appointments": enriched}


# ============================================================================
# TEKLİF DOĞRULAMA (%50 KURALI)
# ============================================================================

@app.post("/api/offers/validate")
async def validate_offer(
    offer_data: dict,
    db: AsyncSession = Depends(get_db)
):
    """Teklif tutarını doğrula (%50 kuralı)"""
    offer_amount = float(offer_data.get("offer_amount", 0))
    original_price = float(offer_data.get("original_price", 0))

    if original_price <= 0:
        raise HTTPException(status_code=400, detail="Ungültiger Originalpreis")

    min_offer = original_price * (MIN_OFFER_PERCENT / 100)

    if offer_amount < min_offer:
        return {
            "valid": False,
            "min_amount": min_offer,
            "message": f"Dieses Angebot ist nicht fair! Mindestangebot: €{min_offer:.2f}"
        }

    discount = ((original_price - offer_amount) / original_price) * 100

    return {
        "valid": True,
        "offer_amount": offer_amount,
        "discount_percent": round(discount, 1),
        "message": "Angebot ist gültig"
    }


@app.post("/api/bundle-offers/create")
async def create_bundle_offer(
    bundle_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Bundle (çoklu ürün) teklifi oluştur"""
    from sqlalchemy import select

    product_ids = bundle_data.get("product_ids", [])
    offer_amount = float(bundle_data.get("offer_amount", 0))

    if len(product_ids) < 2:
        raise HTTPException(status_code=400, detail="Mindestens 2 Produkte für Bundle erforderlich")

    # Ürünleri bul ve toplam fiyatı hesapla
    total_price = 0
    seller_id = None

    for pid in product_ids:
        result = await db.execute(select(Product).where(Product.id == pid))
        product = result.scalar_one_or_none()

        if not product:
            raise HTTPException(status_code=404, detail=f"Produkt {pid} nicht gefunden")

        if seller_id is None:
            seller_id = product.seller_id
        elif seller_id != product.seller_id:
            raise HTTPException(status_code=400, detail="Alle Produkte müssen vom selben Verkäufer sein")

        total_price += product.price

    # %50 kuralını kontrol et
    min_offer = total_price * (MIN_OFFER_PERCENT / 100)

    if offer_amount < min_offer:
        raise HTTPException(
            status_code=400,
            detail=f"Dieses Angebot ist nicht fair! Mindestangebot: €{min_offer:.2f}"
        )

    # Bundle teklifi oluştur
    bundle = BundleOffer(
        bundle_code=generate_code("BND_"),
        buyer_id=current_user.id,
        seller_id=seller_id,
        product_ids=product_ids,
        product_count=len(product_ids),
        original_total=total_price,
        offer_amount=offer_amount,
        min_offer_amount=min_offer,
        discount_percent=((total_price - offer_amount) / total_price) * 100,
        status="pending",
        message=bundle_data.get("message", ""),
        expires_at=datetime.utcnow() + timedelta(days=2)
    )

    db.add(bundle)
    await db.commit()
    await db.refresh(bundle)

    return {
        "success": True,
        "bundle": {
            "id": bundle.id,
            "code": bundle.bundle_code,
            "product_count": bundle.product_count,
            "original_total": bundle.original_total,
            "offer_amount": bundle.offer_amount,
            "discount_percent": round(bundle.discount_percent, 1),
            "status": bundle.status
        }
    }


# ============================================================================
# ANTİ-BYPASS GÜVENLİK
# ============================================================================

@app.post("/api/security/scan-message")
async def scan_message(
    message_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Mesajı telefon/link için tara"""
    message = message_data.get("message", "")
    context = message_data.get("context", "chat")

    detected = []

    # Telefon kontrolü
    for pattern in PHONE_PATTERNS:
        matches = re.findall(pattern, message)
        for match in matches:
            if isinstance(match, tuple):
                match = ''.join(match)
            # En az 8 rakam içermeli
            digits = re.sub(r'\D', '', match)
            if len(digits) >= 8:
                detected.append({
                    "type": "phone",
                    "value": match
                })

    # Link kontrolü
    for pattern in LINK_PATTERNS:
        matches = re.findall(pattern, message, re.IGNORECASE)
        for match in matches:
            detected.append({
                "type": "link",
                "value": match
            })

    if detected:
        # Güvenlik logu kaydet
        log = SecurityLog(
            user_id=current_user.id,
            log_type="bypass_attempt",
            detected_content=str(detected),
            original_message=message[:500],  # Max 500 karakter
            context=context
        )
        db.add(log)
        await db.commit()

        return {
            "detected": True,
            "items": detected,
            "warning": "Für Ihre Sicherheit sollten Sie den Termin über das System für 1€ erstellen."
        }

    return {"detected": False}


# ============================================================================
# CHECKOUT HESAPLAMA
# ============================================================================

@app.post("/api/checkout/calculate")
async def calculate_checkout(
    checkout_data: dict,
    db: AsyncSession = Depends(get_db)
):
    """Checkout toplam hesaplama"""
    from sqlalchemy import select

    product_ids = checkout_data.get("product_ids", [])
    delivery_type = checkout_data.get("delivery_type", "shipping")

    subtotal = 0
    for pid in product_ids:
        result = await db.execute(select(Product).where(Product.id == pid))
        product = result.scalar_one_or_none()
        if product:
            # Teklif fiyatı varsa onu kullan
            offer_price = checkout_data.get(f"offer_price_{pid}")
            subtotal += offer_price if offer_price else product.price

    shipping_cost = 4.99 if delivery_type == "shipping" else 0  # DHL/Hermes

    return {
        "subtotal": subtotal,
        "service_fee": SERVICE_FEE,
        "shipping": shipping_cost,
        "total": subtotal + SERVICE_FEE + shipping_cost,
        "breakdown": {
            "items": len(product_ids),
            "delivery": delivery_type
        }
    }


# ============================================================================
# GOOGLE OAUTH ENDPOINTS
# ============================================================================

@app.post("/api/auth/google", response_model=Token)
async def google_oauth(
    token: dict,
    db: AsyncSession = Depends(get_db)
):
    """
    Google OAuth login
    Frontend sends Google token, backend verifies and creates/logs in user
    """
    try:
        from google.oauth2 import id_token
        from google.auth.transport import requests as google_requests

        # Verify Google token
        GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")

        if not GOOGLE_CLIENT_ID:
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail="Google OAuth ist derzeit nicht konfiguriert"
            )

        idinfo = id_token.verify_oauth2_token(
            token.get("credential"),
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )

        # Get user info from Google
        email = idinfo.get("email")
        name = idinfo.get("name", "")

        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Keine E-Mail von Google erhalten"
            )

        # Check if user exists
        from sqlalchemy import select
        result = await db.execute(
            select(User).where(User.email == email)
        )
        user = result.scalar_one_or_none()

        # Create new user if doesn't exist
        if not user:
            user = User(
                email=email,
                username=name or email.split("@")[0],
                password_hash=get_password_hash(os.urandom(32).hex()),  # Random password
                is_verified=True  # Google emails are verified
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)

        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email},
            expires_delta=access_token_expires
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username
            }
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Ungültiges Google-Token: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Google OAuth-Fehler: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
