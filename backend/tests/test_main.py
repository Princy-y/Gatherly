"""
Unit and integration tests for Gatherly AI FastAPI Proxy service.
Tests healthcheck, input validation errors, rate limiting, and 503 error handling.
"""

import time
import urllib.error
from unittest.mock import patch
import pytest
from fastapi.testclient import TestClient
from backend.main import app, client_request_history, MAX_REQUESTS_PER_WINDOW

client = TestClient(app)


@pytest.fixture(autouse=True)
def reset_rate_limit_history():
    """Clear in-memory rate limiting history before each test."""
    client_request_history.clear()
    yield
    client_request_history.clear()


def test_healthcheck():
    """Verify that the /health endpoint responds with 200 and healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "gatherly-ai-proxy"
    assert "timestamp" in data


def test_generate_plan_validation_missing_fields():
    """Ensure 422 is returned when required fields are missing."""
    response = client.post("/api/generate-plan", json={})
    assert response.status_code == 422
    errors = response.json()["detail"]
    missing_fields = {err["loc"][-1] for err in errors}
    assert "title" in missing_fields
    assert "eventType" in missing_fields
    assert "location" in missing_fields
    assert "eventDate" in missing_fields


def test_generate_plan_validation_invalid_event_type():
    """Ensure 422 is returned when eventType does not match allowed enum."""
    payload = {
        "title": "Corporate Gala",
        "eventType": "corporate",  # Invalid: only wedding, birthday, community allowed
        "location": "Mumbai",
        "eventDate": "2026-12-01",
        "budgetLimitPaise": 50000000,
        "guestCount": 100,
    }
    response = client.post("/api/generate-plan", json=payload)
    assert response.status_code == 422


def test_generate_plan_validation_negative_budget():
    """Ensure 422 is returned when budget is negative."""
    payload = {
        "title": "Aarav Birthday",
        "eventType": "birthday",
        "location": "Delhi",
        "eventDate": "2026-12-01",
        "budgetLimitPaise": -100,
        "guestCount": 50,
    }
    response = client.post("/api/generate-plan", json=payload)
    assert response.status_code == 422


def test_generate_plan_validation_zero_guests():
    """Ensure 422 is returned when guestCount is < 1."""
    payload = {
        "title": "Community Park Cleanup",
        "eventType": "community",
        "location": "Bengaluru",
        "eventDate": "2026-12-01",
        "budgetLimitPaise": 1000000,
        "guestCount": 0,
    }
    response = client.post("/api/generate-plan", json=payload)
    assert response.status_code == 422


def test_revise_plan_validation_missing_fields():
    """Ensure 422 is returned for revise-plan when required objects are missing."""
    response = client.post("/api/revise-plan", json={"currentPlanSummary": {}})
    assert response.status_code == 422


def test_generate_plan_503_generic_message_on_offline_ollama():
    """Ensure 503 with a generic message is returned when Ollama is unreachable."""
    payload = {
        "title": "Maya Sweet 16",
        "eventType": "birthday",
        "location": "Jaipur",
        "eventDate": "2026-11-20",
        "budgetLimitPaise": 20000000,
        "guestCount": 80,
    }
    with patch("urllib.request.urlopen", side_effect=urllib.error.URLError("Connection refused")):
        response = client.post("/api/generate-plan", json=payload)
        assert response.status_code == 503
        data = response.json()
        assert data["detail"] == "Inference provider temporarily unavailable. Please try again later."


def test_rate_limiter_blocks_excessive_requests():
    """Ensure that client is blocked with 429 when exceeding MAX_REQUESTS_PER_WINDOW."""
    payload = {
        "title": "Test Wedding",
        "eventType": "wedding",
        "location": "Goa",
        "eventDate": "2026-12-25",
        "budgetLimitPaise": 50000000,
        "guestCount": 150,
    }

    # Fill rate limit history up to maximum with current timestamp
    now = time.time()
    client_request_history["testclient"] = [now] * MAX_REQUESTS_PER_WINDOW

    response = client.post("/api/generate-plan", json=payload)
    assert response.status_code == 429
    assert "Rate limit exceeded" in response.json()["detail"]
