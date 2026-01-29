# 📊 KAPSAMLI ÖN MUHASEBE SİSTEMİ 2026
## Kleinunternehmen - Finanzamt Uyumlu

---

## 🎯 SİSTEM GENEL BAKIŞ

**Firma Bilgileri:**
- **Gewerbe Anmeldung:** 25.10.2025
- **Firma Tipi:** Kleinunternehmen (Kleinunternehmerregelung)
- **Ciro Eşiği:** 22.500€ (2025/2026)
- **Muhasebe Yöntemi:** EÜR (Einnahmenüberschussrechnung)

---

## 📅 BEYANNAME ARALIKLARI VE KURALLAR

### 1. Yıllık Gelir Vergisi Beyannamesi (Einkommensteuererklärung)
- **Son Tarih:** Bir sonraki yılın **31 Temmuz**'una kadar
- **2025 Yılı İçin:** 31.07.2026
- **Kısmi Yıl (25.10.2025 - 31.12.2025):** 2 ay 6 gün
- **Form:** EÜR (Einnahmenüberschussrechnung)

### 2. Umsatzsteuervoranmeldung (KDV Ön Beyannamesi)
- **Kleinunternehmer:** **MUAF** (22.500€ altı ciro)
- **Durum:** 2025/2026 için ciro 22.500€ altında olduğu sürece beyanname yok
- **Eşik Aşılınca:** Aylık veya üç aylık beyanname gerekir

### 3. EÜR (Einnahmenüberschussrechnung) - Yıllık
- **Son Tarih:** 31.07.2026 (2025 yılı için)
- **İçerik:**
  - Toplam gelirler
  - Toplam giderler
  - Net kâr/zarar
  - Platform bazlı detaylar

### 4. Elster Online Sistemi
- **Platform:** https://www.elster.de
- **Kullanım:** Elektronik beyanname gönderimi
- **Gerekli:** Elster hesabı ve PIN

---

## 📋 GÖREV LİSTESİ VE HATIRLATICILAR

### ✅ 2026 Yılı İçin Yapılacaklar

#### **Ocak 2026**
- [ ] 2025 yılı tüm işlemlerini topla
- [ ] EÜR hazırlığı başlat
- [ ] Finanzamt'a mevcut durum bildirimi (gerekirse)

#### **Şubat - Haziran 2026**
- [ ] Aylık gelir-gider tablolarını güncelle
- [ ] Platform bazlı detayları kontrol et
- [ ] Faturaları organize et

#### **Temmuz 2026**
- [ ] **31 Temmuz'a kadar:** 2025 EÜR beyannamesi gönder
- [ ] Elster üzerinden elektronik gönderim
- [ ] Tüm belgeleri arşivle

#### **Ağustos - Aralık 2026**
- [ ] 2026 yılı işlemlerini takip et
- [ ] Aylık özetler hazırla
- [ ] 2027 için hazırlık yap

---

## 🔄 OTOMATİK MUHASEBE SİSTEMİ TASARIMI

### 1. ANA TABLO (Haupttabelle)
**Dosya:** `Gelir_Gider_Ana_Tablo.csv`

**Sütunlar:**
- **Datum** (Tarih)
- **Platform** (Vinted/eBay/Kleinanzeigen/Amazon/Klarna/Deutsche Bank)
- **Transaktionstyp** (Gelir/Gider/Stok/Envanter)
- **Beschreibung** (Açıklama)
- **Betrag** (Tutar - €)
- **Kategorie** (Kategori)
- **Belegnummer** (Belge No)
- **Status** (Beklemede/Tamamlandı/İptal)

**Otomatik Hesaplamalar:**
- Toplam gelir (Summe Einnahmen)
- Toplam gider (Summe Ausgaben)
- Net kâr/zarar (Gewinn/Verlust)
- Platform bazlı toplamlar

---

### 2. PLATFORM BAZLI T-CETVELLERİ

#### **A. VINTED T-CETVELİ**
**Dosya:** `Vinted_T_Cetveli.csv`

**Gelir Kalemleri:**
- Satış gelirleri (Verkauft)
- Bekleyen ödemeler (Ausstehend)
- Gutschein kullanımları

**Gider Kalemleri:**
- Ürün alımları (Gekauft)
- Kargo ücretleri (Versandkosten)
- Vinted komisyonu (Provision)
- Site içi alışverişler

**Otomatik Hesaplama:**
- Net Vinted kârı = Gelirler - (Alımlar + Kargo + Komisyon)

---

#### **B. EBAY T-CETVELİ**
**Dosya:** `eBay_T_Cetveli.csv`

**Gelir Kalemleri:**
- Satış gelirleri
- Deutsche Bank'a çekilen paralar

**Gider Kalemleri:**
- Ürün alımları
- eBay komisyonu
- Kargo ücretleri
- PayPal ücretleri

