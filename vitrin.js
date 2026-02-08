/* CSS BERLIN - PRODUCT RENDER & ACTIONS (V3.9) */

// Mock Product Data (If not loaded from script.js)
const mockProducts = [
    { id: 101, title: 'Vintage Levi\'s 501', price: '45,00', image: 'https://via.placeholder.com/300x375/2D5016/FFF', size: 'M', brand: 'LEVI\'S' },
    { id: 102, title: 'Adidas Hoodie Grau', price: '30,00', image: 'https://via.placeholder.com/300x375/333/FFF', size: 'L', brand: 'ADIDAS' },
    { id: 103, title: 'Ralph Lauren Hemd', price: '55,00', image: 'https://via.placeholder.com/300x375/444/FFF', size: 'M', brand: 'RALPH LAUREN' },
    { id: 104, title: 'Dr. Martens 1460', price: '90,00', image: 'https://via.placeholder.com/300x375/555/FFF', size: '39', brand: 'DR. MARTENS' },
    { id: 105, title: 'Zara Sommerkleid', price: '25,00', image: 'https://via.placeholder.com/300x375/666/FFF', size: 'S', brand: 'ZARA' },
    { id: 106, title: 'Nike Air Max 90', price: '75,00', image: 'https://via.placeholder.com/300x375/777/FFF', size: '42', brand: 'NIKE' }
];

// STATE MANAGEMENT
function getWishlist() {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// RENDER FUNCTION

// PAGINATION STATE
let currentVisibleCount = 20; // Initial: 5 rows * 4 columns = 20
const ITEMS_PER_LOAD = 12; // Load More: 3 rows * 4 columns = 12

// RENDER FUNCTION
function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    // Get current state
    const wishlist = getWishlist();
    const cart = getCart();

    // Expand mock items if needed for demo (since we only have 6 mock items)
    let displayProducts = [...products];
    if (displayProducts.length < 50) {
        // Duplicate items to simulate a full catalog
        while (displayProducts.length < 50) {
            displayProducts = displayProducts.concat(products.map(p => ({
                ...p,
                id: p.id + Math.floor(Math.random() * 10000)
            })));
        }
    }

    // Slice for pagination
    const visibleProducts = displayProducts.slice(0, currentVisibleCount);

    grid.innerHTML = visibleProducts.map(product => {
        // Random "Sold" state for demo
        const isSold = product.status === 'sold' || (Math.random() < 0.15 && !product.forceActive);
        const soldBadge = isSold ? `<div class="sold-badge">VERKAUFT</div>` : '';
        const cardClass = isSold ? 'product-card sold' : 'product-card';

        // Check active states
        const isWishlisted = wishlist.includes(String(product.id));
        const wishClass = isWishlisted ? 'card-icon-btn wish-btn active' : 'card-icon-btn wish-btn';
        const wishIcon = isWishlisted ? 'fill="#ef4444" stroke="#ef4444"' : 'stroke="currentColor"';

        const isInCart = cart.includes(String(product.id));
        const cartClass = isInCart ? 'card-icon-btn cart-btn active-cart' : 'card-icon-btn cart-btn';
        const cartIcon = isInCart ? 'fill="#166534" stroke="#166534"' : 'stroke="currentColor"';

        return `
        <div class="${cardClass}" onclick="window.location.href='product-detail.html?id=${product.id}'" style="cursor:pointer;">
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
                ${soldBadge}
                
                <!-- CART BUTTON -->
                <button class="${cartClass}" onclick="toggleCart('${product.id}', event)" title="${isInCart ? 'Aus Warenkorb entfernen' : 'In den Warenkorb'}">
                    <svg viewBox="0 0 24 24" fill="none" class="cart-svg" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${cartIcon}>
                        <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                </button>
                
                <!-- WISHLIST BUTTON -->
                <button class="${wishClass}" onclick="toggleWishlist('${product.id}', event)" title="${isWishlisted ? 'Von Wunschliste entfernen' : 'Merken'}">
                    <svg viewBox="0 0 24 24" fill="none" class="heart-svg" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${wishIcon}>
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>

            <div class="product-info">
                <div class="info-row-top">
                    <span class="product-brand">${product.brand || 'MARKE'}</span>
                    <span class="product-price">${product.price} €</span>
                </div>
                
                <div class="info-row-mid">
                    <h3 class="product-title">${product.title}</h3>
                    <span class="product-size">${product.size || 'M'}</span>
                </div>

                <div class="product-actions-row">
                    ${isSold ?
                '<button class="btn-action btn-disabled" disabled onclick="event.stopPropagation()">VERKAUFT</button>' :
                `
                        <button class="btn-action btn-negotiate" onclick="startNegotiation('${product.id}', event)">
                            Verhandeln
                        </button>
                        <button class="btn-action btn-buy" onclick="buyNow('${product.id}', event)">
                            Kaufen
                        </button>
                        `
            }
                </div>
            </div>
        </div>
        `;
    }).join('');

    // Re-init icons if needed (though we used inline SVGs for performance)
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Manage Load More Button
    const container = document.querySelector('.products');
    let loadMoreBtn = document.getElementById('loadMoreBtn');

    if (visibleProducts.length < displayProducts.length) {
        if (!loadMoreBtn) {
            loadMoreBtn = document.createElement('div');
            loadMoreBtn.id = 'loadMoreBtn';
            loadMoreBtn.className = 'load-more-container'; // CSS class for styling
            loadMoreBtn.innerHTML = '<button onclick="loadMoreProducts()" class="btn-load-more">Mehr anzeigen</button>';
            // Insert AFTER grid but BEFORE footer
            grid.parentNode.insertBefore(loadMoreBtn, grid.nextSibling);
        } else {
            loadMoreBtn.style.display = 'block';
        }
    } else {
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    }
}

