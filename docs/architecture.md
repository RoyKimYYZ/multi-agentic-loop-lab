# Architecture Overview

## High-Level Structure

```
parallel-agent/
├── backend/          # FastAPI Python app
├── frontend/         # React + TypeScript + Vite app
├── .github/          # Agent definitions, design artifacts, task files
├── docs/             # This wiki
├── smoke-test.sh     # Start both servers
├── merge-slice.sh    # Merge a worktree slice + clean up
└── stop.sh           # Stop running servers
```

---

## Backend

Language: **Python 3.11+** · Framework: **FastAPI** · Package manager: **uv**

```
backend/
├── app/
│   ├── main.py                  # App factory, mounts router at /api/posts
│   ├── routers/
│   │   └── posts.py             # HTTP route handlers (CRUD)
│   ├── schemas/
│   │   └── post.py              # Pydantic request/response schemas
│   ├── models/
│   │   └── post.py              # Post domain model
│   └── services/
│       └── post_service.py      # In-memory CRUD logic
└── tests/
    └── test_posts.py            # httpx TestClient integration tests
```

### Layer responsibilities

| Layer | File | Responsibility |
|---|---|---|
| Router | `routers/posts.py` | HTTP verbs, status codes, error raising |
| Schema | `schemas/post.py` | Validate incoming request bodies |
| Model | `models/post.py` | Shape of the domain object (returned to callers) |
| Service | `services/post_service.py` | Business logic, in-memory store |

### Persistence

Data is stored in a plain Python `dict[int, Post]` inside `post_service.py`. It resets on every restart. This is intentional — the project is a learning scaffold, not a production app.

---

## Frontend

Language: **TypeScript** · Framework: **React 18** · Bundler: **Vite**

```
frontend/src/
├── api/
│   └── posts.ts         # fetch wrappers for all backend endpoints
├── components/
│   ├── PostList.tsx      # Renders a list of posts with Delete button
│   └── PostForm.tsx      # Create-post form
├── pages/
│   ├── HomePage.tsx      # Post list + create form
│   └── PostDetailPage.tsx # Single post view with Delete button
├── App.tsx               # Router setup (react-router-dom)
└── main.tsx              # React entry point
```

### Layer responsibilities

| Layer | Owns | Responsibility |
|---|---|---|
| `api/` | HTTP calls | All `fetch` calls to the backend; one function per endpoint |
| `components/` | Reusable UI | Stateless or lightly stateful display components |
| `pages/` | Screen composition | Wires API calls to components; owns page-level state |
| `App.tsx` | Routing | Declares `<Route>` paths; no business logic |

---

## Design Principles

- **Vertical slices** — each feature is split into backend and frontend slices that can be worked on independently
- **No shared state library** — React `useState` only; no Redux, Zustand, or Context
- **No router abstractions** — plain `react-router-dom` v6 `<Routes>/<Route>`
- **No design system** — plain HTML elements and minimal CSS; easy to inspect and modify
- **Fail loudly** — no retry logic, no silent catch-all handlers; errors surface directly

---

## How Backend and Frontend Connect

The frontend's `src/api/posts.ts` is the only file that knows the backend URL. All components and pages call functions from that module — they never call `fetch` directly.

The base URL defaults to `http://localhost:8000/api/posts` in development.

See [API Reference](./api-reference.md) for the full contract.
