# CSS BERLIN - ÜCRETSİZ MVP PLANI

## 🎯 HEDEF: 0€ Maliyet ile Tam Çalışan E-Ticaret Sistemi

---

## BÖLÜM 1: ÜCRETSİZ ALTERNATİFLER

### 1.1 Ödeme Sistemi (0€ Başlangıç)

| Yöntem | Maliyet | Açıklama |
|--------|---------|----------|
| **Überweisung (Banka Havalesi)** | 0€ | IBAN ile direkt ödeme |
| **PayPal Goods & Services** | %2.49 sadece satışta | Alıcı koruması var |
| **Nachnahme (Kapıda Ödeme)** | Kargo firması ücreti | Güvenli ama pahalı |
| **Bar bei Abholung** | 0€ | Elden teslim |

**MVP Stratejisi:**
- İlk aşama: Banka Havalesi + Elden Teslim (0€)
- İkinci aşama: PayPal entegrasyonu (sadece satış başına ücret)

### 1.2 Kargo Takip (0€)

| Çözüm | Maliyet | Açıklama |
|-------|---------|----------|
| **Manuel Tracking No** | 0€ | Satıcı girer, public URL ile takip |
| **DHL Tracking Page Link** | 0€ | `https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=TRACKING_NO` |
| **Hermes Tracking Link** | 0€ | `https://www.myhermes.de/empfangen/sendungsverfolgung/?trackingNumber=TRACKING_NO` |
| **DPD Tracking Link** | 0€ | `https://tracking.dpd.de/status/de_DE/parcel/TRACKING_NO` |

**MVP Stratejisi:**
- Satıcı kargo firması seçer + tracking no girer
- Sistem otomatik tracking URL oluşturur
- Alıcı bu URL'den takip eder

### 1.3 Auth Sistemi (0€)

| Servis | Maliyet | Limit |
|--------|---------|-------|
| **Google OAuth** | 0€ | Sınırsız |
| **Firebase Auth** | 0€ | 10K/ay ücretsiz |
| **LocalStorage Auth** | 0€ | Sınırsız (demo) |

---

## BÖLÜM 2: KOMPLE KULLANICI AKIŞ SENARYOrSU

### 📱 SENARYO: Alıcı Yolculuğu (Mobile/Tablet/Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│                    KULLANICI AKIŞI                          │
└─────────────────────────────────────────────────────────────┘

ADIM 1: ANA SAYFA
    │
    │  Kullanıcı siteye girer
    │  Cookie consent popup gösterilir
    │  Ürünlere göz atar
    │
    ▼
ADIM 2: ÜRÜN DETAY
    │
    │  Ürün beğenir
    │  ❤️ Favorilere ekle (login gerekli)
    │  💬 Pazarlık yap butonu
    │
    ▼
ADIM 3: LOGIN MODAL (Reddit tarzı)
    │
    │  ┌─────────────────────────────┐
    │  │    Anmelden erforderlich    │
    │  │                             │
    │  │  ○ Google ile devam et     │
    │  │  ○ E-posta ile giriş       │
    │  │  ○ Kayıt ol                │
    │  └─────────────────────────────┘
    │
    ▼
ADIM 4: PAZARLİK SİSTEMİ
    │
    │  Kullanıcı teklif gönderir (ör: 40€)
    │  Satıcıya bildirim gider
    │  Satıcı: Kabul / Reddet / Karşı teklif
    │
    ▼
ADIM 5: PAZARLIK DASHBOARD
    │
    │  ┌─────────────────────────────────────────┐
    │  │  Meine Verhandlungen                    │
    │  │                                         │
    │  │  🟢 Vintage Jacke - Angebot: 40€        │
    │  │     Status: Verkäufer hat akzeptiert!  │
    │  │     [Jetzt kaufen]                      │
    │  │                                         │
    │  │  🟡 Nike Sneaker - Angebot: 55€         │
    │  │     Status: Warte auf Antwort          │
    │  │                                         │
    │  │  🔴 Ledertasche - Angebot: 80€          │
    │  │     Status: Abgelehnt                   │
    │  └─────────────────────────────────────────┘
    │
    ▼
