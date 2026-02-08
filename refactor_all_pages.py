import os
import re

# Definiere die HTML-Dateien im Root-Verzeichnis
ROOT_DIR = r"c:\Users\cyhnsrgc\Desktop\CSSberlin"
HEADER_PLACEHOLDER = '<div id="header-placeholder"></div>'
FOOTER_PLACEHOLDER = '<div id="footer-placeholder"></div>'
COMPONENTS_SCRIPT = '<script src="components.js"></script>'
HEADER_CSS = '<link rel="stylesheet" href="header-v3.css">'
FOOTER_CSS = '<link rel="stylesheet" href="footer-v3.css">'

def update_html_files():
    print(f"Scanning directory: {ROOT_DIR}")
    for filename in os.listdir(ROOT_DIR):
        if filename.endswith(".html"):
            filepath = os.path.join(ROOT_DIR, filename)
            
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()

            modified = False

            # 1. Inject CSS Links if missing
            if "header-v3.css" not in content:
                content = re.sub(r'</head>', f'    {HEADER_CSS}\n    {FOOTER_CSS}\n</head>', content, count=1)
                modified = True
                print(f"[{filename}] Added CSS links.")
            
            # 2. Inject Header Placeholder if missing
            if 'id="header-placeholder"' not in content:
                # Try to inject after <body>
                if "<body>" in content:
                    content = content.replace("<body>", f"<body>\n    {HEADER_PLACEHOLDER}")
                    modified = True
                    print(f"[{filename}] Added Header Placeholder.")
                else:
                    print(f"[{filename}] WARNING: No <body> tag found.")

            # 3. Inject Footer Placeholder if missing
            if 'id="footer-placeholder"' not in content:
                # Try to inject before valid footer or end of body
                if "</body>" in content:
                    content = content.replace("</body>", f"    {FOOTER_PLACEHOLDER}\n</body>")
                    modified = True
                    print(f"[{filename}] Added Footer Placeholder.")
            
            # 4. Inject Components Script if missing
            if "components.js" not in content:
                content = content.replace("</body>", f"    {COMPONENTS_SCRIPT}\n</body>")
                modified = True
                print(f"[{filename}] Added components.js script.")

            # 5. Remove Old Header/Footer Hardcoded Code (Optional cleanup)
            # Simplistic removal of old navbar if it exists and we rely on placeholder
            # Avoiding aggressive deletion to prevent breaking unique pages

            if modified:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"[{filename}] Updated successfully.")
            else:
                print(f"[{filename}] No changes needed.")

if __name__ == "__main__":
    update_html_files()
