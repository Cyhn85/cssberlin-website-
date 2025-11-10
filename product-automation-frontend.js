/**
 * Product Discovery & Automation Frontend
 * Handles UI interactions for product scraping and image processing
 */

// ============================================
// PRODUCT DISCOVERY Functions
// ============================================

async function startProductDiscovery() {
    const keyword = document.getElementById('discoveryKeyword').value.trim();

    if (!keyword) {
        showNotification('Lütfen anahtar kelime girin!', 'warning');
        return;
    }

    // Get selected terminals
    const terminals = [];
    if (document.getElementById('discT1').checked) terminals.push('T1');
    if (document.getElementById('discT2').checked) terminals.push('T2');
    if (document.getElementById('discT3').checked) terminals.push('T3');
    if (document.getElementById('discT4').checked) terminals.push('T4');

    if (terminals.length === 0) {
        showNotification('En az bir terminal seçin!', 'warning');
        return;
    }

    // Clear previous results
    const resultsDiv = document.getElementById('discoveryResults');
    resultsDiv.innerHTML = '<div class="loading">🔍 Arama yapılıyor...</div>';

    try {
        const response = await fetch(`${API_CONFIG.current}/api/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                keyword: keyword,
                terminals: terminals
            })
        });

        const data = await response.json();

        if (data.success) {
            showNotification(`Arama başlatıldı! ${terminals.length} terminal çalışıyor.`, 'success');
            // Display results will be handled by WebSocket or polling
            displayDiscoveryResults([]);
        }

    } catch (error) {
        resultsDiv.innerHTML = '<div class="empty-state"><p>Hata: ' + error.message + '</p></div>';
        showNotification('Arama başlatılamadı: ' + error.message, 'error');
    }
}

function displayDiscoveryResults(products) {
    const resultsDiv = document.getElementById('discoveryResults');

    if (!products || products.length === 0) {
        resultsDiv.innerHTML = '<div class="empty-state"><p>Henüz sonuç yok, arama devam ediyor...</p></div>';
        return;
    }

    let html = `<div class="products-grid">`;
    products.forEach(product => {
        html += `
            <div class="product-card">
                <img src="${product.image || '/placeholder.jpg'}" alt="${product.baslik}">
                <h4>${product.baslik}</h4>
                <p class="price">${product.currency} ${product.fiyat}</p>
                <p class="platform">${product.platform}</p>
            </div>
        `;
    });
    html += `</div>`;

    resultsDiv.innerHTML = html;
}

// ============================================
// PRODUCT AUTOMATION Functions
// ============================================

let uploadedFiles = [];

// File upload handling
document.addEventListener('DOMContentLoaded', function() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('imageUpload');

    if (uploadZone && fileInput) {
        // Drag and drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('drag-over');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('drag-over');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('drag-over');
            handleFiles(e.dataTransfer.files);
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
    }
});

function handleFiles(files) {
    uploadedFiles = Array.from(files);
    displayUploadedImages();
}

function displayUploadedImages() {
    const container = document.getElementById('uploadedImages');
    if (!container) return;

    container.innerHTML = '';

    uploadedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const div = document.createElement('div');
            div.className = 'uploaded-image';
            div.innerHTML = `
                <img src="${e.target.result}" alt="${file.name}">
                <button class="remove-btn" onclick="removeImage(${index})">×</button>
            `;
            container.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

function removeImage(index) {
    uploadedFiles.splice(index, 1);
    displayUploadedImages();
}

async function processProduct() {
    // Validate inputs
    if (uploadedFiles.length === 0) {
        showNotification('Lütfen en az bir resim yükleyin!', 'warning');
        return;
    }

    const productName = document.getElementById('productName').value.trim();
    const productBrand = document.getElementById('productBrand').value.trim();
    const productSize = document.getElementById('productSize').value.trim();
    const productPrice = document.getElementById('productPrice').value;
    const productCondition = document.getElementById('productCondition').value;
    const productCategory = document.getElementById('productCategory').value;

    if (!productName || !productBrand) {
        showNotification('Ürün adı ve marka zorunludur!', 'warning');
        return;
    }

    if (!productCategory) {
        showNotification('Ana kategori seçimi zorunludur!', 'warning');
        return;
    }

    // Validate price (optional but must be positive if provided)
    if (productPrice && (isNaN(productPrice) || parseFloat(productPrice) <= 0)) {
        showNotification('Fiyat pozitif bir sayı olmalıdır!', 'warning');
        return;
    }

    // Show processing status
    const statusDiv = document.getElementById('processingStatus');
    statusDiv.style.display = 'block';

    // Get AI options
    const aiOptions = {
        generateTitle: document.getElementById('aiTitle').checked,
        generateDescription: document.getElementById('aiDescription').checked,
        enhanceImages: document.getElementById('aiImageEnhance').checked,
        addWatermark: document.getElementById('aiWatermark').checked
    };

    try {
        // Step 1: Upload images
        updateStep('step1', 'active');
        const formData = new FormData();
        uploadedFiles.forEach((file, index) => {
            formData.append('images', file);
        });

        // Get selected platforms
        const platforms = [];
        if (document.getElementById('platformCSSBerlin')?.checked) {
            platforms.push('cssberlin');
        }
        if (document.getElementById('platformVinted')?.checked) {
            platforms.push('vinted');
        }
        if (document.getElementById('platformKleinanzeigen')?.checked) {
            platforms.push('kleinanzeigen');
        }
        if (document.getElementById('platformEbay')?.checked) {
            platforms.push('ebay');
        }

        // Validate: At least one platform must be selected
        if (platforms.length === 0) {
            showNotification('Lütfen en az bir platform seçin!', 'warning');
            statusDiv.style.display = 'none';
            return;
        }

        // Add product data
        formData.append('name', productName);
        formData.append('brand', productBrand);
        formData.append('size', productSize);
        formData.append('price', productPrice);
        formData.append('condition', productCondition);
        formData.append('category', productCategory);
        formData.append('platforms', JSON.stringify(platforms));
        formData.append('aiOptions', JSON.stringify(aiOptions));

        updateStep('step1', 'complete');

        // Step 2-5: Process with backend
        updateStep('step2', 'active');

        // Add timeout to fetch (30 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(`${API_CONFIG.current}/api/automation/process`, {
            method: 'POST',
            body: formData,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log('[DEBUG] Response status:', response.status);
        console.log('[DEBUG] Response headers:', Object.fromEntries(response.headers.entries()));

        const data = await response.json();
        console.log('[DEBUG] Response data:', data);

        if (data.success) {
            updateStep('step2', 'complete');
            updateStep('step3', 'complete');
            updateStep('step4', 'complete');
            updateStep('step5', 'complete');

            showNotification('Ürün başarıyla işlendi ve yayınlandı!', 'success');

            // Reset form
            setTimeout(() => {
                resetAutomationForm();
            }, 2000);

        } else {
            throw new Error(data.message || 'İşlem başarısız');
        }

    } catch (error) {
        console.error('Processing error:', error);

        // Handle different error types
        let errorMessage = 'Hata: ';
        if (error.name === 'AbortError') {
            errorMessage += 'İşlem zaman aşımına uğradı (30 saniye). Lütfen tekrar deneyin.';
        } else if (error.message.includes('fetch')) {
            errorMessage += 'Backend sunucusuna bağlanılamıyor. Sunucunun çalıştığından emin olun.';
        } else {
            errorMessage += error.message;
        }

        showNotification(errorMessage, 'error');
        statusDiv.style.display = 'none';
    }
}

function updateStep(stepId, status) {
    const step = document.getElementById(stepId);
    if (!step) return;

    step.classList.remove('active', 'complete');
    if (status) {
        step.classList.add(status);
    }
}

function resetAutomationForm() {
    uploadedFiles = [];
    document.getElementById('uploadedImages').innerHTML = '';
    document.getElementById('productName').value = '';
    document.getElementById('productBrand').value = '';
    document.getElementById('productSize').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productCondition').value = 'Yeni';
    document.getElementById('processingStatus').style.display = 'none';

    // Reset steps
    ['step1', 'step2', 'step3', 'step4', 'step5'].forEach(id => {
        updateStep(id, '');
    });
}

console.log('✅ Product Automation Frontend loaded');
