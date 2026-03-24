import logging

import httpx
from fastapi import APIRouter, HTTPException

from services.github_service import GithubService

logger = logging.getLogger(__name__)
router = APIRouter()
service = GithubService()


@router.get("/analyze/{username}")
async def analyze_user(username: str):
    if not username or len(username.strip()) == 0:
        logger.warning("Empty username received")
        raise HTTPException(status_code=400, detail="Username cannot be empty")

    if len(username) > 39:
        logger.warning("Username too long: %s chars", len(username))
        raise HTTPException(status_code=400, detail="Invalid username")

    logger.info("Analyzing GitHub user: %s", username)

    try:
        result = await service.get_user_analysis(username.strip())
        source = "cache" if result.get("from_cache") else "github_api"
        logger.info("Analysis complete for %s | source=%s", username, source)
        return result
    except ValueError as exc:
        message = str(exc)
        if "rate limit" in message.lower():
            logger.warning("Rate limited for %s | %s", username, exc)
            raise HTTPException(status_code=429, detail=message) from exc
        logger.warning("User not found: %s | %s", username, exc)
        raise HTTPException(status_code=404, detail=message) from exc
    except httpx.TimeoutException as exc:
        logger.error("Timeout for %s: %s", username, exc, exc_info=True)
        raise HTTPException(
            status_code=504, detail="GitHub request timed out. Please try again."
        ) from exc
    except Exception as exc:
        logger.error("Unexpected error for %s: %s", username, exc, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch GitHub data") from exc
