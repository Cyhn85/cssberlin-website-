# backend/error_logger.py
"""
CSS Berlin - Watchtower Error Logging System
Receives frontend errors and logs to file with rotation.
"""

from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
import logging
from logging.handlers import RotatingFileHandler
import os
import json

# ─── Router ────────────────────────────────────────────────
router = APIRouter(prefix="/api/errors", tags=["errors"])

# ─── File Logger Setup ─────────────────────────────────────
LOG_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_FILE = os.path.join(LOG_DIR, "server_error.log")

# Create rotating file handler (max 5MB per file, keep 5 backups)
file_handler = RotatingFileHandler(
    LOG_FILE,
    maxBytes=5 * 1024 * 1024,  # 5 MB
    backupCount=5,
    encoding='utf-8'
)
file_handler.setLevel(logging.ERROR)

# Create formatter
formatter = logging.Formatter(
    '%(asctime)s | %(levelname)s | %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
file_handler.setFormatter(formatter)

# Create logger
error_logger = logging.getLogger('cssberlin_errors')
error_logger.setLevel(logging.ERROR)
error_logger.addHandler(file_handler)

# Also log to console
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.ERROR)
console_handler.setFormatter(formatter)
error_logger.addHandler(console_handler)

# ─── Pydantic Models ───────────────────────────────────────

class FrontendError(BaseModel):
    """Schema for frontend error reports"""
    type: str  # 'error', 'promise_rejection', 'manual'
    message: str
    source: Optional[str] = None
    line: Optional[int] = None
    column: Optional[int] = None
    stack: Optional[str] = None
    url: Optional[str] = None
    userAgent: Optional[str] = None
    timestamp: Optional[str] = None
    viewport: Optional[Dict[str, int]] = None
    data: Optional[Dict[str, Any]] = None


class ErrorResponse(BaseModel):
    """Response after logging error"""
    success: bool
    error_id: str
    message: str


# ─── Helper Functions ──────────────────────────────────────

def generate_error_id() -> str:
    """Generate a unique error ID for tracking"""
    import uuid
    return f"ERR-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{str(uuid.uuid4())[:8].upper()}"


def log_error_to_file(error_id: str, error: FrontendError, ip: str):
    """Log error to file with all details"""
    log_entry = {
        "error_id": error_id,
        "timestamp": error.timestamp or datetime.utcnow().isoformat(),
        "type": error.type,
        "message": error.message,
        "source": error.source,
        "line": error.line,
        "column": error.column,
        "url": error.url,
        "userAgent": error.userAgent,
        "ip": ip,
        "stack": error.stack,
    }

    # Single line JSON for easier parsing
    error_logger.error(json.dumps(log_entry, ensure_ascii=False))

    return log_entry


# ─── API Endpoints ─────────────────────────────────────────

@router.post("/report", response_model=ErrorResponse)
async def report_error(error: FrontendError, request: Request):
    """
    Receive error reports from frontend and log them.

    This endpoint accepts error data from the frontend error-logger.js
    and writes it to server_error.log with rotation.
    """
    # Get client IP
    ip = request.client.host if request.client else "unknown"

    # Generate unique error ID
    error_id = generate_error_id()

    # Log to file
    log_error_to_file(error_id, error, ip)

    # Also print to console for immediate visibility
    print(f"\n🔴 FRONTEND ERROR [{error_id}]")
    print(f"   Type: {error.type}")
    print(f"   Message: {error.message}")
    if error.source:
        print(f"   Source: {error.source}:{error.line}:{error.column}")
    if error.url:
        print(f"   Page: {error.url}")
    print()

    return ErrorResponse(
        success=True,
        error_id=error_id,
        message="Error logged successfully"
    )


@router.get("/stats")
async def get_error_stats():
    """
    Get basic error statistics from the log file.
    Returns last 24 hours error count and recent errors.
    """
    stats = {
        "total_errors_today": 0,
        "recent_errors": [],
        "log_file_size_kb": 0,
        "log_file_exists": os.path.exists(LOG_FILE)
    }

    if not os.path.exists(LOG_FILE):
        return stats

    # Get file size
    stats["log_file_size_kb"] = round(os.path.getsize(LOG_FILE) / 1024, 2)

    # Read last 20 errors
    try:
        with open(LOG_FILE, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        today = datetime.utcnow().strftime('%Y-%m-%d')

        for line in reversed(lines[-100:]):  # Check last 100 lines
            try:
                # Parse the log line (format: timestamp | LEVEL | json)
                parts = line.split(' | ', 2)
                if len(parts) >= 3:
                    timestamp = parts[0]
                    json_data = parts[2].strip()
                    error_data = json.loads(json_data)

                    # Count today's errors
                    if today in timestamp:
                        stats["total_errors_today"] += 1

                    # Add to recent errors (max 10)
                    if len(stats["recent_errors"]) < 10:
                        stats["recent_errors"].append({
                            "error_id": error_data.get("error_id"),
                            "type": error_data.get("type"),
                            "message": error_data.get("message", "")[:100],
                            "timestamp": error_data.get("timestamp")
                        })
            except (json.JSONDecodeError, IndexError):
                continue

    except Exception as e:
        stats["error"] = str(e)

    return stats


@router.get("/recent")
async def get_recent_errors(limit: int = 20):
    """
    Get the most recent errors from the log file.
    """
    errors = []

    if not os.path.exists(LOG_FILE):
        return {"errors": [], "message": "No log file found"}

    try:
        with open(LOG_FILE, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        for line in reversed(lines[-limit:]):
            try:
                parts = line.split(' | ', 2)
                if len(parts) >= 3:
                    error_data = json.loads(parts[2].strip())
                    errors.append(error_data)
            except (json.JSONDecodeError, IndexError):
                continue

    except Exception as e:
        return {"errors": [], "error": str(e)}

    return {"errors": errors, "count": len(errors)}


# ─── Initialize ────────────────────────────────────────────
print(f"[OK] Error logger initialized. Log file: {LOG_FILE}")
