// ============================================
// CSS Berlin V3 - Climate Smart Solutions
// Main JavaScript - 2-Button Product Layout
// ============================================

// ============================================
// ENVIRONMENT CONFIGURATION
// ============================================
// Auto-detect backend API URL based on hostname
const API_BASE_URL = (function () {
    const hostname = window.location.hostname;

    // Local development - direct backend connection
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8000';
    }

    // Production - use Cloudflare Pages Function proxy (HTTPS)
    // All /api/* requests are proxied to backend via functions/api/[[path]].js
    return '';  // Empty string = relative URL (same origin)
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
        sale: false,
        status: 'active'
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
        sale: true,
        status: 'sold' // TEST: Satılmış ürün
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
        sale: false,
        status: 'active' // TEST: Aktif ürün
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
    },
    // === DAMEN (17-26) ===
    {
        id: 17,
        brand: 'COS',
        name: 'Midi Kleid Minimalist',
        size: 'S',
        condition: 'Neuwertig',
        price: 58.00,
        newPrice: 115.00,
        carbonSaved: 21.3,
        tier: 'champion',
        image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500',
        sale: false
    },
    {
        id: 18,
        brand: 'Massimo Dutti',
        name: 'Seidenbluse Creme',
        size: 'M',
        condition: 'Sehr gut',
        price: 42.00,
        newPrice: 89.95,
        carbonSaved: 14.8,
        tier: 'profi',
        image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=500',
        sale: true
    },
    {
        id: 19,
        brand: 'Mango',
        name: 'Plissee Rock Schwarz',
        size: 'S',
        condition: 'Gut',
        price: 28.00,
        newPrice: 59.99,
        carbonSaved: 11.2,
        tier: 'profi',
        image: 'https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=500',
        sale: false
    },
    {
        id: 20,
        brand: 'Arket',
        name: 'Wollmantel Camel',
        size: 'M',
        condition: 'Sehr gut',
        price: 95.00,
        newPrice: 199.00,
        carbonSaved: 32.5,
        tier: 'champion',
        image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500',
        sale: false
    },
    {
        id: 21,
        brand: 'Steve Madden',
        name: 'Ankle Boots Schwarz',
        size: '38',
        condition: 'Neuwertig',
        price: 65.00,
        newPrice: 139.00,
        carbonSaved: 18.7,
        tier: 'champion',
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500',
        sale: true
    },
    {
        id: 22,
        brand: 'Sandro',
        name: 'Tweed Blazer Rosa',
        size: 'S',
        condition: 'Sehr gut',
        price: 78.00,
        newPrice: 165.00,
        carbonSaved: 24.1,
        tier: 'champion',
        image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=500',
        sale: false
    },
    {
        id: 23,
        brand: 'Reformation',
        name: 'Leinenkleid Sommer',
        size: 'M',
        condition: 'Gut',
        price: 52.00,
        newPrice: 110.00,
        carbonSaved: 19.6,
        tier: 'profi',
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500',
        sale: true
    },
    {
        id: 24,
        brand: 'Ganni',
        name: 'Statement Bluse Print',
        size: 'S',
        condition: 'Neuwertig',
        price: 68.00,
        newPrice: 145.00,
        carbonSaved: 16.9,
        tier: 'champion',
        image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500',
        sale: false
    },
    {
        id: 25,
        brand: 'Sam Edelman',
        name: 'Pumps Nude Leder',
        size: '39',
        condition: 'Sehr gut',
        price: 55.00,
        newPrice: 120.00,
        carbonSaved: 15.3,
        tier: 'profi',
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500',
        sale: false
    },
    {
        id: 26,
        brand: 'All Saints',
        name: 'Lederjacke Biker',
        size: 'M',
        condition: 'Sehr gut',
        price: 145.00,
        newPrice: 320.00,
        carbonSaved: 42.8,
        tier: 'champion',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
        sale: true
    },
    // === HERREN (27-36) ===
    {
        id: 27,
        brand: 'Hugo Boss',
        name: 'Slim Fit Hemd Weiß',
        size: 'L',
        condition: 'Neuwertig',
        price: 45.00,
        newPrice: 89.95,
        carbonSaved: 13.2,
        tier: 'profi',
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500',
        sale: false
    },
    {
        id: 28,
        brand: 'Diesel',
        name: 'Slim Jeans Dunkelblau',
        size: '32',
        condition: 'Gut',
        price: 48.00,
        newPrice: 109.00,
        carbonSaved: 16.5,
        tier: 'profi',
        image: 'https://images.unsplash.com/photo-1542272454315-7f6f36d69c8d?w=500',
        sale: true
    },
    {
        id: 29,
        brand: 'Tiger of Sweden',
        name: 'Anzug Anthrazit',
        size: '50',
        condition: 'Sehr gut',
        price: 185.00,
        newPrice: 450.00,
        carbonSaved: 58.4,
        tier: 'champion',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500',
        sale: false
    },
    {
        id: 30,
        brand: 'New Balance',
        name: 'Sneaker 550 Weiß',
        size: '43',
        condition: 'Gut',
        price: 72.00,
        newPrice: 149.00,
        carbonSaved: 21.7,
        tier: 'champion',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
        sale: false
    },
    {
        id: 31,
        brand: 'Barbour',
        name: 'Wachsjacke Oliv',
        size: 'L',
        condition: 'Sehr gut',
        price: 125.00,
        newPrice: 279.00,
        carbonSaved: 35.2,
        tier: 'champion',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500',
        sale: true
    },
    {
        id: 32,
        brand: 'Ralph Lauren',
        name: 'Oxford Hemd Blau',
        size: 'M',
        condition: 'Neuwertig',
        price: 52.00,
        newPrice: 99.95,
        carbonSaved: 14.1,
        tier: 'profi',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
        sale: false
    },
    {
        id: 33,
        brand: 'Nudie Jeans',
        name: 'Jeans Gritty Jackson',
        size: '31',
        condition: 'Gut',
        price: 58.00,
        newPrice: 129.00,
        carbonSaved: 18.9,
        tier: 'profi',
        image: 'https://images.unsplash.com/photo-1542272454315-7f6f36d69c8d?w=500',
        sale: false
    },
    {
        id: 34,
        brand: 'Converse',
        name: 'Chuck Taylor High',
        size: '44',
        condition: 'Sehr gut',
        price: 38.00,
        newPrice: 85.00,
        carbonSaved: 12.4,
        tier: 'fortgeschritten',
        image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=500',
        sale: true
    },
    {
        id: 35,
        brand: 'The North Face',
        name: 'Puffer Jacke Schwarz',
        size: 'L',
        condition: 'Neuwertig',
        price: 115.00,
        newPrice: 249.00,
        carbonSaved: 38.6,
        tier: 'champion',
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500',
        sale: false
    },
    {
        id: 36,
        brand: 'Carhartt WIP',
        name: 'Chino Hose Beige',
        size: 'M',
        condition: 'Gut',
        price: 42.00,
        newPrice: 89.00,
        carbonSaved: 13.8,
        tier: 'profi',
        image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500',
        sale: false
    },
    // === KINDER (37-39) ===
    {
        id: 37,
        brand: 'Mini Rodini',
        name: 'Kinder Hoodie Bunt',
        size: '110',
        condition: 'Sehr gut',
        price: 28.00,
        newPrice: 65.00,
        carbonSaved: 8.5,
        tier: 'fortgeschritten',
        image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500',
        sale: true
    },
    {
        id: 38,
        brand: 'Petit Bateau',
        name: 'Kinder T-Shirt Set',
        size: '128',
        condition: 'Neuwertig',
        price: 22.00,
        newPrice: 45.00,
        carbonSaved: 6.2,
        tier: 'einsteiger',
        image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500',
        sale: false
    },
    {
        id: 39,
        brand: 'Geox',
        name: 'Kinder Sneaker Blau',
        size: '32',
        condition: 'Gut',
        price: 32.00,
        newPrice: 69.95,
        carbonSaved: 9.8,
        tier: 'fortgeschritten',
        image: 'https://images.unsplash.com/photo-1555274175-75f79b09d5b8?w=500',
        sale: false
    },
    // === ACCESSOIRES (40) ===
    {
        id: 40,
        brand: 'Michael Kors',
        name: 'Crossbody Tasche',
        size: 'OneSize',
        condition: 'Sehr gut',
        price: 85.00,
        newPrice: 195.00,
        carbonSaved: 22.4,
        tier: 'champion',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500',
        sale: true
    }
];

