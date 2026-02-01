# CSS BERLIN - ÖDEME, KARGO & GÜVENLİK SİSTEMİ

## BÖLÜM 1: ÖDEME SİSTEMİ (Stripe + PayPal + Klarna)

### 1.1 Neden Stripe?

| Özellik | Detay |
|---------|-------|
| **Aylık Ücret** | 0€ |
| **İşlem Başına** | %1.4 + 0.25€ (Kart), %5.99 + 0.30€ (Klarna) |
| **Başlangıç** | Ücretsiz kayıt, anında başlangıç |
| **Entegrasyon** | PayPal, Klarna, SEPA, Sofort tek dashboard |
| **Escrow Desteği** | Stripe Connect ile mümkün |

**Kaynak:** [Stripe Pricing Germany](https://stripe.com/en-de/pricing)

### 1.2 Ödeme Akışı (Stripe Connect)

```
┌─────────────────────────────────────────────────────────────┐
│                    ÖDEME AKIŞI                              │
└─────────────────────────────────────────────────────────────┘

ALICI                    CSS BERLIN (ESCROW)              SATICI
  │                            │                            │
  │─── Ödeme yapılır ────────▶│                            │
  │    (Stripe Checkout)       │                            │
  │                            │                            │
  │                            │── "Paket gönder" ────────▶│
  │                            │   bildirimi                │
  │                            │                            │
  │                            │◀── Tracking no girer ─────│
  │                            │                            │
  │◀── "Kargoya verildi" ─────│                            │
  │    bildirimi               │                            │
  │                            │                            │
  │─── "Teslim aldım" ───────▶│                            │
  │    onayı                   │                            │
  │                            │                            │
  │                            │─── Para transferi ───────▶│
  │                            │    (Stripe Connect)        │
  │                            │                            │
```

### 1.3 Stripe Connect Entegrasyonu

```javascript
// payment-service.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// 1. Satıcı Stripe hesabı oluştur (Onboarding)
async function createSellerAccount(sellerId, email) {
  const account = await stripe.accounts.create({
    type: 'express', // Kolay onboarding
    country: 'DE',
    email: email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: 'individual',
    metadata: {
      seller_id: sellerId
    }
  });

  // Onboarding linki oluştur
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: 'https://cssberlin.de/seller/stripe-refresh',
    return_url: 'https://cssberlin.de/seller/stripe-complete',
    type: 'account_onboarding',
  });

  return { account, onboardingUrl: accountLink.url };
}

// 2. Checkout Session oluştur (Alıcı için)
async function createCheckoutSession(order) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'klarna', 'paypal', 'sepa_debit', 'sofort'],
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: order.productName,
          description: order.productDescription,
          images: [order.productImage],
        },
        unit_amount: Math.round(order.productPrice * 100), // Cent
      },
      quantity: 1,
    }, {
      price_data: {
        currency: 'eur',
        product_data: {
          name: `Versand (${order.carrier})`,
        },
        unit_amount: Math.round(order.shippingCost * 100),
      },
      quantity: 1,
    }, {
      price_data: {
        currency: 'eur',
        product_data: {
          name: 'Käuferschutz',
          description: 'CSS Berlin Buyer Protection',
        },
        unit_amount: Math.round(order.buyerProtectionFee * 100),
      },
      quantity: 1,
    }],
    // ESCROW: Para platform hesabında tutulur
    payment_intent_data: {
      // Transfer teslimat onayından sonra yapılacak
      transfer_group: order.orderId,
      metadata: {
        order_id: order.orderId,
        seller_id: order.sellerId,
        buyer_id: order.buyerId,
      }
    },
    success_url: `https://cssberlin.de/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `https://cssberlin.de/order/cancel`,
    customer_email: order.buyerEmail,
    metadata: {
      order_id: order.orderId,
    }
  });

  return session;
}

// 3. Teslimat onayından sonra satıcıya transfer
async function releasePaymentToSeller(orderId) {
  const order = await getOrder(orderId);

  // Platform komisyonu düş
  const platformFee = order.buyerProtectionFee; // Buyer protection fee = komisyon
  const sellerAmount = (order.productPrice + order.shippingCost) - platformFee;

  const transfer = await stripe.transfers.create({
    amount: Math.round(sellerAmount * 100),
    currency: 'eur',
    destination: order.sellerStripeAccountId,
    transfer_group: orderId,
    metadata: {
      order_id: orderId,
    }
  });

  return transfer;
}

