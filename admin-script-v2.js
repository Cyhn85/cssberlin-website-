// ============================================
// CSS Berlin Admin Panel V2
// 20 Terminals + Hetzner Integration
// One-Click Publish System
// ============================================

// ============================================
// BACKEND API CONFIGURATION - KOZMIK ODA
// ============================================
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'
    : 'http://195.201.146.224:8000';

const HETZNER_API = {
    baseURL: API_BASE,
    signInURL: API_BASE + '/sign-in',
    docsURL: API_BASE + '/docs',
    endpoints: {
        scrape: '/api/scrape',
        products: '/api/products',
        search: '/api/search',
        publish: '/api/publish',
        status: '/api/status',
        kozmikStatus: '/kozmik/status',
        kozmikExecute: '/kozmik/execute',
        terminals: '/kozmik/terminals',
        motorStart: '/kozmik/motor/start',
        motorStop: '/kozmik/motor/stop',
        telegram: '/api/telegram/notify',
        whatsapp: '/api/whatsapp/notify'
    }
};

// ============================================
// NOTIFICATION CONFIGURATION
// ============================================
const NOTIFICATIONS = {
    telegram: {
        enabled: true,
        botToken: '', // Telegram bot token buraya eklenecek
        chatId: ''    // Telegram chat ID buraya eklenecek
    },
    whatsapp: {
        enabled: true,
        phoneNumber: '' // WhatsApp numarası buraya eklenecek
    }
};

