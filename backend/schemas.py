"""
Pydantic schemas for request/response validation
"""

from __future__ import annotations

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ============== USER SCHEMAS ==============

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserInToken(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserInToken


# ============== PRODUCT SCHEMAS ==============

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    brand: Optional[str] = None
    category: str
    subcategory: Optional[str] = None
    condition: str
    size: Optional[str] = None
    color: Optional[str] = None
    images: Optional[List[str]] = []


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    brand: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    condition: Optional[str] = None
    size: Optional[str] = None
    color: Optional[str] = None
    images: Optional[List[str]] = None
    is_active: Optional[bool] = None


class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    brand: Optional[str]
    category: str
    subcategory: Optional[str]
    condition: str
    size: Optional[str]
    color: Optional[str]
    images: List[str]
    seller_id: int
    is_active: bool
    is_sold: bool
    views: int
    created_at: datetime

    class Config:
        from_attributes = True


# ============== OFFER SCHEMAS ==============

class OfferCreate(BaseModel):
    product_id: int
    offer_amount: float
    message: Optional[str] = None


class OfferUpdate(BaseModel):
    counter_amount: Optional[float] = None
    status: Optional[str] = None


class OfferResponse(BaseModel):
    id: int
    product_id: int
    buyer_id: int
    seller_id: int
    offer_amount: float
    counter_amount: Optional[float]
    status: str
    message: Optional[str]
    created_at: datetime
    expires_at: Optional[datetime]

    class Config:
        from_attributes = True


# ============== MESSAGE SCHEMAS ==============

class MessageCreate(BaseModel):
    receiver_id: int
    product_id: Optional[int] = None
    content: str


class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    product_id: Optional[int]
    content: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ============== SHIPMENT SCHEMAS ==============

class ShipmentCreate(BaseModel):
    order_id: int
    carrier: str  # dhl, hermes, dpd, gls
    tracking_number: Optional[str] = None
    weight_kg: Optional[float] = None
    package_size: Optional[str] = None  # S, M, L, XL


class ShipmentUpdate(BaseModel):
    tracking_number: Optional[str] = None
    status: Optional[str] = None
    last_location: Optional[str] = None
    estimated_delivery: Optional[datetime] = None


class TrackingEvent(BaseModel):
    status: str
    location: str
    timestamp: datetime
    description: Optional[str] = None


class ShipmentResponse(BaseModel):
    id: int
    order_id: int
    seller_id: int
    buyer_id: int
    carrier: str
    tracking_number: Optional[str]
    status: str
    shipped_at: Optional[datetime]
    in_transit_at: Optional[datetime]
    out_for_delivery_at: Optional[datetime]
    delivered_at: Optional[datetime]
    estimated_delivery: Optional[datetime]
    last_location: Optional[str]
    tracking_history: List[dict]
    weight_kg: Optional[float]
    package_size: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ShipmentDetailResponse(BaseModel):
    """Extended shipment info with product and user details"""
    id: int
    order_id: int
    carrier: str
    tracking_number: Optional[str]
    status: str
    estimated_delivery: Optional[datetime]
    last_location: Optional[str]
    tracking_history: List[dict]
    shipped_at: Optional[datetime]
    delivered_at: Optional[datetime]
    created_at: datetime

    # Product info
    product_name: str
    product_image: Optional[str]
    product_price: float

    # User info
    seller_name: str
    buyer_name: str

    # Shipping address
    shipping_address: Optional[dict]

    class Config:
        from_attributes = True
