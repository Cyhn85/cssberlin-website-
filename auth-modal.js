// CSS Berlin - Vinted Style Auth Modal System
// Combines Login and Register in a single modal popup

class AuthModal {
    constructor() {
        this.modal = null;
        this.currentView = 'login'; // 'login' or 'register'
        this.init();
    }

    init() {
        this.createModal();
        this.bindEvents();
    }

    createModal() {
        const modalHTML = `
        <div id="authModal" class="auth-modal-overlay" style="display: none;">
            <div class="auth-modal-container">
                <button class="auth-modal-close" onclick="authModal.close()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div class="auth-modal-content">
                    <h2 class="auth-modal-title" id="authModalTitle">Willkommen zurück!</h2>

                    <!-- Social Login Buttons -->
                    <div class="auth-social-buttons">
                        <button type="button" class="auth-social-btn" id="googleAuthBtn">
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span>Weiter mit Google</span>
                        </button>

                        <button type="button" class="auth-social-btn" id="appleAuthBtn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                            <span>Weiter mit Apple</span>
                        </button>

                        <button type="button" class="auth-social-btn" id="facebookAuthBtn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            <span>Weiter mit Facebook</span>
                        </button>
                    </div>

                    <!-- Divider -->
                    <div class="auth-divider">
                        <span>oder</span>
                    </div>

                    <!-- Email Login Link -->
                    <div class="auth-email-section">
                        <a href="#" class="auth-email-link" id="emailAuthLink">
                            Einloggen mit <span style="color: #2D5016; font-weight: 600;">E-Mail</span>
                        </a>
                    </div>

                    <!-- Email Form (hidden by default) -->
                    <div class="auth-email-form" id="emailFormSection" style="display: none;">
                        <form id="authEmailForm">
                            <!-- Login Fields -->
                            <div id="loginFields">
                                <div class="auth-form-group">
                                    <input type="email" id="authEmail" class="auth-input" placeholder="E-Mail" required>
                                </div>
                                <div class="auth-form-group">
                                    <input type="password" id="authPassword" class="auth-input" placeholder="Passwort" required>
                                </div>
                            </div>

                            <!-- Register Fields (hidden by default) -->
                            <div id="registerFields" style="display: none;">
                                <div class="auth-form-group">
                                    <input type="text" id="authFirstName" class="auth-input" placeholder="Vorname">
                                </div>
                                <div class="auth-form-group">
                                    <input type="text" id="authLastName" class="auth-input" placeholder="Nachname">
                                </div>
                                <div class="auth-form-group">
                                    <input type="email" id="authRegEmail" class="auth-input" placeholder="E-Mail">
                                </div>
                                <div class="auth-form-group">
                                    <input type="password" id="authRegPassword" class="auth-input" placeholder="Passwort (min. 8 Zeichen)" minlength="8">
                                </div>
                                <div class="auth-checkbox-group">
                                    <input type="checkbox" id="authTerms">
                                    <label for="authTerms">
                                        Ich akzeptiere die <a href="agb.html" target="_blank">AGB</a> und
                                        <a href="datenschutz.html" target="_blank">Datenschutzbestimmungen</a>
                                    </label>
                                </div>
                            </div>

                            <button type="submit" class="auth-submit-btn" id="authSubmitBtn">Anmelden</button>
                        </form>
                    </div>

                    <!-- Footer -->
                    <div class="auth-modal-footer">
                        <p id="authFooterText">
                            Du hast noch keinen Account?
                            <a href="#" id="authSwitchLink">Registrieren</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('authModal');
        this.addStyles();
    }

    addStyles() {
        const styles = `
        <style id="authModalStyles">
            .auth-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(4px);
            }

            .auth-modal-container {
                background: white;
                border-radius: 16px;
                width: 90%;
                max-width: 420px;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: modalSlideIn 0.3s ease;
            }

            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .auth-modal-close {
                position: absolute;
                top: 16px;
                right: 16px;
                background: none;
                border: none;
                cursor: pointer;
                padding: 8px;
                border-radius: 50%;
                transition: background 0.2s;
            }

