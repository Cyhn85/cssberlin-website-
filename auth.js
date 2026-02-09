/**
 * CSS Berlin - JWT Authentication System
 * Secure authentication with JWT tokens and httpOnly cookies
 */

// Initialize toast if not available
if (typeof toast === 'undefined') {
    window.toast = {
        success: function(title, message) { console.log('Success:', title, message); },
        error: function(title, message) { console.log('Error:', title, message); },
        info: function(title, message) { console.log('Info:', title, message); }
    };
}

// JWT Token Management
class JWTAuth {
    constructor() {
        this.baseURL = (typeof API_CONFIG !== 'undefined' && API_CONFIG.current) ? API_CONFIG.current : (window.API_BASE || '');
        this.token = null;
        this.user = null;
        this.init();
    }

    init() {
        // Check if we have a token in localStorage (for development)
        const storedToken = localStorage.getItem('jwt_token');
        if (storedToken) {
            this.token = storedToken;
            this.validateToken();
        }
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('jwt_token', token);
    }

    clearToken() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('jwt_token');
    }

    async validateToken() {
        if (!this.token) return false;

        try {
            const response = await fetch(`${this.baseURL}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                this.user = await response.json();
                return true;
            } else {
                this.clearToken();
                return false;
            }
        } catch (error) {
            console.error('Token validation failed:', error);
            this.clearToken();
            return false;
        }
    }

    async fetchWithAuth(url, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return fetch(url, {
            ...options,
            headers
        });
    }

    getAuthHeaders() {
        return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
    }
}

// Global auth instance
window.auth = new JWTAuth();

/**
 * Register a new user with JWT
 */
async function register(userData) {
    try {
        const baseURL = (typeof API_CONFIG !== 'undefined' && API_CONFIG.current) ? API_CONFIG.current : (window.API_BASE || '');
        const url = `${baseURL}/api/auth/register`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
                lastName: userData.lastName
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || 'Registrierung fehlgeschlagen.');
        }

        // Store JWT token
        if (data.access_token) {
            window.auth.setToken(data.access_token);
        }

        return { success: true, user: data, token: data.access_token };
    } catch (error) {
        return { success: false, error: error.message || 'Registrierung fehlgeschlagen.' };
    }
}

/**
 * Login user with JWT
 */
async function login(email, password, redirect = true) {
    try {
        const baseURL = (typeof API_CONFIG !== 'undefined' && API_CONFIG.current) ? API_CONFIG.current : (window.API_BASE || '');
        const url = `${baseURL}/api/auth/login`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || 'E-Mail oder Passwort ist falsch');
        }

        // Store JWT token
        if (data.access_token) {
            window.auth.setToken(data.access_token);
        }

        // Get user data
        await window.auth.validateToken();

        if (redirect) {
            window.location.href = 'index.html';
        }

        return { success: true, data, user: window.auth.user };
    } catch (error) {
        return { success: false, error: error.message || 'Login fehlgeschlagen.' };
    }
}

/**
 * Google OAuth Login
 */
async function loginWithGoogle(idToken, email, name, picture = null) {
    try {
        const baseURL = (typeof API_CONFIG !== 'undefined' && API_CONFIG.current) ? API_CONFIG.current : (window.API_BASE || '');
        const url = `${baseURL}/api/auth/google`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_token: idToken,
                email: email,
                name: name,
                picture: picture
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || 'Google Login fehlgeschlagen.');
        }

        // Store JWT token
        if (data.access_token) {
            window.auth.setToken(data.access_token);
        }

        // Get user data
        await window.auth.validateToken();

        return { success: true, data, user: window.auth.user };
    } catch (error) {
        return { success: false, error: error.message || 'Google Login fehlgeschlagen.' };
    }
}

/**
 * Magic Link Request
 */
async function requestMagicLink(email) {
    try {
        const baseURL = (typeof API_CONFIG !== 'undefined' && API_CONFIG.current) ? API_CONFIG.current : (window.API_BASE || '');
        const url = `${baseURL}/api/auth/magic-link/request`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || 'Magic Link Anfrage fehlgeschlagen.');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message || 'Magic Link Anfrage fehlgeschlagen.' };
    }
}

/**
 * Password Reset Request
 */
async function requestPasswordReset(email) {
    try {
        const baseURL = (typeof API_CONFIG !== 'undefined' && API_CONFIG.current) ? API_CONFIG.current : (window.API_BASE || '');
        const url = `${baseURL}/api/auth/password-reset/request`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || 'Passwort-Reset Anfrage fehlgeschlagen.');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message || 'Passwort-Reset Anfrage fehlgeschlagen.' };
    }
}

/**
 * Logout user
 */
async function logout() {
    try {
        const baseURL = (typeof API_CONFIG !== 'undefined' && API_CONFIG.current) ? API_CONFIG.current : (window.API_BASE || '');
        
        if (window.auth.token) {
            await fetch(`${baseURL}/api/auth/logout`, { 
                method: 'POST',
                headers: window.auth.getAuthHeaders()
            });
        }
    } catch (error) {
        console.error("Logout failed:", error);
    } finally {
        // Clear local auth state
        window.auth.clearToken();
        
        // Redirect to home
        window.location.href = 'index.html';
    }
}

/**
 * Check if user is logged in
 */
async function isLoggedIn() {
    return await window.auth.validateToken();
}

/**
 * Get current user
 */
function getCurrentUser() {
    return window.auth.user;
}

/**
 * Authenticate user with email/password
 */
async function authenticate(email, password) {
    const result = await login(email, password, false);
    if (!result.success) {
        return { success: false, error: result.error };
    }
    return { success: true, user: result.user };
}

// Registration Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');

    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form values
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.getElementById('terms').checked;
            const newsletter = document.getElementById('newsletter')?.checked || false;

            // Validation
            if (!firstName || !lastName || !email || !password) {
                showError('Bitte füllen Sie alle Pflichtfelder aus.');
                return;
            }

            if (password !== confirmPassword) {
                showError('Die Passwörter stimmen nicht überein.');
                return;
            }

            if (password.length < 8) {
                showError('Das Passwort muss mindestens 8 Zeichen lang sein.');
                return;
            }

            if (!terms) {
                showError('Bitte akzeptieren Sie die AGB und Datenschutzbestimmungen.');
                return;
            }

            // Show loading state
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Wird registriert...';
            submitBtn.disabled = true;

            // Register user
            const result = await register({
                firstName,
                lastName,
                email,
                password,
                newsletter
            });

            // Restore button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            if (result.success) {
                // Show success message
                if (typeof toast !== 'undefined') {
                    toast.success(
                        'Konto erstellt!',
                        `Willkommen bei CSS Berlin, ${firstName}! Ihr Konto wurde erfolgreich erstellt.`
                    );
                }

                // Redirect to home
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showError(result.error);
            }
        });
    }

    // Login Form Handler
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;

            if (!email || !password) {
                showError('Bitte geben Sie E-Mail und Passwort ein.');
                return;
            }

            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Wird angemeldet...';
            submitBtn.disabled = true;

            const result = await authenticate(email, password);

            // Restore button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            if (result.success) {
                if (typeof toast !== 'undefined') {
                    toast.success('Angemeldet!', `Willkommen zurück, ${result.user.first_name}!`);
                }

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                showError(result.error);
            }
        });
    }

    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            errorMessage.style.color = '#dc3545';
            errorMessage.style.background = '#f8d7da';
            errorMessage.style.padding = '12px 16px';
            errorMessage.style.borderRadius = '8px';
            errorMessage.style.marginBottom = '16px';

            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 5000);
        } else if (typeof toast !== 'undefined') {
            toast.error('Fehler', message);
        } else {
            alert(message);
        }
    }
});

// Export functions for global use
window.register = register;
window.login = login;
window.logout = logout;
window.isLoggedIn = isLoggedIn;
window.getCurrentUser = getCurrentUser;
window.authenticate = authenticate;
window.loginWithGoogle = loginWithGoogle;
window.requestMagicLink = requestMagicLink;
window.requestPasswordReset = requestPasswordReset;

console.log('CSS Berlin JWT Auth System loaded');
