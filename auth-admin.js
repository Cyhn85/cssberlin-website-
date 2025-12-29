/**
 * CSS Berlin - Admin Authentication Extension
 * Add admin login capability to auth.js
 */

(function() {
    'use strict';

    // Admin credentials
    const ADMIN_CREDENTIALS = {
        email: 'info@cssberlin.de',
        password: 'admin221953'
    };

    // Override login form handler to include admin check
    document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('loginForm');

        if (loginForm) {
            // Remove existing event listener by cloning the form
            const newLoginForm = loginForm.cloneNode(true);
            loginForm.parentNode.replaceChild(newLoginForm, loginForm);

            // Add new event listener with admin check
            newLoginForm.addEventListener('submit', async function(e) {
                e.preventDefault();

                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const remember = document.getElementById('remember').checked;

                // Show loading
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Wird angemeldet...';

                try {
                    // Check for admin credentials first
                    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
                        const adminUser = {
                            id: 'admin_001',
                            firstName: 'Admin',
                            lastName: 'CSS Berlin',
                            email: email,
                            verified: true,
                            isAdmin: true,
                            wishlist: [],
                            negotiations: []
                        };

                        // Use the global login function
                        if (typeof window.login === 'function') {
                            window.login(adminUser, remember);
                        } else {
                            // Fallback: manually set session
                            const session = {
                                userId: adminUser.id,
                                email: adminUser.email,
                                firstName: adminUser.firstName,
                                lastName: adminUser.lastName,
                                isAdmin: true,
                                loginTime: new Date().toISOString()
                            };

                            if (remember) {
                                localStorage.setItem('cssberlin_session', JSON.stringify(session));
                            } else {
                                sessionStorage.setItem('cssberlin_session', JSON.stringify(session));
                            }
                        }

                        // Success message
                        if (typeof toast !== 'undefined') {
                            toast.success(
                                'Admin Login erfolgreich!',
                                'Willkommen im Admin Panel!',
                                2000
                            );
                        }

                        // Redirect to admin panel
                        setTimeout(() => {
                            window.location.href = 'admin-v2.html';
                        }, 1000);
                        return;
                    }

                    // For non-admin users, use the standard login process
                    const users = JSON.parse(localStorage.getItem('cssberlin_users') || '[]');
                    const user = users.find(u => u.email === email);

                    if (!user) {
                        showError('E-Mail oder Passwort ist falsch');
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                        return;
                    }

                    if (user.password !== password) {
                        showError('E-Mail oder Passwort ist falsch');
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                        return;
                    }

                    if (!user.verified) {
                        showError('Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse');
                        sessionStorage.setItem('pending_verification_email', email);

                        setTimeout(() => {
                            window.location.href = 'verify-email.html';
                        }, 2000);
                        return;
                    }

                    // Login user
                    if (typeof window.login === 'function') {
                        window.login(user, remember);
                    }

                    const redirectUrl = sessionStorage.getItem('redirect_after_login') || 'index.html';
                    sessionStorage.removeItem('redirect_after_login');

                    if (typeof toast !== 'undefined') {
                        toast.success(
                            'Erfolgreich angemeldet!',
                            `Willkommen zurück, ${user.firstName}!`,
                            2000
                        );
                    }

                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, 1000);
                } catch (error) {
                    console.error('Login error:', error);
                    if (typeof showError === 'function') {
                        showError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
                    }
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            });
        }
    });
})();
