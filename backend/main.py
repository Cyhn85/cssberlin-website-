# backend/main.py
"""
CSS Berlin API — FastAPI entry point (v3)
Değişiklikler:
  - init_db() → app startup'ta tabloları oto-oluştur
  - CORS → production URL listesi (wildcard kaldırıldı)
  - health endpoint eklendi
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
import uvicorn
import os

app = FastAPI(
    title="CSS Berlin API",
    description="Climate Smart Solutions Backend System",
    version="3.0.0",
)

# ─── CORS ───────────────────────────────────────────────
# Production'da sadece bilinen origin'lere izin ver.
# Geliştirme için localhost ekli.
origins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    "http://localhost:8000",
    "https://cssberlin.de",
    "https://www.cssberlin.de",
    "https://cssberlin-website.pages.dev",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # ← wildcard "*" kaldırıldı
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# ─── Routers ─────────────────────────────────────────────
from products import router as products_router
from offers import router as offers_router

app.include_router(auth_router)
app.include_router(products_router)
app.include_router(offers_router)

# ─── Ana / Health Endpoints ──────────────────────────────
@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "CSS Berlin API",
        "version": "3.0.0",
    }


@app.get("/health")
def health():
    return {"status": "ok"}


# ─── Startup: DB tabloları oto-oluştur ───────────────────
@app.on_event("startup")
async def startup():
    from auth import init_db
    await init_db()
    print("✅ CSS Berlin DB tabloları hazır.")


# ─── Çalıştırma ──────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
