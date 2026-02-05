/**
 * CSS Berlin - Seller Hover Card
 * Ürün sayfalarındaki satıcı künyesi için animasyonlu hover kart
 * Vanilla JS versiyonu (React bileşeninden dönüştürüldü)
 * 2026 Modern Design
 */

// ============================================
// SELLER HOVER CARD CLASS
// ============================================
class SellerHoverCard {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            imageSrc: options.imageSrc || '',
            imageAlt: options.imageAlt || 'Verkäufer',
            name: options.name || 'Verkäufer',
            username: options.username || '',
            description: options.description || '',
            rating: options.rating || 0,
            totalSales: options.totalSales || 0,
            verified: options.verified || false,
            badge: options.badge || '',
            location: options.location || 'Berlin',
            buttonText: options.buttonText || 'Profil anzeigen',
            onButtonClick: options.onButtonClick || (() => { }),
            size: options.size || 'md',
            variant: options.variant || 'glass'
        };

        this.isHovered = false;
        this.init();
    }

    getInitials(name) {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    getSizeClasses() {
        const sizes = {
            sm: { avatar: 'w-12 h-12', card: 'w-56' },
            md: { avatar: 'w-16 h-16', card: 'w-72' },
            lg: { avatar: 'w-20 h-20', card: 'w-80' }
        };
        return sizes[this.options.size] || sizes.md;
    }

    init() {
        this.render();
        this.attachEvents();
    }

    render() {
        const { imageSrc, name, verified, badge } = this.options;
        const initials = this.getInitials(name);

        this.element.innerHTML = `
            <div class="seller-hover-card" data-variant="${this.options.variant}">
                <!-- Collapsed State: Avatar Only -->
                <div class="seller-avatar-wrapper">
                    <div class="seller-avatar">
                        ${imageSrc
                ? `<img src="${imageSrc}" alt="${name}" class="seller-avatar-img" />`
                : `<span class="seller-avatar-fallback">${initials}</span>`
            }
                    </div>
                    ${verified ? '<span class="seller-verified-badge">✓</span>' : ''}
                    ${badge ? `<span class="seller-tier-badge">${this.getBadgeIcon(badge)}</span>` : ''}
                </div>

                <!-- Expanded Card (hidden by default) -->
                <div class="seller-expanded-card">
                    <div class="seller-card-header">
                        <div class="seller-card-avatar">
                            ${imageSrc
                ? `<img src="${imageSrc}" alt="${name}" />`
                : `<span class="seller-avatar-fallback">${initials}</span>`
            }
                        </div>
                        ${verified ? '<span class="seller-verified-badge large">✓</span>' : ''}
                    </div>
                    
                    <div class="seller-card-content">
                        <h3 class="seller-name">${name}</h3>
                        ${this.options.username ? `<p class="seller-username">@${this.options.username}</p>` : ''}
                        
                        <div class="seller-stats">
                            <div class="seller-stat">
                                <span class="stat-value">${this.options.rating.toFixed(1)}</span>
                                <span class="stat-label">⭐ Bewertung</span>
                            </div>
                            <div class="seller-stat">
                                <span class="stat-value">${this.options.totalSales}</span>
                                <span class="stat-label">Verkäufe</span>
                            </div>
                            <div class="seller-stat">
                                <span class="stat-value">📍</span>
                                <span class="stat-label">${this.options.location}</span>
                            </div>
                        </div>
                        
                        ${this.options.description ? `<p class="seller-description">${this.options.description}</p>` : ''}
                        
                        <div class="seller-card-buttons">
                            <button class="seller-btn primary" data-action="profile">
                                ${this.options.buttonText}
                            </button>
                            <button class="seller-btn secondary" data-action="message">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                </svg>
                                Nachricht
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getBadgeIcon(badge) {
        const badges = {
            'champion': '🏆',
            'pro': '⭐',
            'verified': '✓',
            'eco': '🌱',
            'top': '🔝'
        };
        return badges[badge] || '';
    }

    attachEvents() {
        const card = this.element.querySelector('.seller-hover-card');
        const expandedCard = this.element.querySelector('.seller-expanded-card');

        // Mouse enter - expand card
        card.addEventListener('mouseenter', () => {
            this.isHovered = true;
            expandedCard.classList.add('visible');
            card.classList.add('expanded');
        });

        // Mouse leave - collapse card
        card.addEventListener('mouseleave', () => {
            this.isHovered = false;
            expandedCard.classList.remove('visible');
            card.classList.remove('expanded');
        });

        // Button clicks
        this.element.querySelectorAll('.seller-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                if (action === 'profile') {
                    this.options.onButtonClick();
                } else if (action === 'message') {
                    // Open message modal or navigate
                    console.log('Message seller:', this.options.name);
                }
            });
        });
    }
}

// ============================================
// UTILITY: Initialize all seller cards on page
// ============================================
function initSellerHoverCards() {
    document.querySelectorAll('[data-seller-card]').forEach(element => {
        const data = JSON.parse(element.dataset.sellerCard || '{}');
        new SellerHoverCard(element, data);
    });
}

// ============================================
// UTILITY: Create seller card dynamically
// ============================================
function createSellerCard(containerId, options) {
    const container = document.getElementById(containerId);
    if (!container) return null;
    return new SellerHoverCard(container, options);
}

// Auto-init when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSellerHoverCards);
} else {
    initSellerHoverCards();
}

// Export for global use
window.SellerHoverCard = SellerHoverCard;
window.createSellerCard = createSellerCard;
