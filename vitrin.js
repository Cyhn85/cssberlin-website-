function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = products.map(product => {
        // Satıldı Durumu (Simülasyon: Rastgele %20 şansla)
        const isSold = product.status === 'sold' || Math.random() < 0.2;
        const soldBadge = isSold ? `<div class="sold-badge">VERKAUFT</div>` : '';
        const cardClass = isSold ? 'product-card sold' : 'product-card';

        return `
        <div class="${cardClass}" onclick="window.location.href='product-detail.html?id=${product.id}'" style="cursor:pointer;">
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
                ${soldBadge}
                
                <button class="card-icon-btn cart-btn" onclick="addToCart('${product.id}', event)" title="In den Warenkorb">
                    <i data-lucide="shopping-cart"></i>
                </button>
                
                <button class="card-icon-btn wish-btn" onclick="toggleWishlist('${product.id}', event)" title="Merken">
                    <i data-lucide="heart"></i>
                </button>
            </div>

            <div class="product-info">
                <div class="product-header-row" style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="product-brand">${product.brand || 'Markenlos'}</span>
                    <span class="product-size">${product.size || 'M'}</span>
                </div>
                
                <h3 class="product-title">${product.title}</h3>
                
                <div class="product-meta">
                    <div class="product-price">${product.price} €</div>
                </div>

                <div class="product-actions-row">
                    ${isSold ?
                '<button class="btn-action btn-disabled" disabled onclick="event.stopPropagation()">Bereits verkauft</button>' :
                `
                        <button class="btn-action btn-negotiate" onclick="startNegotiation('${product.id}', event)">
                            <i data-lucide="message-circle" style="width:12px;"></i> Verhandeln
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

    // Lucide ikonlarını yeniden oluştur
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Olayların bubbling yapmasını önlemek için event.stopPropagation() ekledik
function startNegotiation(id, event) {
    event.stopPropagation();
    alert("Pazarlık sistemi başlatılıyor... Ürün ID: " + id);
}

function buyNow(id, event) {
    event.stopPropagation();
    window.location.href = `checkout.html?product_id=${id}`;
}

function addToCart(id, event) {
    event.stopPropagation();
    alert("Sepete eklendi!");
}

function toggleWishlist(id, event) {
    event.stopPropagation();
    // Wishlist logic here
    alert("Favorilere eklendi/çıkarıldı!");
}
