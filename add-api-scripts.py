#!/usr/bin/env python3
"""
Add API scripts to HTML pages (bulk)

This is used to guarantee that `api-config.js` is present so the Global UI shell
(header/footer + ticker standardization) can auto-load everywhere.

Default behavior:
- Walk the repo and patch eligible HTML files
- Skip backups/tests/email templates and other non-site artifacts
"""

import os
import re
import argparse

API_SCRIPTS = (
    '    <!-- API Configuration (MUST load first) -->\n'
    '    <script src="api-config.js"></script>\n'
    '    <script src="api-client.js"></script>\n'
)

SKIP_DIR_NAMES = {
    ".git",
    ".cursor",
    "tests",
    "reports",
    "accounting_system",
}

SKIP_DIR_PREFIXES = (
    "backup-",
)

SKIP_FILE_NAMES = {
    "_header_template.html",
    "platform-selector-snippet.html",
}

SKIP_PATH_CONTAINS = (
    os.sep + "email-templates" + os.sep,
)

INJECT_MARKER = "<!-- API Configuration (MUST load first) -->"


def should_skip_path(filepath: str) -> bool:
    fp = os.path.normpath(filepath)
    base = os.path.basename(fp)
    if base in SKIP_FILE_NAMES:
        return True
    for needle in SKIP_PATH_CONTAINS:
        if needle in fp:
            return True
    parts = set(fp.split(os.sep))
    if parts & SKIP_DIR_NAMES:
        return True
    for p in fp.split(os.sep):
        for pref in SKIP_DIR_PREFIXES:
            if p.startswith(pref):
                return True
    return False

def add_api_scripts(filepath):
    """Add API scripts to an HTML file if not already present"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if already has API scripts
        if 'api-config.js' in content or INJECT_MARKER in content:
            print(f"[OK] {os.path.basename(filepath)} - Already has API scripts")
            return False

        # Prefer injecting into <head> so it loads before body scripts.
        modified = False
        if re.search(r"</head\s*>", content, flags=re.IGNORECASE):
            content = re.sub(
                r"(\s*</head\s*>)",
                "\n" + API_SCRIPTS + r"\1",
                content,
                count=1,
                flags=re.IGNORECASE,
            )
            modified = True
        else:
            # Fallback: inject before the first script tag, else before </body>.
            if re.search(r"<script\b", content, flags=re.IGNORECASE):
                content = re.sub(
                    r"(\s*<script\b)",
                    "\n" + API_SCRIPTS + r"\1",
                    content,
                    count=1,
                    flags=re.IGNORECASE,
                )
                modified = True
            elif re.search(r"</body\s*>", content, flags=re.IGNORECASE):
                content = re.sub(
                    r"(\s*</body\s*>)",
                    "\n" + API_SCRIPTS + r"\1",
                    content,
                    count=1,
                    flags=re.IGNORECASE,
                )
                modified = True

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
    parser = argparse.ArgumentParser(description="Bulk add api-config.js + api-client.js to HTML files.")
    parser.add_argument(
        "--root",
        default=os.path.dirname(os.path.abspath(__file__)),
        help="Repo root to scan (defaults to script directory).",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print what would change without writing files.",
    )
    args = parser.parse_args()

    base_dir = os.path.abspath(args.root)

    print("=" * 60)
    print("Adding API Scripts (bulk scan)")
    print("=" * 60)
    print(f"[ROOT] {base_dir}")

    added_count = 0
    scanned_count = 0
    skipped_count = 0

    for root, dirs, files in os.walk(base_dir):
        # Prune skip directories early
        pruned = []
        for d in dirs:
            if d in SKIP_DIR_NAMES:
                continue
            if any(d.startswith(pref) for pref in SKIP_DIR_PREFIXES):
                continue
            pruned.append(d)
        dirs[:] = pruned

        for name in files:
            if not name.lower().endswith(".html"):
                continue
            filepath = os.path.join(root, name)
            if should_skip_path(filepath):
                skipped_count += 1
                continue
            scanned_count += 1

            if args.dry_run:
                try:
                    with open(filepath, "r", encoding="utf-8") as f:
                        content = f.read()
                    if "api-config.js" in content or INJECT_MARKER in content:
                        continue
                    print(f"[DRY] Would patch: {os.path.relpath(filepath, base_dir)}")
                except Exception as e:
                    print(f"[ERROR] {os.path.basename(filepath)} - Error: {e}")
                continue

            if add_api_scripts(filepath):
                added_count += 1

    print("=" * 60)
    if args.dry_run:
        print("[DONE] Dry run complete.")
    else:
        print(f"[SUCCESS] Added API scripts to {added_count} pages")
    print(f"[STATS] scanned={scanned_count} skipped={skipped_count}")
    print("=" * 60)

if __name__ == '__main__':
    main()
