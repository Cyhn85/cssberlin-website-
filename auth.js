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
function register(userData) {
    const users = JSON.parse(localStorage.getItem('cssberlin_users') || '[]');

    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
        return { success: false, error: 'Diese E-Mail ist bereits registriert.' };
    }

    // Create new user
    const newUser = {
        id: 'user_' + Date.now(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: btoa(userData.password), // Simple encoding (not secure, for demo only)
        newsletter: userData.newsletter || false,
        createdAt: new Date().toISOString(),
        wishlist: [],
        negotiations: [],
        loginMethod: 'email'
    };

    users.push(newUser);
    localStorage.setItem('cssberlin_users', JSON.stringify(users));

    return { success: true, user: newUser };
}

/**
 * Login user
 */
function login(user, redirect = true) {
    // Store current user session
    const sessionUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        picture: user.picture || null,
        loginMethod: user.loginMethod || 'email'
    };

    localStorage.setItem('cssberlin_current_user', JSON.stringify(sessionUser));
    localStorage.setItem('auth_token', 'local_' + Date.now()); // Fake token for local auth

    if (redirect) {
        window.location.href = 'index.html';
    }

    return { success: true };
}

/**
 * Logout user
 */
function logout() {
    localStorage.removeItem('cssberlin_current_user');
    localStorage.removeItem('auth_token');
    window.location.href = 'index.html';
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return localStorage.getItem('cssberlin_current_user') !== null;
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
function authenticate(email, password) {
    const users = JSON.parse(localStorage.getItem('cssberlin_users') || '[]');
    const user = users.find(u => u.email === email);

    if (!user) {
        return { success: false, error: 'E-Mail nicht gefunden.' };
    }

    // Check Google users
    if (user.loginMethod === 'google') {
        return { success: false, error: 'Bitte melden Sie sich mit Google an.' };
    }

    // Check password
    if (user.password !== btoa(password)) {
        return { success: false, error: 'Falsches Passwort.' };
    }

    return { success: true, user: user };
}

// Registration Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
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
            const result = register({
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
                login(result.user, false);

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
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;

            if (!email || !password) {
                showError('Bitte geben Sie E-Mail und Passwort ein.');
                return;
            }

            const result = authenticate(email, password);

            if (result.success) {
                if (typeof toast !== 'undefined') {
                    toast.success('Angemeldet!', `Willkommen zurück, ${result.user.firstName}!`);
                }

                login(result.user, false);

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
