// ═══════════════════════════════════════════════════════════════════════════
// CSS BERLIN - GUEST MODE & INTERACTION LOGIC
// Version: 2.1 (2026 - Admin Update)
// Features: Guest Cart/Wishlist, Login Guard, Button Handlers, Toast System
// ═══════════════════════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // STORAGE KEYS
    // ═══════════════════════════════════════════════════════════════════════
    const STORAGE_KEYS = {
        GUEST_CART: 'cssberlin_guest_cart',
        GUEST_WISHLIST: 'cssberlin_guest_wishlist',
        USER: 'cssberlin_user',
        TOKEN: 'cssberlin_token'
    };

    // ═══════════════════════════════════════════════════════════════════════
    // TOAST NOTIFICATION SYSTEM
    // ═══════════════════════════════════════════════════════════════════════
    const Toast = {
        container: null,

        init() {
            if (this.container) return;
            this.container = document.createElement('div');
            this.container.id = 'cssberlin-toast-container';
            this.container.style.cssText = `
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 99999;
                display: flex;
                flex-direction: column-reverse;
                gap: 12px;
                max-width: 380px;
                pointer-events: none;
            `;
            document.body.appendChild(this.container);
        },

        show(message, type = 'info', duration = 3500) {
            this.init();

            const toast = document.createElement('div');
            const colors = {
                success: { bg: '#2D5016', icon: 'check-circle' },
                error: { bg: '#DC2626', icon: 'x-circle' },
                warning: { bg: '#F59E0B', icon: 'alert-triangle' },
                info: { bg: '#FF8C42', icon: 'info' }
            };
            const config = colors[type] || colors.info;

            toast.style.cssText = `
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 14px 20px;
                background: ${config.bg};
                color: white;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                font-size: 14px;
                font-weight: 500;
                transform: translateX(120%);
                transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
                cursor: pointer;
                pointer-events: auto;
                font-family: 'Inter', sans-serif;
            `;

            const icons = {
                'check-circle': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
                'x-circle': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
                'alert-triangle': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
                'info': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
            };

            toast.innerHTML = `
                <span style="flex-shrink:0;">${icons[config.icon]}</span>
                <span style="flex:1;">${message}</span>
            `;

            toast.addEventListener('click', () => this.dismiss(toast));

            this.container.appendChild(toast);

            requestAnimationFrame(() => {
                toast.style.transform = 'translateX(0)';
            });

            setTimeout(() => this.dismiss(toast), duration);
        },

        dismiss(toast) {
            toast.style.transform = 'translateX(120%)';
            setTimeout(() => toast.remove(), 350);
        },

        success(msg, dur) { this.show(msg, 'success', dur); },
        error(msg, dur) { this.show(msg, 'error', dur); },
        warning(msg, dur) { this.show(msg, 'warning', dur); },
        info(msg, dur) { this.show(msg, 'info', dur); }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // AUTH HELPER
    // ═══════════════════════════════════════════════════════════════════════
    const Auth = {
        isLoggedIn() {
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
            const user = localStorage.getItem(STORAGE_KEYS.USER);
            return !!(token && user);
        },

        getUser() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
            } catch {
                return null;
            }
        },

        showLoginModal(tab = 'login') {
            if (window.authModalV3 && typeof window.authModalV3.open === 'function') {
                window.authModalV3.open(tab);
                return true;
            }
            if (window.authModal && typeof window.authModal.open === 'function') {
                window.authModal.open(tab);
                return true;
            }
            Toast.warning('Bitte melde dich an, um fortzufahren.');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return false;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // GUEST CART MANAGER
    // ═══════════════════════════════════════════════════════════════════════
    const GuestCart = {
        getItems() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEYS.GUEST_CART) || '[]');
            } catch {
                return [];
            }
        },

        saveItems(items) {
            localStorage.setItem(STORAGE_KEYS.GUEST_CART, JSON.stringify(items));
            this.updateHeaderCount();
        },

        add(product) {
            const items = this.getItems();
            const existingIndex = items.findIndex(item => item.id === product.id);

            if (existingIndex > -1) {
                Toast.info('Bereits im Warenkorb');
                return true;
            }

            items.push({
                id: product.id,
                name: product.name || product.title,
                brand: product.brand,
                price: product.price,
                image: product.image || (product.images && product.images[0]),
                size: product.size,
                addedAt: new Date().toISOString()
            });
            this.saveItems(items);
            Toast.success('Zum Warenkorb hinzugefügt!');
            return true;
        },

        remove(productId) {
            const items = this.getItems();
            const newItems = items.filter(item => item.id !== productId);
            this.saveItems(newItems);
            return newItems;
        },

        isInCart(productId) {
            return this.getItems().some(item => item.id === productId);
        },

        getCount() {
            return this.getItems().length;
        },

        clear() {
            localStorage.removeItem(STORAGE_KEYS.GUEST_CART);
            this.updateHeaderCount();
        },

        updateHeaderCount() {
            const count = this.getCount();
            const badges = document.querySelectorAll('#cartCount, .cart-count, [data-cart-count], .header-btn[title="Warenkorb"] .count');
            badges.forEach(badge => {
                badge.textContent = count;
                badge.style.display = count > 0 ? 'flex' : 'none';
            });
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // GUEST WISHLIST MANAGER
    // ═══════════════════════════════════════════════════════════════════════
    const GuestWishlist = {
        getItems() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEYS.GUEST_WISHLIST) || '[]');
            } catch {
                return [];
            }
        },

        saveItems(items) {
            localStorage.setItem(STORAGE_KEYS.GUEST_WISHLIST, JSON.stringify(items));
            this.updateHeaderCount();
        },

        toggle(product) {
            const items = this.getItems();
            const existingIndex = items.findIndex(item => item.id === product.id);

            if (existingIndex > -1) {
                items.splice(existingIndex, 1);
                this.saveItems(items);
                Toast.info('Von der Wunschliste entfernt');
                return false;
            }

            items.push({
                id: product.id,
                name: product.name || product.title,
                brand: product.brand,
                price: product.price,
                image: product.image || (product.images && product.images[0]),
                size: product.size,
                addedAt: new Date().toISOString()
            });
            this.saveItems(items);
            Toast.success('Zur Wunschliste hinzugefügt!');
            return true;
        },

        isInWishlist(productId) {
            return this.getItems().some(item => item.id === productId);
        },

        getCount() {
            return this.getItems().length;
        },

        clear() {
            localStorage.removeItem(STORAGE_KEYS.GUEST_WISHLIST);
            this.updateHeaderCount();
        },

        updateHeaderCount() {
            const count = this.getCount();
            const badges = document.querySelectorAll('#wishlistCount, .wishlist-count, [data-wishlist-count], .header-btn[title="Favoriten"] .badge, .header-btn[title="Favoriten"] .count');
            badges.forEach(badge => {
                if (badge.classList.contains('badge')) {
                    badge.style.display = count > 0 ? 'block' : 'none';
                } else {
                    badge.textContent = count;
                    badge.style.display = count > 0 ? 'flex' : 'none';
                }
            });
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // LOGIN GUARD
    // ═══════════════════════════════════════════════════════════════════════
    const LoginGuard = {
        init() {
            this.guardElement('.header-btn[title="Warenkorb"]', 'Warenkorb');
            this.guardElement('.header-btn[title="Favoriten"]', 'Wunschliste');
            this.guardElement('.header-btn[title="Verhandeln"]', 'Verhandlungen');

            console.log('[LoginGuard] Header icons protected');
        },

        guardElement(selector, name) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.removeAttribute('onclick');

                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (!Auth.isLoggedIn()) {
                        Toast.warning(`Bitte melde dich an, um ${name} zu sehen.`);
                        setTimeout(() => Auth.showLoginModal('login'), 500);
                    } else {
                        if (name === 'Warenkorb') window.location.href = 'warenkorb.html';
                        if (name === 'Wunschliste') window.location.href = 'wunschliste.html';
                        if (name === 'Verhandlungen') window.location.href = 'meine-anzeigen.html?tab=negotiations';
                    }
                });
            });
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // PRODUCT BUTTON HANDLERS (Event Delegation)
    // ═══════════════════════════════════════════════════════════════════════
    const ProductActions = {
        init() {
            // Use event delegation for product card buttons
            document.addEventListener('click', (e) => {
                // Handle Preisvorschlag/Negotiate button
                const negotiateBtn = e.target.closest('.negotiate-btn');
                if (negotiateBtn) {
                    e.preventDefault();
                    const productId = negotiateBtn.dataset.productId;
                    this.handleOffer(productId);
                    return;
                }

                // Handle Kaufen/Buy button
                const buyBtn = e.target.closest('.buy-btn');
                if (buyBtn) {
                    e.preventDefault();
                    const productId = buyBtn.dataset.productId;
                    this.handleBuy(productId);
                    return;
                }
            });

            console.log('[ProductActions] Event delegation initialized');
        },

        handleOffer(productId) {
            if (!Auth.isLoggedIn()) {
                Toast.warning('Bitte melde dich an, um einen Preisvorschlag zu senden.');
                setTimeout(() => Auth.showLoginModal('login'), 800);
            } else {
                // Open offer modal or redirect to offer page
                Toast.info('Preisvorschlag wird vorbereitet...');
                // TODO: Integrate with offer modal
                setTimeout(() => {
                    window.location.href = `produkt.html?id=${productId}&action=offer`;
                }, 500);
            }
        },

        handleBuy(productId) {
            const product = (window.loadedProducts || []).find(p => p.id == productId) || {
                id: productId,
                name: "Produkt",
                price: "99.00",
                image: "images/placeholder.jpg"
            };

            GuestCart.add(product);
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // SEARCH BAR CLEANUP
    // ═══════════════════════════════════════════════════════════════════════
    const SearchCleanup = {
        init() {
            const voiceButtons = document.querySelectorAll('.search-action-btn[title="Sprachsuche"]');
            const imageButtons = document.querySelectorAll('.search-action-btn[title="Bildsuche"]');

            voiceButtons.forEach(btn => btn.onclick = (e) => { e.preventDefault(); Toast.info('Sprachsuche kommt bald!'); });
            imageButtons.forEach(btn => btn.onclick = (e) => { e.preventDefault(); Toast.info('Bildsuche kommt bald!'); });
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // INIT ON DOM READY
    // ═══════════════════════════════════════════════════════════════════════
    function init() {
        console.log('[GuestMode] Initializing CSS Berlin Guest Mode System v2.1...');
        Toast.init();
        LoginGuard.init();
        ProductActions.init();
        SearchCleanup.init();

        GuestCart.updateHeaderCount();
        GuestWishlist.updateHeaderCount();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.CSSBerlinGuest = { Toast, Auth, GuestCart, GuestWishlist };

})();
