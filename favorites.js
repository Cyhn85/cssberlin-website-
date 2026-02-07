/**
 * CSS Berlin - Favorites System
 * Manages user favorites with localStorage fallback and API sync
 */

class FavoritesManager {
    constructor() {
        this.storageKey = 'cssberlin_favorites';
        this.initialized = false;
    }

    /**
     * Initialize favorites (sync localStorage with API if logged in)
     */
    async init() {
        if (this.initialized) return;

        // Check if user is logged in
        if (authGate && authGate.isAuthenticated) {
            await this.syncWithAPI();
        }

        this.initialized = true;
    }

    /**
     * Get all favorites (from localStorage or API)
     */
    async getFavorites() {
        const token = localStorage.getItem('auth_token');

        // If logged in, get from API
        if (token) {
            try {
                const response = await fetch(window.API_CONFIG.BASE_URL + '/api/favorites', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    return data.favorites || [];
                }
            } catch (error) {
                console.error('Error fetching favorites from API:', error);
            }
        }

        // Fallback to localStorage
        return this.getLocalFavorites();
    }

    /**
     * Get favorites from localStorage
     */
    getLocalFavorites() {
        try {
            const favorites = localStorage.getItem(this.storageKey);
            return favorites ? JSON.parse(favorites) : [];
        } catch (error) {
            console.error('Error reading favorites from localStorage:', error);
            return [];
        }
    }

