// CSS BERLIN - PRODUCT CARD GENERATOR (V3.8)
function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = products.map(product => {
        // Satıldı Durumu (Simülasyon: Rastgele %20 ihtimalle satıldı göster)
        const isSold = product.status === 'sold' || Math.random() < 0.2;
        const soldBadge = isSold ? `<div class="sold-badge">VERKAUFT</div>` : '';
        const cardClass = isSold ? 'product-card sold' : 'product-card';

        return `
        <div class="${cardClass}">
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
                ${soldBadge}
                
                <button class="card-icon-btn cart-btn" onclick="addToCart('${product.id}')" title="In den Warenkorb">
                    <i data-lucide="shopping-cart"></i>
                </button>
                
                <button class="card-icon-btn wish-btn" onclick="toggleWishlist('${product.id}')" title="Merken">
                    <i data-lucide="heart"></i>
                </button>
            </div>

            <div class="product-info">
                <div class="product-brand">${product.brand || 'Markenlos'}</div>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-meta">
                    <span class="product-size">${product.size || 'M'}</span>
                    <span class="product-price">${product.price} €</span>
                </div>

                <div class="product-actions-row">
                    ${isSold ?
                '<button class="btn-action btn-disabled" disabled>Bereits verkauft</button>' :
                `
                        <button class="btn-action btn-negotiate" onclick="startNegotiation('${product.id}')">
                            <i data-lucide="message-circle"></i> Verhandeln
                        </button>
                        <button class="btn-action btn-buy" onclick="buyNow('${product.id}')">
                            Kaufen
                        </button>
                        `
            }
                </div>
            </div>
        </div>
        `;
    }).join('');

    // İkonları yeniden oluştur
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Fonksiyonlar
function startNegotiation(id) {
    alert("Pazarlık sistemi başlatılıyor... Ürün ID: " + id);
    // Buraya negotiation-modal açma kodu gelecek
}

function buyNow(id) {
    window.location.href = `checkout.html?product_id=${id}`;
}

function addToCart(id) {
    alert("Sepete eklendi!");
}
