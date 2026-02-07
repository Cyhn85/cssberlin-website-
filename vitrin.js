
// ============================================
// CSS BERLIN - VITRIN MANAGER (Demo Data)
// ============================================

window.vitrinManager = {
    init: function (targetId = 'productsGrid') {
        const grid = document.getElementById(targetId);
        if (!grid) {
            console.warn(`[Vitrin] Target grid '${targetId}' not found.`);
            return;
        }

        console.log(`[Vitrin] Initializing demo products into ${targetId}...`);

        // 40 Demo Products Mixed (Fashion, Electronics, Accessories)
        const products = this.getDemoProducts();

        // Clear and populate
        grid.innerHTML = '';
        products.forEach(product => {
            const card = this.createCard(product);
            grid.innerHTML += card;
        });

        // Re-attach listeners from script.js if available
        if (typeof attachProductEventListeners === 'function') {
            attachProductEventListeners();
        }
        if (typeof updateCartButtonStates === 'function') {
            updateCartButtonStates();
        }
    },

    createCard: function (product) {
        // Use existing createProductCard if available for consistency
        if (typeof createProductCard === 'function') {
            return createProductCard(product);
        }
        // Fallback card generator
        return `
            <div class="product-card-v3" data-product-id="${product.id}">
                <div class="product-card-v3-inner">
                    <div class="product-card-v3-img-wrap">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        ${product.sale ? '<div class="product-card-v3-badge sale">SALE</div>' : ''}
                        <div class="product-card-v3-condition-badge">${product.condition}</div>
                    </div>
                    <div class="product-card-v3-body">
                        <div class="product-card-v3-top-row">
                            <span class="product-card-v3-brand">${product.brand}</span>
                            <div class="product-card-v3-price-block">
                                <span class="product-card-v3-price">${product.price.toFixed(0)}€</span>
                                ${product.newPrice ? `<span class="product-card-v3-old-price">${product.newPrice.toFixed(0)}€</span>` : ''}
                            </div>
                        </div>
                         <div class="product-card-v3-main-row">
                            <h3 class="product-card-v3-name">${product.name}</h3>
                            <span class="product-card-v3-size-tag">${product.size}</span>
                        </div>
                         <div class="product-card-v3-actions">
                            <button class="gradient-button gradient-button-variant negotiate-btn">Gebot</button>
                            <button class="gradient-button buy-btn">Kaufen</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    getDemoProducts: function () {
        return [
            // --- TOP SELLER (1-4) ---
            { id: 101, brand: 'Apple', name: 'iPhone 13 Pro', size: '128GB', condition: 'Sehr gut', price: 650, newPrice: 1149, image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500', sale: true },
            { id: 102, brand: 'Zara', name: 'Oversized Blazer', size: 'M', condition: 'Neuwertig', price: 45, newPrice: 89, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500', sale: false },
            { id: 103, brand: 'Sony', name: 'WH-1000XM5', size: 'OneSize', condition: 'Gut', price: 280, newPrice: 419, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500', sale: true },
            { id: 104, brand: 'Nike', name: 'Air Jordan 1', size: '43', condition: 'Sehr gut', price: 180, newPrice: 250, image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500', sale: false },

            // --- FASHION (5-20) ---
            { id: 105, brand: 'H&M', name: 'Sommerkleid', size: 'S', condition: 'Gut', price: 15, newPrice: 39, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500', sale: true },
            { id: 106, brand: 'Levis', name: '501 Original', size: '32/32', condition: 'Vintage', price: 45, newPrice: 99, image: 'https://images.unsplash.com/photo-1542272454315-7f6f36d69c8d?w=500', sale: false },
            { id: 107, brand: 'Adidas', name: 'Hoodie Schwarz', size: 'L', condition: 'Sehr gut', price: 35, newPrice: 75, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', sale: false },
            { id: 108, brand: 'Mango', name: 'Ledermantel', size: 'M', condition: 'Neuwertig', price: 120, newPrice: 299, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', sale: true },
            { id: 109, brand: 'Patagonia', name: 'Fleece Jacke', size: 'M', condition: 'Gut', price: 80, newPrice: 160, image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500', sale: false },
            { id: 110, brand: 'Gucci', name: 'Dionysus Bag', size: 'Mini', condition: 'Sehr gut', price: 1200, newPrice: 2100, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500', sale: false },
            { id: 111, brand: 'Ralph Lauren', name: 'Polo Shirt', size: 'L', condition: 'Gut', price: 35, newPrice: 95, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', sale: true },
            { id: 112, brand: 'Burberry', name: 'Trenchcoat', size: '50', condition: 'Vintage', price: 450, newPrice: 1800, image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=500', sale: false },
            { id: 113, brand: 'Dr. Martens', name: '1460 Boots', size: '39', condition: 'Neuwertig', price: 110, newPrice: 189, image: 'https://images.unsplash.com/photo-1628253747716-0c4f5c90fdda?w=500', sale: false },
            { id: 114, brand: 'North Face', name: 'Nuptse Puffer', size: 'XL', condition: 'Sehr gut', price: 200, newPrice: 330, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500', sale: false },
            { id: 115, brand: 'Carhartt', name: 'Detroit Jacket', size: 'L', condition: 'Used', price: 150, newPrice: 220, image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500', sale: false },
            { id: 116, brand: 'Uniqlo', name: 'Kaschmir Pulli', size: 'S', condition: 'Gut', price: 40, newPrice: 99, image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500', sale: true },

            // --- ELECTRONICS (21-30) ---
            { id: 117, brand: 'Samsung', name: 'Galaxy S21', size: '128GB', condition: 'Gut', price: 300, newPrice: 849, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500', sale: true },
            { id: 118, brand: 'Nintendo', name: 'Switch OLED', size: 'Standard', condition: 'Neuwertig', price: 290, newPrice: 349, image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500', sale: false },
            { id: 119, brand: 'Canon', name: 'EOS R6', size: 'Body', condition: 'Profi', price: 1800, newPrice: 2499, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500', sale: false },
            { id: 120, brand: 'Bose', name: 'QuietComfort 45', size: 'OneSize', condition: 'Sehr gut', price: 190, newPrice: 320, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', sale: true },
            { id: 121, brand: 'iPad', name: 'Air 4. Gen', size: '64GB', condition: 'Gut', price: 400, newPrice: 650, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', sale: false },
            { id: 122, brand: 'MacBook', name: 'Pro M1 2020', size: '256GB', condition: 'Sehr gut', price: 950, newPrice: 1400, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500', sale: false },
            { id: 123, brand: 'GoPro', name: 'Hero 9 Black', size: 'Kit', condition: 'Gut', price: 220, newPrice: 399, image: 'https://images.unsplash.com/photo-1565552627976-5af8816f1c7d?w=500', sale: true },
            { id: 124, brand: 'Dyson', name: 'Airwrap', size: 'Complete', condition: 'Neuwertig', price: 400, newPrice: 599, image: 'https://images.unsplash.com/photo-1585775573015-81d5dd060714?w=500', sale: false },
            { id: 125, brand: 'Sonos', name: 'One SL', size: 'Paar', condition: 'Sehr gut', price: 300, newPrice: 398, image: 'https://images.unsplash.com/photo-1543512214-318c77a07298?w=500', sale: false },
            { id: 126, brand: 'PlayStation', name: 'PS5 Digital', size: '825GB', condition: 'Neuwertig', price: 350, newPrice: 449, image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500', sale: false },

            // --- MISC / KIDS (31-40) ---
            { id: 127, brand: 'LEGO', name: 'Star Wars Set', size: 'Large', condition: 'Neu', price: 120, newPrice: 160, image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=500', sale: false },
            { id: 128, brand: 'Bugaboo', name: 'Fox 3', size: 'Kombi', condition: 'Gebraucht', price: 600, newPrice: 1100, image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=500', sale: true },
            { id: 129, brand: 'IKEA', name: 'Poäng Sessel', size: 'Standard', condition: 'Gut', price: 40, newPrice: 99, image: 'https://images.unsplash.com/photo-1567538096630-e08558e0fcde?w=500', sale: false },
            { id: 130, brand: 'Rimowa', name: 'Cabin Trolley', size: 'S', condition: 'Kratzer', price: 400, newPrice: 850, image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=500', sale: false },
            { id: 131, brand: 'KitchenAid', name: 'Artisan', size: '4.8L', condition: 'Sehr gut', price: 350, newPrice: 699, image: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=500', sale: true },
            { id: 132, brand: 'Fender', name: 'Stratocaster', size: 'Player', condition: 'Neuwertig', price: 550, newPrice: 850, image: 'https://images.unsplash.com/photo-1574515579979-6745813775b3?w=500', sale: false },
            { id: 133, brand: 'Rolex', name: 'Datejust 36', size: '36mm', condition: 'Vintage', price: 5500, newPrice: 9000, image: 'https://images.unsplash.com/photo-1622434641406-a158105c9168?w=500', sale: false },
            { id: 134, brand: 'Vitra', name: 'Eames Chair', size: 'Original', condition: 'Gebraucht', price: 400, newPrice: 890, image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c19c5?w=500', sale: false },
            { id: 135, brand: 'Tiffany', name: 'Silber Kette', size: '45cm', condition: 'Sehr gut', price: 180, newPrice: 350, image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=500', sale: false },
            { id: 136, brand: 'Steiff', name: 'Teddybär', size: '30cm', condition: 'Neu', price: 45, newPrice: 69, image: 'https://images.unsplash.com/photo-1559454403-b8fb87521bc7?w=500', sale: true }
        ];
    }
};
