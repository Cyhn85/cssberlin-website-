/**
 * CSS Berlin - Finansal Sistem
 * 1€ Hizmet Bedeli, Escrow, Teklif Doğrulama, Anti-Bypass
 * Version: 2026.1
 */

const FinancialSystem = {
    // Sabitler
    SERVICE_FEE: 1.00,  // 1€ Hizmet Bedeli
    MIN_OFFER_PERCENT: 50,  // Minimum teklif yüzdesi (%50)

    // Regex Patterns - Anti-Bypass
    PHONE_PATTERNS: [
        /(\+?\d{1,4}[\s.-]?)?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}/g,  // Telefon numaraları
        /\b0\d{3,4}[\s.-]?\d{6,8}\b/g,  // Almanya telefon
        /\b\+49[\s.-]?\d{3,4}[\s.-]?\d{6,8}\b/g,  // Almanya +49
        /\b01[567]\d[\s.-]?\d{7,8}\b/g,  // Almanya mobil
    ],
    LINK_PATTERNS: [
        /https?:\/\/[^\s]+/gi,  // HTTP/HTTPS links
        /www\.[^\s]+/gi,  // www links
        /[a-zA-Z0-9.-]+\.(com|de|net|org|io|app|xyz|info|biz|eu)[^\s]*/gi,  // Domain links
        /wa\.me\/\d+/gi,  // WhatsApp links
        /t\.me\/[^\s]+/gi,  // Telegram links
        /instagram\.com\/[^\s]+/gi,
        /facebook\.com\/[^\s]+/gi,
    ],

    /**
     * Escrow (Havuz) Sistemi - İşlem Başlatma
     */
    initEscrow: function(transactionData) {
        const escrowId = 'ESC_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        const escrow = {
            id: escrowId,
            buyerId: transactionData.buyerId,
            sellerId: transactionData.sellerId,
            productId: transactionData.productId,
            productPrice: transactionData.productPrice,
            serviceFee: this.SERVICE_FEE,
            totalAmount: transactionData.productPrice + this.SERVICE_FEE,
            status: 'pending',  // pending, paid, confirmed, released, cancelled
            type: transactionData.type,  // 'online' veya 'abholung'
            createdAt: new Date().toISOString(),
            appointmentDate: transactionData.appointmentDate || null,
            pin: this.generatePIN(),
            qrCode: null  // QR kod için
        };

        // LocalStorage'a kaydet
        const escrows = JSON.parse(localStorage.getItem('cssberlin_escrows') || '[]');
        escrows.push(escrow);
        localStorage.setItem('cssberlin_escrows', JSON.stringify(escrows));

        return escrow;
    },

    /**
     * 4 haneli PIN oluştur
     */
    generatePIN: function() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    },

    /**
     * Escrow ödemesi işle
     */
    processEscrowPayment: function(escrowId, paymentMethod) {
        const escrows = JSON.parse(localStorage.getItem('cssberlin_escrows') || '[]');
        const escrowIndex = escrows.findIndex(e => e.id === escrowId);

        if (escrowIndex === -1) {
            return { success: false, error: 'Escrow bulunamadı' };
        }

        escrows[escrowIndex].status = 'paid';
        escrows[escrowIndex].paymentMethod = paymentMethod;
        escrows[escrowIndex].paidAt = new Date().toISOString();

        localStorage.setItem('cssberlin_escrows', JSON.stringify(escrows));

        return {
            success: true,
            escrow: escrows[escrowIndex],
            message: 'Ödeme başarılı! Satıcı bilgileri açıldı.'
        };
    },

    /**
     * PIN ile işlem onayla (Abholung sonrası)
     */
    confirmWithPIN: function(escrowId, enteredPIN) {
        const escrows = JSON.parse(localStorage.getItem('cssberlin_escrows') || '[]');
        const escrow = escrows.find(e => e.id === escrowId);

        if (!escrow) {
            return { success: false, error: 'İşlem bulunamadı' };
        }

        if (escrow.pin !== enteredPIN) {
            return { success: false, error: 'Yanlış PIN kodu' };
        }

        escrow.status = 'confirmed';
        escrow.confirmedAt = new Date().toISOString();
        localStorage.setItem('cssberlin_escrows', JSON.stringify(escrows));

        // 1€ platforma, geri kalan satıcıya
        return {
            success: true,
            platformFee: this.SERVICE_FEE,
            sellerAmount: escrow.productPrice,
            message: 'İşlem başarıyla tamamlandı!'
        };
    },

    /**
     * Manuel Teklif Doğrulama (%50 Kuralı)
     */
    validateOffer: function(offerAmount, originalPrice, isBundle = false) {
        const minOffer = originalPrice * (this.MIN_OFFER_PERCENT / 100);

        if (offerAmount < minOffer) {
            return {
                valid: false,
                minAmount: minOffer,
                message: 'Bu teklif adil değil! Minimum teklif: €' + minOffer.toFixed(2),
                messageDE: 'Dieses Angebot ist nicht fair! Mindestangebot: €' + minOffer.toFixed(2)
            };
        }

        return {
            valid: true,
            offerAmount: offerAmount,
            discount: ((originalPrice - offerAmount) / originalPrice * 100).toFixed(1),
            message: 'Teklif geçerli!'
        };
    },

    /**
     * Bundle (Çoklu Ürün) Teklif Doğrulama
     */
    validateBundleOffer: function(offerAmount, items) {
        const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
        return this.validateOffer(offerAmount, totalPrice, true);
    },

    /**
     * Anti-Bypass: Mesaj Tarama
     */
    scanMessageForBypass: function(message) {
        const detectedItems = [];

        // Telefon numarası kontrolü
        this.PHONE_PATTERNS.forEach(pattern => {
            const matches = message.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    if (match.replace(/\D/g, '').length >= 8) {  // En az 8 rakam
                        detectedItems.push({
                            type: 'phone',
                            value: match,
                            message: 'Telefon numarası algılandı'
                        });
                    }
                });
            }
        });

        // Link kontrolü
        this.LINK_PATTERNS.forEach(pattern => {
            const matches = message.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    detectedItems.push({
                        type: 'link',
                        value: match,
                        message: 'Harici link algılandı'
                    });
                });
            }
        });

        if (detectedItems.length > 0) {
            return {
                detected: true,
                items: detectedItems,
                warning: 'Güvenliğiniz için randevuyu sistem üzerinden 1€ karşılığında oluşturmalısınız.'
            };
        }

        return { detected: false };
    },

    /**
     * Randevu Oluştur
     */
    createAppointment: function(appointmentData) {
        const appointmentId = 'APT_' + Date.now();

        const appointment = {
            id: appointmentId,
            buyerId: appointmentData.buyerId,
            sellerId: appointmentData.sellerId,
            productId: appointmentData.productId,
            date: appointmentData.date,
            time: appointmentData.time,
            location: null,  // Ödeme sonrası açılacak
            status: 'pending_payment',  // pending_payment, confirmed, completed, cancelled
            reminderSent: false,
            createdAt: new Date().toISOString()
        };

        const appointments = JSON.parse(localStorage.getItem('cssberlin_appointments') || '[]');
        appointments.push(appointment);
        localStorage.setItem('cssberlin_appointments', JSON.stringify(appointments));

        return appointment;
    },

    /**
     * Randevu Hatırlatıcı Kontrolü (1 saat önce)
     */
    checkAppointmentReminders: function() {
        const appointments = JSON.parse(localStorage.getItem('cssberlin_appointments') || '[]');
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

        appointments.forEach(apt => {
            if (apt.status === 'confirmed' && !apt.reminderSent) {
                const aptDateTime = new Date(apt.date + 'T' + apt.time);

                if (aptDateTime <= oneHourFromNow && aptDateTime > now) {
                    // Hatırlatma gönder
                    this.sendAppointmentReminder(apt);
                    apt.reminderSent = true;
                }
            }
        });

        localStorage.setItem('cssberlin_appointments', JSON.stringify(appointments));
    },

    /**
     * Hatırlatma gönder (placeholder - backend'de SQL tetiklemesi yapılacak)
     */
    sendAppointmentReminder: function(appointment) {
        console.log('Randevu hatırlatması:', appointment.id);
        // Bu fonksiyon backend API'ye bağlanacak
        // Frontend'de sadece localStorage notifikasyonu

        const notifications = JSON.parse(localStorage.getItem('cssberlin_notifications') || '[]');
        notifications.push({
            id: 'NOTIF_' + Date.now(),
            type: 'appointment_reminder',
            appointmentId: appointment.id,
            message: `Randevunuz 1 saat içinde! Saat: ${appointment.time}`,
            createdAt: new Date().toISOString(),
            read: false
        });
        localStorage.setItem('cssberlin_notifications', JSON.stringify(notifications));
    },

    /**
     * Checkout Özeti Hesapla
     */
    calculateCheckoutTotal: function(items, deliveryType = 'shipping') {
        const subtotal = items.reduce((sum, item) => sum + (item.offerPrice || item.price), 0);
        const shippingCost = deliveryType === 'shipping' ? 4.99 : 0;  // DHL/Hermes

        return {
            subtotal: subtotal,
            serviceFee: this.SERVICE_FEE,
            shipping: shippingCost,
            total: subtotal + this.SERVICE_FEE + shippingCost,
            breakdown: {
                items: items.length,
                delivery: deliveryType
            }
        };
    }
};

