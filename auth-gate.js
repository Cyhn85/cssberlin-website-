/**
 * CSS Berlin - Auth Gate System
 * Login gate for protected actions (favorites, buy, negotiate)
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
        const token = localStorage.getItem('auth_token');
        if (!token) {
            this.isAuthenticated = false;
            return false;
        }

        try {
            const response = await fetch(window.API_CONFIG.BASE_URL + '/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                this.currentUser = await response.json();
                this.isAuthenticated = true;
                return true;
            } else {
                // Token invalid, clear it
                localStorage.removeItem('auth_token');
                this.isAuthenticated = false;
                return false;
            }
        } catch (error) {
            console.error('Auth check error:', error);
            this.isAuthenticated = false;
            return false;
        }
    }

    /**
     * Show login modal
     */
    showLoginModal(action = 'Diese Aktion', redirectUrl = null) {
        // Check if modal already exists
        let modal = document.getElementById('auth-gate-modal');
        if (!modal) {
            modal = this.createLoginModal();
            document.body.appendChild(modal);
        }

        // Update action text
        const actionText = modal.querySelector('.auth-gate-action');
        if (actionText) {
            actionText.textContent = action;
        }

        // Store redirect URL if provided
        if (redirectUrl) {
            modal.dataset.redirectUrl = redirectUrl;
        }

        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
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
     * Create login modal HTML
     */
    createLoginModal() {
        const modal = document.createElement('div');
        modal.id = 'auth-gate-modal';
        modal.className = 'auth-gate-modal';
        modal.innerHTML = `
            <div class="auth-gate-overlay"></div>
            <div class="auth-gate-content">
                <button class="auth-gate-close" onclick="authGate.hideLoginModal()">&times;</button>

                <div class="auth-gate-header">
                    <h2>Anmeldung erforderlich</h2>
                    <p><span class="auth-gate-action">Diese Aktion</span> erfordert eine Anmeldung.</p>
                </div>

                <div class="auth-gate-body">
                    <div class="auth-gate-tabs">
                        <button class="auth-gate-tab active" data-tab="login">Anmelden</button>
                        <button class="auth-gate-tab" data-tab="register">Registrieren</button>
                    </div>

                    <!-- Login Form -->
                    <form id="auth-gate-login-form" class="auth-gate-form active">
                        <div class="form-group">
                            <label for="login-email">E-Mail</label>
                            <input type="email" id="login-email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="login-password">Passwort</label>
                            <input type="password" id="login-password" name="password" required>
                        </div>
                        <button type="submit" class="btn-primary">Anmelden</button>
                        <div class="auth-gate-links">
                            <a href="forgot-password.html">Passwort vergessen?</a>
                        </div>
                    </form>

                    <!-- Register Form -->
                    <form id="auth-gate-register-form" class="auth-gate-form">
                        <div class="form-group">
                            <label for="register-email">E-Mail</label>
                            <input type="email" id="register-email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="register-firstname">Vorname</label>
                            <input type="text" id="register-firstname" name="first_name" required>
                        </div>
                        <div class="form-group">
                            <label for="register-lastname">Nachname</label>
                            <input type="text" id="register-lastname" name="last_name" required>
                        </div>
                        <div class="form-group">
                            <label for="register-password">Passwort</label>
                            <input type="password" id="register-password" name="password" required minlength="6">
                        </div>
                        <div class="form-group">
                            <label for="register-password2">Passwort bestätigen</label>
                            <input type="password" id="register-password2" name="password2" required>
                        </div>
                        <button type="submit" class="btn-primary">Registrieren</button>
                    </form>

                    <!-- OAuth Buttons -->
                    <div class="auth-gate-oauth">
                        <div class="oauth-divider">
                            <span>oder</span>
                        </div>
                        <button class="oauth-btn google-btn" onclick="authGate.loginWithGoogle()">
                            <svg width="18" height="18" viewBox="0 0 18 18">
                                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                                <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.335z"/>
                                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                            </svg>
                            Mit Google fortfahren
                        </button>
                    </div>
                </div>

                <div class="auth-gate-error" style="display: none;"></div>
            </div>
        `;

        // Add event listeners
        this.attachModalEvents(modal);

        return modal;
    }

    /**
     * Attach event listeners to modal
     */
    attachModalEvents(modal) {
        // Tab switching
        const tabs = modal.querySelectorAll('.auth-gate-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const tabName = tab.dataset.tab;
                modal.querySelectorAll('.auth-gate-form').forEach(form => {
                    form.classList.remove('active');
                });
                modal.querySelector(`#auth-gate-${tabName}-form`).classList.add('active');
            });
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

            delete data.password2;
            await this.handleRegister(data);
        });

        // Close on overlay click
        const overlay = modal.querySelector('.auth-gate-overlay');
        overlay.addEventListener('click', () => this.hideLoginModal());
    }

    /**
     * Handle login
     */
    async handleLogin(data) {
        try {
            const response = await fetch(window.API_CONFIG.BASE_URL + '/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                // Save token
                localStorage.setItem('auth_token', result.access_token);
                this.currentUser = result.user;
                this.isAuthenticated = true;

                // Hide modal
                this.hideLoginModal();

                // Redirect if URL provided
                const modal = document.getElementById('auth-gate-modal');
                const redirectUrl = modal?.dataset.redirectUrl;
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                } else {
                    // Reload page to update UI
                    window.location.reload();
                }
            } else {
                this.showError(result.detail || 'Anmeldung fehlgeschlagen');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Verbindungsfehler. Bitte versuchen Sie es später erneut.');
        }
    }

    /**
     * Handle registration
     */
    async handleRegister(data) {
        try {
            const response = await fetch(window.API_CONFIG.BASE_URL + '/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                // Auto-login after registration
                await this.handleLogin({
                    email: data.email,
                    password: data.password
                });
            } else {
                this.showError(result.detail || 'Registrierung fehlgeschlagen');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showError('Verbindungsfehler. Bitte versuchen Sie es später erneut.');
        }
    }

    /**
     * Google OAuth login
     */
    loginWithGoogle() {
        // TODO: Implement Google OAuth
        window.location.href = window.API_CONFIG.BASE_URL + '/api/auth/google/authorize';
    }

    /**
     * Show error message
     */
    showError(message) {
        const modal = document.getElementById('auth-gate-modal');
        const errorDiv = modal?.querySelector('.auth-gate-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';

            // Hide after 5 seconds
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
    }

    /**
     * Require authentication for action
     * @param {string} actionName - Name of the action (e.g., "Zu Favoriten hinzufügen")
     * @param {Function} callback - Function to execute if authenticated
     * @param {string} redirectUrl - Optional URL to redirect after login
     */
    async requireAuth(actionName, callback, redirectUrl = null) {
        await this.checkAuthStatus();

        if (this.isAuthenticated) {
            // User is authenticated, execute callback
            if (typeof callback === 'function') {
                return callback();
            }
        } else {
            // Show login modal
            this.showLoginModal(actionName, redirectUrl);
        }
    }

    /**
     * Logout
     */
    logout() {
        localStorage.removeItem('auth_token');
        this.isAuthenticated = false;
        this.currentUser = null;
        window.location.reload();
    }
}

// Initialize global authGate instance
const authGate = new AuthGate();

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
    .auth-gate-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        align-items: center;
        justify-content: center;
    }

    .auth-gate-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
    }

    .auth-gate-content {
        position: relative;
        background: white;
        border-radius: 16px;
        max-width: 480px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .auth-gate-close {
        position: absolute;
        top: 16px;
        right: 16px;
        background: none;
        border: none;
        font-size: 32px;
        color: #666;
        cursor: pointer;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s;
    }

    .auth-gate-close:hover {
        background: #f0f0f0;
        color: #333;
    }

    .auth-gate-header {
        padding: 40px 40px 20px;
        text-align: center;
    }

    .auth-gate-header h2 {
        margin: 0 0 12px;
        font-size: 28px;
        color: #2D5016;
    }

    .auth-gate-header p {
        margin: 0;
        color: #666;
        font-size: 16px;
    }

    .auth-gate-action {
        font-weight: 600;
        color: #FF8C42;
    }

    .auth-gate-body {
        padding: 0 40px 40px;
    }

    .auth-gate-tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 24px;
        border-bottom: 2px solid #e0e0e0;
    }

    .auth-gate-tab {
        flex: 1;
        padding: 12px;
        background: none;
        border: none;
        border-bottom: 3px solid transparent;
        font-size: 16px;
        font-weight: 600;
        color: #666;
        cursor: pointer;
        transition: all 0.2s;
        margin-bottom: -2px;
    }

    .auth-gate-tab.active {
        color: #2D5016;
        border-bottom-color: #2D5016;
    }

    .auth-gate-form {
        display: none;
    }

    .auth-gate-form.active {
        display: block;
    }

    .auth-gate-form .form-group {
        margin-bottom: 20px;
    }

    .auth-gate-form label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #333;
        font-size: 14px;
    }

    .auth-gate-form input {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 16px;
        transition: border-color 0.2s;
    }

    .auth-gate-form input:focus {
        outline: none;
        border-color: #2D5016;
    }

    .auth-gate-form .btn-primary {
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

    .auth-gate-form .btn-primary:hover {
        background: #1a3009;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(45, 80, 22, 0.3);
    }

    .auth-gate-links {
        text-align: center;
        margin-top: 16px;
    }

    .auth-gate-links a {
        color: #FF8C42;
        text-decoration: none;
        font-size: 14px;
    }

    .auth-gate-links a:hover {
        text-decoration: underline;
    }

    .auth-gate-oauth {
        margin-top: 24px;
    }

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
        background: #e0e0e0;
    }

    .oauth-divider span {
        position: relative;
        background: white;
        padding: 0 16px;
        color: #999;
        font-size: 14px;
    }

    .oauth-btn {
        width: 100%;
        padding: 12px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        background: white;
        cursor: pointer;
        font-size: 16px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        transition: all 0.2s;
        margin-bottom: 12px;
    }

    .oauth-btn:hover {
        border-color: #ccc;
        background: #f9f9f9;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .auth-gate-error {
        margin-top: 20px;
        padding: 12px;
        background: #fee;
        border: 1px solid #fcc;
        border-radius: 8px;
        color: #c33;
        font-size: 14px;
        text-align: center;
    }
`;
document.head.appendChild(style);