ADIM 6: CHECKOUT (Ödeme Seçimi)
    │
    │  ┌─────────────────────────────────────────┐
    │  │  Zahlungsmethode wählen                 │
    │  │                                         │
    │  │  ○ Überweisung (Banküberweisung)       │
    │  │    IBAN wird nach Bestellung gezeigt   │
    │  │                                         │
    │  │  ○ PayPal                               │
    │  │    Sichere Zahlung mit Käuferschutz    │
    │  │                                         │
    │  │  ○ Bar bei Abholung                    │
    │  │    Bezahlung bei persönlicher Übergabe │
    │  └─────────────────────────────────────────┘
    │
    ▼
ADIM 7: TESLİMAT SEÇİMİ
    │
    │  ┌─────────────────────────────────────────┐
    │  │  Versandoption wählen                   │
    │  │                                         │
    │  │  ○ DHL Paket (~4.99€)                  │
    │  │  ○ Hermes (~4.50€)                     │
    │  │  ○ DPD (~5.49€)                        │
    │  │  ○ Abholung (0€)                       │
    │  │                                         │
    │  │  📍 Lieferadresse:                      │
    │  │  Max Mustermann                         │
    │  │  Musterstraße 123                       │
    │  │  12345 Berlin                           │
    │  │  [Ändern]                               │
    │  └─────────────────────────────────────────┘
    │
    ▼
ADIM 8: SİPARİŞ ÖZETI
    │
    │  ┌─────────────────────────────────────────┐
    │  │  Bestellübersicht                       │
    │  │                                         │
    │  │  Vintage Jacke .............. 40.00€   │
    │  │  Versand (DHL) ............... 4.99€   │
    │  │  ─────────────────────────────────      │
    │  │  GESAMT ..................... 44.99€   │
    │  │                                         │
    │  │  [✓] Ich akzeptiere die AGB            │
    │  │                                         │
    │  │  ┌─────────────────────────────────┐   │
    │  │  │    JETZT KOSTENPFLICHTIG       │   │
    │  │  │         BESTELLEN              │   │
    │  │  └─────────────────────────────────┘   │
    │  └─────────────────────────────────────────┘
    │
    ▼
ADIM 9: SİPARİŞ ONAY + ÖDEME BİLGİLERİ
    │
    │  ┌─────────────────────────────────────────┐
    │  │  ✅ Bestellung erfolgreich!             │
    │  │                                         │
    │  │  Bestellnummer: #CSS-2024-1234          │
    │  │                                         │
    │  │  📋 ZAHLUNGSINFORMATIONEN:              │
    │  │                                         │
    │  │  Empfänger: CSS Berlin GmbH             │
    │  │  IBAN: DE89 3704 0044 0532 0130 00      │
    │  │  BIC: COBADEFFXXX                       │
    │  │  Betrag: 44.99€                         │
    │  │  Verwendungszweck: CSS-2024-1234        │
    │  │                                         │
    │  │  ⏰ Bitte innerhalb von 3 Tagen         │
    │  │     überweisen.                         │
    │  │                                         │
    │  │  📧 Diese Infos wurden auch per         │
    │  │     E-Mail gesendet.                    │
    │  └─────────────────────────────────────────┘
    │
    ▼
