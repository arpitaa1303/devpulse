<div align="center">

# 💻 DevPulse

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com) [![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev) [![Docker Compose](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/) [![GitHub Actions](https://img.shields.io/badge/GitHub--Actions-CI/CD-2088FF?logo=githubactions&logoColor=white)](https://github.com/features/actions) [![Prometheus](https://img.shields.io/badge/Prometheus-Metrics-E6522C?logo=prometheus&logoColor=white)](https://prometheus.io) [![Grafana](https://img.shields.io/badge/Grafana-Dashboards-F46800?logo=grafana&logoColor=white)](https://grafana.com) [![Python](https://img.shields.io/badge/Python-1.0.1-3776AB?logo=python&logoColor=white)](https://www.python.org) [![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?logo=redis&logoColor=white)](https://redis.io) [![UptimeRobot](https://img.shields.io/badge/UptimeRobot-Monitoring-5CD3A8?logo=uptimerobot&logoColor=white)](https://uptimerobot.com)

**Turn public GitHub profiles into clear, data-driven engineering insights - instantly.**

</div>

---

## What is it❓

DevPulse is a full-stack GitHub analytics dashboard that transforms raw GitHub API data into meaningful developer insights. Enter any public GitHub username and get an instant breakdown of their activity health, technology fingerprint, and top repositories - all in one clean dashboard.

The project is built around a **complete DevOps pipeline**: every code push is automatically tested, packaged into versioned Docker images stored in GitHub Container Registry, and deployed to production with zero manual steps.

---

## Features✨

### Application Features

| Feature                | Description                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| **Pulse Score**        | A 0-100 health score calculated from activity recency, repo descriptions, stars, and language diversity |
| **Language DNA**       | Donut chart showing the percentage breakdown of programming languages across all original repos         |
| **Repo Radar**         | Top 10 repositories sorted by stars with name, description, language, star count, and fork count        |
| **Profile Overview**   | Avatar, bio, follower/following count pulled live from the GitHub API                                   |
| **Cache Indicator**    | A live badge showing whether the result was served from Redis cache or freshly fetched                  |
| **Error Handling**     | Clear user-facing messages for invalid usernames, rate limits, and timeouts                             |
| **Clickable Examples** | Chips for `octocat`, `gaearon`, `torvalds` - click to instantly analyze                                 |

### DevOps Features

| Feature                 | Tool            | Details                                                   |
| ----------------------- | --------------- | --------------------------------------------------------- |
| **Containerization**    | Docker          | Multi-stage frontend build, slim backend image            |
| **Local Orchestration** | Docker Compose  | All 5 services start with one command                     |
| **CI/CD Pipeline**      | GitHub Actions  | 3-job automated pipeline on every push                    |
| **Container Registry**  | GHCR            | Versioned images tagged with `latest` + git SHA           |
| **Backend Hosting**     | Render          | Docker-native free tier with auto-deploy                  |
| **Frontend Hosting**    | Vercel          | Instant static deployments from GitHub                    |
| **Caching**             | Redis (Upstash) | 5-minute TTL, ~80% reduction in GitHub API calls          |
| **Metrics**             | Prometheus      | Scrapes `/metrics` every 15 seconds                       |
| **Dashboards**          | Grafana         | Request rate, error rate, p95 latency, cache performance  |
| **Uptime Monitoring**   | UptimeRobot     | Pings `/health` every 5 minutes, email alerts on downtime |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        DEVELOPER                                │
│                    git push → GitHub                            │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                  GITHUB ACTIONS (CI/CD)                         │
│                                                                 │
│   Job 1: Test          Job 2: Build & Push    Job 3: Deploy     │
│   ──────────────       ──────────────────     ─────────────     │
│   pytest runs          Build images           Trigger hooks     │
│   REDIS_URL=""         Push to GHCR           Wait + verify     │
│   Tests pass/fail      Tag: latest + sha      Health check      │
└──────────────┬──────────────────┬───────────────────────────────┘
               │                  │
       ┌───────▼──────┐   ┌───────▼───────────────────────────┐
       │     GHCR     │   │           RENDER + VERCEL         │
       │  (Registry)  │   │                                   │
       │              │   │  FastAPI ←→ Redis (Upstash)       │
       │  devpulse-   │   │  React (Vercel)                   │
       │  backend     │   │  Prometheus + Grafana (local)     │
       │  devpulse-   │   │                                   │
       │  frontend    │   └───────────────────────────────────┘
       └──────────────┘
                          ▼
              ┌─────────────────────┐
              │    UPTIMEROBOT      │
              │  Pings /health      │
              │  every 10 minutes   │
              │  Email on downtime  │
              └─────────────────────┘
```

## 📂 Project Structure

```
devpulse/
│
├── .github/
│   └── workflows/
│       └── ci.yml                  # 3-job CI/CD pipeline
│
├── backend/
│   ├── routes/
│   │   ├── __init__.py
│   │   └── github.py               # API endpoints (/analyze, /health)
│   ├── services/
│   │   ├── __init__.py
│   │   └── github_service.py       # GitHub API calls + Redis caching
│   ├── main.py                     # FastAPI app, CORS, Prometheus, logging
│   ├── test_main.py                # pytest test suite
│   ├── requirements.txt            # Python dependencies
│   ├── Dockerfile                  # Backend container definition
│   └── .env                        # Local secrets (never committed)
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── github.js           # Axios API calls to backend
│   │   ├── components/
│   │   │   ├── HealthBadge.jsx     # Pulsing score badge (green/amber/red)
│   │   │   ├── LanguageChart.jsx   # Recharts donut chart with legend
│   │   │   ├── RepoCard.jsx        # Repo card with stars, forks, language
│   │   │   ├── SearchBar.jsx       # Input + clickable example chips
│   │   │   └── StatCard.jsx        # Stat tile with SVG icon
│   │   ├── App.jsx                 # Root component, layout, state
│   │   └── index.css               # CSS variables, animations, base styles
│   ├── nginx.conf                  # nginx config for React routing
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile                  # Multi-stage build (Node → nginx)
│
├── grafana/
│   └── provisioning/
│       ├── datasources/
│       │   └── prometheus.yml      # Auto-connects Prometheus datasource
│       └── dashboards/
│           ├── dashboard.yml       # Dashboard loader config
│           └── devpulse.json       # Pre-built dashboard definition
│
├── docker-compose.yml              # All 5 services: frontend, backend,
│                                   # redis, prometheus, grafana
├── prometheus.yml                  # Prometheus scrape config
└── .gitignore
```

---

## 📦 Tech Stack

| Layer         | Technology                | Purpose                              |
| ------------- | ------------------------- | ------------------------------------ |
| Frontend      | React 18 + Tailwind CSS   | Dashboard UI with components         |
| Backend       | Python FastAPI            | REST API, data processing, caching   |
| Data Source   | GitHub REST API v3        | Live profile and repository data     |
| Cache         | Redis via Upstash         | Reduce API calls, speed up responses |
| Metrics       | Prometheus                | Scrape and store app metrics         |
| Dashboards    | Grafana                   | Visualize metrics locally            |
| Containers    | Docker + Docker Compose   | Reproducible environments            |
| CI/CD         | GitHub Actions            | Automated test → build → deploy      |
| Registry      | GitHub Container Registry | Store versioned Docker images        |
| Backend Host  | Render                    | Live backend URL                     |
| Frontend Host | Vercel                    | Live frontend URL                    |
| Monitoring    | UptimeRobot               | 24/7 production uptime checks        |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed before proceeding:

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (includes Docker Compose)
- [Git](https://git-scm.com)
- A [GitHub Personal Access Token](https://github.com/settings/tokens) with `public_repo` scope

### 1 - Clone the Repository

```bash
git clone https://github.com/arpitaa1303/devpulse.git
cd devpulse
```

### 2 - Create the Environment File

Create `backend/.env` with your credentials:

```bash
# backend/.env
GITHUB_TOKEN=your_personal_access_token_here
REDIS_URL=redis://redis:6379
ALLOWED_ORIGINS=http://localhost:3000
CACHE_TTL=300
```

> ⚠️ **Never commit this file.** It is already in `.gitignore`.

### 3 - Start All Services

```bash
docker compose up --build
```

This starts all 5 services. First run takes 3-5 minutes to pull and build images.

### 4 - Verify Everything is Running

Once logs settle, open these in your browser:

| Service      | URL                           | Expected                        |
| ------------ | ----------------------------- | ------------------------------- |
| React App    | http://localhost:3000         | DevPulse search page            |
| FastAPI Docs | http://localhost:8000/docs    | Interactive API docs            |
| Health Check | http://localhost:8000/health  | `{"status": "healthy"}`         |
| Metrics      | http://localhost:8000/metrics | Prometheus text output          |
| Prometheus   | http://localhost:9090         | Prometheus query UI             |
| Grafana      | http://localhost:3001         | Dashboard (admin / devpulse123) |

### 5 - Test the App

Type any GitHub username in the search box and click **Analyze**. Try clicking the example chips (`octocat`, `gaearon`, `torvalds`) for instant results.

---

## ⚙️ CI/CD Pipeline

Every push to `main` triggers a 3-job GitHub Actions pipeline:

```
 Push to main
     │
     ▼
┌─────────────────┐
│  Job 1: Test    │  Install deps → pytest → all tests must pass
└────────┬────────┘
         │ passes
         ▼
┌─────────────────────────┐
│  Job 2: Build & Push    │  Build images → push to GHCR
│                         │  Tags: latest + sha-XXXXXXX
└────────┬────────────────┘
         │ passes
         ▼
┌─────────────────────────┐
│  Job 3: Deploy & Verify │  Trigger Render hook
│                         │  Trigger Vercel hook
│                         │  Wait 60s → hit /health (5 retries)
│                         │  Fail pipeline if health check fails
└─────────────────────────┘
```

## ➕ How the Health Score Works

The Pulse Score (0-100) is calculated from four signals:

| Signal             | Max Points | Criteria                                             |
| ------------------ | ---------- | ---------------------------------------------------- |
| Repo descriptions  | 40 pts     | Percentage of repos that have a description          |
| Recent activity    | 30 pts     | 3+ repos updated in last 90 days = 30pts, 1+ = 15pts |
| Stars earned       | 20 pts     | 10+ total stars = 20pts, 1+ = 10pts                  |
| Language diversity | 10 pts     | 3+ different languages used                          |

| Score Range | Label           | Meaning                               |
| ----------- | --------------- | ------------------------------------- |
| 70 - 100    | 🟢 Healthy      | Active, well-documented, diverse work |
| 40 - 69     | 🟡 Moderate     | Some activity but room to improve     |
| 0 - 39      | 🔴 Low Activity | Inactive or sparse profile            |

---

## 🟥 How Caching Works

```
Request: GET /api/analyze/torvalds

     ┌──────────────────────┐
     │  Check Redis cache   │
     │  key: devpulse:      │
     │  user:torvalds       │
     └──────────┬───────────┘
                │
        ┌───────┴───────┐
        │               │
    Cache HIT       Cache MISS
    (~12ms)         (~2000ms)
        │               │
        │         GitHub API call
        │         Process data
        │         Store in Redis
        │         TTL: 300 seconds
        │               │
        └───────┬───────┘
                │
         Return JSON
         { from_cache: true/false }
```

The `from_cache` field in every response tells you whether Redis served the result. The second search for the same username is always dramatically faster.

---

### Docker images

are stored in GitHub Container Registry with two tags per push:

- `latest` - always points to the newest build
- `sha-abc1234` - pinned to the exact commit that built it (enables rollback)

View published images: `https://github.com/arpitaa1303?tab=packages`

---

## 📊 Monitoring

### Prometheus Metrics

Open `http://localhost:9090` and try these queries:

```promql
# Total requests received
http_requests_total{job="devpulse-backend"}

# Request rate per second (last 1 min)
sum(rate(http_requests_total{job="devpulse-backend"}[1m])) by (status)

# p95 latency
histogram_quantile(0.95,
  sum(rate(http_request_duration_seconds_bucket{job="devpulse-backend"}[5m]))
  by (le)
)

# Error rate percentage
sum(rate(http_requests_total{job="devpulse-backend",status=~"5.."}[5m]))
/ sum(rate(http_requests_total{job="devpulse-backend"}[5m])) * 100
or vector(0)
```

### Grafana Dashboard

Open `http://localhost:3001`.

The dashboard shows 5 panels:

| Panel                  | Type        | What It Shows                                       |
| ---------------------- | ----------- | --------------------------------------------------- |
| Cache Performance      | Time series | Analyze requests vs health check requests over time |
| Request Duration (p95) | Time series | 95th percentile response time in seconds            |
| Total Requests         | Stat        | Cumulative count of all HTTP requests               |
| Error Rate             | Stat        | Percentage of 5xx responses (green = 0%)            |
| Request Rate           | Time series | Requests per second broken down by status code      |

### UptimeRobot (Production)

UptimeRobot pings `/health` every 10 minutes. If the app goes down, an email alert is sent immediately.

---

## 🔌 API Reference

### `GET /api/analyze/{username}`

Fetches and analyzes a GitHub user's public profile and repositories.

**Example request:**

```bash
curl https://devpulse-backend.onrender.com/api/analyze/torvalds
```

**Example response:**

```json
{
  "profile": {
    "username": "torvalds",
    "name": "Linus Torvalds",
    "avatar_url": "https://avatars.githubusercontent.com/u/1024025",
    "bio": "Just a simple coder :)",
    "public_repos": 6,
    "followers": 230000,
    "following": 0
  },
  "stats": {
    "total_repos": 6,
    "total_stars": 220000,
    "total_forks": 45000,
    "languages_used": 3
  },
  "languages": {
    "C": 4,
    "Python": 1,
    "Shell": 1
  },
  "health_score": 85,
  "from_cache": false,
  "top_repos": [
    {
      "name": "linux",
      "description": "Linux kernel source tree",
      "stars": 180000,
      "forks": 40000,
      "language": "C",
      "url": "https://github.com/torvalds/linux",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### `GET /health`

Health check endpoint used by Render and UptimeRobot.

```bash
curl https://devpulse-backend.onrender.com/health
```

```json
{
  "status": "healthy",
  "service": "devpulse-backend",
  "version": "1.0.0"
}
```

---

### `GET /metrics`

Prometheus metrics endpoint - scraped automatically every 15 seconds.

```bash
curl http://localhost:8000/metrics
```

Returns Prometheus text format with HTTP request counts, durations, and status codes.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable          | Default                 | Description                                              |
| ----------------- | ----------------------- | -------------------------------------------------------- |
| `GITHUB_TOKEN`    | /                       | Personal Access Token for GitHub API (5000 req/hr)       |
| `REDIS_URL`       | /                       | Redis connection string. Falls back gracefully if absent |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | Comma-separated CORS origins                             |
| `CACHE_TTL`       | `300`                   | Cache expiry in seconds                                  |

### Frontend (build-time)

| Variable            | Default | Description      |
| ------------------- | ------- | ---------------- |
| `REACT_APP_API_URL` | /       | Full backend URL |

---
