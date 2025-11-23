/**
 * CSS Berlin - Offer Modal System
 * Vinted-style price negotiation modals
 *
 * Features:
 * - Send offer modal
 * - Counter-offer modal
 * - Accept/Decline confirmation
 * - Max 40% discount validation
 * - Daily limit tracking (25 offers/day)
 */

class OfferModalManager {
    constructor() {
        this.API_BASE = 'http://localhost:8000';
        this.MAX_DISCOUNT = 40;
        this.MAX_DAILY_OFFERS = 25;
        this.currentModal = null;
        this.currentProductData = null;
        this.dailyOfferCount = 0;

        this.init();
    }

    init() {
        console.log('🎯 Offer Modal Manager initialized');
        this.createModalContainer();
        this.loadDailyOfferCount();
    }

    /**
     * Create modal container in DOM
     */
    createModalContainer() {
        if (document.getElementById('offerModalContainer')) return;

        const container = document.createElement('div');
        container.id = 'offerModalContainer';
        document.body.appendChild(container);
    }

    /**
     * Load daily offer count for current user
     */
    async loadDailyOfferCount() {
        const user = this.getCurrentUser();
        if (!user) return;

        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await fetch(`${this.API_BASE}/api/offers/user/${user.userId}?role=buyer`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Count offers made today
                const todayOffers = data.offers.filter(offer => {
                    const offerDate = new Date(offer.created_at).toISOString().split('T')[0];
                    return offerDate === today;
                });
                this.dailyOfferCount = todayOffers.length;
                console.log(`📊 Daily offers: ${this.dailyOfferCount}/${this.MAX_DAILY_OFFERS}`);
            }
        } catch (error) {
            console.error('Error loading daily offer count:', error);
        }
    }

    /**
     * Get current user from auth system
     */
    getCurrentUser() {
        if (typeof window.getCurrentUser === 'function') {
            return window.getCurrentUser();
        }

        // Fallback: try to get from localStorage
        const sessionData = localStorage.getItem('cssberlin_session') || sessionStorage.getItem('cssberlin_session');
        if (sessionData) {
            try {
                return JSON.parse(sessionData);
            } catch (e) {
                console.error('Error parsing session data:', e);
            }
        }

        return null;
    }

    /**
     * Show send offer modal
     */
    showSendOfferModal(productId, productData) {
        console.log('💰 Opening send offer modal', productId, productData);

        const user = this.getCurrentUser();
        if (!user) {
            if (typeof toast !== 'undefined') {
                toast.error('Nicht angemeldet', 'Bitte melden Sie sich an, um ein Angebot zu machen.', 4000);
            }
            return;
        }

        // Check daily limit
        if (this.dailyOfferCount >= this.MAX_DAILY_OFFERS) {
            if (typeof toast !== 'undefined') {
                toast.warning('Tageslimit erreicht', `Sie können maximal ${this.MAX_DAILY_OFFERS} Angebote pro Tag senden.`, 5000);
            }
            return;
        }

        this.currentProductData = productData;

        const modalHTML = `
            <div class="offer-modal-overlay" id="sendOfferModal">
                <div class="offer-modal-content">
                    <div class="offer-modal-header">
                        <h2>Angebot machen</h2>
                        <button class="offer-modal-close" onclick="offerModal.closeModal()">&times;</button>
                    </div>

                    <div class="offer-modal-body">
                        <!-- Product Info -->
                        <div class="offer-product-info">
                            <img src="${productData.image || '/images/placeholder.jpg'}" alt="${productData.name}" class="offer-product-image">
                            <div class="offer-product-details">
                                <h3>${productData.name}</h3>
                                <p class="offer-product-brand">${productData.brand || ''}</p>
                            </div>
                        </div>

                        <!-- Price Display -->
                        <div class="offer-price-display">
                            <div>
                                <div class="offer-price-label">Originalpreis</div>
                                <div class="offer-price-value">${parseFloat(productData.price).toFixed(2)}€</div>
                            </div>
                        </div>

                        <!-- Offer Amount Input -->
                        <div class="offer-form-group">
                            <label for="offerAmount">Ihr Angebot (€)</label>
                            <input type="number"
                                   id="offerAmount"
                                   class="offer-input"
                                   placeholder="z.B. ${(parseFloat(productData.price) * 0.7).toFixed(2)}"
                                   step="0.01"
                                   min="1"
                                   max="${parseFloat(productData.price) - 0.01}">
                            <div class="offer-discount-display" id="discountDisplay"></div>
                            <div class="offer-validation-error" id="offerAmountError"></div>
                        </div>

                        <!-- Message Input -->
                        <div class="offer-form-group">
                            <label for="offerMessage">Nachricht (Optional)</label>
                            <textarea id="offerMessage"
                                      class="offer-textarea"
                                      rows="3"
                                      placeholder="z.B. Ich würde das Produkt gerne kaufen, aber mein Budget ist begrenzt."></textarea>
                        </div>

                        <!-- Daily Limit Info -->
                        <div class="offer-daily-limit">
                            <p>📊 Tagesangebote: <strong>${this.dailyOfferCount}/${this.MAX_DAILY_OFFERS}</strong></p>
                        </div>
                    </div>

                    <div class="offer-modal-actions">
                        <button class="offer-cancel-btn" onclick="offerModal.closeModal()">Abbrechen</button>
                        <button class="offer-submit-btn" onclick="offerModal.submitOffer('${productId}')">
                            Angebot senden
                        </button>
                    </div>
                </div>
            </div>
        `;

        const container = document.getElementById('offerModalContainer');
        container.innerHTML = modalHTML;

        // Show modal with animation
        setTimeout(() => {
            document.getElementById('sendOfferModal').classList.add('show');
        }, 10);

        // Setup real-time discount calculation
        document.getElementById('offerAmount').addEventListener('input', (e) => {
            this.updateDiscountDisplay(e.target.value, productData.price);
        });

        this.currentModal = 'sendOfferModal';
    }

    /**
     * Show counter-offer modal
     */
    showCounterOfferModal(offerId, offerData) {
        console.log('🔄 Opening counter-offer modal', offerId, offerData);

        const user = this.getCurrentUser();
        if (!user) {
            if (typeof toast !== 'undefined') {
                toast.error('Nicht angemeldet', 'Bitte melden Sie sich an.', 4000);
            }
            return;
        }

        const modalHTML = `
            <div class="offer-modal-overlay" id="counterOfferModal">
                <div class="offer-modal-content">
                    <div class="offer-modal-header">
                        <h2>Gegenangebot machen</h2>
                        <button class="offer-modal-close" onclick="offerModal.closeModal()">&times;</button>
                    </div>

                    <div class="offer-modal-body">
                        <!-- Offer Info -->
                        <div class="offer-info-box">
                            <p><strong>Produkt:</strong> ${offerData.product_name}</p>
                            <p><strong>Originalpreis:</strong> ${parseFloat(offerData.product_price).toFixed(2)}€</p>
                            <p><strong>Käufer-Angebot:</strong> ${parseFloat(offerData.offer_amount).toFixed(2)}€</p>
                            <p><strong>Rabatt:</strong> ${offerData.discount_percentage.toFixed(1)}%</p>
                        </div>

                        <!-- Counter Offer Amount -->
                        <div class="offer-form-group">
                            <label for="counterOfferAmount">Ihr Gegenangebot (€)</label>
                            <input type="number"
                                   id="counterOfferAmount"
                                   class="offer-input"
                                   placeholder="Zwischen ${parseFloat(offerData.offer_amount).toFixed(2)}€ und ${parseFloat(offerData.product_price).toFixed(2)}€"
                                   step="0.01"
                                   min="${parseFloat(offerData.offer_amount) + 0.01}"
                                   max="${parseFloat(offerData.product_price) - 0.01}">
                            <div class="offer-discount-display" id="counterDiscountDisplay"></div>
                            <div class="offer-validation-error" id="counterOfferError"></div>
                        </div>

                        <!-- Message -->
                        <div class="offer-form-group">
                            <label for="counterOfferMessage">Nachricht (Optional)</label>
                            <textarea id="counterOfferMessage"
                                      class="offer-textarea"
                                      rows="3"
                                      placeholder="z.B. Wie wäre es mit einem Mittelweg?"></textarea>
                        </div>
                    </div>

                    <div class="offer-modal-actions">
                        <button class="offer-cancel-btn" onclick="offerModal.closeModal()">Abbrechen</button>
                        <button class="offer-submit-btn" onclick="offerModal.submitCounterOffer(${offerId})">
                            Gegenangebot senden
                        </button>
                    </div>
                </div>
            </div>
        `;

        const container = document.getElementById('offerModalContainer');
        container.innerHTML = modalHTML;

        setTimeout(() => {
            document.getElementById('counterOfferModal').classList.add('show');
        }, 10);

        // Setup discount calculation
        document.getElementById('counterOfferAmount').addEventListener('input', (e) => {
            this.updateDiscountDisplay(e.target.value, offerData.product_price, 'counterDiscountDisplay');
        });

        this.currentModal = 'counterOfferModal';
        this.currentProductData = offerData;
    }

    /**
     * Accept offer
     */
    async acceptOffer(offerId) {
        const user = this.getCurrentUser();
        if (!user) return;

        if (!confirm('Möchten Sie dieses Angebot wirklich annehmen?')) {
            return;
        }

        try {
            const response = await fetch(`${this.API_BASE}/api/offers/${offerId}/accept`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user.userId
                })
            });

            const data = await response.json();

            if (data.success) {
                if (typeof toast !== 'undefined') {
                    toast.success('Angebot angenommen', 'Das Angebot wurde erfolgreich angenommen!', 4000);
                }

                // Add to cart with negotiated price
                const acceptedOffer = data.offer || {};
                this.addAcceptedOfferToCart(acceptedOffer);

                // Reload page data
                setTimeout(() => {
                    if (typeof loadNegotiations === 'function') {
                        loadNegotiations();
                    } else {
                        window.location.reload();
                    }
                }, 1500);
            } else {
                throw new Error(data.message || 'Angebot konnte nicht angenommen werden');
            }
        } catch (error) {
            console.error('Accept offer error:', error);
            if (typeof toast !== 'undefined') {
                toast.error('Fehler', error.message, 5000);
            }
        }
    }

    /**
     * Decline offer
     */
    async declineOffer(offerId) {
        const user = this.getCurrentUser();
        if (!user) return;

        if (!confirm('Möchten Sie dieses Angebot wirklich ablehnen?')) {
            return;
        }

        try {
            const response = await fetch(`${this.API_BASE}/api/offers/${offerId}/decline`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user.userId
                })
            });

            const data = await response.json();

            if (data.success) {
                if (typeof toast !== 'undefined') {
                    toast.success('Angebot abgelehnt', 'Das Angebot wurde abgelehnt.', 4000);
                }

                // Reload page data
                setTimeout(() => {
                    if (typeof loadNegotiations === 'function') {
                        loadNegotiations();
                    } else {
                        window.location.reload();
                    }
                }, 1000);
            } else {
                throw new Error(data.message || 'Angebot konnte nicht abgelehnt werden');
            }
        } catch (error) {
            console.error('Decline offer error:', error);
            if (typeof toast !== 'undefined') {
                toast.error('Fehler', error.message, 5000);
            }
        }
    }

    /**
     * Submit new offer
     */
    async submitOffer(productId) {
        const offerAmount = document.getElementById('offerAmount').value;
        const message = document.getElementById('offerMessage').value;

        // Validation
        if (!offerAmount || parseFloat(offerAmount) <= 0) {
            this.showError('offerAmountError', 'Bitte geben Sie einen gültigen Betrag ein');
            return;
        }

        const discount = this.calculateDiscount(offerAmount, this.currentProductData.price);
        if (discount > this.MAX_DISCOUNT) {
            this.showError('offerAmountError', `Maximaler Rabatt: ${this.MAX_DISCOUNT}%`);
            return;
        }

        if (parseFloat(offerAmount) >= parseFloat(this.currentProductData.price)) {
            this.showError('offerAmountError', 'Angebot muss niedriger als der Preis sein');
            return;
        }

        const user = this.getCurrentUser();
        if (!user) return;

        try {
            const response = await fetch(`${this.API_BASE}/api/offers/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    product_id: productId,
                    product_name: this.currentProductData.name,
                    product_price: parseFloat(this.currentProductData.price),
                    seller_id: this.currentProductData.seller_id || 'seller@cssberlin.de',
                    buyer_id: user.userId,
                    buyer_name: `${user.firstName} ${user.lastName}`,
                    buyer_email: user.email,
                    offer_amount: parseFloat(offerAmount),
                    message: message
                })
            });

            const data = await response.json();

            if (data.success) {
                if (typeof toast !== 'undefined') {
                    toast.success('Angebot gesendet', 'Ihr Angebot wurde erfolgreich gesendet!', 4000);
                }

                this.dailyOfferCount++;
                this.closeModal();

                // Redirect to verhandeln page
                setTimeout(() => {
                    window.location.href = 'verhandeln.html';
                }, 1500);
            } else {
                throw new Error(data.message || 'Angebot konnte nicht gesendet werden');
            }
        } catch (error) {
            console.error('Submit offer error:', error);
            if (typeof toast !== 'undefined') {
                toast.error('Fehler', error.message, 5000);
            }
        }
    }

    /**
     * Submit counter-offer
     */
    async submitCounterOffer(offerId) {
        const counterAmount = document.getElementById('counterOfferAmount').value;
        const message = document.getElementById('counterOfferMessage').value;

        // Validation
        if (!counterAmount || parseFloat(counterAmount) <= 0) {
            this.showError('counterOfferError', 'Bitte geben Sie einen gültigen Betrag ein');
            return;
        }

        if (parseFloat(counterAmount) <= parseFloat(this.currentProductData.offer_amount)) {
            this.showError('counterOfferError', 'Gegenangebot muss höher als das ursprüngliche Angebot sein');
            return;
        }

        if (parseFloat(counterAmount) >= parseFloat(this.currentProductData.product_price)) {
            this.showError('counterOfferError', 'Gegenangebot muss niedriger als der Preis sein');
            return;
        }

        const user = this.getCurrentUser();
        if (!user) return;

        try {
            const response = await fetch(`${this.API_BASE}/api/offers/${offerId}/counter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user.userId,
                    counter_amount: parseFloat(counterAmount),
                    message: message
                })
            });

            const data = await response.json();

            if (data.success) {
                if (typeof toast !== 'undefined') {
                    toast.success('Gegenangebot gesendet', 'Ihr Gegenangebot wurde gesendet!', 4000);
                }

                this.closeModal();

                // Reload page data
                setTimeout(() => {
                    if (typeof loadNegotiations === 'function') {
                        loadNegotiations();
                    } else {
                        window.location.reload();
                    }
                }, 1000);
            } else {
                throw new Error(data.message || 'Gegenangebot konnte nicht gesendet werden');
            }
        } catch (error) {
            console.error('Submit counter-offer error:', error);
            if (typeof toast !== 'undefined') {
                toast.error('Fehler', error.message, 5000);
            }
        }
    }

    /**
     * Update discount display
     */
    updateDiscountDisplay(offerAmount, originalPrice, displayId = 'discountDisplay') {
        const display = document.getElementById(displayId);
        if (!display) return;

        if (!offerAmount || parseFloat(offerAmount) <= 0) {
            display.textContent = '';
            return;
        }

        const discount = this.calculateDiscount(offerAmount, originalPrice);
        const savings = (parseFloat(originalPrice) - parseFloat(offerAmount)).toFixed(2);

        if (discount > this.MAX_DISCOUNT) {
            display.textContent = `⚠️ ${discount.toFixed(1)}% Rabatt (Max: ${this.MAX_DISCOUNT}%)`;
            display.style.color = '#F44336';
        } else {
            display.textContent = `💰 ${discount.toFixed(1)}% Rabatt (${savings}€ Ersparnis)`;
            display.style.color = '#4CAF50';
        }
    }

    /**
     * Calculate discount percentage
     */
    calculateDiscount(offerAmount, originalPrice) {
        return ((parseFloat(originalPrice) - parseFloat(offerAmount)) / parseFloat(originalPrice)) * 100;
    }

    /**
     * Show validation error
     */
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');

            setTimeout(() => {
                errorElement.classList.remove('show');
            }, 5000);
        }
    }

    /**
     * Close modal
     */
    closeModal() {
        const modal = document.querySelector('.offer-modal-overlay.show');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                const container = document.getElementById('offerModalContainer');
                if (container) {
                    container.innerHTML = '';
                }
            }, 300);
        }
        this.currentModal = null;
        this.currentProductData = null;
    }

    /**
     * Add accepted offer to cart with negotiated price
     */
    addAcceptedOfferToCart(offer) {
        if (!offer || !offer.product_id) {
            console.warn('No offer data to add to cart');
            return;
        }

        // Get existing cart
        const cart = JSON.parse(localStorage.getItem('cssberlin_cart') || '[]');

        // Check if already in cart
        const existingIndex = cart.findIndex(item => item.id === offer.product_id);

        const cartItem = {
            id: offer.product_id,
            name: offer.product_name,
            originalPrice: offer.product_price,
            price: offer.counter_amount || offer.offer_amount, // Use counter if exists
            image: offer.product_image || '/images/placeholder.jpg',
            quantity: 1,
            isNegotiated: true,
            offerId: offer.id,
            discount: Math.round(((offer.product_price - (offer.counter_amount || offer.offer_amount)) / offer.product_price) * 100)
        };

        if (existingIndex > -1) {
            cart[existingIndex] = cartItem;
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem('cssberlin_cart', JSON.stringify(cart));

        // Update cart count in header
        const cartCountEl = document.getElementById('cartCount');
        if (cartCountEl) {
            cartCountEl.textContent = cart.length;
        }

        // Dispatch cart update event
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));

        console.log('✅ Added negotiated item to cart:', cartItem);

        // Show purchase prompt
        this.showPurchasePrompt(cartItem);
    }

    /**
     * Show purchase prompt after offer accepted
     */
    showPurchasePrompt(cartItem) {
        const modalHTML = `
            <div class="offer-modal-overlay" id="purchasePromptModal">
                <div class="offer-modal-content" style="max-width: 400px;">
                    <div class="offer-modal-header" style="background: linear-gradient(135deg, #4CAF50, #2D5016); color: white;">
                        <h2 style="display: flex; align-items: center; gap: 8px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                            </svg>
                            Angebot angenommen!
                        </h2>
                        <button class="offer-modal-close" onclick="offerModal.closePurchasePrompt()" style="color: white;">&times;</button>
                    </div>

                    <div class="offer-modal-body" style="text-align: center; padding: 24px;">
                        <div style="margin-bottom: 16px;">
                            <img src="${cartItem.image}" alt="${cartItem.name}"
                                 style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;">
                            <h3 style="font-size: 16px; margin-bottom: 8px;">${cartItem.name}</h3>
                        </div>

                        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                            <div style="text-decoration: line-through; color: #999; font-size: 14px;">
                                ${cartItem.originalPrice.toFixed(2)}€
                            </div>
                            <div style="font-size: 28px; font-weight: 700; color: #4CAF50;">
                                ${cartItem.price.toFixed(2)}€
                            </div>
                            <div style="font-size: 14px; color: #FF8C42; font-weight: 600;">
                                ${cartItem.discount}% gespart!
                            </div>
                        </div>

                        <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
                            Der Artikel wurde Ihrem Warenkorb hinzugefügt.
                        </p>
                    </div>

                    <div class="offer-modal-actions" style="flex-direction: column; gap: 12px;">
                        <button class="offer-submit-btn" onclick="window.location.href='warenkorb.html'"
                                style="width: 100%; background: #4CAF50;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="margin-right: 8px;">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            Zum Warenkorb
                        </button>
                        <button class="offer-submit-btn" onclick="window.location.href='checkout.html'"
                                style="width: 100%; background: #FF8C42;">
                            Jetzt kaufen
                        </button>
                        <button class="offer-cancel-btn" onclick="offerModal.closePurchasePrompt()"
                                style="width: 100%;">
                            Weiter stöbern
                        </button>
                    </div>
                </div>
            </div>
        `;

        const container = document.getElementById('offerModalContainer');
        container.innerHTML = modalHTML;

        setTimeout(() => {
            document.getElementById('purchasePromptModal').classList.add('show');
        }, 10);
    }

    /**
     * Close purchase prompt
     */
    closePurchasePrompt() {
        const modal = document.getElementById('purchasePromptModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                const container = document.getElementById('offerModalContainer');
                if (container) {
                    container.innerHTML = '';
                }
            }, 300);
        }
    }

    /**
     * Show buy now button for accepted offers (to be used in verhandeln.html)
     */
    showBuyNowForOffer(offerId, offerData) {
        // Add to cart first
        this.addAcceptedOfferToCart(offerData);

        // Redirect to checkout
        window.location.href = 'checkout.html';
    }
}

// Initialize global instance
const offerModal = new OfferModalManager();

console.log('✅ Offer Modal System loaded');
