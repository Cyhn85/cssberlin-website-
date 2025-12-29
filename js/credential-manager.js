/**
 * Credential Manager UI
 * Admin panel for managing platform credentials
 */

// Use existing API_BASE if already defined, otherwise define it
if (typeof API_BASE === 'undefined') {
    var API_BASE = 'http://localhost:8000';
}

// Platform configurations
const PLATFORMS = {
    vinted: {
        name: 'Vinted',
        icon: '🛍️',
        fields: ['email', 'password'],
        metadata: ['country', 'shop_name'],
        accountPrefix: 'shop_'
    },
    kleinanzeigen: {
        name: 'Kleinanzeigen',
        icon: '📋',
        fields: ['email', 'password'],
        metadata: ['location'],
        accountPrefix: 'account_'
    },
    ebay: {
        name: 'eBay',
        icon: '🏷️',
        fields: ['app_id', 'cert_id', 'user_token'],
        metadata: ['site'],
        accountPrefix: 'account_'
    }
};

/**
 * Initialize Credential Manager
 */
async function initCredentialManager() {
    console.log('🔐 Initializing Credential Manager...');

    // Load all credentials
    await loadAllCredentials();

    // Setup event listeners
    setupEventListeners();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Add credential buttons
    document.querySelectorAll('.add-credential-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const platform = e.target.dataset.platform;
            showAddCredentialModal(platform);
        });
    });
}

/**
 * Load all platform credentials
 */
async function loadAllCredentials() {
    for (const [platformKey, platformConfig] of Object.entries(PLATFORMS)) {
        await loadPlatformCredentials(platformKey);
    }
}

/**
 * Load credentials for a specific platform
 */
async function loadPlatformCredentials(platform) {
    try {
        const response = await fetch(`${API_BASE}/api/credentials/${platform}`);
        const data = await response.json();

        if (data.success) {
            displayCredentials(platform, data.accounts);
        }
    } catch (error) {
        console.error(`Error loading ${platform} credentials:`, error);
    }
}

/**
 * Display credentials in UI
 */
function displayCredentials(platform, accounts) {
    const container = document.getElementById(`${platform}-credentials`);
    if (!container) return;

    if (accounts.length === 0) {
        container.innerHTML = `
            <div class="empty-credentials">
                <p>Henüz hesap eklenmedi</p>
                <button class="btn-primary add-credential-btn" data-platform="${platform}">
                    ➕ Hesap Ekle
                </button>
            </div>
        `;
        return;
    }

    let html = '<div class="credentials-list">';

    accounts.forEach(account => {
        const statusColor = account.metadata.status === 'active' ? '#10b981' : '#ef4444';
        const statusText = account.metadata.status === 'active' ? 'Aktif' : 'Pasif';

        html += `
            <div class="credential-card">
                <div class="credential-header">
                    <h4>${PLATFORMS[platform].icon} ${account.account_id}</h4>
                    <span class="status-badge" style="background: ${statusColor}20; color: ${statusColor};">
                        ${statusText}
                    </span>
                </div>
                <div class="credential-body">
                    <p><strong>Email:</strong> ${account.email}</p>
                    ${account.metadata.country ? `<p><strong>Country:</strong> ${account.metadata.country}</p>` : ''}
                    ${account.metadata.shop_name ? `<p><strong>Shop:</strong> ${account.metadata.shop_name}</p>` : ''}
                    ${account.metadata.site ? `<p><strong>Site:</strong> ${account.metadata.site}</p>` : ''}
                    <p class="credential-date">Eklendi: ${new Date(account.metadata.created_at).toLocaleDateString('tr-TR')}</p>
                </div>
                <div class="credential-actions">
                    <button class="btn-sm btn-test" onclick="testCredential('${platform}', '${account.account_id}')">
                        🧪 Test
                    </button>
                    <button class="btn-sm btn-delete" onclick="deleteCredential('${platform}', '${account.account_id}')">
                        🗑️ Sil
                    </button>
                </div>
            </div>
        `;
    });

    html += '</div>';
    html += `
        <button class="btn-primary add-credential-btn" data-platform="${platform}" style="margin-top: 16px;">
            ➕ Yeni Hesap Ekle
        </button>
    `;

    container.innerHTML = html;
}

/**
 * Show add credential modal
 */
