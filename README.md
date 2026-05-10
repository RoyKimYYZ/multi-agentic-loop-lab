# Multi-Agent Blog

A simple blog application built to learn **accelerated development with multi-agent collaboration** using VS Code, GitHub Copilot, and Git worktrees.

This repo is intentionally lightweight so the development workflow stays easy to see:
- the app is a FastAPI + React blog with in-memory persistence
- features are delivered as small vertical slices
- the docs capture the Orchestrator / Designer / Implementer loop used to build each slice

## What It Does

- List all blog posts on the home page
- View a single post on its own detail page
- Create a new post from the top nav using a modal form
- Delete a post from the list or detail page with a confirmation prompt
- Edit a post's title and content inline on its detail page

The current UI is still evolving. The codebase now includes a fixed top navigation bar, modal-based post creation, and the shared edit/detail flows. The next visual pass is tracked in the UI overhaul plan under `docs/features/`.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python · FastAPI · uv |
| Frontend | React · TypeScript · Vite |
| Persistence | In-memory (learning scaffold — no database) |

## Current Focus

The latest repository work is centered on two things:

- **Parallel-agent workflow docs** — `docs/workflow.md` and `docs/index.md` explain the 9-step SDLC loop, worktrees, slice ownership, and merge flow.
- **UI overhaul planning** — `docs/features/ui-overhaul-plan.md` captures the next front-end slice breakdown and design constraints for the refreshed blog UI.

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

The frontend currently includes:

- a fixed top nav with a `+ New Post` action
- a modal create-post form
- a home page that receives post data and delete handlers from `App.tsx`
- a post detail page with inline edit and delete flows

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

See `docs/api-reference.md` for the full endpoint and payload reference.

## Project Structure

```
multi-agentic-loop-lab/
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
│       ├── components/      # TopNav, PostList, PostForm, EditPostForm
│       └── pages/           # HomePage, PostDetailPage
├── .github/
│   ├── agents/              # Copilot agent definitions
│   └── prompts/             # Design artifacts and task files
├── docs/                    # workflow, architecture, API, feature notes
├── smoke-test.sh            # Start servers + open browser
├── merge-slice.sh           # Merge a worktree slice and clean up
└── stop.sh                  # Stop running servers
```

## Multi-Agent Workflow

This project uses a three-tier agent system to teach parallel development:

```
User
 └── Orchestrator  — plans, coordinates, gates
      ├── Designer  — designs the feature
      └── Implementer (×N) — one per slice, runs in parallel
```

Each feature is split into independent **slices**, each on its own Git worktree and branch. Agents work simultaneously without stepping on each other.

📖 **[Full documentation in the wiki →](./docs/index.md)**

The workflow docs now emphasize the learning loop:

1. A user request becomes a design artifact.
2. The Orchestrator breaks that design into owned slices.
3. Implementers work in isolated worktrees.
4. Validation happens per slice before merge.
5. The README and docs are updated after the feature lands.

## Features Implemented

| Feature | Branch merged | Slices |
|---|---|---|
| View post (detail page) | `feat/view-post-ui` | 1 frontend |
| Create post (form) | `feat/create-post-form-ui` | 1 frontend |
| Delete post | `feat/delete-post-api` + `feat/delete-post-ui` | 1 backend (tests) + 1 frontend |
| Edit post | `feat/edit-post-api` + `feat/edit-post-ui` | 1 backend (tests) + 1 frontend |

## In Progress

| Item | Status | Notes |
|---|---|---|
| Full UI overhaul | In progress | Dark theme, card grid, and refreshed article layout planned in `docs/features/ui-overhaul-plan.md` |
| SDLC workflow docs | In progress | `docs/workflow.md` is being expanded to show the multi-agent loop more explicitly |
