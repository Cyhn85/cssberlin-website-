import argparse
import asyncio
import os
import random
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from auth import get_password_hash
from database import Base, engine
from models import Product, User


def _pick(rng: random.Random, items):
    return items[rng.randrange(0, len(items))]


def _make_product(rng: random.Random, n: int, category: str) -> dict:
    prefixes = ["Vintage", "Eco", "Upcycled", "Klassisch", "Minimal", "Street", "Clean", "Cozy", "Urban", "Retro"]

    catalog = {
        "damen": {
            "items": ["Mantel", "Kleid", "Bluse", "Pullover", "Jeans", "Rock", "Sneaker", "Handtasche"],
            "subcategories": ["Jacken", "Kleider", "Blusen", "Pullover", "Hosen", "Röcke", "Schuhe", "Taschen"],
            "sizes": ["XS", "S", "M", "L", "XL", "OneSize"],
            "colors": ["Schwarz", "Weiß", "Beige", "Blau", "Grün", "Orange", "Rot"],
        },
        "herren": {
            "items": ["Jacke", "Hoodie", "T-Shirt", "Jeans", "Sneaker", "Hemd", "Pullover"],
            "subcategories": ["Jacken", "Hoodies", "T-Shirts", "Hosen", "Schuhe", "Hemden", "Pullover"],
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "colors": ["Schwarz", "Weiß", "Grau", "Navy", "Grün", "Orange"],
        },
        "kinder": {
            "items": ["Jacke", "Pullover", "T-Shirt", "Schuhe", "Rucksack"],
            "subcategories": ["Jacken", "Pullover", "T-Shirts", "Schuhe", "Accessoires"],
            "sizes": ["92", "104", "116", "128", "140", "152"],
            "colors": ["Blau", "Grün", "Orange", "Pink", "Grau"],
        },
    }

    brands = [
        "Nike",
        "Adidas",
        "Zara",
        "H&M",
        "Levi's",
        "Puma",
        "Uniqlo",
        "COS",
        "Mango",
        "Patagonia",
    ]
    conditions = ["Neuwertig", "Sehr gut", "Gut", "Gebraucht"]

    c = catalog.get(category, catalog["damen"])
    item = _pick(rng, c["items"])
    subcategory = _pick(rng, c["subcategories"])
    size = _pick(rng, c["sizes"])
    color = _pick(rng, c["colors"])
    brand = _pick(rng, brands)
    condition = _pick(rng, conditions)

    price = round(rng.uniform(9.0, 249.0), 2)
    title = f"{_pick(rng, prefixes)} {brand} {item} #{n:03d}"
    desc = (
        f"{item} in {condition.lower()}em Zustand. Farbe: {color}, Größe: {size}. "
        "Schneller Versand aus Berlin. Climate Smart Solutions."
    )

    local_images = [
        "/seed_data/vintage_ceket_01.svg",
        "/seed_data/vintage_ceket_02.svg",
        "/seed_data/vintage_ceket_03.svg",
    ]

    return {
        "name": title,
        "description": desc,
        "price": price,
        "brand": brand,
        "category": category,
        "subcategory": subcategory,
        "condition": condition,
        "size": size,
        "color": color,
        "images": [_pick(rng, local_images)],
    }


async def seed(count: int, sellers: int, seed_value: int) -> None:
    # Ensure tables exist (safe).
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    base_email = os.environ.get("DEMO_SELLER_EMAIL_PREFIX", "demo-seller")
    password = os.environ.get("DEMO_SELLER_PASSWORD", "demo1234")

    rng = random.Random(seed_value)

    categories = ["damen", "herren", "kinder"]

    per_seller = max(1, count // max(1, sellers))
    created_products = 0
    created_users = 0

    async with AsyncSession(engine) as session:
        # Create demo sellers (idempotent).
        seller_users: list[User] = []
        for i in range(1, sellers + 1):
            email = f"{base_email}{i}@cssberlin.de"

            result = await session.execute(select(User).where(User.email == email))
            user = result.scalar_one_or_none()
            if not user:
                user = User(
                    email=email,
                    hashed_password=get_password_hash(password),
                    first_name="Demo",
                    last_name=f"Seller{i}",
                    is_active=True,
                    is_verified=True,
                    created_at=datetime.utcnow(),
                )
                session.add(user)
                await session.flush()
                created_users += 1

            seller_users.append(user)

        await session.commit()

        # Create products (idempotent-ish by name+seller).
        for seller_idx, seller in enumerate(seller_users, start=1):
            for p_i in range(1, per_seller + 1):
                if created_products >= count:
                    break

                category = categories[(seller_idx + p_i) % len(categories)]
                product_data = _make_product(rng, created_products + 1, category)

                exists = await session.execute(
                    select(Product).where(
                        Product.seller_id == seller.id,
                        Product.name == product_data["name"],
                    )
                )
                if exists.scalar_one_or_none():
                    continue

                product = Product(seller_id=seller.id, **product_data)
                session.add(product)
                created_products += 1

            if created_products >= count:
                break

        await session.commit()

    print(f"[seed_bulk_demo] users_created={created_users} products_created={created_products}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed bulk demo products (no scraping).")
    parser.add_argument("--count", type=int, default=300, help="How many products to create.")
    parser.add_argument("--sellers", type=int, default=10, help="How many demo sellers to create.")
    parser.add_argument("--seed", type=int, default=20260130, help="PRNG seed for reproducibility.")
    args = parser.parse_args()

    asyncio.run(seed(count=args.count, sellers=args.sellers, seed_value=args.seed))


if __name__ == "__main__":
    main()