    /**
     * Save favorites to localStorage
     */
    saveLocalFavorites(favorites) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(favorites));
        } catch (error) {
            console.error('Error saving favorites to localStorage:', error);
        }
    }

    /**
     * Check if product is in favorites
     */
    async isFavorite(productId) {
        const token = localStorage.getItem('auth_token');

        // If logged in, check via API
        if (token) {
            try {
                const response = await fetch(
                    window.API_CONFIG.BASE_URL + `/api/favorites/check/${productId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    return data.is_favorite;
                }
            } catch (error) {
                console.error('Error checking favorite:', error);
            }
        }

        // Fallback to localStorage
        const favorites = this.getLocalFavorites();
        return favorites.some(fav => fav.id === productId);
    }

    /**
     * Add product to favorites
     */
    async addFavorite(productId, productData = null) {
        const token = localStorage.getItem('auth_token');

        // If logged in, add via API
        if (token) {
            try {
                const response = await fetch(
                    window.API_CONFIG.BASE_URL + `/api/favorites/${productId}`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    this.showToast('✓ Zu Favoriten hinzugefügt', 'success');
                    this.updateFavoriteCount();
                    return true;
                }
            } catch (error) {
                console.error('Error adding to favorites:', error);
            }
        }

        // Fallback to localStorage
        if (productData) {
            const favorites = this.getLocalFavorites();

            // Check if already exists
            if (!favorites.some(fav => fav.id === productId)) {
                favorites.push({
                    id: productId,
                    ...productData,
                    favorited_at: new Date().toISOString()
                });
                this.saveLocalFavorites(favorites);
                this.showToast('✓ Zu Favoriten hinzugefügt', 'success');
                this.updateFavoriteCount();
                return true;
            }
        }

        return false;
    }

    /**
     * Remove product from favorites
     */
    async removeFavorite(productId) {
        const token = localStorage.getItem('auth_token');

        // If logged in, remove via API
        if (token) {
            try {
                const response = await fetch(
                    window.API_CONFIG.BASE_URL + `/api/favorites/${productId}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (response.ok) {
                    this.showToast('Aus Favoriten entfernt', 'info');
                    this.updateFavoriteCount();
                    return true;
                }
            } catch (error) {
                console.error('Error removing from favorites:', error);
            }
        }

        // Fallback to localStorage
        const favorites = this.getLocalFavorites();
        const filtered = favorites.filter(fav => fav.id !== productId);

        if (filtered.length < favorites.length) {
            this.saveLocalFavorites(filtered);
            this.showToast('Aus Favoriten entfernt', 'info');
            this.updateFavoriteCount();
            return true;
        }

        return false;
    }

    /**
     * Toggle favorite status
     */
    async toggleFavorite(productId, productData = null) {
        const isFav = await this.isFavorite(productId);

        if (isFav) {
            return await this.removeFavorite(productId);
        } else {
            return await this.addFavorite(productId, productData);
        }
    }

    /**
     * Get favorite count
     */
    async getFavoriteCount() {
        const favorites = await this.getFavorites();
        return favorites.length;
    }

    /**
     * Update favorite count in UI
     */
    async updateFavoriteCount() {
        const count = await this.getFavoriteCount();
        const countElements = document.querySelectorAll('#wishlistCount, .wishlist-count');

        countElements.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    /**
     * Sync localStorage favorites with API when user logs in
     */
    async syncWithAPI() {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const localFavorites = this.getLocalFavorites();

        // Upload local favorites to API
        for (const fav of localFavorites) {
            try {
                await fetch(
                    window.API_CONFIG.BASE_URL + `/api/favorites/${fav.id}`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            } catch (error) {
                console.error('Error syncing favorite:', error);
            }
        }

        // Clear localStorage after sync
        localStorage.removeItem(this.storageKey);
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        // Check if toast function exists
        if (typeof showToast === 'function') {
            showToast(message, type);
            return;
        }

        // Fallback: simple alert
        console.log(`[${type}] ${message}`);
    }

    /**
     * Render favorites page
     */
    async renderFavoritesPage(containerId = 'favorites-container') {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Show loading
        container.innerHTML = '<div class="loading">Favoriten werden geladen...</div>';

        try {
            const favorites = await this.getFavorites();

            if (favorites.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <h2>Keine Favoriten</h2>
                        <p>Du hast noch keine Produkte zu deinen Favoriten hinzugefügt.</p>
                        <a href="index.html" class="btn-primary">Produkte entdecken</a>
                    </div>
                `;
                return;
            }

            // Render favorites grid
            const html = `
                <div class="favorites-header">
                    <h1>Meine Favoriten</h1>
                    <p>${favorites.length} ${favorites.length === 1 ? 'Produkt' : 'Produkte'}</p>
                </div>
                <div class="product-grid">
                    ${favorites.map(product => this.renderProductCard(product)).join('')}
                </div>
            `;

            container.innerHTML = html;

            // Attach event listeners
            this.attachFavoriteListeners();
        } catch (error) {
            console.error('Error rendering favorites:', error);
            container.innerHTML = `
                <div class="error-state">
                    <p>Fehler beim Laden der Favoriten</p>
                    <button onclick="location.reload()" class="btn-secondary">Neu laden</button>
                </div>
            `;
        }
    }

    /**
     * Render product card
     */
    renderProductCard(product) {
        const image = Array.isArray(product.images) && product.images.length > 0
            ? product.images[0]
            : 'https://via.placeholder.com/300x400?text=No+Image';

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${image}" alt="${product.name}" loading="lazy">
                    <button class="remove-favorite-btn" data-product-id="${product.id}" title="Aus Favoriten entfernen">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#F44336" stroke="#F44336" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-brand">${product.brand || ''}</p>
                    <p class="product-price">${product.price}€</p>
                    <p class="product-meta">${product.size || ''} · ${product.condition || ''}</p>
                </div>
                <div class="product-actions">
                    <a href="product-detail.html?id=${product.id}" class="btn-primary">Ansehen</a>
                </div>
            </div>
        `;
    }

    /**
     * Attach event listeners for favorite buttons
     */
    attachFavoriteListeners() {
        document.querySelectorAll('.remove-favorite-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const productId = parseInt(btn.dataset.productId);
                await this.removeFavorite(productId);

                // Remove card from DOM
                const card = btn.closest('.product-card');
                if (card) {
                    card.style.animation = 'fadeOut 0.3s ease-out';
                    setTimeout(() => {
                        card.remove();

                        // Check if no more favorites
                        const container = document.getElementById('favorites-container');
                        if (container && container.querySelectorAll('.product-card').length === 0) {
                            this.renderFavoritesPage();
                        }
                    }, 300);
                }
            });
        });
    }
}

// Initialize global favorites manager
const favoritesManager = new FavoritesManager();

// Auto-initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        favoritesManager.init();
        favoritesManager.updateFavoriteCount();
    });
} else {
    favoritesManager.init();
    favoritesManager.updateFavoriteCount();
}

// Export for compatibility with existing code
function toggleWishlist(productId, productData) {
    return favoritesManager.toggleFavorite(productId, productData);
}

function isInWishlist(productId) {
    return favoritesManager.isFavorite(productId);
}

// Add CSS for animations
const favoritesStyle = document.createElement('style');
favoritesStyle.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }

    .empty-state, .error-state {
        text-align: center;
        padding: 60px 20px;
    }

    .empty-state svg, .error-state svg {
        color: #ccc;
        margin-bottom: 20px;
    }

    .empty-state h2 {
        font-size: 24px;
        margin-bottom: 12px;
        color: #333;
    }

    .empty-state p {
        color: #666;
        margin-bottom: 24px;
    }

    .favorites-header {
        margin-bottom: 32px;
    }

    .favorites-header h1 {
        font-size: 32px;
        margin-bottom: 8px;
        color: #2D5016;
    }

    .favorites-header p {
        color: #666;
        font-size: 16px;
    }

    .remove-favorite-btn {
        position: absolute;
        top: 12px;
        right: 12px;
        background: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: all 0.2s;
        z-index: 10;
    }

    .remove-favorite-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .loading {
        text-align: center;
        padding: 40px;
        color: #666;
        font-size: 18px;
    }
`;
document.head.appendChild(favoritesStyle);
