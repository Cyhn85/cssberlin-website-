// ============================================
// CSS Berlin — VITRIN MANAGER v1
// Ana sayfada 40 demo ürünü organize eden modül
// Kategori filtre | Sıralama | Grid render
// ============================================

(function () {
    'use strict';

    // ─── 40 DEMO ÜRÜN HAVUZU ──────────────────────
    const DEMO_URUNLAR = [
        // ── DAMEN (1-10) ──
        { id: 101, kategori: 'damen', brand: 'Zara',            ad: 'Elegante Blazer Jacke',      beden: 'M',  durum: 'Sehr gut',   fiyat: 45,  yeniFiyat: 89,  co2: 18.5, resim: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80' },
        { id: 102, kategori: 'damen', brand: 'Mango',           ad: 'Sommerkleid Blumenmuster',   beden: 'S',  durum: 'Neuwertig',  fiyat: 32,  yeniFiyat: 70,  co2: 14.2, resim: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80' },
        { id: 103, kategori: 'damen', brand: 'COS',             ad: 'Midi Kleid Minimalist',      beden: 'S',  durum: 'Neuwertig',  fiyat: 58,  yeniFiyat: 115, co2: 21.3, resim: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80' },
        { id: 104, kategori: 'damen', brand: 'Massimo Dutti',   ad: 'Seidenbluse Creme',          beden: 'M',  durum: 'Sehr gut',   fiyat: 42,  yeniFiyat: 90,  co2: 14.8, resim: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&q=80' },
        { id: 105, kategori: 'damen', brand: 'Arket',           ad: 'Wollmantel Camel',           beden: 'M',  durum: 'Sehr gut',   fiyat: 95,  yeniFiyat: 199, co2: 32.5, resim: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&q=80' },
        { id: 106, kategori: 'damen', brand: 'Steve Madden',    ad: 'Ankle Boots Schwarz',        beden: '38', durum: 'Neuwertig',  fiyat: 65,  yeniFiyat: 139, co2: 18.7, resim: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80' },
        { id: 107, kategori: 'damen', brand: 'Sandro',          ad: 'Tweed Blazer Rosa',          beden: 'S',  durum: 'Sehr gut',   fiyat: 78,  yeniFiyat: 165, co2: 24.1, resim: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&q=80' },
        { id: 108, kategori: 'damen', brand: 'Reformation',     ad: 'Leinenkleid Sommer',         beden: 'M',  durum: 'Gut',        fiyat: 52,  yeniFiyat: 110, co2: 19.6, resim: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80' },
        { id: 109, kategori: 'damen', brand: 'All Saints',      ad: 'Lederjacke Biker',           beden: 'M',  durum: 'Sehr gut',   fiyat: 145, yeniFiyat: 320, co2: 42.8, resim: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80' },
        { id: 110, kategori: 'damen', brand: 'Ganni',           ad: 'Statement Bluse Print',      beden: 'S',  durum: 'Neuwertig',  fiyat: 68,  yeniFiyat: 145, co2: 16.9, resim: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80' },
        // ── HERREN (11-20) ──
        { id: 111, kategori: 'herren', brand: 'Hugo Boss',      ad: 'Slim Fit Hemd Weiß',         beden: 'L',  durum: 'Neuwertig',  fiyat: 45,  yeniFiyat: 90,  co2: 13.2, resim: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80' },
        { id: 112, kategori: 'herren', brand: 'Diesel',         ad: 'Slim Jeans Dunkelblau',      beden: '32', durum: 'Gut',        fiyat: 48,  yeniFiyat: 109, co2: 16.5, resim: 'https://images.unsplash.com/photo-1542272454315-7f6f36d69c8d?w=400&q=80' },
        { id: 113, kategori: 'herren', brand: 'Tiger of Sweden',ad: 'Anzug Anthrazit',            beden: '50', durum: 'Sehr gut',   fiyat: 185, yeniFiyat: 450, co2: 58.4, resim: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80' },
        { id: 114, kategori: 'herren', brand: 'New Balance',    ad: 'Sneaker 550 Weiß',           beden: '43', durum: 'Gut',        fiyat: 72,  yeniFiyat: 149, co2: 21.7, resim: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80' },
        { id: 115, kategori: 'herren', brand: 'Barbour',        ad: 'Wachsjacke Oliv',            beden: 'L',  durum: 'Sehr gut',   fiyat: 125, yeniFiyat: 279, co2: 35.2, resim: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80' },
        { id: 116, kategori: 'herren', brand: 'Ralph Lauren',   ad: 'Oxford Hemd Blau',           beden: 'M',  durum: 'Neuwertig',  fiyat: 52,  yeniFiyat: 100, co2: 14.1, resim: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80' },
        { id: 117, kategori: 'herren', brand: 'Nudie Jeans',    ad: 'Jeans Gritty Jackson',       beden: '31', durum: 'Gut',        fiyat: 58,  yeniFiyat: 129, co2: 18.9, resim: 'https://images.unsplash.com/photo-1542272454315-7f6f36d69c8d?w=400&q=80' },
        { id: 118, kategori: 'herren', brand: 'Converse',       ad: 'Chuck Taylor High',          beden: '44', durum: 'Sehr gut',   fiyat: 38,  yeniFiyat: 85,  co2: 12.4, resim: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&q=80' },
        { id: 119, kategori: 'herren', brand: 'The North Face', ad: 'Puffer Jacke Schwarz',       beden: 'L',  durum: 'Neuwertig',  fiyat: 115, yeniFiyat: 249, co2: 38.6, resim: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&q=80' },
        { id: 120, kategori: 'herren', brand: 'Carhartt WIP',   ad: 'Chino Hose Beige',           beden: 'M',  durum: 'Gut',        fiyat: 42,  yeniFiyat: 89,  co2: 13.8, resim: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80' },
        // ── ELEKTRONIK (21-28) ──
        { id: 121, kategori: 'elektronik', brand: 'Apple',      ad: 'AirPods Pro 2 Gen',          beden: 'One', durum: 'Neuwertig', fiyat: 180, yeniFiyat: 249, co2: 22.0, resim: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
        { id: 122, kategori: 'elektronik', brand: 'Sony',       ad: 'WH-1000XM5 Kopfhörer',       beden: 'One', durum: 'Sehr gut', fiyat: 220, yeniFiyat: 399, co2: 35.0, resim: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
        { id: 123, kategori: 'elektronik', brand: 'Canon',      ad: 'EOS R50 Kamera',             beden: 'One', durum: 'Gut',      fiyat: 480, yeniFiyat: 799, co2: 68.0, resim: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80' },
        { id: 124, kategori: 'elektronik', brand: 'Samsung',    ad: 'Galaxy Watch 6',             beden: 'One', durum: 'Neuwertig', fiyat: 155, yeniFiyat: 299, co2: 19.5, resim: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' },
        { id: 125, kategori: 'elektronik', brand: 'DJI',        ad: 'Mini 4 Pro Drohne',          beden: 'One', durum: 'Sehr gut', fiyat: 350, yeniFiyat: 599, co2: 45.0, resim: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80' },
        { id: 126, kategori: 'elektronik', brand: 'Bose',       ad: 'QuietComfort Ultra',         beden: 'One', durum: 'Gut',      fiyat: 195, yeniFiyat: 379, co2: 28.0, resim: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
        { id: 127, kategori: 'elektronik', brand: 'GoPro',      ad: 'Hero 12 Black',              beden: 'One', durum: 'Neuwertig', fiyat: 290, yeniFiyat: 449, co2: 38.0, resim: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80' },
        { id: 128, kategori: 'elektronik', brand: 'Sonos',      ad: 'Roam 2 Speaker',             beden: 'One', durum: 'Sehr gut', fiyat: 140, yeniFiyat: 249, co2: 16.5, resim: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80' },
        // ── KINDER (29-34) ──
        { id: 129, kategori: 'kinder', brand: 'Mini Rodini',    ad: 'Kinder Hoodie Bunt',         beden: '110', durum: 'Sehr gut',  fiyat: 28,  yeniFiyat: 65,  co2: 8.5,  resim: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&q=80' },
        { id: 130, kategori: 'kinder', brand: 'Petit Bateau',   ad: 'Kinder T-Shirt Set',         beden: '128', durum: 'Neuwertig', fiyat: 22,  yeniFiyat: 45,  co2: 6.2,  resim: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&q=80' },
        { id: 131, kategori: 'kinder', brand: 'Geox',           ad: 'Kinder Sneaker Blau',        beden: '32',  durum: 'Gut',      fiyat: 32,  yeniFiyat: 70,  co2: 9.8,  resim: 'https://images.unsplash.com/photo-1555274175-75f79b09d5b8?w=400&q=80' },
        { id: 132, kategori: 'kinder', brand: 'Boum',           ad: 'Winterjacke Mädchen',        beden: '116', durum: 'Sehr gut',  fiyat: 35,  yeniFiyat: 78,  co2: 11.2, resim: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&q=80' },
        { id: 133, kategori: 'kinder', brand: 'Tocoto',         ad: 'Jogger Boys Navy',           beden: '104', durum: 'Gut',      fiyat: 18,  yeniFiyat: 42,  co2: 5.8,  resim: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&q=80' },
        { id: 134, kategori: 'kinder', brand: 'Rykiel',         ad: 'Pulli Mädchen Blau',         beden: '120', durum: 'Neuwertig', fiyat: 24,  yeniFiyat: 55,  co2: 7.1,  resim: 'https://images.unsplash.com/photo-1555274175-75f79b09d5b8?w=400&q=80' },
        // ── SALE (35-40) ──
        { id: 135, kategori: 'sale', brand: 'H&M',              ad: 'Wintermantel Schwarz',       beden: 'S',  durum: 'Sehr gut',   fiyat: 45,  yeniFiyat: 130, co2: 28.5, resim: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&q=80', sale: true },
        { id: 136, kategori: 'sale', brand: 'Esprit',           ad: 'Strickpullover Beige',       beden: 'M',  durum: 'Gut',        fiyat: 12,  yeniFiyat: 45,  co2: 8.9,  resim: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&q=80', sale: true },
        { id: 137, kategori: 'sale', brand: 'Only',             ad: 'Röcke Mini Denim',           beden: 'S',  durum: 'Neuwertig',  fiyat: 9,   yeniFiyat: 36,  co2: 7.2,  resim: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&q=80', sale: true },
        { id: 138, kategori: 'sale', brand: 'Adidas',           ad: 'Sneakers Retro Style',       beden: '42', durum: 'Gut',        fiyat: 35,  yeniFiyat: 120, co2: 22.8, resim: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80', sale: true },
        { id: 139, kategori: 'sale', brand: 'Levis',            ad: 'Classic Denim Jacke',        beden: 'L',  durum: 'Sehr gut',   fiyat: 28,  yeniFiyat: 100, co2: 19.4, resim: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80', sale: true },
        { id: 140, kategori: 'sale', brand: 'Gucci',            ad: 'Designer Handtasche',        beden: 'One', durum: 'Sehr gut',  fiyat: 280, yeniFiyat: 1200,co2: 85.5, resim: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80', sale: true }
    ];

    // ─── STATE ──────────────────────────────────────
    let aktifKategori = 'alle';       // 'alle' | 'damen' | 'herren' | 'elektronik' | 'kinder' | 'sale'
    let aktifSiralama = 'neu';        // 'neu' | 'fiyat-asc' | 'fiyat-desc' | 'brand'

    // ─── FILTER ─────────────────────────────────────
    function filterUrunlar() {
        let liste = [...DEMO_URUNLAR];

        if (aktifKategori !== 'alle') {
            liste = liste.filter(u => u.kategori === aktifKategori);
        }

        // Sıralama
        switch (aktifSiralama) {
            case 'fiyat-asc':  liste.sort((a, b) => a.fiyat - b.fiyat); break;
            case 'fiyat-desc': liste.sort((a, b) => b.fiyat - a.fiyat); break;
            case 'brand':      liste.sort((a, b) => a.brand.localeCompare(b.brand)); break;
            default:           break; // 'neu' = orijinal sıra
        }

        return liste;
    }

    // ─── RENDER ─────────────────────────────────────
    function renderVitrin(gridId) {
        const grid = document.getElementById(gridId);
        if (!grid) return;

        const urunlar = filterUrunlar();
        grid.innerHTML = '';

        urunlar.forEach(u => {
            // createProductCard varsa kullan (script.js'den), yoksa fallback
            if (typeof window.createProductCard === 'function') {
                const cardData = {
                    id:         u.id,
                    brand:      u.brand,
                    name:       u.ad,
                    size:       u.beden,
                    condition:  u.durum,
                    price:      u.fiyat,
                    newPrice:   u.yeniFiyat,
                    carbonSaved:u.co2,
                    tier:       'champion',
                    image:      u.resim,
                    sale:       u.sale || false,
                    status:     'active'
                };
                grid.insertAdjacentHTML('beforeend', window.createProductCard(cardData));
            }
        });

        // Event listeners yeniden bağla
        if (typeof window.attachProductEventListeners === 'function') {
            window.attachProductEventListeners();
        }
        if (typeof window.updateCartButtonStates === 'function') {
            window.updateCartButtonStates();
        }

        // Sayım güncelle
        updateVitrinSayi(urunlar.length);
    }

    // ─── SAYIM BADGE ────────────────────────────────
    function updateVitrinSayi(count) {
        const el = document.getElementById('vitrinUrunSayi');
        if (el) el.textContent = count + ' Produkte';
    }

    // ─── FILTER Pills tıklama ───────────────────────
    function initFilterPills(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        container.querySelectorAll('.vitrin-pill').forEach(pill => {
            pill.addEventListener('click', function () {
                // Active state
                container.querySelectorAll('.vitrin-pill').forEach(p => p.classList.remove('active'));
                this.classList.add('active');

                aktifKategori = this.dataset.kategori || 'alle';
                renderVitrin('vitrinGrid');
            });
        });
    }

    // ─── SIRALAMA dropdown ──────────────────────────
    function initSiralama(selectId) {
        const sel = document.getElementById(selectId);
        if (!sel) return;

        sel.addEventListener('change', function () {
            aktifSiralama = this.value;
            renderVitrin('vitrinGrid');
        });
    }

    // ─── PUBLIC API ─────────────────────────────────
    window.vitrinManager = {
        init: function (gridId) {
            renderVitrin(gridId || 'vitrinGrid');
            initFilterPills('.vitrin-pills');
            initSiralama('vitrinSiralama');
        },
        setKategori: function (k) {
            aktifKategori = k;
            renderVitrin('vitrinGrid');
        },
        setSiralama: function (s) {
            aktifSiralama = s;
            renderVitrin('vitrinGrid');
        },
        getData: function () { return DEMO_URUNLAR; },
        getFiltered: function () { return filterUrunlar(); }
    };

})();
