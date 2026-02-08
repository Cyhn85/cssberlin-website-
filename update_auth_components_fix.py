
# Fixed python script (removed the leading lines that were not comments)
import os

path = r"c:\Users\cyhnsrgc\Desktop\CSSberlin\auth-modal-v3.js"

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Target block to replace in auth-modal-v3.js
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

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated auth-modal-v3.js")

# Now update components.js to load user-menu.js
comp_path = r"c:\Users\cyhnsrgc\Desktop\CSSberlin\components.js"
with open(comp_path, 'r', encoding='utf-8') as f:
    comp_content = f.read()

# Make sure we don't inject multiple times
if 'user-menu.js' not in comp_content:
    # 1. Inject script loading helper into initializeHeaderScripts
    injection = """
    // Load Custom User Menu Script
    if (!document.querySelector('script[src="user-menu.js"]')) {
        const s = document.createElement('script');
        s.src = 'user-menu.js';
        document.body.appendChild(s);
    }
"""
    comp_content = comp_content.replace("function initializeHeaderScripts() {", "function initializeHeaderScripts() {" + injection)
    
    # 2. Update rebindClerk() to use UserMenu.init
    # We need to find the specific block in rebindClerk
    # The indentation and newlines must match exactly what's in components.js
    # Let's read components.js to see exactly what lines look like
    # But for robustness, we can update the known string if it exists
    
    rebind_target = """                window.Clerk.mountUserButton(userContainer, {
                    afterSignOutUrl: "/",
                    signInUrl: "/"
                });"""
    
    # In components.js (Step 28), it was:
    # window.Clerk.mountUserButton(userContainer, {
    #     afterSignOutUrl: "/",
    #     signInUrl: "/"
    # });
    # with indentation. It seems my target block above uses 16 spaces (4 equivalent tabs?). 
    # Let's try to be flexible with regex if possible, but simple replace works if I match exact string.
    # The previous attempt failed because of SyntaxError in Python, not logic error.
    
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
else:
    print("components.js already updated")
