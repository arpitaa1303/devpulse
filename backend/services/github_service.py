import os
from datetime import datetime, timezone

import httpx

GITHUB_API = "https://api.github.com"


class GithubService:
    def __init__(self) -> None:
        token = os.getenv("GITHUB_TOKEN")
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
        }
        if token:
            self.headers["Authorization"] = f"Bearer {token}"

    async def _get(self, url: str, params: dict | None = None) -> dict | list:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url, headers=self.headers, params=params)
            if response.status_code == 404:
                raise ValueError("GitHub user not found")
            if response.status_code == 403:
                raise ValueError("GitHub API rate limit exceeded. Try again later.")
            response.raise_for_status()
            return response.json()

    async def _get_all_repos(self, username: str) -> list[dict]:
        all_repos: list[dict] = []
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

    def _calculate_health_score(self, repos: list[dict]) -> int:
        if not repos:
            return 0

        score = 0
        now = datetime.now(timezone.utc)

        repos_with_desc = sum(1 for repo in repos if repo.get("description"))
        score += min(40, int((repos_with_desc / len(repos)) * 40))

        recent = 0
        for repo in repos:
            updated = repo.get("updated_at", "")
            if not updated:
                continue
            try:
                updated_dt = datetime.fromisoformat(updated.replace("Z", "+00:00"))
            except ValueError:
                continue
            days_ago = (now - updated_dt).days
            if days_ago <= 90:
                recent += 1

        if recent >= 3:
            score += 30
        elif recent >= 1:
            score += 15

        total_stars = sum(repo.get("stargazers_count", 0) for repo in repos)
        if total_stars >= 10:
            score += 20
        elif total_stars >= 1:
            score += 10

        languages = {repo.get("language") for repo in repos if repo.get("language")}
        if len(languages) >= 3:
            score += 10

        return min(100, score)

    async def get_user_analysis(self, username: str) -> dict:
        user = await self._get(f"{GITHUB_API}/users/{username}")
        repos = await self._get_all_repos(username)

        original_repos = [repo for repo in repos if not repo.get("fork")]

        lang_counts: dict[str, int] = {}
        for repo in original_repos:
            language = repo.get("language")
            if language:
                lang_counts[language] = lang_counts.get(language, 0) + 1

        top_repos = sorted(
            original_repos,
            key=lambda repo: repo.get("stargazers_count", 0),
            reverse=True,
        )[:10]

        total_stars = sum(repo.get("stargazers_count", 0) for repo in original_repos)
        total_forks = sum(repo.get("forks_count", 0) for repo in original_repos)

        return {
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
                "total_stars": total_stars,
                "total_forks": total_forks,
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
        }
