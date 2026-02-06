// ═══════════════════════════════════════════════════════════
// CSS BERLIN - PRODUCTION AUTH HANDLER
// NO MOCKS | NO DEMOS | REAL SESSION MANAGEMENT
// ═══════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ─── CONFIGURATION ───────────────────────────────────────
    const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8000'
        : 'https://api.cssberlin.de';  // Production API

    const TOKEN_KEY = 'cssberlin_auth_token';
    const USER_KEY = 'cssberlin_user';

    console.log(`[AUTH] API Base: ${API_BASE}`);

    // ─── TOKEN MANAGEMENT ────────────────────────────────────
    class TokenManager {
        static save(token) {
            if (!token) {
                console.error('[AUTH] Cannot save empty token');
                return false;
            }
            try {
                localStorage.setItem(TOKEN_KEY, token);
                console.log('[AUTH] Token saved successfully');
                return true;
            } catch (e) {
                console.error('[AUTH] Failed to save token:', e);
                return false;
            }
        }

        static get() {
            return localStorage.getItem(TOKEN_KEY);
        }

        static remove() {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            console.log('[AUTH] Token removed');
        }

        static isValid() {
            const token = this.get();
            if (!token) return false;

            try {
                // Decode JWT (without verification - backend will verify)
                const payload = JSON.parse(atob(token.split('.')[1]));
                const exp = payload.exp * 1000; // Convert to milliseconds
                const now = Date.now();

                if (now >= exp) {
                    console.log('[AUTH] Token expired');
                    this.remove();
                    return false;
                }

                return true;
            } catch (e) {
                console.error('[AUTH] Invalid token format:', e);
                this.remove();
                return false;
            }
        }
    }

    // ─── USER MANAGEMENT ─────────────────────────────────────
    class UserManager {
        static save(userData) {
            try {
                localStorage.setItem(USER_KEY, JSON.stringify(userData));
                console.log('[AUTH] User data saved:', userData);
                return true;
            } catch (e) {
                console.error('[AUTH] Failed to save user data:', e);
                return false;
            }
        }

        static get() {
            try {
                const data = localStorage.getItem(USER_KEY);
                return data ? JSON.parse(data) : null;
            } catch (e) {
                console.error('[AUTH] Failed to parse user data:', e);
                return null;
            }
        }

        static remove() {
            localStorage.removeItem(USER_KEY);
        }
    }

    // ─── API CLIENT ──────────────────────────────────────────
    class AuthAPI {
        static async request(endpoint, options = {}) {
            const url = `${API_BASE}${endpoint}`;
            const token = TokenManager.get();

            const headers = {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers
            };

            try {
                const response = await fetch(url, {
                    ...options,
                    headers
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(data.detail || `HTTP ${response.status}: ${response.statusText}`);
                }

                return { success: true, data };
            } catch (error) {
                console.error(`[AUTH API] ${endpoint}:`, error);
                return { success: false, error: error.message };
            }
        }

        static async login(email, password) {
            return this.request('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
        }

        static async register(email, password, firstName, lastName) {
            return this.request('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, password, firstName, lastName })
            });
        }

        static async sendMagicLink(email) {
            return this.request('/api/auth/magic-link', {
                method: 'POST',
                body: JSON.stringify({ email })
            });
        }

        static async sendPasswordReset(email) {
            return this.request('/api/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email })
            });
        }

        static async resetPassword(token, newPassword) {
            return this.request('/api/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ token, new_password: newPassword })
            });
        }

        static async getMe() {
            return this.request('/api/auth/me');
        }
    }

    // ─── MAIN AUTH HANDLER ───────────────────────────────────
    class CSSAuth {
        constructor() {
            this.currentUser = null;
            this.isAuthenticated = false;
            this.init();
        }

        async init() {
            console.log('[AUTH] Initializing...');

            // Check for auth token in URL (from OAuth redirect)
            this.handleOAuthCallback();

            // Restore session if token exists
            if (TokenManager.isValid()) {
                await this.restoreSession();
            }

            this.updateUI();
        }

        handleOAuthCallback() {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('auth_token');
            const userName = params.get('user_name');
            const error = params.get('error');

            if (error) {
                this.showError(`Login fehlgeschlagen: ${error}`);
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
                return;
            }

            if (token) {
                console.log('[AUTH] OAuth callback detected');
                TokenManager.save(token);

                if (userName) {
                    UserManager.save({ user_name: userName });
                }

                this.isAuthenticated = true;
                this.currentUser = { user_name: userName };

                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);

                this.showSuccess(`Willkommen zurück, ${userName}!`);
                this.updateUI();

                // Reload to update page state
                setTimeout(() => window.location.reload(), 1500);
            }
        }

        async restoreSession() {
            console.log('[AUTH] Restoring session...');

            const result = await AuthAPI.getMe();

            if (result.success) {
                this.isAuthenticated = true;
                this.currentUser = result.data;
                UserManager.save(result.data);
                console.log('[AUTH] Session restored:', this.currentUser);
            } else {
                console.log('[AUTH] Session invalid, clearing...');
                this.logout();
            }
        }

        async login(email, password) {
            console.log('[AUTH] Logging in:', email);

            const result = await AuthAPI.login(email, password);

            if (result.success) {
                const { access_token, user_name } = result.data;

                TokenManager.save(access_token);
                UserManager.save({ user_name });

                this.isAuthenticated = true;
                this.currentUser = { user_name };

                this.showSuccess(`Willkommen zurück, ${user_name}!`);
                this.updateUI();

                return { success: true };
            } else {
                this.showError(result.error || 'Login fehlgeschlagen');
                return { success: false, error: result.error };
            }
        }

        async register(email, password, firstName, lastName) {
            console.log('[AUTH] Registering:', email);

            const result = await AuthAPI.register(email, password, firstName, lastName);

            if (result.success) {
                const { access_token, user_name } = result.data;

                TokenManager.save(access_token);
                UserManager.save({ user_name });

                this.isAuthenticated = true;
                this.currentUser = { user_name };

                this.showSuccess(`Willkommen, ${user_name}!`);
                this.updateUI();

                return { success: true };
            } else {
                this.showError(result.error || 'Registrierung fehlgeschlagen');
                return { success: false, error: result.error };
            }
        }

        async sendMagicLink(email) {
            console.log('[AUTH] Sending magic link to:', email);

            const result = await AuthAPI.sendMagicLink(email);

            if (result.success) {
                this.showSuccess('Magic Link wurde gesendet! Bitte überprüfen Sie Ihre E-Mails.');
                return { success: true };
            } else {
                this.showError(result.error || 'Magic Link konnte nicht gesendet werden');
                return { success: false, error: result.error };
            }
        }

        async sendPasswordReset(email) {
            console.log('[AUTH] Sending password reset to:', email);

            const result = await AuthAPI.sendPasswordReset(email);

            if (result.success) {
                this.showSuccess('Reset-Link wurde gesendet! Bitte überprüfen Sie Ihre E-Mails.');
                return { success: true };
            } else {
                this.showError(result.error || 'Reset-Link konnte nicht gesendet werden');
                return { success: false, error: result.error };
            }
        }

        logout() {
            console.log('[AUTH] Logging out');

            TokenManager.remove();
            UserManager.remove();

            this.isAuthenticated = false;
            this.currentUser = null;

            this.updateUI();
            this.showSuccess('Erfolgreich abgemeldet');

            // Reload to clear any protected content
            setTimeout(() => window.location.reload(), 1000);
        }

        loginWithGoogle() {
            console.log('[AUTH] Redirecting to Google OAuth...');
            window.location.href = `${API_BASE}/api/auth/google`;
        }

        loginWithApple() {
            this.showError('Apple Sign-In ist derzeit nicht verfügbar. Bitte verwenden Sie Google oder Magic Link.');
        }

        updateUI() {
            // Update login button
            const loginBtn = document.querySelector('[onclick*="authModalV3.open"]') ||
                document.querySelector('[onclick*="authGate.open"]');

            if (loginBtn) {
                if (this.isAuthenticated && this.currentUser) {
                    loginBtn.textContent = this.currentUser.user_name || 'Mein Konto';
                    loginBtn.onclick = () => this.showAccountMenu();
                } else {
                    loginBtn.textContent = 'Anmelden';
                }
            }

            // Dispatch event for other components
            window.dispatchEvent(new CustomEvent('auth-state-changed', {
                detail: {
                    isAuthenticated: this.isAuthenticated,
                    user: this.currentUser
                }
            }));
        }

        showAccountMenu() {
            // Simple account menu
            const menu = confirm(`Angemeldet als: ${this.currentUser.user_name}\n\nMöchten Sie sich abmelden?`);
            if (menu) {
                this.logout();
            }
        }

        showSuccess(message) {
            console.log('[AUTH SUCCESS]', message);
            // Use existing toast system if available
            if (window.toast && typeof window.toast.success === 'function') {
                window.toast.success('Erfolg', message);
            } else {
                alert(message);
            }
        }

        showError(message) {
            console.error('[AUTH ERROR]', message);
            // Use existing toast system if available
            if (window.toast && typeof window.toast.error === 'function') {
                window.toast.error('Fehler', message);
            } else {
                alert('Fehler: ' + message);
            }
        }

        // Public API
        requireAuth(action, callback) {
            if (this.isAuthenticated) {
                if (callback) callback();
                return true;
            } else {
                this.showError(`Bitte melden Sie sich an, um ${action} zu können.`);
                // Open auth modal if available
                if (window.authModalV3 && typeof window.authModalV3.open === 'function') {
                    window.authModalV3.open('login');
                }
                return false;
            }
        }
    }

    // ─── INITIALIZE ──────────────────────────────────────────
    window.CSSAuth = new CSSAuth();

    console.log('[AUTH] Handler initialized');
    console.log('[AUTH] Authenticated:', window.CSSAuth.isAuthenticated);
    console.log('[AUTH] User:', window.CSSAuth.currentUser);

})();