ADIM 10: ÖDEME BEKLENİYOR (Dashboard'da)
    │
    │  Status: "Warte auf Zahlung"
    │  Admin/Sistem ödemeyi kontrol eder
    │  Ödeme gelince: Status → "Bezahlt"
    │
    ▼
ADIM 11: SATICI BİLDİRİMİ
    │
    │  Satıcıya e-posta + dashboard bildirimi:
    │  "Zahlung eingegangen! Bitte versenden."
    │
    │  ┌─────────────────────────────────────────┐
    │  │  📦 VERSANDAUFTRAG                      │
    │  │                                         │
    │  │  Käufer: Max Mustermann                 │
    │  │  Adresse: Musterstraße 123, 12345 Berlin│
    │  │  Versandart: DHL Paket                  │
    │  │                                         │
    │  │  Bitte Paket versenden und              │
    │  │  Sendungsnummer eingeben:               │
    │  │                                         │
    │  │  Versanddienstleister: [DHL ▾]          │
    │  │  Sendungsnummer: [____________]         │
    │  │                                         │
    │  │  [Sendung bestätigen]                   │
    │  └─────────────────────────────────────────┘
    │
    ▼
ADIM 12: KARGO TAKİP NO GİRİŞİ (Satıcı)
    │
    │  Satıcı tracking number girer
    │  Sistem otomatik tracking URL oluşturur
    │  Alıcıya e-posta: "Dein Paket wurde versendet!"
    │
    ▼
ADIM 13: KARGO TAKİP (Alıcı Dashboard)
    │
    │  ┌─────────────────────────────────────────┐
    │  │  📦 SENDUNGSVERFOLGUNG                  │
    │  │                                         │
    │  │  Bestellung: #CSS-2024-1234             │
    │  │  Status: Unterwegs                      │
    │  │                                         │
    │  │  Versanddienstleister: DHL              │
    │  │  Sendungsnummer: 00340434161094015902   │
    │  │                                         │
    │  │  ┌─────────────────────────────────┐   │
    │  │  │  📍 Bei DHL verfolgen          │   │
    │  │  └─────────────────────────────────┘   │
    │  │                                         │
    │  │  ─────────────────────────────────      │
    │  │                                         │
    │  │  ⏱️ VERLAUF:                            │
    │  │                                         │
    │  │  ✅ 28.12. Bestellt                     │
    │  │  ✅ 28.12. Bezahlt                      │
    │  │  ✅ 29.12. Versendet                    │
    │  │  ⏳ Unterwegs...                        │
    │  │  ○ Zugestellt                           │
    │  └─────────────────────────────────────────┘
    │
    ▼
ADIM 14: TESLİMAT ONAY + DEĞERLENDİRME
    │
    │  Alıcı "Erhalten" butonuna tıklar
    │  Satıcıya para serbest bırakılır
    │  Değerlendirme popup'ı açılır
    │
    │  ┌─────────────────────────────────────────┐
    │  │  ⭐ Bewertung abgeben                   │
    │  │                                         │
    │  │  Wie war deine Erfahrung?               │
    │  │  ⭐⭐⭐⭐⭐                              │
    │  │                                         │
    │  │  [Super schneller Versand!        ]     │
    │  │                                         │
    │  │  [Bewertung absenden]                   │
    │  └─────────────────────────────────────────┘
    │
    ▼
ADIM 15: İŞLEM TAMAMLANDI
    │
    │  Alıcı: Ürün teslim alındı ✅
    │  Satıcı: Para hesabına aktarıldı ✅
    │  Her ikisine de teşekkür e-postası
```

---

## BÖLÜM 3: KARGO TAKİP SİSTEMİ (ÜCRETSİZ)

### 3.1 Tracking URL Generator

```javascript
// shipping-tracker.js
const CARRIER_TRACKING_URLS = {
  dhl: {
    name: 'DHL',
    logo: '/images/carriers/dhl.png',
    url: 'https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=',
    pattern: /^\d{10,22}$/ // 10-22 haneli sayı
  },
  hermes: {
    name: 'Hermes',
    logo: '/images/carriers/hermes.png',
    url: 'https://www.myhermes.de/empfangen/sendungsverfolgung/?trackingNumber=',
    pattern: /^[A-Z0-9]{10,20}$/i
  },
  dpd: {
    name: 'DPD',
    logo: '/images/carriers/dpd.png',
    url: 'https://tracking.dpd.de/status/de_DE/parcel/',
    pattern: /^\d{14}$/
  },
  gls: {
    name: 'GLS',
    logo: '/images/carriers/gls.png',
    url: 'https://gls-group.eu/DE/de/paketverfolgung?match=',
    pattern: /^[A-Z0-9]{11,12}$/i
  }
};

function generateTrackingUrl(carrier, trackingNumber) {
  const carrierInfo = CARRIER_TRACKING_URLS[carrier.toLowerCase()];
  if (!carrierInfo) return null;

  return carrierInfo.url + trackingNumber;
}

function validateTrackingNumber(carrier, trackingNumber) {
  const carrierInfo = CARRIER_TRACKING_URLS[carrier.toLowerCase()];
  if (!carrierInfo) return false;

  return carrierInfo.pattern.test(trackingNumber);
}

// Kullanım:
// generateTrackingUrl('dhl', '00340434161094015902')
// → 'https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=00340434161094015902'
```

### 3.2 Sipariş Durumları

```javascript
const ORDER_STATUS = {
  PENDING_PAYMENT: {
    code: 'pending_payment',
    label_de: 'Warte auf Zahlung',
    label_en: 'Awaiting Payment',
    color: '#FFA500', // Orange
    icon: '⏳'
  },
  PAYMENT_RECEIVED: {
    code: 'payment_received',
    label_de: 'Zahlung eingegangen',
    label_en: 'Payment Received',
    color: '#4CAF50', // Green
    icon: '✅'
  },
  AWAITING_SHIPMENT: {
    code: 'awaiting_shipment',
    label_de: 'Warte auf Versand',
    label_en: 'Awaiting Shipment',
    color: '#2196F3', // Blue
    icon: '📦'
  },
  SHIPPED: {
    code: 'shipped',
    label_de: 'Versendet',
    label_en: 'Shipped',
    color: '#9C27B0', // Purple
    icon: '🚚'
  },
  IN_TRANSIT: {
    code: 'in_transit',
    label_de: 'Unterwegs',
    label_en: 'In Transit',
    color: '#FF9800', // Orange
    icon: '📍'
  },
  DELIVERED: {
    code: 'delivered',
    label_de: 'Zugestellt',
    label_en: 'Delivered',
    color: '#4CAF50', // Green
    icon: '🏠'
  },
  COMPLETED: {
    code: 'completed',
    label_de: 'Abgeschlossen',
    label_en: 'Completed',
    color: '#2D5016', // CSS Berlin Green
    icon: '✓'
  },
  CANCELLED: {
    code: 'cancelled',
    label_de: 'Storniert',
    label_en: 'Cancelled',
    color: '#F44336', // Red
    icon: '✕'
  },
  DISPUTED: {
    code: 'disputed',
    label_de: 'Streitfall',
    label_en: 'Disputed',
    color: '#FF5722', // Deep Orange
    icon: '⚠️'
  }
};
```

### 3.3 Order Timeline Component

```html
<!-- order-timeline.html -->
<div class="order-timeline">
  <div class="timeline-item completed">
    <div class="timeline-icon">✅</div>
    <div class="timeline-content">
      <div class="timeline-date">28.12.2024 14:32</div>
      <div class="timeline-title">Bestellt</div>
      <div class="timeline-desc">Bestellung aufgegeben</div>
    </div>
  </div>

  <div class="timeline-item completed">
    <div class="timeline-icon">✅</div>
    <div class="timeline-content">
      <div class="timeline-date">28.12.2024 16:45</div>
      <div class="timeline-title">Bezahlt</div>
      <div class="timeline-desc">Zahlung eingegangen</div>
    </div>
  </div>

  <div class="timeline-item completed">
    <div class="timeline-icon">✅</div>
    <div class="timeline-content">
      <div class="timeline-date">29.12.2024 10:15</div>
      <div class="timeline-title">Versendet</div>
      <div class="timeline-desc">DHL: 00340434161094015902</div>
      <a href="https://www.dhl.de/..." target="_blank" class="tracking-link">
        📍 Bei DHL verfolgen
      </a>
    </div>
  </div>

  <div class="timeline-item active">
    <div class="timeline-icon">🚚</div>
    <div class="timeline-content">
      <div class="timeline-title">Unterwegs</div>
      <div class="timeline-desc">Paket ist unterwegs zu dir</div>
    </div>
  </div>

  <div class="timeline-item pending">
    <div class="timeline-icon">○</div>
    <div class="timeline-content">
      <div class="timeline-title">Zugestellt</div>
    </div>
  </div>
</div>

<style>
.order-timeline {
  padding: 20px;
}

.timeline-item {
  display: flex;
  gap: 16px;
  padding-bottom: 24px;
  position: relative;
}

.timeline-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 32px;
  bottom: 0;
  width: 2px;
  background: #E0E0E0;
}