**Örnek:**
- Satış: 90€
- Komisyon: ~10€
- Kargo: ~10€
- **Net Kâr: ~70€**

---

#### **C. KLEINANZEIGEN T-CETVELİ**
**Dosya:** `Kleinanzeigen_T_Cetveli.csv`

**Gelir Kalemleri:**
- PayPal üzerinden alınan ödemeler
- Nakit satışlar (Flohmarkt)

**Gider Kalemleri:**
- Ürün alımları
- Platform ücretleri (varsa)

**Örnek:**
- PayPal geliri: 25€
- **Net Kâr: 25€** (ürün maliyeti düşülürse)

---

#### **D. KLARNA T-CETVELİ**
**Dosya:** `Klarna_T_Cetveli.csv`

**Gider Kalemleri:**
- İş ile ilgili alımlar (eBay, AliExpress, Vinted)
- Taksit ödemeleri
- Faizler (varsa)

**Özel Notlar:**
- Booking.com ödemeleri: **ÖZEL** (Finanzamt'a dahil edilmeyecek)
- İş alımları: **GİDER** (Wareneinkauf)

---

#### **E. DEUTSCHE BANK T-CETVELİ**
**Dosya:** `DeutscheBank_T_Cetveli.csv`

**Gelir Kalemleri:**
- eBay'den çekilen paralar
- Diğer platform ödemeleri

**Gider Kalemleri:**
- İş ile ilgili harcamalar
- Kargo ücretleri
- Komisyonlar

**Özel Notlar:**
- Ekim 2025 - Ocak 2026 arası işlemler
- İş/Özel ayrımı yapılacak

---

### 3. ENVANTER VE STOK YÖNETİMİ

**Dosya:** `Envanter_Stok.csv`

**Sütunlar:**
- **Produkt-ID**
- **Produktname**
- **Kategorie** (Giyim/Takı/Elektronik/Araba Parçası)
- **Einkaufspreis** (Alış Fiyatı)
- **Verkaufspreis** (Satış Fiyatı)
- **Status** (Envanterde/Satıldı/Beklemede)
- **Platform** (Vinted/eBay/Kleinanzeigen)
- **Einkaufsdatum**
- **Verkaufsdatum**

**Otomatik Güncelleme:**
- Vinted ürün alımı → Envantere otomatik ekle
- Satış yapıldığında → Stok otomatik düş
- Platform bazlı stok takibi

---

### 4. FATURA YÖNETİMİ

**Dosya:** `Fatura_Yonetimi.csv`

**Platform Bazlı Faturalar:**
- **Vinted Faturalar:** PDF formatında (FRLT numaralı)
- **eBay Faturalar:** Platform içi faturalar
- **Klarna Faturalar:** Taksit faturaları
- **Amazon Faturalar:** Alış faturaları

**Otomatik Eşleştirme:**
- Ana tabloda işlem girildiğinde → İlgili fatura otomatik eşleşir
- Fatura numarası ile işlem numarası bağlantısı

---

## 🔧 OTOMATİK ETKİLEŞİM SİSTEMİ

### Senaryo 1: Vinted Ürün Alımı
**İşlem:**
1. Ana tabloya "Vinted Ürün Alımı" girilir
2. **Otomatik İşlemler:**
   - Envanter tablosuna ürün eklenir
   - Stok sayısı artar
   - Vinted T-cetveline gider olarak yazılır
   - Kargo ve komisyon ayrı gider olarak kaydedilir
   - Ana tabloda toplam gider güncellenir

**Örnek:**
```
Ana Tablo:
- Vinted Ürün Alımı: 20€
- Vinted Kargo: 3€
- Vinted Komisyon: 2€
→ Toplam Gider: 25€

Envanter:
- Ürün eklendi (Status: Envanterde)

Vinted T-Cetveli:
- Gider: 25€ (20€ + 3€ + 2€)
```

---

### Senaryo 2: Vinted Satış
**İşlem:**
1. Ana tabloya "Vinted Satış" girilir
2. **Otomatik İşlemler:**
   - Envanter tablosunda ürün "Satıldı" olarak işaretlenir
   - Stok sayısı düşer
   - Vinted T-cetveline gelir olarak yazılır
   - Ana tabloda toplam gelir güncellenir

**Örnek:**
```
Ana Tablo:
- Vinted Satış: 30€
→ Toplam Gelir: +30€

Envanter:
- Ürün durumu: Satıldı

Vinted T-Cetveli:
- Gelir: 30€
```

---

### Senaryo 3: Amazon Alış (Bant)
**İşlem:**
1. Ana tabloya "Amazon Bant Alışı" girilir
2. **Otomatik İşlemler:**
   - Gider tablosuna otomatik eklenir
   - Kategori: "Büromaterial" (Ofis Malzemeleri)
   - Ana tabloda toplam gider güncellenir

---

### Senaryo 4: Bankadan Para Çekme
**İşlem:**
1. Ana tabloya "Deutsche Bank Para Çekme" girilir
2. **Otomatik İşlemler:**
   - Deutsche Bank T-cetveline yazılır
   - Platform bazlı dağılım (eBay/Vinted vb.)
   - Ana tabloda toplam güncellenir

---

## 📊 FİNANZAMT BEYANNAME OTOMATİK ÇIKTI SİSTEMİ

### "Beyanname Al" Butonu Fonksiyonları

#### 1. Veri Toplama
- Tüm platform tablolarından veri çek
- Aylık/Platform bazlı toplamlar
- Kategori bazlı dağılım

#### 2. EÜR Formatına Dönüştürme
- Gelirler (Einnahmen)
- Giderler (Ausgaben)
- Net Kâr/Zarar (Gewinn/Verlust)

#### 3. Elster Uyumlu Format
- XML veya CSV formatında çıktı
- Elster'e direkt yüklenebilir format

#### 4. PDF Rapor Oluşturma
- Detaylı gelir-gider tablosu
- Platform bazlı özetler
- Fatura referansları

---

## 📈 AYLIK ÖZET RAPORLAR

### Ekim 2025
- **Başlangıç:** 25.10.2025 (Gewerbe Anmeldung)
- **Platformlar:** Vinted, eBay, Kleinanzeigen
- **Toplam Gelir:** (hesaplanacak)
- **Toplam Gider:** (hesaplanacak)

### Kasım 2025
- **Platformlar:** Vinted, eBay, Kleinanzeigen, Klarna
- **Vinted:** Alışlar ve satışlar
- **Klarna:** Taksit ödemeleri

### Aralık 2025
- **Platformlar:** Vinted, eBay, Kleinanzeigen, Klarna
- **Vinted:** 23 satış (398,50€ toplam)
- **eBay:** 1 satış (70€ net)
- **Kleinanzeigen:** 1 satış (25€)

---

## 🎯 SÜRDÜRÜLEBİLİRLİK GARANTİSİ

### 1. Tekrar Eden İşlemlerin Tespiti
- Aynı fatura numarası kontrolü
- Aynı tarih/tutar kontrolü
- Duplikat uyarısı

### 2. Platform Bazlı Kategorizasyon
- Her platform için ayrı T-cetveli
- Otomatik toplam hesaplama
- Platform bazlı kâr/zarar analizi

### 3. Aylık Özet Raporlar
- Her ay sonu otomatik özet
- Platform bazlı karşılaştırma
- Trend analizi

### 4. Finanzamt Uyumluluğu
- 2026 yılı mevzuatına uygun
- EÜR formatı
- Elster uyumlu çıktı

---

## 📝 KULLANIM TALİMATLARI

### Yeni İşlem Girişi
1. Ana tabloya işlem gir
2. Platform seç
3. Gelir/Gider/Stok seç
4. Sistem otomatik olarak:
   - İlgili T-cetveline yazar
   - Envanteri günceller
   - Toplamları hesaplar

### Beyanname Hazırlama
1. "Beyanname Al" butonuna tıkla
2. Dönem seç (aylık/yıllık)
3. Platform seç (tümü/spesifik)
4. PDF/CSV/XML formatında çıktı al
5. Elster'e yükle veya Finanzamt'a gönder

---

## ✅ KONTROL LİSTESİ

### Günlük
- [ ] Yeni işlemleri kaydet
- [ ] Faturaları eşleştir
- [ ] Stok durumunu kontrol et

### Haftalık
- [ ] Platform bazlı toplamları kontrol et
- [ ] Bekleyen ödemeleri takip et
- [ ] Tekrar eden işlemleri temizle

### Aylık
- [ ] Aylık özet raporu oluştur
- [ ] Platform bazlı analiz yap
- [ ] Finanzamt için hazırlık yap

### Yıllık
- [ ] EÜR hazırla
- [ ] Tüm belgeleri organize et
- [ ] 31 Temmuz'a kadar beyanname gönder

---

## 🔗 DOSYA YAPISI

```
Muhasebe_Sistemi/
├── Ana_Tablo/
│   └── Gelir_Gider_Ana_Tablo.csv
├── Platform_T_Cetvelleri/
│   ├── Vinted_T_Cetveli.csv
│   ├── eBay_T_Cetveli.csv
│   ├── Kleinanzeigen_T_Cetveli.csv
│   ├── Klarna_T_Cetveli.csv
│   └── DeutscheBank_T_Cetveli.csv
├── Envanter/
│   └── Envanter_Stok.csv
├── Faturalar/
│   ├── Vinted_Faturalar/
│   ├── eBay_Faturalar/
│   └── Klarna_Faturalar/
└── Raporlar/
    ├── Aylik_Ozetler/
    └── Yillik_Beyannameler/
```

---

**Son Güncelleme:** 03.01.2026  
**Versiyon:** 1.0  
**Durum:** Aktif Geliştirme