            .auth-modal-close:hover {
                background: #f0f0f0;
            }

            .auth-modal-content {
                padding: 48px 32px 32px;
            }

            .auth-modal-title {
                font-size: 24px;
                font-weight: 700;
                text-align: center;
                margin-bottom: 32px;
                color: #333;
            }

            .auth-social-buttons {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .auth-social-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                width: 100%;
                padding: 14px 24px;
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                font-size: 15px;
                font-weight: 500;
                color: #333;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .auth-social-btn:hover {
                background: #f5f5f5;
                border-color: #ccc;
            }

            .auth-divider {
                display: flex;
                align-items: center;
                margin: 24px 0;
            }

            .auth-divider::before,
            .auth-divider::after {
                content: '';
                flex: 1;
                height: 1px;
                background: #e0e0e0;
            }

            .auth-divider span {
                padding: 0 16px;
                color: #757575;
                font-size: 14px;
            }

            .auth-email-section {
                text-align: center;
            }

            .auth-email-link {
                color: #333;
                text-decoration: none;
                font-size: 15px;
            }

            .auth-email-link:hover {
                text-decoration: underline;
            }

            .auth-email-form {
                margin-top: 20px;
            }

            .auth-form-group {
                margin-bottom: 16px;
            }

            .auth-input {
                width: 100%;
                padding: 14px 16px;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                font-size: 15px;
                transition: border-color 0.2s;
                box-sizing: border-box;
            }

            .auth-input:focus {
                outline: none;
                border-color: #2D5016;
            }

            .auth-checkbox-group {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                margin-bottom: 16px;
            }

            .auth-checkbox-group input {
                margin-top: 4px;
            }

            .auth-checkbox-group label {
                font-size: 13px;
                color: #666;
                line-height: 1.4;
            }

            .auth-checkbox-group a {
                color: #2D5016;
            }

