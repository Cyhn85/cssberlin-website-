"""
Maintenance script to verify a user in the CSS Berlin database.
"""
import asyncio
import os
import sys

# Add the current directory to sys.path so we can import local modules
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

from sqlalchemy import update
from database import AsyncSessionLocal
from models import User

async def verify_user(email: str):
    print(f"Verifying user: {email}")
    async with AsyncSessionLocal() as session:
        async with session.begin():
            stmt = update(User).where(User.email == email).values(is_verified=True)
            await session.execute(stmt)
            await session.commit()
    print(f"✓ User {email} is now verified.")

if __name__ == "__main__":
    email_to_verify = "seller1@cssberlin.de"
    asyncio.run(verify_user(email_to_verify))
