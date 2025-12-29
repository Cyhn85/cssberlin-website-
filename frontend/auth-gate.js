/**
 * CSS Berlin - Auth Gate System
 * Reddit-style Login/Register Modal
 * Supports both API and localStorage-based authentication
 */

class AuthGate {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.checkAuthStatus();
    }

    /**
     * Check if user is authenticated
     */
    async checkAuthStatus() {
        // First check localStorage (offline support)
        const localUser = localStorage.getItem('cssberlin_current_user');
        if (localUser) {
            this.currentUser = JSON.parse(localUser);
            this.isAuthenticated = true;
            return true;
        }

        const token = localStorage.getItem('auth_token');
        if (!token) {
            this.isAuthenticated = false;
            return false;
        }

        // Try API if available
        try {
            const baseUrl = window.CSS_BERLIN_API?.BASE_URL || 'http://localhost:8000';
            const response = await fetch(baseUrl + '/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                this.currentUser = await response.json();
                this.isAuthenticated = true;
                return true;
            } else {
                localStorage.removeItem('auth_token');
                this.isAuthenticated = false;
                return false;
            }
        } catch (error) {
            console.log('API not available, using local auth');
            this.isAuthenticated = false;
            return false;
        }
    }

    /**
     * Show login modal
     */
    showLoginModal(action = null, redirectUrl = null, tab = 'login') {
        // Check if modal already exists
        let modal = document.getElementById('auth-gate-modal');
        if (!modal) {
            modal = this.createLoginModal();
            document.body.appendChild(modal);
        }

        // Update action text if provided
        const actionText = modal.querySelector('.auth-gate-action');
        const actionSection = modal.querySelector('.auth-action-section');
        if (action && actionText && actionSection) {
            actionText.textContent = action;
            actionSection.style.display = 'block';
        } else if (actionSection) {
            actionSection.style.display = 'none';
        }

        // Store redirect URL if provided
        if (redirectUrl) {
            modal.dataset.redirectUrl = redirectUrl;
        }

        // Set initial tab
        this.switchTab(tab);

        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Focus first input
        setTimeout(() => {
            const firstInput = modal.querySelector('.auth-gate-form.active input');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    /**
     * Hide login modal
     */
    hideLoginModal() {
        const modal = document.getElementById('auth-gate-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    /**
     * Switch between login and register tabs
     */
    switchTab(tabName) {
        const modal = document.getElementById('auth-gate-modal');
        if (!modal) return;

        const tabs = modal.querySelectorAll('.auth-gate-tab');
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        modal.querySelectorAll('.auth-gate-form').forEach(form => {
            form.classList.remove('active');
        });

        const targetForm = modal.querySelector(`#auth-gate-${tabName}-form`);
        if (targetForm) {
            targetForm.classList.add('active');
        }

        // Update header title
        const headerTitle = modal.querySelector('.auth-gate-header h2');
        const headerDesc = modal.querySelector('.auth-gate-header > p:not(.auth-action-section)');
        if (headerTitle) {
            headerTitle.textContent = tabName === 'login' ? 'Willkommen zurück' : 'Konto erstellen';
        }
    }

    /**
     * Create login modal HTML - Reddit/Vinted Style
     */
    createLoginModal() {
        const modal = document.createElement('div');
        modal.id = 'auth-gate-modal';
        modal.className = 'auth-gate-modal';
        modal.innerHTML = `
            <div class="auth-gate-overlay"></div>
            <div class="auth-gate-content">
                <button class="auth-gate-close" onclick="authGate.hideLoginModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div class="auth-gate-header">
                    <div class="auth-gate-logo">
                        <span style="font-size: 28px; font-weight: 800; color: #2D5016;">CSS</span>
                        <span style="font-size: 28px; font-weight: 800; color: #E8854C;">Berlin</span>
                    </div>
                    <h2>Willkommen zurück</h2>
                    <p class="auth-action-section" style="display: none;">
                        <span class="auth-gate-action">Diese Aktion</span> erfordert eine Anmeldung.
                    </p>
                </div>

                <div class="auth-gate-body">
                    <!-- OAuth Buttons FIRST (Reddit style) -->
                    <div class="auth-gate-oauth">
                        <button class="oauth-btn google-btn" onclick="authGate.loginWithGoogle()">
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Mit Google fortfahren
                        </button>
                        <button class="oauth-btn magic-link-btn" onclick="authGate.showMagicLinkForm()">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            Per E-Mail-Link anmelden
                        </button>
                    </div>

                    <!-- Magic Link Form (hidden by default) -->
                    <div id="magic-link-form-container" class="magic-link-form" style="display: none;">
                        <div class="magic-link-header">
                            <button type="button" class="magic-link-back" onclick="authGate.hideMagicLinkForm()">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </button>
                            <h3>Anmeldung per E-Mail</h3>
                        </div>
                        <p class="magic-link-desc">Geben Sie Ihre E-Mail ein und wir senden Ihnen einen sicheren Anmelde-Link.</p>
                        <form id="magic-link-form" onsubmit="authGate.sendMagicLink(event); return false;">
                            <div class="form-group">
                                <label for="magic-email">E-Mail-Adresse</label>
                                <input type="email" id="magic-email" placeholder="ihre@email.de" required>
                            </div>
                            <button type="submit" class="btn-primary magic-link-submit">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 2L11 13"></path>
                                    <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                                </svg>
                                <span>Link senden</span>
                            </button>
                        </form>
                        <div class="magic-link-info">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 16v-4"></path>
                                <path d="M12 8h.01"></path>
                            </svg>
                            <span>Der Link ist 10 Minuten gültig und kann nur einmal verwendet werden.</span>
                        </div>
                    </div>

                    <!-- Divider -->
                    <div class="oauth-divider">
                        <span>ODER</span>
                    </div>

                    <!-- Tabs -->
                    <div class="auth-gate-tabs">
                        <button class="auth-gate-tab active" data-tab="login">Anmelden</button>
                        <button class="auth-gate-tab" data-tab="register">Registrieren</button>
                    </div>

                    <!-- Error Message -->
                    <div class="auth-gate-error" style="display: none;"></div>
                    <div class="auth-gate-success" style="display: none;"></div>

                    <!-- Login Form -->
                    <form id="auth-gate-login-form" class="auth-gate-form active">
                        <div class="form-group">
                            <label for="login-email">E-Mail</label>
                            <input type="email" id="login-email" name="email" placeholder="ihre@email.de" required>
                        </div>
                        <div class="form-group">
                            <label for="login-password">Passwort</label>
                            <div class="password-input-wrapper">
                                <input type="password" id="login-password" name="password" placeholder="Ihr Passwort" required>
                                <button type="button" class="toggle-password" onclick="authGate.togglePassword('login-password')">
                                    <svg class="eye-open" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                    <svg class="eye-closed" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="form-options">
                            <label class="checkbox-wrapper">
                                <input type="checkbox" id="remember-me">
                                <span class="checkmark"></span>
                                <span>Angemeldet bleiben</span>
                            </label>
                            <a href="forgot-password.html" class="forgot-link">Passwort vergessen?</a>
                        </div>
                        <button type="submit" class="btn-primary">
                            <span>Anmelden</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    </form>

                    <!-- Register Form -->
                    <form id="auth-gate-register-form" class="auth-gate-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="register-firstname">Vorname</label>
                                <input type="text" id="register-firstname" name="first_name" placeholder="Max" required>
                            </div>
                            <div class="form-group">
                                <label for="register-lastname">Nachname</label>
                                <input type="text" id="register-lastname" name="last_name" placeholder="Mustermann" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="register-email">E-Mail</label>
                            <input type="email" id="register-email" name="email" placeholder="max@beispiel.de" required>
                        </div>
                        <div class="form-group">
                            <label for="register-password">Passwort</label>
                            <div class="password-input-wrapper">
                                <input type="password" id="register-password" name="password" placeholder="Mind. 8 Zeichen" required minlength="8">
                                <button type="button" class="toggle-password" onclick="authGate.togglePassword('register-password')">
                                    <svg class="eye-open" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                    <svg class="eye-closed" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                </button>
                            </div>
                            <div class="password-strength" id="password-strength"></div>
                        </div>
                        <div class="form-group">
                            <label for="register-password2">Passwort bestätigen</label>
                            <input type="password" id="register-password2" name="password2" placeholder="Passwort wiederholen" required>
                        </div>
                        <div class="form-group">
                            <label class="checkbox-wrapper">
                                <input type="checkbox" id="accept-terms" required>
                                <span class="checkmark"></span>
                                <span>Ich akzeptiere die <a href="agb.html" target="_blank">AGB</a> und <a href="datenschutz.html" target="_blank">Datenschutzbestimmungen</a></span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label class="checkbox-wrapper">
                                <input type="checkbox" id="accept-newsletter">
                                <span class="checkmark"></span>
                                <span>Newsletter abonnieren (Angebote & Neuigkeiten)</span>
                            </label>
                        </div>
                        <button type="submit" class="btn-primary">
                            <span>Konto erstellen</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="8.5" cy="7" r="4"></circle>
                                <line x1="20" y1="8" x2="20" y2="14"></line>
                                <line x1="23" y1="11" x2="17" y2="11"></line>
                            </svg>
                        </button>
                    </form>

                    <!-- Footer Links -->
                    <div class="auth-gate-footer">
                        <p class="login-footer" style="display: block;">
                            Noch kein Konto? <a href="#" onclick="authGate.switchTab('register'); return false;">Jetzt registrieren</a>
                        </p>
                        <p class="register-footer" style="display: none;">
                            Bereits registriert? <a href="#" onclick="authGate.switchTab('login'); return false;">Anmelden</a>
                        </p>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        this.attachModalEvents(modal);

        return modal;
    }

    /**
     * Toggle password visibility
     */
    togglePassword(inputId) {
        const input = document.getElementById(inputId);
        const wrapper = input.closest('.password-input-wrapper');
        const eyeOpen = wrapper.querySelector('.eye-open');
        const eyeClosed = wrapper.querySelector('.eye-closed');

        if (input.type === 'password') {
            input.type = 'text';
            eyeOpen.style.display = 'none';
            eyeClosed.style.display = 'block';
        } else {
            input.type = 'password';
            eyeOpen.style.display = 'block';
            eyeClosed.style.display = 'none';
        }
    }

    /**
     * Attach event listeners to modal
     */
    attachModalEvents(modal) {
        // Tab switching
        const tabs = modal.querySelectorAll('.auth-gate-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);

                // Update footer visibility
                const loginFooter = modal.querySelector('.login-footer');
                const registerFooter = modal.querySelector('.register-footer');
                if (tabName === 'login') {
                    loginFooter.style.display = 'block';
                    registerFooter.style.display = 'none';
                } else {
                    loginFooter.style.display = 'none';
                    registerFooter.style.display = 'block';
                }
            });
        });

        // Password strength indicator
        const passwordInput = modal.querySelector('#register-password');
        passwordInput.addEventListener('input', (e) => {
            this.updatePasswordStrength(e.target.value);
        });

        // Login form submit
        const loginForm = modal.querySelector('#auth-gate-login-form');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            await this.handleLogin(Object.fromEntries(formData));
        });

        // Register form submit
        const registerForm = modal.querySelector('#auth-gate-register-form');
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData);

            // Check password match
            if (data.password !== data.password2) {
                this.showError('Passwörter stimmen nicht überein');
                return;
            }

            // Check terms
            if (!modal.querySelector('#accept-terms').checked) {
                this.showError('Bitte akzeptieren Sie die AGB');
                return;
            }

            delete data.password2;
            data.newsletter = modal.querySelector('#accept-newsletter').checked;
            await this.handleRegister(data);
        });

        // Close on overlay click
        const overlay = modal.querySelector('.auth-gate-overlay');
        overlay.addEventListener('click', () => this.hideLoginModal());

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideLoginModal();
            }
        });
    }

    /**
     * Update password strength indicator
     */
    updatePasswordStrength(password) {
        const strengthDiv = document.getElementById('password-strength');
        if (!strengthDiv) return;

        let strength = 0;
        let text = '';
        let color = '';

        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        if (password.length === 0) {
            strengthDiv.innerHTML = '';
            return;
        }

        if (strength <= 2) {
            text = 'Schwach';
            color = '#dc3545';
        } else if (strength <= 3) {
            text = 'Mittel';
            color = '#ffc107';
        } else {
            text = 'Stark';
            color = '#28a745';
        }

        strengthDiv.innerHTML = `
            <div class="strength-bar">
                <div class="strength-fill" style="width: ${strength * 20}%; background: ${color};"></div>
            </div>
            <span style="color: ${color}; font-size: 12px;">${text}</span>
        `;
    }

    /**
     * Handle login - tries API first, falls back to localStorage
     */
    async handleLogin(data) {
        this.showLoading(true);

        // Try localStorage first (for demo/offline support)
        const users = JSON.parse(localStorage.getItem('cssberlin_users') || '[]');
        const user = users.find(u => u.email === data.email);

        if (user) {
            // Check if Google user
            if (user.loginMethod === 'google') {
                this.showError('Bitte melden Sie sich mit Google an.');
                this.showLoading(false);
                return;
            }

            // Check password (btoa encoded)
            if (user.password && user.password === btoa(data.password)) {
                this.loginSuccess(user);
                return;
            }
        }

        // Try API
        try {
            const baseUrl = window.CSS_BERLIN_API?.BASE_URL || 'http://localhost:8000';
            const response = await fetch(baseUrl + '/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('auth_token', result.access_token);
                this.loginSuccess(result.user);
            } else {
                this.showError(result.detail || 'E-Mail oder Passwort ist falsch');
                this.showLoading(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('E-Mail oder Passwort ist falsch');
            this.showLoading(false);
        }
    }

    /**
     * Login success handler
     */
    loginSuccess(user) {
        // Store user session
        const sessionUser = {
            id: user.id,
            firstName: user.firstName || user.first_name,
            lastName: user.lastName || user.last_name,
            email: user.email,
            picture: user.picture || null,
            loginMethod: user.loginMethod || 'email'
        };

        localStorage.setItem('cssberlin_current_user', JSON.stringify(sessionUser));
        localStorage.setItem('auth_token', 'local_' + Date.now());

        this.currentUser = sessionUser;
        this.isAuthenticated = true;

        // Immediately hide modal and redirect - no toast notifications
        this.hideLoginModal();
        this.showLoading(false);

        // Redirect if URL provided
        const modal = document.getElementById('auth-gate-modal');
        const redirectUrl = modal?.dataset.redirectUrl;
        if (redirectUrl) {
            window.location.href = redirectUrl;
        } else {
            window.location.reload();
        }
    }

    /**
     * Handle registration
     */
    async handleRegister(data) {
        this.showLoading(true);

        // Check if email already exists in localStorage
        const users = JSON.parse(localStorage.getItem('cssberlin_users') || '[]');
        if (users.find(u => u.email === data.email)) {
            this.showError('Diese E-Mail ist bereits registriert.');
            this.showLoading(false);
            return;
        }

        // Create new user locally
        const newUser = {
            id: 'user_' + Date.now(),
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            password: btoa(data.password),
            newsletter: data.newsletter || false,
            createdAt: new Date().toISOString(),
            wishlist: [],
            negotiations: [],
            loginMethod: 'email'
        };

        users.push(newUser);
        localStorage.setItem('cssberlin_users', JSON.stringify(users));

        // Try API registration as well
        try {
            const baseUrl = window.CSS_BERLIN_API?.BASE_URL || 'http://localhost:8000';
            await fetch(baseUrl + '/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.log('API registration failed, using local storage');
        }

        // Login the new user
        this.loginSuccess(newUser);
    }

    /**
     * Google OAuth login
     */
    loginWithGoogle() {
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    // Fallback: redirect to Google OAuth
                    console.log('Google One Tap not displayed, using popup');
                }
            });
        } else {
            this.showError('Google Sign-In ist nicht verfügbar');
        }
    }

    /**
     * Show Magic Link form
     */
    showMagicLinkForm() {
        const modal = document.getElementById('auth-gate-modal');
        if (!modal) return;

        // Hide other sections
        modal.querySelector('.auth-gate-oauth').style.display = 'none';
        modal.querySelector('.oauth-divider').style.display = 'none';
        modal.querySelector('.auth-gate-tabs').style.display = 'none';
        modal.querySelectorAll('.auth-gate-form').forEach(f => f.style.display = 'none');
        modal.querySelector('.auth-gate-footer').style.display = 'none';

        // Show Magic Link form
        const magicForm = modal.querySelector('#magic-link-form-container');
        if (magicForm) {
            magicForm.style.display = 'block';
        }

        // Update header
        const headerTitle = modal.querySelector('.auth-gate-header h2');
        if (headerTitle) {
            headerTitle.textContent = 'Per E-Mail anmelden';
        }

        // Focus email input
        setTimeout(() => {
            const emailInput = modal.querySelector('#magic-email');
            if (emailInput) emailInput.focus();
        }, 100);
    }

    /**
     * Hide Magic Link form
     */
    hideMagicLinkForm() {
        const modal = document.getElementById('auth-gate-modal');
        if (!modal) return;

        // Show other sections
        modal.querySelector('.auth-gate-oauth').style.display = 'flex';
        modal.querySelector('.oauth-divider').style.display = 'block';
        modal.querySelector('.auth-gate-tabs').style.display = 'flex';
        modal.querySelector('.auth-gate-footer').style.display = 'block';

        // Show active form
        this.switchTab('login');

        // Hide Magic Link form
        const magicForm = modal.querySelector('#magic-link-form-container');
        if (magicForm) {
            magicForm.style.display = 'none';
        }

        // Reset header
        const headerTitle = modal.querySelector('.auth-gate-header h2');
        if (headerTitle) {
            headerTitle.textContent = 'Willkommen zurück';
        }
    }

    /**
     * Send Magic Link email
     */
    async sendMagicLink(event) {
        if (event) event.preventDefault();

        const emailInput = document.getElementById('magic-email');
        const email = emailInput?.value.trim();

        if (!email) {
            this.showError('Bitte geben Sie Ihre E-Mail-Adresse ein');
            return;
        }

        this.showLoading(true);

        // Check if user exists
        const users = JSON.parse(localStorage.getItem('cssberlin_users') || '[]');
        let user = users.find(u => u.email === email);

        // Generate magic link token
        const token = 'magic_' + Date.now() + '_' + Math.random().toString(36).substr(2, 16);
        const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes

        // Store token
        const magicTokens = JSON.parse(localStorage.getItem('cssberlin_magic_tokens') || '[]');
        magicTokens.push({
            email,
            token,
            expiresAt,
            createdAt: Date.now(),
            used: false
        });
        localStorage.setItem('cssberlin_magic_tokens', JSON.stringify(magicTokens));

        // Generate magic link URL
        const magicLink = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, '')}magic-login.html?token=${token}`;

        // Send email via EmailService (or demo mode)
        if (typeof EmailService !== 'undefined') {
            await EmailService.sendMagicLink(email, user?.firstName || email.split('@')[0], magicLink);
        }

        // Log for demo
        console.log('Magic Link:', magicLink);

        this.showLoading(false);
        this.showSuccess('Link wurde gesendet! Überprüfen Sie Ihre E-Mails.');

        // Show alert for demo (remove in production)
        setTimeout(() => {
            alert(`📧 Magic-Link wurde an ${email} gesendet!\n\n🔗 Link:\n${magicLink}\n\n⏰ Gültig für 10 Minuten\n\nKlicken Sie auf den Link um sich anzumelden.`);

            if (confirm('Möchten Sie direkt zur Anmeldung gehen?')) {
                window.location.href = `magic-login.html?token=${token}`;
            }
        }, 500);
    }

    /**
     * Handle Google Sign-In callback
     */
    handleGoogleSignIn(response) {
        try {
            // Decode JWT token
            const userObject = this.parseJwt(response.credential);

            const googleUser = {
                id: 'google_' + userObject.sub,
                firstName: userObject.given_name || '',
                lastName: userObject.family_name || '',
                email: userObject.email,
                verified: userObject.email_verified,
                picture: userObject.picture,
                createdAt: new Date().toISOString(),
                wishlist: [],
                negotiations: [],
                loginMethod: 'google'
            };

            // Check if user exists
            const existingUsers = JSON.parse(localStorage.getItem('cssberlin_users') || '[]');
            let user = existingUsers.find(u => u.email === googleUser.email);

            if (!user) {
                // New user - register with Google
                existingUsers.push(googleUser);
                localStorage.setItem('cssberlin_users', JSON.stringify(existingUsers));
                user = googleUser;
            }

            // Login user
            this.loginSuccess(user);
        } catch (error) {
            console.error('Google sign-in error:', error);
            this.showError('Google-Anmeldung fehlgeschlagen');
        }
    }

    /**
     * Parse JWT token
     */
    parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    /**
     * Show loading state
     */
    showLoading(show) {
        const modal = document.getElementById('auth-gate-modal');
        const buttons = modal?.querySelectorAll('.btn-primary');
        buttons?.forEach(btn => {
            if (show) {
                btn.disabled = true;
                btn.classList.add('loading');
            } else {
                btn.disabled = false;
                btn.classList.remove('loading');
            }
        });
    }

    /**
     * Show error message
     */
    showError(message) {
        const modal = document.getElementById('auth-gate-modal');
        const errorDiv = modal?.querySelector('.auth-gate-error');
        const successDiv = modal?.querySelector('.auth-gate-success');

        if (successDiv) successDiv.style.display = 'none';

        if (errorDiv) {
            errorDiv.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <span>${message}</span>
            `;
            errorDiv.style.display = 'flex';

            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        const modal = document.getElementById('auth-gate-modal');
        const errorDiv = modal?.querySelector('.auth-gate-error');
        const successDiv = modal?.querySelector('.auth-gate-success');

        if (errorDiv) errorDiv.style.display = 'none';

        if (successDiv) {
            successDiv.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>${message}</span>
            `;
            successDiv.style.display = 'flex';
        }
    }

    /**
     * Require authentication for action
     */
    async requireAuth(actionName, callback, redirectUrl = null) {
        await this.checkAuthStatus();

        if (this.isAuthenticated) {
            if (typeof callback === 'function') {
                return callback();
            }
        } else {
            this.showLoginModal(actionName, redirectUrl);
        }
    }

    /**
     * Logout
     */
    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('cssberlin_current_user');
        this.isAuthenticated = false;
        this.currentUser = null;
        window.location.reload();
    }
}

// Initialize global authGate instance
const authGate = new AuthGate();

// Handle Google Sign-In callback globally
function handleGoogleSignInModal(response) {
    authGate.handleGoogleSignIn(response);
}

// Add CSS styles
const authGateStyles = document.createElement('style');
authGateStyles.textContent = `
    .auth-gate-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10001;
        align-items: center;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
    }

    .auth-gate-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(8px);
    }

    .auth-gate-content {
        position: relative;
        background: white;
        border-radius: 20px;
        max-width: 440px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 25px 80px rgba(0, 0, 0, 0.35);
        animation: authModalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes authModalSlideUp {
        from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .auth-gate-close {
        position: absolute;
        top: 16px;
        right: 16px;
        background: #f5f5f5;
        border: none;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s;
        z-index: 10;
    }

    .auth-gate-close:hover {
        background: #e0e0e0;
        transform: rotate(90deg);
    }

    .auth-gate-close svg {
        color: #666;
    }

    .auth-gate-header {
        padding: 32px 32px 20px;
        text-align: center;
    }

    .auth-gate-logo {
        margin-bottom: 16px;
    }

    .auth-gate-header h2 {
        margin: 0 0 8px;
        font-size: 24px;
        color: #333;
        font-weight: 700;
    }

    .auth-gate-header p {
        margin: 0;
        color: #666;
        font-size: 14px;
    }

    .auth-gate-action {
        font-weight: 600;
        color: #E8854C;
    }

    .auth-gate-body {
        padding: 0 32px 32px;
    }

    /* OAuth Buttons */
    .auth-gate-oauth {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .oauth-btn {
        width: 100%;
        padding: 14px 20px;
        border: 2px solid #e8e8e8;
        border-radius: 12px;
        background: white;
        cursor: pointer;
        font-size: 15px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        transition: all 0.2s;
        color: #333;
    }

    .oauth-btn:hover {
        border-color: #ccc;
        background: #fafafa;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .oauth-btn.apple-btn {
        background: #000;
        border-color: #000;
        color: white;
    }

    .oauth-btn.apple-btn:hover {
        background: #222;
        border-color: #222;
    }

    /* Magic Link Button */
    .oauth-btn.magic-link-btn {
        background: #f8f9fa;
        border-color: #dee2e6;
        color: #495057;
    }

    .oauth-btn.magic-link-btn:hover {
        background: #e9ecef;
        border-color: #ced4da;
    }

    .oauth-btn.magic-link-btn svg {
        stroke: #E8854C;
    }

    /* Magic Link Form */
    .magic-link-form {
        animation: fadeIn 0.3s ease;
    }

    .magic-link-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
    }

    .magic-link-back {
        background: #f5f5f5;
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
    }

    .magic-link-back:hover {
        background: #e0e0e0;
    }

    .magic-link-header h3 {
        margin: 0;
        font-size: 18px;
        color: #333;
        font-weight: 600;
    }

    .magic-link-desc {
        color: #666;
        font-size: 14px;
        margin-bottom: 20px;
        line-height: 1.5;
    }

    .magic-link-form .form-group {
        margin-bottom: 16px;
    }

    .magic-link-form label {
        display: block;
        margin-bottom: 6px;
        font-weight: 600;
        color: #333;
        font-size: 13px;
    }

    .magic-link-form input {
        width: 100%;
        padding: 14px 16px;
        border: 2px solid #e8e8e8;
        border-radius: 10px;
        font-size: 15px;
        transition: all 0.2s;
        box-sizing: border-box;
    }

    .magic-link-form input:focus {
        outline: none;
        border-color: #2D5016;
        box-shadow: 0 0 0 3px rgba(45, 80, 22, 0.1);
    }

    .magic-link-submit {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #E8854C 0%, #d4753d 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .magic-link-submit:hover {
        background: linear-gradient(135deg, #d4753d 0%, #c4652d 100%);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(232, 133, 76, 0.3);
    }

    .magic-link-info {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin-top: 20px;
        padding: 12px 16px;
        background: #f0f9ff;
        border-radius: 10px;
        color: #0369a1;
        font-size: 13px;
    }

    .magic-link-info svg {
        flex-shrink: 0;
        margin-top: 2px;
    }

    /* Divider */
    .oauth-divider {
        text-align: center;
        margin: 24px 0;
        position: relative;
    }

    .oauth-divider::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: #e8e8e8;
    }

    .oauth-divider span {
        position: relative;
        background: white;
        padding: 0 16px;
        color: #999;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 1px;
    }

    /* Tabs */
    .auth-gate-tabs {
        display: flex;
        gap: 0;
        margin-bottom: 24px;
        background: #f5f5f5;
        border-radius: 12px;
        padding: 4px;
    }

    .auth-gate-tab {
        flex: 1;
        padding: 12px;
        background: none;
        border: none;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        color: #666;
        cursor: pointer;
        transition: all 0.2s;
    }

    .auth-gate-tab.active {
        background: white;
        color: #2D5016;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .auth-gate-tab:hover:not(.active) {
        color: #333;
    }

    /* Forms */
    .auth-gate-form {
        display: none;
    }

    .auth-gate-form.active {
        display: block;
        animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .form-row {
        display: flex;
        gap: 12px;
    }

    .form-row .form-group {
        flex: 1;
    }

    .auth-gate-form .form-group {
        margin-bottom: 16px;
    }

    .auth-gate-form label {
        display: block;
        margin-bottom: 6px;
        font-weight: 600;
        color: #333;
        font-size: 13px;
    }

    .auth-gate-form input[type="email"],
    .auth-gate-form input[type="password"],
    .auth-gate-form input[type="text"] {
        width: 100%;
        padding: 14px 16px;
        border: 2px solid #e8e8e8;
        border-radius: 10px;
        font-size: 15px;
        transition: all 0.2s;
        box-sizing: border-box;
    }

    .auth-gate-form input:focus {
        outline: none;
        border-color: #2D5016;
        box-shadow: 0 0 0 3px rgba(45, 80, 22, 0.1);
    }

    .auth-gate-form input::placeholder {
        color: #aaa;
    }

    /* Password input wrapper */
    .password-input-wrapper {
        position: relative;
    }

    .password-input-wrapper input {
        padding-right: 48px;
    }

    .toggle-password {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        color: #999;
        padding: 4px;
    }

    .toggle-password:hover {
        color: #666;
    }

    /* Password strength */
    .password-strength {
        margin-top: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .strength-bar {
        flex: 1;
        height: 4px;
        background: #e8e8e8;
        border-radius: 2px;
        overflow: hidden;
    }

    .strength-fill {
        height: 100%;
        transition: width 0.3s, background 0.3s;
    }

    /* Checkbox */
    .checkbox-wrapper {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        cursor: pointer;
        font-size: 13px;
        color: #666;
    }

    .checkbox-wrapper input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: #2D5016;
        cursor: pointer;
        flex-shrink: 0;
        margin-top: 2px;
    }

    .checkbox-wrapper a {
        color: #2D5016;
        text-decoration: none;
    }

    .checkbox-wrapper a:hover {
        text-decoration: underline;
    }

    /* Form options row */
    .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .forgot-link {
        font-size: 13px;
        color: #E8854C;
        text-decoration: none;
        font-weight: 500;
    }

    .forgot-link:hover {
        text-decoration: underline;
    }

    /* Submit button */
    .auth-gate-form .btn-primary {
        width: 100%;
        padding: 16px;
        background: linear-gradient(135deg, #2D5016 0%, #3d6b1e 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .auth-gate-form .btn-primary:hover {
        background: linear-gradient(135deg, #1a3009 0%, #2D5016 100%);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(45, 80, 22, 0.3);
    }

    .auth-gate-form .btn-primary:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
    }

    .auth-gate-form .btn-primary.loading span {
        display: none;
    }

    .auth-gate-form .btn-primary.loading::after {
        content: '';
        width: 20px;
        height: 20px;
        border: 2px solid white;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    /* Error/Success messages */
    .auth-gate-error,
    .auth-gate-success {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px 16px;
        border-radius: 10px;
        font-size: 14px;
        margin-bottom: 16px;
        animation: shake 0.4s ease;
    }

    .auth-gate-error {
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #dc2626;
    }

    .auth-gate-success {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        color: #16a34a;
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    /* Footer */
    .auth-gate-footer {
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid #e8e8e8;
        text-align: center;
    }

    .auth-gate-footer p {
        margin: 0;
        font-size: 14px;
        color: #666;
    }

    .auth-gate-footer a {
        color: #2D5016;
        font-weight: 600;
        text-decoration: none;
    }

    .auth-gate-footer a:hover {
        text-decoration: underline;
    }

    /* Mobile responsive */
    @media (max-width: 480px) {
        .auth-gate-modal {
            padding: 0;
            align-items: flex-end;
        }

        .auth-gate-content {
            max-width: 100%;
            border-radius: 20px 20px 0 0;
            max-height: 95vh;
        }

        .auth-gate-header,
        .auth-gate-body {
            padding-left: 24px;
            padding-right: 24px;
        }

        .form-row {
            flex-direction: column;
            gap: 0;
        }

        .form-options {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
        }
    }
`;
document.head.appendChild(authGateStyles);