from __future__ import annotations

from pathlib import Path


def enforce_retention(*, artifacts_root: Path, keep_last: int = 20) -> list[Path]:
    """
    Keep newest N artifact directories (by mtime), delete older ones.
    Returns deleted directories.
    """
    if keep_last <= 0:
        return []

    if not artifacts_root.exists():
        return []

    dirs = [p for p in artifacts_root.iterdir() if p.is_dir()]
    dirs_sorted = sorted(dirs, key=lambda p: p.stat().st_mtime, reverse=True)
    to_delete = dirs_sorted[keep_last:]
    deleted: list[Path] = []

    for d in to_delete:
        # best-effort recursive delete
        for child in sorted(d.rglob("*"), key=lambda p: len(p.parts), reverse=True):
            try:
                if child.is_file() or child.is_symlink():
                    child.unlink()
                elif child.is_dir():
                    child.rmdir()
            except Exception:
                pass
        try:
            d.rmdir()
            deleted.append(d)
        except Exception:
            pass

    return deleted

