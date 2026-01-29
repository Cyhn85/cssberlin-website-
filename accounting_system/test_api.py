"""
API Server Test Script'i
API endpoint'lerini test eder
"""

import requests
import json
from datetime import date

BASE_URL = "http://localhost:8000"

def test_root():
    """Root endpoint test"""
    print("[TEST] Root endpoint test ediliyor...")
    response = requests.get(f"{BASE_URL}/")
    assert response.status_code == 200
    data = response.json()
    print(f"[OK] Root endpoint: {data['message']}")
    return True

def test_create_transaction():
    """Transaction oluşturma test"""
    print("\n[TEST] Transaction olusturma test ediliyor...")
    
    transaction_data = {
        "date": "2025-12-15",
        "platform": "Vinted",
        "transaction_type": "Gelir",
        "description": "API Test Satis",
        "amount": 50.00,
        "category": "Satis",
        "document_number": "API-TEST-001",
        "is_business": True
    }
    
    response = requests.post(
        f"{BASE_URL}/api/transactions",
        json=transaction_data
    )
    
    assert response.status_code == 200
    data = response.json()
    print(f"[OK] Transaction olusturuldu: ID={data['id']}, Amount={data['amount']}EUR")
    return data['id']

def test_get_transactions():
    """Transaction listesi test"""
    print("\n[TEST] Transaction listesi test ediliyor...")
    
    response = requests.get(f"{BASE_URL}/api/transactions")
    assert response.status_code == 200
    data = response.json()
    print(f"[OK] {len(data)} transaction bulundu")
    return data

def test_compliance_check():
    """Compliance check test"""
    print("\n[TEST] Compliance check test ediliyor...")
    
    response = requests.get(f"{BASE_URL}/api/compliance/kleinunternehmer/2025")
    assert response.status_code == 200
    data = response.json()
    print(f"[OK] Kleinunternehmer kontrolu:")
    print(f"   - Toplam Gelir: {data['total_income']}EUR")
    print(f"   - Limit: {data['limit']}EUR")
    print(f"   - Limit Altinda: {data['is_under_limit']}")
    return True

def test_reminders():
    """Reminders test"""
    print("\n[TEST] Reminders test ediliyor...")
    
    response = requests.get(f"{BASE_URL}/api/reminders/upcoming?days=30")
    assert response.status_code == 200
    data = response.json()
    print(f"[OK] Yaklasan hatirlatmalar: {len(data)} adet")
    return True

def test_summary_stats():
    """Summary stats test"""
    print("\n[TEST] Ozet istatistikler test ediliyor...")
    
    response = requests.get(f"{BASE_URL}/api/stats/summary?year=2025")
    assert response.status_code == 200
    data = response.json()
    print(f"[OK] Istatistikler:")
    print(f"   - Toplam Gelir: {data['total_income']}EUR")
    print(f"   - Toplam Gider: {data['total_expense']}EUR")
    print(f"   - Net Sonuc: {data['net_result']}EUR")
    return True

def main():
    """Ana test fonksiyonu"""
    print("=" * 60)
    print("API SERVER TEST SUITI")
    print("=" * 60)
    print("\nNOT: API server'in calisiyor olmasi gerekiyor!")
    print("Server'i baslatmak icin: uvicorn app.main:app --reload\n")
    
    try:
        # Server kontrolü
        try:
            test_root()
        except requests.exceptions.ConnectionError:
            print("\n[ERROR] API server calisiyor degil!")
            print("Lutfen once server'i baslatin:")
            print("  cd accounting_system")
            print("  set DATABASE_URL=sqlite:///./test_accounting.db")
            print("  python -m uvicorn app.main:app --reload")
            return
        
        # Testler
        transaction_id = test_create_transaction()
        test_get_transactions()
        test_compliance_check()
        test_reminders()
        test_summary_stats()
        
        print("\n" + "=" * 60)
        print("[SUCCESS] TUM API TESTLERI BASARILI!")
        print("=" * 60)
        print(f"\nSwagger UI: {BASE_URL}/docs")
        print(f"ReDoc: {BASE_URL}/redoc")
        
    except Exception as e:
        print(f"\n[ERROR] HATA: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()

