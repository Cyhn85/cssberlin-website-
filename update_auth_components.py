
// Helper to overwrite auth-modal-v3.js because we are replacing mountUserButton with custom menu
// We'll read the file, replace the mountUserButton part with UserMenu.init(window.Clerk.user)

import os

path = r"c:\Users\cyhnsrgc\Desktop\CSSberlin\auth-modal-v3.js"

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Target block to replace
target_block = """                window.Clerk.mountUserButton(userContainer, {
                    afterSignOutUrl: "/",
                    signInUrl: "/" // Çıkış yapınca ana sayfaya dön
                });"""

replacement_block = """                // CUSTOM USER MENU (Vinted Style)
                if (window.UserMenu) {
                    window.UserMenu.init(window.Clerk.user);
                } else {
                    // Fallback if UserMenu script is missing
                    window.Clerk.mountUserButton(userContainer, {
                        afterSignOutUrl: "/",
                        signInUrl: "/"
                    });
                }"""

new_content = content.replace(target_block, replacement_block)

# Also ensure user-menu.js is called. We can't easily inject the script tag here inside JS.
# We'll rely on adding it to components.js or manually adding to all pages. 
# Adding to components.js is safest as it loads everywhere.

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated auth-modal-v3.js")

# Now update components.js to load user-menu.js
comp_path = r"c:\Users\cyhnsrgc\Desktop\CSSberlin\components.js"
with open(comp_path, 'r', encoding='utf-8') as f:
    comp_content = f.read()

if 'user-menu.js' not in comp_content:
    # Inject script loading helper
    injection = """
    // Load Custom User Menu Script
    if (!document.querySelector('script[src="user-menu.js"]')) {
        const s = document.createElement('script');
        s.src = 'user-menu.js';
        document.body.appendChild(s);
    }
"""
    # Add to beginning of initializeHeaderScripts
    comp_content = comp_content.replace("function initializeHeaderScripts() {", "function initializeHeaderScripts() {" + injection)
    
    # Also update rebindClerk function in components.js which ALSO mounts user button
    # We need to update rebindClerk to use UserMenu too
    
    rebind_target = """                window.Clerk.mountUserButton(userContainer, {
                    afterSignOutUrl: "/",
                    signInUrl: "/"
                });"""
    
    rebind_replacement = """                if (window.UserMenu) {
                    window.UserMenu.init(window.Clerk.user);
                } else {
                    window.Clerk.mountUserButton(userContainer, {
                        afterSignOutUrl: "/",
                        signInUrl: "/"
                    });
                }"""
    
    comp_content = comp_content.replace(rebind_target, rebind_replacement)
    
    with open(comp_path, 'w', encoding='utf-8') as f:
        f.write(comp_content)
    print("Updated components.js")

