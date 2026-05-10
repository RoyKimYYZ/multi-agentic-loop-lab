# Parallel Agent Blog

A simple blog application built to learn **accelerated development with parallel AI agents** using VS Code, GitHub Copilot, and Git worktrees.

## What It Does

- List all blog posts on the home page
- View a single post on its own detail page
- Create a new post via a form
- Delete a post from the list or detail page
- Edit a post's title and content inline on its detail page

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python · FastAPI · uv |
| Frontend | React · TypeScript · Vite |
| Persistence | In-memory (learning scaffold — no database) |

## Quick Start

### Backend

```bash
cd backend
uv run uvicorn app.main:app --reload --port 8000
```

API available at `http://localhost:8000`  
Interactive docs at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at `http://localhost:5173`

### Both at once (smoke test script)

```bash
./smoke-test.sh          # start from main repo
./stop.sh                # stop both servers
```

## Running Tests

```bash
cd backend
PYTHONPATH=. uv run pytest -q
uv run ruff check .
```

```bash
cd frontend
npm run build
npm run lint
```

## API Reference

All endpoints are prefixed with `/api/posts`.

| Method | Path | Description | Response |
|---|---|---|---|
| `GET` | `/api/posts/` | List all posts | `200 [Post]` |
| `POST` | `/api/posts/` | Create a post | `201 Post` |
| `GET` | `/api/posts/{id}` | Get one post | `200 Post` or `404` |
| `PUT` | `/api/posts/{id}` | Update a post | `200 Post` or `404` |
| `DELETE` | `/api/posts/{id}` | Delete a post | `204` or `404` |

### Post shape

```json
{
  "id": 1,
  "title": "Hello world",
  "content": "Post body text",
  "author": "Roy",
  "created_at": "2026-05-09T20:00:00"
}
```

## Project Structure

```
parallel-agent/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app setup
│   │   ├── routers/         # HTTP route handlers
│   │   ├── schemas/         # Pydantic request/response models
│   │   ├── models/          # Domain models
│   │   └── services/        # In-memory business logic
│   └── tests/               # pytest integration tests
├── frontend/
│   └── src/
│       ├── api/             # fetch wrappers (posts.ts)
│       ├── components/      # PostList, PostForm
│       └── pages/           # HomePage, PostDetailPage
├── .github/
│   ├── agents/              # Copilot agent definitions
│   └── prompts/             # Design artifacts and task files
├── smoke-test.sh            # Start servers + open browser
├── merge-slice.sh           # Merge a worktree slice and clean up
└── stop.sh                  # Stop running servers
```

## Parallel Agent Workflow

This project uses a three-tier agent system to teach parallel development:

```
User
 └── Orchestrator  — plans, coordinates, gates
      ├── Designer  — designs the feature
      └── Implementer (×N) — one per slice, runs in parallel
```

Each feature is split into independent **slices**, each on its own Git worktree and branch. Agents work simultaneously without stepping on each other.

📖 **[Full documentation in the wiki →](./docs/index.md)**

## Features Implemented

| Feature | Branch merged | Slices |
|---|---|---|
| View post (detail page) | `feat/view-post-ui` | 1 frontend |
| Create post (form) | `feat/create-post-form-ui` | 1 frontend |
| Delete post | `feat/delete-post-api` + `feat/delete-post-ui` | 1 backend (tests) + 1 frontend |
| Edit post | `feat/edit-post-api` + `feat/edit-post-ui` | 1 backend (tests) + 1 frontend |
