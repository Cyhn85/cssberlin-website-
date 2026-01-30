from __future__ import annotations

import os
import subprocess
import time
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]


def run(cmd: list[str], *, env: dict[str, str] | None = None) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        cmd,
        cwd=str(REPO_ROOT),
        env=env,
        text=True,
        capture_output=True,
    )


def main() -> int:
    run_id = os.getenv("MATRIX_RUN_ID") or (time.strftime("%Y%m%d-%H%M%S") + f"-{os.getpid()}")
    base_env = dict(os.environ)
    base_env["MATRIX_RUN_ID"] = run_id

    # 1) UI audit (cheap, fast)
    audit = run(["python", "ops/audit_shell.py", "--root", ".", "--out-json", "reports/ui-shell-audit.json", "--out-md", "reports/ui-shell-audit.md"], env=base_env)
    if audit.returncode != 0:
        print(audit.stdout)
        print(audit.stderr)

    # 2) Matrix run (E2E)
    matrix = run(["python", "tests/simulation/run_matrix.py", "--headless"], env=base_env)
    # Always print stdout/stderr to preserve CI logs
    if matrix.stdout:
        print(matrix.stdout)
    if matrix.stderr:
        print(matrix.stderr)

    # 3) Triage + (optional) PR
    create_pr = bool(int(os.getenv("AUTO_PR", "0")))
    triage_cmd = ["python", "ops/triage_and_pr.py", "--out-md", "reports/triage/latest.md"]
    if create_pr:
        triage_cmd.append("--create-pr")
    triage = run(triage_cmd, env=base_env)
    if triage.stdout:
        print(triage.stdout)
    if triage.stderr:
        print(triage.stderr)

    pr_url = None
    pr_number = None
    if create_pr:
        # If a PR was created, triage prints the URL.
        for line in (triage.stdout or "").splitlines():
            s = line.strip()
            if s.startswith("http"):
                pr_url = s
                try:
                    pr_number = int(s.rstrip("/").split("/")[-1])
                except Exception:
                    pr_number = None

    # 4) Email notify (optional)
    notify = bool(int(os.getenv("AUTO_NOTIFY", "0")))
    if notify:
        subject = f"CSSBerlin Bot Report — {run_id}" + (f" — PR: {pr_url}" if pr_url else "")
        body = (REPO_ROOT / "reports/triage/latest.md").read_text(encoding="utf-8", errors="ignore")
        if pr_url:
            body = f"{body}\n\nPR: {pr_url}\n"
            body = f"{body}\nOnay akışı: PR sayfasında GitHub Review → Approve (veya Reject/Request changes).\n"

        # Optional one-click approve/reject callbacks
        ops_base = os.getenv("OPS_CALLBACK_BASE", "").rstrip("/")
        ops_token = os.getenv("OPS_TOKEN", "")
        ops_repo = os.getenv("OPS_GH_REPO", "")
        if pr_number and ops_base and ops_token:
            approve_url = f"{ops_base}/ops/approve?token={ops_token}&pr={pr_number}" + (f"&repo={ops_repo}" if ops_repo else "")
            reject_url = f"{ops_base}/ops/reject?token={ops_token}&pr={pr_number}" + (f"&repo={ops_repo}" if ops_repo else "")
            body = f"{body}\n\nApprove: {approve_url}\nReject: {reject_url}\n"
        mail = run(
            [
                "python",
                "ops/notify_email.py",
                "--subject",
                subject,
                "--body",
                body,
                "--to",
                "info@cssberlin.de,ceyhuns.sorguc@gmail.com",
            ],
            env=base_env,
        )
        if mail.stdout:
            print(mail.stdout)
        if mail.stderr:
            print(mail.stderr)
        if mail.returncode != 0:
            return 2

    # Exit code mirrors matrix run (0 OK, 1 failed)
    return matrix.returncode


if __name__ == "__main__":
    raise SystemExit(main())

