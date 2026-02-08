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
    } else {
        // User is logged out
        if (loginBtn) {
            loginBtn.style.display = "flex";
            loginBtn.onclick = () => {
                window.Clerk.openSignIn({
                    signInFallbackRedirectUrl: window.location.href,
                    signUpFallbackRedirectUrl: window.location.href
                });
            };
            console.log('[Components] Login button event bound.');
        }
    }
}
