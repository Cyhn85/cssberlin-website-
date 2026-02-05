/**
 * AUTH MODAL - Login/Register Modal System
 * Referans: AnimatedAuthForm.tsx (React Design)
 *
 * Features:
 * - Login/Register tabs with animations
 * - Google Sign-In integration
 * - Apple Sign-In (placeholder)
 * - Magic Link (email login)
 * - Form validation
 * - Backend API integration
 */

(function() {
    'use strict';

    // Modal State
    let currentMode = 'login'; // 'login' | 'register' | 'magic'
    let isModalOpen = false;

    // DOM Elements (will be set after DOM ready)
    let modalOverlay = null;
    let modalElement = null;
    let loginTab = null;
    let registerTab = null;
    let authForm = null;
    let titleElement = null;
    let subtitleElement = null;
    let submitButton = null;
    let nameField = null;
    let errorElement = null;
    let successElement = null;

    // Initialize Modal
    function initAuthModal() {
        createModalHTML();
        cacheElements();
        bindEvents();
        console.log('[AuthModal] Initialized');
    }

    // Create Modal HTML
    function createModalHTML() {
        const modalHTML = `
        <div class="auth-modal-overlay" id="authModalOverlay">
            <div class="auth-modal-backdrop" onclick="authModal.close()"></div>
            <div class="auth-modal" id="authModal">
                <!-- Close Button -->
                <button class="auth-modal-close" onclick="authModal.close()" title="Schließen">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"></path>
                    </svg>
                </button>

                <div class="auth-modal-content">
                    <!-- Header -->
                    <div class="auth-modal-header">
                        <h2 class="auth-modal-title" id="authModalTitle">Willkommen zurück</h2>
                        <p class="auth-modal-subtitle" id="authModalSubtitle">Bitte melde dich an, um fortzufahren.</p>
                    </div>

                    <!-- Tabs -->
                    <div class="auth-tabs">
                        <button class="auth-tab login-tab active" id="loginTab" onclick="authModal.switchMode('login')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                <polyline points="10 17 15 12 10 7"></polyline>
                                <line x1="15" y1="12" x2="3" y2="12"></line>
                            </svg>
                            Anmelden
                        </button>
                        <button class="auth-tab register-tab" id="registerTab" onclick="authModal.switchMode('register')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="8.5" cy="7" r="4"></circle>
                                <line x1="20" y1="8" x2="20" y2="14"></line>
                                <line x1="23" y1="11" x2="17" y2="11"></line>
                            </svg>
                            Registrieren
                        </button>
                    </div>

                    <!-- Error/Success Messages -->
                    <div class="auth-error" id="authError"></div>
                    <div class="auth-success" id="authSuccess"></div>

                    <!-- Form Container -->
                    <div class="auth-form-container">
                        <!-- Main Form -->
                        <form class="auth-form" id="authForm" data-mode="login" onsubmit="authModal.handleSubmit(event)">

                            <!-- Name Field (Register only) -->
                            <div class="auth-field" id="nameFieldWrapper" style="display: none;">
                                <input type="text" id="authName" name="name" placeholder=" " autocomplete="name">
                                <label for="authName">Dein Name</label>
                            </div>

                            <!-- Email Field -->
                            <div class="auth-field">
                                <input type="email" id="authEmail" name="email" placeholder=" " required autocomplete="email">
                                <label for="authEmail">E-Mail Adresse</label>
                            </div>

                            <!-- Password Field -->
                            <div class="auth-field" id="passwordFieldWrapper">
                                <input type="password" id="authPassword" name="password" placeholder=" " required autocomplete="current-password">
                                <label for="authPassword">Passwort</label>
                                <button type="button" class="auth-password-toggle" onclick="authModal.togglePassword()">
                                    <svg id="eyeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </button>
                            </div>

                            <!-- Remember Me & Forgot (Login only) -->
                            <div class="auth-options-row" id="loginOptions">
                                <label class="auth-remember">
                                    <input type="checkbox" id="rememberMe" name="remember">
                                    Angemeldet bleiben
                                </label>
                                <a href="#" class="auth-forgot" onclick="authModal.showMagicLink(event)">Passwort vergessen?</a>
                            </div>

                            <!-- Submit Button -->
                            <button type="submit" class="auth-submit login-submit" id="authSubmit">
                                <span class="auth-submit-text" id="submitText">Jetzt Einloggen</span>
                                <svg class="auth-submit-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                                <span class="auth-submit-loader">
                                    <span class="auth-spinner"></span>
                                    Wird geladen...
                                </span>
                            </button>
                        </form>

                        <!-- Magic Link Form -->
                        <div class="auth-magic-form" id="magicLinkForm">
                            <div class="auth-magic-info">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                                <h3>Magic Link</h3>
                                <p>Wir senden dir einen Link per E-Mail, mit dem du dich ohne Passwort anmelden kannst.</p>
                            </div>
                            <form onsubmit="authModal.sendMagicLink(event)">
                                <div class="auth-field">
                                    <input type="email" id="magicEmail" name="email" placeholder=" " required>
                                    <label for="magicEmail">E-Mail Adresse</label>
                                </div>
                                <button type="submit" class="auth-submit login-submit" id="magicSubmit">
                                    <span class="auth-submit-text">Magic Link senden</span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                    <span class="auth-submit-loader">
                                        <span class="auth-spinner"></span>
                                        Wird gesendet...
                                    </span>
                                </button>
                            </form>
                            <button class="auth-back-btn" onclick="authModal.hideMagicLink()">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                    <line x1="19" y1="12" x2="5" y2="12"></line>
                                    <polyline points="12 19 5 12 12 5"></polyline>
                                </svg>
                                Zurück zur Anmeldung
                            </button>
                        </div>
                    </div>

                    <!-- Divider -->
                    <div class="auth-divider">
                        <span>Oder mit</span>
                    </div>

                    <!-- Social Login Buttons -->
                    <div class="auth-social-buttons">
                        <!-- Google -->
                        <button class="auth-social-btn google-btn" onclick="authModal.loginWithGoogle()" title="Mit Google anmelden">
                            <svg viewBox="0 0 24 24" width="22" height="22">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                        </button>

                        <!-- Apple -->
                        <button class="auth-social-btn apple-btn" onclick="authModal.loginWithApple()" title="Mit Apple anmelden">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                        </button>

                        <!-- Magic Link -->
                        <button class="auth-social-btn magic-btn" onclick="authModal.showMagicLink(event)" title="Mit Magic Link anmelden">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;

        // Append to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Cache DOM Elements
    function cacheElements() {
        modalOverlay = document.getElementById('authModalOverlay');
        modalElement = document.getElementById('authModal');
        loginTab = document.getElementById('loginTab');
        registerTab = document.getElementById('registerTab');
        authForm = document.getElementById('authForm');
        titleElement = document.getElementById('authModalTitle');
        subtitleElement = document.getElementById('authModalSubtitle');
        submitButton = document.getElementById('authSubmit');
        nameField = document.getElementById('nameFieldWrapper');
        errorElement = document.getElementById('authError');
        successElement = document.getElementById('authSuccess');
    }

    // Bind Events
    function bindEvents() {
        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isModalOpen) {
                closeModal();
            }
        });

        // Close on backdrop click is handled in HTML

        // Focus trap
        modalElement?.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                trapFocus(e);
            }
        });
    }

    // Open Modal
    function openModal(mode = 'login') {
        if (!modalOverlay) {
            console.error('[AuthModal] Modal not initialized');
            return;
        }

        currentMode = mode;
        isModalOpen = true;

        // Reset form
        authForm?.reset();
        hideError();
        hideSuccess();

        // Set initial mode
        switchMode(mode);

        // Show modal
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus first input
        setTimeout(() => {
            const firstInput = modalElement?.querySelector('input:not([type="checkbox"])');
            firstInput?.focus();
        }, 300);

        console.log('[AuthModal] Opened in mode:', mode);
    }

    // Close Modal
    function closeModal() {
        if (!modalOverlay) return;

        isModalOpen = false;
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';

        // Reset form after animation
        setTimeout(() => {
            authForm?.reset();
            hideError();
            hideSuccess();
            hideMagicLinkForm();
        }, 300);

        console.log('[AuthModal] Closed');
    }

    // Switch Mode (Login/Register)
    function switchMode(mode) {
        currentMode = mode;

        // Hide magic link form if visible
        hideMagicLinkForm();

        // Update tabs
        loginTab?.classList.toggle('active', mode === 'login');
        registerTab?.classList.toggle('active', mode === 'register');

        // Update form data attribute
        if (authForm) {
            authForm.dataset.mode = mode;
        }

        // Update title & subtitle
        if (mode === 'login') {
            if (titleElement) titleElement.textContent = 'Willkommen zurück';
            if (subtitleElement) subtitleElement.textContent = 'Bitte melde dich an, um fortzufahren.';
        } else {
            if (titleElement) titleElement.textContent = 'Mitglied werden';
            if (subtitleElement) subtitleElement.textContent = 'Werde Teil der nachhaltigen Bewegung.';
        }

        // Show/hide name field
        if (nameField) {
            nameField.style.display = mode === 'register' ? 'block' : 'none';
            const nameInput = nameField.querySelector('input');
            if (nameInput) nameInput.required = mode === 'register';
        }

        // Show/hide login options (remember me, forgot password)
        const loginOptions = document.getElementById('loginOptions');
        if (loginOptions) {
            loginOptions.style.display = mode === 'login' ? 'flex' : 'none';
        }

        // Update submit button
        if (submitButton) {
            submitButton.classList.remove('login-submit', 'register-submit');
            submitButton.classList.add(mode === 'login' ? 'login-submit' : 'register-submit');
        }

        const submitText = document.getElementById('submitText');
        if (submitText) {
            submitText.textContent = mode === 'login' ? 'Jetzt Einloggen' : 'Konto erstellen';
        }

        // Update password autocomplete
        const passwordInput = document.getElementById('authPassword');
        if (passwordInput) {
            passwordInput.autocomplete = mode === 'login' ? 'current-password' : 'new-password';
        }

        // Clear messages
        hideError();
        hideSuccess();

        console.log('[AuthModal] Switched to mode:', mode);
    }

    // Toggle Password Visibility
    function togglePassword() {
        const passwordInput = document.getElementById('authPassword');
        const eyeIcon = document.getElementById('eyeIcon');

        if (!passwordInput || !eyeIcon) return;

        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';

        // Update icon
        eyeIcon.innerHTML = isPassword
            ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>'
            : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
    }

    // Handle Form Submit
    async function handleSubmit(event) {
        event.preventDefault();

        const email = document.getElementById('authEmail')?.value?.trim();
        const password = document.getElementById('authPassword')?.value;
        const name = document.getElementById('authName')?.value?.trim();
        const remember = document.getElementById('rememberMe')?.checked;

        // Validation
        if (!email || !validateEmail(email)) {
            showError('Bitte gib eine gültige E-Mail-Adresse ein.');
            return;
        }

        if (!password || password.length < 6) {
            showError('Das Passwort muss mindestens 6 Zeichen lang sein.');
            return;
        }

        if (currentMode === 'register' && !name) {
            showError('Bitte gib deinen Namen ein.');
            return;
        }

        // Show loading
        setLoading(true);
        hideError();

        try {
            const API_BASE = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : '';

            if (currentMode === 'login') {
                // Login Request
                const response = await fetch(`${API_BASE}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'Anmeldung fehlgeschlagen.');
                }

                // Store user data
                if (data.user) {
                    localStorage.setItem('cssberlin_user', JSON.stringify(data.user));
                    if (data.token) {
                        localStorage.setItem('cssberlin_token', data.token);
                    }
                }

                showSuccess('Erfolgreich angemeldet! Wird weitergeleitet...');

                // Reload page after delay
                setTimeout(() => {
                    closeModal();
                    window.location.reload();
                }, 1500);

            } else {
                // Register Request
                const response = await fetch(`${API_BASE}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, firstName: name })
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'Registrierung fehlgeschlagen.');
                }

                showSuccess('Konto erstellt! Bitte überprüfe deine E-Mails.');

                // Switch to login after delay
                setTimeout(() => {
                    switchMode('login');
                    document.getElementById('authEmail').value = email;
                }, 2000);
            }

        } catch (error) {
            console.error('[AuthModal] Submit error:', error);
            showError(error.message || 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
        } finally {
            setLoading(false);
        }
    }

    // Show Magic Link Form
    function showMagicLinkForm(event) {
        if (event) event.preventDefault();

        const mainForm = authForm;
        const magicForm = document.getElementById('magicLinkForm');
        const divider = document.querySelector('.auth-divider');
        const socialBtns = document.querySelector('.auth-social-buttons');

        if (mainForm) mainForm.style.display = 'none';
        if (magicForm) magicForm.classList.add('active');
        if (divider) divider.style.display = 'none';
        if (socialBtns) socialBtns.style.display = 'none';

        // Update title
        if (titleElement) titleElement.textContent = 'Passwort vergessen?';
        if (subtitleElement) subtitleElement.textContent = 'Wir senden dir einen Login-Link.';

        // Pre-fill email if available
        const currentEmail = document.getElementById('authEmail')?.value;
        if (currentEmail) {
            document.getElementById('magicEmail').value = currentEmail;
        }
    }

    // Hide Magic Link Form
    function hideMagicLinkForm() {
        const mainForm = authForm;
        const magicForm = document.getElementById('magicLinkForm');
        const divider = document.querySelector('.auth-divider');
        const socialBtns = document.querySelector('.auth-social-buttons');

        if (mainForm) mainForm.style.display = 'flex';
        if (magicForm) magicForm.classList.remove('active');
        if (divider) divider.style.display = 'flex';
        if (socialBtns) socialBtns.style.display = 'flex';

        // Reset title based on current mode
        switchMode(currentMode);
    }

    // Send Magic Link
    async function sendMagicLink(event) {
        event.preventDefault();

        const email = document.getElementById('magicEmail')?.value?.trim();

        if (!email || !validateEmail(email)) {
            showError('Bitte gib eine gültige E-Mail-Adresse ein.');
            return;
        }

        const magicSubmit = document.getElementById('magicSubmit');
        if (magicSubmit) magicSubmit.classList.add('loading');

        hideError();

        try {
            const API_BASE = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : '';

            const response = await fetch(`${API_BASE}/api/auth/magic-link`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Magic Link konnte nicht gesendet werden.');
            }

            showSuccess('Magic Link wurde gesendet! Bitte überprüfe deine E-Mails.');

        } catch (error) {
            console.error('[AuthModal] Magic link error:', error);
            showError(error.message || 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
        } finally {
            if (magicSubmit) magicSubmit.classList.remove('loading');
        }
    }

    // Login with Google
    function loginWithGoogle() {
        console.log('[AuthModal] Google login initiated');

        // Check if Google Sign-In is available
        if (typeof google !== 'undefined' && google.accounts) {
            // Use existing Google Sign-In
            google.accounts.id.prompt();
        } else if (typeof handleGoogleSignIn === 'function') {
            // Use existing handler
            handleGoogleSignIn();
        } else {
            showError('Google Sign-In ist derzeit nicht verfügbar.');
        }
    }

    // Login with Apple
    function loginWithApple() {
        console.log('[AuthModal] Apple login initiated');
        showError('Apple Sign-In wird bald verfügbar sein.');
    }

    // Validation Helper
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Show/Hide Error
    function showError(message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    function hideError() {
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    // Show/Hide Success
    function showSuccess(message) {
        if (successElement) {
            successElement.textContent = message;
            successElement.classList.add('show');
        }
    }

    function hideSuccess() {
        if (successElement) {
            successElement.textContent = '';
            successElement.classList.remove('show');
        }
    }

    // Loading State
    function setLoading(isLoading) {
        if (submitButton) {
            submitButton.classList.toggle('loading', isLoading);
            submitButton.disabled = isLoading;
        }
    }

    // Focus Trap
    function trapFocus(e) {
        const focusableElements = modalElement?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    }

    // Google Sign-In Callback Handler (for modal)
    window.handleGoogleSignInModal = async function(response) {
        if (!response.credential) {
            showError('Google Sign-In fehlgeschlagen.');
            return;
        }

        setLoading(true);
        hideError();

        try {
            const API_BASE = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : '';

            const apiResponse = await fetch(`${API_BASE}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: response.credential })
            });

            const data = await apiResponse.json();

            if (!apiResponse.ok || !data.success) {
                throw new Error(data.message || 'Google Sign-In fehlgeschlagen.');
            }

            // Store user data
            if (data.user) {
                localStorage.setItem('cssberlin_user', JSON.stringify(data.user));
                if (data.token) {
                    localStorage.setItem('cssberlin_token', data.token);
                }
            }

            showSuccess('Erfolgreich mit Google angemeldet!');

            setTimeout(() => {
                closeModal();
                window.location.reload();
            }, 1500);

        } catch (error) {
            console.error('[AuthModal] Google sign-in error:', error);
            showError(error.message || 'Ein Fehler ist aufgetreten.');
        } finally {
            setLoading(false);
        }
    };

    // Public API
    window.authModal = {
        init: initAuthModal,
        open: openModal,
        close: closeModal,
        switchMode: switchMode,
        togglePassword: togglePassword,
        handleSubmit: handleSubmit,
        showMagicLink: showMagicLinkForm,
        hideMagicLink: hideMagicLinkForm,
        sendMagicLink: sendMagicLink,
        loginWithGoogle: loginWithGoogle,
        loginWithApple: loginWithApple,
        isOpen: () => isModalOpen
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuthModal);
    } else {
        initAuthModal();
    }

})();
