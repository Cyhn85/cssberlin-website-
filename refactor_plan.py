
import os
import re

# List of files to process (Category pages + sale + sonstiges)
# user said "kategori sekmelerinin icinden acilan sayfalara da"
# Currently known files: damen.html, herren.html, kinder.html, elektronik.html, sonstiges.html, sale.html

target_files = [
    "damen.html",
    "herren.html", 
    "kinder.html", 
    "elektronik.html", 
    "sonstiges.html", 
    "sale.html",
    "wie-funktioniert-es.html" # User screenshot showed this one too
]

root_dir = r"c:\Users\cyhnsrgc\Desktop\CSSberlin"

header_placeholder = '<div id="header-placeholder"></div>'
footer_placeholder = '<div id="footer-placeholder"></div>'
components_script = '<script src="smart-header.js"></script>\n    <script src="components.js"></script>'

for filename in target_files:
    filepath = os.path.join(root_dir, filename)
    if not os.path.exists(filepath):
        print(f"Skipping {filename} (not found)")
        continue

    print(f"Processing {filename}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove ANY existing header (v3 or not) and replace with placeholder
    # Search for <header>...</header> or <div id="header-placeholder">...</div> or old structures
    
    # Regex for generic header tag
    content = re.sub(r'<header.*?>.*?</header>', header_placeholder, content, flags=re.DOTALL)
    
    # Regex for announcement bar if separated (header-v3 often has announcement bar outside header tag in some files, but checking `damen.html` it was separate)
    # in damen.html: <div class="announcement-bar-v3">...</div> <div id="header-placeholder"></div>
    # WE WANT TO REMOVE announcement bar too because it's part of the new header.html component?
    # Let's check header.html. 
    # NO. header.html starts with <header class="header-v3">. It DOES NOT include announcement-bar-v3?
    # Wait, let me check the header.html content I wrote in Step 20.
    # I wrote: 
    # <header class="header-v3"> ... </header>
    # It seems I did NOT include announcement-bar-v3 in the header.html component in previous step.
    # Let's check index.html from Step 38. 
    # Line 177: <div class="announcement-bar-v3">...</div>
    # Line 189: <div id="header-placeholder"></div> (which loads header.html)
    # So `header.html` DOES NOT contain the announcement bar.
    # Therefore, I should NOT remove the announcement bar from these pages if I want it to show up.
    # OR, better: I should Move the announcement bar INTO header.html so it's managed centrally!
    # The user said "Component Loader sistemini kurmanı istiyorum... index.html'deki <header class="header-v3">... bloğunun tamamını kes".
    # In index.html, announcement bar was separate.
    # But for a TRUE centralized header, announcement bar SHOULD be in it.
    # Use judgement: If I move announcement bar to header.html, I need to remove it from index.html too.
    # Currently index.html has it separate.
    # User asked to clean "header altindaki kategori sekmelerinin icinden acilan sayfalara da ana sayfa header ve footer kuralini uyagulamalisin".
    # If I leave announcement bar separate, I have to ensure it's in every page.
    # Ideally, I should put it in `header.html`.
    # Let's Update `components/header.html` to include the announcement bar at the top, and then remove it from all pages.
    # This is "Best Practice" for refactoring.
    
    # But first, let's finish the script to just ensure placeholders are correct.
    # If I decide to move announcement bar, I have to update header.html first.
    # Let's DO THAT. It's cleaner.

    pass # Logic continues below

