# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
import uvicorn
import os

app = FastAPI(
    title="CSS Berlin API",
    description="Climate Smart Solutions Backend System",
    version="2.1.0"
)

# --- CORS Ayarları (Frontend'in Backend'e erişmesi için) ---
origins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    "https://cssberlin.de",
    "https://www.cssberlin.de",
    "https://cssberlin-website.pages.dev"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Geliştirme aşamasında tüm kaynaklara izin ver
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Router Bağlantısı ---
app.include_router(auth_router)

# --- Ana Endpoint ---
@app.get("/")
def read_root():
    return {"status": "online", "message": "CSS Berlin Backend System Operational"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)