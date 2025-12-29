/**
 * CSS Berlin - Internationalization (i18n) System
 * Handles language switching between German (de) and English (en)
 */

const I18n = {
    currentLang: 'de',
    translations: {},
    defaultLang: 'de',

    /**
     * Initialize the i18n system
     */
    async init() {
        // Load saved language preference
        const savedLang = localStorage.getItem('cssberlin_lang') || this.defaultLang;

        // Load both language files
        await Promise.all([
            this.loadTranslations('de'),
            this.loadTranslations('en')
        ]);

        // Apply saved language
        this.setLanguage(savedLang);
    },

    /**
     * Load translation file for a specific language
     */
    async loadTranslations(lang) {
        try {
            const response = await fetch(`i18n/${lang}.json`);
            if (response.ok) {
                this.translations[lang] = await response.json();
                console.log(`✓ Loaded translations for: ${lang}`);
            } else {
                console.warn(`Failed to load translations for: ${lang}`);
            }
        } catch (error) {
            console.error(`Error loading translations for ${lang}:`, error);
        }
    },

    /**
     * Get translation for a key (supports nested keys like "header.search_placeholder")
     */
    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // Fallback to default language
                value = this.translations[this.defaultLang];
                for (const fallbackKey of keys) {
                    if (value && typeof value === 'object' && fallbackKey in value) {
                        value = value[fallbackKey];
                    } else {
                        return key; // Return key if not found
                    }
                }
                break;
            }
        }

        return value || key;
    },

    /**
     * Set the current language and update all translated elements
     */
    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.warn(`Language ${lang} not loaded`);
            return;
        }

        this.currentLang = lang;
        localStorage.setItem('cssberlin_lang', lang);
        document.documentElement.lang = lang;

        // Update language selector buttons
        this.updateLanguageButtons(lang);

        // Translate all elements with data-i18n attribute
        this.translatePage();

        // Dispatch event for other scripts that might need to react
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));

        console.log(`✓ Language switched to: ${lang}`);
    },

    /**
     * Update the language selector buttons' visual state
     */
    updateLanguageButtons(lang) {
        const deBtn = document.getElementById('lang-de');
        const enBtn = document.getElementById('lang-en');

        if (!deBtn || !enBtn) return;

        if (lang === 'de') {
            deBtn.style.background = '#E8854C';
            deBtn.style.color = 'white';
            enBtn.style.background = '#f5f5f5';
            enBtn.style.color = '#333';
        } else {
            enBtn.style.background = '#E8854C';
            enBtn.style.color = 'white';
            deBtn.style.background = '#f5f5f5';
            deBtn.style.color = '#333';
        }
    },

    /**
     * Translate all elements with data-i18n attributes
     */
    translatePage() {
        // Translate text content
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation !== key) {
                element.textContent = translation;
            }
        });

        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            if (translation !== key) {
                element.placeholder = translation;
            }
        });

        // Translate titles (tooltips)
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = this.t(key);
            if (translation !== key) {
                element.title = translation;
            }
        });

        // Translate aria-labels
        document.querySelectorAll('[data-i18n-aria]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria');
            const translation = this.t(key);
            if (translation !== key) {
                element.setAttribute('aria-label', translation);
            }
        });
    }
};

/**
 * Global function to set language (called by language buttons)
 */
function setLanguage(lang) {
    I18n.setLanguage(lang);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    I18n.init();
});

// Export for use in other scripts
window.I18n = I18n;