.timeline-item.completed::before {
  background: #4CAF50;
}

.timeline-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  z-index: 1;
}

.timeline-item.completed .timeline-icon {
  background: #E8F5E9;
}

.timeline-item.active .timeline-icon {
  background: #FFF3E0;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.timeline-content {
  flex: 1;
}

.timeline-date {
  font-size: 12px;
  color: #757575;
}

.timeline-title {
  font-weight: 600;
  color: #333;
}

.timeline-desc {
  font-size: 14px;
  color: #666;
}

.tracking-link {
  display: inline-block;
  margin-top: 8px;
  padding: 8px 16px;
  background: #E8854C;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
}

.tracking-link:hover {
  background: #2D5016;
}
</style>
```

---

## BÖLÜM 4: HIZLI UYGULAMA PLANI (1 HAFTA)

### Gün 1-2: Auth + Temel Yapı
- [ ] Login/Register modal (Google OAuth)
- [ ] User dashboard skeleton
- [ ] Mobile responsive header

### Gün 3: Pazarlık Sistemi
- [ ] Offer/Counter-offer UI
- [ ] Verhandlungen (pazarlık) sayfası
- [ ] Bildirim sistemi

### Gün 4: Checkout Flow
- [ ] Kargo seçimi sayfası
- [ ] Adres formu
- [ ] Sipariş özeti
- [ ] Ödeme yöntemi seçimi (Überweisung/PayPal)

### Gün 5: Sipariş Yönetimi
- [ ] Satıcı sipariş dashboard
- [ ] Tracking no giriş formu
- [ ] Alıcı sipariş takip sayfası

### Gün 6: Bildirimler + E-posta
- [ ] Sipariş onay e-postası
- [ ] Ödeme bilgileri e-postası
- [ ] Kargo bildirimi e-postası

### Gün 7: Test + Fix
- [ ] Mobile/Tablet test
- [ ] Tüm flow test
- [ ] Bug fix

---

## BÖLÜM 5: MALİYET KARŞILAŞTIRMASI

### Ücretsiz MVP vs Tam Entegrasyon

| Özellik | Ücretsiz MVP | Tam Entegrasyon |
|---------|--------------|-----------------|
| **Ödeme** | Banka havalesi (0€) | Stripe (%1.4 + 0.25€) |
| **PayPal** | Manuel link (0€) | API (0€ + %2.49) |
| **Kargo Label** | Manuel (0€) | DHL API (~0.05€) |
| **Tracking** | Public URL (0€) | API (~0.01€) |
| **E-posta** | EmailJS ücretsiz | SendGrid (0€ 100/gün) |
| **Auth** | Google OAuth (0€) | Firebase (0€) |
| **TOPLAM** | **0€/ay** | **~215€/ay** |

### Ne Zaman Paid'e Geçilmeli?
- Aylık 500+ sipariş olduğunda
- Müşteriler otomatik label talep ettiğinde
- Manuel ödeme kontrolü zorlaştığında

---

## BÖLÜM 6: SATICI KARGO AKIŞI (ÜCRETSİZ)

```
┌─────────────────────────────────────────────────────────────┐
│                 SATICI KARGO AKIŞI                          │
└─────────────────────────────────────────────────────────────┘

