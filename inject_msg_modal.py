
import os

ROOT_DIR = r"c:\Users\cyhnsrgc\Desktop\CSSberlin"
MSG_SCRIPT = '<script src="message-modal.js"></script>'

def inject_msg_modal():
    print(f"Injecting message-modal.js into all HTML files in {ROOT_DIR}")
    for filename in os.listdir(ROOT_DIR):
        if filename.endswith(".html"):
            filepath = os.path.join(ROOT_DIR, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()

            if "message-modal.js" not in content and "</body>" in content:
                content = content.replace("</body>", f"    {MSG_SCRIPT}\n</body>")
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"[{filename}] Injected message-modal.js")

if __name__ == "__main__":
    inject_msg_modal()
