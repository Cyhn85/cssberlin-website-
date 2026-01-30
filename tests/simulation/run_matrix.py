from __future__ import annotations

import argparse
import asyncio
import os
import sys
from pathlib import Path

from playwright.async_api import async_playwright

# Allow running as a file: `python tests/simulation/run_matrix.py`
REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from tests.simulation.bots.admin import AdminBot  # noqa: E402
from tests.simulation.bots.base import ActorIdentity  # noqa: E402
from tests.simulation.bots.buyer import BuyerBot  # noqa: E402
from tests.simulation.bots.seller import SellerBot  # noqa: E402
from tests.simulation.state import MatrixState  # noqa: E402
from tests.simulation.utils.logging import log  # noqa: E402
from tests.simulation.utils.paths import resolve_paths  # noqa: E402
from tests.simulation.utils.static_server import StaticServer  # noqa: E402


def build_arg_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="The Matrix - multi-actor E2E simulation (async Playwright)")
    p.add_argument("--api-url", default=os.getenv("MATRIX_API_URL", "http://127.0.0.1:8000"), help="Backend API base URL")
    p.add_argument("--db-path", default=os.getenv("MATRIX_DB_PATH"), help="SQLite DB path for admin monitoring")
    p.add_argument("--headless", action="store_true", default=bool(int(os.getenv("MATRIX_HEADLESS", "0"))))
    p.add_argument("--slowmo-ms", type=int, default=int(os.getenv("MATRIX_SLOWMO_MS", "0")))
    return p


async def main() -> int:
    args = build_arg_parser().parse_args()
    paths = resolve_paths(db_path=args.db_path)

    # Ensure dirs exist
    paths.screenshots_dir.mkdir(parents=True, exist_ok=True)

    # Serve repo root over HTTP so Playwright can load index/inserieren/checkout and seed_data images
    # Important: backend CORS allows http://127.0.0.1:5500 (common Live Server),
    # so we try to bind 5500 first to avoid CORS blocking product fetches.
    static = StaticServer(root_dir=paths.repo_root, host="127.0.0.1", port=5500)
    try:
        server = static.start()
    except OSError:
        static = StaticServer(root_dir=paths.repo_root, host="127.0.0.1", port=0)
        server = static.start()

    log("MATRIX", f"Static server up: {server.base_url}", "OK")
    log("MATRIX", f"API: {args.api_url}", "INFO")
    log("MATRIX", f"DB: {paths.db_path}", "INFO")

    state = MatrixState()

    seller_identity = ActorIdentity(
        bot_name="SATICI",
        email=f"matrix-seller-{os.getpid()}@cssberlin.de",
        password="Matrix123!",
        first_name="Matrix",
        last_name="Seller",
    )
    buyer_identity = ActorIdentity(
        bot_name="ALICI",
        email=f"matrix-buyer-{os.getpid()}@cssberlin.de",
        password="Matrix123!",
        first_name="Matrix",
        last_name="Buyer",
    )
    admin_identity = ActorIdentity(
        bot_name="ADMIN",
        email="admin@cssberlin.de",
        password="Matrix123!",
        first_name="Admin",
        last_name="Bot",
    )

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=args.headless, slow_mo=args.slowmo_ms)

            seller_ctx = await browser.new_context(viewport={"width": 1280, "height": 800})
            buyer_ctx = await browser.new_context(viewport={"width": 1280, "height": 800})
            admin_ctx = await browser.new_context(viewport={"width": 1200, "height": 780})

            # API request contexts (Playwright-native)
            seller_req = await p.request.new_context()
            buyer_req = await p.request.new_context()

            seller = SellerBot(
                identity=seller_identity,
                context=seller_ctx,
                request=seller_req,
                base_url=server.base_url,
                api_url=args.api_url,
                seed_data_dir=paths.seed_data_dir,
                state=state,
                screenshots_dir=paths.screenshots_dir,
            )

            buyer = BuyerBot(
                identity=buyer_identity,
                context=buyer_ctx,
                request=buyer_req,
                base_url=server.base_url,
                api_url=args.api_url,
                state=state,
                screenshots_dir=paths.screenshots_dir,
            )

            admin = AdminBot(
                identity=admin_identity,
                context=admin_ctx,
                base_url=server.base_url,
                db_path=paths.db_path,
                report_path=paths.report_path,
                state=state,
                screenshots_dir=paths.screenshots_dir,
            )

            async def runner():
                # Run all bots concurrently
                await asyncio.gather(
                    seller.run(),
                    buyer.run(),
                    admin.run(),
                )

            await runner()

            await seller_req.dispose()
            await buyer_req.dispose()
            await seller_ctx.close()
            await buyer_ctx.close()
            await admin_ctx.close()
            await browser.close()

        log("MATRIX", f"Done. Report: {paths.report_path}", "OK")
        return 0
    finally:
        static.stop()


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))

