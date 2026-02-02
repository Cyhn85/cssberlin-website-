# backend/auth.py
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

# Environment Yükle
load_dotenv()

# Ayarlar
SECRET_KEY = os.getenv("SECRET_KEY", "super_secret_key_css_berlin_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 Hafta

# Şifreleme Aracı
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# --- Veri Modelleri (HTML Formunla Eşleşir) ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    first_name: str  # HTML'deki id="firstName"
    last_name: str   # HTML'deki id="lastName"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_name: str

# --- Mock Veritabanı (Geçici Hafıza) ---
# Sunucu kapanınca silinir. Kalıcı olması için PostgreSQL bağlanacak.
fake_users_db = {}

# --- Yardımcı Fonksiyonlar ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Endpointler ---

@router.post("/register", response_model=Token)
async def register(user: UserRegister):
    # 1. Kullanıcı var mı kontrol et
    if user.email in fake_users_db:
        raise HTTPException(
            status_code=400,
            detail="Bu email adresi zaten kayıtlı."
        )
    
    # 2. Şifreyi hashle ve kaydet
    hashed_password = get_password_hash(user.password)
    fake_users_db[user.email] = {
        "email": user.email,
        "password": hashed_password,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "full_name": f"{user.first_name} {user.last_name}"
    }
    
    # 3. Otomatik giriş için Token üret
    access_token = create_access_token(
        data={"sub": user.email}
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_name": user.first_name
    }

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    # 1. Kullanıcıyı bul
    user = fake_users_db.get(user_data.email)
    
    # Test için Demo Kullanıcı (Veritabanı boşsa çalışsın diye)
    if not user and user_data.email == "demo@cssberlin.de" and user_data.password == "demo123":
        user = {"email": "demo@cssberlin.de", "password": get_password_hash("demo123"), "first_name": "Demo"}

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Kullanıcı bulunamadı veya şifre hatalı.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 2. Şifreyi doğrula
    if not verify_password(user_data.password, user["password"]):
         raise HTTPException(
            status_code=401,
            detail="Şifre hatalı.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Token üret
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    # İsim bilgisini güvenli çek
    user_name = user.get("first_name", "User")
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_name": user_name
    }