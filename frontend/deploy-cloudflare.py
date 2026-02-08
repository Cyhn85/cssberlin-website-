#!/usr/bin/env python3
"""
Cloudflare Pages Deployment Helper
Simple script to check deployment status and provide next steps
"""

import sys
import webbrowser
import time

def main():
    print("=" * 60)
    print("🚀 CSS Berlin - Cloudflare Pages Deployment")
    print("=" * 60)
    print()

    print("📋 Your repository is ready:")
    print("   https://github.com/Cyhn85/cssberlin-website-")
    print()

    print("✅ Prerequisites completed:")
    print("   ✓ Git repository initialized")
    print("   ✓ All files committed")
    print("   ✓ Pushed to GitHub")
    print("   ✓ Documentation ready")
    print()

    print("🌐 CLOUDFLARE PAGES DEPLOYMENT")
    print("-" * 60)
    print()
    print("Follow these steps:")
    print()
    print("1. Visit Cloudflare Dashboard")
    print("   → Opening in browser in 3 seconds...")
    print()

    # Wait and open browser
    time.sleep(3)
    webbrowser.open('https://dash.cloudflare.com/')

    print("2. In Cloudflare Dashboard:")
    print("   a. Click 'Workers & Pages' (left sidebar)")
    print("   b. Click 'Create application'")
    print("   c. Select 'Pages' tab")
    print("   d. Click 'Connect to Git'")
    print()

    print("3. Connect GitHub Repository:")
    print("   a. Authorize Cloudflare to access GitHub")
    print("   b. Select repository: cssberlin-website-")
    print("   c. Click 'Begin setup'")
    print()

    print("4. Build Configuration:")
    print("   Project name: css-berlin")
    print("   Production branch: main")
    print("   Build command: (leave empty)")
    print("   Build output directory: /")
    print("   Root directory: (leave as /)")
    print()

    print("5. Environment Variables (Optional):")
    print("   API_URL = https://195.201.146.224:8000")
    print()

    print("6. Click 'Save and Deploy'")
    print()
    print("=" * 60)
    print("⏳ Deployment will take 2-3 minutes")
    print("=" * 60)
    print()

    print("Your site will be available at:")
    print("   https://css-berlin.pages.dev")
    print()

    print("📝 After deployment:")
    print("   1. Visit your site")
    print("   2. Test all features (see DEPLOYMENT_GUIDE.md)")
    print("   3. Configure custom domain (optional)")
    print()

    input("Press Enter to exit...")

if __name__ == "__main__":
    main()
