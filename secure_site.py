
import os
import re

root_dir = r"c:\Users\cyhnsrgc\Desktop\CSSberlin"

# 1. Update HTML files with Security Meta Tag
meta_tag = '<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">'

for subdir, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(subdir, file)
            try:
                # Use errors='ignore' to handle non-utf8 files
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                # Check if meta tag already exists
                if "upgrade-insecure-requests" in content:
                    continue
                
                # Insert after <head> or <meta charset...>
                if "<head>" in content:
                    new_content = content.replace("<head>", f"<head>\n    {meta_tag}")
                elif "<meta charset" in content:
                    # Fallback if no head tag but meta charset exists
                    new_content = re.sub(r'(<meta charset.*?>)', f'\\1\n    {meta_tag}', content)
                else:
                    # No head, no charset, maybe components/header.html?
                    # If it's a component file, we might not need to add it if it's injected into a page with head.
                    # But for safety, if it resembles a full page structure, add it.
                    if "<html" in content:
                         new_content = content.replace("<html>", f"<html>\n<head>\n    {meta_tag}\n</head>")
                    else:
                        continue
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Added meta tag to {filepath}")
            except Exception as e:
                print(f"Error processing {filepath}: {e}")

# 2. Advanced Search/Replace for http:// -> https://
# Focusing on external domains, avoiding localhost
# Patterns to avoid: http://localhost, http://127.0.0.1, http://schemas.microsoft.com

print("Scanning for remaining http:// links...")
url_regex = re.compile(r'https://([^/"\s]+)')

extensions = ('.html', '.js', '.css', '.py', '.json')

for subdir, dirs, files in os.walk(root_dir):
    if '.git' in subdir: continue
    
    for file in files:
        if file.endswith(extensions):
            filepath = os.path.join(subdir, file)
            try:
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                original_content = content
                matches = url_regex.findall(content)
                
                modified = False
                for domain in matches:
                    if domain.startswith('localhost'): continue
                    if domain.startswith('127.0.0.1'): continue
                    if 'schemas.microsoft.com' in domain: continue # SVG/XML schemas
                    if 'w3.org' in domain: continue # W3C standards
                    
                    # Safe to replace
                    old_url = f"https://{domain}"
                    new_url = f"https://{domain}"
                    content = content.replace(old_url, new_url)
                    modified = True
                    print(f"  - Replaced {old_url} -> {new_url} in {file}")
                
                if modified:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                        
            except Exception as e:
                pass
