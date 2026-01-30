from __future__ import annotations

import time
from pathlib import Path
from typing import Optional

from playwright.async_api import Page


async def screenshot_on_error(page: Optional[Page], screenshots_dir: Path, bot_slug: str) -> Optional[Path]:
    if page is None:
        return None
    screenshots_dir.mkdir(parents=True, exist_ok=True)
    ts = int(time.time() * 1000)
    path = screenshots_dir / f"{bot_slug}_{ts}.png"
    try:
        await page.screenshot(path=str(path), full_page=True)
        return path
    except Exception:
        return None