// 4. İade işlemi (dispute durumunda)
async function refundBuyer(orderId, reason) {
  const order = await getOrder(orderId);

  const refund = await stripe.refunds.create({
    payment_intent: order.paymentIntentId,
    reason: reason, // 'requested_by_customer', 'duplicate', 'fraudulent'
    metadata: {
      order_id: orderId,
      refund_reason: reason,
    }
  });

  return refund;
}
```

### 1.4 Checkout UI (Almanca)

```html
<!-- checkout.html -->
<div class="checkout-container">
  <div class="checkout-main">
    <!-- Sipariş Özeti -->
    <div class="order-summary-card">
      <h2>Bestellübersicht</h2>

      <div class="product-row">
        <img src="product.jpg" alt="">
        <div class="product-details">
          <div class="product-name">Vintage Lederjacke</div>
          <div class="product-seller">Verkäufer: @maxmuster</div>
        </div>
        <div class="product-price">45.00€</div>
      </div>
    </div>

    <!-- Kargo Seçimi -->
    <div class="shipping-card">
      <h3>📦 Versandoption</h3>

      <div class="shipping-options">
        <label class="shipping-option">
          <input type="radio" name="shipping" value="dhl" checked>
          <div class="option-content">
            <img src="/images/carriers/dhl.png" alt="DHL">
            <div class="option-details">
              <span class="carrier-name">DHL Paket</span>
              <span class="delivery-time">2-3 Werktage</span>
            </div>
            <span class="shipping-price">4.99€</span>
          </div>
        </label>

        <label class="shipping-option">
          <input type="radio" name="shipping" value="hermes">
          <div class="option-content">
            <img src="/images/carriers/hermes.png" alt="Hermes">
            <div class="option-details">
              <span class="carrier-name">Hermes</span>
              <span class="delivery-time">2-4 Werktage</span>
            </div>
            <span class="shipping-price">4.50€</span>
          </div>
        </label>

        <label class="shipping-option">
          <input type="radio" name="shipping" value="pickup">
          <div class="option-content">
            <span class="pickup-icon">🤝</span>
            <div class="option-details">
              <span class="carrier-name">Abholung</span>
              <span class="delivery-time">Nach Vereinbarung</span>
            </div>
            <span class="shipping-price">0.00€</span>
          </div>
        </label>
      </div>
    </div>

    <!-- Teslimat Adresi -->
    <div class="address-card">
      <h3>📍 Lieferadresse</h3>

      <div class="saved-address">
        <p><strong>Max Mustermann</strong></p>
        <p>Musterstraße 123</p>
        <p>12345 Berlin</p>
        <button class="btn-link">Ändern</button>
      </div>
    </div>
  </div>

  <!-- Sidebar: Toplam -->
  <div class="checkout-sidebar">
    <div class="total-card">
      <h3>Zusammenfassung</h3>

      <div class="total-row">
        <span>Artikelpreis</span>
        <span>45.00€</span>
      </div>

      <div class="total-row">
        <span>Versand</span>
        <span id="shipping-cost">4.99€</span>
      </div>

      <div class="total-row">
        <span>Käuferschutz</span>
        <span id="protection-fee">2.95€</span>
      </div>

      <div class="total-divider"></div>

      <div class="total-row total-final">
        <span>Gesamt</span>
        <span id="total-amount">52.94€</span>
      </div>

      <!-- Ödeme Yöntemleri -->
      <div class="payment-methods">
        <p>Akzeptierte Zahlungsarten:</p>
        <div class="payment-icons">
          <img src="/images/payments/visa.svg" alt="Visa">
          <img src="/images/payments/mastercard.svg" alt="Mastercard">
          <img src="/images/payments/paypal.svg" alt="PayPal">
          <img src="/images/payments/klarna.svg" alt="Klarna">
          <img src="/images/payments/sepa.svg" alt="SEPA">
        </div>
      </div>

      <!-- Checkout Button -->
      <button id="checkout-btn" class="btn-checkout">
        🔒 Jetzt sicher bezahlen
      </button>

      <div class="security-badges">
        <span>✓ Käuferschutz</span>
        <span>✓ SSL verschlüsselt</span>
        <span>✓ Sichere Zahlung</span>
      </div>
    </div>
  </div>
</div>

<script src="https://js.stripe.com/v3/"></script>
<script>
  const stripe = Stripe('pk_live_YOUR_PUBLISHABLE_KEY');

  document.getElementById('checkout-btn').addEventListener('click', async () => {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: ORDER_ID,
        shipping: document.querySelector('input[name="shipping"]:checked').value
      })
    });

    const session = await response.json();

    // Stripe Checkout'a yönlendir
    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });

    if (result.error) {
      alert(result.error.message);
    }
  });
