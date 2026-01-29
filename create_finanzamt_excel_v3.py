"""
Finanzamt için detaylı Excel dosyası - Flohmarkt ve cssberlin.de çıkarıldı
2025-2026 mali yasalarına uygun
"""
import pandas as pd
from datetime import datetime
import os

# CSV dosyalarını oku
main_csv = "Gelir_Gider_Ana_Tablo_TEMIZLENMIS.csv"
vinted_csv = "Vinted_T_Cetveli.csv"
ebay_csv = "eBay_T_Cetveli.csv"
kleinanzeigen_csv = "Kleinanzeigen_T_Cetveli.csv"

# Ana tablo
df_main = pd.read_csv(main_csv, encoding='utf-8')
df_main = df_main[df_main['Business/Private'] == 'İŞ'].copy()

# Flohmarkt işlemlerini çıkart
df_main = df_main[~df_main['Beschreibung'].str.contains('Flohmarkt|FLOHMARKT', case=False, na=False)]
df_main = df_main[~df_main['Notizen'].str.contains('Flohmarkt|FLOHMARKT', case=False, na=False)]
df_main = df_main[~df_main['Beschreibung'].str.contains('Bargeldeinzahlung', case=False, na=False)]

# cssberlin.de için işlem yok, zaten belirtilmişti

df_main['Datum'] = pd.to_datetime(df_main['Datum'], errors='coerce')

# Platform CSV'leri
df_vinted = pd.read_csv(vinted_csv, encoding='utf-8')
df_ebay = pd.read_csv(ebay_csv, encoding='utf-8')
df_kleinanzeigen = pd.read_csv(kleinanzeigen_csv, encoding='utf-8')

# Kleinanzeigen'den Flohmarkt satışlarını çıkart
df_kleinanzeigen = df_kleinanzeigen[~df_kleinanzeigen['Beschreibung'].str.contains('Flohmarkt|FLOHMARKT', case=False, na=False)]

# Amazon giderlerini filtrele
df_amazon = df_main[df_main['Platform'].str.contains('Amazon', case=False, na=False)].copy()

# Deutsche Bank Auszahlung işlemleri (sadece platform gelirleri)
db_auszahlung = df_main[
    (df_main['Platform'] == 'Deutsche Bank') & 
    (df_main['Beschreibung'].str.contains('Mangopay|eBay S\.a\.r\.l\.', case=False, na=False))
].copy()

# Masaüstü klasörü
desktop_path = os.path.join(os.path.expanduser("~"), "Desktop", "finanzamta gönder")
os.makedirs(desktop_path, exist_ok=True)

excel_path = os.path.join(desktop_path, "Finanzamt_Platform_Detayli_Tablo_03.xlsx")

