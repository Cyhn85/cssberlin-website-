# accounting_system/award_badges.py

import asyncio
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import sys
import os

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.models import User, Product, UserReview, Order
from backend.database import DATABASE_URL

async def award_badges():
    """Awards badges to users based on their stats."""
    engine = create_async_engine(DATABASE_URL, echo=False)
    AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with AsyncSessionLocal() as db:
        # Get all users
        users_result = await db.execute(select(User))
        users = users_result.scalars().all()

        for user in users:
            badges = set(user.badges or [])

            # --- Top Seller Badge ---
            sales_count_result = await db.execute(
                select(func.count(Order.id)).join(Product).where(
                    Product.seller_id == user.id,
                    Order.status == 'delivered' # or 'completed' depending on your logic
                )
            )
            sales_count = sales_count_result.scalar_one()

            if sales_count >= 10 and 'top_seller' not in badges:
                print(f"Awarding 'Top Seller' badge to {user.email}")
                badges.add('top_seller')
            elif sales_count < 10 and 'top_seller' in badges:
                print(f"Removing 'Top Seller' badge from {user.email}")
                badges.discard('top_seller')
                
            # --- Trusted Member Badge (High Rating) ---
            avg_rating_result = await db.execute(
                select(func.avg(UserReview.rating)).where(UserReview.to_user_id == user.id)
            )
            avg_rating = avg_rating_result.scalar_one_or_none() or 0

            if avg_rating >= 4.8 and 'trusted_member' not in badges:
                print(f"Awarding 'Trusted Member' badge to {user.email}")
                badges.add('trusted_member')

            # Update user badges if changed
            if set(user.badges or []) != badges:
                user.badges = list(badges)
                db.add(user)

        await db.commit()
    print("Badge awarding process completed.")

if __name__ == "__main__":
    asyncio.run(award_badges())
