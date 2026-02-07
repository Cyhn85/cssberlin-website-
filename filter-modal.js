/**
 * SMART FILTER MODAL LOGIC
 * Handles universal size chart and filtering options with Category Tabs.
 */

class SmartFilter {
    constructor() {
        this.currentCategory = 'clothing'; // default
        this.sizeData = {
            clothing: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
            shoes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
            pants: ['W28', 'W29', 'W30', 'W31', 'W32', 'W33', 'W34', 'W36', 'W38']
        };
        this.init();
    }

    init() {
        this.createModal();
        this.attachEvents();
    }

    createModal() {
        if (document.getElementById('smartFilterModal')) return;

        const html = `
            <div class="smart-filter-overlay" id="sfOverlay"></div>
            <div class="smart-filter-modal" id="smartFilterModal">
                <div class="sf-header">
                    <div class="sf-title">Smarte Filter</div>
                    <button class="sf-close" id="sfClose">&times;</button>
                </div>
                <div class="sf-body">
                    
                    <!-- Tabs for Size Category -->
                    <div class="sf-tabs">
                        <button class="sf-tab active" data-cat="clothing">Kleidung</button>
                        <button class="sf-tab" data-cat="shoes">Schuhe</button>
                        <button class="sf-tab" data-cat="pants">Hosen</button>
                    </div>

                    <!-- Universal Size Chart -->
                    <div class="sf-section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                        Größe
                    </div>
                    <div class="sf-size-grid" id="sfSizeGrid">
                        <!-- Populated via JS -->
                    </div>

                    <!-- Colors -->
                    <div class="sf-section-title" style="margin-top: 24px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>
                        Farbe
                    </div>
                    <div class="sf-color-grid">
                        <div class="sf-color-option" style="background:#000;" data-color="black" title="Schwarz"></div>
                        <div class="sf-color-option" style="background:#fff; border-color:#ddd;" data-color="white" title="Weiß"></div>
                        <div class="sf-color-option" style="background:#808080;" data-color="gray" title="Grau"></div>
                        <div class="sf-color-option" style="background:#d32f2f;" data-color="red" title="Rot"></div>
                        <div class="sf-color-option" style="background:#1976d2;" data-color="blue" title="Blau"></div>
                        <div class="sf-color-option" style="background:#388e3c;" data-color="green" title="Grün"></div>
                        <div class="sf-color-option" style="background:#fbc02d;" data-color="yellow" title="Gelb"></div>
                        <div class="sf-color-option" style="background:#7b1fa2;" data-color="purple" title="Lila"></div>
                        <div class="sf-color-option" style="background:#FF8C42;" data-color="orange" title="Orange"></div>
                        <div class="sf-color-option" style="background:#A52A2A;" data-color="brown" title="Braun"></div>
                        <div class="sf-color-option" style="background:#F5F5DC; border-color:#e0e0e0;" data-color="beige" title="Beige"></div>
                    </div>

                    <!-- Price Range -->
                    <div class="sf-section-title">Preis</div>
                    <div class="sf-price-wrap">
                        <input type="range" class="sf-range" min="0" max="1000" step="10" value="1000" oninput="document.getElementById('priceVal').innerText = this.value + '€'">
                        <div class="sf-range-labels">
                            <span>0€</span>
                            <span id="priceVal" style="font-weight:bold; color:#2D5016;">1000€</span>
                        </div>
                    </div>
                </div>
                <div class="sf-footer">
                    <button class="sf-btn-clear" id="sfClear">Zurücksetzen</button>
                    <button class="sf-btn-apply" id="sfApply">Anwenden</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
        this.renderSizes();
    }

    renderSizes() {
        const grid = document.getElementById('sfSizeGrid');
        if (!grid) return;

        const sizes = this.sizeData[this.currentCategory];
        grid.innerHTML = sizes.map(size =>
            `<div class="sf-size-option" data-size="${size}">${size}</div>`
        ).join('');

        // Re-attach click events for new elements
        grid.querySelectorAll('.sf-size-option').forEach(opt => {
            opt.addEventListener('click', () => {
                opt.classList.toggle('active');
            });
        });
    }

    attachEvents() {
        const overlay = document.getElementById('sfOverlay');
        const modal = document.getElementById('smartFilterModal');
        const closeBtn = document.getElementById('sfClose');
        const triggerBtns = document.querySelectorAll('.filter-btn-v3');

        // Tab Switching
        document.querySelectorAll('.sf-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.sf-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentCategory = tab.dataset.cat;
                this.renderSizes();
            });
        });

        // Open Logic
        triggerBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                overlay.classList.add('active');
                modal.classList.add('active');
                modal.style.display = 'flex';
            });
        });

        // Close Logic
        const closeFilter = () => {
            overlay.classList.remove('active');
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        };

        closeBtn.addEventListener('click', closeFilter);
        overlay.addEventListener('click', closeFilter);

        // Color Selection
        document.querySelectorAll('.sf-color-option').forEach(opt => {
            opt.addEventListener('click', () => {
                opt.classList.toggle('active');
            });
        });

        // Apply Logic
        document.getElementById('sfApply').addEventListener('click', () => {
            closeFilter();
            if (window.showToast) window.showToast('Filter angewendet!', 'success');
        });

        // Clear Logic
        document.getElementById('sfClear').addEventListener('click', () => {
            document.querySelectorAll('.sf-size-option, .sf-color-option').forEach(el => el.classList.remove('active'));
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SmartFilter();
});
