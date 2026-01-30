/**
 * CSS Berlin - Global Header/Footer Component
 * Goal: Standardize header/footer across all pages (homepage rules).
 *
 * Key requirement:
 * - Slogan must appear at the START and END of every ticker loop:
 *   "Climate Smart Solutions"
 * - Ticker sizes stay identical, but loop durations can differ per ticker.
 */

const GlobalHeader = {
    isAuthenticated: false,
    currentUser: null,
    SLOGAN: 'Climate Smart Solutions',
    __eventsBound: false,

    /**
     * Header HTML'ini olustur
     */
    getHeaderHTML() {
        const S = this.SLOGAN;
        return `
    <!-- News Banner at Top -->
    <div class="news-banner-v2" data-global-shell="1">
        <div class="news-slider" id="newsSlider" style="animation-duration: 28s;">
            <div class="news-item" data-link="index.html"><span>${S}</span></div>
            <div class="news-item" data-link="co2-impact.html"><span>🌍 248.5 Tonnen CO₂ gespart</span></div>
            <div class="news-item" data-link="campaign.html"><span>📦 2 kaufen = 3. Versand GRATIS</span></div>
            <div class="news-item" data-link="co2-impact.html"><span>🏆 CO₂ Top 100 Rangliste</span></div>
            <div class="news-item" data-link="index.html"><span>${S}</span></div>
        </div>
    </div>

    <!-- Modern Header V2 -->
    <header class="header-v2" id="globalHeader" data-global-shell="1">
        <div class="header-container-v2">
            <!-- Mobile Menu Button -->
            <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Menu">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <!-- Logo -->
            <a href="index.html" class="header-logo">
                <span class="logo-text">CSS</span>
                <span class="logo-subtext">Berlin</span>
            </a>

            <!-- Search Bar -->
            <div class="header-search-v2">
                <form action="search.html" method="GET" class="search-form-v2">
                    <div class="search-input-wrapper">
                        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="M21 21l-4.35-4.35"></path>
                        </svg>
                        <input type="text" name="q" placeholder="Was suchst du?" autocomplete="off">
                    </div>
                    <button type="submit" class="search-submit-btn">Suchen</button>
                </form>
            </div>

            <!-- Header Actions -->
            <div class="header-actions-v2">
                <!-- Cart -->
                <a href="warenkorb.html" class="header-icon-btn" title="Warenkorb">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span class="icon-badge" id="cartCount">0</span>
                </a>

                <!-- Icon Buttons -->
                <a href="wunschliste.html" class="header-icon-btn" title="Wunschliste">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span class="icon-badge" id="wishlistCount">0</span>
                </a>

                <a href="messages.html" class="header-icon-btn" title="Nachrichten">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span class="icon-badge" id="messageCount">0</span>
                </a>

                <!-- Auth Buttons (Guest) -->
                <div class="auth-buttons" id="guestAuthButtons">
                    <a href="login.html" class="auth-btn auth-btn-login">Anmelden</a>
                    <a href="registrieren.html" class="auth-btn auth-btn-register">Registrieren</a>
                </div>

                <!-- User Menu (Logged In) -->
                <div class="user-menu-wrapper" id="userMenuWrapper" style="display: none;">
                    <button class="user-menu-btn-v2" id="userMenuBtn" onclick="GlobalHeader.toggleDropdown(event)">
                        <div class="user-avatar" id="userAvatar">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <span class="user-name" id="userName">Profil</span>
                        <svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <!-- User Dropdown -->
                    <div class="user-dropdown-v2" id="userDropdown">
                        <div class="dropdown-user-info">
                            <div class="dropdown-avatar" id="dropdownAvatar">U</div>
                            <div class="dropdown-user-details">
                                <span class="dropdown-user-name" id="dropdownUserName">User</span>
                                <span class="dropdown-user-email" id="dropdownUserEmail">user@email.com</span>
                            </div>
                        </div>
                        <div class="dropdown-divider"></div>
                        <a href="profil.html" class="dropdown-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Mein Profil
                        </a>
                        <a href="verkaeufe.html" class="dropdown-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M16 8l-8 8M8 8l8 8"></path>
                            </svg>
                            Meine Verkaufe
                        </a>
                        <a href="bestellungen.html" class="dropdown-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                            Meine Bestellungen
                        </a>
                        <a href="messages.html" class="dropdown-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            Nachrichten
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item logout-item" onclick="GlobalHeader.logout(); return false;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            Abmelden
                        </a>
                    </div>
                </div>

                <!-- Inserieren Button -->
                <a href="inserieren.html" class="header-action-btn inserieren-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M12 5v14M5 12h14"></path>
                    </svg>
                    Inserieren
                </a>
            </div>
        </div>
    </header>
        `;
    },

    /**
     * Footer HTML'ini olustur
     */
    getFooterHTML() {
        const S = this.SLOGAN;
        return `
    <!-- Footer -->
    <footer class="footer" data-global-shell="1" style="background: linear-gradient(135deg, #FF8C42 0%, #2D5016 100%); padding: 0; margin-top: auto; flex-shrink: 0;">
        <!-- Sliding News Banner -->
        <div class="footer-news-banner" style="background: #2D5016; padding: 12px 0;">
            <div class="footer-news-slider" style="animation-duration: 36s;">
                <div class="footer-news-item">${S}</div>
                <div class="footer-news-item">Nachhaltige Mode • Transparenter Handel • Sicherer Checkout</div>
                <div class="footer-news-item">🌱 CO₂ Impact • Deine Käufe zählen</div>
                <div class="footer-news-item">📦 Versand + Abholung • Smart & sicher</div>
                <div class="footer-news-item">${S}</div>
            </div>
        </div>

        <!-- Footer Content -->
        <div style="max-width: 1200px; margin: 0 auto; padding: 30px 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
                <!-- Social Media -->
                <div style="display: flex; gap: 16px; align-items: center;">
                    <a href="https://instagram.com/cssberlin" target="_blank" style="color: white; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 8px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                        </svg>
                    </a>
                    <a href="https://tiktok.com/@cssberlin" target="_blank" style="color: white; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 8px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                    </a>
                </div>

                <!-- Legal Links -->
                <nav style="display: flex; gap: 24px; flex-wrap: wrap; align-items: center;">
                    <a href="ueber-uns.html" style="color: white; text-decoration: none; font-size: 14px; font-weight: 500;">Über uns</a>
                    <a href="kontakt.html" style="color: white; text-decoration: none; font-size: 14px; font-weight: 500;">Kontakt</a>
                    <a href="agb.html" style="color: white; text-decoration: none; font-size: 14px; font-weight: 500;">AGB</a>
                    <a href="datenschutz.html" style="color: white; text-decoration: none; font-size: 14px; font-weight: 500;">Datenschutz</a>
                    <a href="widerrufsrecht.html" style="color: white; text-decoration: none; font-size: 14px; font-weight: 500;">Widerrufsrecht</a>
                    <a href="impressum.html" style="color: white; text-decoration: none; font-size: 14px; font-weight: 500;">Impressum</a>
                </nav>

                <!-- Copyright -->
                <div style="color: rgba(255,255,255,0.8); font-size: 12px;">
                    2026 CSS Berlin
                </div>
            </div>

            <!-- Kleinunternehmer (§19 UStG) + PAngV Hinweis -->
            <div class="footer-vat-notice">
                <p>*Alle Preise sind Endpreise zzgl. Versandkosten. Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.</p>
            </div>
        </div>
    </footer>
        `;
    },

    /**
     * Dropdown toggle - Click event ile calisir
     */
    toggleDropdown(event) {
        event.stopPropagation();
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    },

    /**
     * Dropdown'i kapat
     */
    closeDropdown() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    },

    /**
     * Logout islemi
     */
    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('cssberlin_token');
        localStorage.removeItem('current_user');
        localStorage.removeItem('cssberlin_current_user');
        window.location.href = 'index.html';
    },

    /**
     * Auth durumunu kontrol et ve UI guncelle
     */
    async checkAuthAndUpdateUI() {
        // authGate varsa kullan, yoksa localStorage kontrol et
        if (typeof authGate !== 'undefined' && authGate.checkAuthStatus) {
            await authGate.checkAuthStatus();
            this.isAuthenticated = authGate.isAuthenticated;
            this.currentUser = authGate.currentUser;
        } else {
            const token = localStorage.getItem('auth_token');
            const userData = localStorage.getItem('cssberlin_current_user') || localStorage.getItem('current_user');
            if (token && userData) {
                this.isAuthenticated = true;
                this.currentUser = JSON.parse(userData);
            }
        }

        this.updateHeaderUI();
    },

    /**
     * Header UI guncelle (login/logout durumuna gore)
     */
    updateHeaderUI() {
        const guestButtons = document.getElementById('guestAuthButtons');
        const userMenu = document.getElementById('userMenuWrapper');

        if (this.isAuthenticated && this.currentUser) {
            // Giris yapilmis
            if (guestButtons) guestButtons.style.display = 'none';
            if (userMenu) userMenu.style.display = 'flex';

            const userName = this.currentUser.firstName ||
                             this.currentUser.username ||
                             this.currentUser.email?.split('@')[0] || 'User';

            // Header icin guncelle
            const userNameEl = document.getElementById('userName');
            const userAvatar = document.getElementById('userAvatar');
            const dropdownUserName = document.getElementById('dropdownUserName');
            const dropdownUserEmail = document.getElementById('dropdownUserEmail');
            const dropdownAvatar = document.getElementById('dropdownAvatar');

            if (userNameEl) userNameEl.textContent = userName;
            if (dropdownUserName) dropdownUserName.textContent = userName;
            if (dropdownUserEmail) dropdownUserEmail.textContent = this.currentUser.email || '';

            // Google Avatar varsa goster
            if (this.currentUser.picture) {
                if (userAvatar) {
                    userAvatar.innerHTML = `<img src="${this.currentUser.picture}" alt="${userName}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">`;
                }
                if (dropdownAvatar) {
                    dropdownAvatar.innerHTML = `<img src="${this.currentUser.picture}" alt="${userName}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                }
            } else {
                if (dropdownAvatar) dropdownAvatar.textContent = userName.charAt(0).toUpperCase();
            }
        } else {
            // Giris yapilmamis
            if (guestButtons) guestButtons.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
        }
    },

    /**
     * Header'i sayfaya ekle
     */
    injectHeader(containerId = 'header-container') {
        // Ensure idempotency: remove any inline/legacy shell first.
        this.cleanupDuplicateShell();

        const existingModern = document.querySelector('header.header-v2#globalHeader');
        if (existingModern) return;

        const container = document.getElementById(containerId);
        if (container) container.innerHTML = this.getHeaderHTML();
        else document.body.insertAdjacentHTML('afterbegin', this.getHeaderHTML());
    },

    /**
     * Inline/legacy header ticker duplicate cleanup
     */
    cleanupDuplicateShell() {
        try {
            // Remove legacy news banners (older pages use .news-banner).
            document.querySelectorAll('.news-banner').forEach((el) => {
                // Keep if it was explicitly marked as global (future-proof)
                if (el.getAttribute('data-global-shell') === '1') return;
                // Also avoid removing the modern v2 banner which uses a different class
                el.remove();
            });

            // Remove dashboard-specific custom header (prevents double header on mein-konto.html).
            document.querySelectorAll('.account-header').forEach((el) => {
                el.remove();
            });

            // Remove any non-global news banners (prevents double ticker).
            document.querySelectorAll('.news-banner-v2').forEach((el) => {
                if (el.getAttribute('data-global-shell') === '1') return;
                el.remove();
            });

            // Remove any non-global modern headers.
            document.querySelectorAll('header.header-v2').forEach((el) => {
                if (el.id === 'globalHeader') return;
                if (el.getAttribute('data-global-shell') === '1') return;
                el.remove();
            });

            // Remove legacy header variants.
            const legacyHeader = document.querySelector('header.header:not(.header-v2)');
            if (legacyHeader) legacyHeader.remove();
        } catch (e) {
            // no-op
        }
    },

    /**
     * Inline/legacy footer duplicate cleanup
     */
    cleanupDuplicateFooter() {
        try {
            document.querySelectorAll('footer.footer').forEach((el) => {
                if (el.getAttribute('data-global-shell') === '1') return;
                el.remove();
            });
        } catch (e) {
            // no-op
        }
    },

    /**
     * Footer'i sayfaya ekle
     */
    injectFooter(containerId = 'footer-container') {
        // Ensure we always standardize (even if legacy footer already has a ticker)
        this.cleanupDuplicateFooter();
        if (document.querySelector('footer.footer[data-global-shell="1"]')) return;

        const container = document.getElementById(containerId);
        if (container) container.innerHTML = this.getFooterHTML();
        else {
            const main = document.querySelector('main') || document.querySelector('.main-content');
            if (main) main.insertAdjacentHTML('afterend', this.getFooterHTML());
            else document.body.insertAdjacentHTML('beforeend', this.getFooterHTML());
        }
    },

    /**
     * Sayfa yuklendikten sonra calistir
     */
    init() {
        if (!this.__eventsBound) {
            this.__eventsBound = true;

            // Dropdown dis tiklamada kapat
            document.addEventListener('click', (e) => {
                const userMenu = document.getElementById('userMenuWrapper');
                const dropdown = document.getElementById('userDropdown');

                if (userMenu && dropdown && !userMenu.contains(e.target)) {
                    this.closeDropdown();
                }
            });

            // ESC tusu ile kapat
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeDropdown();
                }
            });
        }

        // Auth durumunu kontrol et
        this.checkAuthAndUpdateUI();

        // Inject header/footer if page didn't include them (or used legacy ones)
        this.injectHeader();
        this.injectFooter();

        // Basic counts (cart/wishlist) for consistency
        try {
            const cart = JSON.parse(localStorage.getItem('cssberlin_cart') || '[]');
            const cartEl = document.getElementById('cartCount') || document.getElementById('cartBadge');
            if (cartEl) cartEl.textContent = String(cart.length);

            const wl = JSON.parse(localStorage.getItem('wishlist') || '[]');
            const wlEl = document.getElementById('wishlistCount') || document.getElementById('wishlistBadge');
            if (wlEl) wlEl.textContent = String(wl.length);
        } catch (e) {}
    }
};

// Global erisim
window.GlobalHeader = GlobalHeader;

// Sayfa yuklendiginde otomatik calistir (api-config.js autoloader defer ile gec gelebilir)
(function startGlobalHeader() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            GlobalHeader.init();
            // Member incentives (welcome + pricing hints)
            try {
                if (!document.querySelector('script[src$="member-incentives.js"]')) {
                    const s = document.createElement('script');
                    s.src = 'member-incentives.js';
                    s.defer = true;
                    document.head.appendChild(s);
                }
            } catch (e) {}
        });
    } else {
        GlobalHeader.init();
        // Member incentives (welcome + pricing hints)
        try {
            if (!document.querySelector('script[src$="member-incentives.js"]')) {
                const s = document.createElement('script');
                s.src = 'member-incentives.js';
                s.defer = true;
                document.head.appendChild(s);
            }
        } catch (e) {}
    }
})();
