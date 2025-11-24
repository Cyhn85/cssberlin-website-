#!/usr/bin/env python3
"""
Add API scripts to all HTML pages that need them
"""

import os
import re

# Priority pages that need API integration
PRIORITY_PAGES = [
    'damen.html',
    'herren.html',
    'kinder.html',
    'mein-konto.html',
    'inserieren.html',
    'messages.html',
    'verhandeln.html',
    'login.html',
    'registrieren.html',
    'product-detail.html',
    'warenkorb.html',
    'checkout.html',
    'versand-tracking.html'
]

API_SCRIPTS = '''    <!-- API Configuration (MUST load first) -->
    <script src="api-config.js"></script>
    <script src="api-client.js"></script>
'''

def add_api_scripts(filepath):
    """Add API scripts to an HTML file if not already present"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if already has API scripts
        if 'api-config.js' in content:
            print(f"[OK] {os.path.basename(filepath)} - Already has API scripts")
            return False

        # Find where to inject (before other scripts, after EmailJS if present)
        patterns = [
            (r'(\s*<script src="footer\.js">)', API_SCRIPTS + r'\n\1'),
            (r'(\s*<script src="script\.js">)', API_SCRIPTS + r'\n\1'),
            (r'(\s*<script src="auth\.js">)', API_SCRIPTS + r'\n\1'),
            (r'(\s*</body>)', API_SCRIPTS + r'\n\1'),
        ]

        modified = False
        for pattern, replacement in patterns:
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content, count=1)
                modified = True
                break

        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"[OK] {os.path.basename(filepath)} - Added API scripts")
            return True
        else:
            print(f"[SKIP] {os.path.basename(filepath)} - Could not find injection point")
            return False

    except Exception as e:
        print(f"[ERROR] {os.path.basename(filepath)} - Error: {e}")
        return False

def main():
    base_dir = r'c:\Users\cyhnsrgc\Desktop\CSS-Berlin-Website'

    print("=" * 60)
    print("Adding API Scripts to Priority Pages")
    print("=" * 60)

    added_count = 0
    for page in PRIORITY_PAGES:
        filepath = os.path.join(base_dir, page)
        if os.path.exists(filepath):
            if add_api_scripts(filepath):
                added_count += 1
        else:
            print(f"[SKIP] {page} - File not found")

    print("=" * 60)
    print(f"[SUCCESS] Added API scripts to {added_count} pages")
    print("=" * 60)

if __name__ == '__main__':
    main()
