// CSS BERLIN - SMART FILTER LOGIC
document.addEventListener('DOMContentLoaded', function () {

    // 1. Kategori ve Alt Kategori Verisi (Vinted Mantığı)
    const categoryData = {
        'damen': [
            { id: 'kleidung', name: 'Kleidung', icon: 'shirt' },
            { id: 'schuhe', name: 'Schuhe', icon: 'footprints' },
            { id: 'taschen', name: 'Taschen', icon: 'shopping-bag' },
            { id: 'accessoires', name: 'Accessoires', icon: 'watch' },
            { id: 'beauty', name: 'Beauty', icon: 'sparkles' }
        ],
        'herren': [
            { id: 'kleidung', name: 'Kleidung', icon: 'shirt' },
            { id: 'schuhe', name: 'Schuhe', icon: 'footprints' },
            { id: 'accessoires', name: 'Accessoires', icon: 'watch' },
            { id: 'pflege', name: 'Pflege', icon: 'smile' }
        ],
        'kinder': [
            { id: 'maedchen', name: 'Mädchen', icon: 'baby' },
            { id: 'jungen', name: 'Jungen', icon: 'baby' },
            { id: 'spielzeug', name: 'Spielzeug', icon: 'gamepad-2' },
            { id: 'schulbedarf', name: 'Schulbedarf', icon: 'pencil' }
        ],
        'elektronik': [
            { id: 'handys', name: 'Handys & Zubehör', icon: 'smartphone' },
            { id: 'konsolen', name: 'Konsolen', icon: 'gamepad' },
            { id: 'audio', name: 'Audio & Hifi', icon: 'headphones' }
        ]
    };

    const filterContainer = document.getElementById('smartFilterBar');
    const filterWrapper = document.getElementById('smartFilterWrapper');
    const clearBtn = document.getElementById('clearFiltersBtn');

    // 2. URL'den Kategoriyi Oku (Örn: index.html?category=damen)
    const urlParams = new URLSearchParams(window.location.search);
    const currentCategory = urlParams.get('category'); // 'damen', 'herren' vb.

    // 3. Eğer Kategori Seçiliyse Filtreleri Göster
    if (currentCategory && categoryData[currentCategory]) {
        renderFilters(currentCategory);
        filterContainer.style.display = 'block';

        // Header'daki aktif linki işaretle (Opsiyonel)
        highlightHeaderLink(currentCategory);
    }

    // 4. Filtreleri Ekrana Basan Fonksiyon
    function renderFilters(category) {
        // Mevcut filtreleri temizle (Clear butonu hariç)
        filterWrapper.innerHTML = '';

        // Yeni butonları oluştur
        categoryData[category].forEach(subCat => {
            const btn = document.createElement('button');
            btn.className = 'filter-chip';
            // Lucide ikonunu data attribute olarak ekle, sonra render edeceğiz
            btn.innerHTML = `<i data-lucide="${subCat.icon}"></i> ${subCat.name}`;

            // Tıklama Olayı
            btn.onclick = () => toggleFilter(btn, subCat.id);

            filterWrapper.appendChild(btn);
        });

        // İkonları oluştur
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // 5. Filtre Seçimi (Aktif/Pasif Yapma)
    function toggleFilter(btn, filterId) {
        // Hepsini pasif yap (Tek seçimli mod) -> İstersen çoklu seçim yapabiliriz
        const allChips = document.querySelectorAll('.filter-chip');
        allChips.forEach(c => c.classList.remove('active'));

        // Seçileni aktif yap
        btn.classList.add('active');

        // Clear butonunu göster
        clearBtn.style.display = 'inline-block';

        // 🚀 BURADA BACKEND'E HABER VERİYORUZ (vitrin.js ile konuşacak)
        console.log(`Filtre Seçildi: Ana Kategori: ${currentCategory}, Alt: ${filterId}`);

        // Eğer vitrin.js yüklüyse ürünleri yenile
        if (window.loadProducts) {
            window.loadProducts(currentCategory, filterId);
        }
    }

    // 6. Header Linklerini İşaretleme
    function highlightHeaderLink(cat) {
        const links = document.querySelectorAll('.nav-link-v3');
        links.forEach(link => {
            if (link.getAttribute('href').includes(cat)) {
                link.classList.add('active-nav-item'); // CSS'de bu class tanımlanmalı
            }
        });
    }

    // 7. Header Linklerine Tıklayınca Sayfa Yenilenmeden Çalışsın (SPA Hissi)
    const navLinks = document.querySelectorAll('.nav-link-v3');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Eğer kategori linkiyse (örn: damen.html değil de ?category=damen kullanırsak)
            // Şimdilik HTML dosyalarına gidiyorsun, bu yapıyı bozmayalım.
            // İleride burayı "e.preventDefault()" ile durdurup AJAX ile yükleyebiliriz.
        });
    });
});