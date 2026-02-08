# backend/offers.py
"""
CSS Berlin — Offers Router (Pazarlık Sistemi)
Teklif oluştur / kabul / reddet / karşı teklif
models.py → Offer + OfferNotification tabloları
Daily limit: 25 teklif / gün
"""

from fastapi import APIRouter, HTTPException, Depends, Query, Header as _Header
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database import get_db
from models import Offer, Product, User, OfferNotification
from auth import get_current_user

router = APIRouter(prefix="/api/offers", tags=["Offers"])

DAILY_OFFER_LIMIT = 25  # Günlük max teklif


# ─── Schemas ─────────────────────────────────────────────
class OfferCreate(BaseModel):
    product_id: int
    offer_amount: float
    message: Optional[str] = None


class OfferCounter(BaseModel):
    counter_amount: float


class OfferOut(BaseModel):
    id: int
    product_id: int
    buyer_id: int
    seller_id: int
    offer_amount: float
    counter_amount: Optional[float]
    status: str
    message: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    # Enriched fields
    product_name: Optional[str] = None
    product_image: Optional[str] = None
    product_price: Optional[float] = None
    product_is_sold: Optional[bool] = None
    seller_name: Optional[str] = None
    buyer_name: Optional[str] = None

    class Config:
        from_attributes = True


# ─── Helper ──────────────────────────────────────────────
async def _get_user(authorization: Optional[str], db: AsyncSession) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token eksik")
    token = authorization[len("Bearer "):]
    return await get_current_user(token, db)


async def _check_daily_limit(buyer_id: int, db: AsyncSession):
    """Bugün kaç teklif verdi kontrol et."""
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    result = await db.execute(
        select(func.count(Offer.id)).where(
            Offer.buyer_id == buyer_id,
            Offer.created_at >= today_start,
        )
    )
    count = result.scalar()
    if count >= DAILY_OFFER_LIMIT:
        raise HTTPException(
            status_code=429,
            detail=f"Günlük teklif limiti ({DAILY_OFFER_LIMIT}) doldu. Yarın tekrar dene.",
        )


async def _notify(user_id: int, offer_id: int, notif_type: str, db: AsyncSession):
    """Offer notification oluştur."""
    notif = OfferNotification(
        user_id=user_id,
        offer_id=offer_id,
        type=notif_type,
        is_read=False,
    )
    db.add(notif)
    # commit caller'da yapılacak


