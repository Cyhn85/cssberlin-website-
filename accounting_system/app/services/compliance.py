from datetime import date
from sqlalchemy.orm import Session
from app.models.transaction import Transaction
from typing import Dict, List

class ComplianceChecker:
    """Berlin Finanzamt yasalarına uyumluluk kontrolü"""
    
    # Limitler (2025/2026)
    KLEINUNTERNEHMER_LIMIT = 22500.0  # €/yıl
    MUHASEBECI_CIRO_LIMIT = 600000.0  # €/yıl
    MUHASEBECI_KAR_LIMIT = 60000.0  # €/yıl
    
    def __init__(self, db: Session):
        self.db = db
    
    def check_kleinunternehmer_limit(self, year: int) -> Dict:
        """Kleinunternehmer limiti kontrolü"""
        start_date = date(year, 1, 1)
        end_date = date(year, 12, 31)
        
        transactions = self.db.query(Transaction).filter(
            Transaction.date >= start_date,
            Transaction.date <= end_date,
            Transaction.transaction_type == "Gelir",
            Transaction.is_business == True
        ).all()
        
        total_income = sum(t.amount for t in transactions)
        
        is_under_limit = total_income < self.KLEINUNTERNEHMER_LIMIT
        percentage = (total_income / self.KLEINUNTERNEHMER_LIMIT) * 100
        
        return {
            "year": year,
            "total_income": total_income,
            "limit": self.KLEINUNTERNEHMER_LIMIT,
            "is_under_limit": is_under_limit,
            "percentage_used": percentage,
            "remaining": self.KLEINUNTERNEHMER_LIMIT - total_income,
            "warning": percentage > 80,
            "critical": percentage > 95
        }
    
    def check_accountant_requirement(self, year: int) -> Dict:
        """Muhasebeci tutma zorunluluğu kontrolü"""
        start_date = date(year, 1, 1)
        end_date = date(year, 12, 31)
        
        transactions = self.db.query(Transaction).filter(
            Transaction.date >= start_date,
            Transaction.date <= end_date,
            Transaction.is_business == True
        ).all()
        
        total_income = sum(t.amount for t in transactions if t.transaction_type == "Gelir")
        total_expense = sum(abs(t.amount) for t in transactions if t.transaction_type == "Gider")
        profit = total_income - total_expense
        
        requires_accountant = (
            total_income >= self.MUHASEBECI_CIRO_LIMIT or
            profit >= self.MUHASEBECI_KAR_LIMIT
        )
        
        return {
            "year": year,
            "total_income": total_income,
            "total_expense": total_expense,
            "profit": profit,
            "requires_accountant": requires_accountant,
            "reason": "Ciro limiti" if total_income >= self.MUHASEBECI_CIRO_LIMIT else 
                     "Kar limiti" if profit >= self.MUHASEBECI_KAR_LIMIT else None
        }
    
    def get_all_compliance_checks(self, year: int) -> Dict:
        """Tüm uyumluluk kontrollerini döndür"""
        kleinunternehmer = self.check_kleinunternehmer_limit(year)
        accountant = self.check_accountant_requirement(year)
        
        return {
            "kleinunternehmer": kleinunternehmer,
            "accountant_requirement": accountant,
            "all_ok": kleinunternehmer["is_under_limit"] and not accountant["requires_accountant"]
        }

