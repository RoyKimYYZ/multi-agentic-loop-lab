from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import posts

app = FastAPI(title="Blog API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(posts.router, prefix="/api/posts", tags=["posts"])


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
