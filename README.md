# Multi-Agentic Loop Lab

A personal learning journal documenting **multi-agent orchestration** with GitHub Copilot. The app is a simple blog, but the blog is just the vehicle. The focus is the agent system: custom agents, instructions, prompt files, and workflow patterns.

If you want to see how VS Code, GitHub Copilot, and Git worktrees can coordinate multiple AI agents through a real development cycle, this repo shows one working approach.

---

## What This Repo Is About

Can purpose-built agents, each owning one slice of a codebase, ship a working web app with minimal human steering? Yes, with the right structure.

Agents work best with clear file ownership, a written contract to reference, and a scope narrow enough that they never have to guess. The Orchestrator runs the loop but doesn't touch code. The Designer writes the spec but doesn't implement. The Implementers build without making design calls.

---

## The Agent System

All agent configuration lives in `.github/`, in three layers.

### Agent mode files in `.github/agents/`

| Agent | Role |
|---|---|
| [`orchestrator.agent.md`](.github/agents/orchestrator.agent.md) | Plans work, coordinates agents, gates merges, updates docs |
| [`designer.agent.md`](.github/agents/designer.agent.md) | Reads codebase, produces design artifact (no code writing) |
| [`implementer.agent.md`](.github/agents/implementer.agent.md) | Builds one vertical slice end-to-end from a task file |
| [`backend-engineer.agent.md`](.github/agents/backend-engineer.agent.md) | FastAPI specialist |
| [`frontend-engineer.agent.md`](.github/agents/frontend-engineer.agent.md) | React/TypeScript specialist |
| [`backend-tester.agent.md`](.github/agents/backend-tester.agent.md) | pytest integration tests |
| [`frontend-tester.agent.md`](.github/agents/frontend-tester.agent.md) | Vitest component tests |
| [`code-reviewer.agent.md`](.github/agents/code-reviewer.agent.md) | Quality gate: lint, types, test coverage, readability |

### Copilot instructions in `.github/copilot-instructions.md`

Ground rules for all agents: no over-engineering, no production infrastructure, readable code, coach-style guidance.

### Prompt and task files in `.github/prompts/`

Every feature produces two persistent files:

- **Design artifacts** (`design-{feature}.prompt.md`) — written by the Designer. Single source of truth: API shape, data model, UI spec, slice breakdown.
- **Task files** (`task-{slice}.prompt.md`) — written by the Orchestrator. One per slice: implementation steps, files owned, files off-limits, acceptance criteria.

```
.github/prompts/
├── design-view-post.prompt.md
├── design-create-post-form.prompt.md
├── design-delete-post.prompt.md
├── design-edit-post.prompt.md
├── design-ui-overhaul.prompt.md
├── design-agent-sdlc-workflow.prompt.md
├── task-view-post-ui.prompt.md
├── task-create-post-form-ui.prompt.md
├── task-delete-post-api.prompt.md
├── task-delete-post-ui.prompt.md
├── task-edit-post-api.prompt.md
├── task-edit-post-ui.prompt.md
├── task-ui-overhaul-system.prompt.md
└── task-ui-overhaul-components.prompt.md
```

---

## The Multi-Agent Loop

9-step loop, one vertical slice per iteration, every step traceable to an artifact.

```
User
 └── Orchestrator  — plans, coordinates, gates
      ├── Designer  — reads codebase, writes design artifact
      └── Implementer × N  — one per slice, isolated worktrees
           ├── backend-engineer / backend-tester
           └── frontend-engineer / frontend-tester / code-reviewer
```

| Step | Who | What |
|---|---|---|
| 1. Request | User | Describes the feature |
| 2. Design | Designer | Produces `design-{feature}.prompt.md` |
| 3. Plan | Orchestrator | Writes `docs/features/{feature}-plan.md` and defines slices |
| 4. Worktrees | Orchestrator | Runs `git worktree add`, one branch per slice |
| 5. Task files | Orchestrator | Writes `task-{slice}.prompt.md` for each slice |
| 6. Build | Implementers | Each agent works in isolation on its own files |
| 7. Gate | Orchestrator | Build, lint, tests, smoke test per slice |
| 8. Docs | Orchestrator | Updates README and `docs/features/{feature}.md` |
| 9. Merge | User | Runs `./merge-slice.sh {slice}` |

📖 **[Full workflow documentation →](./docs/workflow.md)**
![Multi-agent loop diagram](./docs/diagrams/multi-agent-loop.svg)

---

## Docs

| Doc | Purpose |
|---|---|
| [docs/workflow.md](docs/workflow.md) | End-to-end loop walkthrough with diagram |
| [docs/architecture.md](docs/architecture.md) | Backend and frontend structure |
| [docs/api-reference.md](docs/api-reference.md) | All endpoints and payload shapes |
| [docs/features/](docs/features/) | One page per shipped feature |

---

## Features Shipped

| Feature | Slices | Design artifact | Plan |
|---|---|---|---|
| View post | 1 frontend | [design](/.github/prompts/design-view-post.prompt.md) | — |
| Create post | 1 frontend | [design](/.github/prompts/design-create-post-form.prompt.md) | — |
| Delete post | 1 backend tests + 1 frontend | [design](/.github/prompts/design-delete-post.prompt.md) | [plan](docs/features/delete-post-plan.md) |
| Edit post | 1 backend tests + 1 frontend | [design](/.github/prompts/design-edit-post.prompt.md) | [plan](docs/features/edit-post-plan.md) |

## In Progress

| Item | Plan |
|---|---|
| Full UI overhaul | [plan](docs/features/ui-overhaul-plan.md) |
| SDLC workflow visual docs | [plan](docs/features/agent-sdlc-workflow-plan.md) |

---

## The Blog App

FastAPI backend + React/Vite frontend, in-memory persistence. Kept minimal intentionally — the workflow is the point, not the app.

### Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python · FastAPI · uv |
| Frontend | React · TypeScript · Vite |
| Persistence | In-memory (no database) |

### What It Does

- List all posts on the home page
- View a single post on its own detail page
- Create a new post from the top nav via a modal form
- Delete a post from the list or detail page
- Edit a post's title and content inline on the detail page

### Quick Start

```bash
# Backend
cd backend
uv run uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install && npm run dev

# Both at once
./smoke-test.sh
./stop.sh
```

### Running Tests

```bash
cd backend && PYTHONPATH=. uv run pytest -q && uv run ruff check .
cd frontend && npm run build && npm run lint
```

### Project Structure

```
multi-agentic-loop-lab/
├── .github/
│   ├── agents/              # Custom Copilot agent modes
│   ├── prompts/             # Design artifacts + task files (one per slice)
│   └── copilot-instructions.md
├── docs/
│   ├── workflow.md          # Multi-agent loop walkthrough
│   ├── architecture.md
│   ├── api-reference.md
│   ├── diagrams/            # SVG workflow diagram
│   └── features/            # Feature pages + implementation plans
├── backend/
│   └── app/
│       ├── routers/         # HTTP route handlers
│       ├── schemas/         # Pydantic models
│       ├── models/          # Domain models
│       └── services/        # In-memory business logic
├── frontend/
│   └── src/
│       ├── api/             # Fetch wrappers
│       ├── components/      # TopNav, PostList, PostForm, EditPostForm
│       └── pages/           # HomePage, PostDetailPage
├── smoke-test.sh
├── merge-slice.sh
└── stop.sh
```

## License

This project is licensed under the [MIT License](LICENSE).
