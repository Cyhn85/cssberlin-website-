"""
Vinted PDF faturalarından tutarları çıkarma
"""
import os
from pathlib import Path
from datetime import datetime
import re
import pdfplumber
import csv

# Klasör yolu
base_path = Path(r"C:\Users\cyhnsrgc\Desktop\belgeler\ön muhasebe kayitlari\Vinted giderleri - faturalar")

invoices = []

# Tüm PDF dosyalarını bul
for pdf_file in base_path.rglob("*.pdf"):
    # Klasör yapısından tarih çıkar
    parts = pdf_file.parts
    date_str = None
    
    for part in reversed(parts):
        # Hem "01.12.2025" hem de "6.11.2025" formatlarını destekle
        if re.match(r'\d{1,2}\.\d{1,2}\.\d{4}', part):
            date_str = part
            break
        elif part in ["October 2025", "November 2025", "Dezember 2025", "Januar 2026"]:
            parent_dir = pdf_file.parent.name
            if re.match(r'\d{1,2}\.\d{1,2}\.\d{4}', parent_dir):
                date_str = parent_dir
                break
    
    # FRLT numarasını çıkar
    frlt_match = re.search(r'FRLT\s*(\d+)', pdf_file.name)
    frlt = frlt_match.group(1) if frlt_match else ""
    
    # Tarihi parse et
    try:
        if date_str and re.match(r'\d{1,2}\.\d{1,2}\.\d{4}', date_str):
            # Hem "01.12.2025" hem de "6.11.2025" formatlarını destekle
            date_obj = datetime.strptime(date_str, "%d.%m.%Y")
            formatted_date = date_obj.strftime("%Y-%m-%d")
        else:
            formatted_date = "Tarih belirlenemedi"
    except Exception as e:
        formatted_date = date_str or "Tarih belirlenemedi"
    
    # PDF'den tutarı çıkar
    amount = None
    try:
        with pdfplumber.open(pdf_file) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() or ""
            
            # Euro tutarını bul (€, EUR, Euro)
            # Örnek: "15,99 €", "15.99 EUR", "Total: 15,99"
            patterns = [
                r'(\d+[.,]\d+)\s*€',
                r'(\d+[.,]\d+)\s*EUR',
                r'Total[:\s]+(\d+[.,]\d+)',
                r'Betrag[:\s]+(\d+[.,]\d+)',
                r'Amount[:\s]+(\d+[.,]\d+)',
                r'€\s*(\d+[.,]\d+)',
                r'(\d+[.,]\d+)\s*Euro',
            ]
            
            for pattern in patterns:
                matches = re.findall(pattern, text, re.IGNORECASE)
                if matches:
                    # Son eşleşmeyi al (genelde toplam tutar)
                    amount_str = matches[-1].replace(',', '.')
                    try:
                        amount = float(amount_str)
                        break
                    except:
                        continue
            
            # Eğer bulunamadıysa, tüm sayıları kontrol et
            if amount is None:
                numbers = re.findall(r'\d+[.,]\d+', text)
                if numbers:
                    # En büyük sayıyı al (genelde toplam tutar)
                    amounts = [float(n.replace(',', '.')) for n in numbers]
                    if amounts:
                        amount = max(amounts)
    except Exception as e:
        amount = None
    
    invoices.append({
        "Tarih": formatted_date,
        "FRLT_No": frlt,
        "Tutar_EUR": amount if amount else "Bulunamadi",
        "Dosya_Adi": pdf_file.name,
        "Klasor": str(pdf_file.parent.relative_to(base_path))
    })

# Tarihe göre sırala
invoices.sort(key=lambda x: x["Tarih"] if x["Tarih"] != "Tarih belirlenemedi" else "9999-99-99")

# Masaüstünde cfinanz klasörü oluştur
desktop = Path.home() / "Desktop"
cfinanz_path = desktop / "cfinanz"
cfinanz_path.mkdir(exist_ok=True)

# CSV olarak kaydet
csv_path = cfinanz_path / "vinted komisyonlari.csv"

with open(csv_path, 'w', newline='', encoding='utf-8-sig') as f:
    writer = csv.DictWriter(f, fieldnames=["No", "Tarih", "FRLT_No", "Tutar_EUR", "Dosya_Adi", "Klasor"])
    writer.writeheader()
    for idx, inv in enumerate(invoices, 1):
        writer.writerow({
            "No": idx,
            "Tarih": inv['Tarih'],
            "FRLT_No": inv['FRLT_No'],
            "Tutar_EUR": inv['Tutar_EUR'] if isinstance(inv['Tutar_EUR'], (int, float)) else inv['Tutar_EUR'],
            "Dosya_Adi": inv['Dosya_Adi'],
            "Klasor": inv['Klasor']
        })

# Özet tablo
print("=" * 120)
print("VINTED GIDER FATURALARI - TUTARLAR ILE")
print("=" * 120)
print(f"{'No':<5} {'Tarih':<12} {'FRLT No':<15} {'Tutar (EUR)':<15} {'Dosya Adi':<30} {'Klasor':<30}")
print("-" * 120)

total_amount = 0
found_count = 0

for idx, inv in enumerate(invoices, 1):
    amount_str = f"{inv['Tutar_EUR']:.2f}" if isinstance(inv['Tutar_EUR'], (int, float)) else inv['Tutar_EUR']
    if isinstance(inv['Tutar_EUR'], (int, float)):
        total_amount += inv['Tutar_EUR']
        found_count += 1
    
    print(f"{idx:<5} {inv['Tarih']:<12} {inv['FRLT_No']:<15} {amount_str:<15} {inv['Dosya_Adi']:<30} {inv['Klasor']:<30}")

print("-" * 120)
print(f"TOPLAM FATURA SAYISI: {len(invoices)}")
print(f"TUTAR BULUNAN FATURA: {found_count}")
print(f"TOPLAM TUTAR: {total_amount:.2f} EUR")
print("=" * 120)
print(f"\nCSV dosyasi kaydedildi: {csv_path}")

