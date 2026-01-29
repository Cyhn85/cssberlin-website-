from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.base import get_db
from app.models.transaction import Transaction
from app.services.duplicate_detector import DuplicateDetector
from app.main import TransactionCreate, TransactionResponse
from typing import List, Optional
from datetime import date

router = APIRouter(prefix="/api/transactions", tags=["transactions"])

@router.get("", response_model=List[TransactionResponse])
async def get_transactions(
    skip: int = 0,
    limit: int = 100,
    is_business: Optional[bool] = None,
    platform: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    """Tüm işlemleri getir"""
    query = db.query(Transaction)
    
    if is_business is not None:
        query = query.filter(Transaction.is_business == is_business)
    
    if platform:
        query = query.filter(Transaction.platform == platform)
    
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    
    transactions = query.order_by(Transaction.date.desc()).offset(skip).limit(limit).all()
    return transactions

@router.post("", response_model=TransactionResponse)
async def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db)
):
    """Yeni işlem ekle"""
    db_transaction = Transaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@router.get("/duplicates")
async def find_duplicates(
    db: Session = Depends(get_db)
):
    """Tekrar eden işlemleri bul"""
    detector = DuplicateDetector(db)
    duplicates = detector.find_duplicates()
    
    return {
        "count": len(duplicates),
        "duplicates": [
            {
                "transaction1": {
                    "id": t1.id,
                    "date": t1.date.isoformat(),
                    "amount": t1.amount,
                    "description": t1.description
                },
                "transaction2": {
                    "id": t2.id,
                    "date": t2.date.isoformat(),
                    "amount": t2.amount,
                    "description": t2.description
                }
            }
            for t1, t2 in duplicates
        ]
    }

@router.post("/remove-duplicates")
async def remove_duplicates(
    keep_first: bool = True,
    db: Session = Depends(get_db)
):
    """Tekrar eden işlemleri otomatik temizle"""
    detector = DuplicateDetector(db)
    removed_count = detector.auto_remove_duplicates(keep_first)
    
    return {
        "message": f"{removed_count} tekrar eden işlem temizlendi",
        "removed_count": removed_count
    }