</script>
```

---

## BÖLÜM 2: KARGO SİSTEMİ (Akıllı Yönlendirme)

### 2.1 Ürün Formu - Paket Boyutu

```html
<!-- inserieren.html - Ürün Ekleme Formu -->
<div class="form-section">
  <h3>📦 Versandangaben</h3>

  <div class="package-dimensions">
    <h4>Paketmaße (in cm)</h4>

    <div class="dimension-inputs">
      <div class="input-group">
        <label>Länge</label>
        <input type="number" id="length" placeholder="30" min="1" max="200">
        <span class="unit">cm</span>
      </div>

      <div class="input-group">
        <label>Breite</label>
        <input type="number" id="width" placeholder="20" min="1" max="200">
        <span class="unit">cm</span>
      </div>

      <div class="input-group">
        <label>Höhe</label>
        <input type="number" id="height" placeholder="10" min="1" max="200">
        <span class="unit">cm</span>
      </div>

      <div class="input-group">
        <label>Gewicht</label>
        <input type="number" id="weight" placeholder="2" min="0.1" max="31.5" step="0.1">
        <span class="unit">kg</span>
      </div>
    </div>

    <!-- Otomatik Paket Sınıfı Hesaplama -->
    <div class="package-class-result" id="packageClassResult">
      <div class="recommended-carriers">
        <h4>Empfohlene Versandoptionen:</h4>
        <div class="carrier-recommendations" id="carrierRecommendations">
          <!-- JavaScript ile doldurulacak -->
        </div>
      </div>
    </div>
  </div>
</div>

<script>
// Paket sınıfı hesaplama
const CARRIER_SIZES = {
  dhl: [
    { name: 'Päckchen S', maxLength: 35, maxWidth: 25, maxHeight: 10, maxWeight: 2, price: 3.99 },
    { name: 'Päckchen M', maxLength: 60, maxWidth: 30, maxHeight: 15, maxWeight: 2, price: 4.79 },
    { name: 'Paket 2kg', maxLength: 60, maxWidth: 30, maxHeight: 15, maxWeight: 2, price: 5.49 },
    { name: 'Paket 5kg', maxLength: 60, maxWidth: 30, maxHeight: 15, maxWeight: 5, price: 6.99 },
    { name: 'Paket 10kg', maxLength: 120, maxWidth: 60, maxHeight: 60, maxWeight: 10, price: 9.49 },
    { name: 'Paket 31.5kg', maxLength: 120, maxWidth: 60, maxHeight: 60, maxWeight: 31.5, price: 16.49 },
  ],
  hermes: [
    { name: 'Päckchen', maxSum: 37, maxWeight: 25, price: 3.80 },
    { name: 'S-Paket', maxSum: 50, maxWeight: 25, price: 4.50 },
    { name: 'M-Paket', maxSum: 80, maxWeight: 25, price: 5.50 },
    { name: 'L-Paket', maxSum: 120, maxWeight: 25, price: 8.00 },
    { name: 'XL-Paket', maxSum: 150, maxWeight: 31.5, price: 15.00 },
  ]
};

function calculatePackageClass(length, width, height, weight) {
  const recommendations = [];

  // DHL hesaplama
  for (const size of CARRIER_SIZES.dhl) {
    if (length <= size.maxLength && width <= size.maxWidth &&
        height <= size.maxHeight && weight <= size.maxWeight) {
      recommendations.push({
        carrier: 'DHL',
        logo: '/images/carriers/dhl.png',
        sizeName: size.name,
        price: size.price,
        url: 'https://www.dhl.de/de/privatkunden/pakete-versenden/online-frankieren.html'
      });
      break;
    }
  }

  // Hermes hesaplama (Longest + Shortest)
  const dimensions = [length, width, height].sort((a, b) => b - a);
  const hermesSum = dimensions[0] + dimensions[2]; // Longest + Shortest

  for (const size of CARRIER_SIZES.hermes) {
    if (hermesSum <= size.maxSum && weight <= size.maxWeight) {
      recommendations.push({
        carrier: 'Hermes',
        logo: '/images/carriers/hermes.png',
        sizeName: size.name,
        price: size.price,
        url: 'https://www.myhermes.de/versenden/paketschein-erstellen/'
      });
      break;
    }
  }

  return recommendations;
}

