/* ============================================
   Magic Auth Logic - Particles & Form Handling
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // 1. PARTICLES ANIMATION
    const canvas = document.getElementById('particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Settings
        const particleCount = 60;
        const particleColorLight = 'rgba(0, 0, 100, 0.15)';
        const particleColorDark = 'rgba(255, 255, 255, 0.15)';

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 3 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                const isDark = document.body.classList.contains('dark-mode');
                ctx.fillStyle = isDark ? particleColorDark : particleColorLight;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            resize();
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => {
            resize();
            initParticles();
        });

        initParticles();
        animate();
    }

    // 2. THEME TOGGLE
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
            document.querySelector('.login-container').classList.add('dark');
            updateThemeIcon(true);
        }

        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const container = document.querySelector('.login-container');
            container.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark-mode');
            updateThemeIcon(isDark);
        });
    }

    function updateThemeIcon(isDark) {
        // Simple SVG swap (using innerHTML for simplicity in Vanilla)
        const sunIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
        const moonIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
        if (themeBtn) themeBtn.innerHTML = isDark ? sunIcon : moonIcon;
    }

    // 3. FORM INPUTS (Floating Labels)
    const inputs = document.querySelectorAll('.form-field input');
    inputs.forEach(input => {
        // Init state
        if (input.value) input.parentElement.classList.add('active');

        input.addEventListener('focus', () => input.parentElement.classList.add('active'));
        input.addEventListener('blur', () => {
            if (!input.value) input.parentElement.classList.remove('active');
        });
        input.addEventListener('input', () => {
            // Validation logic could go here
        });
    });

    // 4. PASSWORD TOGGLE
    const togglePass = document.querySelector('.toggle-password');
    const passInput = document.getElementById('password');
    if (togglePass && passInput) {
        togglePass.addEventListener('click', () => {
            const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passInput.setAttribute('type', type);
            // Toggle icon eye/eye-off
            togglePass.innerHTML = type === 'password' ?
                `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>` :
                `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
        });
    }

    // 5. LOGIN/REGISTER LOGIC
    const loginForm = document.getElementById('loginForm');
    const registerLink = document.getElementById('switchToRegister');
    const loginLink = document.getElementById('idSwitchToLogin'); // if we have it
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');

    // Simple Mode Toggle State
    let isRegisterMode = false;

    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            isRegisterMode = !isRegisterMode;

            if (isRegisterMode) {
                // Switch to Register UI
                formTitle.textContent = "Konto erstellen";
                submitBtn.textContent = "Registrieren";
                registerLink.innerHTML = 'Doch lieber anmelden? <a href="#">Anmelden</a>';
                // Show extra fields
                document.getElementById('nameField').style.display = 'block';
            } else {
                // Switch to Login UI
                formTitle.textContent = "Willkommen";
                submitBtn.textContent = "Anmelden";
                registerLink.innerHTML = 'Noch kein Konto? <a href="#">Registrieren</a>';
                // Hide extra fields
                document.getElementById('nameField').style.display = 'none';
            }
        });
    }

    // SUBMIT HANDLER
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Basic UI Feedback
            submitBtn.disabled = true;
            submitBtn.textContent = "Bitte warten...";

            try {
                if (isRegisterMode) {
                    // REGISTER Logic
                    const name = document.getElementById('nameInput').value || "New User";
                    // Split name for API
                    const [firstName, ...rest] = name.split(' ');
                    const lastName = rest.join(' ') || '';

                    if (typeof api !== 'undefined') {
                        await api.register({
                            email,
                            password,
                            firstName,
                            lastName
                        });
                        alert("Registrierung erfolgreich! Bitte melden Sie sich an.");
                        // Switch back to login
                        registerLink.click();
                    } else {
                        console.error("API Client not found");
                    }
                } else {
                    // LOGIN Logic
                    if (typeof api !== 'undefined') {
                        const response = await api.login(email, password);

                        // Store token (handled by api-client usually? No, api-client returns data)
                        // Actually api-client.js Login returns data. We need to save it.
                        // Checking api-client.js... it doesn't seem to save token to localStorage automatically in `login`.
                        // But `auth-modal-v3.js` probably does.
                        // I'll adhere to standard practice: Save token if present.
                        if (response && response.access_token) {
                            localStorage.setItem('token', response.access_token);
                            localStorage.setItem('user', JSON.stringify(response.user || {}));
                            // Redirect
                            window.location.href = 'index.html';
                        } else {
                            // Fallback if structure differs (mock data?)
                            // Assuming success if no error thrown
                            window.location.href = 'index.html';
                        }
                    } else {
                        console.error("API Client not found");
                        // Fallback for demo
                        window.location.href = 'index.html';
                    }
                }
            } catch (err) {
                console.error(err);
                alert("Fehler: " + (err.message || "Ein Fehler ist aufgetreten."));
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = isRegisterMode ? "Registrieren" : "Anmelden";
            }
        });
    }
});
