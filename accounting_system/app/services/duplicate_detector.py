from sqlalchemy.orm import Session
from app.models.transaction import Transaction
from datetime import date, timedelta
from typing import List, Tuple

class DuplicateDetector:
    """Tekrar eden işlemleri tespit etme servisi"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def find_duplicates(self, tolerance_days: int = 1, tolerance_amount: float = 0.01) -> List[Tuple[Transaction, Transaction]]:
        """Tekrar eden işlemleri bul"""
        transactions = self.db.query(Transaction).filter(
            Transaction.is_business == True
        ).order_by(Transaction.date).all()
        
        duplicates = []
        checked = set()
        
        for i, t1 in enumerate(transactions):
            if i in checked:
                continue
            
            for j, t2 in enumerate(transactions[i+1:], start=i+1):
                if j in checked:
                    continue
                
                # Aynı platform, aynı tutar, yakın tarih
                if (t1.platform == t2.platform and
                    abs(t1.amount - t2.amount) < tolerance_amount and
                    abs((t1.date - t2.date).days) <= tolerance_days and
                    t1.description == t2.description):
                    
                    duplicates.append((t1, t2))
                    checked.add(i)
                    checked.add(j)
        
        return duplicates
    
    def auto_remove_duplicates(self, keep_first: bool = True) -> int:
        """Otomatik olarak tekrarları temizle"""
        duplicates = self.find_duplicates()
        removed_count = 0
        
        for t1, t2 in duplicates:
            # İlkini tut, ikincisini sil
            to_remove = t1 if not keep_first else t2
            self.db.delete(to_remove)
            removed_count += 1
        
        if removed_count > 0:
            self.db.commit()
        
        return removed_count

