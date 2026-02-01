# 🏗️ PROFESYONEL MUHASEBE SİSTEMİ MİMARİSİ
## Berlin Finanzamt Uyumlu - Hetzner Deploy Ready

---

## 📋 SİSTEM ÖZELLİKLERİ

### **1. Temel Modüller**

#### **A. Gelir-Gider Yönetimi**
- ✅ Platform bazlı işlem takibi (Vinted, eBay, Kleinanzeigen, Amazon Flex)
- ✅ Otomatik tekrar tespiti ve temizleme
- ✅ İş/Özel ayrımı (Tipico, Booking.com otomatik filtreleme)
- ✅ Kategori bazlı sınıflandırma
- ✅ Belge ekleme (PDF, PNG, CSV)

#### **B. Beyanname Modülü**
- ✅ EÜR (Einnahmenüberschussrechnung) otomatik oluşturma
- ✅ Finanzamt'a gönderim için PDF çıktı
- ✅ Tarih bazlı filtreleme (aylık, yıllık)
- ✅ Platform bazlı T-cetvelleri
- ✅ Otomatik toplam hesaplama

#### **C. Hatırlatma Sistemi**
- ✅ Beyanname tarihleri (aylık/üç aylık)
- ✅ Ödeme tarihleri (Klarna, banka)
- ✅ KDV limiti uyarıları (22.500€/yıl)
- ✅ Muhasebeci zorunluluğu kontrolü
- ✅ Email ve sistem içi bildirimler

#### **D. Yasal Uyumluluk Kontrolü**
- ✅ Kleinunternehmer limiti (22.500€/yıl)
- ✅ KDV faturası kesme zorunluluğu kontrolü
- ✅ Muhasebeci tutma zorunluluğu (600.000€ ciro veya 60.000€ kar)
- ✅ Berlin Finanzamt yasalarına uygunluk
- ✅ Otomatik uyarı sistemi

---

## 🛠️ TEKNİK MİMARİ

### **Backend (Python FastAPI)**
```python
# Ana yapı
accounting_system/
├── app/
│   ├── api/
│   │   ├── transactions.py      # İşlem CRUD
│   │   ├── reports.py           # Beyanname çıktıları
│   │   ├── reminders.py         # Hatırlatma sistemi
│   │   └── compliance.py        # Yasal uyumluluk
│   ├── models/
│   │   ├── transaction.py       # İşlem modeli
│   │   ├── report.py            # Beyanname modeli
│   │   └── reminder.py          # Hatırlatma modeli
│   ├── services/
│   │   ├── accounting.py        # Muhasebe hesaplamaları
│   │   ├── finanzamt.py         # Finanzamt uyumluluk
│   │   └── notifications.py     # Bildirim servisi
│   └── database/
│       └── models.py            # SQLAlchemy modelleri
├── requirements.txt
└── main.py
```

### **Frontend (React/Vue.js)**
```javascript
// Modern, responsive web arayüzü
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.vue
│   │   ├── Transactions.vue
│   │   ├── Reports.vue
│   │   ├── Reminders.vue
│   │   └── Compliance.vue
│   ├── services/
│   │   └── api.js
│   └── App.vue
```

### **Database (PostgreSQL)**
```sql
-- Ana tablolar
- transactions (işlemler)
- reports (beyannameler)
- reminders (hatırlatmalar)
- compliance_checks (uyumluluk kontrolleri)
- documents (belgeler)
```

---

## 📊 VİNTED FATURA ANALİZİ

### **Mevcut Durum:**
- ✅ Yıllık gelir raporu: 398,50€ (2025)
- ✅ Aralık 2025 bakiyesi: 6,20€ (başlangıç: 32,49€)
- ✅ Bekleyen ödeme: 98,00€ (Ocak 2026)

### **Transaction Detayları:**
- **Satışlar:** 23 işlem (Kasım-Aralık 2025)
- **Alışlar:** 1 işlem (21.12.2025: -19,40€)
- **Banka Transferi:** 1 işlem (21.12.2025: -50,00€)

### **Komisyon ve Kargo:**
- Vinted komisyonu: Her satışta %5-10
- Kargo ücretleri: Alıcı tarafından ödeniyor
- **Not:** Faturalarda komisyon ve kargo ayrı gösterilmeli

