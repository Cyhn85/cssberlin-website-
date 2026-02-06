/**
 * CSS BERLIN - GDPR Cookie Consent System
 * German Law Compliant | EU GDPR | 2026
 *
 * Features:
 * - Accept All / Reject All / Customize
 * - Granular category control (Essential, Analytics, Marketing)
 * - Persistent localStorage consent
 * - Re-open settings via footer link
 * - Blocks non-essential scripts until consent
 */

(function() {
    'use strict';

    const CONSENT_KEY = 'cssberlin_cookie_consent';
    const CONSENT_VERSION = '1.0'; // Increment to re-ask consent

    // Cookie categories
    const CATEGORIES = {
        essential: {
            name: 'Notwendig',
            description: 'Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.',
            required: true,
            default: true
        },
        analytics: {
            name: 'Statistik',
            description: 'Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren (z.B. Google Analytics).',
            required: false,
            default: false
        },
        marketing: {
            name: 'Marketing',
            description: 'Diese Cookies werden verwendet, um Werbung relevanter für Sie zu gestalten.',
            required: false,
            default: false
        }
    };

    // Check if consent was already given
    function getStoredConsent() {
        try {
            const stored = localStorage.getItem(CONSENT_KEY);
            if (!stored) return null;

            const consent = JSON.parse(stored);

            // Check version - if outdated, re-ask
            if (consent.version !== CONSENT_VERSION) {
                return null;
            }

            return consent;
        } catch (e) {
            return null;
        }
    }

    // Save consent to localStorage
    function saveConsent(categories) {
        const consent = {
            version: CONSENT_VERSION,
            timestamp: new Date().toISOString(),
            categories: categories
        };

        localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));

        // Dispatch event for other scripts to react
        window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
            detail: consent
        }));

        return consent;
    }

    // Create the consent banner HTML
    function createBanner() {
        const overlay = document.createElement('div');
        overlay.className = 'cookie-consent-overlay';
        overlay.id = 'cookieConsentOverlay';

        overlay.innerHTML = `
            <div class="cookie-consent-banner" role="dialog" aria-modal="true" aria-labelledby="cookieConsentTitle">
                <div class="cookie-consent-content">
                    <div class="cookie-consent-header">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <circle cx="8" cy="9" r="1" fill="currentColor"></circle>
                            <circle cx="15" cy="8" r="1" fill="currentColor"></circle>
                            <circle cx="10" cy="14" r="1" fill="currentColor"></circle>
                            <circle cx="16" cy="13" r="1" fill="currentColor"></circle>
                            <circle cx="12" cy="17" r="1" fill="currentColor"></circle>
                        </svg>
                        <h2 id="cookieConsentTitle">Cookie-Einstellungen</h2>
                    </div>

                    <p class="cookie-consent-text">
                        Wir verwenden Cookies und ähnliche Technologien, um Ihnen ein optimales Nutzererlebnis zu bieten.
                        Einige Cookies sind notwendig, während andere uns helfen, die Website zu verbessern.
                        <br><br>
                        Mehr Informationen finden Sie in unserer
                        <a href="datenschutz.html">Datenschutzerklärung</a> und
                        <a href="cookie.html">Cookie-Richtlinie</a>.
                    </p>

                    <div class="cookie-categories" id="cookieCategories">
                        ${Object.entries(CATEGORIES).map(([key, cat]) => `
                            <div class="cookie-category">
                                <label class="cookie-category-toggle">
                                    <input type="checkbox"
                                           id="cookie-${key}"
                                           data-category="${key}"
                                           ${cat.default ? 'checked' : ''}
                                           ${cat.required ? 'disabled checked' : ''}>
                                    <span class="slider"></span>
                                </label>
                                <div class="cookie-category-info">
                                    <h4>${cat.name}</h4>
                                    <p>${cat.description}</p>
                                </div>
                                ${cat.required ? '<span class="cookie-category-required">Erforderlich</span>' : ''}
                            </div>
                        `).join('')}
                    </div>

                    <div class="cookie-consent-buttons">
                        <button class="cookie-btn cookie-btn-accept" id="cookieAcceptAll">
                            Alle akzeptieren
                        </button>
                        <button class="cookie-btn cookie-btn-reject" id="cookieRejectAll">
                            Nur Notwendige
                        </button>
                        <button class="cookie-btn cookie-btn-settings" id="cookieShowSettings">
                            Einstellungen anpassen
                        </button>
                        <button class="cookie-btn cookie-btn-save" id="cookieSaveSettings" style="display: none;">
                            Auswahl speichern
                        </button>
                    </div>
                </div>
            </div>
        `;

        return overlay;
    }

    // Show the banner
    function showBanner() {
        let overlay = document.getElementById('cookieConsentOverlay');

        if (!overlay) {
            overlay = createBanner();
            document.body.appendChild(overlay);
            attachEventListeners(overlay);
        }

        // Force reflow for animation
        overlay.offsetHeight;
        overlay.classList.add('active');

        // Trap focus in modal
        const firstButton = overlay.querySelector('button');
        if (firstButton) firstButton.focus();
    }

    // Hide the banner
    function hideBanner() {
        const overlay = document.getElementById('cookieConsentOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    // Attach event listeners
    function attachEventListeners(overlay) {
        const acceptAllBtn = overlay.querySelector('#cookieAcceptAll');
        const rejectAllBtn = overlay.querySelector('#cookieRejectAll');
        const showSettingsBtn = overlay.querySelector('#cookieShowSettings');
        const saveSettingsBtn = overlay.querySelector('#cookieSaveSettings');
        const categoriesDiv = overlay.querySelector('#cookieCategories');

        // Accept All
        acceptAllBtn.addEventListener('click', () => {
            const categories = {};
            Object.keys(CATEGORIES).forEach(key => {
                categories[key] = true;
            });
            saveConsent(categories);
            hideBanner();
            applyConsent(categories);
            console.log('[Cookie Consent] All cookies accepted');
        });

        // Reject All (only essential)
        rejectAllBtn.addEventListener('click', () => {
            const categories = {};
            Object.keys(CATEGORIES).forEach(key => {
                categories[key] = CATEGORIES[key].required;
            });
            saveConsent(categories);
            hideBanner();
            applyConsent(categories);
            console.log('[Cookie Consent] Only essential cookies accepted');
        });

        // Show Settings
        showSettingsBtn.addEventListener('click', () => {
            categoriesDiv.classList.toggle('visible');
            showSettingsBtn.style.display = 'none';
            saveSettingsBtn.style.display = 'block';
        });

        // Save Custom Settings
        saveSettingsBtn.addEventListener('click', () => {
            const categories = {};
            overlay.querySelectorAll('[data-category]').forEach(input => {
                categories[input.dataset.category] = input.checked;
            });
            saveConsent(categories);
            hideBanner();
            applyConsent(categories);
            console.log('[Cookie Consent] Custom settings saved:', categories);
        });

        // ESC key to close (with reject all)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                rejectAllBtn.click();
            }
        });
    }

    // Apply consent (enable/disable scripts based on consent)
    function applyConsent(categories) {
        // Enable analytics scripts if consented
        if (categories.analytics) {
            enableAnalytics();
        }

        // Enable marketing scripts if consented
        if (categories.marketing) {
            enableMarketing();
        }

        // Fire custom event for other scripts
        window.dispatchEvent(new CustomEvent('cookieConsentApplied', {
            detail: categories
        }));
    }

    // Enable analytics (placeholder - customize for your analytics)
    function enableAnalytics() {
        console.log('[Cookie Consent] Analytics enabled');

        // Example: Enable Google Analytics
        // if (typeof gtag === 'function') {
        //     gtag('consent', 'update', {
        //         'analytics_storage': 'granted'
        //     });
        // }
    }

    // Enable marketing (placeholder - customize for your marketing tools)
    function enableMarketing() {
        console.log('[Cookie Consent] Marketing enabled');

        // Example: Enable Google Ads
        // if (typeof gtag === 'function') {
        //     gtag('consent', 'update', {
        //         'ad_storage': 'granted'
        //     });
        // }
    }

    // Public API
    window.CookieConsent = {
        // Show the consent banner
        show: showBanner,

        // Hide the consent banner
        hide: hideBanner,

        // Get current consent status
        getConsent: function() {
            return getStoredConsent();
        },

        // Check if a specific category is consented
        hasConsent: function(category) {
            const consent = getStoredConsent();
            if (!consent) return false;
            return consent.categories[category] === true;
        },

        // Reset consent (for testing or user request)
        reset: function() {
            localStorage.removeItem(CONSENT_KEY);
            console.log('[Cookie Consent] Consent reset');
        },

        // Open settings modal
        openSettings: function() {
            showBanner();
            setTimeout(() => {
                const settingsBtn = document.getElementById('cookieShowSettings');
                if (settingsBtn) settingsBtn.click();
            }, 100);
        }
    };

    // Global function for footer link
    window.openCookieSettings = function() {
        CookieConsent.openSettings();
    };

    // Initialize on DOM ready
    function init() {
        const consent = getStoredConsent();

        if (!consent) {
            // No consent stored - show banner
            showBanner();
        } else {
            // Consent exists - apply it
            applyConsent(consent.categories);
            console.log('[Cookie Consent] Existing consent applied:', consent.categories);
        }
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('[Cookie Consent] GDPR Cookie Consent System loaded');
})();
