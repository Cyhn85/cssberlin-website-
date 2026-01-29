from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database.base import get_db, init_db
from app.models.transaction import Transaction
from app.models.report import Report
from app.models.reminder import Reminder
from app.services.compliance import ComplianceChecker
from app.services.reminders import ReminderService
from app.api import reports, transactions
from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

app = FastAPI(
    title="CSS Berlin Muhasebe Sistemi",
    description="Berlin Finanzamt Uyumlu Profesyonel Muhasebe Sistemi",
    version="1.0.0"
)

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production'da spesifik domain'ler
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router'ları ekle
app.include_router(reports.router)
app.include_router(transactions.router)

# Database initialization
@app.on_event("startup")
async def startup_event():
    init_db()
    print("✅ Database initialized")

# Pydantic modelleri
class TransactionCreate(BaseModel):
    date: date
    platform: str
    transaction_type: str
    description: str
    amount: float
    category: Optional[str] = None
    document_number: Optional[str] = None
    status: Optional[str] = "Tamamlandı"
    notes: Optional[str] = None
    is_business: bool = True
    document_path: Optional[str] = None

class TransactionResponse(BaseModel):
    id: int
    date: date
    platform: str
    transaction_type: str
    description: str
    amount: float
    category: Optional[str]
    document_number: Optional[str]
    status: str
    notes: Optional[str]
    is_business: bool
    
    class Config:
        from_attributes = True

# API Endpoints

@app.get("/")
async def root():
    return {
        "message": "CSS Berlin Muhasebe Sistemi API",
        "version": "1.0.0",
        "status": "running"
    }

# Transaction endpoint'leri artık transactions.py router'ında

@app.get("/api/compliance/kleinunternehmer/{year}")
async def check_kleinunternehmer(
    year: int,
    db: Session = Depends(get_db)
):
    """Kleinunternehmer limiti kontrolü"""
    checker = ComplianceChecker(db)
    return checker.check_kleinunternehmer_limit(year)

@app.get("/api/compliance/accountant/{year}")
async def check_accountant(
    year: int,
    db: Session = Depends(get_db)
):
    """Muhasebeci zorunluluğu kontrolü"""
    checker = ComplianceChecker(db)
    return checker.check_accountant_requirement(year)

@app.get("/api/compliance/{year}")
async def get_all_compliance_checks(
    year: int,
    db: Session = Depends(get_db)
):
    """Tüm uyumluluk kontrolleri"""
    checker = ComplianceChecker(db)
    return checker.get_all_compliance_checks(year)

@app.get("/api/reminders/upcoming")
async def get_upcoming_reminders(
    days: int = 30,
    db: Session = Depends(get_db)
):
    """Yaklaşan hatırlatmalar"""
    service = ReminderService(db)
    reminders = service.get_upcoming_reminders(days)
    return [
        {
            "id": r.id,
            "type": r.reminder_type,
            "title": r.title,
            "description": r.description,
            "due_date": r.due_date.isoformat(),
            "is_urgent": r.is_urgent,
            "days_until_due": r.days_until_due(),
            "is_overdue": r.is_overdue()
        }
        for r in reminders
    ]

@app.get("/api/reminders/overdue")
async def get_overdue_reminders(
    db: Session = Depends(get_db)
):
    """Gecikmiş hatırlatmalar"""
    service = ReminderService(db)
    reminders = service.get_overdue_reminders()
    return [
        {
            "id": r.id,
            "type": r.reminder_type,
            "title": r.title,
            "description": r.description,
            "due_date": r.due_date.isoformat(),
            "is_urgent": True,
            "days_overdue": (date.today() - r.due_date).days
        }
        for r in reminders
    ]

@app.get("/api/stats/summary")
async def get_summary_stats(
    year: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Özet istatistikler"""
    if not year:
        year = date.today().year
    
    start_date = date(year, 1, 1)
    end_date = date(year, 12, 31)
    
    transactions = db.query(Transaction).filter(
        Transaction.date >= start_date,
        Transaction.date <= end_date,
        Transaction.is_business == True
    ).all()
    
    total_income = sum(t.amount for t in transactions if t.transaction_type == "Gelir")
    total_expense = sum(abs(t.amount) for t in transactions if t.transaction_type == "Gider")
    net_result = total_income - total_expense
    
    # Platform bazlı
    platforms = {}
    for t in transactions:
        if t.platform not in platforms:
            platforms[t.platform] = {"income": 0, "expense": 0}
        if t.transaction_type == "Gelir":
            platforms[t.platform]["income"] += t.amount
        else:
            platforms[t.platform]["expense"] += abs(t.amount)
    
    return {
        "year": year,
        "total_income": total_income,
        "total_expense": total_expense,
        "net_result": net_result,
        "platforms": platforms,
        "transaction_count": len(transactions)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