with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
    # 1. ANA SAYFA - Tüm Platformlar Toplamı
    df_main_sorted = df_main.sort_values('Datum')
    
    # Özet satırları ekle
    total_income = df_main[df_main['Betrag'] > 0]['Betrag'].sum()
    total_expense = abs(df_main[df_main['Betrag'] < 0]['Betrag'].sum())
    net_result = df_main['Betrag'].sum()
    
    summary_rows = pd.DataFrame({
        'Datum': ['', '', 'TOPLAM', 'TOPLAM', 'TOPLAM'],
        'Platform': ['', '', '', '', ''],
        'Transaktionstyp': ['', '', '', '', ''],
        'Beschreibung': ['', '', 'TOPLAM GELIR', 'TOPLAM GIDER', 'NET KAR/ZARAR'],
        'Betrag': ['', '', total_income, -total_expense, net_result],
        'Kategorie': ['', '', '', '', ''],
        'Belegnummer': ['', '', '', '', ''],
        'Status': ['', '', '', '', ''],
        'Notizen': ['', '', '', '', ''],
        'Business/Private': ['', '', '', '', '']
    })
    
    df_main_sorted = pd.concat([df_main_sorted, summary_rows], ignore_index=True)
    df_main_sorted.to_excel(writer, sheet_name='TOPLAM', index=False)
    
    # 2. VINTED SAYFASI
    df_vinted_sorted = df_vinted.sort_values('Datum')
    df_vinted_sorted.to_excel(writer, sheet_name='VINTED', index=False)
    
    # 3. EBAY SAYFASI
    df_ebay_sorted = df_ebay.sort_values('Datum')
    df_ebay_sorted.to_excel(writer, sheet_name='EBAY', index=False)
    
    # 4. KLEINANZEIGEN SAYFASI (Flohmarkt çıkarıldı)
    df_kleinanzeigen_sorted = df_kleinanzeigen.sort_values('Datum')
    df_kleinanzeigen_sorted.to_excel(writer, sheet_name='KLEINANZEIGEN', index=False)
    
    # 5. AMAZON SAYFASI (Sadece Giderler)
    if not df_amazon.empty:
        df_amazon_sorted = df_amazon.sort_values('Datum')
        df_amazon_sorted.to_excel(writer, sheet_name='AMAZON', index=False)
    
    # 6. DEUTSCHE BANK AUSZAHLUNG İŞLEMLERİ
    if not db_auszahlung.empty:
        db_auszahlung_sorted = db_auszahlung.sort_values('Datum')
        db_auszahlung_sorted.to_excel(writer, sheet_name='DEUTSCHE_BANK_AUSZAHLUNG', index=False)
    
    # 7. ÖZET SAYFASI
    vinted_income = df_main[df_main['Platform'] == 'Vinted']['Betrag'].apply(lambda x: x if x > 0 else 0).sum()
    vinted_expense = abs(df_main[df_main['Platform'] == 'Vinted']['Betrag'].apply(lambda x: x if x < 0 else 0).sum())
    
    ebay_income = df_main[df_main['Platform'] == 'eBay']['Betrag'].apply(lambda x: x if x > 0 else 0).sum()
    ebay_expense = abs(df_main[df_main['Platform'] == 'eBay']['Betrag'].apply(lambda x: x if x < 0 else 0).sum())
    
    klein_income = df_main[df_main['Platform'] == 'Kleinanzeigen']['Betrag'].apply(lambda x: x if x > 0 else 0).sum()
    klein_expense = abs(df_main[df_main['Platform'] == 'Kleinanzeigen']['Betrag'].apply(lambda x: x if x < 0 else 0).sum())
    
    amazon_expense = abs(df_amazon['Betrag'].sum()) if not df_amazon.empty else 0
    
    db_income = df_main[(df_main['Platform'] == 'Deutsche Bank') & (df_main['Betrag'] > 0)]['Betrag'].sum()
    db_expense = abs(df_main[(df_main['Platform'] == 'Deutsche Bank') & (df_main['Betrag'] < 0)]['Betrag'].sum())
    
    summary_data = {
        'Platform': ['Vinted', 'eBay', 'Kleinanzeigen', 'Amazon', 'Deutsche Bank (Diğer)', 'TOPLAM'],
        'Toplam Gelir (€)': [
            vinted_income,
            ebay_income,
            klein_income,
            0,
            db_income,
            total_income
        ],
        'Toplam Gider (€)': [
            vinted_expense,
            ebay_expense,
            klein_expense,
            amazon_expense,
            db_expense,
            total_expense
        ],
        'Net Kar/Zarar (€)': [
            vinted_income - vinted_expense,
            ebay_income - ebay_expense,
            klein_income - klein_expense,
            -amazon_expense,
            db_income - db_expense,
            net_result
        ]
    }
    df_summary = pd.DataFrame(summary_data)
    df_summary.to_excel(writer, sheet_name='OZET', index=False)

print(f"Excel dosyasi olusturuldu: {excel_path}")
print(f"\nSayfalar:")
print("1. TOPLAM - Tum platformlar (Flohmarkt ve cssberlin.de cikartildi)")
print("2. VINTED - Vinted gelir/gider")
print("3. EBAY - eBay gelir/gider")
print("4. KLEINANZEIGEN - Kleinanzeigen gelir/gider (Flohmarkt cikartildi)")
print("5. AMAZON - Amazon giderler")
print("6. DEUTSCHE_BANK_AUSZAHLUNG - Banka cekim islemleri")
print("7. OZET - Platform ozeti")
print(f"\nToplam Gelir: {total_income:.2f} EUR")
print(f"Toplam Gider: {total_expense:.2f} EUR")
print(f"Net Sonuc: {net_result:.2f} EUR")

