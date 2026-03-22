import logging

import httpx
from fastapi import APIRouter, HTTPException

from services.github_service import GithubService

logger = logging.getLogger(__name__)

router = APIRouter()
service = GithubService()


@router.get("/analyze/{username}")
async def analyze_user(username: str) -> dict:
    if not username or len(username.strip()) == 0:
        raise HTTPException(status_code=400, detail="Username cannot be empty")

    if len(username) > 39:
        raise HTTPException(status_code=400, detail="Invalid username")

    try:
        return await service.get_user_analysis(username.strip())
    except ValueError as exc:
        message = str(exc)
        if "rate limit" in message.lower():
            raise HTTPException(status_code=429, detail=message) from exc
        raise HTTPException(status_code=404, detail=message) from exc
    except httpx.TimeoutException as exc:
        logger.exception("GitHub request timed out for user %s", username)
        raise HTTPException(
            status_code=504, detail="GitHub request timed out. Please try again."
        ) from exc
    except httpx.HTTPError as exc:
        logger.exception("GitHub request failed for user %s", username)
        raise HTTPException(
            status_code=502, detail="GitHub API request failed. Please try again."
        ) from exc
    except Exception as exc:
        logger.exception("Unexpected error while analyzing user %s", username)
        raise HTTPException(
            status_code=500, detail="Failed to fetch GitHub data"
        ) from exc