/**
 * UI Controller - Modal ve Form İşlemleri
 */
const FinancialUI = {
    /**
     * Pickup Unlock Modal Göster
     */
    showPickupUnlockModal: function(escrowData) {
        const modal = document.getElementById('pickupUnlockModal');
        if (!modal) {
            this.createPickupUnlockModal();
        }

        document.getElementById('pickupUnlockModal').classList.add('active');
        document.getElementById('pickupProductName').textContent = escrowData.productName || 'Ürün';
        document.getElementById('pickupSellerName').textContent = escrowData.sellerName || 'Satıcı';
        document.body.style.overflow = 'hidden';

        // Ödeme butonu event
        document.getElementById('pickupPayBtn').onclick = () => {
            this.processPickupPayment(escrowData);
        };
    },

    /**
     * Pickup Modal Oluştur
     */
    createPickupUnlockModal: function() {
        const modalHTML = `
        <div class="pickup-unlock-modal" id="pickupUnlockModal">
            <div class="pickup-unlock-content">
                <div class="pickup-unlock-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                </div>
                <h2>Satıcı Konumunu Aç</h2>
                <p>Güvenli buluşma için <strong id="pickupSellerName">Satıcı</strong> ile randevu oluşturun. Ödeme sonrası konum bilgisi size açılacaktır.</p>
                <div class="pickup-unlock-fee">
                    <span>Güvenli İşlem Ücreti:</span>
                    <strong>1€</strong>
                </div>
                <button class="pickup-unlock-btn" id="pickupPayBtn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    1€ Öde ve Konumu Gör
                </button>
                <button class="security-skip-btn" onclick="FinancialUI.closePickupModal()">Vazgeç</button>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    closePickupModal: function() {
        const modal = document.getElementById('pickupUnlockModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    /**
     * Pickup Ödeme İşle
     */
    processPickupPayment: function(escrowData) {
        // Escrow oluştur
        const escrow = FinancialSystem.initEscrow({
            buyerId: escrowData.buyerId,
            sellerId: escrowData.sellerId,
            productId: escrowData.productId,
            productPrice: escrowData.productPrice,
            type: 'abholung'
        });

        // Ödeme simülasyonu (gerçek entegrasyonda Klarna/PayPal API)
        const result = FinancialSystem.processEscrowPayment(escrow.id, 'card');

        if (result.success) {
            this.closePickupModal();
            this.showLocationReveal(escrowData, escrow.pin);
        }
    },

    /**
     * Konum Göster + PIN
     */
    showLocationReveal: function(data, pin) {
        const html = `
        <div class="pickup-unlock-modal active" id="locationRevealModal">
            <div class="pickup-unlock-content">
                <div class="pickup-unlock-icon" style="background: linear-gradient(135deg, #4CAF50, #2D5016);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <h2>Konum Açıldı!</h2>
                <p><strong>Adres:</strong> ${data.sellerAddress || 'Musterstraße 123, 10115 Berlin'}</p>
                <div style="margin: 20px 0; padding: 16px; background: #FFF3E0; border-radius: 12px;">
                    <p style="margin-bottom: 8px; font-size: 14px; color: #666;">Buluşmada satıcıya bu PIN'i gösterin:</p>
                    <div style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #2D5016;">${pin}</div>
                </div>
                <button class="pickup-unlock-btn" onclick="document.getElementById('locationRevealModal').remove()">
                    Tamam, Anladım
                </button>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', html);
    },

    /**
     * Güvenlik Uyarı Modal Göster
     */
    showSecurityWarning: function(detectedItems) {
        const modal = document.getElementById('securityWarningModal');
        if (!modal) {
            this.createSecurityWarningModal();
        }

        const detectedText = detectedItems.map(item => item.value).join(', ');
        document.getElementById('detectedContent').textContent = detectedText;
        document.getElementById('securityWarningModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    createSecurityWarningModal: function() {
        const modalHTML = `
        <div class="security-warning-modal" id="securityWarningModal">
            <div class="security-warning-content">
                <div class="security-warning-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                </div>
                <h2>Güvenlik Uyarısı</h2>
                <p>Mesajınızda platform dışı iletişim bilgisi tespit edildi:</p>
                <div class="detected-text" id="detectedContent"></div>
                <p>Güvenliğiniz için randevuyu sistem üzerinden oluşturmanızı öneririz.</p>
                <button class="security-create-appointment-btn" onclick="FinancialUI.openAppointmentCalendar()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Güvenli Randevu Oluştur (1€)
                </button>
                <button class="security-skip-btn" onclick="FinancialUI.closeSecurityWarning()">Riski Kabul Ediyorum</button>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    closeSecurityWarning: function() {
        const modal = document.getElementById('securityWarningModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    /**
     * Randevu Takvimi Aç
     */
    openAppointmentCalendar: function() {
        this.closeSecurityWarning();
        // Takvim modal'ı aç - ayrı implementasyon
        console.log('Takvim açılıyor...');
    },

    /**
     * Manuel Teklif Input Doğrulama
     */
    initOfferValidation: function(inputId, originalPrice, submitBtnId) {
        const input = document.getElementById(inputId);
        const submitBtn = document.getElementById(submitBtnId);
        const warningEl = input.parentElement.querySelector('.offer-invalid-warning');

        if (!input) return;

        input.addEventListener('input', function() {
            const offerAmount = parseFloat(this.value) || 0;
            const result = FinancialSystem.validateOffer(offerAmount, originalPrice);

            if (!result.valid) {
                this.classList.add('invalid');
                this.classList.remove('valid');
                if (warningEl) warningEl.classList.add('show');
                if (submitBtn) submitBtn.disabled = true;
            } else {
                this.classList.remove('invalid');
                this.classList.add('valid');
                if (warningEl) warningEl.classList.remove('show');
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    },

    /**
     * Mesaj Input Anti-Bypass
     */
    initMessageScanning: function(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;

        input.addEventListener('blur', function() {
            const result = FinancialSystem.scanMessageForBypass(this.value);
            if (result.detected) {
                FinancialUI.showSecurityWarning(result.items);
            }
        });
    }
};

/**
 * Ödeme Yöntemleri UI
 */
const PaymentUI = {
    selectedMethod: null,

    init: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
        <div class="payment-methods-grid">
            <!-- Klarna -->
            <label class="payment-method-card klarna" data-method="klarna">
                <input type="radio" name="paymentMethod" value="klarna">
                <div class="payment-method-logo">
                    <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
                        <text x="5" y="17" font-family="Arial" font-size="14" font-weight="bold" fill="#FFB3C7">Klarna</text>
                    </svg>
                </div>
                <div class="payment-method-info">
                    <h4>Klarna</h4>
                    <p>Jetzt kaufen, später zahlen</p>
                </div>
                <span class="payment-method-fee">1€ Service</span>
            </label>

            <!-- PayPal -->
            <label class="payment-method-card paypal" data-method="paypal">
                <input type="radio" name="paymentMethod" value="paypal">
                <div class="payment-method-logo">
                    <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
                        <text x="5" y="17" font-family="Arial" font-size="12" font-weight="bold" fill="white">PayPal</text>
                    </svg>
                </div>
                <div class="payment-method-info">
                    <h4>PayPal</h4>
                    <p>Käuferschutz inklusive</p>
                </div>
                <span class="payment-method-fee">1€ Service</span>
            </label>

            <!-- Kreditkarte -->
            <label class="payment-method-card card" data-method="card">
                <input type="radio" name="paymentMethod" value="card">
                <div class="payment-method-logo" style="background: #1a1a1a; padding: 8px; border-radius: 6px;">
                    <svg width="40" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                </div>
                <div class="payment-method-info">
                    <h4>Kreditkarte</h4>
                    <p>Visa, Mastercard, Amex</p>
                </div>
                <span class="payment-method-fee">1€ Service</span>
            </label>
        </div>

        <!-- Klarna Taksit Seçenekleri (Klarna seçilince görünür) -->
        <div class="klarna-installments" id="klarnaInstallments" style="display: none;">
            <div class="klarna-option" data-installments="1">
                <span>Sofort</span>
                <small>Vollständig zahlen</small>
            </div>
            <div class="klarna-option" data-installments="3">
                <span>3 Raten</span>
                <small>0% Zinsen</small>
            </div>
            <div class="klarna-option" data-installments="6">
                <span>6 Raten</span>
                <small>0% Zinsen</small>
            </div>
        </div>`;

        this.bindEvents(container);
    },

    bindEvents: function(container) {
        const cards = container.querySelectorAll('.payment-method-card');
        const klarnaOptions = document.getElementById('klarnaInstallments');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                // Diğerlerini kaldır
                cards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedMethod = card.dataset.method;

                // Klarna seçeneklerini göster/gizle
                if (this.selectedMethod === 'klarna' && klarnaOptions) {
                    klarnaOptions.style.display = 'grid';
                } else if (klarnaOptions) {
                    klarnaOptions.style.display = 'none';
                }
            });
        });

        // Klarna taksit seçimi
        if (klarnaOptions) {
            klarnaOptions.querySelectorAll('.klarna-option').forEach(opt => {
                opt.addEventListener('click', () => {
                    klarnaOptions.querySelectorAll('.klarna-option').forEach(o => o.classList.remove('selected'));
                    opt.classList.add('selected');
                });
            });
        }
    },

    getSelectedMethod: function() {
        return this.selectedMethod;
    }
};

// Sayfa yüklendiğinde otomatik başlat
document.addEventListener('DOMContentLoaded', function() {
    // Randevu hatırlatıcı kontrolü (her 5 dakikada bir)
    setInterval(() => {
        FinancialSystem.checkAppointmentReminders();
    }, 5 * 60 * 1000);

    console.log('CSS Berlin Finansal Sistem v2026.1 yüklendi');
});

// Global erişim
window.FinancialSystem = FinancialSystem;
window.FinancialUI = FinancialUI;
window.PaymentUI = PaymentUI;
