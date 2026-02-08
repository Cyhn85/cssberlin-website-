import os
import re

# ---------------- CONFIGURATION ----------------
# TARGET DIRECTORY
BASE_DIR = r"c:\Users\cyhnsrgc\Desktop\CSSberlin"

# FILES TO IGNORE (Do not modify these)
IGNORE_FILES = [
    "index.html",            # Source of truth
    "product-detail.html",   # Just updated, special layout
    "mein-konto.html",       # Dashboard has its own structure (sidebar)
    "admin-dashboard.html",
    "admin-logs.html",
    "init-admin.html",
    "login_old_admin.html",
    "test-auth.html",
    "test-cart.html",
    "test-wishlist.html",
    "QUICK_AUTH_TEST.html",
    "platform-selector-snippet.html",
    "_header_template.html",
    "index-old-backup.html",
    "auth-gate.js", # Not html
    "vitrin.js"     # Not html
]

# ---------------- TEMPLATES ----------------

# 1. HEAD INJECTIONS (CSS/JS)
# We will verify if these exist, if not we add them before </head>
HEAD_INJECTIONS = """
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>

    <link rel="stylesheet" href="header-v3.css">
    <link rel="stylesheet" href="auth-modal-v3.css">
    <link rel="stylesheet" href="cookie-consent.css">
    <link rel="stylesheet" href="footer-v3.css">
    <link rel="stylesheet" href="gradient-button.css">
    
    <!-- CLERK AUTH -->
    <script async crossorigin="anonymous"
      data-clerk-publishable-key="pk_test_c3VwZXItd2FzcC04NS5jbGVyay5hY2NvdW50cy5kZXYk"
      src="https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js"
      type="text/javascript"></script>
    
    <script src="api-config.js"></script>
    <script src="auth-modal-v3.js"></script>
"""

# 2. HEADER V3 HTML (Standard Full Header)
HEADER_V3_HTML = """
    <header class="header-v3">
        <div class="header-row-logo">
            <a href="index.html" class="logo-v3"><span class="logo-css">CSS</span><span class="logo-berlin">berlin</span></a>
            <div class="header-right-v3">
                <a href="wunschliste.html" class="header-icon-v3" title="Favoriten"><i data-lucide="heart"></i></a>
                <a href="inserieren.html" class="header-icon-v3" title="Inserieren"><i data-lucide="plus-circle"></i></a>
                <a href="warenkorb.html" class="header-icon-v3" title="Warenkorb"><i data-lucide="shopping-cart"></i></a>
                <button type="button" class="btn-anmelden-v3" id="header-login-btn">Anmelden</button>
                <div id="user-button-container"></div>
            </div>
        </div>

        <div class="header-row-search">
            <button class="dark-mode-toggle-v3" id="darkModeToggle" title="Modus wechseln"></button>
            <button class="lang-selector-v3" onclick="toggleLanguageDropdown()">
                <i data-lucide="globe"></i> <span>DE</span>
            </button>
            <div class="search-input-v3">
                <input type="text" placeholder="CLIMATE SMART SOLUTIONS" id="searchInputV3">
                <button class="search-btn-icon"><i data-lucide="search"></i></button>
            </div>
        </div>

        <script src="smart-header.js"></script>

        <nav class="nav-bar-v3">
            <div class="nav-container-v3">
                <a href="index.html?category=damen" class="nav-link-v3">DAMEN</a>
                <a href="index.html?category=herren" class="nav-link-v3">HERREN</a>
                <a href="index.html?category=kinder" class="nav-link-v3">KINDER</a>
                <a href="index.html?category=elektronik" class="nav-link-v3">ELEKTRONIK</a>
                <a href="sonstiges.html" class="nav-link-v3">SONSTIGES</a>
                <a href="sale.html" class="nav-link-v3 sale">SALE</a>
            </div>
        </nav>
    </header>
"""

