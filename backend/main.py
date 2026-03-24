import logging
import os
import time

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from routes.github import router as github_router

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
logger = logging.getLogger("devpulse")

app = FastAPI(
    title="DevPulse API",
    description="GitHub repository analytics API",
    version="1.0.0",
)

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 2)
    logger.info(
        "%s %s | status=%s | %sms",
        request.method,
        request.url.path,
        response.status_code,
        duration,
    )
    return response


Instrumentator().instrument(app).expose(app)

app.include_router(github_router, prefix="/api", tags=["GitHub"])


@app.get("/health", tags=["System"])
async def health_check() -> dict[str, str]:
    return {"status": "healthy", "service": "devpulse-backend", "version": "1.0.0"}


@app.on_event("startup")
async def startup_event():
    logger.info("DevPulse backend starting up")
    logger.info("CORS allowed origins: %s", allowed_origins)


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("DevPulse backend shutting down")
