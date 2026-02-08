
import os

root_dir = r"c:\Users\cyhnsrgc\Desktop\CSSberlin"
template_path = os.path.join(root_dir, "mein-profil.html")

with open(template_path, 'r', encoding='utf-8') as f:
    template = f.read()

pages = {
    "meine-einstellungen.html": {
        "title": "Meine Einstellungen",
        "content_title": "Einstellungen",
        "content_body": """
            <form style="max-width:500px;">
                <h3 style="margin-bottom:15px;">Konto-Informationen</h3>
                <div style="margin-bottom:15px;">
                    <label style="display:block; margin-bottom:5px; font-weight:600;">E-Mail-Adresse</label>
                    <input type="email" value="user@example.com" disabled style="width:100%; padding:10px; border:1px solid #ddd; border-radius:6px; background:#f9f9f9;">
                </div>
                <div style="margin-bottom:25px;">
                    <label style="display:block; margin-bottom:5px; font-weight:600;">Benutzername</label>
                    <input type="text" placeholder="Ihr Benutzername" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:6px;">
                </div>
                
                <h3 style="margin-bottom:15px;">Benachrichtigungen</h3>
                <div style="margin-bottom:10px;">
                    <label style="display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" checked> E-Mail bei Verkäufen
                    </label>
                </div>
                <div style="margin-bottom:10px;">
                    <label style="display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" checked> Newsletter abonnieren
                    </label>
                </div>
                <br>
                <button class="btn-gradient" style="border:none; cursor:pointer;">Speichern</button>
            </form>
        """
    },
    "geldbeutel.html": {
        "title": "Geldbeutel - CSS Berlin",
        "content_title": "Mein Geldbeutel",
        "content_body": """
            <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:30px; border-radius:12px; text-align:center; margin-bottom:40px;">
                <div style="font-size:16px; color:#166534; margin-bottom:10px;">Verfügbares Guthaben</div>
                <div style="font-size:48px; font-weight:800; color:#15803d;">75,55 €</div>
                <div style="margin-top:20px; display:flex; gap:15px; justify-content:center;">
                    <button class="btn-gradient" style="border:none; cursor:pointer;">Auszahlen</button>
                </div>
            </div>
            <h3>Transaktionen</h3>
            <table style="width:100%; border-collapse:collapse;">
                <tr style="border-bottom:2px solid #eee; text-align:left;">
                    <th style="padding:10px;">Datum</th>
                    <th style="padding:10px;">Beschreibung</th>
                    <th style="padding:10px; text-align:right;">Betrag</th>
                </tr>
                <tr style="border-bottom:1px solid #eee;">
                    <td style="padding:10px;">06.02.2026</td>
                    <td style="padding:10px;">Verkauf: Adidas Sneaker</td>
                    <td style="padding:10px; text-align:right; color:green;">+45,00 €</td>
                </tr>
                <tr style="border-bottom:1px solid #eee;">
                    <td style="padding:10px;">01.02.2026</td>
                    <td style="padding:10px;">Auszahlung an Bankkonto</td>
                    <td style="padding:10px; text-align:right;">-120,00 €</td>
                </tr>
            </table>
        """
    },
    "meine-bestellungen.html": {
        "title": "Meine Bestellungen",
        "content_title": "Meine Bestellungen",
        "content_body": """
            <div class="order-card" style="border:1px solid #eee; border-radius:8px; padding:20px; margin-bottom:20px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                    <div><strong>Bestellung #8492</strong><br><span style="color:#666; font-size:13px;">05.02.2026</span></div>
                    <div style="color:green; font-weight:600;">Unterwegs 🚚</div>
                </div>
                <div style="display:flex; gap:15px;">
                    <div style="width:60px; height:60px; background:#eee; border-radius:4px;"></div>
                    <div>
                        <strong>Vintage Jeans Levi's</strong><br>
                        35,00 €
                    </div>
                </div>
            </div>
        """
    },
    "freunde-einladen.html": {
        "title": "Freunde einladen",
        "content_title": "Freunde einladen & Sparen",
        "content_body": """
            <div style="text-align:center; padding:40px;">
                <div style="font-size:60px; margin-bottom:20px;">🎁</div>
                <h2 style="color:#2D5016;">Schenken Sie 10€, erhalten Sie 10€</h2>
                <p style="max-width:500px; margin:0 auto 30px;">
                    Laden Sie Ihre Freunde zu CSS Berlin ein. Wenn sie ihren ersten Artikel kaufen oder verkaufen, erhalten Sie beide einen 10€ Gutschein für nachhaltiges Shopping.
                </p>
                <div style="background:#f5f5f5; padding:15px; border-radius:8px; display:inline-block; font-family:monospace; font-size:18px; letter-spacing:1px;">
                    CSS-BERLIN-FRIEND-2026
                </div>
                <br><br>
                <button class="btn-gradient" style="border:none; cursor:pointer;">Link kopieren</button>
            </div>
        """
    },
    "spenden.html": {
        "title": "Spenden",
        "content_title": "Spenden & Klima schützen",
        "content_body": """
            <p>Sie können einen Teil Ihrer Einnahmen direkt an verifizierte Klimaschutzprojekte spenden.</p>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:30px;">
                <div style="border:1px solid #eee; border-radius:8px; padding:20px;">
                    <h3 style="margin-top:0;">WWF Deutschland</h3>
                    <p style="font-size:14px; color:#666;">Schutz bedrohter Arten und Lebensräume.</p>
                    <button style="width:100%; padding:10px; background:#2D5016; color:white; border:none; border-radius:6px; cursor:pointer;">Spenden</button>
                </div>
                <div style="border:1px solid #eee; border-radius:8px; padding:20px;">
                    <h3 style="margin-top:0;">Eden Reforestation</h3>
                    <p style="font-size:14px; color:#666;">Bäume pflanzen in entwaldeten Gebieten.</p>
                    <button style="width:100%; padding:10px; background:#2D5016; color:white; border:none; border-radius:6px; cursor:pointer;">Spenden</button>
                </div>
            </div>
        """
    },
    "personalisierung.html": {
        "title": "Personalisierung",
        "content_title": "Feed Personalisieren",
        "content_body": """
            <p>Wählen Sie Ihre bevorzugten Größen und Marken für bessere Empfehlungen.</p>
            <h3>Größen</h3>
            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:30px;">
                <span style="padding:8px 15px; border:1px solid #2D5016; background:#f0fdf4; color:#2D5016; border-radius:20px;">S / 36</span>
                <span style="padding:8px 15px; border:1px solid #ccc; border-radius:20px;">M / 38</span>
                <span style="padding:8px 15px; border:1px solid #ccc; border-radius:20px;">L / 40</span>
            </div>
            
            <h3>Lieblingsmarken</h3>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <span style="padding:8px 15px; border:1px solid #2D5016; background:#f0fdf4; color:#2D5016; border-radius:20px;">Zara</span>
                <span style="padding:8px 15px; border:1px solid #2D5016; background:#f0fdf4; color:#2D5016; border-radius:20px;">H&M</span>
                <span style="padding:8px 15px; border:1px solid #ccc; border-radius:20px;">Nike</span>
                <span style="padding:8px 15px; border:1px solid #ccc; border-radius:20px;">Adidas</span>
            </div>
            <br><br>
            <button class="btn-gradient" style="border:none; cursor:pointer;">Speichern</button>
        """
    }
}

for filename, data in pages.items():
    page_content = template
    
    # Simple replaces (this assumes template structure is stable)
    page_content = page_content.replace("<title>Mein Profil - CSS Berlin</title>", f"<title>{data['title']}</title>")
    # Replace active class in sidebar (crude regex or replace)
    page_content = page_content.replace('href="mein-profil.html" class="active"', 'href="mein-profil.html"')
    page_content = page_content.replace(f'href="{filename}"', f'href="{filename}" class="active"')
    
    # Replace Main Content
    # Does regex replace for Main Content area
    # Looking for <main class="main-content"> ... </main>
    # We'll just construct the inner HTML
    
    start_marker = '<main class="main-content">'
    end_marker = '</main>'
    
    start_idx = page_content.find(start_marker) + len(start_marker)
    end_idx = page_content.find(end_marker)
    
    new_main = f"""
            <h1>{data['content_title']}</h1>
            {data['content_body']}
    """
    
    final_html = page_content[:start_idx] + new_main + page_content[end_idx:]
    
    with open(os.path.join(root_dir, filename), 'w', encoding='utf-8') as f:
        f.write(final_html)
    
    print(f"Created {filename}")
