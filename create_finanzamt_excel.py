"""
Finanzamt için Excel dosyası oluşturma scripti
"""
import pandas as pd
from datetime import datetime
import os

# CSV dosyasını oku
csv_path = "Gelir_Gider_Ana_Tablo_TEMIZLENMIS.csv"
df = pd.read_csv(csv_path, encoding='utf-8')

# Sadece iş ile ilgili işlemleri filtrele
df_business = df[df['Business/Private'] == 'İŞ'].copy()

# Tarih sütununu düzenle
df_business['Datum'] = pd.to_datetime(df_business['Datum'], errors='coerce')

# Excel dosyası oluştur
desktop_path = os.path.join(os.path.expanduser("~"), "Desktop", "finanzamta gönder")
os.makedirs(desktop_path, exist_ok=True)

excel_path = os.path.join(desktop_path, "Finanzamt_Gelir_Gider_Tablosu.xlsx")

with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
    # Ana tablo
    df_business.to_excel(writer, sheet_name='Gelir_Gider_Tablosu', index=False)
    
    # Özet tablo
    summary_data = {
        'Kategori': ['Toplam Gelir', 'Toplam Gider', 'Net Kâr/Zarar'],
        'Tutar (€)': [
            df_business[df_business['Betrag'] > 0]['Betrag'].sum(),
            abs(df_business[df_business['Betrag'] < 0]['Betrag'].sum()),
            df_business['Betrag'].sum()
        ]
    }
    df_summary = pd.DataFrame(summary_data)
    df_summary.to_excel(writer, sheet_name='Ozet', index=False)
    
    # Platform bazlı özet
    platform_summary = df_business.groupby('Platform').agg({
        'Betrag': ['sum', 'count']
    }).reset_index()
    platform_summary.columns = ['Platform', 'Toplam (€)', 'İşlem Sayısı']
    platform_summary.to_excel(writer, sheet_name='Platform_Ozet', index=False)

print(f"Excel dosyasi olusturuldu: {excel_path}")

