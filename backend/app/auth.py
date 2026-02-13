"""API key authentication and rate limiting for the chat endpoint."""

import time
from collections import defaultdict

from fastapi import HTTPException, Request

from app.config import settings

# In-memory rate limiter: IP -> list of request timestamps
_request_log: dict[str, list[float]] = defaultdict(list)


def verify_api_key(request: Request) -> None:
    """Check that the request carries a valid X-API-Key header."""
    if not settings.api_secret_key:
        return  # No key configured — skip auth (local dev)

    key = request.headers.get("X-API-Key", "")
    if key != settings.api_secret_key:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")


def check_rate_limit(request: Request) -> None:
    """Enforce per-IP rate limiting (sliding window, 1 minute)."""
    limit = settings.rate_limit_rpm
    if limit <= 0:
        return

    ip = request.client.host if request.client else "unknown"
    now = time.monotonic()
    window = 60.0

    # Prune old entries
    timestamps = _request_log[ip]
    _request_log[ip] = [t for t in timestamps if now - t < window]

    if len(_request_log[ip]) >= limit:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Max {limit} requests per minute.",
        )

    _request_log[ip].append(now)
