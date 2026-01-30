from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from pathlib import Path


@dataclass(frozen=True)
class MatrixPaths:
    repo_root: Path
    simulation_root: Path
    run_id: str
    artifacts_dir: Path
    screenshots_dir: Path
    report_path: Path
    report_json_path: Path
    seed_data_dir: Path
    db_path: Path


def resolve_paths(db_path: str | None = None, *, run_id: str | None = None) -> MatrixPaths:
    simulation_root = Path(__file__).resolve().parents[1]  # tests/simulation
    repo_root = simulation_root.parents[1]

    resolved_run_id = run_id or datetime.now().strftime("%Y%m%d-%H%M%S")
    artifacts_dir = simulation_root / "artifacts" / resolved_run_id
    screenshots_dir = artifacts_dir / "screenshots"
    report_path = artifacts_dir / "REPORT.md"
    report_json_path = artifacts_dir / "report.json"
    seed_data_dir = repo_root / "seed_data"
    # Backend uses sqlite+aiosqlite:///./cssberlin.db (relative to backend process CWD),
    # so DB might exist either in repo root or in ./backend/ depending on how uvicorn was started.
    if db_path:
        candidate = Path(db_path).expanduser().resolve()
        if candidate.exists():
            resolved_db_path = candidate
        else:
            # fallback: try common locations
            fallback_a = (repo_root / "cssberlin.db")
            fallback_b = (repo_root / "backend" / "cssberlin.db")
            resolved_db_path = fallback_a if fallback_a.exists() else fallback_b
    else:
        resolved_db_path = (repo_root / "cssberlin.db") if (repo_root / "cssberlin.db").exists() else (repo_root / "backend" / "cssberlin.db")

    return MatrixPaths(
        repo_root=repo_root,
        simulation_root=simulation_root,
        run_id=resolved_run_id,
        artifacts_dir=artifacts_dir,
        screenshots_dir=screenshots_dir,
        report_path=report_path,
        report_json_path=report_json_path,
        seed_data_dir=seed_data_dir,
        db_path=resolved_db_path,
    )