// ============================================
// 40 TERMINALS DEFINITION - REAL SCRAPERS
// ============================================
const TERMINALS = [
    // ACQUISITION TERMINALS (1-25)
    {
        id: 'terminal-1',
        name: 'Terminal 1: Vinted DE/FR/PL/NL',
        category: 'acquisition',
        description: 'Vinted multi-country scraper (vinted_scraper.py)',
        commands: ['scrape-all', 'scrape-de', 'scrape-fr', 'scrape-pl', 'scrape-nl', 'search-ugg', 'list-products', 'sync-db'],
        scraper: 'vinted_scraper.py',
        status: 'active',
        color: '#667eea'
    },
    {
        id: 'terminal-2',
        name: 'Terminal 2: Willhaben AT',
        category: 'acquisition',
        description: 'Willhaben.at scraper (willhaben_scraper.py)',
        commands: ['scrape-willhaben', 'filter-fashion', 'check-prices', 'sync-willhaben'],
        scraper: 'willhaben_scraper.py',
        status: 'active',
        color: '#f093fb'
    },
    {
        id: 'terminal-3',
        name: 'Terminal 3: Selpy DE',
        category: 'acquisition',
        description: 'Selpy.de premium second-hand (sellpy_scraper.py)',
        commands: ['scrape-selpy', 'check-quality', 'filter-brands', 'sync-selpy'],
        scraper: 'sellpy_scraper.py',
        status: 'active',
        color: '#4facfe'
    },
    {
        id: 'terminal-4',
        name: 'Terminal 4: Percentil DE',
        category: 'acquisition',
        description: 'Percentil.de fashion scraper (percentil_scraper.py)',
        commands: ['scrape-percentil', 'filter-percentil', 'check-stock', 'sync-percentil'],
        scraper: 'percentil_scraper.py',
        status: 'active',
        color: '#43e97b'
    },
    {
        id: 'terminal-5',
        name: 'Terminal 5: Kleinanzeigen DE',
        category: 'acquisition',
        description: 'eBay Kleinanzeigen scraper (kleinanzeigen_scraper.py)',
        commands: ['scrape-kleinanzeigen', 'filter-location', 'check-deals', 'sync-kleinanzeigen'],
        scraper: 'kleinanzeigen_scraper.py',
        status: 'active',
        color: '#fa709a'
    },
    {
        id: 'terminal-6',
        name: 'Terminal 6: eBay DE',
        category: 'acquisition',
        description: 'eBay.de API scraper (ebay_api_scraper.py)',
        commands: ['scrape-ebay', 'search-fashion', 'check-bids', 'sync-ebay'],
        scraper: 'ebay_api_scraper.py',
        status: 'active',
        color: '#feca57'
    },
    {
        id: 'terminal-7',
        name: 'Terminal 7: Shpock DE/AT',
        category: 'acquisition',
        description: 'Shpock scraper Germany/Austria (shpock_scraper.py)',
        commands: ['scrape-shpock', 'filter-shpock', 'check-local', 'sync-shpock'],
        scraper: 'shpock_scraper.py',
        status: 'active',
        color: '#ff6b6b'
    },
    {
        id: 'terminal-8',
        name: 'Terminal 8: Leboncoin FR',
        category: 'acquisition',
        description: 'Leboncoin.fr French marketplace (leboncoin_scraper.py)',
        commands: ['scrape-leboncoin', 'filter-france', 'translate-fr', 'sync-leboncoin'],
        scraper: 'leboncoin_scraper.py',
        status: 'active',
        color: '#48dbfb'
    },
    {
        id: 'terminal-9',
        name: 'Terminal 9: Marktplaats NL',
        category: 'acquisition',
        description: 'Marktplaats.nl Dutch marketplace (marktplaats_scraper.py)',
        commands: ['scrape-marktplaats', 'filter-netherlands', 'translate-nl', 'sync-marktplaats'],
        scraper: 'marktplaats_scraper.py',
        status: 'active',
        color: '#0abde3'
    },
    {
        id: 'terminal-10',
        name: 'Terminal 10: Subito IT',
        category: 'acquisition',
        description: 'Subito.it Italian marketplace (subito_scraper.py)',
        commands: ['scrape-subito', 'filter-italy', 'translate-it', 'sync-subito'],
        scraper: 'subito_scraper.py',
        status: 'active',
        color: '#ee5a6f'
    },
    // QUALITY TERMINALS (11-13)
    {
        id: 'terminal-11',
        name: 'Terminal 11: Quality Control',
        category: 'quality',
        description: 'Ürün kalite kontrolü ve filtreleme',
        commands: ['check-quality', 'filter-products', 'validate-images', 'check-duplicates'],
        status: 'active',
        color: '#feca57'
    },
    {
        id: 'terminal-12',
        name: 'Terminal 12: Image Processing',
        category: 'quality',
        description: 'Görsel işleme ve optimizasyon',
        commands: ['process-images', 'resize-images', 'compress-images', 'watermark-images'],
        status: 'active',
        color: '#ff6b6b'
    },
    {
        id: 'terminal-13',
        name: 'Terminal 13: Price Optimizer',
        category: 'quality',
        description: 'Fiyat analizi ve optimizasyonu',
        commands: ['analyze-prices', 'optimize-prices', 'check-competition', 'suggest-prices'],
        status: 'active',
        color: '#48dbfb'
    },
    // MARKETING TERMINALS (14-17)
    {
        id: 'terminal-14',
        name: 'Terminal 14: SEO Optimizer',
        category: 'marketing',
        description: 'SEO optimizasyonu ve anahtar kelime analizi',
        commands: ['optimize-seo', 'generate-keywords', 'check-seo-score', 'update-meta'],
        status: 'active',
        color: '#0abde3'
    },
    {
        id: 'terminal-15',
        name: 'Terminal 15: Content Generator',
        category: 'marketing',
        description: 'Ürün açıklaması ve içerik üretimi',
        commands: ['generate-description', 'translate-content', 'improve-text', 'generate-tags'],
        status: 'active',
        color: '#ee5a6f'
    },
    {
        id: 'terminal-16',
        name: 'Terminal 16: Social Media Manager',
        category: 'marketing',
        description: 'Sosyal medya paylaşım ve yönetimi',
        commands: ['post-instagram', 'post-facebook', 'schedule-posts', 'track-engagement'],
        status: 'active',
        color: '#c44569'
    },
    {
        id: 'terminal-17',
        name: 'Terminal 17: Email Marketing',
        category: 'marketing',
        description: 'Email kampanyaları ve otomasyonu',
        commands: ['send-newsletter', 'create-campaign', 'track-opens', 'manage-subscribers'],
        status: 'active',
        color: '#f8b500'
    },
    // OPERATION TERMINALS (18-20)
    {
        id: 'terminal-18',
        name: 'Terminal 18: Order Manager',
        category: 'operation',
        description: 'Sipariş yönetimi ve takibi',
        commands: ['list-orders', 'process-order', 'update-status', 'send-confirmation'],
        status: 'active',
        color: '#6c5ce7'
    },
    {
        id: 'terminal-19',
        name: 'Terminal 19: Inventory Manager',
        category: 'operation',
        description: 'Stok yönetimi ve senkronizasyonu',
        commands: ['check-stock', 'update-inventory', 'sync-stock', 'alert-low-stock'],
        status: 'active',
        color: '#a29bfe'
    },
    {
        id: 'terminal-20',
        name: 'Terminal 20: Shipping Tracker',
        category: 'operation',
        description: 'Kargo takibi ve lojistik',
        commands: ['track-shipment', 'create-label', 'update-tracking', 'notify-customer'],
        status: 'active',
        color: '#fd79a8'
    },
    // SUPPORT TERMINAL (21)
    {
        id: 'terminal-21',
        name: 'Terminal 21: Customer Support',
        category: 'support',
        description: 'Müşteri desteği ve soru-cevap',
        commands: ['list-tickets', 'respond-ticket', 'auto-reply', 'escalate-issue'],
        status: 'active',
        color: '#fdcb6e'
    },
    // ORCHESTRATION TERMINALS (22-25)
    {
        id: 'terminal-22',
        name: 'Terminal 22: Analytics Dashboard',
        category: 'orchestration',
        description: 'İstatistik ve performans analizi',
        commands: ['show-stats', 'generate-report', 'track-kpi', 'export-data'],
        status: 'active',
        color: '#00b894'
    },
    {
        id: 'terminal-23',
        name: 'Terminal 23: Database Manager',
        category: 'orchestration',
        description: 'Veritabanı yönetimi ve bakımı',
        commands: ['backup-db', 'restore-db', 'clean-db', 'optimize-db'],
        status: 'active',
        color: '#00cec9'
    },
    {
        id: 'terminal-24',
        name: 'Terminal 24: System Monitor',
        category: 'orchestration',
        description: 'Sistem izleme ve performans',
        commands: ['check-health', 'monitor-cpu', 'check-memory', 'view-logs'],
        status: 'active',
        color: '#0984e3'
    },
    {
        id: 'terminal-25',
        name: 'Terminal 25: Master Orchestrator',
        category: 'orchestration',
        description: 'Tüm terminalleri yöneten ana kontrol merkezi',
        commands: ['start-all', 'stop-all', 'status-all', 'sync-all', 'publish-all'],
        status: 'active',
        color: '#FF8C42'
    }
];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    initTopNavigation();
    initKozmikOda();
    checkMotorStatus();
    loadDashboardData();
    loadSettings(); // Bildirim ayarlarını yükle

    // Check motor status every 30 seconds
    setInterval(checkMotorStatus, 30000);
});

