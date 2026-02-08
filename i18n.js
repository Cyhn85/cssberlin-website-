/* =============================================
   I18N - INTERNATIONALIZATION SYSTEM
   German & English Dictionaries
   ============================================= */

const translations = {
    'de': {
        // Header
        'announcement.offer': 'PREISVORSCHLAG SENDEN & SPAREN',
        'announcement.shipping': 'KOSTENLOSER VERSAND AB 50€',
        'announcement.secure': 'SICHER BEZAHLEN MIT KÄUFERSCHUTZ',
        'nav.damen': 'DAMEN',
        'nav.herren': 'HERREN',
        'nav.kinder': 'KINDER',
        'nav.elektronik': 'ELEKTRONIK',
        'nav.sonstiges': 'SONSTIGES',
        'nav.sale': 'SALE',
        'btn.login': 'Anmelden',
        'cat.all': 'Alle Kategorien',
        'search.placeholder': 'CLIMATE SMART SOLUTIONS',

        // Hero
        'hero.collection': 'Aktuelle Kollektion',
        'hero.fresh': 'Frisch Eingetroffen',
        'loader.text': 'Produkte werden geladen...',

        // Product Card
        'card.new': 'NEUWERTIG',
        'card.good': 'GUT',
        'card.very_good': 'SEHR GUT',
        'card.sold': 'VERKAUFT',
        'btn.negotiate': 'Verhandeln',
        'btn.buy': 'Kaufen',
        'btn.loadmore': 'Mehr anzeigen',

        // Footer
        'footer.about': 'Über uns',
        'footer.sustainability': 'Nachhaltigkeit',
        'footer.press': 'Presse',
        'footer.advertising': 'Werbung',
        'footer.accessibility': 'Barrierefreiheit',
        'footer.how': "Wie funktioniert's?",
        'footer.verification': 'Artikelverifizierung',
        'footer.apps': 'Smartphone-Apps',
        'footer.infoboard': 'Infoboard',
        'footer.help': 'Hilfe-Center',
        'footer.trust': 'Vertrauen und Sicherheit',
        'footer.imprint': 'Impressum',
        'footer.privacy': 'Datenschutz',
        'footer.terms': 'AGB',
        'footer.withdrawal': 'Widerrufsrecht',
        'footer.rights': 'Alle Rechte vorbehalten.',

        // Dialogs
        'toast.wishlist_add': 'Zur Wunschliste hinzugefügt',
        'toast.wishlist_remove': 'Von der Wunschliste entfernt',
        'toast.cart_add': 'In den Warenkorb gelegt',
        'toast.cart_remove': 'Aus Warenkorb entfernt'
    },
    'en': {
        // Header
        'announcement.offer': 'SEND OFFER & SAVE',
        'announcement.shipping': 'FREE SHIPPING OVER 50€',
        'announcement.secure': 'SECURE CHECKOUT WITH BUYER PROCTECTION',
        'nav.damen': 'WOMEN',
        'nav.herren': 'MEN',
        'nav.kinder': 'KIDS',
        'nav.elektronik': 'ELECTRONICS',
        'nav.sonstiges': 'OTHERS',
        'nav.sale': 'SALE',
        'btn.login': 'Sign In',
        'cat.all': 'All Categories',
        'search.placeholder': 'SEARCH ITEMS...',

        // Hero
        'hero.collection': 'Current Collection',
        'hero.fresh': 'Just Arrived',
        'loader.text': 'Loading products...',

        // Product Card
        'card.new': 'LIKE NEW',
        'card.good': 'GOOD',
        'card.very_good': 'VERY GOOD',
        'card.sold': 'SOLD OUT',
        'btn.negotiate': 'Make Offer',
        'btn.buy': 'Buy Now',
        'btn.loadmore': 'Load More',

        // Footer
        'footer.about': 'About Us',
        'footer.sustainability': 'Sustainability',
        'footer.press': 'Press',
        'footer.advertising': 'Advertising',
        'footer.accessibility': 'Accessibility',
        'footer.how': 'How it works?',
        'footer.verification': 'Item Verification',
        'footer.apps': 'Mobile Apps',
        'footer.infoboard': 'Infoboard',
        'footer.help': 'Help Center',
        'footer.trust': 'Trust & Safety',
        'footer.imprint': 'Imprint',
        'footer.privacy': 'Privacy Policy',
        'footer.terms': 'Terms & Conditions',
        'footer.withdrawal': 'Right of Withdrawal',
        'footer.rights': 'All rights reserved.',

        // Dialogs
        'toast.wishlist_add': 'Added to Wishlist',
        'toast.wishlist_remove': 'Removed from Wishlist',
        'toast.cart_add': 'Added to Cart',
        'toast.cart_remove': 'Removed from Cart'
    }
};

