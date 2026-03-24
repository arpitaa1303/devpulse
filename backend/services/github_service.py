import json
import logging
import os
from datetime import datetime, timezone

import httpx
import redis.asyncio as aioredis

logger = logging.getLogger(__name__)
GITHUB_API = "https://api.github.com"


class GithubService:
    def __init__(self):
        token = os.getenv("GITHUB_TOKEN")
        self.headers = {"Accept": "application/vnd.github.v3+json"}
        if token:
            self.headers["Authorization"] = f"Bearer {token}"
        self.cache_ttl = int(os.getenv("CACHE_TTL", "300"))
        self._redis = None

    async def _get_redis(self):
        """Lazy Redis connection — only connects when first needed."""
        if self._redis is None:
            redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
            try:
                self._redis = aioredis.from_url(
                    redis_url,
                    encoding="utf-8",
                    decode_responses=True,
                )
                await self._redis.ping()
                logger.info("Redis connection established")
            except Exception as exc:
                logger.warning("Redis unavailable: %s. Caching disabled.", exc)
                self._redis = None
        return self._redis

    async def _cache_get(self, key: str):
        """Try to get a value from Redis cache."""
        try:
            redis_client = await self._get_redis()
            if redis_client is None:
                return None
            value = await redis_client.get(key)
            if value:
                logger.info("Cache HIT for key: %s", key)
                return json.loads(value)
            logger.info("Cache MISS for key: %s", key)
            return None
        except Exception as exc:
            logger.warning("Cache get failed: %s", exc)
            return None

    async def _cache_set(self, key: str, value: dict):
        """Store a value in Redis cache with TTL."""
        try:
            redis_client = await self._get_redis()
            if redis_client is None:
                return
            await redis_client.setex(key, self.cache_ttl, json.dumps(value))
            logger.info("Cache SET for key: %s (TTL: %ss)", key, self.cache_ttl)
        except Exception as exc:
            logger.warning("Cache set failed: %s", exc)

    async def _get(self, url: str, params: dict | None = None) -> dict:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url, headers=self.headers, params=params)
            if response.status_code == 404:
                raise ValueError("GitHub user not found")
            if response.status_code == 403:
                raise ValueError("GitHub API rate limit exceeded. Try again later.")
            response.raise_for_status()
            return response.json()

    async def _get_all_repos(self, username: str) -> list:
        all_repos = []
        page = 1
        while True:
            repos = await self._get(
                f"{GITHUB_API}/users/{username}/repos",
                params={"per_page": 100, "page": page, "sort": "updated"},
            )
            all_repos.extend(repos)
            if len(repos) < 100:
                break
            page += 1
        return all_repos

    def _calculate_health_score(self, repos: list) -> int:
        if not repos:
            return 0
        score = 0
        now = datetime.now(timezone.utc)
        repos_with_desc = sum(1 for repo in repos if repo.get("description"))
        score += min(40, int((repos_with_desc / len(repos)) * 40))
        recent = sum(
            1
            for repo in repos
            if repo.get("updated_at")
            and (now - datetime.fromisoformat(repo["updated_at"].replace("Z", "+00:00"))).days
            <= 90
        )
        if recent >= 3:
            score += 30
        elif recent >= 1:
            score += 15
        total_stars = sum(repo.get("stargazers_count", 0) for repo in repos)
        if total_stars >= 10:
            score += 20
        elif total_stars >= 1:
            score += 10
        languages = set(repo.get("language") for repo in repos if repo.get("language"))
        if len(languages) >= 3:
            score += 10
        return min(100, score)

    async def get_user_analysis(self, username: str) -> dict:
        cache_key = f"devpulse:user:{username.lower()}"

        cached = await self._cache_get(cache_key)
        if cached:
            cached["from_cache"] = True
            return cached

        user = await self._get(f"{GITHUB_API}/users/{username}")
        repos = await self._get_all_repos(username)
        original_repos = [repo for repo in repos if not repo.get("fork")]

        lang_counts = {}
        for repo in original_repos:
            language = repo.get("language")
            if language:
                lang_counts[language] = lang_counts.get(language, 0) + 1

        top_repos = sorted(
            original_repos,
            key=lambda repo: repo.get("stargazers_count", 0),
            reverse=True,
        )[:10]

        result = {
            "profile": {
                "username": user.get("login"),
                "name": user.get("name"),
                "avatar_url": user.get("avatar_url"),
                "bio": user.get("bio"),
                "public_repos": user.get("public_repos", 0),
                "followers": user.get("followers", 0),
                "following": user.get("following", 0),
                "created_at": user.get("created_at"),
            },
            "stats": {
                "total_repos": len(original_repos),
                "total_stars": sum(repo.get("stargazers_count", 0) for repo in original_repos),
                "total_forks": sum(repo.get("forks_count", 0) for repo in original_repos),
                "languages_used": len(lang_counts),
            },
            "languages": lang_counts,
            "top_repos": [
                {
                    "name": repo.get("name"),
                    "description": repo.get("description"),
                    "stars": repo.get("stargazers_count", 0),
                    "forks": repo.get("forks_count", 0),
                    "language": repo.get("language"),
                    "url": repo.get("html_url"),
                    "updated_at": repo.get("updated_at"),
                }
                for repo in top_repos
            ],
            "health_score": self._calculate_health_score(original_repos),
            "from_cache": False,
        }

        await self._cache_set(cache_key, result)
        return result