            .auth-submit-btn {
                width: 100%;
                padding: 14px;
                background: #2D5016;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }

            .auth-submit-btn:hover {
                background: #1e3a0f;
                transform: translateY(-1px);
            }

            .auth-modal-footer {
                text-align: center;
                margin-top: 24px;
                padding-top: 24px;
                border-top: 1px solid #e0e0e0;
            }

            .auth-modal-footer p {
                color: #666;
                font-size: 14px;
            }

            .auth-modal-footer a {
                color: #2D5016;
                font-weight: 600;
                text-decoration: none;
            }

            .auth-modal-footer a:hover {
                text-decoration: underline;
            }

            @media (max-width: 480px) {
                .auth-modal-container {
                    width: 95%;
                    margin: 16px;
                }

                .auth-modal-content {
                    padding: 40px 24px 24px;
                }
            }
        </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    bindEvents() {
        // Close on overlay click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display !== 'none') {
                this.close();
            }
        });

        // Email link toggle
        document.getElementById('emailAuthLink').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('emailFormSection').style.display = 'block';
            e.target.parentElement.style.display = 'none';
        });

        // Switch between login/register
        document.getElementById('authSwitchLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleView();
        });

        // Form submit
        document.getElementById('authEmailForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Google Auth
        document.getElementById('googleAuthBtn').addEventListener('click', () => {
            this.handleGoogleAuth();
        });

        // Apple Auth (placeholder)
        document.getElementById('appleAuthBtn').addEventListener('click', () => {
            toast.info('Bald verfügbar', 'Apple-Anmeldung wird in Kürze verfügbar sein.', 2000);
        });

        // Facebook Auth (placeholder)
        document.getElementById('facebookAuthBtn').addEventListener('click', () => {
            toast.info('Bald verfügbar', 'Facebook-Anmeldung wird in Kürze verfügbar sein.', 2000);
        });
    }

    open(view = 'login') {
        this.currentView = view;
        this.updateView();
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Reset form
        document.getElementById('emailFormSection').style.display = 'none';
        document.getElementById('authEmailForm').reset();
        document.querySelector('.auth-email-section').style.display = 'block';
    }

    close() {
        this.modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    toggleView() {
        this.currentView = this.currentView === 'login' ? 'register' : 'login';
        this.updateView();
    }

    updateView() {
        const title = document.getElementById('authModalTitle');
        const loginFields = document.getElementById('loginFields');
        const registerFields = document.getElementById('registerFields');
        const submitBtn = document.getElementById('authSubmitBtn');
        const footerText = document.getElementById('authFooterText');

        if (this.currentView === 'login') {
            title.textContent = 'Willkommen zurück!';
            loginFields.style.display = 'block';
            registerFields.style.display = 'none';
            submitBtn.textContent = 'Anmelden';
            footerText.innerHTML = 'Du hast noch keinen Account? <a href="#" id="authSwitchLink">Registrieren</a>';
        } else {
            title.textContent = 'Konto erstellen';
            loginFields.style.display = 'none';
            registerFields.style.display = 'block';
            submitBtn.textContent = 'Registrieren';
            footerText.innerHTML = 'Bereits registriert? <a href="#" id="authSwitchLink">Anmelden</a>';
        }

        // Re-bind switch link
        document.getElementById('authSwitchLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleView();
        });
    }

    handleSubmit() {
        if (this.currentView === 'login') {
            this.handleLogin();
        } else {
            this.handleRegister();
        }
    }

    handleLogin() {
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('cssberlin_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Check if email is verified
            if (!user.verified && user.loginMethod !== 'google') {
                toast.error('E-Mail nicht bestätigt', 'Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse.', 3000);
                sessionStorage.setItem('pending_verification_email', email);
                this.close();
                setTimeout(() => {
                    window.location.href = 'verify-email.html';
                }, 1000);
                return;
            }

            // Login successful - use existing login function from auth.js
            if (typeof login === 'function') {
                login(user, false);
            } else {
                // Fallback if auth.js not loaded
                const session = {
                    userId: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    loginTime: new Date().toISOString()
                };
                sessionStorage.setItem('cssberlin_session', JSON.stringify(session));
            }

            toast.success('Erfolgreich angemeldet!', `Willkommen zurück, ${user.firstName}!`, 2000);

            // Check for admin
            const ADMIN_EMAIL = 'info@cssberlin.de';
            if (user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
                sessionStorage.setItem('adminToken', 'user_admin_' + Date.now());
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1000);
            } else {
                // Check for redirect after login
                const redirectUrl = sessionStorage.getItem('redirect_after_login') || null;
                sessionStorage.removeItem('redirect_after_login');

                this.close();
                setTimeout(() => {
                    if (redirectUrl) {
                        window.location.href = redirectUrl;
                    } else {
                        window.location.reload();
                    }
                }, 1000);
            }
        } else {
            toast.error('Anmeldung fehlgeschlagen', 'E-Mail oder Passwort ist falsch.', 3000);
        }
    }

    handleRegister() {
        const firstName = document.getElementById('authFirstName').value;
        const lastName = document.getElementById('authLastName').value;
        const email = document.getElementById('authRegEmail').value;
        const password = document.getElementById('authRegPassword').value;
        const terms = document.getElementById('authTerms').checked;

        // Validation
        if (!firstName || !lastName || !email || !password) {
            toast.error('Fehler', 'Bitte füllen Sie alle Felder aus.', 3000);
            return;
        }

        if (password.length < 8) {
            toast.error('Fehler', 'Das Passwort muss mindestens 8 Zeichen lang sein.', 3000);
            return;
        }

        if (!terms) {
            toast.error('Fehler', 'Bitte akzeptieren Sie die AGB und Datenschutzbestimmungen.', 3000);
            return;
        }

        // Check if email exists
        const users = JSON.parse(localStorage.getItem('cssberlin_users') || '[]');
        if (users.find(u => u.email === email)) {
            toast.error('Fehler', 'Diese E-Mail-Adresse ist bereits registriert.', 3000);
            return;
        }

        // Generate verification code (6-digit)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Create new user (unverified)
        const newUser = {
            id: 'user_' + Date.now(),
            firstName,
            lastName,
            email,
            password,
            verified: false,
            verificationCode,
            createdAt: new Date().toISOString(),
            wishlist: [],
            negotiations: [],
            loginMethod: 'email'
        };

        users.push(newUser);
        localStorage.setItem('cssberlin_users', JSON.stringify(users));

        // Send verification email via EmailJS
        if (typeof emailjs !== 'undefined') {
            try {
                const templateParams = {
                    to_email: email,
                    to_name: `${firstName} ${lastName}`,
                    from_name: 'CSS Berlin',
                    subject: 'E-Mail Bestätigung - CSS Berlin',
                    verification_code: verificationCode,
                    message: `Hallo ${firstName},

vielen Dank für Ihre Registrierung bei CSS Berlin!

Ihr Bestätigungscode lautet: ${verificationCode}

Bitte geben Sie diesen Code auf der Bestätigungsseite ein, um Ihr Konto zu aktivieren.

Der Code ist 24 Stunden gültig.

Mit freundlichen Grüßen
Ihr CSS Berlin Team
Climate Smart Solutions`
                };

                emailjs.send(
                    'service_x3phsl7',
                    'template_icqfar5',
                    templateParams,
                    'ZOprGu7EjDZmGl4ql'
                ).then(() => {
                    console.log('✅ Verification email sent');
                }).catch((err) => {
                    console.error('❌ Email error:', err);
                    console.log('📧 Verification Code (Fallback):', verificationCode);
                });
            } catch (e) {
                console.error('Email send error:', e);
                console.log('📧 Verification Code (Fallback):', verificationCode);
            }
        } else {
            console.log('📧 Verification Code (Demo):', verificationCode);
        }

        // Store email for verification page
        sessionStorage.setItem('pending_verification_email', email);

        toast.success(
            'Registrierung erfolgreich!',
            `Ein Bestätigungscode wurde an ${email} gesendet.`,
            3000
        );

        this.close();
        setTimeout(() => {
            window.location.href = 'verify-email.html';
        }, 1500);
    }

    handleGoogleAuth() {
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.prompt();
        } else {
            toast.error('Fehler', 'Google-Anmeldung ist derzeit nicht verfügbar.', 3000);
        }
    }
}

// Initialize modal
let authModal;
document.addEventListener('DOMContentLoaded', function() {
    authModal = new AuthModal();

    // Override header login/register buttons to open modal
    const loginBtns = document.querySelectorAll('a[href="login.html"]');
    const registerBtns = document.querySelectorAll('a[href="registrieren.html"]');

    loginBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            authModal.open('login');
        });
    });

    registerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            authModal.open('register');
        });
    });
});

// Google Sign-In callback for modal
function handleGoogleSignInModal(response) {
    const userObject = parseJwt(response.credential);

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
        existingUsers.push(googleUser);
        localStorage.setItem('cssberlin_users', JSON.stringify(existingUsers));
        user = googleUser;
        toast.success('Konto erstellt!', `Willkommen bei CSS Berlin, ${user.firstName}!`, 2000);
    } else {
        toast.success('Erfolgreich angemeldet!', `Willkommen zurück, ${user.firstName}!`, 2000);
    }

    login(user, false);

    // Check for admin
    const ADMIN_EMAIL = 'info@cssberlin.de';
    if (user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        sessionStorage.setItem('adminToken', 'user_admin_' + Date.now());
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
    } else {
        if (authModal) authModal.close();
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// Parse JWT helper
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}
