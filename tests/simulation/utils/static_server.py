from __future__ import annotations

import contextlib
import functools
import threading
from dataclasses import dataclass
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Optional


@dataclass(frozen=True)
class StaticServerInfo:
    host: str
    port: int
    root_dir: Path

    @property
    def base_url(self) -> str:
        return f"https://{self.host}:{self.port}"


class StaticServer:
    """
    Minimal static server for this repo root so Playwright can load pages over HTTP
    (and our seed_data SVGs are accessible).
    """

    def __init__(self, root_dir: Path, host: str = "127.0.0.1", port: int = 0):
        self._root_dir = Path(root_dir).resolve()
        self._host = host
        self._port = port
        self._httpd: Optional[ThreadingHTTPServer] = None
        self._thread: Optional[threading.Thread] = None

    def start(self) -> StaticServerInfo:
        handler = functools.partial(SimpleHTTPRequestHandler, directory=str(self._root_dir))
        httpd = ThreadingHTTPServer((self._host, self._port), handler)
        self._httpd = httpd

        thread = threading.Thread(target=httpd.serve_forever, name="matrix-static-server", daemon=True)
        self._thread = thread
        thread.start()

        host, port = httpd.server_address[0], httpd.server_address[1]
        return StaticServerInfo(host=host, port=port, root_dir=self._root_dir)

    def stop(self) -> None:
        if not self._httpd:
            return
        with contextlib.suppress(Exception):
            self._httpd.shutdown()
        with contextlib.suppress(Exception):
            self._httpd.server_close()
        self._httpd = None

