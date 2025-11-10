// ============================================
// CSS Berlin V3 - Climate Smart Solutions
// Main JavaScript - 2-Button Product Layout
// ============================================

// ============================================
// ENVIRONMENT CONFIGURATION
// ============================================
// Auto-detect backend API URL based on hostname
const API_BASE_URL = (function() {
    const hostname = window.location.hostname;

    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8000';
    }

    // Production environment
    return 'https://api.cssberlin.de';
})();

console.log('[CONFIG] API Base URL:', API_BASE_URL);

// ============================================
// SAMPLE PRODUCTS DATA
// ============================================
const sampleProducts = [
    {
        id: 1,
        brand: 'Zara',
        name: 'Elegante Blazer Jacke',
        size: 'M',
        condition: 'Sehr gut',
        price: 45.00,
        newPrice: 89.95,
        carbonSaved: 18.5,
        tier: 'champion',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500',
        sale: false
    },
    {
        id: 2,
        brand: 'H&M',
        name: 'Vintage Jeans High Waist',
        size: 'S',
        condition: 'Gut',
        price: 22.50,
        newPrice: 49.99,
        carbonSaved: 12.3,
        tier: 'profi',
        image: 'https://images.unsplash.com/photo-1542272454315-7f6f36d69c8d?w=500',
        sale: true
    },
    {
        id: 3,
        brand: 'Nike',
        name: 'Sportliche Laufjacke',
        size: 'L',
        condition: 'Neuwertig',
        price: 38.00,
        newPrice: 79.90,
        carbonSaved: 15.7,
        tier: 'champion',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
        sale: false
    },
    {
        id: 4,
        brand: 'Mango',
        name: 'Sommerkleid Blumenmuster',
        size: 'M',
        condition: 'Sehr gut',
        price: 32.00,
        newPrice: 69.95,
        carbonSaved: 14.2,
        tier: 'profi',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
        sale: true
    },
    {
        id: 5,
        brand: 'Adidas',
        name: 'Sneakers Retro Style',
        size: '42',
        condition: 'Gut',
        price: 55.00,
        newPrice: 120.00,
        carbonSaved: 22.8,
        tier: 'champion',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
        sale: false
    },
    {
        id: 6,
        brand: 'Levis',
        name: 'Classic Denim Jacke',
        size: 'L',
        condition: 'Sehr gut',
        price: 48.00,
        newPrice: 99.99,
        carbonSaved: 19.4,
        tier: 'champion',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
        sale: false
    },
    {
        id: 7,
        brand: 'Esprit',
        name: 'Strickpullover Beige',
        size: 'M',
        condition: 'Gut',
        price: 18.50,
        newPrice: 45.00,
        carbonSaved: 8.9,
        tier: 'fortgeschritten',
        image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500',
        sale: true
    },
    {
        id: 8,
        brand: 'Tommy Hilfiger',
        name: 'Poloshirt Navy',
        size: 'L',
        condition: 'Neuwertig',
        price: 28.00,
        newPrice: 59.99,
        carbonSaved: 11.5,
        tier: 'profi',
        image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500',
        sale: false
    },
    {
        id: 9,
        brand: 'Zara',
        name: 'Business Hose Grau',
        size: 'M',
        condition: 'Sehr gut',
        price: 25.00,
        newPrice: 49.95,
        carbonSaved: 10.2,
        tier: 'profi',
        image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500',
        sale: false
    },
    {
        id: 10,
        brand: 'Puma',
        name: 'Trainingsanzug Komplett',
        size: 'L',
        condition: 'Gut',
        price: 42.00,
        newPrice: 89.99,
        carbonSaved: 16.8,
        tier: 'champion',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
        sale: true
    },
    {
        id: 11,
        brand: 'H&M',
        name: 'Wintermantel Schwarz',
        size: 'S',
        condition: 'Sehr gut',
        price: 65.00,
        newPrice: 129.99,
        carbonSaved: 28.5,
        tier: 'champion',
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500',
        sale: false
    },
    {
        id: 12,
        brand: 'Only',
        name: 'Röcke Mini Denim',
        size: 'S',
        condition: 'Neuwertig',
        price: 15.50,
        newPrice: 35.99,
        carbonSaved: 7.2,
        tier: 'einsteiger',
        image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500',
        sale: true
    },
    {
        id: 13,
        brand: 'Calvin Klein',
        name: 'Unterwäsche Set',
        size: 'M',
        condition: 'Neu',
        price: 22.00,
        newPrice: 45.00,
        carbonSaved: 6.5,
        tier: 'einsteiger',
        image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500',
        sale: false
    },
    {
        id: 14,
        brand: 'Vero Moda',
        name: 'Bluse Weiß Elegant',
        size: 'M',
        condition: 'Sehr gut',
        price: 19.00,
        newPrice: 39.99,
        carbonSaved: 8.1,
        tier: 'fortgeschritten',
        image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=500',
        sale: false
    },
    {
        id: 15,
        brand: 'Jack & Jones',
        name: 'Cargo Shorts Khaki',
        size: 'L',
        condition: 'Gut',
        price: 24.00,
        newPrice: 49.95,
        carbonSaved: 9.8,
        tier: 'fortgeschritten',
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500',
        sale: true
    },
    {
        id: 16,
        brand: 'Gucci',
        name: 'Designer Handtasche',
        size: 'OneSize',
        condition: 'Sehr gut',
        price: 450.00,
        newPrice: 1200.00,
        carbonSaved: 85.5,
        tier: 'champion',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500',
        sale: false
    }
];

