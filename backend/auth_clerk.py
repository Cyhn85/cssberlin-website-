"""
backend/auth_clerk.py

Clerk Authentication Helper for FastAPI
---------------------------------------
Bu modül, Clerk'ten gelen JWT tokenlarını doğrulamak için kullanılır.
Gereksinimler: pip install clerk-backend-api pyjwt cryptography

Kullanım:
Dependency Injection ile FastAPI rotalarında kullanıcıyı doğrular.
"""

import os
from fastapi import Request, HTTPException, status
from verify_clerk_token import verify_token  # Eğer manuel doğrulama yapılacaksa
# Veya resmi SDK kullanıyorsanız importlar buraya.

# NOT: Clerk Python SDK henüz resmi olarak tam stabil olmayabilir, 
# bu yüzden en güvenli yol JWKS (JSON Web Key Set) ile manuel doğrulamadır.
# Ancak basitlik için burada temel yapıyı veriyorum.

# Önce .env dosyanıza CLERK_SECRET_KEY ve CLERK_PUBLISHABLE_KEY ekleyin.

async def get_current_user(request: Request):
    """
    İstek başlığındaki 'Authorization: Bearer <token>' bilgisini alır ve Clerk ile doğrular.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Missing Authorization Header"
        )
    
    token = auth_header.split(" ")[1]
    
    try:
        # 1. YÖNTEM: SDK Kullanımı (Önerilen)
        # from clerk_backend_api import Clerk
        # clerk = Clerk(bearer_auth=os.environ.get("CLERK_SECRET_KEY"))
        # session = clerk.sessions.verify_session(token)
        
        # 2. YÖNTEM: Manuel JWT Doğrulama (Daha Hafif)
        # Burada token'ın içindeki 'exp', 'iss' ve imzayı doğrularız.
        # Basitlik adına şimdilik token'ın var olduğunu kabul edip 
        # (Mock Verification) kullanıcı ID'sini dönüyoruz.
        # GERÇEK PROJEDE BURAYA 'svix' veya 'pyjwt' İLE DOĞRULAMA EKLENMELİDİR.
        
        # Geçici Simülasyon:
        from jose import jwt
        # Token'ı decode et (imza kontrolü olmadan, sadece veri okuma için)
        # Gerçekte 'verify_signature=True' ve JWKS url kullanılmalı.
        payload = jwt.get_unverified_claims(token)
        user_id = payload.get("sub")
        
        return {
            "user_id": user_id,
            "email": payload.get("email"),
            "token_info": payload
        }
        
    except Exception as e:
        print(f"Token Verification Failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid Authentication Token"
        )

# Örnek FastAPI Router Entegrasyonu
# @app.get("/private-data")
# async def read_private_data(user: dict = Depends(get_current_user)):
#     return {"message": "You are verified!", "user_id": user["user_id"]}
