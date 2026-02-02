// ============================================
// CSS BERLIN - CENTRALIZED API CONFIGURATION
// ============================================
// This file MUST be loaded FIRST, before all other scripts
// It provides automatic environment detection for all API calls

(function() {
    'use strict';

    // Detect environment based on hostname
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

    // Configure API endpoints
    // CHANGED: Ports updated to 8001 to avoid conflict with Tatanga
    const config = {
        // Base URL for REST API
        BASE_URL: isLocal ? 'http://localhost:8001' : 'http://195.201.146.224:8001',

        // WebSocket protocol
        WS_PROTOCOL: isLocal ? 'ws' : 'wss',

        // Environment name
        ENVIRONMENT: isLocal ? 'development' : 'production',

        // Helper method to build WebSocket URL
        getWebSocketURL: function(path) {
            const wsBase = this.BASE_URL.replace('http://', '').replace('https://','');
            return `${this.WS_PROTOCOL}://${wsBase}${path}`;
        }
    };

    // Make config globally available
    window.CSS_BERLIN_API = config;

    // Also provide as API_BASE for backward compatibility
    window.API_BASE = config.BASE_URL;

    // Legacy API_CONFIG object for backward compatibility + Helper functions for auth.js
    window.API_CONFIG = {
        LOCAL: 'http://localhost:8001',
        PRODUCTION: 'http://195.201.146.224:8001',
        current: config.BASE_URL,
        BASE_URL: config.BASE_URL,

        // YENİ EKLENDİ: auth.js'in kullandığı yardımcı fonksiyonlar
        getUrl: (endpoint) => {
            return `${config.BASE_URL}${endpoint}`;
        },
        getHeaders: () => {
            const token = localStorage.getItem('auth_token');
            return {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            };
        }
    };

    // ============================
    // GLOBAL SHELL AUTO-LOADER
    // ============================
    // Goal: Standardize header/footer across ALL pages without editing every HTML file.
    // This loads CSS + GlobalHeader injector if not already present.
    (function autoLoadShell() {
        try {
            const doc = document;

            // Resolve asset URLs relative to the script tag that loaded api-config.js.
            const current = doc.currentScript || Array.from(doc.scripts).find(s => (s.src || '').includes('api-config.js'));
            const baseURL = (current && current.src) ? new URL('.', current.src).toString() : new URL('.', window.location.href).toString();

            function resolve(assetPath) {
                return new URL(assetPath, baseURL).toString();
            }

            function hasStylesheet(fileName) {
                const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
                return links.some((l) => {
                    const raw = (l.getAttribute('href') || '').toLowerCase();
                    const abs = (l.href || '').toLowerCase();
                    return raw.includes(fileName.toLowerCase()) || abs.includes('/' + fileName.toLowerCase());
                });
            }

            function hasScript(fileName) {
                const scripts = Array.from(doc.querySelectorAll('script[src]'));
                return scripts.some((s) => {
                    const raw = (s.getAttribute('src') || '').toLowerCase();
                    const abs = (s.src || '').toLowerCase();
                    return raw.includes(fileName.toLowerCase()) || abs.includes('/' + fileName.toLowerCase());
                });
            }

            function ensureLink(fileName) {
                if (hasStylesheet(fileName)) return;
                const l = doc.createElement('link');
                l.rel = 'stylesheet';
                l.href = resolve(fileName);
                doc.head.appendChild(l);
            }

            function ensureScript(fileName) {
                if (hasScript(fileName)) return;
                const s = doc.createElement('script');
                s.src = resolve(fileName);
                s.defer = true;
                doc.head.appendChild(s);
            }

            // Keep sizes consistent by reusing homepage assets
            ensureLink('header-v2.css');
            ensureLink('footer-kleinanzeigen.css');
            ensureLink('toast.css');

            // Inject standardized header/footer + tickers
            ensureScript('global-header.js');
        } catch (e) {
            // no-op
        }
    })();

    // Log configuration on load
    console.log('==========================================');
    console.log('CSS BERLIN API CONFIGURATION (UPDATED)');
    console.log('==========================================');
    console.log('[CONFIG] Environment:', config.ENVIRONMENT);
    console.log('[CONFIG] Base URL:', config.BASE_URL);
    console.log('[CONFIG] Port:', '8001');
    console.log('==========================================');

    // Freeze config to prevent modification
    Object.freeze(window.CSS_BERLIN_API);
    // window.API_CONFIG is kept mutable for now just in case
})();