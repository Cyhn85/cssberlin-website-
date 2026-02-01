# CSS Berlin - Payment Integration Documentation
## Stripe Payment System WITHOUT WordPress

---

## Overview

This document provides a complete guide to integrating Stripe payment processing into CSS Berlin's static website without WordPress. This approach uses Stripe's modern APIs for direct integration.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Stripe Setup](#stripe-setup)
3. [Backend API Structure](#backend-api-structure)
4. [Frontend Integration](#frontend-integration)
5. [Multi-Vendor Split Payments](#multi-vendor-split-payments)
6. [Payment Flow](#payment-flow)
7. [Security Considerations](#security-considerations)
8. [Testing](#testing)

---

## Architecture Overview

### System Components

```
┌─────────────────┐
│  Frontend       │
│  (Static HTML)  │
│  GitHub Pages   │
└────────┬────────┘
         │
         │ HTTPS
         │
┌────────▼────────┐
│  Backend API    │
│  (Node.js)      │
│  Cloudflare     │
│  Workers        │
└────────┬────────┘
         │
         │ Stripe API
         │
┌────────▼────────┐
│  Stripe         │
│  Payment        │
│  Processing     │
└─────────────────┘
```

### Technology Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla JS)
- **Backend**: Cloudflare Workers (Serverless)
- **Payment Gateway**: Stripe Checkout / Payment Intents API
- **Database**: Cloudflare KV or D1 (for order storage)
- **Hosting**: GitHub Pages + Cloudflare

---

## Stripe Setup

### 1. Create Stripe Account

1. Register at [stripe.com](https://stripe.com)
2. Complete business verification
3. Enable EUR currency for German market

### 2. Get API Keys

Navigate to **Developers → API Keys**:

- **Publishable Key** (pk_live_...) - Safe for frontend
- **Secret Key** (sk_live_...) - NEVER expose to frontend

### 3. Enable Stripe Connect (for Multi-Vendor)

Required for split payments between sellers and platform:

1. Go to **Connect** in Stripe Dashboard
2. Enable **Express** or **Custom** accounts
3. Configure platform fee (10%)

---

## Backend API Structure

### Option 1: Cloudflare Workers (Recommended)

**File: `worker.js`**

```javascript
// Cloudflare Worker for Stripe Integration
const STRIPE_SECRET_KEY = 'sk_live_YOUR_SECRET_KEY';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  // CORS Headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://your-domain.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Route handling
  if (url.pathname === '/api/create-checkout-session') {
    return createCheckoutSession(request, corsHeaders);
  }

  if (url.pathname === '/api/webhook') {
    return handleWebhook(request);
  }

  return new Response('Not Found', { status: 404 });
}

async function createCheckoutSession(request, corsHeaders) {
  try {
    const { productId, quantity, sellerId } = await request.json();

    // Create Stripe Checkout Session
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[]': 'card',
        'line_items[0][price_data][currency]': 'eur',
        'line_items[0][price_data][product_data][name]': 'Product Name',
        'line_items[0][price_data][unit_amount]': '4500', // €45.00 in cents
        'line_items[0][quantity]': quantity,
        'mode': 'payment',
        'success_url': 'https://your-domain.com/success.html?session_id={CHECKOUT_SESSION_ID}',
        'cancel_url': 'https://your-domain.com/cancel.html',
        // Platform fee (10%)
        'payment_intent_data[application_fee_amount]': '450', // 10% of 4500
        'payment_intent_data[transfer_data][destination]': sellerId, // Seller's Stripe account
      }),
    });

    const session = await response.json();

    return new Response(JSON.stringify(session), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleWebhook(request) {
  const sig = request.headers.get('stripe-signature');
  const payload = await request.text();

  // Verify webhook signature
  // Handle events: payment_intent.succeeded, etc.

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

### Option 2: Node.js Backend (Alternative)

**File: `server.js`**

```javascript
const express = require('express');
const stripe = require('stripe')('sk_live_YOUR_SECRET_KEY');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'https://your-domain.com' }));

// Create Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { productId, quantity, price, sellerId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Product Name',
          },
          unit_amount: price * 100, // Convert to cents
        },
        quantity: quantity,
      }],
      mode: 'payment',
      success_url: 'https://your-domain.com/success.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://your-domain.com/cancel.html',
      payment_intent_data: {
        application_fee_amount: Math.round(price * 100 * 0.10), // 10% platform fee
        transfer_data: {
          destination: sellerId, // Seller's Stripe Connect account
        },
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint
app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = 'whsec_YOUR_WEBHOOK_SECRET';

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Update order status in database
      break;
    case 'payment_intent.payment_failed':
      console.log('Payment failed');
      break;
  }

  res.json({ received: true });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## Frontend Integration

### 1. Include Stripe.js

Add to your HTML `<head>`:

```html
<script src="https://js.stripe.com/v3/"></script>
```

### 2. Buy Button Implementation

**File: `script.js`**

```javascript
// Initialize Stripe with your publishable key
const stripe = Stripe('pk_live_YOUR_PUBLISHABLE_KEY');

// Handle Buy Button Click
function handleBuyClick(productId) {
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return;

    // Show loading state
    showNotification('Verarbeitung...', 'info');

    // Create checkout session
    fetch('https://your-api-domain.com/api/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productId: product.id,
            quantity: 1,
            price: product.price,
            sellerId: product.sellerId || 'acct_SELLER_STRIPE_ID',
        }),
    })
    .then(response => response.json())
    .then(session => {
        // Redirect to Stripe Checkout
        return stripe.redirectToCheckout({ sessionId: session.sessionId });
    })
    .then(result => {
        if (result.error) {
            showNotification(result.error.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Fehler bei der Zahlung', 'error');
    });
}

// Success Page (success.html)
function handlePaymentSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
        // Verify payment with your backend
        fetch(`https://your-api-domain.com/api/verify-payment?session_id=${sessionId}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'complete') {
                    showSuccessMessage(data.orderNumber);
                    trackCO2Savings(data.carbonSaved);
                }
            });
    }
}
```

### 3. Success Page

**File: `success.html`**

```html
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Zahlung erfolgreich - CSS Berlin</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="success-container">
        <div class="success-icon">✓</div>
        <h1>Zahlung erfolgreich!</h1>
        <p>Vielen Dank für deinen Einkauf!</p>
        <p>Bestellnummer: <span id="orderNumber">Loading...</span></p>
        <p class="co2-saved">Du hast <strong id="co2Amount">0</strong>kg CO₂ gespart! 🌍</p>
        <a href="index.html" class="btn-primary">Zurück zum Shop</a>
    </div>

    <script src="https://js.stripe.com/v3/"></script>
    <script>
        // Extract session ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');

        // Verify payment
        fetch(`https://your-api-domain.com/api/verify-payment?session_id=${sessionId}`)
            .then(res => res.json())
            .then(data => {
                document.getElementById('orderNumber').textContent = data.orderNumber;
                document.getElementById('co2Amount').textContent = data.carbonSaved;
            });
    </script>
