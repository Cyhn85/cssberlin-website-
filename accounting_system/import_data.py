"""
Finanzamt verilerini CSV'den okuyup veritabanına ekleme scripti
"""
import csv
import requests
from datetime import datetime
from typing import Dict, List

API_BASE = "http://localhost:8000/api"

def parse_date(date_str: str) -> str:
    """CSV tarihini ISO formatına çevir"""
    try:
        # YYYY-MM-DD formatı
        if len(date_str) == 10 and date_str.count('-') == 2:
            return date_str
        # Diğer formatlar için
        dt = datetime.strptime(date_str, "%d.%m.%Y")
        return dt.strftime("%Y-%m-%d")
    except:
        return date_str

def import_transactions_from_csv(csv_path: str):
    """CSV dosyasından işlemleri oku ve API'ye ekle"""
    transactions = []
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Boş satırları atla
            if not row.get('Datum') or row.get('Datum').startswith('TOPLAM'):
                continue
            
            # Tarih parse et
            date_str = parse_date(row['Datum'].strip())
            
            # Betrag parse et
            try:
                amount = float(row['Betrag'].replace(',', '.'))
            except:
                continue
            
            # Transaction type belirle
            transaction_type = "Gelir" if amount >= 0 else "Gider"
            
            # İş/Özel ayrımı
            is_business = row.get('Business/Private', 'İŞ').strip() == 'İŞ'
            
            transaction = {
                "date": date_str,
                "platform": row.get('Platform', '').strip(),
                "transaction_type": transaction_type,
                "description": row.get('Beschreibung', '').strip(),
                "amount": abs(amount) if transaction_type == "Gider" else amount,
                "category": row.get('Kategorie', '').strip(),
                "document_number": row.get('Belegnummer', '').strip() or None,
                "status": row.get('Status', 'Tamamlandı').strip(),
                "notes": row.get('Notizen', '').strip() or None,
                "is_business": is_business
            }
            
            transactions.append(transaction)
    
    # API'ye ekle
    added = 0
    errors = 0
    
    for trans in transactions:
        try:
            response = requests.post(f"{API_BASE}/transactions", json=trans)
            if response.status_code == 200:
                added += 1
            else:
                print(f"Hata: {trans['description']} - {response.status_code}")
                errors += 1
        except Exception as e:
            print(f"Hata: {trans['description']} - {str(e)}")
            errors += 1
    
    print(f"\n[OK] {added} islem eklendi")
    print(f"[HATA] {errors} hata")
    
    return added, errors

if __name__ == "__main__":
    import sys
    csv_path = sys.argv[1] if len(sys.argv) > 1 else "../Gelir_Gider_Ana_Tablo_TEMIZLENMIS.csv"
    print(f"CSV dosyasi okunuyor: {csv_path}")
    import_transactions_from_csv(csv_path)

