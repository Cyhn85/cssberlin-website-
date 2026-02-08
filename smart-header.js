/* ============================================
   SMART HEADER LOGIC
   - Intelligent Category Mega Menu
   - Voice Search Implementation
   - Image Search Implementation
   ============================================ */

class SmartHeader {
    constructor() {
        this.initVoiceSearch();
        this.initImageSearch();
        this.initCategoryMenu();
        this.initDarkMode(); // Added
        this.initSearch(); // Added
    }

    initSearch() {
        const btn = document.querySelector('.search-submit-v3');
        const input = document.getElementById('searchInputV3');

        if (btn && input) {
            const doSearch = () => {
                const query = input.value.trim();
                if (query) {
                    window.location.href = `sonstiges.html?search=${encodeURIComponent(query)}`;
                }
            };

            btn.addEventListener('click', doSearch);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') doSearch();
            });
        }
    }

    initDarkMode() {
        const toggle = document.getElementById('darkModeToggle');
        if (!toggle) return;

        // Load state
        const isDark = localStorage.getItem('cssberlin_dark_mode') === 'true';
        if (isDark) {
            document.body.classList.add('dark-mode');
            toggle.classList.add('active');
        }

        toggle.addEventListener('click', () => {
            const isNowDark = document.body.classList.toggle('dark-mode');
            toggle.classList.toggle('active');
            localStorage.setItem('cssberlin_dark_mode', isNowDark);
        });
    }

    // ---------------------------------------------------------
    // 1. INTELLIGENT CATEGORY MENU (MEGA MENU)
    // ---------------------------------------------------------
    initCategoryMenu() {
        // Data Structure for Smart Menu
        const categoryData = {
            "Damen": {
                icon: "user",
                sub: ["Kleidung", "Schuhe", "Taschen", "Accessoires", "Schmuck", "Premium", "Vintage"]
            },
            "Herren": {
                icon: "user-check",
                sub: ["Kleidung", "Schuhe", "Accessoires", "Uhren", "Sneaker", "Sport", "Anzüge"]
            },
            "Kinder": {
                icon: "baby",
                sub: ["Mädchen", "Jungen", "Baby", "Schuhe", "Spielzeug", "Ausstattung"]
            },
            "Elektronik": {
                icon: "smartphone",
                sub: ["Smartphones", "Laptops", "Tablets", "Audio", "Kameras", "Gaming", "Haushaltsgeräte"]
            },
            "Wohnen": {
                icon: "home",
                sub: ["Möbel", "Dekoration", "Textilien", "Küche", "Lampen", "Garten"]
            },
            "Unterhaltung": {
                icon: "gamepad-2",
                sub: ["Bücher", "Musik", "Filme", "Videospiele", "Instrumente"]
            }
        };

        const dropdownBtn = document.querySelector('.category-dropdown-v3');
        if (!dropdownBtn) return;

        // Create Menu Container
        const menuContainer = document.createElement('div');
        menuContainer.className = 'smart-mega-menu';
        menuContainer.style.display = 'none';

        // Build Menu HTML
        let menuHTML = '<div class="mega-menu-grid">';

        // Main Categories Column
        menuHTML += '<div class="mega-menu-col main-cats">';
        for (const [key, data] of Object.entries(categoryData)) {
            menuHTML += `
                <div class="mega-cat-item" data-cat="${key}">
                    <i data-lucide="${data.icon}"></i>
                    <span>${key}</span>
                    <i data-lucide="chevron-right" class="arrow"></i>
                </div>
            `;
        }
        menuHTML += '</div>';

        // Sub Categories Column (Dynamic)
        menuHTML += '<div class="mega-menu-col sub-cats" id="subCatContainer">';
        menuHTML += '<div class="sub-placeholder">Wähle eine Kategorie</div>';
        menuHTML += '</div>';

        menuHTML += '</div>';
        menuContainer.innerHTML = menuHTML;

        // Append to body or header wrapper to allow correct positioning
        // Position it relative to the button
        dropdownBtn.parentElement.style.position = 'relative'; // Ensure parent is ref
        dropdownBtn.parentElement.appendChild(menuContainer);

        // Event Listeners
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = menuContainer.style.display === 'block';
            menuContainer.style.display = isOpen ? 'none' : 'block';
            this.updateIcons();
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuContainer.contains(e.target) && !dropdownBtn.contains(e.target)) {
                menuContainer.style.display = 'none';
            }
        });

        // Hover Logic for Interface
        const catItems = menuContainer.querySelectorAll('.mega-cat-item');
        const subContainer = menuContainer.querySelector('#subCatContainer');

        catItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                // Formatting
                catItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Content
                const catKey = item.getAttribute('data-cat');
                const subCats = categoryData[catKey].sub;

                let subHTML = `<h4 class="sub-cat-title">${catKey}</h4><ul class="sub-cat-list">`;
                subCats.forEach(sub => {
                    subHTML += `<li><a href="${catKey.toLowerCase()}.html?sub=${sub.toLowerCase()}">${sub}</a></li>`;
                });
                subHTML += '</ul>';

                // Add "Show All" link
                subHTML += `<a href="${catKey.toLowerCase()}.html" class="view-all-link">Alle in ${catKey} ansehen &rarr;</a>`;

                subContainer.innerHTML = subHTML;
            });
        });
    }

    updateIcons() {
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    // ---------------------------------------------------------
    // 2. VOICE SEARCH (Web Speech API)
    // ---------------------------------------------------------
    initVoiceSearch() {
        const voiceBtn = document.querySelector('.search-btn-icon[title="Sprachsuche"]');
        const searchInput = document.getElementById('searchInputV3');

        if (voiceBtn && searchInput) {
            // Check browser support
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.lang = 'de-DE';
                recognition.interimResults = false;

                voiceBtn.addEventListener('click', () => {
                    // UI Feedback
                    voiceBtn.style.color = '#E8854C'; // Active color
                    voiceBtn.classList.add('pulse-animation');
                    searchInput.placeholder = "Zuhören...";

                    try {
                        recognition.start();
                    } catch (e) {
                        console.error('Recognition already started');
                    }
                });

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    searchInput.value = transcript;

                    // Optional: Auto submit
                    // document.querySelector('.search-submit-v3').click();
                };

                recognition.onend = () => {
                    voiceBtn.style.color = '';
                    voiceBtn.classList.remove('pulse-animation');
                    searchInput.placeholder = "CLIMATE SMART SOLUTIONS";
                };

                recognition.onerror = (event) => {
                    console.error('Speech recognition error', event.error);
                    voiceBtn.style.color = 'red';
                    setTimeout(() => {
                        voiceBtn.style.color = '';
                        voiceBtn.classList.remove('pulse-animation');
                    }, 1000);
                };
            } else {
                voiceBtn.style.display = 'none'; // Hide if not supported
            }
        }
    }

    // ---------------------------------------------------------
    // 3. IMAGE SEARCH
    // ---------------------------------------------------------
    initImageSearch() {
        const imgBtn = document.querySelector('.search-btn-icon[title="Bildsuche"]');
        if (!imgBtn) return;

        // Create hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        imgBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            if (fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];
                this.handleImageUpload(file);
            }
        });
    }

    handleImageUpload(file) {
        // 1. Show Preview Modal (You'd typically upload to backend here)
        // For now, we simulate a scan analysis

        const modal = document.createElement('div');
        modal.className = 'image-search-modal';
        modal.innerHTML = `
            <div class="ism-content">
                <div class="ism-header">
                    <h3>Bildanalyse</h3>
                    <button class="ism-close">&times;</button>
                </div>
                <div class="ism-body">
                    <div class="ism-preview">
                        <img id="ismPreviewImg" src="" alt="Preview">
                        <div class="scanning-effect"></div>
                    </div>
                    <div class="ism-status">Analysiere Produkt...</div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Show image
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('ismPreviewImg').src = e.target.result;
        }
        reader.readAsDataURL(file);

        // Close logic
        modal.querySelector('.ism-close').addEventListener('click', () => modal.remove());

        // Mock Analysis Delay
        setTimeout(() => {
            modal.querySelector('.ism-status').innerText = "Ähnliche Produkte gefunden!";
            modal.querySelector('.ism-status').style.color = '#2D5016';

            // Redirect to search results (mock)
            setTimeout(() => {
                window.location.href = "sonstiges.html?search=image_result";
            }, 1000);
        }, 2500);
    }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    window.smartHeader = new SmartHeader();

    // Add pulse animation style
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes pulse-orange {
            0% { box-shadow: 0 0 0 0 rgba(232, 133, 76, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(232, 133, 76, 0); }
            100% { box-shadow: 0 0 0 0 rgba(232, 133, 76, 0); }
        }
        .pulse-animation {
            animation: pulse-orange 1.5s infinite;
            border-radius: 50%;
        }
        
        /* Smart Menu Styles */
        .smart-mega-menu {
            position: absolute;
            top: 100%;
            left: 24px; /* Align with layout */
            margin-top: 10px;
            width: 600px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            z-index: 2000;
            border: 1px solid #e0e0e0;
            overflow: hidden;
            animation: slideDown 0.2s ease;
        }

        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .mega-menu-grid {
            display: flex;
            height: 400px;
        }

        .mega-menu-col {
            padding: 20px;
            overflow-y: auto;
        }

        .mega-menu-col.main-cats {
            width: 35%;
            background: #f8f9fa;
            border-right: 1px solid #e0e0e0;
            padding: 0;
        }

        .mega-menu-col.sub-cats {
            width: 65%;
            background: white;
        }

        .mega-cat-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 20px;
            cursor: pointer;
            transition: all 0.2s;
            color: #333;
            font-weight: 500;
        }

        .mega-cat-item:hover, .mega-cat-item.active {
            background: white;
            color: #E8854C; /* Orange Highlight */
            border-left: 4px solid #E8854C;
        }

        .mega-cat-item svg {
            width: 18px;
            height: 18px;
        }

        .mega-cat-item .arrow {
            margin-left: auto;
            width: 14px;
            height: 14px;
            opacity: 0.5;
        }

        .active .arrow {
            opacity: 1;
            color: #E8854C;
        }

        .sub-cat-title {
            font-size: 20px;
            margin: 0 0 16px 0;
            color: #111;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 10px;
        }

        .sub-cat-list {
            list-style: none;
        }

        .sub-cat-list li a {
            display: block;
            padding: 8px 0;
            color: #555;
            text-decoration: none;
            transition: color 0.2s;
        }

        .sub-cat-list li a:hover {
            color: #2D5016; /* Green Hover */
            padding-left: 5px;
        }

        .view-all-link {
            display: inline-block;
            margin-top: 20px;
            color: #E8854C;
            font-weight: 700;
            text-decoration: none;
            font-size: 14px;
        }

        /* Image Search Modal */
        .image-search-modal {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.8);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .ism-content {
            background: white;
            width: 90%;
            max-width: 400px;
            border-radius: 16px;
            padding: 24px;
            text-align: center;
        }

        .ism-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .ism-preview {
            width: 100%;
            height: 250px;
            background: #000;
            border-radius: 8px;
            overflow: hidden;
            position: relative;
        }

        .ism-preview img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .scanning-effect {
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 2px;
            background: #00ff00;
            box-shadow: 0 0 10px #00ff00;
            animation: scan 2s infinite linear;
        }

        @keyframes scan {
            0% { top: 0; }
            100% { top: 100%; }
        }

        .ism-status {
            margin-top: 16px;
            font-weight: 600;
            font-size: 15px;
        }
        
        .ism-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
});
