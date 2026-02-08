"""
SQLAlchemy models for CSS Berlin database (C2C Marketplace Germanized)
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON, UniqueConstraint, Enum as SAGEnum
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
import enum

# Enums for better structure
class ProductStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    RESERVED = "reserved"
    SOLD = "sold"
    HIDDEN = "hidden"

class EscrowStatus(str, enum.Enum):
    HELD = "HELD"
    RELEASED = "RELEASED"
    DISPUTED = "DISPUTED"

class KYCStatus(str, enum.Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # OAuth / Clerk fields
    oauth_provider = Column(String(50))  # google, apple, clerk, etc.
    clerk_id = Column(String(255), unique=True, index=True, nullable=True) # Clerk integration
    profile_picture = Column(String(500))
    
    # Germanized / Compliance Fields
    kyc_status = Column(String(50), default="pending") # KYCStatus
    is_seller_pro = Column(Boolean, default=False) # Gewerblicher Verkäufer
    tax_id = Column(String(50), nullable=True) # DAC7 Steuer-ID
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Member incentives
    member_discount_active = Column(Boolean, default=True)
    member_discount_granted_at = Column(DateTime)
    
    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    cart = relationship("Cart", back_populates="user", uselist=False, cascade="all, delete-orphan")
    
    products = relationship("Product", back_populates="seller")
    sent_messages = relationship("Message", foreign_keys="Message.sender_id", back_populates="sender")
    received_messages = relationship("Message", foreign_keys="Message.receiver_id", back_populates="receiver")
    favorites = relationship("Favorite", back_populates="user")
    coupon_redemptions = relationship("CouponRedemption", back_populates="user")
    orders_bought = relationship("Order", foreign_keys="Order.buyer_id", back_populates="buyer")
    orders_sold = relationship("Order", foreign_keys="Order.seller_id", back_populates="seller")


class UserProfile(Base):
    __tablename__ = "user_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Metric & Stats
    avg_response_time = Column(Float, default=0.0) # In minutes
    sustainability_score = Column(Integer, default=0) # CO2 savings score
    vacation_mode = Column(Boolean, default=False)
    
    # Social / Trust
    bio = Column(Text, nullable=True)
    followers_count = Column(Integer, default=0)
    following_count = Column(Integer, default=0)
    reputation_score = Column(Float, default=5.0) # 0-5 stars
    
    last_seen = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="profile")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)
    
    # Classification
    brand = Column(String(100))
    category = Column(String(100), nullable=False)
    subcategory = Column(String(100))
    condition = Column(String(50), nullable=False)
    size = Column(String(50))
    color = Column(String(50))
    
    # Advanced Attributes (JSONB equivalent for SQLite/PG)
    attributes = Column(JSON, default=dict) # {"material": "cotton", "fit": "slim", "season": "summer"}
    
    # Status & Visibility
    status = Column(String(50), default="active") # Use ProductStatus enum values
    is_active = Column(Boolean, default=True) # Legacy support (synced with status)
    is_sold = Column(Boolean, default=False)  # Legacy support
    is_featured = Column(Boolean, default=False)
    featured_until = Column(DateTime, nullable=True)
    
    # Listing Info
    images = Column(JSON, default=list)
    views = Column(Integer, default=0)
    likes_count = Column(Integer, default=0)
    search_vector = Column(Text, nullable=True) # For full-text search simulation
    
    # Sustainability
    eco_impact = Column(Float, default=0.0) # Saved CO2 in kg
    water_saved = Column(Float, default=0.0) # Saved liters

    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    seller = relationship("User", back_populates="products")
    offers = relationship("Offer", back_populates="product")
    cart_items = relationship("CartItem", back_populates="product")
    favorites = relationship("Favorite", back_populates="product")


class Cart(Base):
    __tablename__ = "carts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="cart")
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")


class CartItem(Base):
    __tablename__ = "cart_items"
    
    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey("carts.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, default=1)
    added_at = Column(DateTime, default=datetime.utcnow)
    
    cart = relationship("Cart", back_populates="items")
    product = relationship("Product", back_populates="cart_items")


class Offer(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    offer_amount = Column(Float, nullable=False)
    counter_amount = Column(Float)
    
    # State Machine: OFFER_CREATED -> ACCEPTED -> REJECTED -> EXPIRED
    status = Column(String(50), default="pending") 
    
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)

    # Relationships
    product = relationship("Product", back_populates="offers")
    buyer = relationship("User", foreign_keys=[buyer_id])
    seller = relationship("User", foreign_keys=[seller_id])


class OfferNotification(Base):
    __tablename__ = "offer_notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    offer_id = Column(Integer, ForeignKey("offers.id"), nullable=False)
    
    # new_offer, offer_accepted, offer_declined, counter_offer
    type = Column(String(50), nullable=False) 
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"))
    
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    
    # Action Cards
    type = Column(String(50), default="text") # text, image, offer_action, system
    metadata_json = Column(JSON, nullable=True) # For offer details inside chat
    
    created_at = Column(DateTime, default=datetime.utcnow)

    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_messages")


class Order(Base):
    """
    Germanized Order Model with fees separation
    """
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, nullable=False, index=True)
    
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    offer_id = Column(Integer, ForeignKey("offers.id"))
    
    # Financials
    product_price = Column(Float, nullable=False)
    shipping_cost = Column(Float, default=0.00)
    
    # Fees (Separated for Tax)
    platform_fee = Column(Float, default=0.00) # CSS commission
    buyer_protection_fee = Column(Float, default=0.00) # Insurance fee
    
    total_amount = Column(Float, nullable=False)
    
    # Escrow
    escrow_status = Column(String(50), default="HELD") # HELD, RELEASED, DISPUTED, REFUNDED
    
    # Shipping & Payment
    shipping_address = Column(JSON)
    shipping_method = Column(String(50))
    payment_status = Column(String(30), default="pending")
    payment_method = Column(String(50))
    stripe_session_id = Column(String(255))
    
    # Order Lifecycle
    status = Column(String(50), default="pending_payment", index=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    paid_at = Column(DateTime)
    shipped_at = Column(DateTime)
    completed_at = Column(DateTime)
    cancelled_at = Column(DateTime)

    buyer = relationship("User", foreign_keys=[buyer_id], back_populates="orders_bought")
    seller = relationship("User", foreign_keys=[seller_id], back_populates="orders_sold")
    product = relationship("Product")
    offer = relationship("Offer")
    shipment = relationship("Shipment", back_populates="order", uselist=False)


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="favorites")
    product = relationship("Product", back_populates="favorites")


class Shipment(Base):
    __tablename__ = "shipments"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    tracking_number = Column(String(100))
    carrier = Column(String(50)) # DHL, Hermes
    status = Column(String(50), default="label_created")
    label_url = Column(String(500)) # URL to PDF label
    created_at = Column(DateTime, default=datetime.utcnow)
    
    order = relationship("Order", back_populates="shipment")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="EUR")
    method = Column(String(50), nullable=False)
    status = Column(String(30), default="pending")
    provider_reference = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)


class Coupon(Base):
    __tablename__ = "coupons"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True)
    discount_amount = Column(Float)
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime)


class CouponRedemption(Base):
    __tablename__ = "coupon_redemptions"
    id = Column(Integer, primary_key=True, index=True)
    coupon_id = Column(Integer, ForeignKey("coupons.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    redeemed_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="coupon_redemptions")
