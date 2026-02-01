/**
 * CSS Berlin - Authorization Guard System
 * Handles page and action level authorization
 */

const AuthGuard = {
    // Pages that require login
    protectedPages: [
        'inserieren.html',
        'mein-konto.html',
        'bestellungen.html',
        'messages.html',
        'wunschliste.html',
        'checkout.html',
        'pazarlik.html'
    ],

    // Pages that require email verification
    verificationRequiredPages: [
        'inserieren.html',
        'checkout.html'
    ],

    // Actions that require login
    protectedActions: [
        'addToWishlist',
        'startNegotiation',
        'sendMessage',
        'checkout',
        'publishListing'
    ],

    /**
     * Initialize the auth guard
     */
    init() {
        this.checkPageAccess();
        this.setupActionGuards();
        this.updateUIBasedOnAuth();
        console.log('AuthGuard initialized');
    },

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return authGate.isAuthenticated;
    },

    /**
     * Get current user
     */
    getCurrentUser() {
        return authGate.currentUser;
    },

    /**
     * Check if user's email is verified
     */
    isEmailVerified() {
        const user = this.getCurrentUser();
        if (!user) return false;

        // Google login is always verified
        if (user.loginMethod === 'google') return true;

        // Magic link login is verified
        if (user.loginMethod === 'magic_link') return true;

        // Check explicit verification status
        return user.emailVerified === true;
    },

    /**
     * Check page access on load
     */
    checkPageAccess() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Check if page requires login
        if (this.protectedPages.includes(currentPage)) {
            if (!this.isLoggedIn()) {
                this.redirectToLogin(currentPage);
                return;
            }
        }

        // Check if page requires email verification
        if (this.verificationRequiredPages.includes(currentPage)) {
            if (!this.isEmailVerified()) {
                this.showVerificationRequired();
                return;
            }
        }
    },

    /**
     * Redirect to login
     */
    redirectToLogin(returnPage) {
        // Store return URL
        sessionStorage.setItem('cssberlin_return_url', returnPage);

        // Show login modal or redirect
        if (typeof authGate !== 'undefined') {
            // Show overlay to block page
            this.showLoginOverlay(returnPage);
        } else {
            window.location.href = 'index.html?login=required&return=' + encodeURIComponent(returnPage);
        }
    },

    /**
     * Show login overlay for protected pages
     */
    showLoginOverlay(pageName) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'auth-guard-overlay';
        overlay.innerHTML = `
            <div class="auth-guard-modal">
                <div class="auth-guard-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E8854C" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>
                <h2>Anmeldung erforderlich</h2>
                <p>Um diese Seite zu nutzen, musst du dich anmelden oder registrieren.</p>
                <div class="auth-guard-actions">
                    <button class="auth-guard-btn primary" onclick="AuthGuard.openLoginModal()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Anmelden / Registrieren
                    </button>
                    <a href="index.html" class="auth-guard-btn secondary">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        Zur Startseite
                    </a>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #auth-guard-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.98);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .auth-guard-modal {
                background: white;
                border-radius: 16px;
                padding: 40px;
                max-width: 420px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            }

            .auth-guard-icon {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #fff5ef 0%, #ffe8db 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 24px;
            }

            .auth-guard-modal h2 {
                font-size: 24px;
                color: #333;
                margin: 0 0 12px;
                font-weight: 700;
            }

            .auth-guard-modal p {
                color: #666;
                font-size: 15px;
                line-height: 1.6;
                margin: 0 0 28px;
            }

            .auth-guard-actions {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .auth-guard-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                padding: 14px 24px;
                border-radius: 10px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                text-decoration: none;
                transition: all 0.3s ease;
                border: none;
            }

            .auth-guard-btn.primary {
                background: linear-gradient(135deg, #E8854C 0%, #d4753d 100%);
                color: white;
            }

            .auth-guard-btn.primary:hover {
                background: linear-gradient(135deg, #2D5016 0%, #3d6b1e 100%);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(45, 80, 22, 0.3);
            }

            .auth-guard-btn.secondary {
                background: #f5f5f5;
                color: #333;
            }

            .auth-guard-btn.secondary:hover {
                background: #e8e8e8;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(overlay);
    },

    /**
     * Show verification required modal
     */
    showVerificationRequired() {
        const overlay = document.createElement('div');
        overlay.id = 'auth-guard-overlay';
        overlay.innerHTML = `
            <div class="auth-guard-modal">
                <div class="auth-guard-icon" style="background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%);">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#856404" stroke-width="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                </div>
                <h2>E-Mail-Bestatigung erforderlich</h2>
                <p>Um diese Funktion zu nutzen, musst du deine E-Mail-Adresse bestatigen.</p>
                <div class="auth-guard-actions">
                    <button class="auth-guard-btn primary" onclick="AuthGuard.resendVerification()">
                        Bestatigungsmail erneut senden
                    </button>
                    <a href="index.html" class="auth-guard-btn secondary">
                        Zur Startseite
                    </a>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
    },

    /**
     * Open login modal
     */
    openLoginModal() {
        const overlay = document.getElementById('auth-guard-overlay');
        if (overlay) overlay.remove();

        if (typeof authGate !== 'undefined') {
            authGate.showLoginModal();
        }
    },

    /**
     * Resend verification email
     */
    async resendVerification() {
        const user = this.getCurrentUser();
        if (!user || !user.email) {
            alert('Fehler: Benutzer nicht gefunden');
            return;
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        if (typeof EmailService !== 'undefined') {
            const result = await EmailService.sendVerification(user.email, user.firstName, code);
            if (result.success) {
                alert('Bestatigungsmail wurde gesendet!');
                // Store code for verification
                localStorage.setItem('cssberlin_verification_code', JSON.stringify({
                    email: user.email,
                    code: code,
                    expiresAt: Date.now() + (24 * 60 * 60 * 1000)
                }));
            } else {
                alert('Fehler beim Senden: ' + result.error);
            }
        }
    },

    /**
     * Setup action guards for buttons and links
     */
    setupActionGuards() {
        // Guard wishlist buttons
        document.querySelectorAll('.wishlist-btn, [data-action="wishlist"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.requireLogin('Wunschliste')) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, true);
        });

        // Guard negotiate buttons
        document.querySelectorAll('.negotiate-btn, [data-action="negotiate"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.requireLogin('Verhandeln')) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, true);
        });

        // Guard message buttons
        document.querySelectorAll('.message-btn, [data-action="message"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.requireLogin('Nachricht senden')) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, true);
        });
    },

    /**
     * Require login for an action
     * Returns true if logged in, false if not (and shows modal)
     */
    requireLogin(actionName) {
        if (this.isLoggedIn()) {
            return true;
        }

        // Show toast notification
        this.showToast(`Bitte melden Sie sich an, um ${actionName} zu nutzen.`);

        // Show login modal
        if (typeof authGate !== 'undefined') {
            setTimeout(() => authGate.showLoginModal(), 500);
        }

        return false;
    },

    /**
     * Require email verification for an action
     */
    requireVerification(actionName) {
        if (!this.isLoggedIn()) {
            return this.requireLogin(actionName);
        }

        if (this.isEmailVerified()) {
            return true;
        }

        this.showToast('Bitte bestatige deine E-Mail-Adresse, um fortzufahren.');
        return false;
    },

    /**
     * Show toast notification
     */
    showToast(message) {
        // Remove existing toast
        const existing = document.querySelector('.auth-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'auth-toast';
        toast.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>${message}</span>
        `;

        // Add styles if not exists
        if (!document.getElementById('auth-toast-styles')) {
            const style = document.createElement('style');
            style.id = 'auth-toast-styles';
            style.textContent = `
                .auth-toast {
                    position: fixed;
                    bottom: 24px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #333;
                    color: white;
                    padding: 14px 24px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 14px;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
                    z-index: 10001;
                    animation: slideUp 0.3s ease, fadeOut 0.3s ease 3s forwards;
                }

                @keyframes slideUp {
                    from { transform: translateX(-50%) translateY(100px); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }

                @keyframes fadeOut {
                    to { opacity: 0; transform: translateX(-50%) translateY(20px); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    },

    /**
     * Update UI based on auth status
     */
    updateUIBasedOnAuth() {
        const isLoggedIn = this.isLoggedIn();
        const user = this.getCurrentUser();

        // Update header button
        const authBtns = document.querySelectorAll('.header-action-btn.auth-btn, .combined-auth-btn, [onclick*="showLoginModal"]');
        authBtns.forEach(btn => {
            if (isLoggedIn && user) {
                btn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>${user.firstName || 'Mein Konto'}</span>
                `;
                btn.onclick = () => window.location.href = 'mein-konto.html';
            }
        });

        // Update wishlist count
        this.updateWishlistCount();

        // Update cart count
        this.updateCartCount();
    },

    /**
     * Update wishlist count badge
     */
    updateWishlistCount() {
        const user = this.getCurrentUser();
        if (!user) return;

        const users = JSON.parse(localStorage.getItem('cssberlin_users') || '[]');
        const fullUser = users.find(u => u.id === user.id);
        const count = fullUser?.wishlist?.length || 0;

        const badge = document.getElementById('wishlistCount');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    },

    /**
     * Update cart count badge
     */
    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cssberlin_cart') || '[]');
        const count = cart.length;

        const badge = document.getElementById('cartCount');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    },

    /**
     * Handle successful login
     */
    onLoginSuccess() {
        // Remove overlay if exists
        const overlay = document.getElementById('auth-guard-overlay');
        if (overlay) overlay.remove();

        // Check for return URL
        const returnUrl = sessionStorage.getItem('cssberlin_return_url');
        if (returnUrl) {
            sessionStorage.removeItem('cssberlin_return_url');
            window.location.href = returnUrl;
        } else {
            // Refresh page to update UI
            window.location.reload();
        }
    }
};

// Global helper functions
function requireLogin(actionName) {
    return AuthGuard.requireLogin(actionName);
}

function requireVerification(actionName) {
    return AuthGuard.requireVerification(actionName);
}

function isLoggedIn() {
    return AuthGuard.isLoggedIn();
}

function getCurrentUser() {
    return AuthGuard.getCurrentUser();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    AuthGuard.init();
});

// Export
window.AuthGuard = AuthGuard;
console.log('CSS Berlin AuthGuard loaded');