// ============================================
// GLOBAL STATE
// ============================================
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let currentPage = 1;
const productsPerPage = 16;

// ============================================
// INITIALIZE APP
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Check if page has a specific category filter
    const category = window.pageCategory || null;
    initProducts(category);
    initNewsSlider();
    initFooterNewsSlider();
    initLoadMore();
    initWishlist();
    initWishlistButton();
    updateWishlistCount();
    initMegaMenus();
    initSearch();
    hideMessageIconForGuests();
});

// ============================================
// PRODUCT CARD CREATION - V3 WITH 2 BUTTONS
// ============================================
function createProductCard(product) {
    // Check if product is in wishlist
    const inWishlist = wishlist.includes(product.id);

    const discount = Math.round(((product.newPrice - product.price) / product.newPrice) * 100);

    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image-wrapper">
                <img src="${product.image}"
                     alt="${product.name}"
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/400x533?text=Bild+nicht+verfügbar'">

                <button class="wishlist-btn ${inWishlist ? 'active' : ''}"
                        data-product-id="${product.id}"
                        title="${inWishlist ? 'Von Wunschliste entfernen' : 'Zur Wunschliste hinzufügen'}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="${inWishlist ? '#F44336' : 'none'}" stroke="${inWishlist ? '#F44336' : 'currentColor'}" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>

                <div class="carbon-badge ${product.tier}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
                    </svg>
                    <span>-${product.carbonSaved}kg CO₂</span>
                </div>
            </div>

            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <h3 class="product-title">${product.name}</h3>

                <div class="product-meta">
                    <span>Größe ${product.size}</span>
                    <span>|</span>
                    <span>${product.condition}</span>
                </div>

                <div class="product-price-container">
                    <span class="product-price">${product.price.toFixed(2)}€</span>
                    <span class="product-new-price">Neupreis: ${product.newPrice.toFixed(2)}€</span>
                </div>

                <!-- V3: 2-Button Layout (Icon Cart + Full Kaufen) -->
                <div class="product-actions" style="display: flex; gap: 8px;">
                    <button class="add-to-cart-btn" data-product-id="${product.id}" title="In den Warenkorb" style="width: 48px; padding: 12px; background: white; border: 2px solid #2D5016; color: #2D5016; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </button>
                    <button class="buy-btn" data-product-id="${product.id}" style="flex: 1; padding: 12px; background: #2D5016; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.3s ease;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        Kaufen
                    </button>
                </div>
                <button class="negotiate-btn" data-product-id="${product.id}" style="width: 100%; padding: 12px; background: #FF8C42; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px; display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 8px; transition: all 0.3s ease;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        <path d="M8 10h.01M12 10h.01M16 10h.01"></path>
                    </svg>
                    Verhandeln
                </button>
            </div>
        </div>
    `;
}

// ============================================
// INITIALIZE PRODUCTS
// ============================================
async function initProducts(category = null) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    try {
        // Build API URL with optional category filter
        let apiUrl = `${API_BASE_URL}/api/products?limit=16`;
        if (category) {
            apiUrl += `&category=${encodeURIComponent(category)}`;
        }

        console.log('[API] Fetching products from:', apiUrl);

        // Fetch products from backend API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Transform backend data to frontend format
        const products = data.products.map(p => ({
            id: p.id,
            brand: p.brand || 'Unbekannt',
            name: p.title || '',
            size: p.size || '',
            condition: p.condition || 'Gebraucht',
            price: p.price || 0,
            newPrice: p.original_price || (p.price * 2),
            carbonSaved: Math.round((p.price || 0) * 0.4 * 10) / 10,
            tier: 'champion',
            image: (p.images && p.images.length > 0) ? p.images[0] : 'https://images.unsplash.com/photo-1542272454315-7f6f36d69c8d?w=500',
            sale: false
        }));

        // Store products globally for wishlist/cart functionality
        window.loadedProducts = products;

        // Display products
        products.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.innerHTML += productCard;
        });

        // Attach event listeners
        attachProductEventListeners();

        // Update cart button states
        updateCartButtonStates();

        const categoryInfo = category ? ` (category: ${category})` : '';
        console.log(`Loaded ${products.length} products from backend${categoryInfo}`);
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to sample products if API fails
        const productsToShow = sampleProducts.slice(0, productsPerPage);
        productsToShow.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.innerHTML += productCard;
        });
        attachProductEventListeners();
        updateCartButtonStates();
    }
}

// ============================================
// ATTACH EVENT LISTENERS TO PRODUCTS
// ============================================
function attachProductEventListeners() {
    // Product card click - go to product detail
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on buttons
            if (e.target.closest('.wishlist-btn, .buy-btn, .negotiate-btn')) {
                return;
            }
            window.location.href = 'product.html';
        });
        card.style.cursor = 'pointer';
    });

    // Wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const productId = parseInt(this.dataset.productId);

            // Get product data
            const allProducts = window.loadedProducts || sampleProducts;
            const product = allProducts.find(p => p.id === productId);

            if (product) {
                // Toggle wishlist
                toggleWishlist(productId, this);
            }
        });
    });

    // Add to Cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const productId = parseInt(this.dataset.productId);
            handleAddToCart(productId, this);
        });
    });

    // Buy buttons
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = parseInt(this.dataset.productId);
            handleBuyClick(productId);
        });
    });

    // Negotiate buttons
    document.querySelectorAll('.negotiate-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = parseInt(this.dataset.productId);
            handleNegotiateClick(productId);
        });
    });
}

// ============================================
// ADD TO CART HANDLER - WITH TOGGLE
// ============================================
function handleAddToCart(productId, buttonElement) {
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return;

    // Get existing cart
    let cart = JSON.parse(localStorage.getItem('cssberlin_cart') || '[]');

    // Check if already in cart
    const existingItemIndex = cart.findIndex(item => item.id === productId);

    if (existingItemIndex > -1) {
        // Remove from cart (toggle off)
        cart.splice(existingItemIndex, 1);
        localStorage.setItem('cssberlin_cart', JSON.stringify(cart));

        // Update button UI - back to default
        if (buttonElement) {
            buttonElement.style.background = 'white';
            buttonElement.style.borderColor = '#2D5016';
            buttonElement.style.color = '#2D5016';
            buttonElement.querySelector('svg').setAttribute('stroke', '#2D5016');
        }
    } else {
        // Add to cart (toggle on)
        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price.toFixed(2) + '€',
            image: product.image,
            category: product.brand,
            size: product.size,
            quantity: 1,
            addedAt: new Date().toISOString()
        };

        cart.push(cartItem);
        localStorage.setItem('cssberlin_cart', JSON.stringify(cart));

        // Update button UI - show as active
        if (buttonElement) {
            buttonElement.style.background = '#4CAF50';
            buttonElement.style.borderColor = '#4CAF50';
            buttonElement.style.color = 'white';
            buttonElement.querySelector('svg').setAttribute('stroke', 'white');
        }
    }

    // Update cart count in header
    updateCartCountInHeader();
}

// Update cart count in header
function updateCartCountInHeader() {
    const cart = JSON.parse(localStorage.getItem('cssberlin_cart') || '[]');
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

// Update cart button states on page load
function updateCartButtonStates() {
    const cart = JSON.parse(localStorage.getItem('cssberlin_cart') || '[]');
    const cartProductIds = cart.map(item => item.id);

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        const productId = parseInt(btn.dataset.productId);
        if (cartProductIds.includes(productId)) {
            // Product is in cart - show as active (green)
            btn.style.background = '#4CAF50';
            btn.style.borderColor = '#4CAF50';
            btn.style.color = 'white';
            btn.querySelector('svg').setAttribute('stroke', 'white');
        }
    });
}

// Update negotiation count in header
function updateNegotiationCountInHeader() {
    const negotiationCountElement = document.getElementById('negotiationCount');
    if (negotiationCountElement) {
        if (typeof window.getNegotiations === 'function') {
            const negotiations = window.getNegotiations();
            const activeNegotiations = negotiations.filter(n => n.status === 'active');
            negotiationCountElement.textContent = activeNegotiations.length;
        } else {
            negotiationCountElement.textContent = '0';
        }
    }
}

// ============================================
// BUY BUTTON HANDLER
// ============================================
function handleBuyClick(productId) {
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return;

    // Direct buy - go to checkout with this single item
    const purchaseData = {
        id: product.id,
        name: product.name,
        price: product.price.toFixed(2) + '€',
        image: product.image,
        category: product.brand,
        size: product.size,
        quantity: 1
    };

    // Store in session for checkout page
    sessionStorage.setItem('checkout_item', JSON.stringify(purchaseData));

    // Redirect to checkout
    window.location.href = 'checkout.html';
}

// ============================================
// NEGOTIATE BUTTON HANDLER
// ============================================
function handleNegotiateClick(productId) {
    const product = sampleProducts.find(p => p.id === productId);
    if (!product) return;

    // Check if user is logged in
    if (!window.isLoggedIn || !window.isLoggedIn()) {
        // Save redirect info
        sessionStorage.setItem('redirect_after_login', 'messages.html');
        sessionStorage.setItem('negotiate_product', productId.toString());

        if (confirm('Bitte melden Sie sich an, um eine Verhandlung zu starten.')) {
            window.location.href = 'login.html';
        }
        return;
    }

    // Add to negotiations list
    if (window.addToNegotiations) {
        window.addToNegotiations(productId, {
            name: product.name,
            price: product.price,
            image: product.image,
            brand: product.brand,
            size: product.size,
            condition: product.condition
        });
    }

    // Update negotiation count in header before redirect
    updateNegotiationCountInHeader();

    // Redirect to messages page
    window.location.href = 'messages.html';
}

// ============================================
// WISHLIST TOGGLE
// ============================================
function toggleWishlist(productId, button) {
    const index = wishlist.indexOf(productId);

    if (index > -1) {
        // Remove from wishlist
        wishlist.splice(index, 1);
        button.classList.remove('active');
        button.querySelector('svg').setAttribute('fill', 'none');
        button.querySelector('svg').setAttribute('stroke', 'currentColor');
        button.title = 'Zur Wunschliste hinzufügen';
    } else {
        // Add to wishlist
        wishlist.push(productId);
        button.classList.add('active');
        button.querySelector('svg').setAttribute('fill', '#F44336');
        button.querySelector('svg').setAttribute('stroke', '#F44336');
        button.title = 'Von Wunschliste entfernen';
    }

    // Save to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    // Update header wishlist count
    updateWishlistCount();

    return index === -1; // Return true if added, false if removed
}

// ============================================
// UPDATE WISHLIST COUNT IN HEADER
// ============================================
function updateWishlistCount() {
    const wishlistCountElement = document.getElementById('wishlistCount');
    if (!wishlistCountElement) return;

    const count = wishlist.length;
    wishlistCountElement.textContent = count;

    if (count > 0) {
        wishlistCountElement.classList.add('active');
    } else {
        wishlistCountElement.classList.remove('active');
    }
}

// ============================================
// WISHLIST BUTTON CLICK HANDLER
// ============================================
function initWishlistButton() {
    const wishlistBtn = document.getElementById('wishlistBtn');
    if (!wishlistBtn) return;

    wishlistBtn.addEventListener('click', function() {
        // Navigate to wishlist page
        window.location.href = 'wunschliste.html';
    });
}

// ============================================
// NEWS SLIDER BELOW HEADER
// ============================================
function initNewsSlider() {
    const newsSlider = document.getElementById('newsSlider');
    if (!newsSlider) return;

    // Clone all news items for seamless loop
    const newsItems = Array.from(newsSlider.querySelectorAll('.news-item'));
    newsItems.forEach(item => {
        const clone = item.cloneNode(true);
        newsSlider.appendChild(clone);
    });

    // Add click handlers to all news items (original + clones)
    document.querySelectorAll('.news-item').forEach(item => {
        item.addEventListener('click', function() {
            const link = this.dataset.link;
            if (link) {
                window.location.href = link;
            }
        });
    });
}

// ============================================
// FOOTER NEWS SLIDER - V3
// ============================================
function initFooterNewsSlider() {
    const newsSlider = document.getElementById('footerNewsSlider');
    if (!newsSlider) return;

    // Clone all news items for seamless loop
    const newsItems = Array.from(newsSlider.querySelectorAll('.footer-news-item'));
    newsItems.forEach(item => {
        const clone = item.cloneNode(true);
        newsSlider.appendChild(clone);
    });

    // Add click handlers to all news items (original + clones)
    document.querySelectorAll('.footer-news-item').forEach(item => {
        item.addEventListener('click', function() {
            const link = this.dataset.link;
            if (link) {
                window.location.href = link;
            }
        });
    });
}

// ============================================
// LOAD MORE FUNCTIONALITY
// ============================================
function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener('click', function() {
        const productsGrid = document.getElementById('productsGrid');

        // Change button state
        this.disabled = true;
        this.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="loading-spinner">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            Lädt...
        `;

        // Simulate loading delay
        setTimeout(() => {
            // Generate 8 more random products
            const moreProducts = generateRandomProducts(8);

            moreProducts.forEach(product => {
                const productCard = createProductCard(product);
                productsGrid.innerHTML += productCard;
            });

            // Re-attach event listeners to new products
            attachProductEventListeners();

            // Update cart button states for new products
            updateCartButtonStates();

            // Reset button
            this.disabled = false;
            this.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                Mehr Produkte laden
            `;

            // Products loaded

            currentPage++;
        }, 1000);
    });
}

// ============================================
// GENERATE RANDOM PRODUCTS
// ============================================
function generateRandomProducts(count) {
    const brands = ['Zara', 'H&M', 'Nike', 'Adidas', 'Mango', 'Esprit', 'Tommy Hilfiger', 'Levis', 'Puma', 'Only'];
    const items = ['Jacke', 'Hose', 'Kleid', 'Pullover', 'Shirt', 'Jeans', 'Rock', 'Bluse', 'Sneakers', 'Mantel'];
    const conditions = ['Neu', 'Neuwertig', 'Sehr gut', 'Gut'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const tiers = ['champion', 'profi', 'fortgeschritten', 'einsteiger'];

    const products = [];
    const startId = sampleProducts.length + (currentPage - 1) * 8 + 1;

    for (let i = 0; i < count; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const item = items[Math.floor(Math.random() * items.length)];
        const newPrice = (Math.random() * 150 + 20).toFixed(2);
        const price = (newPrice * (0.3 + Math.random() * 0.4)).toFixed(2);
        const carbonSaved = (Math.random() * 30 + 5).toFixed(1);

        products.push({
            id: startId + i,
            brand: brand,
            name: `${item} ${brand} Style`,
            size: sizes[Math.floor(Math.random() * sizes.length)],
            condition: conditions[Math.floor(Math.random() * conditions.length)],
            price: parseFloat(price),
            newPrice: parseFloat(newPrice),
            carbonSaved: parseFloat(carbonSaved),
            tier: tiers[Math.floor(Math.random() * tiers.length)],
            image: `https://source.unsplash.com/500x667/?fashion,${item}`,
            sale: Math.random() > 0.7
        });
    }

    return products;
}

