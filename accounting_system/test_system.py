"""
Muhasebe Sistemi Test Script'i
SQLite ile test edilebilir (PostgreSQL gerekmez)
"""

import os
import sys
from datetime import date
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# SQLite database kullan (test için)
os.environ["DATABASE_URL"] = "sqlite:///./test_accounting.db"

# Import etmeden önce DATABASE_URL set edilmeli
from app.database.base import Base, get_db
from app.models.transaction import Transaction
from app.models.report import Report
from app.models.reminder import Reminder
from app.services.compliance import ComplianceChecker
from app.services.reminders import ReminderService

def test_database_setup():
    """Database kurulumunu test et"""
    print("[TEST] Database kurulumu test ediliyor...")
    
    # SQLite engine oluştur
    engine = create_engine("sqlite:///./test_accounting.db", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    print("[OK] Database tablolari olusturuldu")
    return db

def test_transaction_crud(db):
    """Transaction CRUD işlemlerini test et"""
    print("\n[TEST] Transaction CRUD test ediliyor...")
    
    # Test transaction oluştur
    test_transaction = Transaction(
        date=date(2025, 12, 15),
        platform="Vinted",
        transaction_type="Gelir",
        description="Test Satış",
        amount=50.00,
        category="Satış",
        document_number="TEST-001",
        status="Tamamlandı",
        notes="Test işlemi",
        is_business=True
    )
    
    db.add(test_transaction)
    db.commit()
    db.refresh(test_transaction)
    
    print(f"[OK] Transaction olusturuldu: ID={test_transaction.id}, Amount={test_transaction.amount}EUR")
    
    # Transaction oku
    found = db.query(Transaction).filter(Transaction.id == test_transaction.id).first()
    assert found is not None, "Transaction bulunamadi!"
    print(f"[OK] Transaction okundu: {found.description}")
    
    # Transaction güncelle
    found.amount = 60.00
    db.commit()
    print(f"[OK] Transaction guncellendi: Yeni amount={found.amount}EUR")
    
    # Transaction sil
    db.delete(found)
    db.commit()
    print("[OK] Transaction silindi")
    
    return True

def test_compliance_checker(db):
    """Compliance checker'ı test et"""
    print("\n[TEST] Compliance checker test ediliyor...")
    
    # Test verileri ekle
    test_transactions = [
        Transaction(
            date=date(2025, 1, 15),
            platform="Vinted",
            transaction_type="Gelir",
            description="Test Satış 1",
            amount=1000.00,
            is_business=True
        ),
        Transaction(
            date=date(2025, 2, 20),
            platform="eBay",
            transaction_type="Gelir",
            description="Test Satış 2",
            amount=500.00,
            is_business=True
        ),
    ]
    
    for t in test_transactions:
        db.add(t)
    db.commit()
    
    # Compliance check
    checker = ComplianceChecker(db)
    result = checker.check_kleinunternehmer_limit(2025)
    
    print(f"[OK] Kleinunternehmer kontrolu:")
    print(f"   - Toplam Gelir: {result['total_income']}EUR")
    print(f"   - Limit: {result['limit']}EUR")
    print(f"   - Limit Altinda: {result['is_under_limit']}")
    print(f"   - Kullanim: {result['percentage_used']:.2f}%")
    
    # Test verilerini temizle
    for t in test_transactions:
        db.delete(t)
    db.commit()
    
    return True

def test_reminder_service(db):
    """Reminder service'i test et"""
    print("\n[TEST] Reminder service test ediliyor...")
    
    service = ReminderService(db)
    
    # Beyanname hatırlatmaları oluştur
    reminders = service.create_beyanname_reminders(2025)
    
    for reminder in reminders[:3]:  # İlk 3'ünü göster
        db.add(reminder)
    db.commit()
    
    print(f"[OK] {len(reminders)} hatirlatma olusturuldu")
    
    # Yaklaşan hatırlatmaları getir
    upcoming = service.get_upcoming_reminders(90)
    print(f"[OK] Yaklasan hatirlatmalar: {len(upcoming)} adet")
    
    for r in upcoming[:3]:
        print(f"   - {r.title} (Due: {r.due_date})")
    
    # Test verilerini temizle
    for r in reminders[:3]:
        db.delete(r)
    db.commit()
    
    return True

def test_summary_stats(db):
    """Özet istatistikleri test et"""
    print("\n[TEST] Ozet istatistikler test ediliyor...")
    
    # Test verileri
    test_data = [
        Transaction(date=date(2025, 12, 1), platform="Vinted", transaction_type="Gelir", description="Test Vinted Satis", amount=50.00, is_business=True),
        Transaction(date=date(2025, 12, 2), platform="eBay", transaction_type="Gelir", description="Test eBay Satis", amount=70.00, is_business=True),
        Transaction(date=date(2025, 12, 3), platform="Deutsche Bank", transaction_type="Gider", description="Test Gider", amount=-20.00, is_business=True),
    ]
    
    for t in test_data:
        db.add(t)
    db.commit()
    
    # İstatistikleri hesapla
    transactions = db.query(Transaction).filter(
        Transaction.date >= date(2025, 12, 1),
        Transaction.date <= date(2025, 12, 31),
        Transaction.is_business == True
    ).all()
    
    total_income = sum(t.amount for t in transactions if t.transaction_type == "Gelir")
    total_expense = sum(abs(t.amount) for t in transactions if t.transaction_type == "Gider")
    net_result = total_income - total_expense
    
    print(f"[OK] Istatistikler:")
    print(f"   - Toplam Gelir: {total_income}EUR")
    print(f"   - Toplam Gider: {total_expense}EUR")
    print(f"   - Net Sonuc: {net_result}EUR")
    
    # Test verilerini temizle
    for t in test_data:
        db.delete(t)
    db.commit()
    
    return True

def main():
    """Ana test fonksiyonu"""
    import sys
    import io
    # Windows encoding sorunu için
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    
    print("=" * 60)
    print("MUHASEBE SISTEMI TEST SUITI")
    print("=" * 60)
    
    try:
        # Database kurulumu
        db = test_database_setup()
        
        # Testler
        test_transaction_crud(db)
        test_compliance_checker(db)
        test_reminder_service(db)
        test_summary_stats(db)
        
        print("\n" + "=" * 60)
        print("[SUCCESS] TUM TESTLER BASARILI!")
        print("=" * 60)
        
        # Database dosyasını temizle (opsiyonel - otomatik test için skip)
        # cleanup = input("\nTest database dosyasini silmek ister misiniz? (y/n): ")
        # if cleanup.lower() == 'y':
        #     if os.path.exists("./test_accounting.db"):
        #         os.remove("./test_accounting.db")
        #         print("[OK] Test database silindi")
        
    except Exception as e:
        print(f"\n[ERROR] HATA: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()

