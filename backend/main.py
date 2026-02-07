# backend/main.py
"""
CSS Berlin API — FastAPI entry point (v3.1)
Durum: DEVELOPMENT / REPAIR MODE
Güncellemeler:
  - init_db() → App startup'ta tabloları oto-oluştur
  - CORS → Genişletilmiş izinler (Header/Method bloklamayı önlemek için)
  - Health endpoint aktif
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
import uvicorn
import os

app = FastAPI(
    title="CSS Berlin API",
    description="Climate Smart Solutions Backend System",
    version="3.1.0",
)

# ─── CORS AYARLARI (LOCAL FIX) ─────────────────────────────
# Geliştirme modu için tüm engelleri kaldırıp herkese izin veriyoruz.
# Prodüksiyonda bu ayar 'allow_origins' listesine dönmelidir.

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Wildcard allowing ALL origins (Dev Mode Only)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Exception Handler (Hata Yakalayıcı) ────────────────
from fastapi import Request, status
from fastapi.responses import JSONResponse
import traceback

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Tüm yakalanmayan hataları terminale detaylı basar"""
    print("\n" + "="*80)
    print("🚨 UNHANDLED EXCEPTION (KRİTİK HATA):")
    print(f"Path: {request.method} {request.url.path}")
    print(f"Exception: {type(exc).__name__}: {str(exc)}")
    print("\nFull Traceback:")
    traceback.print_exc()
    print("="*80 + "\n")
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": f"{type(exc).__name__}: {str(exc)}"}
    )

# ─── Router Tanımları ────────────────────────────────────
from products import router as products_router
from offers import router as offers_router
from payments import router as payments_router
from auth_oauth import router as auth_oauth_router
from error_logger import router as error_router  # Watchtower Error System
from checkout import router as checkout_router  # Stripe Checkout & Orders

app.include_router(auth_router)
app.include_router(auth_oauth_router)  # OAuth & Magic Link
app.include_router(products_router)
app.include_router(offers_router)
app.include_router(payments_router)
app.include_router(checkout_router)  # Checkout & Order Management
app.include_router(error_router)  # Error Logging API

# ─── Health Endpoints ────────────────────────────────────
@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "CSS Berlin API",
        "mode": "development",
        "version": "3.1.0",
    }

@app.get("/health")
def health():
    return {"status": "ok"}

# ─── Startup: Veritabanı Başlatma ────────────────────────
@app.on_event("startup")
async def startup():
    from auth import init_db
    try:
        await init_db()
        print("[OK] CSS Berlin DB tables ready & verified.")
    except Exception as e:
        print(f"[ERROR] DB Init Failed: {e}")

# ─── Sunucu Başlatma ─────────────────────────────────────
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    # Reload=True ile kodu kaydettiğin an sunucu yenilenir
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)