from __future__ import annotations

import argparse
import json
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import URLError
from urllib.request import Request, urlopen


def fetch(url: str, timeout_s: int = 8) -> dict:
    started = time.time()
    try:
        req = Request(url, headers={"User-Agent": "cssberlin-health/1.0"})
        with urlopen(req, timeout=timeout_s) as resp:
            body = resp.read(2048)
            elapsed_ms = int((time.time() - started) * 1000)
            return {
                "url": url,
                "ok": 200 <= resp.status < 400,
                "status": resp.status,
                "elapsed_ms": elapsed_ms,
                "body_preview": body.decode("utf-8", errors="replace"),
            }
    except URLError as e:
        elapsed_ms = int((time.time() - started) * 1000)
        return {
            "url": url,
            "ok": False,
            "status": None,
            "elapsed_ms": elapsed_ms,
            "error": str(e),
        }


def main() -> None:
    p = argparse.ArgumentParser(description="CSS Berlin health report (frontend + backend).")
    p.add_argument("--api-url", default="http://127.0.0.1:8000", help="Backend base URL")
    p.add_argument("--frontend-url", default="https://css-berlin.pages.dev", help="Frontend base URL")
    p.add_argument("--timeout", type=int, default=8, help="Request timeout (seconds)")
    args = p.parse_args()

    ts = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    repo_root = Path(__file__).resolve().parents[1]
    reports_dir = repo_root / "ops" / "reports"
    reports_dir.mkdir(parents=True, exist_ok=True)

    checks = [
        f"{args.api_url.rstrip('/')}/health",
        f"{args.api_url.rstrip('/')}/api/products",
        f"{args.frontend_url.rstrip('/')}/",
        f"{args.frontend_url.rstrip('/')}/index.html",
    ]

    results = [fetch(u, timeout_s=args.timeout) for u in checks]
    ok = all(r.get("ok") for r in results)

    md_lines = []
    md_lines.append(f"# CSS Berlin Health Report\n")
    md_lines.append(f"- Generated (UTC): **{datetime.now(timezone.utc).isoformat()}**\n")
    md_lines.append(f"- Overall: **{'OK' if ok else 'FAIL'}**\n")
    md_lines.append("\n## Checks\n")
    md_lines.append("| URL | Status | Time |\n")
    md_lines.append("|---|---:|---:|\n")
    for r in results:
        status = r.get("status")
        status_s = str(status) if status is not None else "ERR"
        md_lines.append(f"| `{r['url']}` | {status_s} | {r.get('elapsed_ms', 0)}ms |\n")

    md_lines.append("\n## Details\n")
    for r in results:
        md_lines.append(f"### `{r['url']}`\n")
        md_lines.append(f"- ok: `{r.get('ok')}`\n")
        if r.get("status") is not None:
            md_lines.append(f"- status: `{r.get('status')}`\n")
        if r.get("error"):
            md_lines.append(f"- error: `{r.get('error')}`\n")
        if r.get("body_preview"):
            preview = r["body_preview"].replace("\n", "\\n")
            md_lines.append(f"- body_preview: `{preview[:500]}`\n")
        md_lines.append("\n")

    report_md = reports_dir / f"health-{ts}.md"
    report_json = reports_dir / f"health-{ts}.json"

    report_md.write_text("".join(md_lines), encoding="utf-8")
    report_json.write_text(json.dumps({"ts": ts, "ok": ok, "results": results}, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"[health_report] ok={ok} report={report_md}")


if __name__ == "__main__":
    main()