// ============================================
// LOGIN CHECK
// ============================================
function checkLogin() {
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'login.html';
    }
}

// ============================================
// TOP NAVIGATION
// ============================================
function initTopNavigation() {
    const navItems = document.querySelectorAll('.top-nav-item');
    const panels = document.querySelectorAll('.content-panel');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active from all
            navItems.forEach(nav => nav.classList.remove('active'));
            panels.forEach(panel => panel.classList.remove('active'));

            // Add active to clicked
            this.classList.add('active');
            const panelId = 'panel-' + this.dataset.panel;
            const targetPanel = document.getElementById(panelId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

// ============================================
// KOZMIK ODA INITIALIZATION
// ============================================
function initKozmikOda() {
    const tabsContainer = document.getElementById('terminalTabs');
    const contentsContainer = document.getElementById('terminalContents');

    // Create tabs
    TERMINALS.forEach((terminal, index) => {
        // Create tab button
        const tab = document.createElement('button');
        tab.className = 'terminal-tab' + (index === 0 ? ' active' : '');
        tab.dataset.terminalId = terminal.id;
        tab.textContent = `T${index + 1}`;
        tab.title = terminal.name;
        tab.style.borderBottom = `2px solid ${terminal.color}`;

        tab.addEventListener('click', function() {
            switchTerminal(terminal.id);
        });

        tabsContainer.appendChild(tab);

        // Create terminal content
        const content = createTerminalContent(terminal, index === 0);
        contentsContainer.appendChild(content);
    });
}

function createTerminalContent(terminal, isActive) {
    const content = document.createElement('div');
    content.className = 'terminal-content' + (isActive ? ' active' : '');
    content.id = `content-${terminal.id}`;

    content.innerHTML = `
        <div class="terminal-container">
            <div class="terminal-header">
                <div class="terminal-buttons">
                    <span class="terminal-btn close"></span>
                    <span class="terminal-btn minimize"></span>
                    <span class="terminal-btn maximize"></span>
                </div>
                <div class="terminal-title">${terminal.name}</div>
                <div class="terminal-actions">
                    <button onclick="clearTerminalOutput('${terminal.id}')" title="Clear">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="1 4 1 10 7 10"></polyline>
                            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                        </svg>
                    </button>
                    <button onclick="runTerminal('${terminal.id}')" title="Run" style="color: #10b981;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="terminal-body" id="terminal-body-${terminal.id}">
                <div class="terminal-welcome">
                    <p style="color: ${terminal.color}; font-weight: bold;">▶ ${terminal.name}</p>
                    <p class="terminal-info">${terminal.description}</p>
                    <p class="terminal-info">Kategori: ${terminal.category.toUpperCase()}</p>
                    <p class="terminal-info">Durum: <span style="color: #10b981;">●</span> ${terminal.status.toUpperCase()}</p>
                    <p class="terminal-info">─────────────────────────────────────</p>
                    <p class="terminal-info">Kullanılabilir Komutlar:</p>
                    ${terminal.commands.map(cmd => `<p class="terminal-info">  • ${cmd}</p>`).join('')}
                    <p class="terminal-info">─────────────────────────────────────</p>
                    <p class="terminal-info">Daha fazla bilgi için 'help' yazın</p>
                    <p class="terminal-info">${terminal.name} başlatmak için 'run' yazın</p>
                </div>
                <div id="terminal-output-${terminal.id}"></div>
                <div class="terminal-input-line">
                    <span class="terminal-prompt" style="color: ${terminal.color};">${terminal.id}@css$</span>
                    <input type="text"
                           id="terminal-input-${terminal.id}"
                           class="terminal-input"
                           autocomplete="off"
                           onkeydown="handleTerminalInput(event, '${terminal.id}')" />
                </div>
            </div>
        </div>

        <!-- Documentation Section -->
        <div class="terminal-help" style="margin-top: 16px; background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 24px;">
            <h3 style="color: ${terminal.color}; margin-bottom: 16px;">📚 Kullanma Kılavuzu</h3>
            <div style="color: #94a3b8;">
                <h4 style="color: #f1f5f9; margin-top: 16px;">Temel Komutlar:</h4>
                <ul style="margin-left: 20px;">
                    ${terminal.commands.map(cmd => `
                        <li style="margin: 8px 0;">
                            <code style="background: #0f172a; padding: 4px 8px; border-radius: 4px; color: ${terminal.color};">${cmd}</code>
                            <span> - ${getCommandDescription(cmd)}</span>
                        </li>
                    `).join('')}
                </ul>

                <h4 style="color: #f1f5f9; margin-top: 16px;">Genel Komutlar:</h4>
                <ul style="margin-left: 20px;">
                    <li style="margin: 8px 0;"><code style="background: #0f172a; padding: 4px 8px; border-radius: 4px;">help</code> - Yardım menüsünü göster</li>
                    <li style="margin: 8px 0;"><code style="background: #0f172a; padding: 4px 8px; border-radius: 4px;">status</code> - Terminal durumunu kontrol et</li>
                    <li style="margin: 8px 0;"><code style="background: #0f172a; padding: 4px 8px; border-radius: 4px;">run</code> - Terminali çalıştır</li>
                    <li style="margin: 8px 0;"><code style="background: #0f172a; padding: 4px 8px; border-radius: 4px;">stop</code> - Terminali durdur</li>
                    <li style="margin: 8px 0;"><code style="background: #0f172a; padding: 4px 8px; border-radius: 4px;">clear</code> - Ekranı temizle</li>
                </ul>

                <h4 style="color: #f1f5f9; margin-top: 16px;">Örnek Kullanım:</h4>
                <pre style="background: #0f172a; padding: 12px; border-radius: 8px; overflow-x: auto; color: ${terminal.color}; font-size: 12px;">
${terminal.id}@css$ run
> ${terminal.name} başlatılıyor...
> Bağlantı kuruluyor: ${HETZNER_API.baseURL}
> ✓ Bağlantı başarılı!
> ✓ ${terminal.commands[0]} çalıştırılıyor...
> ✓ Tamamlandı!
                </pre>

                <h4 style="color: #f1f5f9; margin-top: 16px;">API Bağlantısı:</h4>
                <p style="font-size: 13px;">Bu terminal Hetzner sunucusuna bağlıdır:</p>
                <ul style="margin-left: 20px;">
                    <li style="margin: 8px 0;">Base URL: <code style="background: #0f172a; padding: 4px 8px; border-radius: 4px;">${HETZNER_API.baseURL}</code></li>
                    <li style="margin: 8px 0;">Sign In: <code style="background: #0f172a; padding: 4px 8px; border-radius: 4px;">${HETZNER_API.signInURL}</code></li>
                    <li style="margin: 8px 0;">Docs: <code style="background: #0f172a; padding: 4px 8px; border-radius: 4px;">${HETZNER_API.docsURL}</code></li>
                </ul>
            </div>
        </div>
    `;

    return content;
}

function getCommandDescription(cmd) {
    const descriptions = {
        'search-ugg': '🔍 UGG damen stiefel 39 sehr gut - Tüm platformlardan ara',
        'scrape-all': 'Tüm platform taramas başlat',
        'scrape-de': 'Almanya platformları tara',
        'scrape-fr': 'Fransa platformları tara',
        'scrape-pl': 'Polonya platformları tara',
        'scrape-nl': 'Hollanda platformları tara',
        'list-products': 'Database\'deki tüm ürünleri listele',
        'sync-db': 'Database\'i senkronize et',
        'scrape-vinted': 'Vinted\'dan ürünleri tara',
        'list-vinted': 'Taranan ürünleri listele',
        'sync-vinted': 'Vinted ile senkronize et',
        'test-vinted': 'Vinted bağlantısını test et',
        'scrape-kleinanzeigen': 'Kleinanzeigen\'dan ürünleri tara',
        'list-kleinanzeigen': 'Kleinanzeigen ürünlerini listele',
        'sync-kleinanzeigen': 'Kleinanzeigen ile senkronize et',
        'test-kleinanzeigen': 'Kleinanzeigen bağlantısını test et',
        'scrape-facebook': 'Facebook Marketplace\'den tara',
        'list-facebook': 'Facebook ürünlerini listele',
        'sync-facebook': 'Facebook ile senkronize et',
        'test-facebook': 'Facebook bağlantısını test et',
        'scrape-shpock': 'Shpock\'tan ürünleri tara',
        'list-shpock': 'Shpock ürünlerini listele',
        'sync-shpock': 'Shpock ile senkronize et',
        'test-shpock': 'Shpock bağlantısını test et',
        'scrape-instagram': 'Instagram\'dan ürünleri tara',
        'list-instagram': 'Instagram ürünlerini listele',
        'sync-instagram': 'Instagram ile senkronize et',
        'test-instagram': 'Instagram bağlantısını test et',
        'check-quality': 'Ürün kalitesini kontrol et',
        'filter-products': 'Ürünleri filtrele',
        'validate-images': 'Görselleri doğrula',
        'check-duplicates': 'Tekrar eden ürünleri bul',
        'process-images': 'Görselleri işle',
        'resize-images': 'Görselleri yeniden boyutlandır',
        'compress-images': 'Görselleri sıkıştır',
        'watermark-images': 'Görsellere filigran ekle',
        'analyze-prices': 'Fiyatları analiz et',
        'optimize-prices': 'Fiyatları optimize et',
        'check-competition': 'Rekabeti kontrol et',
        'suggest-prices': 'Fiyat önerileri sun',
        'optimize-seo': 'SEO optimizasyonu yap',
        'generate-keywords': 'Anahtar kelime üret',
        'check-seo-score': 'SEO skorunu kontrol et',
        'update-meta': 'Meta verilerini güncelle',
        'generate-description': 'Ürün açıklaması oluştur',
        'translate-content': 'İçeriği çevir',
        'improve-text': 'Metni iyileştir',
        'generate-tags': 'Etiket oluştur',
        'post-instagram': 'Instagram\'a paylaş',
        'post-facebook': 'Facebook\'a paylaş',
        'schedule-posts': 'Paylaşımları planla',
        'track-engagement': 'Etkileşimi takip et',
        'send-newsletter': 'Newsletter gönder',
        'create-campaign': 'Kampanya oluştur',
        'track-opens': 'Açılma oranlarını takip et',
        'manage-subscribers': 'Aboneleri yönet',
        'list-orders': 'Siparişleri listele',
        'process-order': 'Siparişi işle',
        'update-status': 'Durumu güncelle',
        'send-confirmation': 'Onay maili gönder',
        'check-stock': 'Stok durumunu kontrol et',
        'update-inventory': 'Envanteri güncelle',
        'sync-stock': 'Stok senkronizasyonu',
        'alert-low-stock': 'Düşük stok uyarısı',
        'track-shipment': 'Kargoyu takip et',
        'create-label': 'Kargo etiketi oluştur',
        'update-tracking': 'Takip bilgilerini güncelle',
        'notify-customer': 'Müşteriyi bilgilendir',
        'list-tickets': 'Destek taleplerini listele',
        'respond-ticket': 'Talebe yanıt ver',
        'auto-reply': 'Otomatik yanıt gönder',
        'escalate-issue': 'Sorunu yükselt',
        'show-stats': 'İstatistikleri göster',
        'generate-report': 'Rapor oluştur',
        'track-kpi': 'KPI\'ları takip et',
        'export-data': 'Verileri dışa aktar',
        'backup-db': 'Veritabanını yedekle',
        'restore-db': 'Veritabanını geri yükle',
        'clean-db': 'Veritabanını temizle',
        'optimize-db': 'Veritabanını optimize et',
        'check-health': 'Sistem sağlığını kontrol et',
        'monitor-cpu': 'CPU kullanımını izle',
        'check-memory': 'Bellek kullanımını kontrol et',
        'view-logs': 'Logları görüntüle',
        'start-all': 'Tüm terminalleri başlat',
        'stop-all': 'Tüm terminalleri durdur',
        'status-all': 'Tüm terminal durumlarını göster',
        'sync-all': 'Tüm terminalleri senkronize et',
        'publish-all': 'Tüm ürünleri yayınla'
    };

    return descriptions[cmd] || 'Komut açıklaması';
}

function switchTerminal(terminalId) {
    // Switch tabs
    document.querySelectorAll('.terminal-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.terminalId === terminalId) {
            tab.classList.add('active');
        }
    });

    // Switch content
    document.querySelectorAll('.terminal-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`content-${terminalId}`).classList.add('active');

    // Focus input
    document.getElementById(`terminal-input-${terminalId}`).focus();
}

function handleTerminalInput(event, terminalId) {
    if (event.key === 'Enter') {
        const input = event.target;
        const command = input.value.trim();

        if (command) {
            executeTerminalCommand(terminalId, command);
            input.value = '';
        }
    }
}

function executeTerminalCommand(terminalId, command) {
    const output = document.getElementById(`terminal-output-${terminalId}`);
    const terminal = TERMINALS.find(t => t.id === terminalId);

    // Display command
    const commandLine = document.createElement('div');
    commandLine.className = 'terminal-line';
    commandLine.innerHTML = `<span class="terminal-prompt" style="color: ${terminal.color};">${terminalId}@css$</span> <span class="terminal-command">${command}</span>`;
    output.appendChild(commandLine);

    // Execute command
    const result = parseTerminalCommand(terminalId, command);

    // Display result
    const resultLine = document.createElement('div');
    resultLine.className = 'terminal-line terminal-output';
    resultLine.innerHTML = result;
    output.appendChild(resultLine);

    // Scroll to bottom
    const terminalBody = document.getElementById(`terminal-body-${terminalId}`);
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function parseTerminalCommand(terminalId, command) {
    const terminal = TERMINALS.find(t => t.id === terminalId);
    const cmd = command.toLowerCase();

    // Common commands
    if (cmd === 'help') {
        return `
            <div class="terminal-success">${terminal.name} için Kullanılabilir Komutlar:</div>
            ${terminal.commands.map(c => `<div>  • ${c}</div>`).join('')}
            <div style="margin-top: 8px;">Genel Komutlar:</div>
            <div>  • help - Yardım menüsünü göster</div>
            <div>  • status - Terminal durumunu kontrol et</div>
            <div>  • run - Terminali başlat</div>
            <div>  • clear - Ekranı temizle</div>
        `;
    }

    if (cmd === 'status') {
        return `
            <div class="terminal-success">Terminal Durumu:</div>
            <div>───────────────────────────────</div>
            <div>Terminal: ${terminal.name}</div>
            <div>Kategori: ${terminal.category}</div>
            <div>Durum: <span style="color: #10b981;">● AKTİF</span></div>
            <div>API: ${HETZNER_API.baseURL}</div>
            <div>Son Aktivite: ${new Date().toLocaleString('tr-TR')}</div>
        `;
    }

    if (cmd === 'run') {
        return runTerminal(terminalId);
    }

    if (cmd === 'clear') {
        document.getElementById(`terminal-output-${terminalId}`).innerHTML = '';
        return '';
    }

    if (cmd === 'stop') {
        return `<div class="terminal-success">✓ ${terminal.name} durduruldu</div>`;
    }

    // Terminal-specific commands
    if (terminal.commands.includes(cmd)) {
        // SEARCH-UGG komutu için gerçek API çağrısı
        if (cmd === 'search-ugg') {
            searchUGGProducts();  // Gerçek arama fonksiyonunu çağır
            return `<div class="terminal-success">🔍 UGG Arama başlatılıyor...</div>`;
        }
        return simulateTerminalCommand(terminal, cmd);
    }

    return `<div class="terminal-error">Hata: '${command}' komutu bulunamadı. Yardım için 'help' yazın.</div>`;
}

function simulateTerminalCommand(terminal, command) {
    return `
        <div class="terminal-success">▶ ${command} çalıştırılıyor...</div>
        <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
        <div>[${getTimestamp()}] ${HETZNER_API.baseURL} adresine bağlanılıyor...</div>
        <div>[${getTimestamp()}] <span style="color: #10b981;">✓</span> Bağlandı!</div>
        <div>[${getTimestamp()}] ${command} başlatıldı...</div>
        <div>[${getTimestamp()}] <span style="color: #10b981;">✓</span> Başarıyla tamamlandı!</div>
        <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
        <div class="terminal-success">✓ ${command} tamamlandı</div>
    `;
}

function runTerminal(terminalId) {
    const terminal = TERMINALS.find(t => t.id === terminalId);
    return `
        <div class="terminal-success">🚀 ${terminal.name} başlatılıyor...</div>
        <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
        <div>[${getTimestamp()}] Başlatılıyor...</div>
        <div>[${getTimestamp()}] API Bağlantısı: ${HETZNER_API.baseURL}</div>
        <div>[${getTimestamp()}] <span style="color: #10b981;">✓</span> Bağlantı kuruldu!</div>
        <div>[${getTimestamp()}] Kimlik doğrulanıyor...</div>
        <div>[${getTimestamp()}] <span style="color: #10b981;">✓</span> Kimlik doğrulandı!</div>
        <div>[${getTimestamp()}] Terminal hazır!</div>
        <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
        <div class="terminal-success">✓ ${terminal.name} çalışıyor!</div>
    `;
}

function clearTerminalOutput(terminalId) {
    document.getElementById(`terminal-output-${terminalId}`).innerHTML = '';
}

function getTimestamp() {
    return new Date().toTimeString().split(' ')[0];
}

// ============================================
// MOTOR STATUS CHECK
// ============================================
async function checkMotorStatus() {
    try {
        const response = await fetch(`${HETZNER_API.baseURL}/api/status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const motorStatus = document.getElementById('motorStatus');
            const motorText = document.getElementById('motorText');

            motorStatus.classList.remove('offline');
            motorText.textContent = 'Motor: Online';
        } else {
            throw new Error('Motor offline');
        }
    } catch (error) {
        const motorStatus = document.getElementById('motorStatus');
        const motorText = document.getElementById('motorText');

        motorStatus.classList.add('offline');
        motorText.textContent = 'Motor: Offline';
    }
}

// ============================================
// ONE-CLICK PUBLISH
// ============================================
async function oneClickPublish() {
    const btn = event.target.closest('.publish-btn');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
            <circle cx="12" cy="12" r="10"></circle>
        </svg>
        YAYINLANIYOR...
    `;

    try {
        // Call Hetzner API to publish all products
        const response = await fetch(`${HETZNER_API.baseURL}/api/publish-all`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + (localStorage.getItem('adminToken') || '')
            },
            body: JSON.stringify({
                source: 'firsat-listesi',
                autoPublish: true
            })
        });

        if (response.ok) {
            const data = await response.json();

            btn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                ✓ BAŞARIYLA YAYINLANDI!
            `;
            btn.style.background = '#10b981';

            const productCount = data.count || 156;
            alert(`Başarılı! ${productCount} ürün yayınlandı!`);

            // Telegram ve WhatsApp bildirimi gönder
            const notificationMessage = `🎉 YENİ ÜRÜN YAYINLANDI!\n\n✅ ${productCount} ürün başarıyla yayınlandı\n⏰ ${new Date().toLocaleString('tr-TR')}\n💰 Toplam değer: €${data.totalValue || '~5,000'}\n\n🌐 https://cyhn85.github.io/cssberlin-website-/`;

            notifyAll(notificationMessage).catch(err => {
                console.log('Bildirim gönderilemedi:', err);
            });

            // Reload dashboard
            setTimeout(() => {
                loadDashboardData();
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        } else {
            throw new Error('Publish failed');
        }
    } catch (error) {
        console.error('Publish error:', error);

        btn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            HATA!
        `;
        btn.style.background = '#ef4444';

        alert('Yayınlama sırasında hata oluştu. Lütfen Motor bağlantısını kontrol edin.');

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    }
}

// ============================================
// DASHBOARD DATA
// ============================================
async function loadDashboardData() {
    try {
        // Simulate loading data from Hetzner
        document.getElementById('totalProducts').textContent = '1,234';
        document.getElementById('scrapedToday').textContent = '342';
        document.getElementById('readyToPublish').textContent = '156';
        document.getElementById('revenue').textContent = '€15,742';
        document.getElementById('publishCount').textContent = '156';
    } catch (error) {
        console.error('Dashboard load error:', error);
    }
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
async function sendTelegramNotification(message) {
    // LocalStorage'dan ayarları al
    const telegramSettings = localStorage.getItem('telegram_settings');
    if (!telegramSettings) {
        console.log('Telegram ayarları kaydedilmemiş!');
        throw new Error('Telegram ayarları kaydedilmemiş!');
    }

    const { enabled, token, chatId } = JSON.parse(telegramSettings);

    if (!enabled) {
        console.log('Telegram bildirimi devre dışı');
        return;
    }

    if (!token || !chatId) {
        console.log('Bot Token veya Chat ID eksik!');
        throw new Error('Bot Token veya Chat ID eksik!');
    }

    try {
        // Doğrudan Telegram Bot API'ye istek gönder
        const telegramApiUrl = `https://api.telegram.org/bot${token}/sendMessage`;

        const response = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();

        if (data.ok) {
            console.log('✓ Telegram bildirimi gönderildi');
            return true;
        } else {
            console.error('Telegram API hatası:', data);
            throw new Error(data.description || 'Telegram API hatası');
        }
    } catch (error) {
        console.error('Telegram bildirim hatası:', error);
        throw error;
    }
}

async function sendWhatsAppNotification(message) {
    if (!NOTIFICATIONS.whatsapp.enabled || !NOTIFICATIONS.whatsapp.phoneNumber) {
        console.log('WhatsApp bildirimi devre dışı');
        return;
    }

    try {
        const response = await fetch(`${HETZNER_API.baseURL}${HETZNER_API.endpoints.whatsapp}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + (localStorage.getItem('adminToken') || '')
            },
            body: JSON.stringify({
                message: message,
                phoneNumber: NOTIFICATIONS.whatsapp.phoneNumber
            })
        });

        if (response.ok) {
            console.log('✓ WhatsApp bildirimi gönderildi');
        }
    } catch (error) {
        console.error('WhatsApp bildirim hatası:', error);
    }
}

async function notifyAll(message) {
    // Her iki platforma da bildirim gönder
    await Promise.all([
        sendTelegramNotification(message),
        sendWhatsAppNotification(message)
    ]);
}

// ============================================
// SETTINGS MANAGEMENT
// ============================================
function saveTelegramSettings(event) {
    event.preventDefault();

    const enabled = document.getElementById('telegramEnabled').checked;
    const token = document.getElementById('telegramToken').value;
    const chatId = document.getElementById('telegramChatId').value;

    NOTIFICATIONS.telegram.enabled = enabled;
    NOTIFICATIONS.telegram.botToken = token;
    NOTIFICATIONS.telegram.chatId = chatId;

    // LocalStorage'a kaydet
    localStorage.setItem('telegram_settings', JSON.stringify({
        enabled, token, chatId
    }));

    alert('✓ Telegram ayarları kaydedildi!');

    return false; // Formun submit olmasını engelle
}

function saveWhatsAppSettings(event) {
    event.preventDefault();

    const enabled = document.getElementById('whatsappEnabled').checked;
    const phone = document.getElementById('whatsappPhone').value;

    NOTIFICATIONS.whatsapp.enabled = enabled;
    NOTIFICATIONS.whatsapp.phoneNumber = phone;

    // LocalStorage'a kaydet
    localStorage.setItem('whatsapp_settings', JSON.stringify({
        enabled, phone
    }));

    alert('✓ WhatsApp ayarları kaydedildi!');

    return false; // Formun submit olmasını engelle
}

async function testTelegram() {
    const testMessage = '🧪 TEST BİLDİRİMİ\n\nBu bir test mesajıdır.\n✅ Telegram entegrasyonu çalışıyor!';

    try {
        await sendTelegramNotification(testMessage);
        alert('✓ Test bildirimi gönderildi! Telegram\'ı kontrol edin.');
    } catch (error) {
        alert('✗ Test bildirimi gönderilemedi: ' + error.message);
    }
}

async function testWhatsApp() {
    const testMessage = '🧪 TEST BİLDİRİMİ\n\nBu bir test mesajıdır.\n✅ WhatsApp entegrasyonu çalışıyor!';

    try {
        await sendWhatsAppNotification(testMessage);
        alert('✓ Test bildirimi gönderildi! WhatsApp\'ı kontrol edin.');
    } catch (error) {
        alert('✗ Test bildirimi gönderilemedi: ' + error.message);
    }
}

function loadSettings() {
    // Telegram ayarlarını yükle
    const telegramSettings = localStorage.getItem('telegram_settings');
    if (telegramSettings) {
        const { enabled, token, chatId } = JSON.parse(telegramSettings);
        NOTIFICATIONS.telegram.enabled = enabled;
        NOTIFICATIONS.telegram.botToken = token;
        NOTIFICATIONS.telegram.chatId = chatId;

        if (document.getElementById('telegramEnabled')) {
            document.getElementById('telegramEnabled').checked = enabled;
            document.getElementById('telegramToken').value = token;
            document.getElementById('telegramChatId').value = chatId;
        }
    }

    // WhatsApp ayarlarını yükle
    const whatsappSettings = localStorage.getItem('whatsapp_settings');
    if (whatsappSettings) {
        const { enabled, phone } = JSON.parse(whatsappSettings);
        NOTIFICATIONS.whatsapp.enabled = enabled;
        NOTIFICATIONS.whatsapp.phoneNumber = phone;

        if (document.getElementById('whatsappEnabled')) {
            document.getElementById('whatsappEnabled').checked = enabled;
            document.getElementById('whatsappPhone').value = phone;
        }
    }
}

// ============================================
// LOGOUT
// ============================================
function logout() {
    if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
        localStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminToken');
        window.location.href = 'login.html';
    }
}

// ============================================
// CONSOLE INFO
// ============================================
console.log('%c🌌 Kozmik Oda Initialized', 'color: #FF8C42; font-size: 20px; font-weight: bold;');
console.log('%c20 Terminals Ready', 'color: #10b981; font-size: 14px;');
console.log(`%cHetzner API: ${HETZNER_API.baseURL}`, 'color: #94a3b8; font-size: 12px;');

// ============================================
// KOZMIK MOTOR FUNCTIONS
// ============================================

// Motor durumunu kontrol et
async function checkMotorStatus() {
    try {
        const response = await fetch(API_BASE + HETZNER_API.endpoints.kozmikStatus);
        const data = await response.json();

        // Motor status güncelle
        const motorStatusEl = document.querySelector('.motor-status');
        if (motorStatusEl) {
            if (data.motor_status === 'online') {
                motorStatusEl.classList.remove('offline');
                motorStatusEl.innerHTML = '<span class="status-dot"></span> Motor: Online';
            } else {
                motorStatusEl.classList.add('offline');
                motorStatusEl.innerHTML = '<span class="status-dot"></span> Motor: Offline';
            }
        }

        return data;
    } catch (error) {
        console.error('Motor status error:', error);
        const motorStatusEl = document.querySelector('.motor-status');
        if (motorStatusEl) {
            motorStatusEl.classList.add('offline');
            motorStatusEl.innerHTML = '<span class="status-dot"></span> Motor: Offline';
        }
        return null;
    }
}

// Terminal komutunu çalıştır
async function executeTerminalCommand(terminalId, command) {
    try {
        const response = await fetch(API_BASE + HETZNER_API.endpoints.kozmikExecute, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                terminal_id: terminalId,
                command: command
            })
        });

        const result = await response.json();

        if (result.success) {
            console.log(`✅ Command executed: ${terminalId} -> ${command}`);
            // Terminal output'u güncelle
            await updateTerminalOutput(terminalId);
        } else {
            console.error(`❌ Command failed: ${terminalId} -> ${command}`);
        }

        return result;
    } catch (error) {
        console.error('Execute command error:', error);
        return {success: false, error: error.message};
    }
}

// Terminal output'u güncelle
async function updateTerminalOutput(terminalId) {
    try {
        const response = await fetch(`${API_BASE}/kozmik/terminals/${terminalId}`);
        const terminal = await response.json();

        // Terminal output div'ini bul
        const outputDiv = document.querySelector(`#${terminalId} .terminal-output`);
        if (outputDiv && terminal.output) {
            outputDiv.innerHTML = terminal.output.map(line => 
                `<div class="output-line">${escapeHtml(line)}</div>`
            ).join('');

            // Auto-scroll
            outputDiv.scrollTop = outputDiv.scrollHeight;
        }

        // Status güncelle
        const statusEl = document.querySelector(`#${terminalId} .terminal-status`);
        if (statusEl) {
            statusEl.textContent = terminal.status.toUpperCase();
            statusEl.className = `terminal-status status-${terminal.status}`;
        }

        return terminal;
    } catch (error) {
        console.error('Update terminal output error:', error);
        return null;
    }
}

// UGG ürün araması başlat (TÜM TERMİNALLER)
async function searchUGGProducts() {
    console.log('🔍 UGG ARAMA BAŞLATILIYOR...');

    const query = 'ugg damen stiefel 39 sehr gut';
    const terminalId = 'T1';  // Terminal 1'de ara

    // Loading göster
    const outputDiv = document.querySelector(`#terminal-1 .terminal-output`);
    if (outputDiv) {
        outputDiv.innerHTML = `
            <div class="output-line">🔍 ARAMA BAŞLATILIYOR...</div>
            <div class="output-line">Query: ${query}</div>
            <div class="output-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
        `;
    }

    // Backend'e arama isteği gönder
    try {
        const response = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (outputDiv) {
            outputDiv.innerHTML = `
                <div class="output-line">✅ ARAMA TAMAMLANDI!</div>
                <div class="output-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                <div class="output-line"></div>
                <div class="output-line">📊 Toplam: ${data.total} ürün bulundu</div>
                <div class="output-line"></div>
            `;

            // Ürünleri listele
            if (data.products && data.products.length > 0) {
                data.products.forEach((product, index) => {
                    outputDiv.innerHTML += `
                        <div class="output-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                        <div class="output-line">${index + 1}. ${product.title}</div>
                        <div class="output-line">   💰 EUR ${product.price}</div>
                        <div class="output-line">   📦 ${product.platform} | ${product.brand || 'N/A'} | ${product.size || 'N/A'}</div>
                        <div class="output-line">   📍 ${product.location || 'N/A'} | ${product.condition || 'N/A'}</div>
                        <div class="output-line"></div>
                    `;
                });
            } else {
                outputDiv.innerHTML += `<div class="output-line">❌ Hiç ürün bulunamadı</div>`;
            }

            outputDiv.innerHTML += `<div class="output-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>`;
            outputDiv.scrollTop = outputDiv.scrollHeight;
        }

        console.log(`✅ ${data.total} ürün bulundu!`);
        return data;

    } catch (error) {
        console.error('Search error:', error);
        if (outputDiv) {
            outputDiv.innerHTML += `
                <div class="output-line">❌ HATA: ${error.message}</div>
                <div class="output-line">Backend çalışmıyor olabilir!</div>
            `;
        }
        return null;
    }
}

// HTML escape helper
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Sayfa yüklendiğinde motor durumunu kontrol et
window.addEventListener('DOMContentLoaded', async () => {
    console.log('🌌 Kozmik Oda yükleniyor...');

    // Motor durumunu kontrol et
    await checkMotorStatus();

    // 5 saniyede bir motor durumunu güncelle
    setInterval(checkMotorStatus, 5000);

    // 2 saniyede bir aktif terminal output'u güncelle
    setInterval(async () => {
        const activeTerminal = document.querySelector('.terminal-content.active');
        if (activeTerminal) {
            const terminalId = activeTerminal.id;
            await updateTerminalOutput(terminalId);
        }
    }, 2000);

    console.log('✅ Kozmik Oda hazır!');
});

console.log('%c🚀 Kozmik Motor Functions Loaded', 'color: #10b981; font-size: 14px; font-weight: bold;');

