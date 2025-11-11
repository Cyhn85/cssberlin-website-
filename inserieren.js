/**
 * CSS Berlin - Inserieren Page JavaScript
 * Handles product upload with drag & drop image functionality
 */

// API Configuration
// Auto-detect environment: use API_CONFIG if available, otherwise use domain-based detection
const API_BASE_URL = typeof API_CONFIG !== 'undefined'
    ? API_CONFIG.current
    : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:8000'
        : 'https://api.cssberlin.de';

// State
let uploadedImages = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeImageUpload();
    initializeForm();
});

/**
 * Initialize Image Upload Functionality
 */
function initializeImageUpload() {
    const uploadArea = document.getElementById('imageUploadArea');
    const uploadInput = document.getElementById('imageUploadInput');

    // Click to upload
    uploadArea.addEventListener('click', () => {
        uploadInput.click();
    });

    // File input change
    uploadInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
}

/**
 * Handle uploaded files
 */
function handleFiles(files) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    Array.from(files).forEach(file => {
        // Validate file type
        if (!validTypes.includes(file.type)) {
            if (typeof toast !== 'undefined') {
                toast.error('Ungültiges Format', `${file.name} ist kein gültiges Bildformat (nur JPG, PNG, WEBP)`, 4000);
            }
            return;
        }

        // Validate file size
        if (file.size > maxSize) {
            if (typeof toast !== 'undefined') {
                toast.error('Datei zu groß', `${file.name} ist zu groß (max. 5MB)`, 4000);
            }
            return;
        }

        // Read and preview image
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = {
                file: file,
                dataUrl: e.target.result,
                id: Date.now() + Math.random()
            };

            uploadedImages.push(imageData);
            renderImagePreview(imageData);
        };
        reader.readAsDataURL(file);
    });
}

/**
 * Render image preview
 */
