// ============================================
// CSS BERLIN - PAYMENT HANDLER
// ============================================

// API Configuration
const API_URL = 'http://localhost:8000';  // Production: http://195.201.146.224:8000

// Payment configuration (loaded from API)
let paymentConfig = null;

// ========================================
// LOAD PAYMENT CONFIGURATION
// ========================================

async function loadPaymentConfig() {
    try {
        const response = await fetch(`${API_URL}/api/payment/config`);
        const data = await response.json();
        paymentConfig = data;
        console.log(' Payment configuration loaded:', data);
        return data;
    } catch (error) {
        console.error('L Failed to load payment config:', error);
        return null;
    }
}

// ========================================
// PAYMENT MODAL
// ========================================

function createPaymentModal(productData) {
    // Create modal HTML
    const modalHTML = `
        <div id="paymentModal" class="payment-modal">
            <div class="payment-modal-overlay" onclick="closePaymentModal()"></div>
            <div class="payment-modal-content">
                <button class="payment-modal-close" onclick="closePaymentModal()">�</button>

                <h2 style="margin: 0 0 24px 0; font-size: 24px; color: #212121;">Zahlung w�hlen</h2>

                <!-- Product Summary -->
                <div class="payment-product-summary">
                    <img src="${productData.image}" alt="${productData.title}">
                    <div>
                        <h3>${productData.title}</h3>
                        <p class="payment-price">�${productData.price.toFixed(2)}</p>
                    </div>
                </div>

                <!-- Payment Methods -->
                <div class="payment-methods">
                    <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #212121;">Zahlungsmethode</h3>

                    <!-- Stripe -->
                    <button class="payment-method-btn" onclick="handleStripePayment(${JSON.stringify(productData).replace(/"/g, '&quot;')})">
                        <div class="payment-method-info">
                            <div class="payment-method-icon">
                                <svg width="48" height="20" viewBox="0 0 60 25" fill="none">
                                    <path d="M59.6 15.1c0-6.7-4.3-11.4-11.1-11.4-6.8 0-11.7 4.7-11.7 11.3 0 7.5 4.2 11.3 11.9 11.3 3.4 0 6-0.7 8.2-1.9v-5.3c-2.2 1-4.6 1.6-7.3 1.6-2.9 0-5.4-1-5.7-4.6h15.6c0-0.3 0.1-1.3 0.1-2zm-15.8-2.4c0-3.4 2.1-4.8 4.6-4.8 2.4 0 4.4 1.4 4.4 4.8h-9zm-11.4-8.9c-2.8 0-4.6 1.3-5.6 2.2l-0.4-1.8h-6v29.4l6.8-1.4 0-7.1c1 0.7 2.5 1.7 5 1.7 5 0 9.6-4 9.6-11.5-0.1-7.2-4.7-11.5-9.4-11.5zm-1.6 17.2c-1.7 0-2.7-0.6-3.4-1.3v-10c0.7-0.8 1.8-1.4 3.4-1.4 2.6 0 4.4 2.9 4.4 6.3 0 3.5-1.7 6.4-4.4 6.4zm-12.2-17h-6.8v21.5h6.8v-21.5zm-3.4-10.5c-2.2 0-3.9 1.8-3.9 3.9 0 2.2 1.7 3.9 3.9 3.9s3.9-1.7 3.9-3.9c0-2.1-1.7-3.9-3.9-3.9zm-9.2 6.7l-0.4-2.2h-6v21.5h6.8v-14.6c1.6-2.1 4.3-1.7 5.2-1.4v-6.2c-0.9-0.3-3.9-0.8-5.6 2.9zm-7.9-0.8c-1.1-0.4-1.7-0.8-1.7-1.4 0-0.7 0.6-1.2 1.7-1.2 1.6 0 3.4 0.5 4.9 1.4v-5.4c-1.7-0.8-3.4-1.2-4.9-1.2-4 0-6.8 2.1-6.8 5.6 0 2.7 2 4.4 5.3 5.4 1.3 0.4 1.8 0.8 1.8 1.4 0 0.7-0.7 1.2-1.9 1.2-1.8 0-4-0.8-5.7-1.8v5.6c1.9 0.9 3.8 1.4 5.7 1.4 4.1 0 7-2 7-5.7-0.1-2.7-2.1-4.4-5.4-5.3z" fill="#635BFF"/>
                                </svg>
                            </div>
                            <div>
                                <strong>Kreditkarte</strong>
                                <span class="payment-commission">1,4% + �0,25</span>
                            </div>
                        </div>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </button>

                    <!-- PayPal -->
                    <button class="payment-method-btn" onclick="handlePayPalPayment(${JSON.stringify(productData).replace(/"/g, '&quot;')})">
                        <div class="payment-method-info">
                            <div class="payment-method-icon">
                                <svg width="48" height="20" viewBox="0 0 100 32" fill="none">
                                    <path d="M12.237 2.8h14.713c5.535 0 8.984 3.054 8.984 8.182 0 5.853-4.316 10.104-10.568 10.104h-4.862l-1.483 9.434H12.237L12.237 2.8zm7.183 13.043h2.861c2.434 0 4.174-1.528 4.174-3.667 0-1.676-1.11-2.644-3.015-2.644h-2.752L18.42 15.843z" fill="#003087"/>
                                    <path d="M38.792 2.8h14.713c5.535 0 8.984 3.054 8.984 8.182 0 5.853-4.316 10.104-10.568 10.104h-4.862l-1.483 9.434H38.792L38.792 2.8zm7.183 13.043h2.861c2.434 0 4.174-1.528 4.174-3.667 0-1.676-1.11-2.644-3.015-2.644h-2.752L45.975 15.843z" fill="#0070E0"/>
                                    <path d="M70.816 2.8h6.784l-1.483 9.434h4.862c6.252 0 10.568 4.251 10.568 10.104 0 5.128-3.449 8.182-8.984 8.182H67.85L70.816 2.8zm4.174 13.043l-2.268 14.437h2.752c1.905 0 3.015-0.968 3.015-2.644 0-2.139-1.74-3.667-4.174-3.667h-2.861L74.99 15.843z" fill="#003087"/>
                                </svg>
                            </div>
                            <div>
                                <strong>PayPal</strong>
                                <span class="payment-commission">2,49% + �0,35</span>
                            </div>
                        </div>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </button>

                    <!-- Klarna -->
                    <button class="payment-method-btn" onclick="handleKlarnaPayment(${JSON.stringify(productData).replace(/"/g, '&quot;')})">
                        <div class="payment-method-info">
                            <div class="payment-method-icon">
                                <svg width="48" height="20" viewBox="0 0 85 20" fill="#FFB3C7">
                                    <path d="M0 0.5h6v19H0V0.5zm50.2 0h6v19h-6V0.5zM13.8 0.5h6.7l-8.3 19h-7.1L13.8 0.5zm34.7 0c5.5 0 10 4.5 10 10s-4.5 10-10 10h-6.7V0.5h6.7zm-.5 14.7c2.9 0 5.3-2.4 5.3-5.3s-2.4-5.3-5.3-5.3h-1.5v10.6h1.5zm18.8-14.7h6v19h-6V0.5zm15 0h6l-8 19h-6l8-19z"/>
                                </svg>
                            </div>
                            <div>
                                <strong>Klarna - Sp�ter bezahlen</strong>
                                <span class="payment-commission">3,29% + �0,25</span>
                                <small style="display: block; color: #FFB3C7; margin-top: 4px;">30 Tage sp�ter oder Ratenzahlung</small>
                            </div>
                        </div>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </button>
                </div>

                <!-- Security Badge -->
                <div class="payment-security" style="margin-top: 24px; padding: 16px; background: #F5F5F5; border-radius: 12px; display: flex; align-items: center; gap: 12px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <path d="M9 12l2 2 4-4"/>
                    </svg>
                    <div style="font-size: 13px; color: #757575;">
                        <strong style="color: #4CAF50;">SSL-verschl�sselt</strong><br>
                        Ihre Zahlung ist sicher und gesch�tzt
                    </div>
                </div>
            </div>
        </div>
    `;

    // Append to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.remove();
    }
}

