/**
 * CSS Berlin - Offer Notification System
 * Real-time notifications for price negotiations
 *
 * Features:
 * - Real-time notification polling
 * - Badge updates in header
 * - Notification dropdown
 * - Mark as read functionality
 * - Toast notifications for new offers
 */

class OfferNotificationManager {
    constructor() {
        this.API_BASE = (typeof API_CONFIG !== 'undefined' && API_CONFIG.current) ? API_CONFIG.current : (
            (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                ? 'http://localhost:8000'
                : ''
        );
        this.pollInterval = 30000; // 30 seconds
        this.unreadCount = 0;
        this.notifications = [];
        this.pollingTimer = null;
        this.dropdownVisible = false;

        this.init();
    }

    init() {
        console.log('🔔 Offer Notification Manager initialized');

        // Check if user is logged in
        if (!this.isUserLoggedIn()) {
            console.log('User not logged in, notifications disabled');
            return;
        }

        // Create notification dropdown
        this.createNotificationDropdown();

        // Initial load
        this.loadNotifications();

        // Start polling
        this.startPolling();

        // Setup badge click handler
        this.setupBadgeClickHandler();
    }

    getAuthHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        const token = localStorage.getItem('cssberlin_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    /**
     * Check if user is logged in
     */
    isUserLoggedIn() {
        if (typeof window.isLoggedIn === 'function') {
            return window.isLoggedIn();
        }

        const sessionData = localStorage.getItem('cssberlin_session') || sessionStorage.getItem('cssberlin_session');
        return !!sessionData;
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        if (typeof window.getCurrentUser === 'function') {
            return window.getCurrentUser();
        }

        const sessionData = localStorage.getItem('cssberlin_session') || sessionStorage.getItem('cssberlin_session');
        if (sessionData) {
            try {
                return JSON.parse(sessionData);
            } catch (e) {
                console.error('Error parsing session data:', e);
            }
        }

        return null;
    }

    /**
     * Load notifications from API
     */
    async loadNotifications() {
        const user = this.getCurrentUser();
        if (!user) return;

        try {
            // Get unread count
            const countResponse = await fetch(`${this.API_BASE}/api/offers/notifications/${user.userId}/unread-count`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (countResponse.ok) {
                const countData = await countResponse.json();
                const newUnreadCount = countData.unread_count || 0;

                // Check if there are new notifications
                if (newUnreadCount > this.unreadCount) {
                    this.showNewOfferToast();
                }

                this.unreadCount = newUnreadCount;
                this.updateBadge();
            }

            // Get user offers for notifications
            const offersResponse = await fetch(`${this.API_BASE}/api/offers/user/${user.userId}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (offersResponse.ok) {
                const offersData = await offersResponse.json();
                this.notifications = this.convertOffersToNotifications(offersData.offers || []);
                this.updateNotificationDropdown();
            }

        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }

    /**
     * Convert offers to notification format
     */
    convertOffersToNotifications(offers) {
        const user = this.getCurrentUser();
        if (!user) return [];

        return offers.map(offer => {
            const isBuyer = offer.buyer_id === user.userId;
            const isNew = this.isOfferNew(offer);

            let title, message, type;

            if (offer.status === 'pending' && !isBuyer) {
                title = 'Neues Angebot';
                message = `${offer.buyer_name || 'Ein Käufer'} hat €${offer.offer_amount.toFixed(2)} für ${offer.product_name} angeboten`;
                type = 'new_offer';
            } else if (offer.status === 'countered' && isBuyer) {
                title = 'Gegenangebot erhalten';
                message = `Neues Gegenangebot für ${offer.product_name}: €${offer.offer_amount.toFixed(2)}`;
                type = 'counter_offer';
            } else if (offer.status === 'accepted') {
                title = 'Angebot angenommen';
                message = `Ihr Angebot für ${offer.product_name} wurde angenommen!`;
                type = 'offer_accepted';
            } else if (offer.status === 'declined') {
                title = 'Angebot abgelehnt';
                message = `Ihr Angebot für ${offer.product_name} wurde abgelehnt`;
                type = 'offer_declined';
            } else if (offer.status === 'expired') {
                title = 'Angebot abgelaufen';
                message = `Ihr Angebot für ${offer.product_name} ist abgelaufen`;
                type = 'offer_expired';
            } else {
                return null;
            }

            return {
                id: offer.id,
                offer_id: offer.id,
                user_id: user.userId,
                type: type,
                title: title,
                message: message,
                is_read: !isNew,
                created_at: offer.updated_at || offer.created_at,
                offer_data: offer
            };
        }).filter(n => n !== null);
    }

    /**
     * Check if offer is new (within last hour)
     */
    isOfferNew(offer) {
        const updatedAt = new Date(offer.updated_at || offer.created_at);
        const now = new Date();
        const diffMs = now - updatedAt;
        const diffMinutes = diffMs / 60000;
        return diffMinutes <= 60; // New if updated in last hour
    }

    /**
     * Show toast for new offer
     */
    showNewOfferToast() {
        if (typeof toast !== 'undefined') {
            toast.info('Neue Benachrichtigung', 'Sie haben eine neue Angebotsaktualisierung!', 5000);
        }
    }

    /**
     * Start polling
     */
    startPolling() {
        if (this.pollingTimer) {
            clearInterval(this.pollingTimer);
        }

        this.pollingTimer = setInterval(() => {
            this.loadNotifications();
        }, this.pollInterval);

        console.log(`📡 Polling started (every ${this.pollInterval/1000}s)`);
    }

    /**
     * Stop polling
     */
    stopPolling() {
        if (this.pollingTimer) {
            clearInterval(this.pollingTimer);
            this.pollingTimer = null;
            console.log('📡 Polling stopped');
        }
    }

    /**
     * Update badge
     */
    updateBadge() {
        const badge = document.getElementById('offerNotificationBadge');
        if (badge) {
            if (this.unreadCount > 0) {
                badge.textContent = this.unreadCount;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        }

        // Also update any other badges
        const negotiationBadge = document.getElementById('negotiationCount');
        if (negotiationBadge) {
            negotiationBadge.textContent = this.unreadCount;
        }
    }

    /**
     * Create notification dropdown
     */
    createNotificationDropdown() {
        // Check if dropdown already exists
        if (document.getElementById('offerNotificationDropdown')) return;

        const dropdownHTML = `
            <div class="notification-dropdown" id="offerNotificationDropdown">
                <div class="notification-dropdown-header">
                    <h3>Angebote</h3>
                    <span class="notification-mark-all" onclick="offerNotifications.markAllAsRead()">
                        Alle als gelesen markieren
                    </span>
                </div>
                <div class="notification-list" id="notificationList">
                    <!-- Notifications will be inserted here -->
                </div>
            </div>
        `;

        // Find a suitable place to insert (after header)
        const header = document.querySelector('header');
        if (header) {
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            header.appendChild(wrapper);
            wrapper.innerHTML = dropdownHTML;
        }
    }

    /**
     * Update notification dropdown
     */
    updateNotificationDropdown() {
        const notificationList = document.getElementById('notificationList');
        if (!notificationList) return;

        if (this.notifications.length === 0) {
            notificationList.innerHTML = `
                <div class="notification-empty">
                    <p>Keine Benachrichtigungen</p>
                </div>
            `;
            return;
        }

        // Sort by date (newest first)
        const sortedNotifications = [...this.notifications].sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        });

        notificationList.innerHTML = sortedNotifications.map(notification => {
            const timeAgo = this.getTimeAgo(new Date(notification.created_at));
            const unreadClass = notification.is_read ? '' : 'unread';

            return `
                <div class="notification-item ${unreadClass}"
                     onclick="offerNotifications.handleNotificationClick(${notification.offer_id})">
                    <div class="notification-item-header">
                        <span class="notification-item-title">${notification.title}</span>
                        <span class="notification-item-time">${timeAgo}</span>
                    </div>
                    <div class="notification-item-message">${notification.message}</div>
                </div>
            `;
        }).join('');
    }

    /**
     * Setup badge click handler
     */
    setupBadgeClickHandler() {
        const badge = document.getElementById('offerNotificationBadge');
        if (badge) {
            badge.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('offerNotificationDropdown');
            if (dropdown && this.dropdownVisible && !dropdown.contains(e.target)) {
                this.hideDropdown();
            }
        });
    }

    /**
     * Toggle dropdown
     */
    toggleDropdown() {
        if (this.dropdownVisible) {
            this.hideDropdown();
        } else {
            this.showDropdown();
        }
    }

    /**
     * Show dropdown
     */
    showDropdown() {
        const dropdown = document.getElementById('offerNotificationDropdown');
        if (dropdown) {
            dropdown.classList.add('show');
            this.dropdownVisible = true;
        }
    }

    /**
     * Hide dropdown
     */
    hideDropdown() {
        const dropdown = document.getElementById('offerNotificationDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
            this.dropdownVisible = false;
        }
    }

    /**
     * Handle notification click
     */
    handleNotificationClick(offerId) {
        // Navigate to verhandeln page
        window.location.href = `verhandeln.html?offer_id=${offerId}`;
    }

    /**
     * Mark all as read
     */
    async markAllAsRead() {
        const user = this.getCurrentUser();
        if (!user) return;

        try {
            const response = await fetch(`${this.API_BASE}/api/offers/notifications/${user.userId}/mark-read`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({})
            });

            if (response.ok) {
                this.unreadCount = 0;
                this.updateBadge();
                this.notifications.forEach(n => n.is_read = true);
                this.updateNotificationDropdown();

                if (typeof toast !== 'undefined') {
                    toast.success('Markiert', 'Alle Benachrichtigungen als gelesen markiert', 2000);
                }
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    }

    /**
     * Get time ago string
     */
    getTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMinutes = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) return 'Gerade eben';
        if (diffMinutes === 1) return 'vor 1 Minute';
        if (diffMinutes < 60) return `vor ${diffMinutes} Minuten`;
        if (diffHours === 1) return 'vor 1 Stunde';
        if (diffHours < 24) return `vor ${diffHours} Stunden`;
        if (diffDays === 1) return 'Gestern';
        if (diffDays < 7) return `vor ${diffDays} Tagen`;
        return date.toLocaleDateString('de-DE');
    }
}

// Initialize global instance
const offerNotifications = new OfferNotificationManager();

console.log('✅ Offer Notification System loaded');