// ============================================
// GLOBAL STATE
// ============================================
// Pagination (2026 launch: 5x4 = 20 products initial, 10 per load)
const INITIAL_PRODUCTS = 20;    // Başlangıç: 5 sütun x 4 satır
const LOAD_MORE_SIZE = 10;      // Her yüklemede: 5 sütun x 2 satır
const PRODUCTS_PAGE_SIZE = INITIAL_PRODUCTS; // İlk yükleme için
let currentOffset = 0;
let activeCategoryFilter = null;
let canLoadMore = true;

// Favorites (unified with favoritesManager when available)
let favoriteIds = new Set();

// ============================================
// FAVORITES HELPERS (bridge to favorites.js)
// ============================================
function applyFavoriteButtonState(button, isFav) {
    if (!button) return;
    const svg = button.querySelector('svg');

    if (isFav) {
        button.classList.add('active');
        if (svg) {
            svg.setAttribute('fill', '#F44336');
            svg.setAttribute('stroke', '#F44336');
        }
        button.title = 'Von Wunschliste entfernen';
    } else {
        button.classList.remove('active');
        if (svg) {
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
        }
        button.title = 'Zur Wunschliste hinzufügen';
    }
}

async function refreshFavoriteIds() {
    try {
        // Preferred: FavoritesManager (favorites.js)
        if (typeof favoritesManager !== 'undefined' && favoritesManager) {
            if (typeof favoritesManager.init === 'function') await favoritesManager.init();
            if (typeof favoritesManager.getFavorites === 'function') {
                const favs = await favoritesManager.getFavorites();
                favoriteIds = new Set(
                    (favs || [])
                        .map((f) => Number(f?.id))
                        .filter((n) => Number.isFinite(n))
                );
                return favoriteIds;
            }
        }
    } catch (e) {
        // fall back
    }

    // Fallback: legacy wishlist array in localStorage
    try {
        const raw = localStorage.getItem('wishlist');
        const ids = raw ? JSON.parse(raw) : [];
        favoriteIds = new Set((ids || []).map((n) => Number(n)).filter((n) => Number.isFinite(n)));
    } catch (e) {
        favoriteIds = new Set();
    }
    return favoriteIds;
}

async function toggleFavoriteUI(productId, button, productData) {
    const id = Number(productId);

    try {
        // Preferred: FavoritesManager (favorites.js)
        if (typeof favoritesManager !== 'undefined' && favoritesManager) {
            if (typeof favoritesManager.init === 'function') await favoritesManager.init();
            if (typeof favoritesManager.toggleFavorite === 'function') {
                await favoritesManager.toggleFavorite(id, productData || null);
                const isFav = typeof favoritesManager.isFavorite === 'function'
                    ? await favoritesManager.isFavorite(id)
                    : favoriteIds.has(id);

                if (isFav) favoriteIds.add(id);
                else favoriteIds.delete(id);

                applyFavoriteButtonState(button, isFav);
                return isFav;
            }
        }
    } catch (e) {
        // fall back
    }

    // Fallback: legacy wishlist array in localStorage
    try {
        const raw = localStorage.getItem('wishlist');
        const list = raw ? JSON.parse(raw) : [];
        const idx = (list || []).findIndex((x) => Number(x) === id);
        let isFav = false;
        if (idx >= 0) {
            list.splice(idx, 1);
            isFav = false;
        } else {
            list.push(id);
            isFav = true;
        }
        localStorage.setItem('wishlist', JSON.stringify(list));
        if (isFav) favoriteIds.add(id);
        else favoriteIds.delete(id);
        applyFavoriteButtonState(button, isFav);
        return isFav;
    } catch (e) {
        return false;
    }
}