# ─── CREATE OFFER ────────────────────────────────────────
@router.post("/", response_model=OfferOut)
async def create_offer(
    offer_data: OfferCreate,
    authorization: Optional[str] = _Header(default=None),
    db: AsyncSession = Depends(get_db),
):
    buyer = await _get_user(authorization, db)

    # 1. Ürün var mı?
    result = await db.execute(select(Product).where(Product.id == offer_data.product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    # 2. Kendi ürününe teklif veremez
    if product.seller_id == buyer.id:
        raise HTTPException(status_code=400, detail="Kendi ürününe teklif veremezsin")

    # 3. Ürün satıldı mı?
    if product.is_sold:
        raise HTTPException(status_code=400, detail="Bu ürün zaten satıldı")

    # 4. Daily limit
    await _check_daily_limit(buyer.id, db)

    # 5. Fiyat validasyon: %40'tan fazla indirim yok
    min_offer = product.price * 0.60
    if offer_data.offer_amount < min_offer:
        raise HTTPException(
            status_code=400,
            detail=f"Minimum teklif tutarı: {min_offer:.2f} € (liste fiyatının %60'ı)",
        )

    # 6. Offer oluştur
    new_offer = Offer(
        product_id=product.id,
        buyer_id=buyer.id,
        seller_id=product.seller_id,
        offer_amount=offer_data.offer_amount,
        status="pending",
        message=offer_data.message,
        expires_at=datetime.utcnow() + timedelta(hours=48),  # 48h süre
    )
    db.add(new_offer)
    await db.flush()  # ID al

    # 7. Satıcıya bildirim
    await _notify(product.seller_id, new_offer.id, "new_offer", db)

    await db.commit()
    await db.refresh(new_offer)
    return new_offer


# ─── LIST: Kullanıcının teklifleri ───────────────────────
@router.get("/", response_model=List[OfferOut])
async def list_offers(
    authorization: Optional[str] = _Header(default=None),
    db: AsyncSession = Depends(get_db),
):
    user = await _get_user(authorization, db)

    # Buyer veya seller olduğu teklifleri göster (Join ile)
    # Eager load relationships for Pydantic to access them
    from sqlalchemy.orm import selectinload
    
    query = select(Offer).options(
        selectinload(Offer.product),
        selectinload(Offer.seller),
        selectinload(Offer.buyer)
    ).where(
        (Offer.buyer_id == user.id) | (Offer.seller_id == user.id)
    ).order_by(Offer.created_at.desc())

    result = await db.execute(query)
    offers = result.scalars().all()
    
    # Map ORM objects to Schema manually to ensure fields are populated
    offer_list = []
    for o in offers:
        # Get primary image
        img = None
        if o.product.images and isinstance(o.product.images, list) and len(o.product.images) > 0:
             img = o.product.images[0]
        
        offer_dict = OfferOut(
            id=o.id,
            product_id=o.product_id,
            buyer_id=o.buyer_id,
            seller_id=o.seller_id,
            offer_amount=o.offer_amount,
            counter_amount=o.counter_amount,
            status=o.status,
            message=o.message,
            created_at=o.created_at,
            updated_at=o.updated_at,
            
            product_name=o.product.name if o.product else "Unknown",
            product_image=img,
            product_price=o.product.price if o.product else 0.0,
            product_is_sold=o.product.is_sold if o.product else False,
            seller_name=f"{o.seller.first_name} {o.seller.last_name}" if o.seller else "Unknown",
            buyer_name=f"{o.buyer.first_name} {o.buyer.last_name}" if o.buyer else "Unknown"
        )
        offer_list.append(offer_dict)
        
    return offer_list


# ─── ACCEPT ──────────────────────────────────────────────
@router.put("/{offer_id}/accept", response_model=OfferOut)
async def accept_offer(
    offer_id: int,
    authorization: Optional[str] = _Header(default=None),
    db: AsyncSession = Depends(get_db),
):
    user = await _get_user(authorization, db)

    result = await db.execute(select(Offer).where(Offer.id == offer_id))
    offer = result.scalar_one_or_none()
    if not offer:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    # Sadece satıcı kabul edebilir
    if offer.seller_id != user.id:
        raise HTTPException(status_code=403, detail="Sadece satıcı kabul edebilir")
    if offer.status != "pending" and offer.status != "countered":
        raise HTTPException(status_code=400, detail=f"Kabul edilemez durum: {offer.status}")

    offer.status = "accepted"
    offer.updated_at = datetime.utcnow()

    # Alıcıya bildirim
    await _notify(offer.buyer_id, offer.id, "offer_accepted", db)

    await db.commit()
    await db.refresh(offer)
    return offer


# ─── DECLINE ──────────────────────────────────────────────
@router.put("/{offer_id}/decline", response_model=OfferOut)
async def decline_offer(
    offer_id: int,
    authorization: Optional[str] = _Header(default=None),
    db: AsyncSession = Depends(get_db),
):
    user = await _get_user(authorization, db)

    result = await db.execute(select(Offer).where(Offer.id == offer_id))
    offer = result.scalar_one_or_none()
    if not offer:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    # Satıcı red edebilir
    if offer.seller_id != user.id:
        raise HTTPException(status_code=403, detail="Sadece satıcı reddedebilir")
    if offer.status not in ("pending", "countered"):
        raise HTTPException(status_code=400, detail=f"Reddiledilemeyen durum: {offer.status}")

    offer.status = "declined"
    offer.updated_at = datetime.utcnow()

    # Alıcıya bildirim
    await _notify(offer.buyer_id, offer.id, "offer_declined", db)

    await db.commit()
    await db.refresh(offer)
    return offer


# ─── COUNTER ──────────────────────────────────────────────
@router.put("/{offer_id}/counter", response_model=OfferOut)
async def counter_offer(
    offer_id: int,
    counter_data: OfferCounter,
    authorization: Optional[str] = _Header(default=None),
    db: AsyncSession = Depends(get_db),
):
    user = await _get_user(authorization, db)

    result = await db.execute(select(Offer).where(Offer.id == offer_id))
    offer = result.scalar_one_or_none()
    if not offer:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    # Satıcı karşı teklif verir
    if offer.seller_id != user.id:
        raise HTTPException(status_code=403, detail="Sadece satıcı karşı teklif verebilir")
    if offer.status != "pending":
        raise HTTPException(status_code=400, detail=f"Karşı teklif verilemez: {offer.status}")

    # Karşı teklif, orijinal teklifin üstünde olmalı
    if counter_data.counter_amount <= offer.offer_amount:
        raise HTTPException(
            status_code=400,
            detail="Karşı teklif, yapılan teklifin üstünde olmalı",
        )

    offer.counter_amount = counter_data.counter_amount
    offer.status = "countered"
    offer.updated_at = datetime.utcnow()

    # Alıcıya bildirim
    await _notify(offer.buyer_id, offer.id, "counter_offer", db)

    await db.commit()
    await db.refresh(offer)
    return offer


# ─── DELETE (Archive) ─────────────────────────────────────
@router.delete("/{offer_id}")
async def delete_offer(
    offer_id: int,
    authorization: Optional[str] = _Header(default=None),
    db: AsyncSession = Depends(get_db),
):
    """
    Teklifi siler (Veritabanından tamamen kaldırır veya soft-delete)
    Burada şimdilik hard-delete yapıyoruz ki liste temizlensin.
    """
    user = await _get_user(authorization, db)
    
    result = await db.execute(select(Offer).where(Offer.id == offer_id))
    offer = result.scalar_one_or_none()
    
    if not offer:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")
        
    # Sadece tarafı olanlar silebilir
    if offer.buyer_id != user.id and offer.seller_id != user.id:
        raise HTTPException(status_code=403, detail="Bu teklifi silme yetkiniz yok")

    await db.delete(offer)
    await db.commit()
    
    return {"message": "Teklif silindi", "id": offer_id}
