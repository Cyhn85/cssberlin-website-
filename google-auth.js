/**
 * CSS Berlin - Google OAuth Authentication
 * Frontend JavaScript entegrasyonu
 * 2026 Modern Authentication Flow
 */

// ============================================
// GOOGLE OAUTH CONFIG
// ============================================
const GOOGLE_CLIENT_ID = '929023339787-gc94hg7o1a993f6fj93von2jcr87nr6k.apps.googleusercontent.com';

// Production ve localhost için redirect URIs
const REDIRECT_URI = window.location.hostname === 'localhost'
    ? 'http://localhost:5500/auth-callback.html'
    : 'https://cssberlin.de/auth-callback.html';

// ============================================
// GOOGLE SIGN-IN INITIALIZATION
// ============================================
function initGoogleAuth() {
    // Load Google Identity Services library
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
        console.log('[Google Auth] Library loaded');
        setupGoogleSignIn();
    };
    document.head.appendChild(script);
}

function setupGoogleSignIn() {
    if (typeof google === 'undefined' || !google.accounts) {
        console.warn('[Google Auth] Google library not available');
        return;
    }

    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
    });

    // Render Google Sign-In button if container exists
    const googleBtnContainer = document.getElementById('googleSignInButton');
    if (googleBtnContainer) {
        google.accounts.id.renderButton(googleBtnContainer, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: 280,
            locale: 'de'
        });
    }

    // Show One Tap prompt for returning users
    google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
            console.log('[Google Auth] One Tap not displayed:', notification.getNotDisplayedReason());
        }
    });
}

// ============================================
// HANDLE GOOGLE CREDENTIAL RESPONSE
// ============================================
async function handleGoogleCredentialResponse(response) {
    console.log('[Google Auth] Credential response received');

    const idToken = response.credential;

    try {
        // Decode JWT to get user info (client-side only for display)
        const payload = parseJwt(idToken);
        console.log('[Google Auth] User:', payload.email, payload.name);

        // Send token to backend for verification and session creation
        const backendResponse = await fetch('/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_token: idToken,
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
                given_name: payload.given_name,
                family_name: payload.family_name,
            }),
        });

        if (!backendResponse.ok) {
            // If backend endpoint doesn't exist yet, handle locally
            if (backendResponse.status === 404) {
                console.log('[Google Auth] Backend endpoint not ready, handling locally');
                handleLocalGoogleAuth(payload);
                return;
            }
            throw new Error('Backend authentication failed');
        }

        const data = await backendResponse.json();

        // Store token and user info
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify({
            email: payload.email,
            firstName: payload.given_name,
            lastName: payload.family_name,
            picture: payload.picture,
            provider: 'google'
        }));

        // Notify success
        if (typeof toast !== 'undefined' && toast.success) {
            toast.success('Erfolgreich angemeldet', `Willkommen, ${payload.given_name}!`);
        }

        // Reload page or update UI
        setTimeout(() => {
            window.location.reload();
        }, 1000);

    } catch (error) {
        console.error('[Google Auth] Error:', error);
        if (typeof toast !== 'undefined' && toast.error) {
            toast.error('Anmeldung fehlgeschlagen', 'Bitte versuchen Sie es erneut.');
        }
    }
}

// ============================================
// LOCAL GOOGLE AUTH (FALLBACK)
// ============================================
function handleLocalGoogleAuth(payload) {
    // Store user info locally (temporary until backend is ready)
    const user = {
        id: 'google_' + payload.sub,
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        picture: payload.picture,
        provider: 'google',
        isVerified: payload.email_verified
    };

    // Generate a temporary token (NOT secure, just for demo)
    const tempToken = btoa(JSON.stringify({
        sub: payload.sub,
        email: payload.email,
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }));

    localStorage.setItem('token', tempToken);
    localStorage.setItem('user', JSON.stringify(user));

    // Notify success
    if (typeof toast !== 'undefined' && toast.success) {
        toast.success('Erfolgreich angemeldet', `Willkommen, ${payload.given_name}!`);
    }

    // Reload page
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// ============================================
// JWT PARSER (CLIENT-SIDE)
// ============================================
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
    return JSON.parse(jsonPayload);
}

// ============================================
// GOOGLE SIGN OUT
// ============================================
function googleSignOut() {
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.disableAutoSelect();
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    if (typeof toast !== 'undefined' && toast.info) {
        toast.info('Abgemeldet', 'Sie wurden erfolgreich abgemeldet.');
    }

    setTimeout(() => {
        window.location.reload();
    }, 500);
}

// ============================================
// RENDER GOOGLE BUTTON IN LOGIN MODAL
// ============================================
function renderGoogleButton(containerId) {
    const container = document.getElementById(containerId);
    if (!container || typeof google === 'undefined') return;

    google.accounts.id.renderButton(container, {
        theme: 'filled_blue',
        size: 'large',
        type: 'standard',
        text: 'continue_with',
        shape: 'pill',
        width: 280,
        locale: 'de'
    });
}

// ============================================
// AUTO-INIT
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGoogleAuth);
} else {
    initGoogleAuth();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initGoogleAuth, googleSignOut, renderGoogleButton };
}