function renderImagePreview(imageData) {
    const previewGrid = document.getElementById('imagePreviewGrid');

    const previewItem = document.createElement('div');
    previewItem.className = 'image-preview-item';
    previewItem.dataset.id = imageData.id;

    previewItem.innerHTML = `
        <img src="${imageData.dataUrl}" alt="Preview">
        <button type="button" class="image-preview-remove" onclick="removeImage(${imageData.id})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;

    previewGrid.appendChild(previewItem);
}

/**
 * Remove image from upload list
 */
function removeImage(imageId) {
    // Remove from array
    uploadedImages = uploadedImages.filter(img => img.id !== imageId);

    // Remove from DOM
    const previewItem = document.querySelector(`[data-id="${imageId}"]`);
    if (previewItem) {
        previewItem.remove();
    }
}

/**
 * Initialize Form Submission
 */
function initializeForm() {
    const form = document.getElementById('inserierenForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate images
        if (uploadedImages.length === 0) {
            if (typeof toast !== 'undefined') {
                toast.warning('Keine Bilder', 'Bitte laden Sie mindestens ein Bild hoch!', 4000);
            }
            return;
        }

        // Show loading
        const submitBtn = document.getElementById('submitBtn');
        const loadingSpinner = document.getElementById('loadingSpinner');

        submitBtn.disabled = true;
        loadingSpinner.classList.add('show');

        try {
            // Collect form data
            const productData = {
                name: document.getElementById('productName').value,
                brand: document.getElementById('brand').value,
                category: document.getElementById('category').value,
                condition: document.getElementById('condition').value,
                size: document.getElementById('size').value,
                price: parseFloat(document.getElementById('price').value),
                description: document.getElementById('description').value || ''
            };

            // Process and upload
            await processAndUploadProduct(productData, uploadedImages);

            // Show success
            showSuccess();

            // Reset form
            form.reset();
            uploadedImages = [];
            document.getElementById('imagePreviewGrid').innerHTML = '';

        } catch (error) {
            console.error('Upload error:', error);
            if (typeof toast !== 'undefined') {
                toast.error('Upload Fehler', 'Fehler beim Hochladen. Bitte versuchen Sie es erneut.', 5000);
            }
        } finally {
            submitBtn.disabled = false;
            loadingSpinner.classList.remove('show');
        }
    });
}

/**
 * Process and upload product
 */
async function processAndUploadProduct(productData, images) {
    // Generate SEO content
    const seoContent = generateSEOContent(productData);

    // Prepare full product data
    const fullProductData = {
        ...productData,
        title: seoContent.title,
        description_meta: seoContent.metaDescription,
        description_full: seoContent.fullDescription,
        tags: seoContent.tags,
        status: 'pending', // Will be reviewed before publishing
        created_at: new Date().toISOString()
    };

    // Try to upload to API
    try {
        const formData = new FormData();

        // Add product data
        Object.keys(fullProductData).forEach(key => {
            if (Array.isArray(fullProductData[key])) {
                formData.append(key, JSON.stringify(fullProductData[key]));
            } else {
                formData.append(key, fullProductData[key]);
            }
        });

        // Add images with correct field name (backend expects 'images')
        images.forEach((imageData) => {
            formData.append('images', imageData.file);
        });

        console.log('[INSERT-DEBUG] Sending to:', `${API_BASE_URL}/api/automation/process`);
        console.log('[INSERT-DEBUG] Form data keys:', Array.from(formData.keys()));

        const response = await fetch(`${API_BASE_URL}/api/automation/process`, {
            method: 'POST',
            body: formData
        });

        console.log('[INSERT-DEBUG] Response status:', response.status);
        console.log('[INSERT-DEBUG] Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            throw new Error('API upload failed');
        }

        const result = await response.json();
        console.log('[INSERT-DEBUG] Response data:', result);

        if (result.success) {
            console.log('[INSERT-DEBUG] Upload successful! Product ID:', result.product_id);
        } else {
            console.error('[INSERT-DEBUG] Upload failed:', result.error || result.message);
        }

    } catch (error) {
        console.error('API upload failed, saving locally:', error);

        // Fallback: Save to localStorage for manual processing
        saveProductLocally(fullProductData, images);
    }
}

/**
 * Generate SEO optimized content
 */
function generateSEOContent(productData) {
    const { name, brand, size, condition, category, price } = productData;

    // Quality keywords
    const qualityWords = ['Premium', 'Hochwertig', 'Exklusiv', 'Top'];
    const qualityWord = qualityWords[Math.floor(Math.random() * qualityWords.length)];

    // Generate title (60-70 chars)
    let title = '';
    if (brand) title += `${brand} `;
    title += name;
    if (size) title += ` Größe ${size}`;
    title += ` ${qualityWord} Berlin`;

    // Truncate if too long
    if (title.length > 70) {
        title = title.substring(0, 67) + '...';
    }

    // Generate meta description (150-160 chars)
    let metaDescription = '';
    if (brand) metaDescription += `${brand} `;
    metaDescription += `${name} `;
    if (size) metaDescription += `Größe ${size} `;
    metaDescription += `${condition} in Berlin zu verkaufen. `;
    if (price) metaDescription += `Preis: ${price}€. `;
    metaDescription += 'Jetzt bestellen!';

    // Generate full description
    const fullDescription = `
🌟 ${qualityWord} ${name}${brand ? ' - ' + brand : ''}

📦 Produktdetails:
• ${brand ? 'Marke: ' + brand : ''}
• Zustand: ${condition}
${size ? '• Größe: ' + size : ''}
${price ? '• Preis: ' + price + '€' : ''}
• Kategorie: ${category}

🚚 Lieferung:
• Schnelle Lieferung in Berlin
• Deutschlandweiter Versand
• Sichere Verpackung

✨ Warum dieses Produkt wählen?
• ${qualityWord} Qualität
• Faire Preise
• Nachhaltig und klimafreundlich
• Von CSS Berlin geprüft

🔍 Keywords: ${name}, ${brand || 'Marke'}, Berlin, ${category}, ${condition}, Second Hand, CSS Berlin, nachhaltig
    `.trim();

    // Generate tags
    const tags = [
        'Berlin',
        'CSS',
        'Second Hand',
        'Nachhaltig'
    ];

    if (brand) tags.push(brand);
    if (category) tags.push(category);
    if (condition.includes('Neu')) {
        tags.push('Neu', 'Ungetragen');
    } else {
        tags.push('Gebraucht');
    }
    if (size) tags.push(`Größe ${size}`);

    return {
        title,
        metaDescription,
        fullDescription,
        tags: [...new Set(tags)] // Remove duplicates
    };
}

/**
 * Save product locally for manual processing
 */
function saveProductLocally(productData, images) {
    const savedProducts = JSON.parse(localStorage.getItem('pendingProducts') || '[]');

    // Save product with image data URLs (for preview)
    const imageDataUrls = images.map(img => img.dataUrl);

    savedProducts.push({
        ...productData,
        images: imageDataUrls,
        savedAt: new Date().toISOString()
    });

    localStorage.setItem('pendingProducts', JSON.stringify(savedProducts));

    console.log('Product saved locally:', productData);
}

/**
 * Show success message
 */
function showSuccess() {
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.add('show');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Hide after 5 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 5000);
}

// Make removeImage available globally
window.removeImage = removeImage;
