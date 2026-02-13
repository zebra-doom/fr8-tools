"""Tests for API key authentication and rate limiting."""

import pytest
from httpx import ASGITransport, AsyncClient

from app.auth import _request_log
from app.config import settings
from app.main import app


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture(autouse=True)
def _clean_rate_limiter():
    """Clear the in-memory rate limiter between tests."""
    _request_log.clear()
    yield
    _request_log.clear()


@pytest.fixture
def _enable_auth(monkeypatch):
    """Temporarily set an API secret key."""
    monkeypatch.setattr(settings, "api_secret_key", "test-secret-key")
    yield
    monkeypatch.setattr(settings, "api_secret_key", "")


@pytest.mark.anyio
async def test_chat_without_key_when_auth_disabled():
    """When api_secret_key is empty, requests should pass through."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/chat",
            json={"messages": [{"role": "user", "content": "hello"}]},
        )
    # Should not be 401 (may fail for other reasons like missing OpenAI key)
    assert response.status_code != 401


@pytest.mark.anyio
@pytest.mark.usefixtures("_enable_auth")
async def test_chat_rejects_missing_key():
    """When api_secret_key is set, requests without X-API-Key get 401."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/chat",
            json={"messages": [{"role": "user", "content": "hello"}]},
        )
    assert response.status_code == 401


@pytest.mark.anyio
@pytest.mark.usefixtures("_enable_auth")
async def test_chat_rejects_wrong_key():
    """When api_secret_key is set, requests with wrong key get 401."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/chat",
            json={"messages": [{"role": "user", "content": "hello"}]},
            headers={"X-API-Key": "wrong-key"},
        )
    assert response.status_code == 401


@pytest.mark.anyio
@pytest.mark.usefixtures("_enable_auth")
async def test_chat_accepts_correct_key():
    """When api_secret_key is set, requests with correct key pass auth."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/chat",
            json={"messages": [{"role": "user", "content": "hello"}]},
            headers={"X-API-Key": "test-secret-key"},
        )
    # Should not be 401 (may fail for other reasons like missing OpenAI key)
    assert response.status_code != 401


@pytest.mark.anyio
async def test_rate_limit(monkeypatch):
    """Requests exceeding the rate limit get 429."""
    monkeypatch.setattr(settings, "rate_limit_rpm", 2)
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        for _ in range(2):
            await client.post(
                "/api/chat",
                json={"messages": [{"role": "user", "content": "hello"}]},
            )
        response = await client.post(
            "/api/chat",
            json={"messages": [{"role": "user", "content": "hello"}]},
        )
    assert response.status_code == 429
    monkeypatch.setattr(settings, "rate_limit_rpm", 20)
