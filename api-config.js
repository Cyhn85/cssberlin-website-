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
    const config = {
        // Base URL for REST API
        BASE_URL: isLocal ? 'http://localhost:8000' : 'https://api.cssberlin.de',

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

    // Legacy API_CONFIG object for backward compatibility
    window.API_CONFIG = {
        LOCAL: 'http://localhost:8000',
        PRODUCTION: 'https://api.cssberlin.de',
        current: config.BASE_URL
    };

    // Log configuration on load
    console.log('==========================================');
    console.log('CSS BERLIN API CONFIGURATION');
    console.log('==========================================');
    console.log('[CONFIG] Environment:', config.ENVIRONMENT);
    console.log('[CONFIG] Base URL:', config.BASE_URL);
    console.log('[CONFIG] WebSocket Protocol:', config.WS_PROTOCOL);
    console.log('==========================================');

    // Freeze config to prevent modification
    Object.freeze(window.CSS_BERLIN_API);
    Object.freeze(window.API_CONFIG);

})();
