/**
 * CSS Berlin - Success Animations
 * El Sikisma + CO2 Yapraklar Animasyonu
 * Teklif kabul ve randevu odemesi icin
 */

const SuccessAnimations = {
    // Canvas confetti benzeri yaprak sistemi
    leaves: [],
    canvas: null,
    ctx: null,
    animationId: null,

    /**
     * Ana basari efekti - El sikisma + CO2 yapraklar
     * @param {Object} options - { co2Amount: 0.5, message: 'CO2 Tasarrufu!' }
     */
    success_fx(options = {}) {
        const co2Amount = options.co2Amount || 0.5;
        const message = options.message || `+${co2Amount}kg CO2 Saved`;

        // 1. El sikisma animasyonu
        this.showHandshake();

        // 2. 800ms sonra yapraklar baslasin
        setTimeout(() => {
            this.startLeaves(message);
        }, 800);

        // 3. Overlay kapat (3.5 saniye sonra)
        setTimeout(() => {
            this.cleanup();
        }, 4500);
    },

    /**
     * El sikisma ikonu goster
     */
    showHandshake() {
        // Overlay olustur
        const overlay = document.createElement('div');
        overlay.id = 'success-overlay';
        overlay.innerHTML = `
            <div class="handshake-container">
                <div class="handshake-icon">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#2D5016" stroke-width="1.5">
                        <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                        <path d="M12 5.36V12"></path>
                        <path d="M12 12l4.5-4.5"></path>
                        <path d="M12 12l-4.5-4.5"></path>
                    </svg>
                    <div class="handshake-hands">
                        <svg class="hand-left" width="80" height="80" viewBox="0 0 64 64">
                            <path fill="#FFB347" d="M8 32c0-4 3-8 8-8h12l8-8c2-2 6-2 8 0l4 4c2 2 2 6 0 8l-8 8v12c0 4-3 8-8 8H20c-4 0-8-3-8-8V32z"/>
                            <path fill="#FFCC80" d="M16 28h8v20h-8z"/>
                        </svg>
                        <svg class="hand-right" width="80" height="80" viewBox="0 0 64 64">
                            <path fill="#FFB347" d="M56 32c0-4-3-8-8-8H36l-8-8c-2-2-6-2-8 0l-4 4c-2 2-2 6 0 8l8 8v12c0 4 3 8 8 8h12c4 0 8-3 8-8V32z"/>
                            <path fill="#FFCC80" d="M40 28h8v20h-8z"/>
                        </svg>
                    </div>
                </div>
                <div class="success-text">Deal!</div>
            </div>
        `;

        // CSS ekle
        const style = document.createElement('style');
        style.id = 'success-animation-styles';
        style.textContent = `
            #success-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .handshake-container {
                text-align: center;
            }

            .handshake-icon {
                position: relative;
                width: 200px;
                height: 200px;
                margin: 0 auto 20px;
            }

            .handshake-icon > svg {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                animation: heartPulse 0.6s ease-in-out infinite alternate;
            }

            @keyframes heartPulse {
                from { transform: translate(-50%, -50%) scale(1); }
                to { transform: translate(-50%, -50%) scale(1.1); }
            }

            .handshake-hands {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 160px;
                height: 80px;
            }

            .hand-left {
                position: absolute;
                left: -20px;
                animation: handLeft 0.5s ease forwards;
            }

            .hand-right {
                position: absolute;
                right: -20px;
                animation: handRight 0.5s ease forwards;
            }

            @keyframes handLeft {
                from { transform: translateX(-40px) rotate(-15deg); opacity: 0; }
                to { transform: translateX(0) rotate(0); opacity: 1; }
            }

            @keyframes handRight {
                from { transform: translateX(40px) rotate(15deg); opacity: 0; }
                to { transform: translateX(0) rotate(0); opacity: 1; }
            }

            .success-text {
                font-size: 36px;
                font-weight: 800;
                color: #2D5016;
                animation: bounceIn 0.5s ease 0.3s both;
            }

            @keyframes bounceIn {
                0% { transform: scale(0); opacity: 0; }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); opacity: 1; }
            }

            #leaves-canvas {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 10001;
            }

            .co2-bubble {
                position: fixed;
                padding: 12px 20px;
                background: linear-gradient(135deg, #2D5016 0%, #4a8025 100%);
                color: white;
                font-size: 18px;
                font-weight: 700;
                border-radius: 30px;
                box-shadow: 0 4px 20px rgba(45, 80, 22, 0.4);
                z-index: 10002;
                animation: floatUp 3s ease-out forwards;
                white-space: nowrap;
            }

            .co2-bubble::before {
                content: '';
                margin-right: 8px;
            }

            @keyframes floatUp {
                0% {
                    opacity: 0;
                    transform: translateY(50px) scale(0.5);
                }
                20% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                80% {
                    opacity: 1;
                    transform: translateY(-100px) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-200px) scale(0.8);
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(overlay);
    },

    /**
     * Yaprak animasyonu baslat
     */
    startLeaves(message) {
        // Canvas olustur
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'leaves-canvas';
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // Yapraklar olustur
        this.leaves = [];
        const leafCount = 30;

        for (let i = 0; i < leafCount; i++) {
            this.leaves.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height + Math.random() * 100,
                size: 15 + Math.random() * 20,
                speedY: 1 + Math.random() * 2,
                speedX: (Math.random() - 0.5) * 2,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 5,
                color: this.getLeafColor()
            });
        }

        // Animasyon baslat
        this.animateLeaves();

        // CO2 bubble'lar ekle
        this.showCO2Bubbles(message);
    },

    /**
     * Yaprak rengi al
     */
    getLeafColor() {
        const colors = [
            '#2D5016', // Koyu yesil
            '#4a8025', // Orta yesil
            '#6BAF3D', // Acik yesil
            '#7CB342', // Lime yesil
            '#8BC34A', // Parlak yesil
            '#9CCC65', // Soft yesil
            '#AED581'  // Pastel yesil
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    /**
     * Yaprak ciz
     */
    drawLeaf(leaf) {
        this.ctx.save();
        this.ctx.translate(leaf.x, leaf.y);
        this.ctx.rotate((leaf.rotation * Math.PI) / 180);

        // Yaprak sekli
        this.ctx.beginPath();
        this.ctx.moveTo(0, -leaf.size / 2);
        this.ctx.bezierCurveTo(
            leaf.size / 2, -leaf.size / 4,
            leaf.size / 2, leaf.size / 4,
            0, leaf.size / 2
        );
        this.ctx.bezierCurveTo(
            -leaf.size / 2, leaf.size / 4,
            -leaf.size / 2, -leaf.size / 4,
            0, -leaf.size / 2
        );

        this.ctx.fillStyle = leaf.color;
        this.ctx.fill();

        // Yaprak damari
        this.ctx.beginPath();
        this.ctx.moveTo(0, -leaf.size / 2);
        this.ctx.lineTo(0, leaf.size / 2);
        this.ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        this.ctx.restore();
    },

    /**
     * Yaprak animasyonu
     */
    animateLeaves() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let activeLeaves = 0;

        this.leaves.forEach(leaf => {
            leaf.y -= leaf.speedY;
            leaf.x += leaf.speedX;
            leaf.rotation += leaf.rotationSpeed;

            // Ekranda mi kontrol et
            if (leaf.y > -50) {
                this.drawLeaf(leaf);
                activeLeaves++;
            }
        });

        // Hala yaprak varsa devam et
        if (activeLeaves > 0) {
            this.animationId = requestAnimationFrame(() => this.animateLeaves());
        }
    },

    /**
     * CO2 bubble'lari goster
     */
    showCO2Bubbles(message) {
        const bubbleCount = 5;
        const positions = [
            { left: '10%', bottom: '20%' },
            { left: '25%', bottom: '30%' },
            { left: '50%', bottom: '25%' },
            { left: '70%', bottom: '35%' },
            { left: '85%', bottom: '20%' }
        ];

        positions.forEach((pos, i) => {
            setTimeout(() => {
                const bubble = document.createElement('div');
                bubble.className = 'co2-bubble';
                bubble.textContent = message;
                bubble.style.left = pos.left;
                bubble.style.bottom = pos.bottom;
                document.body.appendChild(bubble);

                // 3 saniye sonra kaldir
                setTimeout(() => {
                    if (bubble.parentNode) {
                        bubble.remove();
                    }
                }, 3000);
            }, i * 200);
        });
    },

    /**
     * Temizlik
     */
    cleanup() {
        // Animasyonu durdur
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        // Overlay'i fade out ile kaldir
        const overlay = document.getElementById('success-overlay');
        if (overlay) {
            overlay.style.animation = 'fadeOut 0.5s ease forwards';
            setTimeout(() => overlay.remove(), 500);
        }

        // Canvas'i kaldir
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.remove();
        }

        // Stilleri kaldir
        const style = document.getElementById('success-animation-styles');
        if (style) {
            style.remove();
        }

        // CO2 bubble'lari kaldir
        document.querySelectorAll('.co2-bubble').forEach(b => b.remove());

        // Degiskenleri sifirla
        this.leaves = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;

        // FadeOut animasyonu ekle
        const fadeOutStyle = document.createElement('style');
        fadeOutStyle.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(fadeOutStyle);
        setTimeout(() => fadeOutStyle.remove(), 1000);
    }
};

// Global erisim icin
window.SuccessAnimations = SuccessAnimations;
window.success_fx = (options) => SuccessAnimations.success_fx(options);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SuccessAnimations;
}
