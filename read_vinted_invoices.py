"""
Vinted gider faturalarını okuyup tablo halinde listeleme
"""
import os
from pathlib import Path
from datetime import datetime
import re

# Klasör yolu (Türkçe karakterler için)
desktop = Path.home() / "Desktop"
base_path = desktop / "belgeler" / "ön muhasebe kayitlari" / "Vinted giderleri - faturalar"

# Klasör yoksa alternatif yolları dene
if not base_path.exists():
    # Farklı encoding ile dene
    try:
        base_path = Path(r"C:\Users\cyhnsrgc\Desktop\belgeler\ön muhasebe kayitlari\Vinted giderleri - faturalar")
    except:
        print(f"HATA: Klasor bulunamadi: {base_path}")
        exit(1)

invoices = []

# Tüm PDF dosyalarını bul
for pdf_file in base_path.rglob("*.pdf"):
    # Klasör yapısından tarih çıkar
    parts = pdf_file.parts
    date_str = None
    
    # Tarih formatları: "01.12.2025", "October 2025", "Dezember 2025"
    for part in reversed(parts):
        # DD.MM.YYYY formatı
        if re.match(r'\d{2}\.\d{2}\.\d{4}', part):
            date_str = part
            break
        # Ay isimleri
        elif part in ["October 2025", "November 2025", "Dezember 2025", "Januar 2026"]:
            # Bu durumda alt klasörden tarih al
            parent_dir = pdf_file.parent.name
            if re.match(r'\d{2}\.\d{2}\.\d{4}', parent_dir):
                date_str = parent_dir
                break
    
    # FRLT numarasını çıkar
    frlt_match = re.search(r'FRLT\s*(\d+)', pdf_file.name)
    frlt = frlt_match.group(1) if frlt_match else ""
    
    # Tarihi parse et
    try:
        if date_str and re.match(r'\d{2}\.\d{2}\.\d{4}', date_str):
            date_obj = datetime.strptime(date_str, "%d.%m.%Y")
            formatted_date = date_obj.strftime("%Y-%m-%d")
        else:
            formatted_date = "Tarih belirlenemedi"
    except:
        formatted_date = date_str or "Tarih belirlenemedi"
    
    invoices.append({
        "Tarih": formatted_date,
        "FRLT_No": frlt,
        "Dosya_Adi": pdf_file.name,
        "Klasor": str(pdf_file.parent.relative_to(base_path))
    })

# Tarihe göre sırala
invoices.sort(key=lambda x: x["Tarih"] if x["Tarih"] != "Tarih belirlenemedi" else "9999-99-99")

# Tablo oluştur
print("=" * 100)
print("VINTED GIDER FATURALARI - EKIM 2025 - OCAK 2026")
print("=" * 100)
print(f"{'No':<5} {'Tarih':<12} {'FRLT No':<15} {'Dosya Adi':<30} {'Klasor':<40}")
print("-" * 100)

for idx, inv in enumerate(invoices, 1):
    print(f"{idx:<5} {inv['Tarih']:<12} {inv['FRLT_No']:<15} {inv['Dosya_Adi']:<30} {inv['Klasor']:<40}")

print("-" * 100)
print(f"TOPLAM FATURA SAYISI: {len(invoices)}")
print("=" * 100)

# CSV olarak kaydet
import csv
csv_path = Path.home() / "Desktop" / "finanzamta gönder" / "Vinted_Gider_Faturalari_Listesi.csv"
csv_path.parent.mkdir(exist_ok=True)

with open(csv_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=["No", "Tarih", "FRLT_No", "Dosya_Adi", "Klasor"])
    writer.writeheader()
    for idx, inv in enumerate(invoices, 1):
        writer.writerow({
            "No": idx,
            "Tarih": inv['Tarih'],
            "FRLT_No": inv['FRLT_No'],
            "Dosya_Adi": inv['Dosya_Adi'],
            "Klasor": inv['Klasor']
        })

print(f"\nCSV dosyasi kaydedildi: {csv_path}")

