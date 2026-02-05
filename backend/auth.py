# backend/auth.py
"""
CSS Berlin — Auth Router (v3 — Real DB)
fake_users_db KALDIRILDI.  SQLite üzerinden models.User kullanılır.
"""

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

# ─── DB imports ─────────────────────────────────────────
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from models import User
from sqlalchemy import select

# Environment Yükle
load_dotenv()

# ─── Ayarlar ────────────────────────────────────────────
SECRET_KEY = os.getenv("SECRET_KEY", "super_secret_key_css_berlin_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 Hafta

# Şifreleme
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/api/auth", tags=["Authentication"])



# ─── Pydantic Schemas ───────────────────────────────────
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    # Support both camelCase (from frontend) and snake_case
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None



class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user_name: str


class UserOut(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str

    class Config:
        from_attributes = True


# ─── Yardımcı Fonksiyonlar ──────────────────────────────
def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(token: str, db: AsyncSession) -> User:
    """Token'dan kullanıcıyı çek — /auth/me endpoint'i için."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Token geçersiz")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token süresi doldu")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Token geçersiz")

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="Kullanıcı bulunamadı")
    return user


# ─── DB Başlangıç: Tabloları Oto-Oluştur ───────────────
async def init_db():
    """App başlarken tabloları oluştur (create_all)."""
    from database import engine
    from models import Base
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# ─── Endpointler ────────────────────────────────────────

@router.post("/register", response_model=Token)
async def register(user: UserRegister, db: AsyncSession = Depends(get_db)):
    # 1. Zaten kayıtlı mı?
    result = await db.execute(select(User).where(User.email == user.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Bu email adresi zaten kayıtlı.")

    # 2. Handle both camelCase and snake_case field names
    first_name = user.first_name or user.firstName or ""
    last_name = user.last_name or user.lastName or ""
    
    if not first_name or not last_name:
        raise HTTPException(status_code=400, detail="Vorname und Nachname sind erforderlich.")

    # 3. Yeni kullanıcı oluştur
    hashed = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        hashed_password=hashed,
        first_name=first_name,
        last_name=last_name,
        is_active=True,
        is_verified=False,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # 4. Token üret
    token = create_access_token(data={"sub": new_user.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_name": new_user.first_name,
    }


@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    # 1. Kullanıcıyı bul
    result = await db.execute(select(User).where(User.email == user_data.email))
    user = result.scalar_one_or_none()

    # Demo kullanıcı — DB boşsa bile giriş yapılabilsin
    if not user and user_data.email == "demo@cssberlin.de" and user_data.password == "demo123":
        # Demo'yu DB'ye oluştur
        demo = User(
            email="demo@cssberlin.de",
            hashed_password=get_password_hash("demo123"),
            first_name="Demo",
            last_name="User",
            is_active=True,
            is_verified=True,
        )
        db.add(demo)
        await db.commit()
        await db.refresh(demo)
        user = demo

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Kullanıcı bulunamadı veya şifre hatalı.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 2. Şifre doğrula
    if not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Şifre hatalı.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Token üret
    token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_name": user.first_name,
    }


from fastapi import Header as _Header


@router.get("/me", response_model=UserOut)
async def get_me(
    authorization: Optional[str] = _Header(default=None),
    db: AsyncSession = Depends(get_db),
):
    """
    Authorization: Bearer <token> header'dan kullanıcıyı çek.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token eksik veya geçersiz")

    token = authorization[len("Bearer "):]
    user = await get_current_user(token, db)
    return user


@router.get("/me-token")
async def get_me_with_token(token: str, db: AsyncSession = Depends(get_db)):
    """Query param ile token alan alternatif endpoint (geçici)."""
    user = await get_current_user(token, db)
    return {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }


# ─── /auth/token endpoint (form-urlencoded — OAuth2 uyumlu) ─
from fastapi.security import OAuth2PasswordRequestForm


@router.post("/token", response_model=Token)
async def token_endpoint(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    """
    OAuth2 standart token endpoint.
    Frontend auth.js bu endpointi kullanıyor (form-urlencoded).
    username = email, password = şifre
    """
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()

    # Demo fallback
    if not user and form_data.username == "demo@cssberlin.de" and form_data.password == "demo123":
        demo = User(
            email="demo@cssberlin.de",
            hashed_password=get_password_hash("demo123"),
            first_name="Demo",
            last_name="User",
            is_active=True,
            is_verified=True,
        )
        db.add(demo)
        await db.commit()
        await db.refresh(demo)
        user = demo

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="E-posta veya şifre hatalı",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_name": user.first_name,
    }


# ─── Google OAuth Endpoint ──────────────────────────────
import secrets

class GoogleAuthRequest(BaseModel):
    id_token: str
    email: EmailStr
    name: Optional[str] = None
    picture: Optional[str] = None
    given_name: Optional[str] = None
    family_name: Optional[str] = None


@router.post("/google", response_model=Token)
async def google_auth(data: GoogleAuthRequest, db: AsyncSession = Depends(get_db)):
    """
    Google OAuth ile giriş/kayıt.
    Frontend id_token gönderir, backend kullanıcıyı oluşturur veya login yapar.
    """
    # Kullanıcıyı bul veya oluştur
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if not user:
        # Yeni kullanıcı oluştur
        user = User(
            email=data.email,
            hashed_password=get_password_hash(secrets.token_urlsafe(32)),  # Random şifre
            first_name=data.given_name or data.name or "Google",
            last_name=data.family_name or "Nutzer",
            is_active=True,
            is_verified=True,  # Google ile doğrulanmış
            profile_picture=data.picture,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    # Token üret
    token = create_access_token(data={"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_name": user.first_name,
    }


# ─── Magic Link Endpoints ───────────────────────────────
# In-memory token storage (production'da Redis kullanılmalı)
magic_link_tokens: dict = {}

class MagicLinkRequest(BaseModel):
    email: EmailStr


class MagicLinkVerify(BaseModel):
    token: str


@router.post("/magic-link/request")
async def request_magic_link(data: MagicLinkRequest, db: AsyncSession = Depends(get_db)):
    """
    Magic Link talep et - email ile giriş linki gönderir.
    """
    # Kullanıcıyı bul
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    # Kullanıcı yoksa bile güvenlik için aynı yanıt
    if not user:
        return {"message": "Wenn diese E-Mail registriert ist, erhalten Sie einen Login-Link."}

    # Token oluştur (15 dakika geçerli)
    token = secrets.token_urlsafe(32)
    expiry = datetime.utcnow() + timedelta(minutes=15)
    magic_link_tokens[token] = {"email": data.email, "expires": expiry}

    # TODO: Email gönderimi (EmailJS veya SMTP)
    # Bu örnek için token'ı response'da döndürüyoruz (development only)
    return {
        "message": "Wenn diese E-Mail registriert ist, erhalten Sie einen Login-Link.",
        "dev_token": token,  # Production'da kaldırılmalı!
        "dev_link": f"https://cssberlin.de/magic-login.html?token={token}"
    }


@router.post("/magic-link/verify", response_model=Token)
async def verify_magic_link(data: MagicLinkVerify, db: AsyncSession = Depends(get_db)):
    """
    Magic Link token'ını doğrula ve login yap.
    """
    token_data = magic_link_tokens.get(data.token)

    if not token_data:
        raise HTTPException(status_code=400, detail="Ungültiger oder abgelaufener Link")

    if datetime.utcnow() > token_data["expires"]:
        del magic_link_tokens[data.token]
        raise HTTPException(status_code=400, detail="Der Link ist abgelaufen")

    # Kullanıcıyı bul
    result = await db.execute(select(User).where(User.email == token_data["email"]))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="Benutzer nicht gefunden")

    # Token'ı kullanıldı olarak işaretle
    del magic_link_tokens[data.token]

    # Kullanıcıyı verified yap
    user.is_verified = True
    await db.commit()

    # Access token üret
    access_token = create_access_token(data={"sub": user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_name": user.first_name,
    }


# ─── Password Reset Endpoints ───────────────────────────
password_reset_tokens: dict = {}

class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str


@router.post("/password-reset/request")
async def request_password_reset(data: PasswordResetRequest, db: AsyncSession = Depends(get_db)):
    """
    Şifre sıfırlama talebi - email ile reset linki gönderir.
    """
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    # Kullanıcı yoksa bile güvenlik için aynı yanıt
    if not user:
        return {"message": "Wenn diese E-Mail registriert ist, erhalten Sie eine Nachricht zur Passwortzurücksetzung."}

    # Token oluştur (1 saat geçerli)
    token = secrets.token_urlsafe(32)
    expiry = datetime.utcnow() + timedelta(hours=1)
    password_reset_tokens[token] = {"email": data.email, "expires": expiry}

    return {
        "message": "Wenn diese E-Mail registriert ist, erhalten Sie eine Nachricht zur Passwortzurücksetzung.",
        "dev_token": token,  # Production'da kaldırılmalı!
        "dev_link": f"https://cssberlin.de/reset-password.html?token={token}"
    }


@router.post("/password-reset/confirm")
async def confirm_password_reset(data: PasswordResetConfirm, db: AsyncSession = Depends(get_db)):
    """
    Şifre sıfırlama - yeni şifreyi ayarla.
    """
    token_data = password_reset_tokens.get(data.token)

    if not token_data:
        raise HTTPException(status_code=400, detail="Ungültiger oder abgelaufener Link")

    if datetime.utcnow() > token_data["expires"]:
        del password_reset_tokens[data.token]
        raise HTTPException(status_code=400, detail="Der Link ist abgelaufen")

    # Kullanıcıyı bul
    result = await db.execute(select(User).where(User.email == token_data["email"]))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="Benutzer nicht gefunden")

    # Şifreyi güncelle
    user.hashed_password = get_password_hash(data.new_password)
    await db.commit()

    # Token'ı kullanıldı olarak işaretle
    del password_reset_tokens[data.token]

    return {"message": "Passwort erfolgreich zurückgesetzt. Sie können sich jetzt anmelden."}