1. SİPARİŞ ALINDI
   │
   │  Satıcı dashboard'da yeni sipariş görür
   │  E-posta bildirimi alır
   │
   ▼
2. ÖDEME KONTROLÜ
   │
   │  Banka havalesi: Admin manuel kontrol eder
   │  PayPal: Otomatik onay (webhook)
   │
   ▼
3. KARGO HAZIRLIK
   │
   │  ┌─────────────────────────────────────────┐
   │  │  📦 Versandauftrag #CSS-2024-1234       │
   │  │                                         │
   │  │  Empfänger:                             │
   │  │  Max Mustermann                         │
   │  │  Musterstraße 123                       │
   │  │  12345 Berlin                           │
   │  │                                         │
   │  │  Gewählter Versand: DHL Paket           │
   │  │                                         │
   │  │  📋 ANLEITUNG:                          │
   │  │  1. Paket sicher verpacken              │
   │  │  2. Bei DHL/Hermes/DPD aufgeben         │
   │  │  3. Sendungsnummer unten eingeben       │
   │  │                                         │
   │  │  ─────────────────────────────────      │
   │  │                                         │
   │  │  Versanddienstleister:                  │
   │  │  [DHL ▾]                                │
   │  │                                         │
   │  │  Sendungsnummer:                        │
   │  │  [00340434161094015902    ]             │
   │  │                                         │
   │  │  ┌─────────────────────────────────┐   │
   │  │  │    ✓ Versand bestätigen        │   │
   │  │  └─────────────────────────────────┘   │
   │  └─────────────────────────────────────────┘
   │
   ▼
