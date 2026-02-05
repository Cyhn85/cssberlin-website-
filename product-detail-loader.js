// ═════════════════════════════════════════════════════════════════
// CSS Berlin — Product Detail Dynamic Loader
// URL param okuma + API fetch + dynamic render
// ═════════════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ─── API Config ─────────────────────────────────────────────
    const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8000'
        : '';

    // ─── URL Param Okuma ────────────────────────────────────────
    function getProductIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        return id ? parseInt(id, 10) : null;
    }

    // ─── API Fetch ──────────────────────────────────────────────
    async function fetchProduct(id) {
        try {
            const response = await fetch(`${API_BASE}/api/products/${id}`);
            if (!response.ok) {
                if (response.status === 404) throw new Error('Ürün bulunamadı');
                throw new Error(`API error: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('[Product Loader] API fetch failed:', error);
            throw error;
        }
    }

    // ─── Render Product ─────────────────────────────────────────
    function renderProduct(product) {
        // Title
        const titleEl = document.getElementById('productTitle');
        if (titleEl) titleEl.textContent = product.name || 'Unbekannt';

        // Price
        const priceEl = document.getElementById('productPrice');
        if (priceEl) priceEl.textContent = `${product.price || 0}€`;

        // Original Price
        const originalPriceEl = document.getElementById('productOriginalPrice');
        if (originalPriceEl) originalPriceEl.textContent = `Neu: ${product.original_price || product.price * 2}€`;

        // Brand
        const brandEl = document.getElementById('productBrand');
        if (brandEl) brandEl.textContent = product.brand || 'Unbekannt';

        // Condition
        const conditionEl = document.getElementById('productCondition');
        if (conditionEl) conditionEl.textContent = product.condition || 'Gebraucht';

        // Size
        const sizeEl = document.getElementById('productSize');
        if (sizeEl) sizeEl.textContent = product.size || 'N/A';

        // Description
        const descEl = document.getElementById('productDescription');
        if (descEl) descEl.textContent = product.description || 'Keine Beschreibung verfügbar.';

        // Main Image
        const mainImageEl = document.getElementById('productMainImage');
        if (mainImageEl && product.images && product.images.length > 0) {
            mainImageEl.src = product.images[0];
            mainImageEl.alt = product.name;
        }

        // Thumbnail Gallery
        const thumbsContainer = document.getElementById('productThumbnails');
        if (thumbsContainer && product.images && product.images.length > 0) {
            thumbsContainer.innerHTML = '';
            product.images.forEach((img, index) => {
                const thumb = document.createElement('img');
                thumb.src = img;
                thumb.alt = `${product.name} ${index + 1}`;
                thumb.className = 'product-thumbnail';
                thumb.style.cursor = 'pointer';
                thumb.addEventListener('click', () => {
                    if (mainImageEl) mainImageEl.src = img;
                });
                thumbsContainer.appendChild(thumb);
            });
        }

        // CO2 Savings
        const co2El = document.getElementById('productCO2');
        const co2Value = Math.round((product.price || 0) * 0.4 * 10) / 10;
        if (co2El) co2El.textContent = `-${co2Value}kg CO₂`;

        console.log('[Product Loader] Rendered:', product.name);
    }

    // ─── Loading State ──────────────────────────────────────────
    function showLoading() {
        const loader = document.getElementById('productLoader');
        if (loader) loader.style.display = 'flex';
    }

    function hideLoading() {
        const loader = document.getElementById('productLoader');
        if (loader) loader.style.display = 'none';
    }

    // ─── Error State ────────────────────────────────────────────
    function showError(message) {
        const errorEl = document.getElementById('productError');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    }

    // ─── Init ───────────────────────────────────────────────────
    async function init() {
        const productId = getProductIdFromURL();

        if (!productId || isNaN(productId)) {
            showError('Keine gültige Produkt-ID in der URL.');
            console.warn('[Product Loader] No valid ID in URL');
            return;
        }

        console.log('[Product Loader] Loading product ID:', productId);
        showLoading();

        try {
            const product = await fetchProduct(productId);
            hideLoading();
            renderProduct(product);
        } catch (error) {
            hideLoading();
            showError(error.message || 'Fehler beim Laden des Produkts.');
        }
    }

    // ─── Auto-Init ──────────────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
