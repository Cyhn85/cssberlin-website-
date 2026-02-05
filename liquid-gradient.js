/**
 * CSS Berlin - LiquidGradient Social Slider
 * Three.js WebGL animasyonu + Sosyal medya butonları
 * Vanilla JS (React'tan dönüştürüldü)
 * 2026 Modern Design
 */

// ============================================
// SOCIAL MEDIA DATA
// ============================================
const SOCIAL_LINKS = [
    {
        name: 'Instagram',
        url: 'https://www.instagram.com/cssberlin/',
        icon: `<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`
    },
    {
        name: 'TikTok',
        url: 'https://www.tiktok.com/@cssberlin',
        icon: `<svg viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>`
    },
    {
        name: 'YouTube',
        url: 'https://youtube.com/@cssberlin',
        icon: `<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
    },
    {
        name: 'Pinterest',
        url: 'https://pin.it/5K5KV7lDt',
        icon: `<svg viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>`
    },
    {
        name: 'Facebook',
        url: 'https://www.facebook.com/profile.php?id=61587454052774',
        icon: `<svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
    }
];

// ============================================
// TOUCH TEXTURE CLASS
// ============================================
class TouchTexture {
    constructor() {
        this.size = 64;
        this.width = 64;
        this.height = 64;
        this.maxAge = 64;
        this.radius = 0.1;
        this.speed = 1 / 64;
        this.trail = [];
        this.last = null;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.texture = new THREE.Texture(this.canvas);
    }

