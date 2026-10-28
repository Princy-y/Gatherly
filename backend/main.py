"""
Gatherly AI — Minimal Secure FastAPI AI Proxy Service
Provides bounded payload limits, restricted CORS, Pydantic validation, and rate limiting.
"""

import time
import os
from typing import Any, Dict, List, Optional
from fastapi import FastAPI, HTTPException, Request, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import urllib.request
import json

app = FastAPI(
    title="Gatherly AI Secure Proxy",
    description="Minimal, hardened proxy interface for Gatherly AI planning endpoints.",
    version="1.0.0"
)

# CORS Configuration
ALLOWED_ORIGINS: List[str] = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:4173"
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# In-memory sliding window rate limiter (max 30 requests/minute per client IP)
RATE_LIMIT_WINDOW_SEC: int = 60
MAX_REQUESTS_PER_WINDOW: int = 30
client_request_history: Dict[str, List[float]] = {}


def rate_limiter(request: Request) -> None:
    """
    Sliding-window rate limiter dependency.

    Raises HTTP 429 when the caller exceeds MAX_REQUESTS_PER_WINDOW
    within the last RATE_LIMIT_WINDOW_SEC seconds.

    Args:
        request: The incoming FastAPI request (used to extract client IP).
    """
    client_ip: str = request.client.host if request.client else "anonymous"
    now: float = time.time()
    history: List[float] = client_request_history.get(client_ip, [])
    # Discard timestamps outside the current window
    history = [t for t in history if now - t < RATE_LIMIT_WINDOW_SEC]
    if len(history) >= MAX_REQUESTS_PER_WINDOW:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please wait a moment before sending more AI requests.",
        )
    history.append(now)
    client_request_history[client_ip] = history


# ---------------------------------------------------------------------------
# Request models — all fields have bounded lengths to prevent memory exhaustion
# ---------------------------------------------------------------------------

class PlanGenerationRequest(BaseModel):
    """Payload schema for the /api/generate-plan endpoint."""

    title: str = Field(..., max_length=150)
    eventType: str = Field(..., pattern=r"^(wedding|birthday|community)$")
    location: str = Field(..., max_length=100)
    eventDate: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    budgetLimitPaise: int = Field(..., ge=0, le=100_000_000_000)  # Up to 100 Crore INR
    guestCount: int = Field(..., ge=1, le=50_000)
    priorities: List[str] = Field(default=[], max_length=10)
    preferences: Optional[str] = Field(default="", max_length=1000)
    accessibilityRequirements: Optional[str] = Field(default=None, max_length=500)


class PlanRevisionRequest(BaseModel):
    """Payload schema for the /api/revise-plan endpoint."""

    currentPlanSummary: Dict[str, Any]
    changes: Dict[str, Any]
    deterministicWarnings: List[str] = Field(default=[], max_length=20)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/health")
def healthcheck() -> Dict[str, Any]:
    """Liveness probe — returns service metadata and current server timestamp."""
    return {
        "status": "healthy",
        "service": "gatherly-ai-proxy",
        "timestamp": time.time(),
    }


@app.post("/api/generate-plan", dependencies=[Depends(rate_limiter)])
def generate_plan(payload: PlanGenerationRequest) -> Dict[str, Any]:
    """
    Forwards a validated plan-generation request to the local Ollama inference service.

    Args:
        payload: Validated plan generation parameters.

    Returns:
        A dict containing the AI-generated plan data and the model name used.

    Raises:
        HTTPException 503: When the Ollama service is unavailable or returns an error.
    """
    ollama_url: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    model: str = os.getenv("OLLAMA_MODEL", "qwen2.5:3b")

    prompt = (
        f"You are Gatherly AI. Generate plan in JSON:\n"
        f"Event: {payload.title} ({payload.eventType}) at {payload.location}\n"
        f"Date: {payload.eventDate}, Budget: INR {payload.budgetLimitPaise // 100}, "
        f"Guests: {payload.guestCount}\n"
        f"Priorities: {', '.join(payload.priorities)}\n"
        "Output valid JSON with fields: themeTitle, conceptDescription, colorPalette, "
        "recommendedExpenses, recommendedTasks, recommendedVendors."
    )

    try:
        req = urllib.request.Request(
            f"{ollama_url}/api/generate",
            data=json.dumps({
                "model": model,
                "prompt": prompt,
                "format": "json",
                "stream": False,
                "options": {"temperature": 0.3},
            }).encode("utf-8"),
            headers={"Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=45) as response:
            res_body: Dict[str, Any] = json.loads(response.read().decode("utf-8"))
            return {"data": json.loads(res_body.get("response", "{}")), "model": model}
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Inference provider temporarily unavailable: {exc}",
        ) from exc
