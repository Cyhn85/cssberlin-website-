/**
 * CSS Berlin API Client
 * Handles all API requests to the backend
 */

class APIClient {
    constructor() {
        // API base URL
        this.baseURL = this.getBaseURL();
        this.token = localStorage.getItem('cssberlin_token');
    }

    getBaseURL() {
        // Check for config
        if (typeof API_CONFIG !== 'undefined' && API_CONFIG.current) {
            return API_CONFIG.current;
        }

        // Default URLs
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:8000';
        }

        return 'https://api.cssberlin.de';
    }

    /**
     * Set auth token
     */
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('cssberlin_token', token);
        } else {
            localStorage.removeItem('cssberlin_token');
        }
    }

    /**
     * Get auth headers
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    /**
     * Generic API request
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;

        const config = {
            headers: this.getHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);

            // Handle 401 Unauthorized
            if (response.status === 401) {
                this.setToken(null);
                window.dispatchEvent(new CustomEvent('auth:logout'));
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'API Error');
            }

            return data;
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    // ============== AUTH ==============

    /**
     * Register new user
     */
    async register(userData) {
        const data = await this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email: userData.email,
                password: userData.password,
                first_name: userData.firstName,
                last_name: userData.lastName
            })
        });

        return data;
    }

    /**
     * Login user
     */
    async login(email, password) {
        const data = await this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (data.access_token) {
            this.setToken(data.access_token);

            // Store user session
            const session = {
                userId: data.user.id,
                email: data.user.email,
                firstName: data.user.first_name,
                lastName: data.user.last_name,
                loginTime: new Date().toISOString()
            };
            sessionStorage.setItem('cssberlin_session', JSON.stringify(session));
        }

        return data;
    }

    /**
     * Logout user
     */
    logout() {
        this.setToken(null);
        sessionStorage.removeItem('cssberlin_session');
        window.dispatchEvent(new CustomEvent('auth:logout'));
    }

    /**
     * Get current user info
     */
    async getCurrentUser() {
        return await this.request('/api/auth/me');
    }

    // ============== PRODUCTS ==============

    /**
     * Get products with filters
     */
    async getProducts(options = {}) {
        const params = new URLSearchParams();

        if (options.skip) params.append('skip', options.skip);
        if (options.limit) params.append('limit', options.limit);
        if (options.category) params.append('category', options.category);
        if (options.brand) params.append('brand', options.brand);
        if (options.search) params.append('search', options.search);
        if (options.include) params.append('include', options.include);
        if (options.seller_id) params.append('seller_id', options.seller_id);
        if (typeof options.is_sold !== 'undefined') params.append('is_sold', options.is_sold);

        const queryString = params.toString();
        const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;

        return await this.request(endpoint);
    }

    /**
     * Get single product
     */
    async getProduct(productId) {
        return await this.request(`/api/products/${productId}`);
    }

    /**
     * Create new product
     */
    async createProduct(productData) {
        return await this.request('/api/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    }

    /**
     * Update product
     */
    async updateProduct(productId, productData) {
        return await this.request(`/api/products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
    }

    /**
     * Delete product
     */
    async deleteProduct(productId) {
        return await this.request(`/api/products/${productId}`, {
            method: 'DELETE'
        });
    }

    // ============== OFFERS ==============

    /**
     * Create offer
     */
    async createOffer(productId, amount, message = '') {
        return await this.request('/api/offers', {
            method: 'POST',
            body: JSON.stringify({
                product_id: productId,
                offer_amount: amount,
                message: message
            })
        });
    }

    /**
     * Get user's offers
     */
    async getOffers() {
        return await this.request('/api/offers');
    }

    async getOffersByUser(userId) {
        return await this.request(`/api/offers/user/${userId}`);
    }

    /**
     * Accept offer
     */
    async acceptOffer(offerId) {
        return await this.request(`/api/offers/${offerId}/accept`, {
            method: 'PUT'
        });
    }

    /**
     * Counter offer
     */
    async counterOffer(offerId, counterAmount) {
        return await this.request(`/api/offers/${offerId}/counter`, {
            method: 'PUT',
            body: JSON.stringify({ counter_amount: counterAmount })
        });
    }

    /**
     * Decline offer
     */
    async declineOffer(offerId) {
        return await this.request(`/api/offers/${offerId}/decline`, {
            method: 'PUT'
        });
    }

    // ============== MESSAGES ==============

    /**
     * Send message
     */
    async sendMessage(receiverId, content, productId = null) {
        return await this.request('/api/messages', {
            method: 'POST',
            body: JSON.stringify({
                receiver_id: receiverId,
                content: content,
                product_id: productId
            })
        });
    }

    /**
     * Get conversation with user
     */
    async getConversation(userId) {
        return await this.request(`/api/messages/${userId}`);
    }

    // ============== ORDERS ==============

    /**
     * Get user's orders (buyer or seller)
     */
    async getOrders() {
        return await this.request('/api/orders');
    }

    /**
     * Get single order
     */
    async getOrder(orderId) {
        return await this.request(`/api/orders/${orderId}`);
    }

    // ============== SHIPMENTS ==============

    /**
     * Create shipment for an order
     */
    async createShipment(orderData) {
        return await this.request('/api/shipments', {
            method: 'POST',
            body: JSON.stringify({
                order_id: orderData.orderId,
                carrier: orderData.carrier,
                tracking_number: orderData.trackingNumber,
                weight_kg: orderData.weight,
                package_size: orderData.packageSize
            })
        });
    }

    /**
     * Get user's shipments
     */
    async getShipments() {
        return await this.request('/api/shipments');
    }

    // ============== ORDERS ==============

    async createOrder(orderData) {
        return await this.request('/api/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    async getOrders() {
        return await this.request('/api/orders');
    }

    // ============== PAYMENTS ==============

    async createPaymentIntent(payload) {
        return await this.request('/api/payment/card/intent', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    // ============== REVIEWS ==============

    async createUserReview(payload) {
        return await this.request('/api/reviews/user', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    async getUserReviews(userId) {
        return await this.request(`/api/reviews/user/${userId}`);
    }

    async getUserReviewSummary(userId) {
        return await this.request(`/api/reviews/user/${userId}/summary`);
    }

    /**
     * Get single shipment details
     */
    async getShipment(shipmentId) {
        return await this.request(`/api/shipments/${shipmentId}`);
    }

    /**
     * Update shipment
     */
    async updateShipment(shipmentId, updateData) {
        return await this.request(`/api/shipments/${shipmentId}`, {
            method: 'PUT',
            body: JSON.stringify({
                tracking_number: updateData.trackingNumber,
                status: updateData.status,
                last_location: updateData.lastLocation,
                estimated_delivery: updateData.estimatedDelivery
            })
        });
    }

    /**
     * Track shipment by tracking number (public)
     */
    async trackShipment(trackingNumber) {
        return await this.request(`/api/shipments/track/${trackingNumber}`);
    }

    /**
     * Get available carriers
     */
    async getCarriers() {
        return await this.request('/api/carriers');
    }

    // ============== UTILITIES ==============

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return !!this.token;
    }

    /**
     * Health check
     */
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            return response.ok;
        } catch {
            return false;
        }
    }
}

// Create global instance
const api = new APIClient();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIClient;
}

console.log('✅ API Client loaded - Base URL:', api.baseURL);