// ============================================
// WISHLIST INITIALIZATION
// ============================================
function initWishlist() {
    // Wishlist is loaded from localStorage at the top
    console.log(`Wishlist initialized with ${wishlist.length} items`);
}

// ============================================
// HIDE MESSAGE ICON FOR GUESTS
// ============================================
function hideMessageIconForGuests() {
    // Check if user is logged in
    const loggedIn = window.isLoggedIn && window.isLoggedIn();

    // Find all message/negotiation icon buttons
    const messageButtons = document.querySelectorAll('[title="Verhandlungen"], .icon-btn[onclick*="messages.html"]');

    messageButtons.forEach(button => {
        if (!loggedIn) {
            // Hide the button for non-logged-in users
            button.style.display = 'none';
        } else {
            // Show the button for logged-in users
            button.style.display = '';
        }
    });

    console.log(`Message icon ${loggedIn ? 'visible' : 'hidden'} for ${loggedIn ? 'logged-in' : 'guest'} users`);
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : type === 'warning' ? '#FF9800' : '#2196F3'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .loading-spinner {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// MEGA MENU INTERACTIONS
// ============================================
function initMegaMenus() {
    const categoryItems = document.querySelectorAll('.category-item');

    // Desktop: Hover behavior (already handled by CSS)
    // Mobile/Tablet: Click behavior
    if (window.innerWidth <= 1024) {
        categoryItems.forEach(item => {
            const btn = item.querySelector('.category-btn');
            const megaMenu = item.querySelector('.mega-menu');

            btn.addEventListener('click', function(e) {
                e.stopPropagation();

                // Close all other mega menus
                categoryItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle current mega menu
                item.classList.toggle('active');
            });
        });

        // Close mega menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.category-item')) {
                categoryItems.forEach(item => {
                    item.classList.remove('active');
                });
            }
        });
    }
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchClearBtn = document.getElementById('searchClearBtn');

    if (!searchInput || !searchClearBtn) return;

    // Show/hide clear button
    searchInput.addEventListener('input', function() {
        if (this.value.length > 0) {
            searchClearBtn.style.display = 'flex';
        } else {
            searchClearBtn.style.display = 'none';
        }

        // Perform search
        performSearch(this.value);
    });

    // Clear search
    searchClearBtn.addEventListener('click', function() {
        searchInput.value = '';
        searchClearBtn.style.display = 'none';
        performSearch('');
        searchInput.focus();
    });

    // Search on Enter key
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value);
        }
    });
}

