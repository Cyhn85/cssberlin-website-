/**
 * Toast Notification System
 * Displays ephemeral messages to the user.
 */
const Toast = {
    container: null,

    init() {
        if (!document.getElementById('toast-container')) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);

            // Inject CSS if not present
            if (!document.querySelector('link[href="toast.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'toast.css';
                document.head.appendChild(link);
            }
        } else {
            this.container = document.getElementById('toast-container');
        }
    },

    show(title, message, type = 'success', duration = 5000) {
        if (!this.container) this.init();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        // Icon selection
        let iconHTML = '';
        if (type === 'success') iconHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        else if (type === 'error') iconHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        else iconHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';

        toast.innerHTML = `
            <div class="toast-icon">${iconHTML}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;

        this.container.appendChild(toast);

        // Remove after duration
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (toast.parentElement) toast.remove();
            }, 300);
        }, duration);
    },

    // Specific Simulation Helpers
    showWelcomeEmail() {
        this.show(
            'Willkommen bei CSS Berlin! 🌱',
            'Eine Bestätigungs-E-Mail wurde an Ihre Adresse gesendet. Bitte überprüfen Sie Ihren Posteingang.',
            'success',
            6000
        );
    },

    showOrderEmail() {
        this.show(
            'Bestellung bestätigt! 📦',
            'Vielen Dank für Ihren Einkauf. Ihre Bestellbestätigung und Rechnung wurden per E-Mail versendet.',
            'success',
            6000
        );
    },

    showSellerEmail() {
        this.show(
            'Artikel online! 🚀',
            'Ihr Artikel wurde erfolgreich inseriert. Wir haben Ihnen eine Bestätigung gesendet.',
            'success',
            6000
        );
    }
};

window.Toast = Toast;
