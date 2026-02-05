# backend/products.py
"""
CSS Berlin — Products Router
CRUD: ürün oluştur / listele / detay / güncelle / sil
models.py → Product tablosu kullanalım.
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database import get_db
from models import Product, User
from auth import get_current_user, create_access_token
import jwt, os
from fastapi import Header as _Header

router = APIRouter(prefix="/api/products", tags=["Products"])

SECRET_KEY = os.getenv("SECRET_KEY", "super_secret_key_css_berlin_2026")
ALGORITHM = "HS256"


# ─── Schemas ─────────────────────────────────────────────
class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    brand: Optional[str] = None
    category: str
    subcategory: Optional[str] = None
    condition: str  # new, like_new, good, fair
    size: Optional[str] = None
    color: Optional[str] = None
    images: Optional[List[str]] = []


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    brand: Optional[str] = None
    category: Optional[str] = None
    condition: Optional[str] = None
    size: Optional[str] = None
    color: Optional[str] = None
    images: Optional[List[str]] = None
    is_active: Optional[bool] = None


class ProductOut(BaseModel):
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
    is_featured: bool
    views: int
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Helper: token'dan user_id çek ──────────────────────
async def _get_user_from_header(
    authorization: Optional[str],
    db: AsyncSession,
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token eksik")
    token = authorization[len("Bearer "):]
    return await get_current_user(token, db)


# ─── LIST ─────────────────────────────────────────────────
@router.get("/", response_model=List[ProductOut])
async def list_products(
    skip: int = Query(0),
    limit: int = Query(20),
    category: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    is_sold: Optional[bool] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Product).where(Product.is_active == True)

    if category:
        query = query.where(Product.category.ilike(f"%{category}%"))
    if brand:
        query = query.where(Product.brand.ilike(f"%{brand}%"))
    if search:
        query = query.where(
            Product.name.ilike(f"%{search}%")
            | Product.description.ilike(f"%{search}%")
            | Product.brand.ilike(f"%{search}%")
        )
    if is_sold is not None:
        query = query.where(Product.is_sold == is_sold)

    query = query.order_by(Product.created_at.desc()).offset(skip).limit(limit)

    result = await db.execute(query)
    return result.scalars().all()


# ─── GET BY ID ────────────────────────────────────────────
@router.get("/{product_id}", response_model=ProductOut)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    # View count artır
    product.views = (product.views or 0) + 1
    await db.commit()
    await db.refresh(product)
    return product


# ─── CREATE ───────────────────────────────────────────────
@router.post("/", response_model=ProductOut)
async def create_product(
    product: ProductCreate,
    authorization: Optional[str] = _Header(default=None),
    db: AsyncSession = Depends(get_db),
):
    user = await _get_user_from_header(authorization, db)

    new_product = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        brand=product.brand,
        category=product.category,
        subcategory=product.subcategory,
        condition=product.condition,
        size=product.size,
        color=product.color,
        images=product.images or [],
        seller_id=user.id,
        is_active=True,
        is_sold=False,
        is_featured=False,
        views=0,
    )
    db.add(new_product)
    await db.commit()
    await db.refresh(new_product)
    return new_product


# ─── UPDATE ───────────────────────────────────────────────
@router.put("/{product_id}", response_model=ProductOut)
async def update_product(
    product_id: int,
    updates: ProductUpdate,
    authorization: Optional[str] = _Header(default=None),
    db: AsyncSession = Depends(get_db),
):
    user = await _get_user_from_header(authorization, db)

    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    if product.seller_id != user.id:
        raise HTTPException(status_code=403, detail="Bu ürün senin değil")

    for field, value in updates.model_dump(exclude_unset=True).items():
        setattr(product, field, value)

    await db.commit()
    await db.refresh(product)
    return product


# ─── DELETE ───────────────────────────────────────────────
@router.delete("/{product_id}")
async def delete_product(
    product_id: int,
    authorization: Optional[str] = _Header(default=None),
    db: AsyncSession = Depends(get_db),
):
    user = await _get_user_from_header(authorization, db)

    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    if product.seller_id != user.id:
        raise HTTPException(status_code=403, detail="Bu ürün senin değil")

    # Soft delete — is_active = False
    product.is_active = False
    await db.commit()
    return {"message": "Ürün kaldırıldı", "product_id": product_id}


# ─── Kategoriler ─────────────────────────────────────────
@router.get("/categories")
async def get_categories(db: AsyncSession = Depends(get_db)):
    """
    Tüm kategorileri ve ürün sayılarını döndür
    """
    # Database'den unique kategorileri ve ürün sayılarını al
    query = select(
        Product.category,
        func.count(Product.id).label('count')
    ).where(
        Product.is_active == True
    ).group_by(
        Product.category
    ).order_by(
        func.count(Product.id).desc()
    )

    result = await db.execute(query)
    categories_data = result.all()

    # Kategori metadata (icon ve description)
    category_meta = {
        "Damen": {
            "icon": "shirt",
            "color": "#f97316",
            "description": "Kleider, Blusen & mehr"
        },
        "Herren": {
            "icon": "shirt",
            "color": "#0891b2",
            "description": "Hemden, Hosen & mehr"
        },
        "Kinder": {
            "icon": "baby",
            "color": "#ec4899",
            "description": "Kindermode & Spielzeug"
        },
        "Elektronik": {
            "icon": "smartphone",
            "color": "#8b5cf6",
            "description": "Smartphones, Tablets & Gadgets"
        },
        "Sale": {
            "icon": "percent",
            "color": "#ef4444",
            "description": "Reduzierte Artikel"
        }
    }

    # Format response
    categories = []
    for cat, count in categories_data:
        meta = category_meta.get(cat, {
            "icon": "tag",
            "color": "#6b7280",
            "description": ""
        })
        categories.append({
            "name": cat,
            "count": count,
            "icon": meta.get("icon"),
            "color": meta.get("color"),
            "description": meta.get("description")
        })

    return {
        "categories": categories,
        "total": len(categories)
    }