async function performSearch(query) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const lowerQuery = query.toLowerCase().trim();

    if (lowerQuery === '') {
        // Reload all products when search is empty
        await initProducts();
        return;
    }

    try {
        // Search using backend API (uses environment-aware API_BASE_URL)
        const response = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(lowerQuery)}`);
        const data = await response.json();

        // Transform backend data to frontend format
        const products = data.products.map(p => ({
            id: p.id,
            brand: p.brand || 'Unbekannt',
            name: p.title || '',
            size: p.size || '',
            condition: p.condition || 'Gebraucht',
            price: p.price || 0,
            newPrice: p.original_price || (p.price * 2),
            carbonSaved: Math.round((p.price || 0) * 0.4 * 10) / 10,
            tier: 'champion',
            image: (p.images && p.images.length > 0) ? p.images[0] : 'https://images.unsplash.com/photo-1542272454315-7f6f36d69c8d?w=500',
            sale: false
        }));

        // Clear grid and display search results
        productsGrid.innerHTML = '';

        if (products.length === 0) {
            productsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #757575;">Keine Produkte gefunden</p>';
            return;
        }

        products.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.innerHTML += productCard;
        });

        // Attach event listeners to new cards
        attachProductEventListeners();
        updateCartButtonStates();

        console.log(`Search "${lowerQuery}": ${products.length} results`);
    } catch (error) {
        console.error('Error searching products:', error);
        // Fallback to client-side filtering on existing cards
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const title = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
            const brand = card.querySelector('.product-brand')?.textContent.toLowerCase() || '';

            if (title.includes(lowerQuery) || brand.includes(lowerQuery)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// ============================================
// CONSOLE INFO
// ============================================
console.log('%cCSS Berlin V3', 'color: #2D5016; font-size: 24px; font-weight: bold;');
console.log('%cClimate Smart Solutions', 'color: #757575; font-size: 14px;');
console.log(`Loaded ${sampleProducts.length} products`);
console.log(`Wishlist: ${wishlist.length} items`);
