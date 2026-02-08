/* =============================================
   CUSTOM USER MENU COMPONENT (Vinted-style)
   ============================================= */

const UserMenu = {
    user: null, // Will store Clerk user

    init(user) {
        this.user = user;
        const container = document.getElementById('user-button-container');
        if (!container) return;

        // Clean container
        container.innerHTML = '';
        container.style.display = 'block';

        // 1. Create Avatar Trigger
        const trigger = document.createElement('div');
        trigger.className = 'custom-user-trigger';
        trigger.innerHTML = `<img src="${user.imageUrl}" alt="${user.firstName}" />`;

        // 2. Create Dropdown Menu
        const menu = document.createElement('div');
        menu.className = 'custom-user-dropdown';
        menu.style.display = 'none'; // Hidden by default

        // Menu Structure
        menu.innerHTML = `
            <div class="cud-section">
                <a href="mein-profil.html" class="cud-link">Mein Profil</a>
                <a href="freunde-einladen.html" class="cud-link">Freunde einladen</a>
                <a href="meine-einstellungen.html" class="cud-link">Meine Einstellungen</a>
                <a href="personalisierung.html" class="cud-link">Personalisierung</a>
            </div>
            <div class="cud-section">
                <a href="geldbeutel.html" class="cud-link">
                    Geldbeutel
                    <span class="cud-balance">75,55 €</span>
                </a>
            </div>
            <div class="cud-section">
                <a href="meine-bestellungen.html" class="cud-link">Meine Bestellungen</a>
                <a href="spenden.html" class="cud-link">Spenden</a>
            </div>
            <div class="cud-section">
                <a href="#" id="custom-logout-btn" class="cud-link cud-logout">Ausloggen</a>
            </div>
        `;

        // 3. Append to Container
        container.appendChild(trigger);
        container.appendChild(menu);

        // 4. Styles Injection
        this.injectStyles();

        // 5. Event Listeners
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = menu.style.display === 'block';
            menu.style.display = isOpen ? 'none' : 'block';
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                menu.style.display = 'none';
            }
        });

        // Handle Logout
        const logoutBtn = menu.querySelector('#custom-logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await window.Clerk.signOut();
                window.location.href = '/';
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
                top: 50px; /* Below avatar */
                right: 0;
                width: 280px;
                background: white;
                border: 1px solid #e5e7eb;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                border-radius: 4px;
                z-index: 10000;
                padding: 8px 0;
                animation: fadeIn 0.2s ease-out;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
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
                justify-content: space-between;
                align-items: center;
                padding: 10px 20px;
                color: #374151;
                text-decoration: none;
                font-size: 15px;
                transition: background 0.1s;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }
            .cud-link:hover {
                background-color: #f9fafb;
                color: #2D5016; /* Brand Green */
            }

            /* Balance */
            .cud-balance {
                color: #09919c; /* Vinted-like teal or keep brand green? */
                font-weight: 600;
            }

            /* Logout */
            .cud-logout {
                color: #ef4444; /* Red */
            }
            .cud-logout:hover {
                color: #dc2626;
                background-color: #fee2e2;
            }
        `;
        document.head.appendChild(style);
    }
};

// Expose globally
window.UserMenu = UserMenu;
