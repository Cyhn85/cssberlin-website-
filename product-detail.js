
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Get Product ID from URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        window.location.href = 'index.html'; // Redirect if no ID
        return;
    }

    // 2. Fetch Product Data
    try {
        const product = await fetchProductData(productId);
        if (product) {
            renderProduct(product);
        } else {
            // Show error or redirect
            document.body.innerHTML = '<div style="text-align:center; padding:50px;"><h2>Produkt nicht gefunden</h2><a href="index.html">Zurück zur Startseite</a></div>';
        }
    } catch (error) {
        console.error('Error loading product:', error);
    }
});

async function fetchProductData(id) {
    // A. Try API first
    try {
        // Mock API call for now or use real endpoint if available
        // const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
        // if (response.ok) return await response.json();
        throw new Error("API not fully ready");
    } catch (e) {
        // B. Fallback to Vitrin/Sample Data
        console.log('Fetching from fallback data...');

        // Combine all known sample sources
        let allProducts = [];
        if (window.vitrinManager && window.vitrinManager.getDemoProducts) {
            allProducts = [...allProducts, ...window.vitrinManager.getDemoProducts()];
        }
        if (typeof sampleProducts !== 'undefined') {
            allProducts = [...allProducts, ...sampleProducts];
        }

        return allProducts.find(p => p.id == id);
    }
}

function renderProduct(product) {
    // Update Title & Meta
    document.title = `${product.name} - CSS Berlin`;

    // Image Gallery
    const mainImage = document.getElementById('mainImage');
    if (mainImage) mainImage.src = product.image;

    // Product Info
    setText('productBrand', product.brand);
    setText('productName', product.name);
    setText('productCondition', product.condition);
    setText('productSize', product.size);
    setText('productPrice', `${product.price.toFixed(0)}€`);

    // Original Price (if exists)
    const oldPriceEl = document.getElementById('productOldPrice');
    if (product.newPrice && oldPriceEl) {
        oldPriceEl.textContent = `${product.newPrice.toFixed(0)}€`;
        oldPriceEl.style.display = 'inline';
    } else if (oldPriceEl) {
        oldPriceEl.style.display = 'none';
    }

    // Seller Info (Mock if missing)
    const seller = product.seller || {
        name: 'Lisa G.',
        initials: 'LG',
        location: 'Berlin, Charlottenburg',
        rating: 4.9,
        reviews: 24,
        verified: true,
        avatarColor: '#FF8C42'
    };

    setText('sellerName', seller.name);
    setText('sellerLocation', seller.location);
    setText('sellerInitials', seller.initials);
    if (document.getElementById('sellerAvatar')) {
        document.getElementById('sellerAvatar').style.backgroundColor = seller.avatarColor;
    }

    // CO2 Savings
    const saved = product.carbonSaved || (product.price * 0.15).toFixed(1);
    setText('carbonSaved', saved);

    // Setup Buttons
    const buyBtn = document.getElementById('btnBuy');
    if (buyBtn) {
        buyBtn.onclick = () => {
            // Add to cart logic or direct checkout
            // Check if user is logged in (optional but good practice)
            window.location.href = `checkout.html?productId=${product.id}`;
        };
    }

    const offerBtn = document.getElementById('btnOffer');
    if (offerBtn) {
        offerBtn.onclick = () => {
            // Check Login
            const user = localStorage.getItem('cssberlin_user');
            if (!user && window.authModal) {
                window.authModal.open('login'); // Assuming authModal is global
            } else if (!user) {
                // Fallback if authModal not loaded yet
                window.location.href = 'anmelden.html';
            } else {
                // Start negotiation
                window.location.href = `pazarlik.html?create_offer=${product.id}`;
            }
        };
    }
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}
