/**
 * CSS Berlin - Authentication & Authorization System
 * Handles user registration, login, and wishlist management
 */

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

/**
 * Register Form Handler
 */
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        const newsletter = document.getElementById('newsletter').checked;

        // Validation
        if (!terms) {
            showError('Bitte akzeptieren Sie die AGB');
            return;
        }

        if (password !== confirmPassword) {
            showError('Passwörter stimmen nicht überein');
            return;
        }

        if (password.length < 8) {
            showError('Passwort muss mindestens 8 Zeichen lang sein');
            return;
        }

        // Show loading
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Wird registriert...';

        try {
            // Check if email already exists
            const existingUsers = JSON.parse(localStorage.getItem('cssberlin_users') || '[]');
            const emailExists = existingUsers.find(u => u.email === email);

            if (emailExists) {
                showError('Diese E-Mail-Adresse ist bereits registriert');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                return;
            }

            // Generate verification code (6-digit)
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

            // Create new user (unverified)
            const newUser = {
                id: Date.now(),
                firstName,
                lastName,
                email,
                password, // In production, this should be hashed
                newsletter,
                verified: false,
                verificationCode,
                createdAt: new Date().toISOString(),
                wishlist: [],
                negotiations: []
            };

            // Save to localStorage
            existingUsers.push(newUser);
            localStorage.setItem('cssberlin_users', JSON.stringify(existingUsers));

            // Simulate sending email with verification code
            console.log('📧 Verification Email Sent:');
            console.log('To:', email);
            console.log('Code:', verificationCode);
            console.log('---');

            // Store email for verification page
            sessionStorage.setItem('pending_verification_email', email);

            // Success message
            alert(`✅ Registrierung erfolgreich!\n\n📧 Ein Bestätigungscode wurde an ${email} gesendet.\n\nBitte überprüfen Sie Ihre E-Mails.\n\n🔐 Ihr Code: ${verificationCode}\n\n(In der Konsole sichtbar für Demo-Zwecke)`);

            // Redirect to verification page
            window.location.href = 'verify-email.html';
        } catch (error) {
            console.error('Registration error:', error);
            showError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

/**
 * Login Form Handler
 */
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
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
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('cssberlin_users') || '[]');

            // Find user by email
            const user = users.find(u => u.email === email);

            if (!user) {
                showError('E-Mail oder Passwort ist falsch');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                return;
            }

            // Check password
            if (user.password !== password) {
                showError('E-Mail oder Passwort ist falsch');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                return;
            }

            // Check if email is verified
            if (!user.verified) {
                showError('Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse');
                sessionStorage.setItem('pending_verification_email', email);

                setTimeout(() => {
                    window.location.href = 'verify-email.html';
                }, 2000);
                return;
            }

            // Success - login user
            login(user, remember);

            // Check if redirected from another page
            const redirectUrl = sessionStorage.getItem('redirect_after_login') || 'index.html';
            sessionStorage.removeItem('redirect_after_login');

            // Success message
            alert(`✅ Willkommen zurück, ${user.firstName}!`);

            // Redirect
            window.location.href = redirectUrl;
        } catch (error) {
            console.error('Login error:', error);
            showError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

/**
 * Login user
 */
function login(user, remember = false) {
    const session = {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        loginTime: new Date().toISOString()
    };

    if (remember) {
        localStorage.setItem('cssberlin_session', JSON.stringify(session));
    } else {
        sessionStorage.setItem('cssberlin_session', JSON.stringify(session));
    }

    // Merge guest wishlist with user wishlist
    mergeGuestWishlist(user.id);
}

/**
 * Logout user
 */
function logout() {
    localStorage.removeItem('cssberlin_session');
    sessionStorage.removeItem('cssberlin_session');
    window.location.href = 'index.html';
}

/**
 * Get current logged-in user
 */
function getCurrentUser() {
    const sessionData = localStorage.getItem('cssberlin_session') ||
                       sessionStorage.getItem('cssberlin_session');

    if (!sessionData) return null;

    return JSON.parse(sessionData);
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// ============================================
// USER MANAGEMENT
// ============================================

/**
 * Get all users
 */
function getUsers() {
    const users = localStorage.getItem('cssberlin_users');
    return users ? JSON.parse(users) : [];
}

/**
 * Get user by ID
 */
function getUserById(userId) {
    const users = getUsers();
    return users.find(u => u.id === userId);
}

/**
 * Update user
 */
function updateUser(userId, updates) {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('cssberlin_users', JSON.stringify(users));
        return true;
    }

    return false;
}

/**
 * Generate unique user ID
 */
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Simple password hash (for demo - use bcrypt in production)
 */
function hashPassword(password) {
    // Simple hash - in production use proper hashing
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

// ============================================
// WISHLIST MANAGEMENT
// ============================================

/**
 * Add product to wishlist
 * @param {string} productId - Product ID
 * @param {object} productData - Product data (name, image, price, etc.)
 */
function addToWishlist(productId, productData) {
    if (isLoggedIn()) {
        // User is logged in - save to user's wishlist
        const currentUser = getCurrentUser();
        const user = getUserById(currentUser.userId);

        if (!user.wishlist) user.wishlist = [];

        // Check if already in wishlist
        if (!user.wishlist.find(item => item.productId === productId)) {
            user.wishlist.push({
                productId,
                ...productData,
                addedAt: new Date().toISOString()
            });

            updateUser(user.id, { wishlist: user.wishlist });
            updateWishlistCount();
            return true;
        }
    } else {
        // Guest user - save to localStorage
        let guestWishlist = getGuestWishlist();

        if (!guestWishlist.find(item => item.productId === productId)) {
            guestWishlist.push({
                productId,
                ...productData,
                addedAt: new Date().toISOString()
            });

            localStorage.setItem('cssberlin_guest_wishlist', JSON.stringify(guestWishlist));
            updateWishlistCount();
            return true;
        }
    }

    return false;
}

/**
 * Remove product from wishlist
 */
function removeFromWishlist(productId) {
    if (isLoggedIn()) {
        const currentUser = getCurrentUser();
        const user = getUserById(currentUser.userId);

        if (user.wishlist) {
            user.wishlist = user.wishlist.filter(item => item.productId !== productId);
            updateUser(user.id, { wishlist: user.wishlist });
            updateWishlistCount();
            return true;
        }
    } else {
        let guestWishlist = getGuestWishlist();
        guestWishlist = guestWishlist.filter(item => item.productId !== productId);
        localStorage.setItem('cssberlin_guest_wishlist', JSON.stringify(guestWishlist));
        updateWishlistCount();
        return true;
    }

    return false;
}

/**
 * Toggle wishlist (add if not exists, remove if exists)
 */
function toggleWishlist(productId, productData) {
    if (isInWishlist(productId)) {
        removeFromWishlist(productId);
        return false; // Removed
    } else {
        addToWishlist(productId, productData);
        return true; // Added
    }
}

/**
 * Check if product is in wishlist
 */
function isInWishlist(productId) {
    if (isLoggedIn()) {
        const currentUser = getCurrentUser();
        const user = getUserById(currentUser.userId);
        return user.wishlist && user.wishlist.some(item => item.productId === productId);
    } else {
        const guestWishlist = getGuestWishlist();
        return guestWishlist.some(item => item.productId === productId);
    }
}

/**
 * Get guest wishlist
 */
function getGuestWishlist() {
    const wishlist = localStorage.getItem('cssberlin_guest_wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
}

/**
 * Get user wishlist
 */
function getWishlist() {
    if (isLoggedIn()) {
        const currentUser = getCurrentUser();
        const user = getUserById(currentUser.userId);
        return user.wishlist || [];
    } else {
        return getGuestWishlist();
    }
}

/**
 * Merge guest wishlist with user wishlist after login
 */
function mergeGuestWishlist(userId) {
    const guestWishlist = getGuestWishlist();

    if (guestWishlist.length > 0) {
        const user = getUserById(userId);

        // Merge wishlists (avoid duplicates)
        const mergedWishlist = [...(user.wishlist || [])];

        guestWishlist.forEach(guestItem => {
            if (!mergedWishlist.find(item => item.productId === guestItem.productId)) {
                mergedWishlist.push(guestItem);
            }
        });

        updateUser(userId, { wishlist: mergedWishlist });

        // Clear guest wishlist
        localStorage.removeItem('cssberlin_guest_wishlist');
    }
}

/**
 * Update wishlist count in header
 */
function updateWishlistCount() {
    const countElement = document.getElementById('wishlistCount');
    if (countElement) {
        const wishlist = getWishlist();
        countElement.textContent = wishlist.length;
    }
}

// ============================================
// UI HELPERS
// ============================================

/**
 * Show error message
 */
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');

        setTimeout(() => {
            errorElement.classList.remove('show');
        }, 5000);
    }
}

/**
 * Update UI based on login status
 */
function updateAuthUI() {
    const currentUser = getCurrentUser();
    const userBtn = document.querySelector('.user-btn');
    const registerBtn = document.querySelector('.register-btn');
    const divider = document.querySelector('.header-divider');

    // Get icons that should be hidden for guests
    const messagesBtn = document.querySelector('button[title="Verhandlungen"]');
    const notificationsBtn = document.querySelector('button[title="Benachrichtigungen"]');

    if (currentUser && userBtn) {
        // User is logged in
        userBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>${currentUser.firstName}</span>
        `;
        userBtn.href = '#';
        userBtn.onclick = (e) => {
            e.preventDefault();
            if (confirm('Möchten Sie sich abmelden?')) {
                logout();
            }
        };

        // Hide register button and divider
        if (registerBtn) registerBtn.style.display = 'none';
        if (divider) divider.style.display = 'none';

        // Show messages and notifications icons
        if (messagesBtn) messagesBtn.style.display = 'flex';
        if (notificationsBtn) notificationsBtn.style.display = 'flex';
    } else {
        // Guest user - hide messages and notifications
        if (messagesBtn) messagesBtn.style.display = 'none';
        if (notificationsBtn) notificationsBtn.style.display = 'none';
    }

    // Update wishlist count
    updateWishlistCount();
}

// ============================================
// WISHLIST PAGE PROTECTION
// ============================================

/**
 * Protect wishlist page - redirect to login if not logged in
 */
function protectWishlistPage() {
    if (window.location.pathname.includes('wunschliste.html')) {
        if (!isLoggedIn()) {
            // Save current page to redirect back after login
            sessionStorage.setItem('redirect_after_login', 'wunschliste.html');

            // Redirect to login silently for smoother UX
            window.location.href = 'login.html';
        }
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Update UI based on login status
    updateAuthUI();

    // Protect wishlist page
    protectWishlistPage();

    // Initialize wishlist buttons on product pages
    initializeWishlistButtons();
});

/**
 * Initialize wishlist buttons (heart icons)
 */
function initializeWishlistButtons() {
    document.querySelectorAll('.wishlist-btn, .icon-btn[title*="Wunschliste"]').forEach(btn => {
        // Get product ID from data attribute or generate from context
        const productCard = btn.closest('.product-card');
        if (productCard) {
            const productId = productCard.dataset.productId || generateProductId(productCard);
            const productData = extractProductData(productCard);

            // Set initial state
            if (isInWishlist(productId)) {
                btn.classList.add('active');
                const svg = btn.querySelector('svg');
                if (svg) svg.setAttribute('fill', 'currentColor');
            }

            // Add click handler (toggle)
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const isAdded = toggleWishlist(productId, productData);

                if (isAdded) {
                    btn.classList.add('active');
                    const svg = btn.querySelector('svg');
                    if (svg) svg.setAttribute('fill', 'currentColor');
                } else {
                    btn.classList.remove('active');
                    const svg = btn.querySelector('svg');
                    if (svg) svg.setAttribute('fill', 'none');
                }
            });
        }
    });
}

/**
 * Generate product ID from product card
 */
function generateProductId(productCard) {
    const title = productCard.querySelector('h3, .product-title')?.textContent;
    const price = productCard.querySelector('.product-price')?.textContent;
    return `prod_${title}_${price}`.replace(/\s+/g, '_').toLowerCase();
}

/**
 * Extract product data from product card
 */
function extractProductData(productCard) {
    return {
        name: productCard.querySelector('h3, .product-title')?.textContent || '',
        price: productCard.querySelector('.product-price')?.textContent || '',
        image: productCard.querySelector('img')?.src || '',
        category: productCard.dataset.category || ''
    };
}

// ============================================
// NEGOTIATIONS MANAGEMENT
// ============================================

/**
 * Add product to negotiations list
 */
function addToNegotiations(productId, productData) {
    if (!isLoggedIn()) {
        return false;
    }

    const currentUser = getCurrentUser();
    const user = getUserById(currentUser.userId);

    if (!user.negotiations) user.negotiations = [];

    // Check if already in negotiations
    if (!user.negotiations.find(item => item.productId === productId)) {
        user.negotiations.push({
            productId,
            ...productData,
            startedAt: new Date().toISOString(),
            status: 'active' // active, completed, cancelled
        });

        updateUser(user.id, { negotiations: user.negotiations });
        return true;
    }

    return false;
}

/**
 * Get user negotiations
 */
function getNegotiations() {
    if (!isLoggedIn()) return [];

    const currentUser = getCurrentUser();
    const user = getUserById(currentUser.userId);
    return user.negotiations || [];
}

/**
 * Remove from negotiations
 */
function removeFromNegotiations(productId) {
    if (!isLoggedIn()) return false;

    const currentUser = getCurrentUser();
    const user = getUserById(currentUser.userId);

    if (user.negotiations) {
        user.negotiations = user.negotiations.filter(item => item.productId !== productId);
        updateUser(user.id, { negotiations: user.negotiations });
        return true;
    }

    return false;
}

/**
 * Update negotiation status
 */
function updateNegotiationStatus(productId, status) {
    if (!isLoggedIn()) return false;

    const currentUser = getCurrentUser();
    const user = getUserById(currentUser.userId);

    if (user.negotiations) {
        const negotiation = user.negotiations.find(item => item.productId === productId);
        if (negotiation) {
            negotiation.status = status;
            updateUser(user.id, { negotiations: user.negotiations });
            return true;
        }
    }

    return false;
}

// Make functions available globally
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.toggleWishlist = toggleWishlist;
window.isInWishlist = isInWishlist;
window.getWishlist = getWishlist;
window.isLoggedIn = isLoggedIn;
window.getCurrentUser = getCurrentUser;
window.logout = logout;
window.addToNegotiations = addToNegotiations;
window.getNegotiations = getNegotiations;
window.removeFromNegotiations = removeFromNegotiations;
window.updateNegotiationStatus = updateNegotiationStatus;
