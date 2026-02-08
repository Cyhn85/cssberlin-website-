// GLOBAL FUNCTIONS (Defined immediately to prevent race conditions)
window.toggleLanguageDropdown = function () {
    if (window.I18n) {
        const newLang = window.I18n.currentLang === 'de' ? 'en' : 'de';
        window.I18n.setLanguage(newLang);
    } else {
        console.warn('I18n not ready yet');
    }
};

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
    // Load I18n Script if missing
    if (!document.querySelector('script[src="i18n.js"]')) {
        const s = document.createElement('script');
        s.src = 'i18n.js';
        document.body.appendChild(s);
    }

    // 3. Clerk Auth Re-binding
    if (window.Clerk) {
        rebindClerk();
    } else {
        window.addEventListener('load', rebindClerk);
    }
}

function rebindClerk() {
    if (!window.Clerk) return;

    const loginBtn = document.getElementById("header-login-btn");
    const userContainer = document.getElementById("user-button-container");

    // BRANDING COLOR
    const BRAND_ORANGE = '#FF8C42';
    const BRAND_GREEN = '#2D5016';

    // Configure Clerk Appearance Globally if possible, or per mount
    // Note: Clerk.js usually takes appearance in mount/open calls.

    if (window.Clerk.user) {
        // ID logged in...
        if (loginBtn) loginBtn.style.display = "none";

        if (userContainer) {
            userContainer.innerHTML = '';

            // FORCE LOAD USER MENU SCRIPT IF MISSING
            if (typeof window.UserMenu === 'undefined') {
                if (!document.querySelector('script[src="user-menu.js"]')) {
                    const s = document.createElement('script');
                    s.src = 'user-menu.js';
                    s.onload = () => {
                        // Init after load
                        if (window.UserMenu) window.UserMenu.init(window.Clerk.user);
                    };
                    document.body.appendChild(s);
                } else {
                    // Script tag exists but maybe not loaded? Wait a bit
                    setTimeout(() => {
                        if (window.UserMenu) window.UserMenu.init(window.Clerk.user);
                        else {
                            // Fallback to default but styled
                            window.Clerk.mountUserButton(userContainer, {
                                afterSignOutUrl: "/",
                                signInUrl: "/",
                                appearance: {
                                    variables: {
                                        colorPrimary: BRAND_GREEN,
                                        colorTextOnPrimaryBackground: 'white'
                                    }
                                }
                            });
                        }
                    }, 500);
                }
            } else {
                // Already loaded
                window.UserMenu.init(window.Clerk.user);
            }
        }
    } else {
        // NOT LOGGED IN
        if (loginBtn) {
            loginBtn.style.display = "flex";
            loginBtn.onclick = () => {
                window.Clerk.openSignIn({
                    appearance: {
                        variables: {
                            colorPrimary: BRAND_GREEN,
                            colorTextOnPrimaryBackground: 'white',
                            colorBackground: '#ffffff',
                            colorInputBackground: '#f5f5f5',
                            colorInputText: '#333'
                        },
                        elements: {
                            card: 'shadow-xl border-2 border-[#2D5016]',
                            headerTitle: 'text-[#2D5016]',
                            socialButtonsIconButton: 'border border-[#ddd]'
                        }
                    }
                });
            };
        }
    }

    // 4. Guest Protection
    initGuestProtection();
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
                        window.Clerk.openSignIn({
                            appearance: {
                                variables: {
                                    colorPrimary: '#2D5016',
                                    colorTextOnPrimaryBackground: 'white'
                                }
                            }
                        });
                    } else {
                        alert("Bitte melden Sie sich an.");
                    }
                }
            });
        });
    });
}
