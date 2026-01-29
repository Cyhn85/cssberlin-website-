import asyncio
import os
from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import engine
from models import User, Product
from auth import get_password_hash


DEMO_PRODUCTS = [
    {
        "name": "Vintage Lederhandtasche",
        "description": "Echtes Leder, sehr guter Zustand.",
        "price": 89.99,
        "brand": "Michael Kors",
        "category": "damen",
        "subcategory": "Taschen",
        "condition": "Sehr gut",
        "size": "OneSize",
        "color": "Schwarz",
        "images": ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600"]
    },
    {
        "name": "Nike Air Max 90",
        "description": "Klassische Sneaker, kaum getragen.",
        "price": 120.00,
        "brand": "Nike",
        "category": "herren",
        "subcategory": "Sneaker",
        "condition": "Neuwertig",
        "size": "42",
        "color": "Weiß",
        "images": ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"]
    },
    {
        "name": "Cashmere Pullover",
        "description": "Weicher Kaschmir, luxuriös.",
        "price": 79.00,
        "brand": "Zara",
        "category": "damen",
        "subcategory": "Pullover",
        "condition": "Sehr gut",
        "size": "M",
        "color": "Beige",
        "images": ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600"]
    }
]


async def seed():
    email = os.environ.get("DEMO_SELLER_EMAIL", "demo@cssberlin.de")
    password = os.environ.get("DEMO_SELLER_PASSWORD", "demo1234")

    async with AsyncSession(engine) as session:
        result = await session.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if not user:
            user = User(
                email=email,
                hashed_password=get_password_hash(password),
                first_name="Demo",
                last_name="Seller",
                is_active=True,
                is_verified=True,
                created_at=datetime.utcnow()
            )
            session.add(user)
            await session.commit()
            await session.refresh(user)

        for product_data in DEMO_PRODUCTS:
            existing = await session.execute(
                select(Product).where(
                    Product.seller_id == user.id,
                    Product.name == product_data["name"]
                )
            )
            if existing.scalar_one_or_none():
                continue

            product = Product(
                seller_id=user.id,
                **product_data
            )
            session.add(product)

        await session.commit()


if __name__ == "__main__":
    asyncio.run(seed())