</body>
</html>
```

---

## Multi-Vendor Split Payments

### Stripe Connect Setup

1. **Platform Registration**
   - Platform = CSS Berlin (your main account)
   - Sellers = Individual vendor accounts

2. **Seller Onboarding Flow**

```javascript
// Create onboarding link for sellers
async function createSellerOnboardingLink(sellerId) {
    const response = await fetch('https://your-api-domain.com/api/create-account-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId }),
    });

    const { url } = await response.json();
    window.location.href = url; // Redirect seller to Stripe onboarding
}
```

**Backend:**

```javascript
app.post('/api/create-account-link', async (req, res) => {
    const { sellerId } = req.body;

    // Create Stripe Connect account if doesn't exist
    let account;
    if (!sellerId) {
        account = await stripe.accounts.create({
            type: 'express',
            country: 'DE',
            email: req.body.email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        });
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: 'https://your-domain.com/seller/reauth',
        return_url: 'https://your-domain.com/seller/dashboard',
        type: 'account_onboarding',
    });

    res.json({ url: accountLink.url, accountId: account.id });
});
```

### Payment Split Logic

```javascript
// 90% to seller, 10% to platform
const totalAmount = 4500; // €45.00 in cents
const platformFee = Math.round(totalAmount * 0.10); // €4.50
const sellerAmount = totalAmount - platformFee; // €40.50

