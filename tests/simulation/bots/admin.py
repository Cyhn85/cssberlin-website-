from __future__ import annotations

import asyncio
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

import aiosqlite
from playwright.async_api import BrowserContext

from ..state import MatrixState
from ..utils.artifacts import RunArtifacts
from ..utils.logging import log
from ..utils.screenshot import screenshot_on_error
from .base import ActorIdentity, BaseBot


@dataclass(frozen=True)
class DbStats:
    offers: int
    orders: int
    payments: int
    revenue: float


class AdminBot(BaseBot):
    def __init__(
        self,
        *,
        identity: ActorIdentity,
        context: BrowserContext,
        base_url: str,
        db_path: Path,
        report_path: Path,
        state: MatrixState,
        screenshots_dir: Path,
        artifacts: RunArtifacts | None = None,
    ):
        super().__init__(identity=identity, context=context, base_url=base_url, artifacts=artifacts)
        self.db_path = db_path
        self.report_path = report_path
        self.state = state
        self.screenshots_dir = screenshots_dir

        self._banned_words = ["yasaklı", "yasakli", "banned"]

    async def _read_stats(self) -> DbStats:
        try:
            async with aiosqlite.connect(self.db_path) as db:
                async def scalar(q: str, params: tuple = ()) -> int:
                    async with db.execute(q, params) as cur:
                        row = await cur.fetchone()
                        return int(row[0] or 0)

                async def scalar_float(q: str, params: tuple = ()) -> float:
                    async with db.execute(q, params) as cur:
                        row = await cur.fetchone()
                        return float(row[0] or 0.0)

                offers = await scalar("SELECT COUNT(*) FROM offers")
                orders = await scalar("SELECT COUNT(*) FROM orders")
                payments = await scalar("SELECT COUNT(*) FROM payments")
                revenue = await scalar_float("SELECT COALESCE(SUM(amount),0) FROM payments WHERE status='paid'")
                return DbStats(offers=offers, orders=orders, payments=payments, revenue=revenue)
        except Exception:
            # DB path might be wrong, or tables not created yet.
            return DbStats(offers=0, orders=0, payments=0, revenue=0.0)

    async def _check_latest_product_for_banned_words(self) -> Optional[str]:
        try:
            async with aiosqlite.connect(self.db_path) as db:
                async with db.execute("SELECT name, description FROM products ORDER BY created_at DESC LIMIT 1") as cur:
                    row = await cur.fetchone()
                    if not row:
                        return None
                    name, desc = (row[0] or ""), (row[1] or "")
                    hay = f"{name}\n{desc}".lower()
                    for w in self._banned_words:
                        if w in hay:
                            return w
            return None
        except Exception:
            return None

    async def _write_report(self, *, stats: DbStats) -> None:
        product_id = self.state.product_id
        offer_id = self.state.offer_id
        order_id = self.state.order_id
        agreed = self.state.agreed_price

        sold_count = 0
        if product_id:
            try:
                async with aiosqlite.connect(self.db_path) as db:
                    async with db.execute("SELECT is_sold FROM products WHERE id = ?", (product_id,)) as cur:
                        row = await cur.fetchone()
                        if row and int(row[0] or 0) == 1:
                            sold_count = 1
            except Exception:
                sold_count = 0

        offers_for_product = 0
        if product_id:
            try:
                async with aiosqlite.connect(self.db_path) as db:
                    async with db.execute("SELECT COUNT(*) FROM offers WHERE product_id = ?", (product_id,)) as cur:
                        row = await cur.fetchone()
                        offers_for_product = int(row[0] or 0)
            except Exception:
                offers_for_product = 0

        # Revenue for this order
        revenue_for_order = 0.0
        if order_id:
            try:
                async with aiosqlite.connect(self.db_path) as db:
                    async with db.execute("SELECT COALESCE(SUM(amount),0) FROM payments WHERE order_id = ?", (order_id,)) as cur:
                        row = await cur.fetchone()
                        revenue_for_order = float(row[0] or 0.0)
            except Exception:
                revenue_for_order = 0.0

        lines = [
            "## The Matrix — Simulation Report",
            "",
            "### Summary",
            f"- **X ürün satıldı**: {sold_count}",
            f"- **Y pazarlık yapıldı**: {offers_for_product}",
            f"- **Z ciro elde edildi**: €{revenue_for_order:.2f}",
            "",
            "### IDs",
            f"- **product_id**: {product_id}",
            f"- **offer_id**: {offer_id}",
            f"- **order_id**: {order_id}",
            f"- **agreed_price**: {agreed}",
            "",
            "### Live DB Totals (all-time in this DB)",
            f"- **offers**: {stats.offers}",
            f"- **orders**: {stats.orders}",
            f"- **payments**: {stats.payments}",
            f"- **revenue(paid)**: €{stats.revenue:.2f}",
            "",
        ]
        self.report_path.parent.mkdir(parents=True, exist_ok=True)
        self.report_path.write_text("\n".join(lines), encoding="utf-8")

    async def run(self) -> None:
        bot = "ADMIN"
        page = None
        last_stats: Optional[DbStats] = None
        try:
            page = await self.new_page()

            # Visible: open "admin-ish" panel page (we don't depend on its functionality)
            await self.inject_auth_storage(
                access_token="admin-demo-token",
                user={"id": 999999, "email": "admin@cssberlin.de", "first_name": "Admin", "last_name": "Bot", "role": "admin"},
            )
            await page.goto(f"{self.base_url}/mein-konto.html", wait_until="domcontentloaded")
            log(bot, "Admin paneline girdi (demo UI).", "OK")

            log(bot, f"DB izleme başladı: {self.db_path}", "INFO")

            # Monitor until simulation done
            while not (self.state.review_left.is_set() or self.state.done.is_set()):
                try:
                    stats = await self._read_stats()
                    if last_stats is None:
                        last_stats = stats
                    else:
                        if stats.offers != last_stats.offers:
                            log(bot, f"offers arttı: {last_stats.offers} → {stats.offers}", "OK")
                        if stats.orders != last_stats.orders:
                            log(bot, f"orders arttı: {last_stats.orders} → {stats.orders}", "OK")
                        if stats.payments != last_stats.payments:
                            log(bot, f"payments arttı: {last_stats.payments} → {stats.payments}", "OK")
                        last_stats = stats

                    banned = await self._check_latest_product_for_banned_words()
                    if banned:
                        log(bot, f"YASAKLI KELİME yakalandı: '{banned}'", "WARN")
                except Exception as inner:
                    log(bot, f"DB izleme hata: {inner}", "WARN")

                await asyncio.sleep(1.0)

            # Final report
            final_stats = await self._read_stats()
            await self._write_report(stats=final_stats)
            log(bot, f"REPORT.md yazıldı: {self.report_path}", "OK")

        except asyncio.CancelledError:
            # Best-effort report on cancellation (e.g., other bot failed).
            try:
                final_stats = await self._read_stats()
                await self._write_report(stats=final_stats)
            except Exception:
                pass
            log(bot, "İptal edildi (başka bot hata verdi).", "WARN")
            raise
        except Exception as e:
            shot = await screenshot_on_error(page, self.screenshots_dir, "admin")
            log(bot, f"HATA: {e} (screenshot={shot})", "ERR")
            raise