// ============================================
// INITIALIZE APP
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    // Check if page has a specific category filter
    const category = window.pageCategory || null;
    initProducts(category);
    initNewsSlider();
    initFooterNewsSlider();
    initLoadMore();
    initMegaMenus();
    initSearch();
    hideMessageIconForGuests();
    initHeroSlider();
    initSocialHub();

    // ── Vitrin: 40 demo ürün yükleme (vitrin.js) ──
    // vitrin.js script.js'den sonra yüklenir → setTimeout ile bekle
    setTimeout(function () {
        if (window.vitrinManager) {
            window.vitrinManager.init('featuredProductsGrid');
            console.log('[Vitrin] 40 demo ürün yüklendi ✅');
        } else {
            // Fallback: eskisi çalışsın
            loadFeaturedProducts();
            loadRecommendations();
        }
    }, 100);
});


// ============================================
// FEATURED PRODUCTS
// ============================================
async function loadFeaturedProducts() {
    const featuredGrid = document.getElementById('featuredProductsGrid');
    if (!featuredGrid) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/products?is_featured=true`);
        const data = await response.json();
        const products = data.products.map(p => ({
            id: p.id,
            brand: p.brand || 'Unbekannt',
            name: p.name || '',
            size: p.size || '',
            condition: p.condition || 'Gebraucht',
            price: p.price || 0,
            newPrice: p.original_price || (p.price * 2),
            carbonSaved: Math.round((p.price || 0) * 0.4 * 10) / 10,
            tier: 'champion',
            image: (p.images && p.images.length > 0) ? p.images[0] : 'https://images.unsplash.com/photo-1542272454315-7f6f36d69c8d?w=500',
            sale: false
        }));

        if (products.length === 0) {
            featuredGrid.innerHTML = '<p>Keine hervorgehobenen Produkte gefunden.</p>';
            return;
        }

        featuredGrid.innerHTML = '';
        products.forEach(product => {
            const productCard = createProductCard(product);
            featuredGrid.innerHTML += productCard;
        });

        attachProductEventListeners();
        updateCartButtonStates();

    } catch (error) {
        console.error('Error loading featured products:', error);
        // Fallback to sample products
        featuredGrid.innerHTML = '';
        const featuredSamples = sampleProducts.slice(0, 8);
        featuredSamples.forEach(product => {
            const productCard = createProductCard(product);
            featuredGrid.innerHTML += productCard;
        });
        attachProductEventListeners();
        updateCartButtonStates();
        console.log('Loaded featured products from fallback samples');
    }
}


// ============================================
// RECOMMENDATIONS
// ============================================
async function loadRecommendations() {
    const recommendationsGrid = document.getElementById('recommendationsGrid');
    if (!recommendationsGrid) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/products/recommendations/user`);
        const data = await response.json();
        const products = data.recommendations.map(p => ({
            id: p.id,
            brand: p.brand || 'Unbekannt',
            name: p.name || '',
            size: p.size || '',
            condition: p.condition || 'Gebraucht',
            price: p.price || 0,
            newPrice: p.original_price || (p.price * 2),
            carbonSaved: Math.round((p.price || 0) * 0.4 * 10) / 10,
            tier: 'champion',
            image: (p.images && p.images.length > 0) ? p.images[0] : 'https://images.unsplash.com/photo-1542272454315-7f6f36d69c8d?w=500',
            sale: false
        }));

        if (products.length === 0) {
            recommendationsGrid.innerHTML = '<p>Keine Empfehlungen gefunden.</p>';
            return;
        }

        recommendationsGrid.innerHTML = '';
        products.forEach(product => {
            const productCard = createProductCard(product);
            recommendationsGrid.innerHTML += productCard;
        });

        attachProductEventListeners();
        updateCartButtonStates();

    } catch (error) {
        console.error('Error loading recommendations:', error);
        // Fallback to sample products (shuffled)
        recommendationsGrid.innerHTML = '';
        const shuffled = [...sampleProducts].sort(() => Math.random() - 0.5);
        const recommendationSamples = shuffled.slice(0, 8);
        recommendationSamples.forEach(product => {
            const productCard = createProductCard(product);
            recommendationsGrid.innerHTML += productCard;
        });
        attachProductEventListeners();
        updateCartButtonStates();
        console.log('Loaded recommendations from fallback samples');
    }
}