// Input değiştiğinde hesapla
['length', 'width', 'height', 'weight'].forEach(id => {
  document.getElementById(id).addEventListener('input', updateRecommendations);
});

function updateRecommendations() {
  const length = parseFloat(document.getElementById('length').value) || 0;
  const width = parseFloat(document.getElementById('width').value) || 0;
  const height = parseFloat(document.getElementById('height').value) || 0;
  const weight = parseFloat(document.getElementById('weight').value) || 0;

  if (length && width && height && weight) {
    const recommendations = calculatePackageClass(length, width, height, weight);
    displayRecommendations(recommendations);
  }
}

function displayRecommendations(recommendations) {
  const container = document.getElementById('carrierRecommendations');
  container.innerHTML = recommendations.map(rec => `
    <div class="carrier-rec-card">
      <img src="${rec.logo}" alt="${rec.carrier}">
      <div class="rec-details">
        <span class="carrier-name">${rec.carrier}</span>
        <span class="size-name">${rec.sizeName}</span>
      </div>
      <span class="rec-price">${rec.price.toFixed(2)}€</span>
    </div>
  `).join('');

  document.getElementById('packageClassResult').style.display = 'block';
}
</script>
```

### 2.2 Alıcı Kargo Yönlendirme Sistemi

```javascript
// shipping-redirect.js

/**
 * Kargo firmasına akıllı yönlendirme
 * Not: Maalesef DHL ve Hermes deep link parametreleri desteklemiyor
 * Bu yüzden kullanıcıya talimatlarla birlikte yönlendiriyoruz
 */

const CARRIER_URLS = {
  dhl: {
    name: 'DHL',
    baseUrl: 'https://www.dhl.de/de/privatkunden/pakete-versenden/online-frankieren.html',
    // DHL için alternatif: Portoberater ile başla
    calculatorUrl: 'https://www.dhl.de/de/privatkunden/pakete-versenden/portoberater.html',
    instructions: [
      '1. "Online Frankierung" sayfasına yönlendirileceksiniz',
      '2. Paket boyutunu seçin: {packageSize}',
      '3. Gönderen: Satıcı bilgileri otomatik gelecek',
      '4. Alıcı: Sizin adresiniz',
      '5. Ödemeyi tamamlayın (PayPal/Kart)',
      '6. QR kodu veya PDF etiketi alın',
      '7. Sendungsnummer\'i kopyalayın ve CSS Berlin\'e girin'
    ]
  },
  hermes: {
    name: 'Hermes',
    baseUrl: 'https://www.myhermes.de/versenden/paketschein-erstellen/',
    instructions: [
      '1. "Paketschein erstellen" sayfasına yönlendirileceksiniz',
      '2. Paket boyutunu seçin: {packageSize}',
      '3. Adresleri girin',
      '4. Online ödeyin',
      '5. Mobilen Paketschein (QR) veya PDF alın',
      '6. Sendungsnummer\'i CSS Berlin\'e girin'
    ]
  },
  dpd: {
    name: 'DPD',
    baseUrl: 'https://www.dpd.com/de/de/versenden/online-paketschein/',
    instructions: [
      '1. "Online Paketschein" sayfasına yönlendirileceksiniz',
      '2. Paket boyutunu seçin',
      '3. Adresleri girin ve ödeyin',
      '4. Tracking numarasını CSS Berlin\'e girin'
    ]
  }
};

/**
 * Kargo satın alma modal'ı göster
 */
