# Multi-Agentic Loop Lab

I built this repository to document my learning process using **multi-agent orchestration** with GitHub Copilot to develop a web application from scratch. The app itself — a simple blog — is just the vehicle. The real subject of this repo is the agent system: the custom agents, the instructions, the prompt files, and the workflow patterns I developed along the way.

If you're exploring how to use VS Code, GitHub Copilot, and Git worktrees to coordinate multiple AI agents across a software development lifecycle, this is what that looks like in practice.

---

## What This Repo Is About

I wanted to answer a concrete question: *can a small set of well-defined custom agents, working on isolated slices of a codebase, produce a functional web app with minimal human intervention beyond direction and review?*

The answer so far is yes — with the right structure. This repo captures that structure.

The key insight is that agents work best when they have **clear ownership** (specific files), **explicit contracts** (design artifacts and task files), and **narrow scope** (one vertical slice per agent). The Orchestrator coordinates the loop; it doesn't write code. The Designer writes the contract; it doesn't implement. The Implementers build; they don't make design decisions.

---

## The Agent System

The agent system lives in `.github/` and consists of three layers.

### Agent mode files — `.github/agents/`

These define the custom Copilot agent modes. Each file is a focused persona with a specific role, tool set, and decision boundary.

| Agent | Role |
|---|---|
| [`orchestrator.agent.md`](.github/agents/orchestrator.agent.md) | Plans the work, coordinates agents, gates merges, updates docs |
| [`designer.agent.md`](.github/agents/designer.agent.md) | Reads the codebase, produces the design artifact — never writes code |
| [`implementer.agent.md`](.github/agents/implementer.agent.md) | Builds one vertical slice end-to-end from a task file |
| [`backend-engineer.agent.md`](.github/agents/backend-engineer.agent.md) | FastAPI specialist for backend slices |
| [`frontend-engineer.agent.md`](.github/agents/frontend-engineer.agent.md) | React/TypeScript specialist for frontend slices |
| [`backend-tester.agent.md`](.github/agents/backend-tester.agent.md) | pytest integration test specialist |
| [`frontend-tester.agent.md`](.github/agents/frontend-tester.agent.md) | Vitest component test specialist |
| [`code-reviewer.agent.md`](.github/agents/code-reviewer.agent.md) | Quality gate — lint, types, test coverage, readability |

### Copilot instructions — `.github/copilot-instructions.md`

This file sets the baseline rules for all agents in this repo: no over-engineering, no production infrastructure, keep code readable, act as a coach. It also defines what "next" means in the context of the multi-agent loop.

### Prompt and task files — `.github/prompts/`

Every feature generates two kinds of files that persist after merge as a permanent record:

- **Design artifacts** (`design-{feature}.prompt.md`) — written by the Designer. These are the single source of truth for what gets built: API contract, data model, UI spec, and slice breakdown.
- **Task files** (`task-{slice}.prompt.md`) — written by the Orchestrator. One per slice, containing ordered implementation steps, files owned, files off-limits, and acceptance criteria.

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

Each feature follows the same 9-step loop. The app grows one vertical slice at a time, and every step is traceable back to an artifact in this repo.

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
| 1 — Request | User | Describes the feature |
| 2 — Design | Designer | Produces `design-{feature}.prompt.md` |
| 3 — Plan | Orchestrator | Writes `docs/features/{feature}-plan.md`, defines slices |
| 4 — Worktrees | Orchestrator | `git worktree add` — one branch per slice |
| 5 — Task files | Orchestrator | Writes `task-{slice}.prompt.md` per slice |
| 6 — Build | Implementers | Each works in isolation; owns specific files |
| 7 — Gate | Orchestrator | Build, lint, tests, smoke test per slice |
| 8 — Docs | Orchestrator | Updates README, `docs/features/{feature}.md` |
| 9 — Merge | User | Runs `./merge-slice.sh {slice}` |

📖 **[Full workflow documentation →](./docs/workflow.md)**
![Multi-agent loop diagram](./docs/diagrams/multi-agent-loop.svg)

---

## Docs

The `docs/` folder tracks every decision and outcome as features land.

| Doc | Purpose |
|---|---|
| [docs/workflow.md](docs/workflow.md) | End-to-end loop walkthrough with diagram |
| [docs/architecture.md](docs/architecture.md) | Backend and frontend structure |
| [docs/api-reference.md](docs/api-reference.md) | All endpoints and payload shapes |
| [docs/features/](docs/features/) | One page per shipped feature |

---

## Features Shipped

Each row is a completed loop iteration.

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

The app is a simple blog — a FastAPI backend and a React + Vite frontend with in-memory persistence. It is intentionally minimal. The complexity ceiling is kept low on purpose so the agent workflow stays easy to follow.

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
