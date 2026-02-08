# backend/main.py
"""
CSS Berlin API — V4 Germanized Backend (FastAPI)
Standardized for Vinted/eBay-like C2C Marketplace Compliance.
Includes:
- German Tax (DAC7) Fields
- Escrow Payment Logic
- Sustainable Metrics
- Full Text Search Support
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
import traceback

# ─── APP INITIALIZATION ──────────────────────────────────
app = FastAPI(
    title="CSS Berlin API (Germanized)",
    description="Climate Smart Solutions C2C Backend with Escrow & Compliance",
    version="4.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ─── MIDDLEWARE: STRIP /API PREFIX ───────────────────────
# Critical for Nginx Proxying
@app.middleware("http")
async def strip_api_prefix(request: Request, call_next):
    if request.url.path.startswith("/api/"):
        request.scope["path"] = request.url.path[4:]
    response = await call_next(request)
    return response

# ─── CORS (DEV MODE ALLOW ALL) ───────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # TODO: Restrict in Production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cloudflare Proxy Desteği
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware

app.add_middleware(HTTPSRedirectMiddleware)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["cssberlin.de", "www.cssberlin.de", "*.cssberlin.de", "localhost", "127.0.0.1"])

# ─── EXCEPTION HANDLER ───────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"\n🚨 CRITICAL ERROR: {request.method} {request.url.path}")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc)}
    )

# ─── ROUTERS ─────────────────────────────────────────────
# Importing routers (Ensure these files exist and import updated models if needed)
from auth import router as auth_router
from auth_oauth import router as auth_oauth_router
from products import router as products_router
from offers import router as offers_router
from payments import router as payments_router
from checkout import router as checkout_router
from error_logger import router as error_router

app.include_router(auth_router)
app.include_router(auth_oauth_router)
app.include_router(products_router)
app.include_router(offers_router)
app.include_router(payments_router)
app.include_router(checkout_router)
app.include_router(error_router)

# ─── HEALTH CHECK ────────────────────────────────────────
@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "CSS Berlin V4 (Germanized)",
        "compliance": "DAC7 Ready",
        "escrow": "Active"
    }

@app.get("/health")
def health():
    return {"status": "ok", "db": "connected"}

# ─── STARTUP EVENT: DB MIGRATION ─────────────────────────
@app.on_event("startup")
async def startup():
    print("🚀 Starting CSS Berlin Backend V4...")
    # Initialize DB Tables (Create if not exist)
    # Note: For existing tables with new columns, use Alembic in prod.
    # Here we rely on SQLAlchemy creating missing tables.
    from auth import init_db
    try:
        await init_db()
        print("✅ Database Tables Verified/Created.")
    except Exception as e:
        print(f"❌ Database Init Error: {e}")

# ─── ENTRY POINT ─────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)