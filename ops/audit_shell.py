from __future__ import annotations

import argparse
import json
import os
import re
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Iterable


RE_HAS_API_CONFIG = re.compile(r"<script[^>]+src=[\"']api-config\.js", re.IGNORECASE)
RE_HAS_GLOBAL_HEADER_SCRIPT = re.compile(r"<script[^>]+src=[\"']global-header\.js", re.IGNORECASE)
RE_HAS_INLINE_NEWS = re.compile(r"class=[\"'][^\"']*news-banner-v2[^\"']*[\"']", re.IGNORECASE)
RE_HAS_INLINE_HEADER = re.compile(r"<header[^>]+class=[\"'][^\"']*header-v2[^\"']*[\"']", re.IGNORECASE)
RE_HAS_INLINE_FOOTER_NEWS = re.compile(r"footer-news-banner", re.IGNORECASE)
RE_HAS_FOOTER_TAG = re.compile(r"<footer[^>]+class=[\"'][^\"']*footer[^\"']*[\"']", re.IGNORECASE)


@dataclass(frozen=True)
class ShellSignals:
    path: str
    has_api_config: bool
    has_global_header_script: bool
    has_inline_news_banner: bool
    has_inline_header_v2: bool
    has_footer_tag: bool
    has_footer_news_banner: bool

    @property
    def has_inline_shell(self) -> bool:
        return bool(self.has_inline_news_banner or self.has_inline_header_v2 or self.has_footer_tag or self.has_footer_news_banner)

    @property
    def likely_duplicate_risk(self) -> bool:
        # If api-config auto-loads GlobalHeader and page also contains inline shell,
        # older versions would duplicate. Even after idempotent fix, these are still
        # pages worth standardizing/simplifying.
        return bool(self.has_api_config and self.has_inline_shell)


def iter_html_files(root: Path) -> Iterable[Path]:
    skip_dirs = {
        ".git",
        ".cursor",
        "node_modules",
        "__pycache__",
        "tests",
        "accounting_system",
        "backup-2025-11-08",
        "frontend\\backup-2025-11-08",
    }

    for p in root.rglob("*.html"):
        rel = str(p.relative_to(root))
        # skip common backup/test bundles
        if any(part in skip_dirs for part in p.parts):
            continue
        # skip email templates and snippets
        if "email-templates" in p.parts:
            continue
        if rel.endswith("_header_template.html") or rel.endswith("platform-selector-snippet.html"):
            continue
        yield p


def scan_file(path: Path, root: Path) -> ShellSignals:
    try:
        text = path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        text = ""

    rel = str(path.relative_to(root)).replace("\\", "/")
    return ShellSignals(
        path=rel,
        has_api_config=bool(RE_HAS_API_CONFIG.search(text)),
        has_global_header_script=bool(RE_HAS_GLOBAL_HEADER_SCRIPT.search(text)),
        has_inline_news_banner=bool(RE_HAS_INLINE_NEWS.search(text)),
        has_inline_header_v2=bool(RE_HAS_INLINE_HEADER.search(text)),
        has_footer_tag=bool(RE_HAS_FOOTER_TAG.search(text)),
        has_footer_news_banner=bool(RE_HAS_INLINE_FOOTER_NEWS.search(text)),
    )


def main() -> int:
    ap = argparse.ArgumentParser(description="Audit HTML pages for inline shell duplication risk.")
    ap.add_argument("--root", default=".", help="Repo root")
    ap.add_argument("--out-json", default="reports/ui-shell-audit.json")
    ap.add_argument("--out-md", default="reports/ui-shell-audit.md")
    args = ap.parse_args()

    root = Path(args.root).resolve()
    results = [scan_file(p, root) for p in iter_html_files(root)]

    risky = [r for r in results if r.likely_duplicate_risk]
    risky_sorted = sorted(risky, key=lambda r: r.path)

    payload = {
        "root": str(root),
        "count_total_html": len(results),
        "count_risky": len(risky_sorted),
        "items": [asdict(r) | {"has_inline_shell": r.has_inline_shell, "likely_duplicate_risk": r.likely_duplicate_risk} for r in results],
    }

    out_json = root / args.out_json
    out_json.parent.mkdir(parents=True, exist_ok=True)
    out_json.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")

    lines: list[str] = []
    lines.append("# UI Shell Audit")
    lines.append("")
    lines.append(f"- **root**: `{root}`")
    lines.append(f"- **total_html**: `{len(results)}`")
    lines.append(f"- **risky_inline+api-config**: `{len(risky_sorted)}`")
    lines.append("")
    lines.append("## Risky pages (inline shell + `api-config.js`)")
    lines.append("")
    if not risky_sorted:
        lines.append("- (none)")
    else:
        for r in risky_sorted:
            sigs = []
            if r.has_inline_news_banner:
                sigs.append("news-banner-v2")
            if r.has_inline_header_v2:
                sigs.append("header-v2")
            if r.has_footer_news_banner:
                sigs.append("footer-news-banner")
            if r.has_footer_tag and "footer" not in sigs:
                sigs.append("footer")
            lines.append(f"- `{r.path}` — {', '.join(sigs) if sigs else '(inline shell)'}")

    out_md = root / args.out_md
    out_md.parent.mkdir(parents=True, exist_ok=True)
    out_md.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"Wrote: {out_json}")
    print(f"Wrote: {out_md}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

