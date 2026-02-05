// ═════════════════════════════════════════════════════════════════
// CSS Berlin — Auth Modal v2 (Glassmorphism)
// Modern login/register modal with OAuth + Magic Link
// ═════════════════════════════════════════════════════════════════

(function () {
    'use strict';

    const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8000'
        : '';

    // ─── State ───────────────────────────────────────────────────
    let currentMode = 'login'; // 'login' | 'register'

    // ─── Create Modal HTML ───────────────────────────────────────
    function createModalHTML() {
        const html = `
            <div class="auth-modal-v2-overlay" id="authModalV2Overlay">
                <div class="auth-modal-v2">
                    <button class="auth-modal-v2-close" id="authModalV2Close" title="Schließen">×</button>

                    <!-- Header -->
                    <div class="auth-modal-v2-header">
                        <div class="auth-modal-v2-logo">CSS<span>berlin</span></div>
                        <div class="auth-modal-v2-subtitle">Climate Smart Solutions</div>
                    </div>

                    <!-- Tabs -->
                    <div class="auth-modal-v2-tabs">
                        <button class="auth-modal-v2-tab active" id="authTabLogin">Anmelden</button>
                        <button class="auth-modal-v2-tab" id="authTabRegister">Registrieren</button>
                    </div>

                    <!-- Form Container -->
                    <div class="auth-modal-v2-form">
                        <div class="auth-modal-v2-message" id="authMessage"></div>

                        <!-- LOGIN VIEW -->
                        <div id="loginView" class="auth-view">
                            <!-- OAuth Buttons (Login Only) -->
                            <div class="auth-modal-v2-oauth">
                                <button class="auth-modal-v2-oauth-btn" onclick="window.authModalV2.loginWithGoogle()">
                                    <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                    Mit Google anmelden
                                </button>
                                <button class="auth-modal-v2-oauth-btn" onclick="window.authModalV2.loginWithApple()">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                                    Mit Apple anmelden
                                </button>
                                <button class="auth-modal-v2-oauth-btn auth-modal-v2-magic-link-btn" onclick="window.authModalV2.loginWithMagicLink()">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M22 2L11 13"></path>
                                        <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                                    </svg>
                                    Mit Magic Link anmelden
                                </button>
                            </div>

                            <!-- Divider -->
                            <div class="auth-modal-v2-divider">oder per E-Mail</div>

                            <!-- Login Form -->
                            <form id="loginForm">
                                <div class="auth-modal-v2-field">
                                    <label class="auth-modal-v2-label" for="loginEmail">E-Mail</label>
                                    <input type="email" class="auth-modal-v2-input" id="loginEmail" placeholder="deine@email.de" required>
                                </div>

                                <div class="auth-modal-v2-field">
                                    <label class="auth-modal-v2-label" for="loginPassword">Passwort</label>
                                    <input type="password" class="auth-modal-v2-input" id="loginPassword" placeholder="••••••••" required>
                                </div>

                                <button type="submit" class="auth-modal-v2-submit">
                                    Anmelden
                                </button>
                            </form>
                        </div>

                        <!-- REGISTER VIEW -->
                        <div id="registerView" class="auth-view" style="display:none;">
                            <form id="registerForm">
                                <div class="auth-modal-v2-field">
                                    <label class="auth-modal-v2-label" for="registerName">Vollständiger Name</label>
                                    <input type="text" class="auth-modal-v2-input" id="registerName" placeholder="Vorname Nachname" required>
                                </div>

                                <div class="auth-modal-v2-field">
                                    <label class="auth-modal-v2-label" for="registerEmail">E-Mail</label>
                                    <input type="email" class="auth-modal-v2-input" id="registerEmail" placeholder="deine@email.de" required>
                                </div>

                                <div class="auth-modal-v2-field">
                                    <label class="auth-modal-v2-label" for="registerPassword">Passwort</label>
                                    <input type="password" class="auth-modal-v2-input" id="registerPassword" placeholder="Mindestens 8 Zeichen" required minlength="8">
                                </div>

                                <div class="auth-modal-v2-field">
                                    <label class="auth-modal-v2-label" for="registerPasswordConfirm">Passwort bestätigen</label>
                                    <input type="password" class="auth-modal-v2-input" id="registerPasswordConfirm" placeholder="Passwort wiederholen" required>
                                </div>

                                <button type="submit" class="auth-modal-v2-submit">
                                    Registrieren
                                </button>
                            </form>
                        </div>

                        <!-- Footer -->
                        <div class="auth-modal-v2-footer">
                            <span id="authFooterText">Noch kein Konto?</span>
                            <a href="#" id="authFooterLink">Jetzt registrieren</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
    }

    // ─── Switch Mode ─────────────────────────────────────────────
    function switchMode(mode) {
        currentMode = mode;

        const tabLogin = document.getElementById('authTabLogin');
        const tabRegister = document.getElementById('authTabRegister');
        const loginView = document.getElementById('loginView');
        const registerView = document.getElementById('registerView');
        const footerText = document.getElementById('authFooterText');
        const footerLink = document.getElementById('authFooterLink');

        if (mode === 'login') {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            loginView.style.display = 'block';
            registerView.style.display = 'none';
            footerText.textContent = 'Noch kein Konto?';
            footerLink.textContent = 'Jetzt registrieren';
        } else {
            tabLogin.classList.remove('active');
            tabRegister.classList.add('active');
            loginView.style.display = 'none';
            registerView.style.display = 'block';
            footerText.textContent = 'Schon registriert?';
            footerLink.textContent = 'Jetzt anmelden';
        }

        hideMessage();
    }

    // ─── Open/Close ──────────────────────────────────────────────
    function open(mode = 'login') {
        switchMode(mode);
        const overlay = document.getElementById('authModalV2Overlay');
        if (overlay) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Auto-focus on first input after modal opens (standard UX)
            setTimeout(() => {
                if (mode === 'login') {
                    document.getElementById('loginEmail')?.focus();
                } else {
                    document.getElementById('registerName')?.focus();
                }
            }, 300);
        }
    }

    function close() {
        const overlay = document.getElementById('authModalV2Overlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        resetForms();
    }

    // ─── Message ─────────────────────────────────────────────────
    function showMessage(text, type = 'error') {
        const msg = document.getElementById('authMessage');
        if (msg) {
            msg.textContent = text;
            msg.className = `auth-modal-v2-message ${type} active`;
        }
    }

    function hideMessage() {
        const msg = document.getElementById('authMessage');
        if (msg) msg.classList.remove('active');
    }

    // ─── Login Submit ────────────────────────────────────────────
    async function handleLoginSubmit(e) {
        e.preventDefault();
        hideMessage();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        if (!email || !password) {
            showMessage('Bitte alle Felder ausfüllen', 'error');
            return;
        }

        submitBtn.classList.add('loading');

        try {
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Fehler bei der Anmeldung');
            }

            showMessage('Erfolgreich angemeldet!', 'success');
            localStorage.setItem('cssberlin_user', JSON.stringify(data.user || data));
            setTimeout(() => {
                close();
                window.location.reload();
            }, 1500);

        } catch (error) {
            showMessage(error.message, 'error');
        } finally {
            submitBtn.classList.remove('loading');
        }
    }

    // ─── Register Submit ─────────────────────────────────────────
    async function handleRegisterSubmit(e) {
        e.preventDefault();
        hideMessage();

        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        if (!name || !email || !password || !passwordConfirm) {
            showMessage('Bitte alle Felder ausfüllen', 'error');
            return;
        }

        if (password !== passwordConfirm) {
            showMessage('Passwörter stimmen nicht überein', 'error');
            return;
        }

        if (password.length < 8) {
            showMessage('Passwort muss mindestens 8 Zeichen lang sein', 'error');
            return;
        }

        submitBtn.classList.add('loading');

        try {
            const response = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    firstName: name.split(' ')[0] || '',
                    lastName: name.split(' ').slice(1).join(' ') || ''
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Fehler bei der Registrierung');
            }

            showMessage('Registrierung erfolgreich!', 'success');
            localStorage.setItem('cssberlin_user', JSON.stringify(data.user || data));
            setTimeout(() => {
                close();
                window.location.reload();
            }, 1500);

        } catch (error) {
            showMessage(error.message, 'error');
        } finally {
            submitBtn.classList.remove('loading');
        }
    }

    // ─── Reset Forms ─────────────────────────────────────────────
    function resetForms() {
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('registerName').value = '';
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('registerPasswordConfirm').value = '';
        hideMessage();
    }

    // ─── OAuth ───────────────────────────────────────────────────
    function loginWithGoogle() {
        if (window.auth && typeof window.auth.loginWithGoogle === 'function') {
            window.auth.loginWithGoogle();
        } else {
            showMessage('Google Login wird vorbereitet...', 'success');
            setTimeout(() => {
                window.location.href = `${API_BASE}/api/auth/google`;
            }, 500);
        }
    }

    function loginWithApple() {
        showMessage('Apple Login kommt bald', 'error');
    }

    function loginWithMagicLink() {
        const email = document.getElementById('loginEmail').value;
        if (!email) {
            showMessage('Bitte geben Sie Ihre E-Mail-Adresse ein', 'error');
            document.getElementById('loginEmail').focus();
            return;
        }

        showMessage('Magic Link wird gesendet...', 'success');

        fetch(`${API_BASE}/api/auth/magic-link`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
        .then(response => response.json())
        .then(data => {
            showMessage('Magic Link wurde an Ihre E-Mail gesendet! Prüfen Sie Ihren Posteingang.', 'success');
        })
        .catch(error => {
            showMessage('Fehler beim Senden des Magic Links', 'error');
        });
    }

    // ─── Event Listeners ─────────────────────────────────────────
    function attachEvents() {
        // Close button
        document.getElementById('authModalV2Close').addEventListener('click', close);

        // Overlay click
        document.getElementById('authModalV2Overlay').addEventListener('click', (e) => {
            if (e.target.id === 'authModalV2Overlay') close();
        });

        // Tabs
        document.getElementById('authTabLogin').addEventListener('click', () => switchMode('login'));
        document.getElementById('authTabRegister').addEventListener('click', () => switchMode('register'));

        // Footer link
        document.getElementById('authFooterLink').addEventListener('click', (e) => {
            e.preventDefault();
            switchMode(currentMode === 'login' ? 'register' : 'login');
        });

        // Form submits
        document.getElementById('loginForm').addEventListener('submit', handleLoginSubmit);
        document.getElementById('registerForm').addEventListener('submit', handleRegisterSubmit);

        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('authModalV2Overlay').classList.contains('active')) {
                close();
            }
        });
    }

    // ─── Init ────────────────────────────────────────────────────
    function init() {
        createModalHTML();
        attachEvents();
        console.log('[Auth Modal v2] Initialized - Separate Login/Register views');
    }

    // ─── Public API ──────────────────────────────────────────────
    window.authModalV2 = {
        open,
        close,
        switchMode,
        loginWithGoogle,
        loginWithApple,
        loginWithMagicLink
    };

    // ─── Auto-Init ───────────────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