// ========================================
// STRIPE PAYMENT
// ========================================

async function handleStripePayment(productData) {
    console.log('=� Stripe payment initiated for:', productData);

    try {
        // Show loading
        showPaymentLoading('Stripe wird vorbereitet...');

        const response = await fetch(`${API_URL}/api/payment/stripe/create-checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_id: productData.id,
                quantity: 1
            })
        });

        const data = await response.json();

        if (data.checkout_url) {
            // Redirect to Stripe checkout
            window.location.href = data.checkout_url;
        } else {
            throw new Error('Keine Checkout-URL erhalten');
        }

    } catch (error) {
        console.error('L Stripe payment error:', error);
        if (typeof toast !== 'undefined') {
            toast.error('Stripe Zahlung Fehler', 'Fehler bei der Stripe-Zahlung. Bitte versuchen Sie es erneut.', 5000);
        }
        hidePaymentLoading();
    }
}

// ========================================
// PAYPAL PAYMENT
// ========================================

async function handlePayPalPayment(productData) {
    console.log('=5 PayPal payment initiated for:', productData);

    try {
        // Show loading
        showPaymentLoading('PayPal wird vorbereitet...');

        const response = await fetch(`${API_URL}/api/payment/paypal/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_id: productData.id,
                quantity: 1
            })
        });

        const data = await response.json();

        if (data.approve_url) {
            // Redirect to PayPal
            window.location.href = data.approve_url;
        } else {
            throw new Error('Keine PayPal-URL erhalten');
        }

    } catch (error) {
        console.error('L PayPal payment error:', error);
        if (typeof toast !== 'undefined') {
            toast.error('PayPal Zahlung Fehler', 'Fehler bei der PayPal-Zahlung. Bitte versuchen Sie es erneut.', 5000);
        }
        hidePaymentLoading();
    }
}

