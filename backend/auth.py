"""
Authentication utilities for CSS Berlin API
JWT token handling and password hashing
"""

from __future__ import annotations

from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import os
import hashlib
import hmac

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("Missing required environment variable SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash using HMAC-SHA256"""
    computed_hash = get_password_hash(plain_password)
    return hmac.compare_digest(computed_hash, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password using HMAC-SHA256"""
    return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), SECRET_KEY.encode('utf-8'), 100000).hex()


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get current user from JWT token"""
    from database import AsyncSessionLocal
    from models import User
    from sqlalchemy import select

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Ungültige Anmeldedaten",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_id: int = payload.get("user_id")

        if email is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    # Get user from database
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

        if user is None:
            raise credentials_exception

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Benutzer ist deaktiviert"
            )

        return user