# 3. FOOTER V3 HTML
FOOTER_V3_HTML = """
    <footer class="footer-v3">
        <div class="footer-v3-container">
            <div class="footer-col">
                <h4>CSS Berlin</h4>
                <a href="ueber-uns.html">Über uns</a>
                <a href="nachhaltigkeit.html">Nachhaltigkeit</a>
                <a href="presse.html">Presse</a>
                <a href="werbung.html">Werbung</a>
                <a href="barrierefreiheit.html">Barrierefreiheit</a>
            </div>
            <div class="footer-col">
                <h4>Entdecken</h4>
                <a href="wie-funktioniert-es.html">Wie funktioniert's?</a>
                <a href="verifizierung.html">Artikelverifizierung</a>
                <a href="apps.html">Smartphone-Apps</a>
                <a href="infoboard.html">Infoboard</a>
            </div>
            <div class="footer-col">
                <h4>Hilfe</h4>
                <a href="hilfe-center.html">Hilfe-Center</a>
                <a href="verkaufen.html">Verkaufen</a>
                <a href="kaufen.html">Kaufen</a>
                <a href="sicherheit.html">Vertrauen und Sicherheit</a>
            </div>
        </div>

        <div class="footer-bottom-v3">
            <div class="footer-legal-links">
                <a href="impressum.html">Impressum</a>
                <a href="datenschutz.html">Datenschutz</a>
                <a href="agb.html">AGB</a>
                <a href="widerrufsrecht.html">Widerrufsrecht</a>
            </div>
            <div class="footer-legal-text" style="color:rgba(255,255,255,0.5); margin-top:10px;">
                CSS Berlin | Ceyhun Sabahattin Sorguc | Am Omnibushof 12, 13593 Berlin<br>
                USt-IdNr.: DE459278750 | St.-Nr.: 19/538/01452 | Kleinunternehmer i.S.d. § 19 UStG
            </div>
            <p style="margin-top: 10px; color:var(--brand-orange);">&copy; 2026 CSS Berlin - Climate Smart Solutions. Alle Rechte vorbehalten.</p>
        </div>
    </footer>
"""

def update_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Skipping {filepath}: {e}")
        return

    # 1. CLEANUP HEAD (Remove old CSS links to avoid conflicts)
    # Removing old header.css, footer.css, auth-modal.css (v1/v2)
    content = re.sub(r'<link rel="stylesheet" href="header\.css">', '', content)
    content = re.sub(r'<link rel="stylesheet" href="footer\.css">', '', content)
    content = re.sub(r'<link rel="stylesheet" href="auth-modal\.css">', '', content)
    content = re.sub(r'<link rel="stylesheet" href="header-v2\.css">', '', content)

    # 2. INJECT HEAD DEPENDENCIES
    # We check if header-v3.css is present. If not, we inject the whole block before </head>
    if "header-v3.css" not in content:
        if "</head>" in content:
            content = content.replace("</head>", f"{HEAD_INJECTIONS}\n</head>")
        else:
            # Fallback if no head tag
             pass

    # 3. REPLACE HEADER
    # Patterns to find headers: <header...> </header> or <div class="header"...></div>
    # Using regex with DOTALL
    
    # Try finding standard <header> tags
    header_pattern = re.compile(r'<header.*?>.*?</header>', re.DOTALL | re.IGNORECASE)
    
    if header_pattern.search(content):
        content = header_pattern.sub(HEADER_V3_HTML, content)
    else:
        # If no <header> tag, look for legacy header div? 
        # Actually most files in this project use <header> tags. 
        # If not found, we might prepend to body, but that's risky. 
        # Let's assume standard structure.
        pass

    # 4. REPLACE FOOTER
    footer_pattern = re.compile(r'<footer.*?>.*?</footer>', re.DOTALL | re.IGNORECASE)
    
    if footer_pattern.search(content):
        content = footer_pattern.sub(FOOTER_V3_HTML, content)
    else:
        # If no footer, append to body end
        if "</body>" in content:
            content = content.replace("</body>", f"{FOOTER_V3_HTML}\n</body>")

    # 5. ENSURE LUCIDE.CREATEICONS() IS CALLED
    # If the file doesn't have a script calling lucide.createIcons(), add it at end
    if "lucide.createIcons()" not in content and "script.js" not in content:
        # script.js usually handles it. But for safety:
        script_block = "<script>window.addEventListener('load', () => lucide.createIcons());</script>"
        if "</body>" in content:
            content = content.replace("</body>", f"{script_block}\n</body>")

    # WRITE BACK
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated: {os.path.basename(filepath)}")

def main():
    print("Starting Global Layout Update...")
    for root, dirs, files in os.walk(BASE_DIR):
        for file in files:
            if file.endswith(".html"):
                if file in IGNORE_FILES:
                    print(f"Ignored: {file}")
                    continue
                
                # Check if file is in ignored folders (like backup)
                if "backup" in root or "seed_data" in root:
                    continue

                full_path = os.path.join(root, file)
                update_file(full_path)

if __name__ == "__main__":
    main()
