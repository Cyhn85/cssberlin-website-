/**
 * CSS Berlin - Hero Campaign Slider
 * Sağ panel: Animasyonlu Almanca reklam slider'ı
 * Multi-image carousel + çoklu konu başlıkları
 * 2026 Modern Design
 */

// ============================================
// CAMPAIGN SLIDES DATA (German Advertising)
// ============================================
const CAMPAIGN_SLIDES = [
    {
        id: 1,
        category: 'Nachhaltigkeit',
        title: 'Second Hand<br>Second Chance',
        subtitle: 'Geben Sie Mode ein zweites Leben',
        description: 'Jedes Kleidungsstück verdient eine zweite Chance. Entdecken Sie unsere nachhaltige Kollektion.',
        cta: 'Jetzt entdecken',
        link: '/nachhaltigkeit',
        gradient: 'linear-gradient(135deg, #2D5016 0%, #4a8f29 100%)',
        images: [
            'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800',
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'
        ],
        icon: '🌱'
    },
    {
        id: 2,
        category: 'Sale',
        title: 'Bis zu<br>70% Rabatt',
        subtitle: 'Premium Marken zum kleinen Preis',
        description: 'Designer-Mode, Streetwear und Vintage – alles drastisch reduziert.',
        cta: 'Zum Sale',
        link: '/sale',
        gradient: 'linear-gradient(135deg, #FF8C42 0%, #e65c00 100%)',
        images: [
            'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'
        ],
        icon: '🔥'
    },
    {
        id: 3,
        category: 'CO₂-Initiative',
        title: '248 Tonnen<br>CO₂ gespart',
        subtitle: 'Gemeinsam für den Planeten',
        description: 'Mit jedem Kauf tragen Sie zum Klimaschutz bei. Sehen Sie Ihren Impact.',
        cta: 'Mehr erfahren',
        link: '/co2-impact',
        gradient: 'linear-gradient(135deg, #1a5f7a 0%, #3ec6e0 100%)',
        images: [
            'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
            'https://images.unsplash.com/photo-1569163139599-0f4517e36f31?w=800'
        ],
        icon: '🌍'
    },
    {
        id: 4,
        category: 'Neu',
        title: 'Winter<br>Kollektion',
        subtitle: 'Wärme trifft Stil',
        description: 'Entdecken Sie kuratierte Wintermode – von Mänteln bis Accessoires.',
        cta: 'Kollektion ansehen',
        link: '/winter',
        gradient: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
        images: [
            'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800',
            'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800'
        ],
        icon: '❄️'
    },
    {
        id: 5,
        category: 'Aktion',
        title: '3. Artikel<br>Versand GRATIS',
        subtitle: 'Nur noch diese Woche',
        description: 'Kaufen Sie 2 Produkte und der Versand für das 3. ist kostenlos.',
        cta: 'Jetzt shoppen',
        link: '/aktion',
        gradient: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCAF45 100%)',
        images: [
            'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
        ],
        icon: '📦'
    }
];

// ============================================
// HERO SLIDER CLASS
// ============================================
class HeroCampaignSlider {
    constructor(container) {
        this.container = container;
        this.slides = CAMPAIGN_SLIDES;
        this.currentSlide = 0;
        this.currentImageIndex = 0;
        this.autoplayInterval = null;
        this.imageInterval = null;
        this.init();
    }

    init() {
        this.render();
        this.startAutoplay();
    }

    render() {
        const slide = this.slides[this.currentSlide];

        this.container.innerHTML = `
            <div class="hero-campaign-slider" style="background: ${slide.gradient};">
                <!-- Background Images Carousel -->
                <div class="hero-bg-carousel">
                    ${slide.images.map((img, i) => `
                        <div class="hero-bg-image ${i === 0 ? 'active' : ''}" style="background-image: url('${img}');"></div>
                    `).join('')}
                </div>
                
                <!-- Overlay -->
                <div class="hero-overlay"></div>
                
                <!-- Content -->
                <div class="hero-content">
                    <div class="hero-category">
                        <span class="hero-icon">${slide.icon}</span>
                        <span class="hero-category-text">${slide.category}</span>
                    </div>
                    
                    <h2 class="hero-title">${slide.title}</h2>
                    <p class="hero-subtitle">${slide.subtitle}</p>
                    <p class="hero-description">${slide.description}</p>
                    
                    <a href="${slide.link}" class="hero-cta-btn">
                        ${slide.cta}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </a>
                </div>
                
                <!-- Navigation Dots -->
                <div class="hero-nav-dots">
                    ${this.slides.map((_, i) => `
                        <button class="hero-dot ${i === this.currentSlide ? 'active' : ''}" data-slide="${i}"></button>
                    `).join('')}
                </div>
                
                <!-- Navigation Arrows -->
                <button class="hero-nav-arrow prev" aria-label="Vorherige">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </button>
                <button class="hero-nav-arrow next" aria-label="Nächste">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </button>
            </div>
        `;

        this.attachEventListeners();
        this.startImageCarousel();
    }

    attachEventListeners() {
        // Dots navigation
        this.container.querySelectorAll('.hero-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                this.goToSlide(parseInt(dot.dataset.slide));
            });
        });

        // Arrow navigation
        this.container.querySelector('.hero-nav-arrow.prev')?.addEventListener('click', () => {
            this.prevSlide();
        });

        this.container.querySelector('.hero-nav-arrow.next')?.addEventListener('click', () => {
            this.nextSlide();
        });

        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }

    startImageCarousel() {
        const images = this.container.querySelectorAll('.hero-bg-image');
        if (images.length <= 1) return;

        // Clear existing interval
        if (this.imageInterval) clearInterval(this.imageInterval);

        let currentImg = 0;
        this.imageInterval = setInterval(() => {
            images.forEach(img => img.classList.remove('active'));
            currentImg = (currentImg + 1) % images.length;
            images[currentImg].classList.add('active');
        }, 3000);
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.render();
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.render();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.render();
    }

    startAutoplay() {
        if (this.autoplayInterval) clearInterval(this.autoplayInterval);
        this.autoplayInterval = setInterval(() => this.nextSlide(), 6000);
    }

    pauseAutoplay() {
        if (this.autoplayInterval) clearInterval(this.autoplayInterval);
    }

    destroy() {
        this.pauseAutoplay();
        if (this.imageInterval) clearInterval(this.imageInterval);
    }
}

// ============================================
// INITIALIZE HERO SLIDER
// ============================================
function initHeroSlider() {
    const container = document.getElementById('heroSliderContainer');
    if (!container) return;

    new HeroCampaignSlider(container);
}

// Auto-init when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroSlider);
} else {
    initHeroSlider();
}