// ========================================
// KLARNA PAYMENT
// ========================================

async function handleKlarnaPayment(productData) {
    console.log('<8 Klarna payment initiated for:', productData);

    try {
        // Show loading
        showPaymentLoading('Klarna wird vorbereitet...');

        const response = await fetch(`${API_URL}/api/payment/klarna/create-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_id: productData.id,
                quantity: 1,
                payment_method: 'pay_later'  // 30 Tage sp�ter
            })
        });

        const data = await response.json();

        if (data.redirect_url) {
            // Redirect to Klarna
            window.location.href = data.redirect_url;
        } else if (data.html_snippet) {
            // Alternative: Embed Klarna widget
            closePaymentModal();
            document.body.insertAdjacentHTML('beforeend', data.html_snippet);
        } else {
            throw new Error('Keine Klarna-URL erhalten');
        }

    } catch (error) {
        console.error('L Klarna payment error:', error);
        if (typeof toast !== 'undefined') {
            toast.error('Klarna Zahlung Fehler', 'Fehler bei der Klarna-Zahlung. Bitte versuchen Sie es erneut.', 5000);
        }
        hidePaymentLoading();
    }
}

// ========================================
// LOADING STATES
// ========================================

function showPaymentLoading(message) {
    const loadingHTML = `
        <div id="paymentLoading" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <div style="
                background: white;
                padding: 32px;
                border-radius: 16px;
                text-align: center;
            ">
                <div style="
                    width: 48px;
                    height: 48px;
                    border: 4px solid #E0E0E0;
                    border-top-color: #2D5016;
                    border-radius: 50%;
                    margin: 0 auto 16px;
                    animation: spin 1s linear infinite;
                "></div>
                <p style="margin: 0; font-size: 16px; color: #212121;">${message}</p>
            </div>
        </div>
        <style>
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        </style>
    `;

    document.body.insertAdjacentHTML('beforeend', loadingHTML);
}

function hidePaymentLoading() {
    const loading = document.getElementById('paymentLoading');
    if (loading) {
        loading.remove();
    }
}

// ========================================
// INITIALIZE
// ========================================

// Load payment config on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadPaymentConfig();

    // Add click handler to "Kaufen" button
    const buyButton = document.getElementById('buyNowBtn');
    if (buyButton) {
        buyButton.addEventListener('click', () => {
            // Get product data from page
            const productData = {
                id: 1, // TODO: Get from URL or page
                title: document.querySelector('h1').textContent,
                price: parseFloat(document.querySelector('.price-large').textContent.replace('�', '').replace(',', '.')),
                image: document.querySelector('.main-image-container img').src
            };

            createPaymentModal(productData);
        });
    }
});
