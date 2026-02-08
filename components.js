document.addEventListener('DOMContentLoaded', async function () {
    console.log('[Components] Initializing component loader...');

    // 1. Load Header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        try {
            const resp = await fetch('components/header.html');
            if (resp.ok) {
                const html = await resp.text();
                headerPlaceholder.innerHTML = html;
                console.log('[Components] Header loaded.');
                initializeHeaderScripts();

                // Inject Filter Bar IF on index.html or category pages
                // We add it after the header, but before the main content or 'smart-header-sentinel'
                // Actually, user wants it BEFORE showcase.
                // Let's check if there's a placeholder for it
                if (!document.getElementById('filter-bar-placeholder')) {
                    const filterDiv = document.createElement('div');
                    filterDiv.id = 'filter-bar-placeholder';
                    headerPlaceholder.parentNode.insertBefore(filterDiv, headerPlaceholder.nextSibling);
                    loadFilterBar();
                }
            } else {
                console.error('[Components] Failed to fetch header:', resp.status);
            }
        } catch (e) {
            console.error('[Components] Error loading header:', e);
        }
    }

    // 2. Load Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        try {
            const resp = await fetch('components/footer.html');
            if (resp.ok) {
                const html = await resp.text();
                footerPlaceholder.innerHTML = html;
                console.log('[Components] Footer loaded.');
            } else {
                console.error('[Components] Failed to fetch footer:', resp.status);
            }
        } catch (e) {
            console.error('[Components] Error loading footer:', e);
        }
    }
});

function initializeHeaderScripts() {
    // Load Custom User Menu Script
    if (!document.querySelector('script[src="user-menu.js"]')) {
        const s = document.createElement('script');
        s.src = 'user-menu.js';
        document.body.appendChild(s);
    }

    console.log('[Components] Re-initializing header scripts...');

    // 0. Re-init Dark Mode (CRITICAL: Must happen after header injection)
    if (window.smartHeader) {
        window.smartHeader.initDarkMode();
    } else if (window.SmartHeader) {
        // If instance doesn't exist yet, creating it will init dark mode
        // But if it does exist, we might need to force it
    }
    // Also try direct init if SmartHeader is not available or logic is separate
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        // Manual init if needed, or rely on SmartHeader
        const isDark = localStorage.getItem('cssberlin_dark_mode') === 'true';
        if (isDark) {
            document.body.classList.add('dark-mode');
            toggle.classList.add('active');
        }
        toggle.addEventListener('click', () => {
            const isNowDark = document.body.classList.toggle('dark-mode');
            toggle.classList.toggle('active');
            localStorage.setItem('cssberlin_dark_mode', isNowDark);
        });
    }

    // 1. Re-init SmartHeader (Mega Menu, Voice Search, etc.)
    if (window.SmartHeader) {
        window.smartHeader = new SmartHeader();
        console.log('[Components] SmartHeader re-initialized.');
    } else {
        console.warn('[Components] SmartHeader class not found. Make sure smart-header.js is loaded.');
    }

    // 2. Language Selector Logic
    // If toggleLanguageDropdown is not defined globally, we define a simple version here or link it to I18n
    if (typeof window.toggleLanguageDropdown === 'undefined') {
        window.toggleLanguageDropdown = function () {
            if (window.I18n && typeof window.I18n.setLanguage === 'function') {
                const newLang = window.I18n.currentLang === 'de' ? 'en' : 'de';
                window.I18n.setLanguage(newLang);

                // Update button visual
                const btnSpan = document.querySelector('.lang-selector-v3 span');
                if (btnSpan) btnSpan.textContent = newLang.toUpperCase();
            } else {
                console.warn('I18n system not ready or missing.');
            }
        };
    }

    // 3. Clerk Auth Re-binding
    // Wait for Clerk to be ready if it isn't yet
    if (window.Clerk) {
        rebindClerk();
    } else {
        // If Clerk loads later, it usually handles its own mount, but we might need to handle the custom login button
        window.addEventListener('load', rebindClerk);
    }
}

function rebindClerk() {
    if (!window.Clerk) return;

    const loginBtn = document.getElementById("header-login-btn");
    const userContainer = document.getElementById("user-button-container");

    if (window.Clerk.user) {
        // User is logged in
        if (loginBtn) loginBtn.style.display = "none";

        if (userContainer) {
            userContainer.innerHTML = ''; // Clear previous
            try {
                if (window.UserMenu) {
                    window.UserMenu.init(window.Clerk.user);
                } else {
                    window.Clerk.mountUserButton(userContainer, {
                        afterSignOutUrl: "/",
                        signInUrl: "/"
                    });
                }
                console.log('[Components] Clerk UserButton mounted.');
            } catch (e) {
                console.error('[Components] Error mounting Clerk UserButton:', e);
            }
        }
    }

    // 4. Guest Protection
    initGuestProtection();
}

async function loadFilterBar() {
    const placeholder = document.getElementById('filter-bar-placeholder');
    if (!placeholder) return;

    // Only load on index, category pages
    const path = window.location.pathname;
    if (path.includes('login') || path.includes('register') || path.includes('checkout')) return;

    try {
        const resp = await fetch('components/filter-bar.html');
        if (resp.ok) {
            const html = await resp.text();
            placeholder.innerHTML = html;

            // Execute scripts in the injected HTML
            const scripts = placeholder.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) newScript.src = script.src;
                else newScript.textContent = script.textContent;
                document.body.appendChild(newScript);
            });
        }
    } catch (e) {
        console.error('Failed to load filter bar', e);
    }
}

function initGuestProtection() {
}

function initGuestProtection() {
    // Select all protected icons: Messages, Negotiations, Wishlist, Cart
    const protectedSelectors = [
        'a[href="nachrichten.html"]',
        'a[href="pazarlik.html"]',
        'a[href="wunschliste.html"]',
        'a[href="warenkorb.html"]'
    ];

    protectedSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.addEventListener('click', function (e) {
                // Check Clerk Login Status
                const isGuest = !window.Clerk || !window.Clerk.user;

                if (isGuest) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Guest access attempted. Triggering login.');

                    if (window.Clerk) {
                        window.Clerk.openSignIn();
                    } else {
                        alert("Bitte melden Sie sich an.");
                    }
                }
            });
        });
    });
}
