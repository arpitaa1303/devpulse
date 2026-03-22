from fastapi.testclient import TestClient
import httpx

from main import app
from routes.github import service

client = TestClient(app)


def test_health_check() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_analyze_empty_username() -> None:
    response = client.get("/api/analyze/ ")
    assert response.status_code in [400, 404, 422]


def test_analyze_invalid_username(monkeypatch) -> None:
    async def mock_get_user_analysis(username: str) -> dict:
        raise ValueError("GitHub user not found")

    monkeypatch.setattr(service, "get_user_analysis", mock_get_user_analysis)
    response = client.get("/api/analyze/no-such-user-xyz999")
    assert response.status_code == 404


def test_analyze_success(monkeypatch) -> None:
    async def mock_get_user_analysis(username: str) -> dict:
        return {
            "profile": {"username": username, "name": "Test User", "avatar_url": "", "bio": ""},
            "stats": {
                "total_repos": 1,
                "total_stars": 2,
                "total_forks": 3,
                "languages_used": 1,
            },
            "languages": {"Python": 1},
            "top_repos": [],
            "health_score": 42,
        }

    monkeypatch.setattr(service, "get_user_analysis", mock_get_user_analysis)
    response = client.get("/api/analyze/testuser")
    assert response.status_code == 200
    assert response.json()["health_score"] == 42


def test_analyze_rate_limited(monkeypatch) -> None:
    async def mock_get_user_analysis(username: str) -> dict:
        raise ValueError("GitHub API rate limit exceeded. Try again later.")

    monkeypatch.setattr(service, "get_user_analysis", mock_get_user_analysis)
    response = client.get("/api/analyze/testuser")
    assert response.status_code == 429


def test_analyze_timeout(monkeypatch) -> None:
    async def mock_get_user_analysis(username: str) -> dict:
        raise httpx.TimeoutException("Timed out")

    monkeypatch.setattr(service, "get_user_analysis", mock_get_user_analysis)
    response = client.get("/api/analyze/testuser")
    assert response.status_code == 504
