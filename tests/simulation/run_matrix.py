from __future__ import annotations

import argparse
import asyncio
import os
import sys
import time
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
from tests.simulation.utils.artifacts import RunArtifacts  # noqa: E402
from tests.simulation.utils.retention import enforce_retention  # noqa: E402


def build_arg_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="The Matrix - multi-actor E2E simulation (async Playwright)")
    p.add_argument("--api-url", default=os.getenv("MATRIX_API_URL", "http://127.0.0.1:8000"), help="Backend API base URL")
    p.add_argument("--db-path", default=os.getenv("MATRIX_DB_PATH"), help="SQLite DB path for admin monitoring")
    p.add_argument("--headless", action="store_true", default=bool(int(os.getenv("MATRIX_HEADLESS", "0"))))
    p.add_argument("--slowmo-ms", type=int, default=int(os.getenv("MATRIX_SLOWMO_MS", "0")))
    return p


async def main() -> int:
    args = build_arg_parser().parse_args()
    run_id = os.getenv("MATRIX_RUN_ID") or time.strftime("%Y%m%d-%H%M%S") + f"-{os.getpid()}"
    paths = resolve_paths(db_path=args.db_path, run_id=run_id)

    # Ensure dirs exist
    paths.screenshots_dir.mkdir(parents=True, exist_ok=True)
    paths.artifacts_dir.mkdir(parents=True, exist_ok=True)

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
    log("MATRIX", f"Artifacts: {paths.artifacts_dir}", "INFO")

    state = MatrixState()
    artifacts = RunArtifacts(run_id=paths.run_id, artifacts_dir=paths.artifacts_dir)

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

            # Optional: record videos / traces for debugging
            record_video = bool(int(os.getenv("MATRIX_VIDEO", "0")))
            record_trace = bool(int(os.getenv("MATRIX_TRACE", "0")))
            video_dir = (paths.artifacts_dir / "video") if record_video else None
            if video_dir:
                video_dir.mkdir(parents=True, exist_ok=True)

            seller_ctx = await browser.new_context(
                viewport={"width": 1280, "height": 800},
                **({"record_video_dir": str(video_dir)} if video_dir else {}),
            )
            buyer_ctx = await browser.new_context(
                viewport={"width": 1280, "height": 800},
                **({"record_video_dir": str(video_dir)} if video_dir else {}),
            )
            admin_ctx = await browser.new_context(
                viewport={"width": 1200, "height": 780},
                **({"record_video_dir": str(video_dir)} if video_dir else {}),
            )

            if record_trace:
                await seller_ctx.tracing.start(screenshots=True, snapshots=True, sources=True)
                await buyer_ctx.tracing.start(screenshots=True, snapshots=True, sources=True)
                await admin_ctx.tracing.start(screenshots=True, snapshots=True, sources=True)

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
                artifacts=artifacts,
            )

            buyer = BuyerBot(
                identity=buyer_identity,
                context=buyer_ctx,
                request=buyer_req,
                base_url=server.base_url,
                api_url=args.api_url,
                state=state,
                screenshots_dir=paths.screenshots_dir,
                artifacts=artifacts,
            )

            admin = AdminBot(
                identity=admin_identity,
                context=admin_ctx,
                base_url=server.base_url,
                db_path=paths.db_path,
                report_path=paths.report_path,
                state=state,
                screenshots_dir=paths.screenshots_dir,
                artifacts=artifacts,
            )

            async def runner() -> list[str]:
                """
                Run bots concurrently. If any bot fails, mark state.done and stop others,
                but still allow artifacts + reports to be written.
                """
                errors: list[str] = []
                tasks = {
                    asyncio.create_task(seller.run(), name="seller"),
                    asyncio.create_task(buyer.run(), name="buyer"),
                    asyncio.create_task(admin.run(), name="admin"),
                }

                pending = set(tasks)
                while pending:
                    done, pending = await asyncio.wait(pending, return_when=asyncio.FIRST_EXCEPTION)
                    for t in done:
                        exc = t.exception()
                        if exc:
                            errors.append(f"{t.get_name()}: {exc}")
                            state.done.set()
                            for ptask in pending:
                                ptask.cancel()
                            await asyncio.gather(*pending, return_exceptions=True)
                            pending = set()
                            break

                return errors

            errors = await runner()

            if record_trace:
                trace_dir = paths.artifacts_dir / "traces"
                trace_dir.mkdir(parents=True, exist_ok=True)
                # Best-effort; ignore failures on early abort.
                try:
                    await seller_ctx.tracing.stop(path=str(trace_dir / "seller.zip"))
                except Exception:
                    pass
                try:
                    await buyer_ctx.tracing.stop(path=str(trace_dir / "buyer.zip"))
                except Exception:
                    pass
                try:
                    await admin_ctx.tracing.stop(path=str(trace_dir / "admin.zip"))
                except Exception:
                    pass

            await seller_req.dispose()
            await buyer_req.dispose()
            await seller_ctx.close()
            await buyer_ctx.close()
            await admin_ctx.close()
            await browser.close()

        if errors:
            log("MATRIX", f"Done with errors. Report: {paths.report_path}", "WARN")
            for e in errors[:5]:
                log("MATRIX", f"Error: {e}", "ERR")
        else:
            log("MATRIX", f"Done. Report: {paths.report_path}", "OK")

        # Write structured report JSON (minimal, machine-readable)
        try:
            paths.report_json_path.parent.mkdir(parents=True, exist_ok=True)
            paths.report_json_path.write_text(
                __import__("json").dumps(
                    {
                        "run_id": paths.run_id,
                        "artifacts_dir": str(paths.artifacts_dir),
                        "report_md": str(paths.report_path),
                        "screenshots_dir": str(paths.screenshots_dir),
                        "errors": errors,
                        "state": {
                            "product_id": state.product_id,
                            "offer_id": state.offer_id,
                            "order_id": state.order_id,
                            "shipment_id": state.shipment_id,
                            "agreed_price": state.agreed_price,
                        },
                    },
                    indent=2,
                    ensure_ascii=False,
                ),
                encoding="utf-8",
            )
        except Exception:
            pass

        # Retention: keep last N runs
        try:
            keep_last = int(os.getenv("MATRIX_KEEP_LAST", "20"))
            enforce_retention(artifacts_root=(paths.simulation_root / "artifacts"), keep_last=keep_last)
        except Exception:
            pass

        return 1 if errors else 0
    finally:
        static.stop()


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))

