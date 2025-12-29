/**
 * CSS Berlin - Email Service
 * Handles all email functionality via EmailJS
 *
 * SETUP REQUIRED:
 * 1. Create account at emailjs.com
 * 2. Add email service (Gmail or SMTP)
 * 3. Create templates: password_reset, magic_link, verification
 * 4. Update SERVICE_ID, TEMPLATE_IDs, and PUBLIC_KEY below
 */

const EmailService = {
    // EmailJS Configuration - IONOS SMTP
    SERVICE_ID: 'service_x3phsl7',      // IONOS SMTP Service ID
    PUBLIC_KEY: 'ZOprGu7EjDZmGl4ql',    // EmailJS Public Key

    // Template IDs - Using verification template for all emails
    // Magic Link will use the same template with different content
    TEMPLATES: {
        PASSWORD_RESET: 'template_icqfar5',   // Uses verification template
        MAGIC_LINK: 'template_icqfar5',       // Uses verification template
        VERIFICATION: 'template_icqfar5',     // E-Mail-Verifizierung Template
        WELCOME: 'template_icqfar5'           // Uses verification template
    },

    // Check if EmailJS is loaded
    isReady: false,

    /**
     * Initialize EmailJS
     */
    init() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.PUBLIC_KEY);
            this.isReady = true;
            console.log('EmailJS initialized');
            return true;
        } else {
            console.warn('EmailJS SDK not loaded');
            return false;
        }
    },

    /**
     * Send Password Reset Email
     */
    async sendPasswordReset(email, userName, resetLink) {
        const templateParams = {
            to_email: email,
            to_name: userName || email.split('@')[0],
            reset_link: resetLink,
            expires_in: '15 Minuten',
            from_name: 'CSS Berlin'
        };

        return this.sendEmail(this.TEMPLATES.PASSWORD_RESET, templateParams, {
            subject: 'Passwort zurücksetzen - CSS Berlin',
            fallbackMessage: `Passwort-Reset-Link: ${resetLink}`
        });
    },

    /**
     * Send Magic Link Email (One-time login link)
     * Uses verification template with magic link in message field
     */
    async sendMagicLink(email, userName, magicLink) {
        const templateParams = {
            to_email: email,
            to_name: userName || email.split('@')[0],
            from_name: 'CSS Berlin',
            subject: 'Anmeldung per E-Mail-Link - CSS Berlin',
            verification_code: 'MAGIC-LINK',  // Placeholder for template
            message: `Hallo ${userName || email.split('@')[0]},

Sie haben eine Anmeldung per E-Mail-Link angefordert.

Klicken Sie auf den folgenden Link, um sich bei CSS Berlin anzumelden:

${magicLink}

Der Link ist 10 Minuten gültig und kann nur einmal verwendet werden.

Falls Sie diese Anmeldung nicht angefordert haben, ignorieren Sie bitte diese E-Mail.

Mit freundlichen Grüßen
Ihr CSS Berlin Team
Climate Smart Solutions`
        };

        return this.sendEmail(this.TEMPLATES.MAGIC_LINK, templateParams, {
            subject: 'Anmeldung per E-Mail-Link - CSS Berlin',
            fallbackMessage: `Magic-Link: ${magicLink}`
        });
    },

    /**
     * Send Verification Email
     */
    async sendVerification(email, userName, verificationCode) {
        const templateParams = {
            to_email: email,
            to_name: userName || email.split('@')[0],
            verification_code: verificationCode,
            from_name: 'CSS Berlin'
        };

        return this.sendEmail(this.TEMPLATES.VERIFICATION, templateParams, {
            subject: 'E-Mail Bestätigung - CSS Berlin',
            fallbackMessage: `Bestätigungscode: ${verificationCode}`
        });
    },

    /**
     * Send Welcome Email
     */
    async sendWelcome(email, userName) {
        const templateParams = {
            to_email: email,
            to_name: userName,
            from_name: 'CSS Berlin'
        };

        return this.sendEmail(this.TEMPLATES.WELCOME, templateParams, {
            subject: 'Willkommen bei CSS Berlin!',
            fallbackMessage: `Willkommen bei CSS Berlin, ${userName}!`
        });
    },

    /**
     * Generic send email function - REAL EMAIL SENDING via IONOS SMTP
     */
    async sendEmail(templateId, templateParams, fallback) {
        // Initialize EmailJS if not ready
        if (!this.isReady) {
            this.init();
        }

        // Send real email via EmailJS
        if (typeof emailjs !== 'undefined') {
            try {
                console.log('Sending email via EmailJS (IONOS SMTP)...');
                console.log('Service:', this.SERVICE_ID);
                console.log('Template:', templateId);
                console.log('To:', templateParams.to_email);

                const response = await emailjs.send(
                    this.SERVICE_ID,
                    templateId,
                    templateParams,
                    this.PUBLIC_KEY
                );

                console.log('Email sent successfully:', response);
                return { success: true, method: 'emailjs', response };
            } catch (error) {
                console.error('EmailJS error:', error);
                return {
                    success: false,
                    method: 'emailjs',
                    error: error.text || error.message || 'E-Mail konnte nicht gesendet werden'
                };
            }
        } else {
            console.error('EmailJS SDK not loaded!');
            return {
                success: false,
                method: 'none',
                error: 'EmailJS nicht geladen. Bitte Seite neu laden.'
            };
        }
    },

    /**
     * Generate secure random token
     */
    generateToken(prefix = 'token') {
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substr(2, 12);
        const randomPart2 = Math.random().toString(36).substr(2, 12);
        return `${prefix}_${timestamp}_${randomPart}${randomPart2}`;
    },

    /**
     * Generate 6-digit verification code
     */
    generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    },

    /**
     * Store password reset token
     */
    storePasswordResetToken(email, token, expiresInMinutes = 15) {
        const resetTokens = JSON.parse(localStorage.getItem('cssberlin_reset_tokens') || '[]');

        // Remove old tokens for this email
        const filtered = resetTokens.filter(t => t.email !== email);

        filtered.push({
            email,
            token,
            expiresAt: Date.now() + (expiresInMinutes * 60 * 1000),
            createdAt: Date.now()
        });

        localStorage.setItem('cssberlin_reset_tokens', JSON.stringify(filtered));
        return token;
    },

    /**
     * Validate password reset token
     */
    validatePasswordResetToken(token) {
        const resetTokens = JSON.parse(localStorage.getItem('cssberlin_reset_tokens') || '[]');
        const tokenData = resetTokens.find(t => t.token === token);

        if (!tokenData) {
            return { valid: false, error: 'Token nicht gefunden' };
        }

        if (Date.now() > tokenData.expiresAt) {
            return { valid: false, error: 'Token ist abgelaufen' };
        }

        return { valid: true, email: tokenData.email };
    },

    /**
     * Store magic link token
     */
    storeMagicLinkToken(email, token, expiresInMinutes = 10) {
        const magicTokens = JSON.parse(localStorage.getItem('cssberlin_magic_tokens') || '[]');

        // Remove old tokens for this email
        const filtered = magicTokens.filter(t => t.email !== email);

        filtered.push({
            email,
            token,
            expiresAt: Date.now() + (expiresInMinutes * 60 * 1000),
            createdAt: Date.now(),
            used: false
        });

        localStorage.setItem('cssberlin_magic_tokens', JSON.stringify(filtered));
        return token;
    },

    /**
     * Validate and consume magic link token
     */
    validateMagicLinkToken(token) {
        const magicTokens = JSON.parse(localStorage.getItem('cssberlin_magic_tokens') || '[]');
        const tokenIndex = magicTokens.findIndex(t => t.token === token);

        if (tokenIndex === -1) {
            return { valid: false, error: 'Link nicht gefunden' };
        }

        const tokenData = magicTokens[tokenIndex];

        if (tokenData.used) {
            return { valid: false, error: 'Dieser Link wurde bereits verwendet' };
        }

        if (Date.now() > tokenData.expiresAt) {
            return { valid: false, error: 'Link ist abgelaufen' };
        }

        // Mark as used
        magicTokens[tokenIndex].used = true;
        localStorage.setItem('cssberlin_magic_tokens', JSON.stringify(magicTokens));

        return { valid: true, email: tokenData.email };
    },

    /**
     * Clean up expired tokens
     */
    cleanupExpiredTokens() {
        const now = Date.now();

        // Clean reset tokens
        const resetTokens = JSON.parse(localStorage.getItem('cssberlin_reset_tokens') || '[]');
        const validResetTokens = resetTokens.filter(t => t.expiresAt > now);
        localStorage.setItem('cssberlin_reset_tokens', JSON.stringify(validResetTokens));

        // Clean magic tokens
        const magicTokens = JSON.parse(localStorage.getItem('cssberlin_magic_tokens') || '[]');
        const validMagicTokens = magicTokens.filter(t => t.expiresAt > now && !t.used);
        localStorage.setItem('cssberlin_magic_tokens', JSON.stringify(validMagicTokens));
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    EmailService.init();
    EmailService.cleanupExpiredTokens();
});

// Export for global use
window.EmailService = EmailService;

console.log('CSS Berlin Email Service loaded');
