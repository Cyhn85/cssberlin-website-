
# Add toast.js to global components loader to ensure availability
import os
import re

ROOT_DIR = r"c:\Users\cyhnsrgc\Desktop\CSSberlin"
TOAST_SCRIPT = '<script src="toast.js"></script>'

def inject_toast():
    print(f"Injecting toast.js into all HTML files in {ROOT_DIR}")
    for filename in os.listdir(ROOT_DIR):
        if filename.endswith(".html"):
            filepath = os.path.join(ROOT_DIR, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()

            if "toast.js" not in content and "</body>" in content:
                content = content.replace("</body>", f"    {TOAST_SCRIPT}\n</body>")
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"[{filename}] Injected toast.js")

if __name__ == "__main__":
    inject_toast()