// ============================================
// PRODUCT CARD CREATION - PHASE G REDESIGN
// ============================================
function createProductCard(product) {
    // Check if product is in wishlist
    const inWishlist = favoriteIds.has(product.id);

    const discount = Math.round(((product.newPrice - product.price) / product.newPrice) * 100);

    // Generate seller info (mock data for now, will be replaced with API data)
    const seller = product.seller || generateMockSeller();
    const uploadedAgo = product.uploadedAgo || generateUploadTime();
    const location = product.location || seller.location || 'Berlin';

    // PHASE G: Badge class - "Neu" gets orange, others get dark default
    const badgeClass = product.condition === 'Neu' || product.condition === 'Neuwertig' ? 'neu' : '';

    // Check if product is sold
    const isSold = product.status === 'sold';

    return `
        <div class="product-card-v3 ${isSold ? 'sold' : ''}" data-product-id="${product.id}" data-status="${product.status || 'active'}">
            <div class="product-card-v3-inner">
                <div class="product-card-v3-img-wrap">
                    <img src="${product.image}"
                         alt="${product.name}"
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/400x533?text=Bild+nicht+verfuegbar'">

                    ${isSold ? '<div class="sold-badge">VERKAUFT</div>' : ''}
                    <div class="product-card-v3-badge ${badgeClass}">${product.condition}</div>

                    <!-- PHASE G: Independent Cart button (bottom-left) -->
                    <button class="product-card-v3-btn-cart add-to-cart-btn"
                            data-product-id="${product.id}"
                            title="In den Warenkorb">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </button>

                    <!-- PHASE G: Independent Heart button (bottom-right) -->
                    <button class="product-card-v3-btn-heart wishlist-btn ${inWishlist ? 'active' : ''}"
                            data-product-id="${product.id}"
                            title="${inWishlist ? 'Von Wunschliste entfernen' : 'Zur Wunschliste hinzufuegen'}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="${inWishlist ? '#F44336' : 'none'}" stroke="${inWishlist ? '#F44336' : 'currentColor'}" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>

                <div class="product-card-v3-body">
                    <div class="product-card-v3-price-row">
                        <div>
                            <span class="product-card-v3-price">${product.price.toFixed(0)}€</span>
                            <span style="font-size:10px;color:#999;margin-left:6px;text-decoration:line-through;">Neu: ${product.newPrice.toFixed(0)}€</span>
                        </div>
                        <span class="product-card-v3-brand">${product.brand}</span>
                    </div>

                    <h3 class="product-card-v3-name">${product.name}</h3>

                    <div class="product-meta" style="font-size:11px;color:#888;margin-bottom:8px;">
                        <span>Größe ${product.size}</span><span style="margin:0 4px;">|</span><span>${product.condition}</span>
                    </div>

                    <div class="product-card-v3-seller">
                        <div class="product-card-v3-seller-avatar" style="background:${seller.avatarColor || '#FF8C42'};">${seller.initials}</div>
                        <div class="product-card-v3-seller-info">
                            <strong>${seller.name}</strong>${seller.verified ? ' ✓' : ''}${seller.badge ? ` <span class="seller-badge seller-badge-${seller.badge}">${getBadgeIcon(seller.badge)}</span>` : ''}
                            <br>⭐ ${seller.rating} · 📍 ${location} · 🕐 ${uploadedAgo}
                        </div>
                    </div>

                    <!-- PHASE G: CO2 badge moved to body (below seller) -->
                    <div class="product-card-v3-co2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22L6.66,19.7C7.14,19.87,7.64,20,8,20C19,20,22,3,22,3C21,5,14,5.25,9,6.25C4,7.25,2,11.5,2,13.5C2,15.5,3.75,17.25,3.75,17.25C7,8,17,8,17,8Z"></path>
                        </svg>
                        <span>-${product.carbonSaved}kg CO₂</span>
                    </div>

                    <div class="product-card-v3-actions">
                        <button class="btn-energy-brand negotiate-btn" data-product-id="${product.id}" ${isSold ? 'disabled' : ''}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            Chat
                        </button>
                        <button class="btn-rainbow buy-btn" data-product-id="${product.id}" ${isSold ? 'disabled' : ''}>
                            <span>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                                </svg>
                                Kaufen
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// HELPER: Generate Mock Seller Data
// ============================================
function generateMockSeller() {
    const firstNames = ['Anna', 'Lisa', 'Maria', 'Sophie', 'Julia', 'Laura', 'Sarah', 'Emma', 'Max', 'Leon', 'Tim', 'Paul', 'Lukas', 'Felix', 'Jonas'];
    const lastInitials = ['K', 'M', 'S', 'B', 'W', 'H', 'F', 'G', 'L', 'P'];
    const locations = ['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen'];
    const badges = ['champion', 'pro', 'verified', 'eco', null, null]; // null = no badge
    const colors = ['#FF8C42', '#2D5016', '#2196F3', '#9C27B0', '#FF5722', '#4CAF50', '#00BCD4', '#FFC107'];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastInitial = lastInitials[Math.floor(Math.random() * lastInitials.length)];
    const name = `${firstName} ${lastInitial}.`;
    const initials = `${firstName.charAt(0)}${lastInitial}`;

    return {
        name: name,
        initials: initials,
        rating: (4.0 + Math.random() * 1.0).toFixed(1),
        verified: Math.random() > 0.4, // 60% verified
        badge: badges[Math.floor(Math.random() * badges.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        avatarColor: colors[Math.floor(Math.random() * colors.length)]
    };
}

// ============================================
// HELPER: Generate Upload Time
// ============================================
function generateUploadTime() {
    const options = [
        'vor 1 Std.',
        'vor 2 Std.',
        'vor 3 Std.',
        'vor 5 Std.',
        'vor 8 Std.',
        'vor 12 Std.',
        'vor 1 Tag',
        'vor 2 Tagen',
        'vor 3 Tagen',
        'vor 1 Woche'
    ];
    return options[Math.floor(Math.random() * options.length)];
}

// ============================================
// HELPER: Get Badge Icon
// ============================================
function getBadgeIcon(badgeType) {
    const badges = {
        'champion': '🏆',
        'pro': '⭐',
        'verified': '✓',
        'eco': '🌱'
    };
    return badges[badgeType] || '';
}

// ============================================
// INITIALIZE PRODUCTS
// ============================================
async function initProducts(category = null) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    activeCategoryFilter = category || null;
    currentOffset = 0;
    canLoadMore = true;

    try {
        // Build API URL with optional category filter
        let apiUrl = `${API_BASE_URL}/api/products?skip=${currentOffset}&limit=${PRODUCTS_PAGE_SIZE}`;
        if (category) {
            apiUrl += `&category=${encodeURIComponent(category)}`;
        }

        console.log('[API] Fetching products from:', apiUrl);

        // Load favorites once so hearts render correctly (guest/login)
        await refreshFavoriteIds();

        // Fetch products from backend API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Transform backend data to frontend format
        // NOTE: Backend schema uses `name` (not `title`).
        const products = data.products.map(p => ({
            id: p.id,
            brand: p.brand || 'Unbekannt',
            name: p.name || '',
            size: p.size || '',
            condition: p.condition || 'Gebraucht',
            price: p.price || 0,
            newPrice: p.original_price || (p.price * 2),
            carbonSaved: Math.round((p.price || 0) * 0.4 * 10) / 10,
            tier: 'champion',
            image: (p.images && p.images.length > 0) ? p.images[0] : 'https://images.unsplash.com/photo-1542272454315-7f6f36d69c8d?w=500',
            sale: false
        }));

        // Store products globally for card actions
        window.loadedProducts = products;

        // Display products (replace)
        productsGrid.innerHTML = '';
        products.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.innerHTML += productCard;
        });

        // Update pagination state
        currentOffset += products.length;
        canLoadMore = products.length === PRODUCTS_PAGE_SIZE;
        updateLoadMoreVisibility();

        // Attach event listeners
        attachProductEventListeners();

        // Update cart button states
        updateCartButtonStates();

        const categoryInfo = category ? ` (category: ${category})` : '';
        console.log(`Loaded ${products.length} products from backend${categoryInfo}`);
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to sample products if API fails
        await refreshFavoriteIds();
        const productsToShow = sampleProducts.slice(0, PRODUCTS_PAGE_SIZE);
        window.loadedProducts = productsToShow;
        productsGrid.innerHTML = '';
        productsToShow.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.innerHTML += productCard;
        });
        attachProductEventListeners();
        updateCartButtonStates();

        currentOffset = productsToShow.length;
        canLoadMore = sampleProducts.length > currentOffset;
        updateLoadMoreVisibility();
    }
}

// ============================================
// ATTACH EVENT LISTENERS TO PRODUCTS
// ============================================
function attachProductEventListeners() {
    // Product card click - go to product detail
    document.querySelectorAll('.product-card, .product-card-v3').forEach(card => {
        card.addEventListener('click', function (e) {
            // Don't navigate if clicking on buttons
            if (e.target.closest('.wishlist-btn, .buy-btn, .negotiate-btn, .quick-view-btn, .add-to-cart-btn')) {
                return;
            }
            const productId = this.dataset.productId;
            window.location.href = `product-detail.html?id=${productId}`;
        });
        card.style.cursor = 'pointer';
    });

    // Quick View buttons
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const productId = parseInt(this.dataset.productId);
            handleQuickView(productId);
        });
    });

    // Wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', async function (e) {
            e.preventDefault();
            e.stopPropagation();
            const productId = parseInt(this.dataset.productId);

            // Get product data
            const allProducts = window.loadedProducts || sampleProducts;
            const product = allProducts.find(p => p.id === productId);

            if (product) {
                // Toggle favorites (guest/login unified via favoritesManager)
                const productDataForFav = {
                    name: product.name,
                    brand: product.brand,
                    price: product.price,
                    images: product.image ? [product.image] : undefined,
                    size: product.size,
                    condition: product.condition
                };
                await toggleFavoriteUI(productId, this, productDataForFav);
            }
        });
    });

    // Add to Cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const productId = parseInt(this.dataset.productId);
            handleAddToCart(productId, this);
        });
    });

    // Buy buttons
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const productId = parseInt(this.dataset.productId);
            handleBuyClick(productId);
        });
    });

    // Negotiate buttons
    document.querySelectorAll('.negotiate-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation(); // Kart tıklamasını engelle
            const productId = parseInt(this.dataset.productId);
            // TODO: Implement handleNegotiateClick
            console.log('Negotiate clicked for product:', productId);

            // Eğer authModal varsa ve kullanıcı giriş yapmamışsa modalı aç
            // Basit kontrol: localStorage'da user var mı?
            const user = localStorage.getItem('cssberlin_user');
            if (!user && window.authModal) {
                authModal.open('login');
                return;
            }

            // Giriş yapmışsa pazarlık sayfasına git
            window.location.href = `meine-anzeigen.html?tab=negotiations&new=${productId}`;
        });
    });
}

// ============================================
// ADD TO CART HANDLER - WITH TOGGLE
// ============================================
function handleAddToCart(productId, buttonElement) {
    const allProducts = window.loadedProducts || sampleProducts;
    const product = allProducts.find(p => p.id === productId);
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
            buttonElement.style.background = '#2D5016';
            buttonElement.style.borderColor = '#2D5016';
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
            btn.style.background = '#2D5016';
            btn.style.borderColor = '#2D5016';
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
    const allProducts = window.loadedProducts || sampleProducts;
    const product = allProducts.find(p => p.id === productId);
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
    const allProducts = window.loadedProducts || sampleProducts;
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    // 2026 launch: "Verhandeln" starts offer flow
    // - Guest: authGate login modal (handled inside openQuickOfferModal)
    // - Logged-in: submit offer to backend
    if (typeof openQuickOfferModal === 'function') {
        openQuickOfferModal(
            product.id,
            product.name,
            Number(product.price || 0),
            product.image
        );
        return;
    }

    // Fallback
    if (typeof authGate !== 'undefined' && authGate) {
        authGate.showLoginModal('Verhandeln', 'verhandeln.html');
        return;
    }
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
        item.addEventListener('click', function () {
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
        item.addEventListener('click', function () {
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

    // Ensure correct initial visibility (after initProducts runs)
    updateLoadMoreVisibility();

    loadMoreBtn.addEventListener('click', async function () {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;
        if (!canLoadMore) {
            updateLoadMoreVisibility();
            return;
        }

        // Change button state
        this.disabled = true;
        this.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="loading-spinner">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            Lädt...
        `;

        try {
            let apiUrl = `${API_BASE_URL}/api/products?skip=${currentOffset}&limit=${LOAD_MORE_SIZE}`;
            if (activeCategoryFilter) {
                apiUrl += `&category=${encodeURIComponent(activeCategoryFilter)}`;
            }

            const response = await fetch(apiUrl);
            const data = await response.json();

            const products = (data.products || []).map(p => ({
                id: p.id,
                brand: p.brand || 'Unbekannt',
                name: p.name || '',
                size: p.size || '',
                condition: p.condition || 'Gebraucht',
                price: p.price || 0,
                newPrice: p.original_price || (p.price * 2),
                carbonSaved: Math.round((p.price || 0) * 0.4 * 10) / 10,
                tier: 'champion',
                image: (p.images && p.images.length > 0) ? p.images[0] : 'https://images.unsplash.com/photo-1542272454315-7f6f36d69c8d?w=500',
                sale: false
            }));

            if (products.length === 0) {
                canLoadMore = false;
                updateLoadMoreVisibility();
                return;
            }

            // Append and keep global list updated
            const current = window.loadedProducts || [];
            window.loadedProducts = current.concat(products);

            products.forEach(product => {
                const productCard = createProductCard(product);
                productsGrid.innerHTML += productCard;
            });

            currentOffset += products.length;
            canLoadMore = products.length === LOAD_MORE_SIZE;
            updateLoadMoreVisibility();

            attachProductEventListeners();
            updateCartButtonStates();
        } catch (e) {
            console.error('Load more failed:', e);
            // Fallback: paginate sample products
            const fallbackMore = sampleProducts.slice(currentOffset, currentOffset + LOAD_MORE_SIZE);
            if (fallbackMore.length === 0) {
                canLoadMore = false;
                updateLoadMoreVisibility();
                return;
            }

            const current = window.loadedProducts || [];
            window.loadedProducts = current.concat(fallbackMore);

            fallbackMore.forEach(product => {
                const productCard = createProductCard(product);
                productsGrid.innerHTML += productCard;
            });

            currentOffset += fallbackMore.length;
            canLoadMore = sampleProducts.length > currentOffset;
            updateLoadMoreVisibility();
            attachProductEventListeners();
            updateCartButtonStates();
        } finally {
            // Reset button
            this.disabled = false;
            this.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                Mehr Produkte laden
            `;
        }
    });
}

function updateLoadMoreVisibility() {
    const btn = document.getElementById('loadMoreBtn');
    const container = btn?.closest('.load-more-container');
    if (!container) return;

    container.style.display = canLoadMore ? 'flex' : 'none';
}

// ============================================
// HIDE MESSAGE ICON FOR GUESTS
// ============================================
function hideMessageIconForGuests() {
    // Check if user is logged in
    const loggedIn = (typeof authGate !== 'undefined' && authGate && authGate.isAuthenticated) ||
        (window.isLoggedIn && window.isLoggedIn());

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
        background: ${type === 'success' ? '#2D5016' : type === 'error' ? '#F44336' : type === 'warning' ? '#FF8C42' : '#FF8C42'};
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

            btn.addEventListener('click', function (e) {
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
        document.addEventListener('click', function (e) {
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
    searchInput.addEventListener('input', function () {
        if (this.value.length > 0) {
            searchClearBtn.style.display = 'flex';
        } else {
            searchClearBtn.style.display = 'none';
        }

        // Perform search
        performSearch(this.value);
    });

    // Clear search
    searchClearBtn.addEventListener('click', function () {
        searchInput.value = '';
        searchClearBtn.style.display = 'none';
        performSearch('');
        searchInput.focus();
    });

    // Search on Enter key
    searchInput.addEventListener('keydown', function (e) {
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
            name: p.name || p.title || '',
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
        // Search results are not paginated here
        canLoadMore = false;
        updateLoadMoreVisibility();

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
        const productCards = document.querySelectorAll('.product-card, .product-card-v3');
        productCards.forEach(card => {
            const title = (card.querySelector('.product-title') || card.querySelector('.product-card-v3-name'))?.textContent.toLowerCase() || '';
            const brand = (card.querySelector('.product-brand') || card.querySelector('.product-card-v3-brand'))?.textContent.toLowerCase() || '';

            if (title.includes(lowerQuery) || brand.includes(lowerQuery)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// ============================================
// QUICK VIEW HANDLER
// ============================================
function handleQuickView(productId) {
    const allProducts = window.loadedProducts || sampleProducts;
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    // For now, just redirect to product detail page
    // TODO: Implement modal quick view in future
    window.location.href = `product-detail.html?id=${productId}`;
}

// ============================================
// CONSOLE INFO
// ============================================
console.log('%cCSS Berlin V4', 'color: #2D5016; font-size: 24px; font-weight: bold;');
console.log('%cClimate Smart Solutions - With Seller Info', 'color: #757575; font-size: 14px;');
console.log(`Loaded ${sampleProducts.length} products`);
console.log(`Favorites loaded: ${favoriteIds.size}`);

// PHASE E — HeroSlider (auto-play campaign carousel)
// ============================================
const HERO_SLIDES = [
    {
        id: 1,
        title: "Willkommensgeschenk: 10% Rabatt",
        subtitle: "Melde dich jetzt an und erhalte 10% Rabatt auf deine erste Bestellung. Code: HELLO10",
        imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Kostenloser Versand ab 50€",
        subtitle: "Nachhaltig shoppen lohnt sich. Wir übernehmen die Versandkosten für alle Bestellungen über 50€.",
        imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Technik, die weiterlebt",
        subtitle: "Geprüfte Elektronik und Kameras mit 12 Monaten Garantie. Weniger Elektroschrott.",
        imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070&auto=format&fit=crop"
    }
];

function initHeroSlider() {
    const container = document.getElementById('heroSliderContainer');
    if (!container) return;

    // Render slides
    let slidesHTML = '';
    HERO_SLIDES.forEach((slide, i) => {
        slidesHTML += `
            <div class="hero-slide ${i === 0 ? 'active' : ''}" data-slide="${i}">
                <img src="${slide.imageUrl}" alt="${slide.title}" loading="lazy">
                <div class="hero-slide-overlay"></div>
                <div class="hero-slide-caption">
                    <span class="hero-tag">Featured Collection</span>
                    <h3>${slide.title}</h3>
                    <p>${slide.subtitle}</p>
                </div>
            </div>`;
    });

    // Render indicators
    let dotsHTML = '<div class="hero-indicators">';
    HERO_SLIDES.forEach((_, i) => {
        dotsHTML += `<button class="hero-dot ${i === 0 ? 'active' : ''}" data-dot="${i}"></button>`;
    });
    dotsHTML += '</div>';

    container.innerHTML = `
        <div class="hero-slider">
            ${slidesHTML}
            <button class="hero-nav-btn prev" id="heroPrevBtn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"></path></svg>
            </button>
            <button class="hero-nav-btn next" id="heroNextBtn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"></path></svg>
            </button>
            ${dotsHTML}
        </div>`;

    // State
    let current = 0;
    let locked = false;
    let autoplayTimer = null;

    const slides = container.querySelectorAll('.hero-slide');
    const dots = container.querySelectorAll('.hero-dot');

    function goTo(index) {
        if (locked) return;
        locked = true;
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = index;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
        // Unlock after transition duration
        setTimeout(() => { locked = false; }, 500);
    }

    function next() {
        goTo(current === HERO_SLIDES.length - 1 ? 0 : current + 1);
    }
    function prev() {
        goTo(current === 0 ? HERO_SLIDES.length - 1 : current - 1);
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(next, 5000);
    }
    function stopAutoplay() {
        if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
    }

    // Event listeners
    document.getElementById('heroNextBtn').addEventListener('click', function (e) {
        e.stopPropagation();
        next();
        startAutoplay(); // reset timer on manual click
    });
    document.getElementById('heroPrevBtn').addEventListener('click', function (e) {
        e.stopPropagation();
        prev();
        startAutoplay();
    });
    dots.forEach(dot => {
        dot.addEventListener('click', function (e) {
            e.stopPropagation();
            goTo(parseInt(this.dataset.dot));
            startAutoplay();
        });
    });

    // Start autoplay
    startAutoplay();
}

// ============================================
// PHASE F — ArgentLoopInfiniteSlider (Social Hub)
// Infinite vertical scroll: parallax + snap + RAF
// ============================================
function initSocialHub() {
    var container = document.getElementById('socialHubContainer');
    if (!container) return;

    var SOCIAL_DATA = [
        { title: "Instagram", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop", category: "Visual Stories", handle: "@css_berlin" },
        { title: "LinkedIn", image: "https://images.unsplash.com/photo-1560179707-f14e90ef3dab?q=80&w=1974&auto=format&fit=crop", category: "Corporate", handle: "CSS Berlin GmbH" },
        { title: "TikTok", image: "https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?q=80&w=1887&auto=format&fit=crop", category: "Viral Trends", handle: "@css_watch" },
        { title: "Twitter / X", image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=1974&auto=format&fit=crop", category: "Updates", handle: "@css_support" },
        { title: "Pinterest", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop", category: "Moodboards", handle: "CSS_Official" }
    ];

    var LERP = 0.08, BUFFER = 2, MAX_VEL = 100, SNAP_DUR = 700;

    // Replace placeholder with clean viewport
    container.innerHTML = '<div class="social-hub-viewport" style="position:relative;width:100%;height:100%;overflow:hidden;background:#111;"></div>';
    var viewport = container.querySelector('.social-hub-viewport');

    // Append label pill (outside viewport so it stays fixed)
    var label = document.createElement('div');
    label.className = 'social-hub-label';
    label.innerHTML = '<span class="social-hub-label-dot"></span><span>Social Hub</span>';
    container.appendChild(label);

    // --- State ---
    var currentY = 0, targetY = 0;
    var isDragging = false, isSnapping = false;
    var snapStart = { time: 0, y: 0, target: 0 };
    var lastScrollTime = Date.now();
    var dragStart = { y: 0, scrollY: 0 };
    var itemH = container.clientHeight;
    var rafId = null;
    var pool = {};          // index -> DOM element
    var parallaxMap = {};   // index -> current parallax value

    // --- Helpers ---
    function getData(i) {
        return SOCIAL_DATA[((i % SOCIAL_DATA.length) + SOCIAL_DATA.length) % SOCIAL_DATA.length];
    }
    function lerp(a, b, t) { return a + (b - a) * t; }

    // --- Slide pool management ---
    function createSlide(idx) {
        if (pool[idx]) return;
        var d = getData(idx);
        var el = document.createElement('div');
        el.className = 'social-hub-slide';
        el.innerHTML =
            '<img src="' + d.image + '" alt="' + d.title + '" loading="lazy" class="social-hub-slide-img">' +
            '<div class="social-hub-slide-content">' +
            '<span class="social-hub-slide-cat">' + d.category + '</span>' +
            '<h3 class="social-hub-slide-title">' + d.title + '</h3>' +
            '<p class="social-hub-slide-handle">' + d.handle + '</p>' +
            '<button class="social-hub-slide-follow">Folgen</button>' +
            '</div>';
        viewport.appendChild(el);
        pool[idx] = el;
    }
    function removeSlide(idx) {
        if (pool[idx]) { pool[idx].remove(); delete pool[idx]; }
    }
    function syncPool() {
        var ci = Math.round(-targetY / itemH);
        var min = ci - BUFFER, max = ci + BUFFER;
        // Remove out-of-range
        Object.keys(pool).forEach(function (k) {
            var i = parseInt(k);
            if (i < min || i > max) removeSlide(i);
        });
        // Add in-range
        for (var i = min; i <= max; i++) createSlide(i);
    }

    // --- Snap logic ---
    function snapTo() {
        var ci = Math.round(-targetY / itemH);
        isSnapping = true;
        snapStart = { time: Date.now(), y: targetY, target: -ci * itemH };
    }
    function updateSnap() {
        var p = Math.min((Date.now() - snapStart.time) / SNAP_DUR, 1);
        var eased = 1 - Math.pow(1 - p, 3); // cubic ease-out
        targetY = snapStart.y + (snapStart.target - snapStart.y) * eased;
        if (p >= 1) isSnapping = false;
    }

    // --- RAF loop ---
    function updatePositions() {
        Object.keys(pool).forEach(function (k) {
            var idx = parseInt(k);
            var el = pool[idx];
            var y = idx * itemH + currentY;
            el.style.transform = 'translateY(' + y + 'px)';

            // Parallax on image
            var img = el.querySelector('.social-hub-slide-img');
            if (img) {
                var cur = parallaxMap[idx] || 0;
                var tgt = (-currentY - idx * itemH) * 0.15;
                cur = lerp(cur, tgt, 0.1);
                parallaxMap[idx] = cur;
                img.style.transform = 'translateY(' + cur + 'px) scale(1.3)';
            }
        });
    }

    function animate() {
        var now = Date.now();
        // Trigger snap when idle
        if (!isSnapping && !isDragging && now - lastScrollTime > 100) {
            var sp = -Math.round(-targetY / itemH) * itemH;
            if (Math.abs(targetY - sp) > 1) snapTo();
        }
        if (isSnapping) updateSnap();
        if (!isDragging) currentY += (targetY - currentY) * LERP;

        updatePositions();
        syncPool();
        rafId = requestAnimationFrame(animate);
    }

    // --- Input handlers ---
    function onWheel(e) {
        e.preventDefault();
        e.stopPropagation();
        isSnapping = false;
        lastScrollTime = Date.now();
        targetY -= Math.max(Math.min(e.deltaY * 0.5, MAX_VEL), -MAX_VEL);
    }
    function onTouchStart(e) {
        isDragging = true;
        isSnapping = false;
        dragStart = { y: e.touches[0].clientY, scrollY: targetY };
        lastScrollTime = Date.now();
    }
    function onTouchMove(e) {
        if (!isDragging) return;
        if (e.cancelable) e.preventDefault();
        targetY = dragStart.scrollY + (e.touches[0].clientY - dragStart.y) * 1.5;
        lastScrollTime = Date.now();
    }
    function onTouchEnd() { isDragging = false; }

    // Bind events to container
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd);

    function onResize() { itemH = container.clientHeight; }
    window.addEventListener('resize', onResize);

    // --- Kick off ---
    syncPool();
    rafId = requestAnimationFrame(animate);
}

// ═══════════════════════════════════════════════════════
// FEATURED COLLECTION — Statik kartlar (Resim 1 match)
// ═══════════════════════════════════════════════════════
function initFeaturedCollection() {
    const container = document.getElementById('featuredCollectionGrid');
    if (!container) return;

    const featured = [
        {
            label: 'FEATURED COLLECTION',
            title: 'Technik, die weiterlebt',
            desc: 'Geprüfte Elektronik und Kameras mit 12 Monaten Garantie. Weniger Elektroschrott.',
            bg: 'linear-gradient(135deg, #1a2a1a 0%, #2d4a2d 100%)',
            link: 'herren.html',
            icon: '📷'
        },
        {
            label: 'NEW ARRIVALS',
            title: 'Frühlings-Kollektion',
            desc: 'Neue Styles für die kommende Saison. Nachhaltig, stylisch und bezahlbar.',
            bg: 'linear-gradient(135deg, #2D5016 0%, #4a8025 100%)',
            link: 'damen.html',
            icon: '👗'
        },
        {
            label: 'SALE',
            title: 'Bis zu 70% Rabatt',
            desc: 'Bis zu 70% Rabatt auf ausgewählte Artikel. Begrenztes Angebot!',
            bg: 'linear-gradient(135deg, #FF8C42 0%, #E8854C 100%)',
            link: 'damen.html',
            icon: '🔥'
        }
    ];

    container.innerHTML = featured.map(item => `
        <a href="${item.link}" class="featured-card" style="text-decoration:none;">
            <div style="width:100%;height:100%;min-height:280px;background:${item.bg};display:flex;align-items:center;justify-content:center;">
                <span style="font-size:64px;opacity:0.25;">${item.icon}</span>
            </div>
            <div class="featured-card-overlay">
                <span class="featured-card-label">${item.label}</span>
                <h3 class="featured-card-title">${item.title}</h3>
                <p class="featured-card-desc">${item.desc}</p>
            </div>
        </a>
    `).join('');
}

// Auto-init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initFeaturedCollection();
    initHeroSlider();
    // initSocialHub(); -- Replaced by liquid-gradient.js (initSocialHubLiquid)
    initNewsSlider();
    initFooterNewsSlider();
});

