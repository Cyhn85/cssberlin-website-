// ═══════════════════════════════════════════════════════════════
// CSS Berlin — Authentication Handler
// JWT Token Management, LocalStorage, User Session
// ═══════════════════════════════════════════════════════════════

(function () {
    'use strict';

    // Smart environment detection
    const isLocalDevelopment = window.location.hostname === 'localhost'
        || window.location.hostname === '127.0.0.1'
        || window.location.hostname === ''
        || window.location.protocol === 'file:';

    const API_BASE = isLocalDevelopment
        ? 'http://localhost:8000'  // Local development
        : 'https://cssberlin-backend.up.railway.app';  // Production (Railway/Render)

    // ─── Token Management ───────────────────────────────────────
    function saveToken(token) {
        localStorage.setItem('cssberlin_auth_token', token);
        localStorage.setItem('cssberlin_token_timestamp', Date.now().toString());
    }

    function getToken() {
        return localStorage.getItem('cssberlin_auth_token');
    }

    function removeToken() {
        localStorage.removeItem('cssberlin_auth_token');
        localStorage.removeItem('cssberlin_token_timestamp');
        localStorage.removeItem('cssberlin_user');
    }

    function isTokenExpired() {
        const timestamp = localStorage.getItem('cssberlin_token_timestamp');
        if (!timestamp) return true;

        // Token expires after 7 days
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        return (Date.now() - parseInt(timestamp)) > sevenDays;
    }

    // ─── User Management ────────────────────────────────────────
    function saveUser(user) {
        localStorage.setItem('cssberlin_user', JSON.stringify(user));
    }

    function getUser() {
        const userStr = localStorage.getItem('cssberlin_user');
        return userStr ? JSON.parse(userStr) : null;
    }

    function isLoggedIn() {
        const token = getToken();
        return token && !isTokenExpired();
    }

    // ─── Fetch User Profile ─────────────────────────────────────
    async function fetchUserProfile() {
        const token = getToken();
        if (!token) return null;

        try {
            const response = await fetch(`${API_BASE}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }

            const user = await response.json();
            saveUser(user);
            return user;

        } catch (error) {
            console.error('[Auth] Profile fetch failed:', error);
            // If token is invalid, log out
            if (error.message.includes('401') || error.message.includes('403')) {
                logout();
            }
            return null;
        }
    }

    // ─── Logout ─────────────────────────────────────────────────
    function logout() {
        removeToken();

        // Show logout message
        showNotification('Du wurdest abgemeldet.', 'info');

        // Redirect to homepage after 1 second
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    }

    // ─── Auto-Login from URL (OAuth/Magic Link Redirect) ────────
    function handleAuthRedirect() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('auth_token');
        const userName = urlParams.get('user_name');

        if (token) {
            saveToken(token);

            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);

            // Fetch full user profile
            fetchUserProfile().then(user => {
                if (user) {
                    updateUIForLoggedInUser(user);
                    showNotification(`Willkommen zurück, ${user.first_name || userName || 'User'}! 🎉`, 'success');
                }
            });
        }
    }

    // ─── Update UI for Logged In User ───────────────────────────
    function updateUIForLoggedInUser(user) {
        // Update Anmelden button to show user name
        const anmeldenBtn = document.querySelector('.btn-anmelden');
        if (anmeldenBtn) {
            anmeldenBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
                ${user.first_name || 'Profil'}
            `;
            anmeldenBtn.onclick = () => {
                window.location.href = '/profil.html';
            };
        }
    }

    // ─── Notification System ────────────────────────────────────
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.getElementById('authNotification');
        if (existing) existing.remove();

        // Create notification
        const notification = document.createElement('div');
        notification.id = 'authNotification';
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : '#3b82f6'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            font-size: 14px;
            z-index: 10000;
            animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            max-width: 350px;
        `;
        notification.textContent = message;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // ─── Protected Routes ───────────────────────────────────────
    function requireAuth() {
        if (!isLoggedIn()) {
            showNotification('Bitte melde dich an, um fortzufahren.', 'error');
            setTimeout(() => {
                window.location.href = '/?login=required';
            }, 1500);
            return false;
        }
        return true;
    }

    // ─── Initialize ─────────────────────────────────────────────
    function init() {
        // Handle OAuth/Magic Link redirect
        handleAuthRedirect();

        // Check if user is logged in
        if (isLoggedIn()) {
            const user = getUser();
            if (user) {
                updateUIForLoggedInUser(user);
            } else {
                // Fetch user profile if not cached
                fetchUserProfile().then(user => {
                    if (user) updateUIForLoggedInUser(user);
                });
            }
        }

        // Check for password reset success
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('reset') === 'success') {
            showNotification('Passwort erfolgreich zurückgesetzt! Du kannst dich jetzt anmelden.', 'success');
            // Open login modal if available
            setTimeout(() => {
                if (window.authModalV3) {
                    window.authModalV3.open('login');
                }
            }, 1500);
        }

        console.log('[Auth Handler] Initialized', isLoggedIn() ? '✅ Logged In' : '❌ Not Logged In');
    }

    // ─── Public API ─────────────────────────────────────────────
    window.CSSAuth = {
        saveToken,
        getToken,
        removeToken,
        isLoggedIn,
        getUser,
        saveUser,
        fetchUserProfile,
        logout,
        requireAuth,
        showNotification
    };

    // ─── Auto-Initialize ────────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