function loadMoreProducts() {
    currentVisibleCount += ITEMS_PER_LOAD;
    console.log(`Loading more items... Showing ${currentVisibleCount}`);

    // Re-render with new limit logic
    // (In a real app, we might just append, but re-rendering is safe for now)
    if (typeof window.loadedProducts !== 'undefined') renderProducts(window.loadedProducts);
    else renderProducts(mockProducts);
}


// ACTION HANDLERS
function showToast(message, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }

    // Icon based on type
    const icon = type === 'success' ? '✅' : 'ℹ️';

    toast.innerHTML = `<span style="font-size:18px;">${icon}</span> <span>${message}</span>`;
    toast.className = "show";
    setTimeout(function () { toast.className = toast.className.replace("show", ""); }, 3000);
}


function toggleWishlist(id, event) {
    if (event) event.stopPropagation();

    let wishlist = getWishlist();
    const index = wishlist.indexOf(String(id));

    if (index > -1) {
        // Remove
        wishlist.splice(index, 1);
        showToast("Von der Wunschliste entfernt");
    } else {
        // Add
        wishlist.push(String(id));
        showToast("Zur Wunschliste hinzugefügt");
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    // Re-render to update UI immediately
    // Get products from global scope or re-fetch (simplified here)
    if (typeof products !== 'undefined') renderProducts(products);
    else renderProducts(mockProducts); // Fallback

    // Update Header Count
    updateHeaderCounts();
}


function toggleCart(id, event) {
    if (event) event.stopPropagation();

    let cart = getCart();
    const index = cart.indexOf(String(id));

    if (index > -1) {
        // Remove
        cart.splice(index, 1);
        showToast("Aus Warenkorb entfernt");
    } else {
        // Add
        cart.push(String(id));
        showToast("In den Warenkorb gelegt");
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Re-render
    if (typeof products !== 'undefined') renderProducts(products);
    else renderProducts(mockProducts);

    updateHeaderCounts();
}


function updateHeaderCounts() {
    const wishlistCount = getWishlist().length;
    const cartCount = getCart().length;

    // Update DOM if elements exist (Header V3)
    // You might need to add ID's to your header icons in index.html/header-v3.html
    // For now, logging
    console.log(`Wishlist: ${wishlistCount}, Cart: ${cartCount}`);
}

function startNegotiation(id, event) {
    if (event) event.stopPropagation();
    showToast("Verhandlung gestartet (Demo)", "info");
}

function buyNow(id, event) {
    if (event) event.stopPropagation();
    window.location.href = `checkout.html?product_id=${id}`;
}

// INIT
window.addEventListener('load', () => {
    // If no products loaded, load mock
    const grid = document.getElementById('productsGrid');
    if (grid && grid.innerHTML.trim() === '') {
        renderProducts(mockProducts);
    }
    updateHeaderCounts();
});
