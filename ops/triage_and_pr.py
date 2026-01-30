from __future__ import annotations

import argparse
import json
import os
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS_ROOT = REPO_ROOT / "tests" / "simulation" / "artifacts"


def _load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _read_events(events_path: Path, limit: int = 5000) -> list[dict[str, Any]]:
    events: list[dict[str, Any]] = []
    if not events_path.exists():
        return events
    with events_path.open("r", encoding="utf-8", errors="ignore") as f:
        for i, line in enumerate(f):
            if i >= limit:
                break
            line = line.strip()
            if not line:
                continue
            try:
                events.append(json.loads(line))
            except Exception:
                continue
    return events


def _latest_run_dir() -> Path | None:
    if not ARTIFACTS_ROOT.exists():
        return None
    dirs = [p for p in ARTIFACTS_ROOT.iterdir() if p.is_dir()]
    if not dirs:
        return None
    return sorted(dirs, key=lambda p: p.stat().st_mtime, reverse=True)[0]


def _summarize_events(events: list[dict[str, Any]]) -> dict[str, Any]:
    pageerrors = [e for e in events if e.get("kind") == "pageerror"]
    reqfails = [e for e in events if e.get("kind") == "requestfailed"]
    console_err = [e for e in events if e.get("kind") == "console" and e.get("type") in ("error", "warning")]

    def top_text(items: list[dict[str, Any]], key: str, n: int = 10) -> list[str]:
        out: list[str] = []
        for it in items[:n]:
            v = it.get(key)
            if v:
                out.append(str(v))
        return out

    return {
        "counts": {
            "events": len(events),
            "pageerror": len(pageerrors),
            "requestfailed": len(reqfails),
            "console_error_or_warning": len(console_err),
        },
        "top": {
            "pageerror": top_text(pageerrors, "error"),
            "requestfailed": [f"{e.get('method','?')} {e.get('url','?')} {(e.get('failure') or {}).get('errorText','')}".strip() for e in reqfails[:10]],
            "console": top_text(console_err, "text"),
        },
    }


def _write_triage_md(*, out_path: Path, run_id: str, report: dict[str, Any], audit: dict[str, Any] | None, events_summary: dict[str, Any]) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    lines: list[str] = []

    lines.append("# CSSBerlin — Auto Triage Report")
    lines.append("")
    lines.append(f"- **run_id**: `{run_id}`")
    lines.append(f"- **generated_at**: `{datetime.utcnow().isoformat()}Z`")
    lines.append("")

    errors = report.get("errors") or []
    lines.append("## Matrix run result")
    lines.append("")
    if errors:
        lines.append(f"- **status**: FAIL (`{len(errors)}` error)")
        for e in errors[:10]:
            lines.append(f"  - `{e}`")
    else:
        lines.append("- **status**: OK")

    lines.append("")
    lines.append("## Browser-level signals (Playwright listeners)")
    lines.append("")
    lines.append(f"- **events**: `{events_summary['counts']['events']}`")
    lines.append(f"- **pageerror**: `{events_summary['counts']['pageerror']}`")
    lines.append(f"- **requestfailed**: `{events_summary['counts']['requestfailed']}`")
    lines.append(f"- **console_error_or_warning**: `{events_summary['counts']['console_error_or_warning']}`")

    if events_summary["top"]["pageerror"]:
        lines.append("")
        lines.append("### Top page errors")
        lines.append("")
        for t in events_summary["top"]["pageerror"]:
            lines.append(f"- `{t}`")

    if events_summary["top"]["requestfailed"]:
        lines.append("")
        lines.append("### Top failed requests")
        lines.append("")
        for t in events_summary["top"]["requestfailed"]:
            lines.append(f"- `{t}`")

    if audit is not None:
        lines.append("")
        lines.append("## UI shell audit signals")
        lines.append("")
        lines.append(f"- **risky_inline+api-config**: `{audit.get('count_risky')}`")
        lines.append("- **note**: risky pages are candidates for simplification (remove inline header/footer and rely on GlobalHeader injection).")

    lines.append("")
    lines.append("## Suggested next fixes (manual review)")
    lines.append("")
    lines.append("- If the run fails on missing product cards, verify backend connectivity for local runs (`api-config.js` points to `http://localhost:8000` on `127.0.0.1`).")
    lines.append("- Investigate `pageerror` entries; fix only high-confidence issues automatically.")
    lines.append("")

    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def _run(cmd: list[str]) -> None:
    subprocess.run(cmd, cwd=str(REPO_ROOT), check=True)


def maybe_create_pr(*, title: str, body_path: Path, branch_name: str) -> str | None:
    """
    Create a PR from current working tree changes.
    Requires:
    - git configured with remote origin
    - gh CLI authenticated (GITHUB_TOKEN or `gh auth login`)
    """
    status = subprocess.run(["git", "status", "--porcelain"], cwd=str(REPO_ROOT), capture_output=True, text=True)
    if status.returncode != 0:
        raise RuntimeError(status.stderr.strip() or "git status failed")
    if not status.stdout.strip():
        return None

    _run(["git", "checkout", "-b", branch_name])
    _run(["git", "add", "."])
    _run(["git", "commit", "-m", title])
    _run(["git", "push", "-u", "origin", branch_name])

    pr = subprocess.run(
        ["gh", "pr", "create", "--title", title, "--body-file", str(body_path), "--base", "main"],
        cwd=str(REPO_ROOT),
        capture_output=True,
        text=True,
    )
    if pr.returncode != 0:
        raise RuntimeError(pr.stderr.strip() or "gh pr create failed")
    # gh prints PR URL
    return pr.stdout.strip().splitlines()[-1].strip() if pr.stdout.strip() else None


def main() -> int:
    ap = argparse.ArgumentParser(description="Read Matrix artifacts + audit and create a triage report (optionally open PR).")
    ap.add_argument("--run-dir", help="Path to tests/simulation/artifacts/<run_id> (defaults to latest)")
    ap.add_argument("--audit-json", default="reports/ui-shell-audit.json", help="Audit JSON path")
    ap.add_argument("--out-md", default="reports/triage/latest.md", help="Output triage markdown")
    ap.add_argument("--create-pr", action="store_true", help="If there are repo changes, open a PR via gh")
    args = ap.parse_args()

    run_dir = Path(args.run_dir).resolve() if args.run_dir else (_latest_run_dir() or None)
    if not run_dir:
        raise SystemExit("No artifact run dir found.")

    report_path = run_dir / "report.json"
    if not report_path.exists():
        raise SystemExit(f"Missing report.json in {run_dir}")

    report = _load_json(report_path)
    run_id = report.get("run_id") or run_dir.name

    events = _read_events(run_dir / "events.jsonl")
    events_summary = _summarize_events(events)

    audit_path = (REPO_ROOT / args.audit_json).resolve()
    audit = _load_json(audit_path) if audit_path.exists() else None

    out_md = (REPO_ROOT / args.out_md).resolve()
    _write_triage_md(out_path=out_md, run_id=run_id, report=report, audit=audit, events_summary=events_summary)

    if args.create_pr:
        title = f"chore(matrix): triage report {run_id}"
        pr_url = maybe_create_pr(title=title, body_path=out_md, branch_name=f"matrix/triage-{run_id}")
        if pr_url:
            print(pr_url)
        else:
            print("No changes to PR.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

