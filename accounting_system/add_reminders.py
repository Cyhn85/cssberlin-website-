"""
Finanzamt hatırlatmalarını ekleme scripti
"""
import requests
from datetime import date, timedelta

API_BASE = "http://localhost:8000/api"

reminders = [
    {
        "reminder_type": "Beyanname",
        "title": "EÜR Beyannamesi - 2025 Yılı",
        "description": "2025 yılı için yıllık EÜR beyannamesi hazırlanmalı ve Finanzamt'a gönderilmeli. Son tarih: 31.07.2026",
        "due_date": "2026-07-31",
        "is_urgent": False
    },
    {
        "reminder_type": "Beyanname",
        "title": "Finanzamt Cevap Dilekçesi",
        "description": "Finanzamt Spandau'ya cevap dilekçesi gönderilmeli. Son tarih: 16.01.2026",
        "due_date": "2026-01-16",
        "is_urgent": True
    },
    {
        "reminder_type": "Ödeme",
        "title": "Klarna Taksit Ödemeleri",
        "description": "Klarna taksitli alımların ödemeleri takip edilmeli",
        "due_date": "2026-01-15",
        "is_urgent": False
    },
    {
        "reminder_type": "Limit Uyarısı",
        "title": "Kleinunternehmer Limit Kontrolü",
        "description": "Yıllık ciro 22.500€ limitini aşmamalı (2026)",
        "due_date": "2026-12-31",
        "is_urgent": False
    }
]

def add_reminders():
    added = 0
    errors = 0
    
    for reminder in reminders:
        try:
            response = requests.post(f"{API_BASE}/reminders", json=reminder)
            if response.status_code == 200:
                added += 1
                print(f"[OK] Hatirlatma eklendi: {reminder['title']}")
            else:
                print(f"[HATA] {reminder['title']} - {response.status_code}")
                errors += 1
        except Exception as e:
            print(f"[HATA] {reminder['title']} - {str(e)}")
            errors += 1
    
    print(f"\n[OK] {added} hatirlatma eklendi")
    print(f"[HATA] {errors} hata")

if __name__ == "__main__":
    add_reminders()