function showAddCredentialModal(platform) {
    const platformConfig = PLATFORMS[platform];

    let formFields = '';

    // Account ID
    formFields += `
        <div class="form-group">
            <label>Hesap ID</label>
            <input type="text" id="add-account-id" class="form-control"
                   placeholder="${platformConfig.accountPrefix}1" required>
            <small>Örnek: ${platformConfig.accountPrefix}1, ${platformConfig.accountPrefix}2</small>
        </div>
    `;

    // Platform-specific fields
    platformConfig.fields.forEach(field => {
        const fieldType = field.includes('password') || field.includes('token') ? 'password' : 'text';
        formFields += `
            <div class="form-group">
                <label>${field.replace('_', ' ').toUpperCase()}</label>
                <input type="${fieldType}" id="add-${field}" class="form-control" required>
            </div>
        `;
    });

    // Metadata fields
    if (platformConfig.metadata.includes('country')) {
        formFields += `
            <div class="form-group">
                <label>Ülke</label>
                <select id="add-country" class="form-control">
                    <option value="DE">🇩🇪 Almanya (DE)</option>
                    <option value="FR">🇫🇷 Fransa (FR)</option>
                    <option value="NL">🇳🇱 Hollanda (NL)</option>
                    <option value="PL">🇵🇱 Polonya (PL)</option>
                    <option value="UK">🇬🇧 İngiltere (UK)</option>
                </select>
            </div>
        `;
    }

    if (platformConfig.metadata.includes('shop_name')) {
        formFields += `
            <div class="form-group">
                <label>Mağaza Adı (Opsiyonel)</label>
                <input type="text" id="add-shop-name" class="form-control" placeholder="CSS Berlin Shop 1">
            </div>
        `;
    }

    if (platformConfig.metadata.includes('site')) {
        formFields += `
            <div class="form-group">
                <label>eBay Site</label>
                <select id="add-site" class="form-control">
                    <option value="DE">eBay.de (Almanya)</option>
                    <option value="US">eBay.com (USA)</option>
                    <option value="UK">eBay.co.uk (UK)</option>
                    <option value="FR">eBay.fr (Fransa)</option>
                </select>
            </div>
        `;
    }

    // Create modal HTML
    const modalHTML = `
        <div class="credential-modal-overlay" id="credentialModalOverlay">
            <div class="credential-modal">
                <div class="credential-modal-header">
                    <h3>${platformConfig.icon} ${platformConfig.name} Hesap Ekle</h3>
                    <button class="modal-close" onclick="closeCredentialModal()">×</button>
                </div>
                <div class="credential-modal-body">
                    <form id="addCredentialForm">
                        ${formFields}
                    </form>
                </div>
                <div class="credential-modal-footer">
                    <button class="btn-secondary" onclick="closeCredentialModal()">İptal</button>
                    <button class="btn-primary" onclick="submitCredential('${platform}')">💾 Kaydet</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Close credential modal
 */
function closeCredentialModal() {
    const modal = document.getElementById('credentialModalOverlay');
    if (modal) {
        modal.remove();
    }
}

/**
 * Submit new credential
 */
async function submitCredential(platform) {
    const platformConfig = PLATFORMS[platform];

    // Collect form data
    const accountId = document.getElementById('add-account-id').value.trim();

    if (!accountId) {
        if (typeof toast !== 'undefined') {
            toast.error('Hata', 'Hesap ID gerekli!', 3000);
        }
        return;
    }

    // Collect credentials
    const credentials = {};
    platformConfig.fields.forEach(field => {
        const value = document.getElementById(`add-${field}`).value.trim();
        credentials[field] = value;
    });

    // Collect metadata
    const metadata = {};
    if (document.getElementById('add-country')) {
        metadata.country = document.getElementById('add-country').value;
    }
    if (document.getElementById('add-shop-name')) {
        metadata.shop_name = document.getElementById('add-shop-name').value.trim();
    }
    if (document.getElementById('add-site')) {
        metadata.site = document.getElementById('add-site').value;
    }
    metadata.status = 'active';

    // Submit to API
    try {
        const response = await fetch(`${API_BASE}/api/credentials/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                platform: platform,
                account_id: accountId,
                ...credentials,
                metadata: metadata
            })
        });

        const data = await response.json();

        if (data.success) {
            if (typeof toast !== 'undefined') {
                toast.success('Başarılı', `${platformConfig.name} hesabı eklendi!`, 3000);
            }
            closeCredentialModal();
            await loadPlatformCredentials(platform);
        } else {
            throw new Error(data.message || 'Hesap eklenemedi');
        }
    } catch (error) {
        console.error('Add credential error:', error);
        if (typeof toast !== 'undefined') {
            toast.error('Hata', `Hesap eklenemedi: ${error.message}`, 5000);
        }
    }
}

/**
 * Test credential
 */
async function testCredential(platform, accountId) {
    if (typeof toast !== 'undefined') {
        toast.info('Test Ediliyor', `${platform}/${accountId} test ediliyor...`, 3000);
    }

    try {
        const response = await fetch(`${API_BASE}/api/credentials/test/${platform}/${accountId}`, {
            method: 'POST'
        });

        const data = await response.json();

        if (data.success && data.is_valid) {
            if (typeof toast !== 'undefined') {
                toast.success('Test Başarılı', 'Credential geçerli ve şifresi çözülebiliyor!', 4000);
            }
        } else {
            if (typeof toast !== 'undefined') {
                toast.error('Test Başarısız', 'Credential geçersiz veya şifresi çözülemiyor!', 4000);
            }
        }
    } catch (error) {
        console.error('Test credential error:', error);
        if (typeof toast !== 'undefined') {
            toast.error('Test Hatası', error.message, 5000);
        }
    }
}

/**
 * Delete credential
 */
async function deleteCredential(platform, accountId) {
    if (!confirm(`${platform}/${accountId} hesabını silmek istediğinize emin misiniz?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/credentials/${platform}/${accountId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            if (typeof toast !== 'undefined') {
                toast.success('Silindi', `${platform}/${accountId} hesabı silindi!`, 3000);
            }
            await loadPlatformCredentials(platform);
        } else {
            throw new Error(data.message || 'Hesap silinemedi');
        }
    } catch (error) {
        console.error('Delete credential error:', error);
        if (typeof toast !== 'undefined') {
            toast.error('Hata', `Hesap silinemedi: ${error.message}`, 5000);
        }
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCredentialManager);
} else {
    initCredentialManager();
}

console.log('✅ Credential Manager UI loaded');