---

## 🔄 DEUTSCHE BANK İŞLEM TEMİZLEME

### **İşletme Dışı Harcamalar (Çıkarılacak):**
- ❌ Tipico: -150€ (bahis)
- ❌ PayPal Tipico: -53,50€ (bahis)
- ❌ Klarna Booking.com: -184,01€ (seyahat)
- ❌ Burcu Kurt-Sorguc Transfer: -1.000€ (özel)
- ❌ Kaufland: -81,54€ (alışveriş - özel)
- ❌ Auszahlung: -80€ (nakit çekme - özel)
- ❌ IYZICO (Türkiye): -5,15€ (özel)

### **İşletme İçi İşlemler (Tutulacak):**
- ✅ IONOS: -3€ (web hosting)
- ✅ Klarna (AliExpress, eBay, Vinted): İş giderleri
- ✅ eBay geliri: 70€
- ✅ Vinted gelirleri: 150€ (3 x 50€)
- ✅ Yakıt (TOTAL/Shell): 134,60€
- ✅ Vodafone: 25,01€
- ✅ Amazon: 24,91€
- ✅ Allianz Araç Sigortası: 843,88€ (net: 420,44€ iade)

---

## 🎯 BEYANNAME ÇIKARTMA SİSTEMİ

### **Otomatik Çıktılar:**
1. **EÜR (Einnahmenüberschussrechnung)**
   - Gelirler (platform bazlı)
   - Giderler (kategori bazlı)
   - Net sonuç
   - Finanzamt'a gönderim formatı

2. **Platform T-Cetvelleri**
   - Vinted detaylı raporu
   - eBay detaylı raporu
   - Kleinanzeigen detaylı raporu
   - Amazon Flex (gelecek)

3. **Belge Ekleme**
   - PDF faturalar
   - Ekran görüntüleri
   - Banka ekstreleri

---

## ⏰ HATIRLATMA SİSTEMİ

### **Otomatik Hatırlatmalar:**
1. **Beyanname Tarihleri:**
   - Aylık: Her ayın 10'u (önceki ay)
   - Yıllık: 31 Mayıs (önceki yıl)

2. **Ödeme Tarihleri:**
   - Klarna taksitleri
   - Banka ödemeleri
   - Sigorta ödemeleri

3. **Limit Uyarıları:**
   - KDV limiti: 22.500€/yıl
   - Muhasebeci zorunluluğu: 600.000€ ciro veya 60.000€ kar

---

## 📋 BERLİN FİNANZAMT UYUMLULUK

### **Kleinunternehmer Kuralları:**
- ✅ Yıllık ciro < 22.500€: KDV muafiyeti
- ✅ EÜR (basit muhasebe) yeterli
- ✅ Muhasebeci zorunluluğu yok

### **KDV Faturası Kesme:**
- ✅ Müşteri talep ederse: Zorunlu
- ✅ Alıcı vergi mükellefi ise: Zorunlu
- ✅ 12.000€ üzeri: Zorunlu (Türkiye - referans)

### **Muhasebeci Zorunluluğu:**
- ❌ Ciro < 600.000€: Zorunlu değil
- ❌ Kar < 60.000€: Zorunlu değil
- ✅ EÜR ile devam edilebilir

---

## 🚀 HETZNER DEPLOYMENT

### **Server Gereksinimleri:**
- Ubuntu 22.04 LTS
- PostgreSQL 14+
- Python 3.11+
- Nginx (reverse proxy)
- SSL sertifikası (Let's Encrypt)

### **Deployment Adımları:**
1. Server kurulumu
2. Database kurulumu
3. Backend deploy
4. Frontend build ve deploy
5. Nginx konfigürasyonu
6. SSL sertifikası
7. Domain bağlantısı

---

## 📝 SONRAKİ ADIMLAR

1. ✅ Vinted faturalarını detaylı analiz et
2. ✅ Deutsche Bank işlemlerini temizle
3. ⏳ Sistem mimarisini kodla
4. ⏳ Frontend arayüzünü tasarla
5. ⏳ Hetzner'e deploy et

---

**Durum:** Tasarım Aşamasında ✅  
**Hedef:** 7/24 Erişilebilir Web Tabanlı Muhasebe Sistemi 🚀

