// ═════════════════════════════════════════════════════════════════
// CSS Berlin — Auth Modal v3 (Ultra Compact)
// Görsel 2 style: Minimal, ergonomic, single-screen
// ═════════════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ALWAYS use localhost for development
    const API_BASE = 'http://localhost:8000';

    let currentMode = 'login';

    // ─── Create Modal HTML (Görsel 2 Style) ─────────────────────
    function createModalHTML() {
        const html = `
            <div class="auth-modal-v3-overlay" id="authModalV3Overlay">
                <div class="auth-modal-v3">
                    <!-- Header -->
                    <div class="auth-modal-v3-header">
                        <h2 class="auth-modal-v3-title" id="authTitle">Willkommen zurück</h2>
                        <p class="auth-modal-v3-subtitle" id="authSubtitle">Bitte melde dich an, um fortzufahren.</p>
                    </div>

                    <!-- Tabs -->
                    <div class="auth-modal-v3-tabs">
                        <button class="auth-modal-v3-tab active" id="authTabLogin">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
                            </svg>
                            Anmelden
                        </button>
                        <button class="auth-modal-v3-tab magic-link" id="authTabMagicLink">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                            Magic Link
                        </button>
                        <button class="auth-modal-v3-tab" id="authTabRegister">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="8.5" cy="7" r="4"/>
                                <line x1="20" y1="8" x2="20" y2="14"/>
                                <line x1="23" y1="11" x2="17" y2="11"/>
                            </svg>
                            Register
                        </button>
                    </div>

                    <!-- Message -->
                    <div class="auth-modal-v3-form">
                        <div class="auth-modal-v3-message" id="authMessage"></div>

                        <!-- LOGIN VIEW -->
                        <div id="loginView" class="auth-view">
                            <form id="loginForm">
                                <div class="auth-modal-v3-field">
                                    <input type="email" class="auth-modal-v3-input" id="loginEmail" placeholder="E-Mail Adresse" required autofocus>
                                </div>

                                <div class="auth-modal-v3-field">
                                    <input type="password" class="auth-modal-v3-input" id="loginPassword" placeholder="Passwort" required>
                                </div>

                                <div class="auth-modal-v3-forgot">
                                    <a href="#" onclick="window.authModalV3.switchMode('forgot'); return false;">Passwort vergessen?</a>
                                </div>

                                <button type="submit" class="auth-modal-v3-submit">
                                    <span>Einloggen</span>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                        <line x1="5" y1="12" x2="19" y2="12"/>
                                        <polyline points="12 5 19 12 12 19"/>
                                    </svg>
                                </button>
                            </form>

                            <!-- Divider -->
                            <div class="auth-modal-v3-divider">oder weiter mit</div>

                            <!-- Social Icons -->
                            <div class="auth-modal-v3-socials">
                                <button class="auth-modal-v3-social-btn" onclick="window.authModalV3.loginWithGoogle()" title="Mit Google">
                                    <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                </button>
                                <button class="auth-modal-v3-social-btn" onclick="window.authModalV3.loginWithApple()" title="Mit Apple">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000">
                                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- MAGIC LINK VIEW -->
                        <div id="magicLinkView" class="auth-view" style="display:none;">
                            <form id="magicLinkForm">
                                <div class="auth-modal-v3-field">
                                    <input type="email" class="auth-modal-v3-input" id="magicLinkEmail" placeholder="E-Mail Adresse" required>
                                </div>

                                <button type="submit" class="auth-modal-v3-submit">
                                    <span>Magic Link Senden</span>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                </button>
                            </form>
                        </div>

                        <!-- REGISTER VIEW -->
                        <div id="registerView" class="auth-view" style="display:none;">
                            <form id="registerForm">
                                <div class="auth-modal-v3-field">
                                    <input type="text" class="auth-modal-v3-input" id="registerName" placeholder="Vollständiger Name" required>
                                </div>

                                <div class="auth-modal-v3-field">
                                    <input type="email" class="auth-modal-v3-input" id="registerEmail" placeholder="E-Mail Adresse" required>
                                </div>

                                <div class="auth-modal-v3-field">
                                    <input type="password" class="auth-modal-v3-input" id="registerPassword" placeholder="Passwort (mind. 8 Zeichen)" required minlength="8">
                                </div>

                                <div class="auth-modal-v3-field">
                                    <input type="password" class="auth-modal-v3-input" id="registerPasswordConfirm" placeholder="Passwort bestätigen" required>
                                </div>

                                <button type="submit" class="auth-modal-v3-submit">
                                    <span>Konto erstellen</span>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                        <line x1="5" y1="12" x2="19" y2="12"/>
                                        <polyline points="12 5 19 12 12 19"/>
                                    </svg>
                                </button>
                            </form>
                        </div>

                        <!-- FORGOT PASSWORD VIEW -->
                        <div id="forgotView" class="auth-view" style="display:none;">
                            <form id="forgotForm">
                                <div class="auth-modal-v3-field">
                                    <input type="email" class="auth-modal-v3-input" id="forgotEmail" placeholder="E-Mail Adresse" required>
                                </div>

                                <button type="submit" class="auth-modal-v3-submit">
                                    <span>Reset-Link Senden</span>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                </button>

                                <div class="auth-modal-v3-forgot" style="text-align: center; margin-top: 16px;">
                                    <a href="#" onclick="window.authModalV3.switchMode('login'); return false;">Zurück zur Anmeldung</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
    }

    // ─── Switch Mode ────────────────────────────────────────────
    function switchMode(mode) {
        currentMode = mode;

        const tabLogin = document.getElementById('authTabLogin');
        const tabMagicLink = document.getElementById('authTabMagicLink');
        const tabRegister = document.getElementById('authTabRegister');
        const loginView = document.getElementById('loginView');
        const magicLinkView = document.getElementById('magicLinkView');
        const registerView = document.getElementById('registerView');
        const forgotView = document.getElementById('forgotView');
        const title = document.getElementById('authTitle');
        const subtitle = document.getElementById('authSubtitle');

        // Hide all views
        loginView.style.display = 'none';
        magicLinkView.style.display = 'none';
        registerView.style.display = 'none';
        forgotView.style.display = 'none';

        // Remove all active tabs
        tabLogin.classList.remove('active');
        tabMagicLink.classList.remove('active');
        tabRegister.classList.remove('active');

        if (mode === 'login') {
            tabLogin.classList.add('active');
            loginView.style.display = 'block';
            title.textContent = 'Willkommen zurück';
            subtitle.textContent = 'Bitte melde dich an, um fortzufahren.';
        } else if (mode === 'magiclink') {
            tabMagicLink.classList.add('active');
            magicLinkView.style.display = 'block';
            title.textContent = 'Magic Link';
            subtitle.textContent = 'Erhalte einen sicheren Login-Link per E-Mail.';
        } else if (mode === 'register') {
            tabRegister.classList.add('active');
            registerView.style.display = 'block';
            title.textContent = 'Konto erstellen';
            subtitle.textContent = 'Werde Teil der nachhaltigen Bewegung.';
        } else if (mode === 'forgot') {
            forgotView.style.display = 'block';
            title.textContent = 'Passwort zurücksetzen';
            subtitle.textContent = 'Wir senden dir einen Link zum Zurücksetzen.';
        }

        hideMessage();
    }

    // ─── Open/Close ─────────────────────────────────────────────
    function open(mode = 'login') {
        switchMode(mode);
        const overlay = document.getElementById('authModalV3Overlay');
        if (overlay) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Auto-focus first input
            setTimeout(() => {
                const firstInput = mode === 'login'
                    ? document.getElementById('loginEmail')
                    : document.getElementById('registerName');
                firstInput?.focus();
            }, 300);
        }
    }

    function close() {
        const overlay = document.getElementById('authModalV3Overlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        resetForms();
    }

    // ─── Message ────────────────────────────────────────────────
    function showMessage(text, type = 'error') {
        const msg = document.getElementById('authMessage');
        if (msg) {
            msg.textContent = text;
            msg.className = `auth-modal-v3-message ${type} active`;
        }
    }

    function hideMessage() {
        const msg = document.getElementById('authMessage');
        if (msg) msg.classList.remove('active');
    }

    // ─── Login Submit ───────────────────────────────────────────
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

            // Use CSSAuth handler for token management
            if (window.CSSAuth) {
                window.CSSAuth.saveToken(data.access_token);
                window.CSSAuth.saveUser(data.user || data);
            }

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

    // ─── Register Submit ────────────────────────────────────────
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

            // Use CSSAuth handler for token management
            if (window.CSSAuth) {
                window.CSSAuth.saveToken(data.access_token);
                window.CSSAuth.saveUser(data.user || data);
            }

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

    // ─── Reset Forms ────────────────────────────────────────────
    function resetForms() {
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('magicLinkEmail').value = '';
        document.getElementById('registerName').value = '';
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('registerPasswordConfirm').value = '';
        document.getElementById('forgotEmail').value = '';
        hideMessage();
    }

    // ─── OAuth ──────────────────────────────────────────────────
    function loginWithGoogle() {
        window.location.href = `${API_BASE}/api/auth/google`;
    }

    function loginWithApple() {
        window.location.href = `${API_BASE}/api/auth/apple`;
    }

    // ─── Magic Link Submit ──────────────────────────────────────
    async function handleMagicLinkSubmit(e) {
        e.preventDefault();

        const email = document.getElementById('magicLinkEmail').value;
        const submitBtn = e.target.querySelector('.auth-modal-v3-submit');

        submitBtn.classList.add('loading');
        hideMessage();

        try {
            const response = await fetch(`${API_BASE}/api/auth/magic-link`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Magic Link konnte nicht gesendet werden');
            }

            showMessage('Magic Link wurde an deine E-Mail gesendet! Bitte überprüfe deinen Posteingang.', 'success');
            document.getElementById('magicLinkEmail').value = '';

        } catch (error) {
            showMessage(error.message, 'error');
        } finally {
            submitBtn.classList.remove('loading');
        }
    }

    // ─── Forgot Password Submit ─────────────────────────────────
    async function handleForgotSubmit(e) {
        e.preventDefault();

        const email = document.getElementById('forgotEmail').value;
        const submitBtn = e.target.querySelector('.auth-modal-v3-submit');

        submitBtn.classList.add('loading');
        hideMessage();

        try {
            const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Reset-Link konnte nicht gesendet werden');
            }

            showMessage('Reset-Link wurde gesendet! Bitte überprüfe deine E-Mails.', 'success');
            document.getElementById('forgotEmail').value = '';

            setTimeout(() => {
                switchMode('login');
            }, 2000);

        } catch (error) {
            showMessage(error.message, 'error');
        } finally {
            submitBtn.classList.remove('loading');
        }
    }

    // ─── Event Listeners ────────────────────────────────────────
    function attachEvents() {
        // Close button removed, only overlay click and ESC key work
        document.getElementById('authModalV3Overlay').addEventListener('click', (e) => {
            if (e.target.id === 'authModalV3Overlay') close();
        });

        document.getElementById('authTabLogin').addEventListener('click', () => switchMode('login'));
        document.getElementById('authTabMagicLink').addEventListener('click', () => switchMode('magiclink'));
        document.getElementById('authTabRegister').addEventListener('click', () => switchMode('register'));

        document.getElementById('loginForm').addEventListener('submit', handleLoginSubmit);
        document.getElementById('magicLinkForm').addEventListener('submit', handleMagicLinkSubmit);
        document.getElementById('registerForm').addEventListener('submit', handleRegisterSubmit);
        document.getElementById('forgotForm').addEventListener('submit', handleForgotSubmit);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('authModalV3Overlay')?.classList.contains('active')) {
                close();
            }
        });
    }

    // ─── Init ───────────────────────────────────────────────────
    function init() {
        createModalHTML();
        attachEvents();
        console.log('[Auth Modal v3] Ultra Compact - Ready');
    }

    // ─── Public API ─────────────────────────────────────────────
    window.authModalV3 = {
        open,
        close,
        switchMode,
        loginWithGoogle,
        loginWithApple
    };

    // ─── Auto-Init ──────────────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
