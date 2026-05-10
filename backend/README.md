# Backend

FastAPI blog backend using `uv` for dependency management.

## Run

```bash
cd backend
uv run uvicorn app.main:app --reload --port 8000
```

- API: `http://localhost:8000`
- Docs: `http://localhost:8000/docs`

## Test

```bash
cd backend
PYTHONPATH=. uv run pytest -q
uv run ruff check .
```

## API Endpoints

All prefixed with `/api/posts`:

| Method | Path | Body | Response |
|---|---|---|---|
| `GET` | `/` | — | `200 [Post]` |
| `POST` | `/` | `PostCreate` | `201 Post` |
| `GET` | `/{id}` | — | `200 Post` / `404` |
| `PUT` | `/{id}` | `PostUpdate` | `200 Post` / `404` |
| `DELETE` | `/{id}` | — | `204` / `404` |

### Schemas

**PostCreate** (request body for POST):
```json
{ "title": "string", "content": "string", "author": "string" }
```

**PostUpdate** (request body for PUT — all fields optional):
```json
{ "title": "string", "content": "string", "author": "string" }
```

**Post** (response):
```json
{ "id": 1, "title": "string", "content": "string", "author": "string", "created_at": "2026-05-09T20:00:00" }
```

## Structure

```
backend/
├── app/
│   ├── main.py              # App setup, mounts router at /api/posts
│   ├── routers/posts.py     # Route handlers
│   ├── schemas/post.py      # PostCreate, PostUpdate (Pydantic)
│   ├── models/post.py       # Post domain model
│   └── services/post_service.py  # In-memory CRUD
└── tests/
    └── test_posts.py        # Integration tests (httpx TestClient)
```

## Notes

- Persistence is **in-memory only** — data resets on restart. Intentional for this learning scaffold.
- `PYTHONPATH=.` is required when running pytest directly (so `from app.main import app` resolves).
