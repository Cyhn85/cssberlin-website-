from __future__ import annotations

import json
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from playwright.async_api import Page


def _now_ts() -> float:
    return time.time()


@dataclass(frozen=True)
class RunArtifacts:
    """
    Per-run artifact writer.
    Writes JSONL events + a human-readable console log.
    """

    run_id: str
    artifacts_dir: Path

    @property
    def events_path(self) -> Path:
        return self.artifacts_dir / "events.jsonl"

    @property
    def console_path(self) -> Path:
        return self.artifacts_dir / "console.log"

    def ensure_dirs(self) -> None:
        self.artifacts_dir.mkdir(parents=True, exist_ok=True)

    def write_event(self, event: dict[str, Any]) -> None:
        self.ensure_dirs()
        line = json.dumps(event, ensure_ascii=False)
        self.events_path.open("a", encoding="utf-8").write(line + "\n")

    def write_console_line(self, line: str) -> None:
        self.ensure_dirs()
        self.console_path.open("a", encoding="utf-8").write(line.rstrip("\n") + "\n")

    def attach_page(self, *, page: Page, bot: str) -> None:
        """
        Attach Playwright page listeners (console, pageerror, requestfailed).
        """

        def log_event(kind: str, payload: dict[str, Any]) -> None:
            ev = {
                "ts": _now_ts(),
                "run_id": self.run_id,
                "bot": bot,
                "kind": kind,
                **payload,
            }
            self.write_event(ev)

        page.on(
            "console",
            lambda msg: (
                log_event(
                    "console",
                    {
                        "type": msg.type,
                        "text": msg.text,
                        "location": getattr(msg, "location", None),
                    },
                ),
                self.write_console_line(f"[{bot}] console.{msg.type}: {msg.text}"),
            ),
        )

        page.on(
            "pageerror",
            lambda exc: (
                log_event("pageerror", {"error": str(exc)}),
                self.write_console_line(f"[{bot}] pageerror: {exc}"),
            ),
        )

        page.on(
            "requestfailed",
            lambda req: (
                log_event(
                    "requestfailed",
                    {
                        "url": req.url,
                        "method": req.method,
                        "resource_type": req.resource_type,
                        "failure": (req.failure or {}),
                    },
                ),
                self.write_console_line(f"[{bot}] requestfailed: {req.method} {req.url} {(req.failure or {}).get('errorText','')}"),
            ),
        )

