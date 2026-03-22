import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.github import router as github_router

load_dotenv()

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

app.include_router(github_router, prefix="/api", tags=["GitHub"])


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "healthy", "service": "devpulse-backend"}
