// ============================================
// CSS BERLIN - CENTRALIZED API CONFIGURATION
// ============================================
// This file MUST be loaded FIRST, before all other scripts
// It provides automatic environment detection for all API calls

(function () {
    'use strict';

    // Detect environment based on hostname
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

    // Configure API endpoints
    const config = {
        // Environment name
        ENVIRONMENT: isLocal ? 'development' : 'production',

        // Base URL for REST API
        // For Production: Use API proxy via Nginx (/api) to avoid CORS issues completely.
        // This ensures cookies and auth headers work correctly across www and non-www.
        BASE_URL: isLocal ? 'http://localhost:8000' : window.location.origin,

        // WebSocket protocol
        WS_PROTOCOL: isLocal ? 'ws' : 'wss',

        // Helper method to build WebSocket URL
        getWebSocketURL: function (path) {
            const wsBase = this.BASE_URL.replace('http://', '').replace('https://', '');
            return `${this.WS_PROTOCOL}://${wsBase}${path}`;
        }
    };

    // Make config globally available
    window.CSS_BERLIN_API = config;

    // Also provide as API_BASE for backward compatibility
    window.API_BASE = config.BASE_URL;

    // Legacy API_CONFIG object for backward compatibility
    window.API_CONFIG = {
        LOCAL: 'http://localhost:8000',
        PRODUCTION: 'http://195.201.146.224:8000',
        current: config.BASE_URL,

        // Some older modules expect API_CONFIG.BASE_URL (e.g. favorites.js)
        BASE_URL: config.BASE_URL
    };

    // ============================
    // GLOBAL SHELL AUTO-LOADER - DISABLED
    // Header V3 is now used directly in HTML
    // ============================
    // NOTE: global-header.js is no longer auto-loaded
    // All pages use header-v3.css and inline header-v3 HTML

    // Log configuration on load
    console.log('==========================================');
    console.log('CSS BERLIN API CONFIGURATION');
    console.log('==========================================');
    console.log('[CONFIG] Environment:', config.ENVIRONMENT);
    console.log('[CONFIG] Base URL:', config.BASE_URL);
    console.log('[CONFIG] WebSocket Protocol:', config.WS_PROTOCOL);
    console.log('[CONFIG] Global Header: DISABLED (using header-v3)');
    console.log('==========================================');

    // Freeze config to prevent modification
    Object.freeze(window.CSS_BERLIN_API);
    Object.freeze(window.API_CONFIG);

})();
