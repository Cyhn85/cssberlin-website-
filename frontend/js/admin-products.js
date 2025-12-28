/**
 * Admin Product Management
 * Handles adding products to CSS Berlin website
 */

const PRODUCTS_FILE_PATH = 'js/products.json';
const API_BASE_URL = 'http://localhost:8000';

/**
 * Add product to CSS Berlin website
 * @param {Object} productData - Product data from backend
 * @returns {Promise<Object>} - Result with success status
 */
async function addProductToWebsite(productData) {
    try {
        // Call backend to add product to products.json
        const response = await fetch(`${API_BASE_URL}/api/automation/publish-to-web`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: productData.id,
                product: productData
            })
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Product added to CSS Berlin website:', productData.name);
            return {
                success: true,
                productUrl: `https://cssberlin.de/product-detail.html?id=${productData.id}`,
                message: 'Ürün başarıyla CSS Berlin website\'e eklendi'
            };
        } else {
            throw new Error(result.message || 'Backend error');
        }

    } catch (error) {
        console.error('❌ Error adding product to website:', error);
        return {
            success: false,
            message: 'Ürün eklenirken hata oluştu: ' + error.message
        };
    }
}

/**
 * Generate product HTML card for display
 * @param {Object} product - Product object
 * @returns {string} - HTML string
 */
function generateProductHTML(product) {
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.name}">
                <div class="product-badge">${product.condition}</div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-brand">${product.brand}</p>
                <div class="product-meta">
                    <span class="product-size">Beden: ${product.size || 'N/A'}</span>
                    <span class="product-price">€${product.price}</span>
                </div>
                <div class="product-description">
                    ${product.description.substring(0, 100)}...
                </div>
            </div>
        </div>
    `;
}

/**
 * Update product list in admin panel
 * @param {Array} products - Array of products
 */
function updateProductList(products) {
    const container = document.getElementById('productListContainer');
    if (!container) return;

    if (!products || products.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Henüz ürün eklenmedi</p></div>';
        return;
    }

    container.innerHTML = products.map(product => generateProductHTML(product)).join('');
}

/**
 * Load products from backend
 * @returns {Promise<Array>} - Array of products
 */
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/automation/products`);
        const result = await response.json();

        if (result.success) {
            return result.products;
        } else {
            console.error('Error loading products:', result.message);
            return [];
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Export functions
if (typeof window !== 'undefined') {
    window.addProductToWebsite = addProductToWebsite;
    window.generateProductHTML = generateProductHTML;
    window.updateProductList = updateProductList;
    window.loadProducts = loadProducts;
}

console.log('✅ Admin Products module loaded');