    update() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.trail.length - 1; i >= 0; i--) {
            const p = this.trail[i];
            const f = p.force * this.speed * (1 - p.age / this.maxAge);
            p.x += p.vx * f;
            p.y += p.vy * f;
            p.age++;

            if (p.age > this.maxAge) {
                this.trail.splice(i, 1);
            } else {
                this.drawPoint(p);
            }
        }
        this.texture.needsUpdate = true;
    }

    addTouch(point) {
        let force = 0, vx = 0, vy = 0;
        if (this.last) {
            const dx = point.x - this.last.x;
            const dy = point.y - this.last.y;
            if (dx === 0 && dy === 0) return;
            const d = Math.sqrt(dx * dx + dy * dy);
            vx = dx / d;
            vy = dy / d;
            force = Math.min((dx * dx + dy * dy) * 20000, 2.0);
        }
        this.last = { x: point.x, y: point.y };
        this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
    }

    drawPoint(p) {
        const pos = { x: p.x * this.width, y: (1 - p.y) * this.height };
        let intensity = p.age < this.maxAge * 0.3
            ? Math.sin((p.age / (this.maxAge * 0.3)) * (Math.PI / 2))
            : -((1 - (p.age - this.maxAge * 0.3) / (this.maxAge * 0.7)) * ((1 - (p.age - this.maxAge * 0.3) / (this.maxAge * 0.7)) - 2));
        intensity *= p.force;

        const color = `${((p.vx + 1) / 2) * 255}, ${((p.vy + 1) / 2) * 255}, ${intensity * 255}`;
        const radius = this.radius * this.width;

        this.ctx.shadowOffsetX = this.size * 5;
        this.ctx.shadowOffsetY = this.size * 5;
        this.ctx.shadowBlur = radius;
        this.ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;
        this.ctx.beginPath();
        this.ctx.fillStyle = 'rgba(255,0,0,1)';
        this.ctx.arc(pos.x - this.size * 5, pos.y - this.size * 5, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

// ============================================
// GRADIENT BACKGROUND CLASS
// ============================================
class GradientBackground {
    constructor(sceneManager) {
        this.mesh = null;
        this.sceneManager = sceneManager;
        this.isPaused = false;

        this.uniforms = {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uColor1: { value: new THREE.Vector3(0.945, 0.353, 0.133) }, // Orange
            uColor2: { value: new THREE.Vector3(0.039, 0.055, 0.153) }, // Dark Navy
            uColor3: { value: new THREE.Vector3(0.945, 0.353, 0.133) },
            uColor4: { value: new THREE.Vector3(0.039, 0.055, 0.153) },
            uColor5: { value: new THREE.Vector3(0.176, 0.314, 0.086) }, // CSS Berlin Green
            uColor6: { value: new THREE.Vector3(0.039, 0.055, 0.153) },
            uSpeed: { value: 1.2 },
            uIntensity: { value: 1.8 },
            uTouchTexture: { value: null },
            uGrainIntensity: { value: 0.08 },
            uDarkNavy: { value: new THREE.Vector3(0.039, 0.055, 0.153) },
            uGradientSize: { value: 0.45 },
            uGradientCount: { value: 12.0 },
            uColor1Weight: { value: 0.5 },
            uColor2Weight: { value: 1.8 }
        };
    }

    init() {
        const viewSize = this.sceneManager.getViewSize();
        const geometry = new THREE.PlaneGeometry(viewSize.width, viewSize.height, 1, 1);

        const vertexShader = `
            varying vec2 vUv;
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                vUv = uv;
            }
        `;

        const fragmentShader = `
            uniform float uTime, uSpeed, uIntensity, uGrainIntensity, uGradientSize, uGradientCount, uColor1Weight, uColor2Weight;
            uniform vec2 uResolution;
            uniform vec3 uColor1, uColor2, uColor3, uColor4, uColor5, uColor6, uDarkNavy;
            uniform sampler2D uTouchTexture;
            varying vec2 vUv;
            
            float grain(vec2 uv, float t) {
                return fract(sin(dot(uv * uResolution * 0.5 + t, vec2(12.9898, 78.233))) * 43758.5453) * 2.0 - 1.0;
            }
            
            vec3 getGradientColor(vec2 uv, float time) {
                vec2 c1 = vec2(0.5 + sin(time * uSpeed * 0.4) * 0.4, 0.5 + cos(time * uSpeed * 0.5) * 0.4);
                vec2 c2 = vec2(0.5 + cos(time * uSpeed * 0.6) * 0.5, 0.5 + sin(time * uSpeed * 0.45) * 0.5);
                vec2 c3 = vec2(0.5 + sin(time * uSpeed * 0.35) * 0.45, 0.5 + cos(time * uSpeed * 0.55) * 0.45);
                vec2 c4 = vec2(0.5 + cos(time * uSpeed * 0.5) * 0.4, 0.5 + sin(time * uSpeed * 0.4) * 0.4);
                vec2 c5 = vec2(0.5 + sin(time * uSpeed * 0.7) * 0.35, 0.5 + cos(time * uSpeed * 0.6) * 0.35);
                vec2 c6 = vec2(0.5 + cos(time * uSpeed * 0.45) * 0.5, 0.5 + sin(time * uSpeed * 0.65) * 0.5);
                
                float i1 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c1));
                float i2 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c2));
                float i3 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c3));
                float i4 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c4));
                float i5 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c5));
                float i6 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c6));
                
                vec3 color = vec3(0.0);
                color += uColor1 * i1 * (0.55 + 0.45 * sin(time * uSpeed)) * uColor1Weight;
                color += uColor2 * i2 * (0.55 + 0.45 * cos(time * uSpeed * 1.2)) * uColor2Weight;
                color += uColor3 * i3 * (0.55 + 0.45 * sin(time * uSpeed * 0.8)) * uColor1Weight;
                color += uColor4 * i4 * (0.55 + 0.45 * cos(time * uSpeed * 1.3)) * uColor2Weight;
                color += uColor5 * i5 * (0.55 + 0.45 * sin(time * uSpeed * 1.1)) * uColor1Weight;
                color += uColor6 * i6 * (0.55 + 0.45 * cos(time * uSpeed * 0.9)) * uColor2Weight;
                
                color = clamp(color, vec3(0.0), vec3(1.0)) * uIntensity;
                float lum = dot(color, vec3(0.299, 0.587, 0.114));
                color = mix(vec3(lum), color, 1.35);
                color = pow(color, vec3(0.92));
                float brightness = length(color);
                color = mix(uDarkNavy, color, max(brightness * 1.2, 0.15));
                return color;
            }
            
            void main() {
                vec2 uv = vUv;
                vec4 touchTex = texture2D(uTouchTexture, uv);
                uv.x -= (touchTex.r * 2.0 - 1.0) * 0.8 * touchTex.b;
                uv.y -= (touchTex.g * 2.0 - 1.0) * 0.8 * touchTex.b;
                vec2 center = vec2(0.5);
                float dist = length(uv - center);
                float ripple = sin(dist * 20.0 - uTime * 3.0) * 0.04 * touchTex.b;
                uv += vec2(ripple);
                vec3 color = getGradientColor(uv, uTime);
                color += grain(uv, uTime) * uGrainIntensity;
                color = clamp(color, vec3(0.0), vec3(1.0));
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader,
            fragmentShader
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.sceneManager.scene.add(this.mesh);
    }

    update(delta) {
        if (!this.isPaused) {
            this.uniforms.uTime.value += delta;
        }
    }

    onResize(w, h) {
        const viewSize = this.sceneManager.getViewSize();
        if (this.mesh) {
            this.mesh.geometry.dispose();
            this.mesh.geometry = new THREE.PlaneGeometry(viewSize.width, viewSize.height, 1, 1);
        }
        this.uniforms.uResolution.value.set(w, h);
    }
}

// ============================================
// MAIN APP CLASS
// ============================================
class LiquidGradientApp {
    constructor(container) {
        this.container = container;
        this.animationId = null;

        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 10000);
        this.camera.position.z = 50;

        // Setup scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0e27);

        // Clock
        this.clock = new THREE.Clock();

        // Touch texture
        this.touchTexture = new TouchTexture();

        // Gradient background
        this.gradientBackground = new GradientBackground(this);
        this.gradientBackground.uniforms.uTouchTexture.value = this.touchTexture.texture;

        this.init();
    }

    getViewSize() {
        const fov = (this.camera.fov * Math.PI) / 180;
        const height = Math.abs(this.camera.position.z * Math.tan(fov / 2) * 2);
        return { width: height * this.camera.aspect, height };
    }

    init() {
        this.gradientBackground.init();

        const c = this.container;

        // Mouse move handler
        const onMove = (x, y) => {
            this.touchTexture.addTouch({ x: x / c.clientWidth, y: 1 - y / c.clientHeight });
        };

        c.addEventListener('mousemove', (e) => {
            const rect = c.getBoundingClientRect();
            onMove(e.clientX - rect.left, e.clientY - rect.top);
        });

        c.addEventListener('touchmove', (e) => {
            const rect = c.getBoundingClientRect();
            onMove(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
        });

        // Resize handler
        window.addEventListener('resize', () => {
            this.camera.aspect = c.clientWidth / c.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(c.clientWidth, c.clientHeight);
            this.gradientBackground.onResize(c.clientWidth, c.clientHeight);
        });

        this.tick();
    }

    tick() {
        const delta = Math.min(this.clock.getDelta(), 0.1);
        this.touchTexture.update();
        this.gradientBackground.update(delta);
        this.renderer.render(this.scene, this.camera);
        this.animationId = requestAnimationFrame(() => this.tick());
    }

    cleanup() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.renderer.dispose();
        if (this.container && this.renderer.domElement && this.container.contains(this.renderer.domElement)) {
            this.container.removeChild(this.renderer.domElement);
        }
    }

    setPaused(paused) {
        this.gradientBackground.isPaused = paused;
    }
}

// ============================================
// INITIALIZE SOCIAL HUB - V2 REDESIGN
// ============================================
function initSocialHubLiquid() {
    const container = document.getElementById('socialHubContainer');
    if (!container) return;

    // Create HTML structure - V2 with intro screen and email
    container.innerHTML = `
        <div class="liquid-gradient-container">
            <div class="liquid-gradient-canvas" id="liquidGradientCanvas"></div>
            
            <!-- Intro Screen - Click to reveal social links -->
            <div class="social-intro-screen" id="socialIntroScreen">
                <div class="intro-content">
                    <span class="intro-badge">Social Hub</span>
                    <h2 class="intro-headline">Folgen Sie uns<br>in sozialen Medien</h2>
                    <p class="intro-subtext">Entdecken Sie nachhaltige Mode-Inspiration</p>
                    <button class="intro-cta-btn" id="showSocialLinks">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                        Profile anzeigen
                    </button>
                </div>
            </div>

            <!-- Social Links Screen -->
            <div class="social-media-overlay" id="socialLinksScreen" style="display:none;">
                <button class="back-btn" id="backToIntro">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </button>
                
                <span class="social-hub-title">Social Hub</span>
                <h2 class="social-hub-headline">Unsere Profile</h2>
                
                <!-- Symmetric 2x3 Grid -->
                <div class="social-buttons-grid-v2">
                    ${SOCIAL_LINKS.map(link => `
                        <a href="${link.url}" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           class="social-btn-v2 ${link.name.toLowerCase()}"
                           title="${link.name} folgen">
                            <span class="social-btn-icon-v2">${link.icon}</span>
                            <span class="social-btn-name-v2">${link.name}</span>
                        </a>
                    `).join('')}
                </div>
                
                <!-- Email Contact Button -->
                <a href="mailto:info@cssberlin.de" class="email-contact-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                        <path d="M22 6l-10 7L2 6"/>
                    </svg>
                    <div class="email-info">
                        <span class="email-label">Kontaktieren Sie uns</span>
                        <span class="email-address">info@cssberlin.de</span>
                    </div>
                </a>
            </div>
        </div>
    `;

    // Event Listeners for intro/links toggle
    const introScreen = document.getElementById('socialIntroScreen');
    const linksScreen = document.getElementById('socialLinksScreen');
    const showBtn = document.getElementById('showSocialLinks');
    const backBtn = document.getElementById('backToIntro');

    if (showBtn) {
        showBtn.addEventListener('click', () => {
            introScreen.style.display = 'none';
            linksScreen.style.display = 'flex';
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            linksScreen.style.display = 'none';
            introScreen.style.display = 'flex';
        });
    }

    // Initialize Three.js if available
    const canvasContainer = document.getElementById('liquidGradientCanvas');
    if (canvasContainer && typeof THREE !== 'undefined') {
        try {
            new LiquidGradientApp(canvasContainer);
        } catch (e) {
            console.warn('[LiquidGradient] WebGL not available, using fallback gradient');
            canvasContainer.style.background = 'linear-gradient(135deg, #0a0e27 0%, #FF8C42 50%, #2D5016 100%)';
        }
    } else if (canvasContainer) {
        // Fallback gradient if Three.js not loaded
        canvasContainer.style.background = 'linear-gradient(135deg, #0a0e27 0%, #FF8C42 50%, #2D5016 100%)';
    }
}

// Auto-init when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSocialHubLiquid);
} else {
    initSocialHubLiquid();
}

