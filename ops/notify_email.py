from __future__ import annotations

import argparse
import os
import smtplib
from email.message import EmailMessage
from pathlib import Path
from typing import Iterable


def _split_recipients(values: Iterable[str]) -> list[str]:
    out: list[str] = []
    for v in values:
        for part in v.split(","):
            part = part.strip()
            if part:
                out.append(part)
    return out


def send_email(*, subject: str, body: str, to_addrs: list[str]) -> None:
    """
    SMTP sender. Secrets are read from env:
    - SMTP_HOST (required)
    - SMTP_PORT (default 587)
    - SMTP_USER (optional)
    - SMTP_PASS (optional)
    - SMTP_STARTTLS (default 1)
    - SMTP_FROM (default SMTP_USER)
    """
    host = os.getenv("SMTP_HOST")
    if not host:
        raise RuntimeError("Missing SMTP_HOST env var")

    port = int(os.getenv("SMTP_PORT", "587"))
    user = os.getenv("SMTP_USER", "")
    password = os.getenv("SMTP_PASS", "")
    starttls = bool(int(os.getenv("SMTP_STARTTLS", "1")))
    from_addr = os.getenv("SMTP_FROM") or user
    if not from_addr:
        raise RuntimeError("Missing SMTP_FROM (or SMTP_USER) env var")

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = from_addr
    msg["To"] = ", ".join(to_addrs)
    msg.set_content(body)

    with smtplib.SMTP(host=host, port=port, timeout=30) as smtp:
        if starttls:
            smtp.starttls()
        if user and password:
            smtp.login(user, password)
        smtp.send_message(msg)


def main() -> int:
    ap = argparse.ArgumentParser(description="Send notification email via SMTP.")
    ap.add_argument("--to", action="append", default=[], help="Recipient(s). Can be repeated or comma-separated.")
    ap.add_argument("--subject", required=True)
    ap.add_argument("--body", default=None, help="Body text (if not using --body-file)")
    ap.add_argument("--body-file", default=None, help="Path to body text file")
    args = ap.parse_args()

    to_addrs = _split_recipients(args.to) if args.to else ["info@cssberlin.de", "ceyhuns.sorguc@gmail.com"]

    body = ""
    if args.body_file:
        body = Path(args.body_file).read_text(encoding="utf-8", errors="ignore")
    elif args.body is not None:
        body = args.body
    else:
        raise SystemExit("Provide --body or --body-file")

    send_email(subject=args.subject, body=body, to_addrs=to_addrs)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

