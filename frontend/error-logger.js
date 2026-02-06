/**
 * CSS Berlin - Error Logger System (Watchtower)
 * Catches errors, saves to localStorage, and sends to backend
 * 2026 Modern Error Tracking
 */

(function() {
    'use strict';

    const MAX_LOGS = 100;
    const STORAGE_KEY = 'cssberlin_error_logs';

    // Get API base URL from config or default
    function getApiBase() {
        if (typeof window.API_BASE !== 'undefined') {
            return window.API_BASE;
        }
        // Fallback: detect environment
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:8000';
        }
        return 'https://api.cssberlin.de'; // Production API
    }

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

    // Send error to backend API
    async function sendToBackend(logEntry) {
        try {
            const apiBase = getApiBase();
            const response = await fetch(`${apiBase}/api/errors/report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(logEntry)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('[ERROR LOG] Sent to backend:', result.error_id);
                return result;
            } else {
                console.warn('[ERROR LOG] Backend rejected:', response.status);
            }
        } catch (e) {
            // Silently fail - don't cause more errors
            console.warn('[ERROR LOG] Failed to send to backend:', e.message);
        }
        return null;
    }

    // Log error to localStorage AND send to backend
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

        // 1. Save to localStorage (always works, even offline)
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

        // 2. Send to backend (async, non-blocking)
        sendToBackend(logEntry);
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
        },

        // Manually send an error to backend
        sendToBackend: function(message, data = {}) {
            const logEntry = {
                type: 'manual',
                message: message,
                data: data,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent
            };
            return sendToBackend(logEntry);
        },

        // Get backend error stats
        getBackendStats: async function() {
            try {
                const apiBase = getApiBase();
                const response = await fetch(`${apiBase}/api/errors/stats`);
                if (response.ok) {
                    return await response.json();
                }
            } catch (e) {
                console.warn('[ERROR LOG] Failed to get stats:', e.message);
            }
            return null;
        }
    };

    console.log('[ERROR LOG] Watchtower Error Logger initialized (localStorage + Backend)');
})();
