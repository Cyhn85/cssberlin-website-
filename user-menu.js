/* =============================================
   CUSTOM USER MENU COMPONENT (Vinted-style)
   ============================================= */

const UserMenu = {
    user: null, // Will store Clerk user

    init(user) {
        this.user = user;
        const container = document.getElementById('user-button-container');
        if (!container) {
            console.warn('[UserMenu] Container not found, retrying...');
            setTimeout(() => this.init(user), 500);
            return;
        }

        console.log('[UserMenu] Initializing for user:', user.firstName);

        // Clear existing content (important if re-initializing)
        container.innerHTML = '';

        // 1. Create Wrapper (Relative positioning context)
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';

        // 2. Create Avatar Trigger
        const trigger = document.createElement('div');
        trigger.className = 'custom-user-trigger';
        trigger.innerHTML = `<img src="${user.imageUrl}" alt="${user.firstName}" />`;

        // 3. Create Dropdown Menu
        const menu = document.createElement('div');
        menu.className = 'custom-user-dropdown';
        // HTML Structure
        menu.innerHTML = `
            <div class="cud-header">
                <div class="cud-user-info">
                    <img src="${user.imageUrl}" class="cud-avatar-small">
                    <div>
                        <div class="cud-name">${user.fullName || user.firstName}</div>
                        <div class="cud-sub">Mitglied seit 2024</div>
                    </div>
                </div>
            </div>
            <div class="cud-section">
                <a href="mein-profil.html" class="cud-link">
                    <i data-lucide="user"></i> Mein Profil
                </a>
                <a href="meine-einstellungen.html" class="cud-link">
                    <i data-lucide="settings"></i> Einstellungen
                </a>
            </div>
             <div class="cud-section">
                <a href="geldbeutel.html" class="cud-link">
                    <i data-lucide="wallet"></i> Geldbeutel
                    <span class="cud-balance">75,55 €</span>
                </a>
            </div>
            <div class="cud-section">
                <a href="sonstiges.html" class="cud-link">
                    <i data-lucide="help-circle"></i> Hilfe-Center
                </a>
                 <a href="#" id="custom-logout-btn" class="cud-link cud-logout">
                    <i data-lucide="log-out"></i> Ausloggen
                </a>
            </div>
        `;

        // 4. Append
        wrapper.appendChild(trigger);
        wrapper.appendChild(menu);
        container.appendChild(wrapper);

        // 5. Inject Styles
        this.injectStyles();
        if (window.lucide) window.lucide.createIcons();

        // 6. Events
        const toggleMenu = (e) => {
            e.stopPropagation();
            menu.classList.toggle('active');
        };

        trigger.addEventListener('click', toggleMenu);

        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                menu.classList.remove('active');
            }
        });

        const logoutBtn = menu.querySelector('#custom-logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await window.Clerk.signOut();
                window.location.href = 'index.html';
            });
        }
    },

    injectStyles() {
        if (document.getElementById('custom-user-menu-style')) return;

        const style = document.createElement('style');
        style.id = 'custom-user-menu-style';
        style.innerHTML = `
            /* Container relative for absolute dropdown */
            #user-button-container {
                position: relative;
                margin-left: 15px;
            }

            /* Avatar Trigger */
            .custom-user-trigger {
                cursor: pointer;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                overflow: hidden;
                border: 2px solid transparent;
                transition: border-color 0.2s;
            }
            .custom-user-trigger:hover {
                border-color: #e5e7eb;
            }
            .custom-user-trigger img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            /* Dropdown Menu */
            .custom-user-dropdown {
                position: absolute;
                top: 50px;
                right: 0;
                width: 300px;
                background: white;
                border: 1px solid #e5e7eb;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                border-radius: 8px;
                z-index: 10000;
                padding: 0;
                overflow: hidden;
                display: none; /* Controlled by active class */
                transform-origin: top right;
            }
            
            .custom-user-dropdown.active {
                display: block;
                animation: scaleIn 0.2s ease-out;
            }

            @keyframes scaleIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }

            /* Menu Header */
            .cud-header {
                padding: 16px;
                border-bottom: 1px solid #f3f4f6;
                background: #fdfdfd;
            }
            .cud-user-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .cud-avatar-small {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                object-fit: cover;
            }
            .cud-name {
                font-weight: 700;
                color: #111;
                font-size: 16px;
            }
            .cud-sub {
                font-size: 12px;
                color: #666;
            }

            /* Sections */
            .cud-section {
                border-bottom: 1px solid #f3f4f6;
                padding: 4px 0;
            }
            .cud-section:last-child {
                border-bottom: none;
            }

            /* Links */
            .cud-link {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 20px;
                color: #374151;
                text-decoration: none;
                font-size: 14px;
                transition: background 0.1s;
                font-family: 'Inter', sans-serif;
            }
            .cud-link:hover {
                background-color: #f9fafb;
                color: #2D5016; /* Brand Green */
            }
            .cud-link svg {
                width: 18px;
                height: 18px;
                color: #9CA3AF;
            }
            .cud-link:hover svg {
                color: #2D5016;
            }

            /* Balance */
            .cud-balance {
                color: #09919c; 
                font-weight: 700;
                margin-left: auto;
            }

            /* Logout */
            .cud-logout {
                color: #ef4444; 
            }
            .cud-logout:hover {
                color: #dc2626;
                background-color: #fee2e2;
            }
            .cud-logout svg {
                color: #ef4444;
            }
            .cud-logout:hover svg {
                color: #dc2626;
            }
        `;
        document.head.appendChild(style);
    }
};

// Expose globally
window.UserMenu = UserMenu;