function showShippingPurchaseModal(order) {
  const carrier = CARRIER_URLS[order.selectedCarrier];
  const packageInfo = order.packageDimensions;

  // Paket boyutunu hesapla
  let packageSizeText = '';
  if (order.selectedCarrier === 'dhl') {
    packageSizeText = `DHL ${getDHLPackageSize(packageInfo)}`;
  } else if (order.selectedCarrier === 'hermes') {
    packageSizeText = `Hermes ${getHermesPackageSize(packageInfo)}`;
  }

  const modalHTML = `
    <div class="shipping-modal-overlay" id="shippingModal">
      <div class="shipping-modal">
        <button class="modal-close" onclick="closeShippingModal()">&times;</button>

        <div class="modal-header">
          <img src="/images/carriers/${order.selectedCarrier}.png" alt="${carrier.name}">
          <h2>Versandlabel bei ${carrier.name} kaufen</h2>
        </div>

        <div class="modal-body">
          <!-- Paket Bilgileri -->
          <div class="package-info-card">
            <h3>📦 Paketinformationen</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Größe:</span>
                <span class="value">${packageInfo.length}×${packageInfo.width}×${packageInfo.height} cm</span>
              </div>
              <div class="info-item">
                <span class="label">Gewicht:</span>
                <span class="value">${packageInfo.weight} kg</span>
              </div>
              <div class="info-item">
                <span class="label">Empfohlene Klasse:</span>
                <span class="value highlight">${packageSizeText}</span>
              </div>
              <div class="info-item">
                <span class="label">Geschätzte Kosten:</span>
                <span class="value">${order.shippingCost.toFixed(2)}€</span>
              </div>
            </div>
          </div>

          <!-- Adresler -->
          <div class="addresses-card">
            <div class="address-column">
              <h4>📤 Absender (Verkäufer)</h4>
              <p><strong>${order.seller.name}</strong></p>
              <p>${order.seller.street}</p>
              <p>${order.seller.zip} ${order.seller.city}</p>
            </div>
            <div class="address-column">
              <h4>📥 Empfänger (Sie)</h4>
              <p><strong>${order.buyer.name}</strong></p>
              <p>${order.buyer.street}</p>
              <p>${order.buyer.zip} ${order.buyer.city}</p>
            </div>
          </div>

          <!-- Talimatlar -->
          <div class="instructions-card">
            <h3>📋 Anleitung</h3>
            <ol>
              ${carrier.instructions.map(i =>
                `<li>${i.replace('{packageSize}', packageSizeText)}</li>`
              ).join('')}
            </ol>
          </div>

          <!-- Kopyalanacak Bilgiler -->
          <div class="copy-info-card">
            <h4>📋 Zum Kopieren (für ${carrier.name}):</h4>
            <div class="copy-fields">
              <div class="copy-field">
                <label>Empfänger Name:</label>
                <div class="copy-row">
                  <input type="text" value="${order.buyer.name}" readonly>
                  <button onclick="copyText(this)">📋</button>
                </div>
              </div>
              <div class="copy-field">
                <label>Straße:</label>
                <div class="copy-row">
                  <input type="text" value="${order.buyer.street}" readonly>
                  <button onclick="copyText(this)">📋</button>
                </div>
              </div>
              <div class="copy-field">
                <label>PLZ / Ort:</label>
                <div class="copy-row">
                  <input type="text" value="${order.buyer.zip} ${order.buyer.city}" readonly>
                  <button onclick="copyText(this)">📋</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <a href="${carrier.baseUrl}" target="_blank" class="btn-primary btn-large" id="goToCarrier">
            <img src="/images/carriers/${order.selectedCarrier}.png" alt="">
            Zu ${carrier.name} gehen und Label kaufen
            <span class="external-icon">↗</span>
          </a>

          <p class="help-text">
            Nach dem Kauf, bitte Sendungsnummer hier eingeben:
          </p>

          <div class="tracking-input-row">
            <input type="text" id="trackingNumberInput"
                   placeholder="Sendungsnummer eingeben (z.B. 00340434161094015902)">
            <button onclick="submitTrackingNumber()" class="btn-secondary">
              ✓ Bestätigen
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function copyText(button) {
  const input = button.previousElementSibling;
  input.select();
  document.execCommand('copy');

  button.textContent = '✓';
  setTimeout(() => button.textContent = '📋', 2000);
}

async function submitTrackingNumber() {
  const trackingNumber = document.getElementById('trackingNumberInput').value.trim();
  const carrier = currentOrder.selectedCarrier;

  // Tracking number format doğrulama
  if (!validateTrackingNumber(carrier, trackingNumber)) {
    showError('Ungültige Sendungsnummer für ' + carrier.toUpperCase());
    return;
  }

  // API'ye gönder
  const response = await fetch('/api/orders/tracking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId: currentOrder.id,
      carrier: carrier,
      trackingNumber: trackingNumber
    })
  });

  if (response.ok) {
    closeShippingModal();
    showSuccess('Sendungsnummer gespeichert! Der Käufer wurde benachrichtigt.');
  }
}

function validateTrackingNumber(carrier, number) {
  const patterns = {
    dhl: /^\d{10,22}$/,
    hermes: /^[A-Z0-9]{10,20}$/i,
    dpd: /^\d{14}$/
  };
  return patterns[carrier]?.test(number) || false;
}
```

---

## BÖLÜM 3: GÜVENLİK & DOLANDIRICILIK KORUMASI

### 3.1 Kleinanzeigen Modeli Analizi

**Kaynak:** [Online Payment Platform - eBay Kleinanzeigen](https://blog.onlinepaymentplatform.com/en/ebay-kleinanzeigen-chooses-online-payment-platform-as-payment-provider)

| Özellik | Kleinanzeigen | CSS Berlin (Önerimiz) |
|---------|---------------|----------------------|
| **Escrow** | OPP ile | Stripe Connect ile |
| **Mesajlaşma** | Platform içi | Platform içi |
| **Ödeme Koruması** | "Sicher bezahlen" | "Käuferschutz" |
| **İade** | 14 gün | 14 gün (Almanya yasası) |
| **Dispute** | OPP ekibi | CSS Berlin ekibi |

### 3.2 Yasal Sorumluluk Sınırlama (Disclaimer)

```html
<!-- agb.html - Allgemeine Geschäftsbedingungen -->

<section class="legal-section">
  <h2>§ 8 Haftungsbeschränkung</h2>

  <h3>8.1 Plattformhaftung</h3>
  <p>
    CSS Berlin GmbH betreibt eine Online-Plattform, die es Nutzern ermöglicht,
    Second-Hand-Waren zu kaufen und zu verkaufen. CSS Berlin ist selbst
    <strong>kein Vertragspartner</strong> der zwischen Käufern und Verkäufern
    geschlossenen Kaufverträge.
  </p>

  <h3>8.2 Keine Garantie für Transaktionen</h3>
  <p>
    CSS Berlin übernimmt <strong>keine Gewährleistung</strong> für:
  </p>
  <ul>
    <li>Die Richtigkeit der Artikelbeschreibungen</li>
    <li>Die Qualität oder den Zustand der angebotenen Artikel</li>
    <li>Die Identität oder Bonität der Nutzer</li>
    <li>Die erfolgreiche Durchführung von Transaktionen</li>
  </ul>

  <h3>8.3 Käuferschutz</h3>
  <p>
    Der CSS Berlin Käuferschutz ist ein <strong>freiwilliger Service</strong>
    und keine Garantie. Bei Streitigkeiten bemüht sich CSS Berlin um eine
    faire Lösung, kann jedoch keine bestimmten Ergebnisse garantieren.
  </p>

  <h3>8.4 Empfehlung: Sichere Zahlung</h3>
  <p>
    Wir empfehlen dringend, ausschließlich die integrierten Zahlungsmethoden
    zu nutzen (Kreditkarte, PayPal, Klarna). Bei Zahlungen außerhalb der
    Plattform (z.B. Vorkasse per Überweisung) besteht <strong>kein
    Käuferschutz</strong>.
  </p>
</section>

<section class="legal-section">
  <h2>§ 9 Betrugsschutz</h2>

  <h3>9.1 Escrow-System</h3>
  <p>
    Bei Nutzung des CSS Berlin Käuferschutzes wird die Zahlung des Käufers
    in einem <strong>Treuhandkonto (Escrow)</strong> gehalten, bis:
  </p>
  <ol>
    <li>Der Verkäufer die Sendungsnummer eingegeben hat</li>
    <li>Der Käufer den Erhalt der Ware bestätigt hat</li>
    <li>ODER 14 Tage nach Versand ohne Reklamation vergangen sind</li>
  </ol>

  <h3>9.2 Streitbeilegung</h3>
  <p>
    Im Falle eines Streits:
  </p>
  <ol>
    <li>Käufer meldet Problem innerhalb von <strong>48 Stunden</strong> nach Erhalt</li>
    <li>CSS Berlin prüft den Fall (Fotos, Kommunikation, Tracking)</li>
    <li>Entscheidung innerhalb von <strong>5 Werktagen</strong></li>
    <li>Bei Käufer-Vorteil: Volle Rückerstattung</li>
    <li>Bei Verkäufer-Vorteil: Zahlung wird freigegeben</li>
  </ol>
</section>
```

### 3.3 Güvenlik Kontrolleri

```javascript
// security-checks.js

/**
 * Dolandırıcılık Tespit Sistemi
 */

const FRAUD_INDICATORS = {
  // Yeni hesap uyarısı
  newAccount: (user) => {
    const daysSinceRegistration = (Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24);
    return daysSinceRegistration < 7;
  },

  // Yüksek değerli ilk satış
  highValueFirstSale: (user, order) => {
    return user.salesCount === 0 && order.totalAmount > 200;
  },

  // Hızlı fiyat düşürme
  rapidPriceReduction: (product) => {
    return product.priceHistory.some((p, i, arr) => {
      if (i === 0) return false;
      const reduction = (arr[i-1].price - p.price) / arr[i-1].price;
      return reduction > 0.5; // %50'den fazla düşüş
    });
  },

  // Şüpheli mesaj kalıpları
  suspiciousMessages: (messages) => {
    const redFlags = [
      'whatsapp', 'telegram', 'direkt überweisen',
      'außerhalb der plattform', 'sofort bezahlen',
      'western union', 'bitcoin', 'crypto'
    ];
    return messages.some(m =>
      redFlags.some(flag => m.content.toLowerCase().includes(flag))
    );
  }
};

/**
 * Risk skoru hesapla
 */
function calculateRiskScore(user, order, messages) {
  let score = 0;
  const flags = [];

  if (FRAUD_INDICATORS.newAccount(user)) {
    score += 20;
    flags.push('Neues Konto (< 7 Tage)');
  }

  if (FRAUD_INDICATORS.highValueFirstSale(user, order)) {
    score += 30;
    flags.push('Hochwertiger erster Verkauf');
  }

  if (user.verificationStatus !== 'verified') {
    score += 15;
    flags.push('Nicht verifiziert');
  }

  if (FRAUD_INDICATORS.suspiciousMessages(messages)) {
    score += 40;
    flags.push('Verdächtige Nachrichten');
  }

  return { score, flags, riskLevel: getRiskLevel(score) };
}

function getRiskLevel(score) {
  if (score >= 50) return { level: 'HIGH', color: '#F44336', action: 'BLOCK' };
  if (score >= 30) return { level: 'MEDIUM', color: '#FF9800', action: 'REVIEW' };
  return { level: 'LOW', color: '#4CAF50', action: 'ALLOW' };
}

/**
 * Alıcıya uyarı göster
 */
function showBuyerWarning(riskResult) {
  if (riskResult.riskLevel.level === 'HIGH') {
    return `
      <div class="warning-banner high">
        <span class="warning-icon">⚠️</span>
        <div class="warning-content">
          <strong>Achtung: Hohes Risiko</strong>
          <p>Bei diesem Verkäufer wurden Auffälligkeiten festgestellt:</p>
          <ul>
            ${riskResult.flags.map(f => `<li>${f}</li>`).join('')}
          </ul>
          <p><strong>Empfehlung:</strong> Nutzen Sie unbedingt den Käuferschutz!</p>
        </div>
      </div>
    `;
  }

  if (riskResult.riskLevel.level === 'MEDIUM') {
    return `
      <div class="warning-banner medium">
        <span class="warning-icon">ℹ️</span>
        <div class="warning-content">
          <strong>Hinweis</strong>
          <p>Dies ist ein relativ neuer Verkäufer. Nutzen Sie den Käuferschutz für zusätzliche Sicherheit.</p>
        </div>
      </div>
    `;
  }

  return '';
}
```

### 3.4 Mesajlaşma Sistemi (Platform İçi)

```javascript
// messaging-system.js

/**
 * Güvenli mesajlaşma sistemi
 * - Tüm mesajlar platform üzerinden
 * - Kişisel bilgi filtreleme
 * - Şüpheli içerik tespiti
 */

const BLOCKED_PATTERNS = [
  // Telefon numaraları
  /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
  // E-posta adresleri
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  // WhatsApp/Telegram
  /whatsapp|telegram|signal|viber/gi,
  // IBAN
  /[A-Z]{2}\d{2}[A-Z0-9]{4,}/g,
];

function sanitizeMessage(content) {
  let sanitized = content;
  let warnings = [];

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(content)) {
      sanitized = sanitized.replace(pattern, '[ENTFERNT]');
      warnings.push('Persönliche Kontaktdaten wurden entfernt');
    }
  }

  return { sanitized, warnings };
}

/**
 * Mesaj gönder
 */
async function sendMessage(conversationId, senderId, content) {
  const { sanitized, warnings } = sanitizeMessage(content);

  // Veritabanına kaydet
  const message = await db.messages.create({
    conversationId,
    senderId,
    content: sanitized,
    originalContent: content, // Admin için
    wasFiltered: warnings.length > 0,
    createdAt: new Date()
  });

  // Gerçek zamanlı bildirim
  socketIO.to(conversationId).emit('newMessage', message);

  // Filtreleme uyarısı
  if (warnings.length > 0) {
    return {
      success: true,
      message,
      warning: 'Einige Inhalte wurden aus Sicherheitsgründen entfernt. ' +
               'Bitte teilen Sie keine persönlichen Kontaktdaten.'
    };
  }

  return { success: true, message };
}
```

---

## BÖLÜM 4: TAM AKIŞ DİYAGRAMI

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CSS BERLIN SATIN ALMA AKIŞI                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  ÜRÜN    │────▶│ PAZARLİK │────▶│ CHECKOUT │────▶│  ÖDEME   │────▶│  KARGO   │
│  GÖRME   │     │ (OPTIONAL)│     │  SAYFASI │     │ (STRIPE) │     │  SEÇİMİ  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                         │
                                                         ▼
                                        ┌─────────────────────────────────┐
                                        │     ESCROW (Para Beklemede)     │
                                        │     Stripe Connect Hesabı       │
                                        └─────────────────────────────────┘
                                                         │
                    ┌────────────────────────────────────┼────────────────────────────────────┐
                    │                                    │                                    │
                    ▼                                    ▼                                    ▼
            ┌──────────────┐                    ┌──────────────┐                    ┌──────────────┐
            │   SATICI     │                    │    ALICI     │                    │  CSS BERLIN  │
            │  BİLDİRİM    │                    │   BEKLER     │                    │   İZLER      │
            └──────────────┘                    └──────────────┘                    └──────────────┘
                    │
                    ▼
            ┌──────────────┐
            │ KARGO SATIN  │
            │   AL MODAL   │
            │              │
            │ ┌──────────┐ │
            │ │DHL/Hermes│ │
            │ │  LINK    │ │
            │ └──────────┘ │
            │              │
            │ Satıcı:      │
            │ 1. Linke git │
            │ 2. Label al  │
            │ 3. QR/PDF al │
            │ 4. Track no  │
            │    gir       │
            └──────────────┘
                    │
                    ▼
            ┌──────────────┐
            │ TRACKING NO  │◀─────── Doğrulama (Format kontrolü)
            │   GİRİŞİ     │
            └──────────────┘
                    │
                    ▼
            ┌──────────────┐
            │   ALICIYA    │
            │  BİLDİRİM    │
            │  + TRACKING  │
            │    LINK      │
            └──────────────┘
                    │
                    ▼
            ┌──────────────┐
            │   TESLİMAT   │
            │              │
            │  ┌────────┐  │
            │  │ DHL/   │  │────▶ Public Tracking URL
            │  │ Hermes │  │
            │  │ Sitesi │  │
            │  └────────┘  │
            └──────────────┘
                    │
                    ▼
            ┌──────────────┐
            │   ONAY       │
            │              │
            │ "Erhalten"   │
            │   butonu     │
            └──────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌──────────────┐        ┌──────────────┐
│    SORUN     │        │    SORUN     │
│    YOK ✅    │        │    VAR ⚠️    │
└──────────────┘        └──────────────┘
        │                       │
        ▼                       ▼
┌──────────────┐        ┌──────────────┐
│    PARA      │        │   DISPUTE    │
│  SATICI'YA   │        │   SÜRECİ     │
│  TRANSFER    │        │              │
│  (Stripe)    │        │ CSS Berlin   │
└──────────────┘        │  inceleme    │
        │               └──────────────┘
        ▼                       │
┌──────────────┐               ├────────────────┐
│ DEĞERLENDİRME│               │                │
│    ⭐⭐⭐⭐⭐  │               ▼                ▼
└──────────────┘        ┌──────────┐    ┌──────────┐
                        │  İADE    │    │   PARA   │
                        │  ALICI   │    │ SATICI'YA│
                        └──────────┘    └──────────┘
```

---

## BÖLÜM 5: UYGULAMA ÖNCELİKLERİ

### Hemen Yapılacaklar (1-3 Gün)
1. ✅ Stripe Connect entegrasyonu
2. ✅ Checkout sayfası
3. ✅ Kargo yönlendirme modal'ı
4. ✅ Tracking no giriş sistemi

### Sonraki Adımlar (4-7 Gün)
5. ⏳ Mesajlaşma sistemi
6. ⏳ Dispute yönetimi
7. ⏳ Admin dashboard
8. ⏳ E-posta bildirimleri

### Maliyet Özeti

| Özellik | Maliyet |
|---------|---------|
| Stripe işlem | %1.4 + 0.25€ (sadece satışta) |
| Klarna | %5.99 + 0.30€ (sadece satışta) |
| PayPal | %2.49 + 0.35€ (sadece satışta) |
| Kargo Label | 0€ (alıcı kargo sitesinden alır) |
| **Aylık Sabit** | **0€** |

---

*Bu plan 28.12.2024 tarihinde oluşturulmuştur.*
