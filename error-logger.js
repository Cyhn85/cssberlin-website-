/**
 * CSS Berlin - Error Logger System
 * Hataları yakalayıp localStorage'a kaydeder
 * 2026 Modern Error Tracking
 */

(function() {
    'use strict';

    const MAX_LOGS = 100;
    const STORAGE_KEY = 'cssberlin_error_logs';

    // Global error handler
    window.onerror = function(message, source, lineno, colno, error) {
        logError({
            type: 'error',
            message: message,
            source: source,
            line: lineno,
            column: colno,
            stack: error?.stack || null
        });
        return false; // Allow default error handling
    };

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(event) {
        logError({
            type: 'promise_rejection',
            message: event.reason?.message || String(event.reason),
            stack: event.reason?.stack || null
        });
    });

    // Log error to localStorage
    function logError(errorData) {
        const logEntry = {
            ...errorData,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };

        try {
            const logs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            logs.push(logEntry);

            // Keep only last MAX_LOGS entries
            while (logs.length > MAX_LOGS) {
                logs.shift();
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));

            // Console output for debugging
            console.error('[ERROR LOG]', logEntry);

        } catch (e) {
            // If localStorage fails, just console log
            console.error('[ERROR LOG - Storage Failed]', logEntry, e);
        }
    }

    // Public API
    window.errorLogger = {
        // Get all logs
        getLogs: function() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            } catch (e) {
                return [];
            }
        },

        // Clear all logs
        clearLogs: function() {
            localStorage.removeItem(STORAGE_KEY);
            console.log('[ERROR LOG] Logs cleared');
        },

        // Manual log entry
        log: function(message, data = {}) {
            logError({
                type: 'manual',
                message: message,
                data: data
            });
        },

        // Export logs as JSON file
        exportLogs: function() {
            const logs = this.getLogs();
            const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cssberlin_errors_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        },

        // Get error count
        getCount: function() {
            return this.getLogs().length;
        },

        // Get recent errors (last N)
        getRecent: function(count = 10) {
            return this.getLogs().slice(-count);
        }
    };

    console.log('[ERROR LOG] Error logger initialized');
})();
