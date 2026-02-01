/**
 * CSS Berlin - Authentication System
 * Local storage based authentication for demo purposes
 */

// Initialize toast if not available
if (typeof toast === 'undefined') {
    window.toast = {
        success: function(title, message) { console.log('Success:', title, message); },
        error: function(title, message) { console.log('Error:', title, message); },
        info: function(title, message) { console.log('Info:', title, message); }
    };
}

/**
 * Register a new user
 */
async function register(userData) {
    try {
        if (!window.api && typeof APIClient !== 'undefined') {
            window.api = new APIClient();
        }

        if (!window.api || typeof window.api.register !== 'function') {
            throw new Error('API client not available');
        }

        const created = await window.api.register({
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName
        });

        return { success: true, user: created };
    } catch (error) {
        return { success: false, error: error.message || 'Registrierung fehlgeschlagen.' };
    }
}

/**
 * Login user
 */
async function login(email, password, redirect = true) {
    try {
        const baseURL = (typeof API_CONFIG !== 'undefined' && API_CONFIG.current) ? API_CONFIG.current : (window.API_BASE || '');
        const url = `${baseURL}/api/token`;

        const body = new URLSearchParams();
        body.set('username', email);
        body.set('password', password);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body.toString()
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'E-Mail oder Passwort ist falsch');
        }

        if (data.access_token) {
            localStorage.setItem('cssberlin_token', data.access_token);
            localStorage.setItem('auth_token', data.access_token);
        }

        if (data.user) {
            const sessionUser = {
                id: data.user.id,
                firstName: data.user.first_name,
                lastName: data.user.last_name,
                email: data.user.email,
                picture: null,
                loginMethod: 'email'
            };
            localStorage.setItem('cssberlin_current_user', JSON.stringify(sessionUser));
        }

        if (redirect) {
            window.location.href = 'index.html';
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message || 'Login fehlgeschlagen.' };
    }
}

async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('cssberlin_token') || localStorage.getItem('auth_token');
    const headers = {
        ...(options.headers || {})
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return fetch(url, {
        ...options,
        headers
    });
}

/**
 * Logout user
 */
function logout() {
    localStorage.removeItem('cssberlin_current_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('cssberlin_token');
    sessionStorage.removeItem('cssberlin_session');
    window.location.href = 'index.html';
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return localStorage.getItem('cssberlin_token') !== null || localStorage.getItem('auth_token') !== null;
}

/**
 * Get current user
 */
function getCurrentUser() {
    const userJson = localStorage.getItem('cssberlin_current_user');
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * Authenticate user with email/password
 */
async function authenticate(email, password) {
    const result = await login(email, password, false);
    if (!result.success) {
        return { success: false, error: result.error };
    }
    return { success: true, user: getCurrentUser() };
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

            // Register user
            const result = await register({
                firstName,
                lastName,
                email,
                password,
                newsletter
            });

            if (result.success) {
                // Show success message
                if (typeof toast !== 'undefined') {
                    toast.success(
                        'Konto erstellt!',
                        `Willkommen bei CSS Berlin, ${firstName}! Ihr Konto wurde erfolgreich erstellt.`
                    );
                }

                // Login the user
                const loginResult = await login(email, password, false);
                if (!loginResult.success) {
                    showError(loginResult.error);
                    return;
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

            const result = await authenticate(email, password);

            if (result.success) {
                if (typeof toast !== 'undefined') {
                    toast.success('Angemeldet!', `Willkommen zurück, ${result.user.firstName}!`);
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

console.log('CSS Berlin Auth System loaded');