const session = await stripe.checkout.sessions.create({
    // ... other params
    payment_intent_data: {
        application_fee_amount: platformFee, // Platform keeps this
        transfer_data: {
            destination: sellerStripeAccountId, // Seller receives this
        },
    },
});
```

---

## Payment Flow

### Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      User Journey                            │
└─────────────────────────────────────────────────────────────┘

1. User clicks "Kaufen" button
   ↓
2. Frontend calls /api/create-checkout-session
   ↓
3. Backend creates Stripe Checkout Session with split payment
   ↓
4. User redirected to Stripe Checkout page
   ↓
5. User enters card details and confirms
   ↓
6. Stripe processes payment
   ├── Success → Redirect to success.html
   └── Failure → Redirect to cancel.html
   ↓
7. Stripe sends webhook to /api/webhook
   ↓
8. Backend updates order status in database
   ↓
9. Platform receives 10%, Seller receives 90%
   ↓
10. Email confirmations sent to buyer and seller
```

---

## Security Considerations

### 1. API Keys Protection

- **NEVER** commit API keys to GitHub
- Store in Cloudflare Workers secrets or environment variables
- Use different keys for test/production

```bash
# Store in Cloudflare Workers
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET
```

### 2. Webhook Signature Verification

Always verify webhook signatures:

```javascript
const sig = request.headers.get('stripe-signature');
const webhookSecret = 'whsec_YOUR_SECRET';

const event = stripe.webhooks.constructEvent(
    payload,
    sig,
    webhookSecret
);
```

### 3. CORS Configuration

Restrict to your domain only:

```javascript
const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://cssberlin.com',
    'Access-Control-Allow-Methods': 'POST',
};
```

### 4. Payment Verification

Never trust frontend data - always verify on backend:

```javascript
// Frontend sends product ID
// Backend fetches actual price from database
const actualPrice = await getProductPrice(productId);
// Use actualPrice, NOT the price from frontend
```

---

## Testing

### 1. Use Stripe Test Mode

Test keys start with `pk_test_` and `sk_test_`

### 2. Test Cards

| Card Number         | Scenario          |
|---------------------|-------------------|
| 4242 4242 4242 4242 | Success           |
| 4000 0025 0000 3155 | 3D Secure         |
| 4000 0000 0000 9995 | Declined          |

### 3. Test Webhooks Locally

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/webhook

# Trigger test events
stripe trigger payment_intent.succeeded
```

---

## Cost Breakdown

### Stripe Pricing (EU Cards)

- **Card Payments**: 1.5% + €0.25 per transaction
- **Stripe Connect**: No additional fee
- **Payouts to Sellers**: Free (within EU)

### Example Calculation

Product Price: €45.00
- Stripe Fee: €0.93 (1.5% + €0.25)
- Net Amount: €44.07
- Platform (10%): €4.41
- Seller (90%): €39.66

---

## Deployment Checklist

- [ ] Stripe account created and verified
- [ ] Live API keys obtained
- [ ] Cloudflare Worker deployed
- [ ] Webhook endpoint configured in Stripe Dashboard
- [ ] Test payment flow with test cards
- [ ] Switch to live keys
- [ ] Test live payment with real card
- [ ] Monitor first transactions

---

## Support & Resources

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Connect Guide**: https://stripe.com/docs/connect
- **Cloudflare Workers**: https://developers.cloudflare.com/workers/
- **Stripe Test Cards**: https://stripe.com/docs/testing

---

## Troubleshooting

### Common Issues

**Issue**: "No such payment method"
- Solution: Ensure payment_method_types includes 'card'

**Issue**: "Invalid API key"
- Solution: Check if using correct key (test vs live)

**Issue**: "Webhook signature verification failed"
- Solution: Ensure raw body is passed to verification

**Issue**: "Application fee cannot exceed payment amount"
- Solution: Calculate fee correctly (should be less than total)

---

## Next Steps

1. Set up Cloudflare Workers account
2. Deploy payment API
3. Configure webhook endpoint
4. Test with Stripe test mode
5. Launch with live keys

---

**Created by**: CSS Berlin Development Team
**Last Updated**: 2025-01-05
**Version**: 1.0.0