4. TRACKING NO DOĞRULAMA
   │
   │  Sistem format kontrolü yapar
   │  Geçersizse: "Ungültige Sendungsnummer"
   │  Geçerliyse: Tracking URL oluşturulur
   │
   ▼
5. ALICI BİLDİRİMİ
   │
   │  Alıcıya e-posta gönderilir:
   │  "Dein Paket wurde versendet!"
   │  + Tracking link
   │
   ▼
6. TAKİP SÜRECİ
   │
   │  Alıcı tracking linkine tıklar
   │  → Kargo firması sitesine yönlendirilir
   │  → Gerçek zamanlı takip görür
   │
   ▼
7. TESLİMAT
   │
   │  Alıcı paketi alır
   │  Dashboard'da "Erhalten" butonuna tıklar
   │  İşlem tamamlanır
```

---

## BÖLÜM 7: MOBİL RESPONSIVE TASARIM

### Breakpoints

```css
/* Mobile First Approach */

/* Base: Mobile (< 576px) */
.container { padding: 16px; }
.checkout-card { width: 100%; }
.btn { width: 100%; padding: 16px; }

/* Tablet (576px - 992px) */
@media (min-width: 576px) {
  .container { padding: 24px; }
  .checkout-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
}

/* Desktop (> 992px) */
@media (min-width: 992px) {
  .container { max-width: 1200px; margin: 0 auto; }
  .checkout-grid { grid-template-columns: 2fr 1fr; }
}
```

### Mobile-First Components

```html
<!-- Mobile Order Card -->
<div class="order-card-mobile">
  <div class="order-header">
    <span class="order-id">#CSS-2024-1234</span>
    <span class="order-status pending">⏳ Warte auf Zahlung</span>
  </div>

  <div class="order-product">
    <img src="product.jpg" alt="">
    <div class="product-info">
      <div class="product-name">Vintage Jacke</div>
      <div class="product-price">40.00€</div>
    </div>
  </div>

  <div class="order-actions">
    <button class="btn-primary">Details ansehen</button>
  </div>
</div>

<style>
.order-card-mobile {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.order-status {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
}

.order-status.pending {
  background: #FFF3E0;
  color: #E65100;
}

.order-product {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid #F0F0F0;
  border-bottom: 1px solid #F0F0F0;
}

.order-product img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: #E8854C;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  margin-top: 12px;
  transition: all 0.3s ease;
}

.btn-primary:hover, .btn-primary:active {
  background: #2D5016;
}
</style>
```

---

## SONUÇ

Bu plan ile **0€ başlangıç maliyeti** ile tam çalışan bir e-ticaret sistemi kurulabilir:

✅ **Ücretsiz Auth** - Google OAuth
✅ **Ücretsiz Ödeme** - Banka havalesi + manuel PayPal
✅ **Ücretsiz Kargo Takip** - Public tracking URL'leri
✅ **Ücretsiz E-posta** - EmailJS

Sistem büyüdükçe (500+ sipariş/ay) Stripe, DHL API gibi ücretli servislere geçiş yapılabilir.

---

*Bu plan 28.12.2024 tarihinde oluşturulmuştur.*