window.I18n = {
    currentLang: localStorage.getItem('cssberlin_lang') || 'de',

    init() {
        console.log('[I18n] Initializing language:', this.currentLang);
        this.updatePage();
        this.updateButton();
    },

    setLanguage(lang) {
        if (lang !== 'de' && lang !== 'en') return;
        this.currentLang = lang;
        localStorage.setItem('cssberlin_lang', lang);
        this.updatePage();
        this.updateButton();

        // Reload products if function exists to refresh card text
        if (typeof renderProducts === 'function' && window.loadedProducts) {
            renderProducts(window.loadedProducts);
        } else if (typeof renderProducts === 'function' && typeof mockProducts !== 'undefined') {
            renderProducts(mockProducts);
        }
    },

    getText(key) {
        return translations[this.currentLang][key] || key;
    },

    updateButton() {
        const btnSpan = document.querySelector('.lang-selector-v3 span');
        if (btnSpan) btnSpan.textContent = this.currentLang.toUpperCase();
    },

    updatePage() {
        // Map DOM elements to translation keys
        const mapping = [
            // Header
            { sel: '.announcement-item:nth-child(1)', key: 'announcement.offer', html: true, icon: '🌟 ' },
            { sel: '.announcement-item:nth-child(3)', key: 'announcement.shipping', html: true, icon: '🚚 ' },
            { sel: '.announcement-item:nth-child(5)', key: 'announcement.secure', html: true, icon: '🔒 ' },
            { sel: 'a[href="?category=damen"]', key: 'nav.damen' },
            { sel: 'a[href="?category=herren"]', key: 'nav.herren' },
            { sel: 'a[href="?category=kinder"]', key: 'nav.kinder' },
            { sel: 'a[href="?category=elektronik"]', key: 'nav.elektronik' },
            { sel: 'a[href="sonstiges.html"]', key: 'nav.sonstiges' },
            { sel: '#header-login-btn', key: 'btn.login' },
            { sel: '#categoryDropdownTrigger span', key: 'cat.all' },
            { attr: 'placeholder', sel: '#searchInputV3', key: 'search.placeholder' },

            // Hero
            { sel: '.products > div > div:first-child', key: 'hero.collection' },
            { sel: '#pageTitle', key: 'hero.fresh' },

            // Buttons
            { sel: '.btn-load-more', key: 'btn.loadmore' },

            // Footer
            { sel: 'a[href="ueber-uns.html"]', key: 'footer.about' },
            { sel: 'a[href="nachhaltigkeit.html"]', key: 'footer.sustainability' },
            { sel: 'a[href="presse.html"]', key: 'footer.press' },
            { sel: 'a[href="werbung.html"]', key: 'footer.advertising' },
            { sel: 'a[href="barrierefreiheit.html"]', key: 'footer.accessibility' },
            { sel: 'a[href="wie-funktioniert-es.html"]', key: 'footer.how' },
            { sel: 'a[href="verifizierung.html"]', key: 'footer.verification' },
            { sel: 'a[href="apps.html"]', key: 'footer.apps' },
            { sel: 'a[href="infoboard.html"]', key: 'footer.infoboard' },
            { sel: 'a[href="hilfe-center.html"]', key: 'footer.help' },
            { sel: 'a[href="sicherheit.html"]', key: 'footer.trust' },
            { sel: 'a[href="impressum.html"]', key: 'footer.imprint' },
            { sel: 'a[href="datenschutz.html"]', key: 'footer.privacy' },
            { sel: 'a[href="agb.html"]', key: 'footer.terms' },
            { sel: 'a[href="widerrufsrecht.html"]', key: 'footer.withdrawal' },
            // Copyright
            { sel: '.footer-bottom-v3 p', key: 'footer.rights', html: true, prefix: '&copy; 2026 CSS Berlin - Climate Smart Solutions. ' }

        ];

        mapping.forEach(item => {
            const els = document.querySelectorAll(item.sel);
            els.forEach(el => {
                const text = this.getText(item.key);
                if (item.attr) {
                    el.setAttribute(item.attr, text);
                } else if (item.html) {
                    const prefix = item.prefix || '';
                    const icon = item.icon ? `<span class="announcement-icon">${item.icon.trim()}</span> ` : '';
                    el.innerHTML = icon + prefix + text;
                } else {
                    el.textContent = text;
                }
            });
        });
    }
};

// Auto-Init on Load
document.addEventListener('DOMContentLoaded', () => {
    window.I18n.init();
});
