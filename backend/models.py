"""
SQLAlchemy models for CSS Berlin database
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    products = relationship("Product", back_populates="seller")
    sent_messages = relationship("Message", foreign_keys="Message.sender_id", back_populates="sender")
    received_messages = relationship("Message", foreign_keys="Message.receiver_id", back_populates="receiver")
    favorites = relationship("Favorite", back_populates="user")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    brand = Column(String(100))
    category = Column(String(100), nullable=False)
    subcategory = Column(String(100))
    condition = Column(String(50), nullable=False)  # new, like_new, good, fair
    size = Column(String(50))
    color = Column(String(50))
    images = Column(JSON, default=list)  # List of image URLs
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    is_sold = Column(Boolean, default=False)
    views = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    seller = relationship("User", back_populates="products")
    offers = relationship("Offer", back_populates="product")


class Offer(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    offer_amount = Column(Float, nullable=False)
    counter_amount = Column(Float)  # Seller's counter offer
    status = Column(String(50), default="pending")  # pending, accepted, declined, countered, expired
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expires_at = Column(DateTime)

    # Relationships
    product = relationship("Product", back_populates="offers")
    buyer = relationship("User", foreign_keys=[buyer_id])
    seller = relationship("User", foreign_keys=[seller_id])


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"))  # Optional: related product
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_messages")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    offer_id = Column(Integer, ForeignKey("offers.id"))  # If purchased via negotiation
    total_amount = Column(Float, nullable=False)
    shipping_address = Column(JSON)
    status = Column(String(50), default="pending")  # pending, paid, shipped, delivered, cancelled
    payment_intent_id = Column(String(255))  # Stripe payment ID
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    shipment = relationship("Shipment", back_populates="order", uselist=False)


class Payment(Base):
    """Payment records for checkout"""
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="EUR")
    method = Column(String(50), nullable=False)  # card, paypal, klarna, giropay
    status = Column(String(30), default="pending")  # pending, paid, failed
    provider = Column(String(50), default="mock")
    provider_reference = Column(String(255))
    card_last4 = Column(String(4))
    card_brand = Column(String(30))
    created_at = Column(DateTime, default=datetime.utcnow)


class UserReview(Base):
    """User-to-user reviews after a transaction"""
    __tablename__ = "user_reviews"
    __table_args__ = (
        UniqueConstraint("order_id", "from_user_id", name="uq_review_order_from"),
    )

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    from_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    to_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    from_user = relationship("User", foreign_keys=[from_user_id])
    to_user = relationship("User", foreign_keys=[to_user_id])


class Shipment(Base):
    """Vinted-style shipping tracking"""
    __tablename__ = "shipments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, unique=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Carrier info
    carrier = Column(String(50), nullable=False)  # dhl, hermes, dpd, gls
    tracking_number = Column(String(100))

    # Status tracking
    status = Column(String(50), default="pending")  # pending, label_created, shipped, in_transit, out_for_delivery, delivered, returned

    # Timestamps for each status
    shipped_at = Column(DateTime)
    in_transit_at = Column(DateTime)
    out_for_delivery_at = Column(DateTime)
    delivered_at = Column(DateTime)

    # Additional info
    estimated_delivery = Column(DateTime)
    last_location = Column(String(255))
    tracking_history = Column(JSON, default=list)  # Array of {status, location, timestamp}

    # Shipping details
    weight_kg = Column(Float)
    package_size = Column(String(50))  # S, M, L, XL

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    order = relationship("Order", back_populates="shipment")
    seller = relationship("User", foreign_keys=[seller_id])
    buyer = relationship("User", foreign_keys=[buyer_id])


class Favorite(Base):
    """User favorites/wishlist"""
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="favorites")
    product = relationship("Product")


class Escrow(Base):
    """
    Escrow (Havuz) Sistemi - 1€ Hizmet Bedeli
    Her işlem için ödeme havuzda tutulur, onay sonrası serbest bırakılır.
    """
    __tablename__ = "escrows"

    id = Column(Integer, primary_key=True, index=True)
    escrow_code = Column(String(50), unique=True, nullable=False)  # ESC_xxx formatında

    # Taraflar
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)

    # Tutar bilgileri
    product_price = Column(Float, nullable=False)
    service_fee = Column(Float, default=1.00)  # 1€ sabit
    total_amount = Column(Float, nullable=False)

    # İşlem tipi ve durumu
    transaction_type = Column(String(20), nullable=False)  # 'online' veya 'abholung'
    status = Column(String(30), default="pending")  # pending, paid, confirmed, released, cancelled, refunded

    # Ödeme bilgileri
    payment_method = Column(String(50))  # klarna, paypal, card
    payment_intent_id = Column(String(255))  # Ödeme servisinden gelen ID
    paid_at = Column(DateTime)

    # PIN/QR onay sistemi (Abholung için)
    confirmation_pin = Column(String(6))
    confirmed_at = Column(DateTime)

    # İptal/iade bilgileri
    cancelled_at = Column(DateTime)
    cancel_reason = Column(String(255))
    refunded_at = Column(DateTime)

    # Zaman damgaları
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expires_at = Column(DateTime)  # Ödeme için son tarih

    # Relationships
    buyer = relationship("User", foreign_keys=[buyer_id])
    seller = relationship("User", foreign_keys=[seller_id])
    product = relationship("Product")
    appointment = relationship("Appointment", back_populates="escrow", uselist=False)


class Appointment(Base):
    """
    Randevu Sistemi - Abholung (Elden Teslim)
    Alıcı ve satıcı buluşması için randevu yönetimi.
    """
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    appointment_code = Column(String(50), unique=True, nullable=False)  # APT_xxx formatında

    # Taraflar
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    escrow_id = Column(Integer, ForeignKey("escrows.id"))

    # Randevu detayları
    appointment_date = Column(DateTime, nullable=False)
    appointment_time = Column(String(10), nullable=False)  # HH:MM formatında

    # Konum bilgileri (ödeme sonrası açılır)
    location_address = Column(String(500))
    location_city = Column(String(100))
    location_plz = Column(String(10))
    location_lat = Column(Float)
    location_lng = Column(Float)
    location_revealed = Column(Boolean, default=False)

    # Durum
    status = Column(String(30), default="pending_payment")
    # pending_payment, confirmed, completed, cancelled, no_show

    # Hatırlatıcı sistemi
    reminder_1h_sent = Column(Boolean, default=False)
    reminder_24h_sent = Column(Boolean, default=False)

    # Notlar
    buyer_notes = Column(Text)
    seller_notes = Column(Text)

    # Zaman damgaları
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime)
    cancelled_at = Column(DateTime)

    # Relationships
    buyer = relationship("User", foreign_keys=[buyer_id])
    seller = relationship("User", foreign_keys=[seller_id])
    product = relationship("Product")
    escrow = relationship("Escrow", back_populates="appointment")


class BundleOffer(Base):
    """
    Bundle (Çoklu Ürün) Teklif Sistemi
    Birden fazla ürün için toplu teklif.
    """
    __tablename__ = "bundle_offers"

    id = Column(Integer, primary_key=True, index=True)
    bundle_code = Column(String(50), unique=True, nullable=False)  # BND_xxx formatında

    # Taraflar
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Ürünler (JSON listesi)
    product_ids = Column(JSON, nullable=False)  # [1, 2, 3] formatında
    product_count = Column(Integer, nullable=False)

    # Fiyatlandırma
    original_total = Column(Float, nullable=False)  # Toplam liste fiyatı
    offer_amount = Column(Float, nullable=False)  # Teklif edilen tutar
    min_offer_amount = Column(Float, nullable=False)  # %50 kuralına göre minimum
    discount_percent = Column(Float)  # Yüzde indirim

    # Durum
    status = Column(String(30), default="pending")
    # pending, accepted, declined, countered, expired

    counter_amount = Column(Float)  # Satıcı karşı teklifi
    message = Column(Text)

    # Zaman damgaları
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expires_at = Column(DateTime)

    # Relationships
    buyer = relationship("User", foreign_keys=[buyer_id])
    seller = relationship("User", foreign_keys=[seller_id])


class SecurityLog(Base):
    """
    Güvenlik Kayıtları - Anti-Bypass
    Şüpheli mesajlar ve platform dışı iletişim girişimleri.
    """
    __tablename__ = "security_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Algılanan içerik
    log_type = Column(String(30), nullable=False)  # phone_detected, link_detected, bypass_attempt
    detected_content = Column(Text)
    original_message = Column(Text)

    # Bağlam
    context = Column(String(50))  # chat, offer_message, profile_update
    related_user_id = Column(Integer, ForeignKey("users.id"))  # Mesajın gönderildiği kişi

    # Kullanıcı tepkisi
    user_action = Column(String(30))  # created_appointment, skipped_warning, blocked

    # Zaman damgası
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", foreign_keys=[user_id])


class OfferNotification(Base):
    """Notifications for offer updates"""
    __tablename__ = "offer_notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    offer_id = Column(Integer, ForeignKey("offers.id"), nullable=False)
    type = Column(String(50), nullable=False)  # new_offer, counter_offer, offer_accepted, offer_declined
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", foreign_keys=[user_id])
