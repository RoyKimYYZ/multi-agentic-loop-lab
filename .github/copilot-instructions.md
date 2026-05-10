# Copilot Instructions

This project is a learning scaffold for practicing productive development with VS Code, GitHub Copilot, Git worktrees, GitHub issues, and parallel agents.

The goal is not production-grade engineering. Optimize for clear learning, simple code, readable architecture, and agent-friendly task boundaries.

## Project Context

This repository contains a simple blog application:

- Backend: FastAPI using `uv`
- Frontend: React + Vite
- Purpose: learn how parallel agents can work on independent slices of the same application
- Current priority: clarity, modularity, and coaching value over completeness

## Core Development Principles

Keep implementation simple and easy to follow.

Do not add production-grade infrastructure unless explicitly requested. Avoid:

- authentication systems
- complex authorization models
- background job systems
- distributed caching
- observability stacks
- complex environment loading
- retry frameworks
- fallback logic
- generic abstraction layers
- premature service factories
- complex dependency injection
- database migration tooling unless the lesson specifically calls for it

Do not add fallback logic just to make code more defensive. If an input, API, or dependency is expected to exist in the learning flow, keep the path direct and visible. Prefer a clear error over extra branching that hides the concept being taught.

Prefer straightforward code over clever code.

## Agent Behavior

Act like a coach as well as a coding assistant.

When making changes:

- explain the learning reason behind the change
- keep the scope small
- prefer one understandable step over many hidden changes
- connect implementation choices to multi-agentic-loop-lab workflow concepts
- avoid large refactors unless the user explicitly asks

When the user says "next" or "proceed," do not blindly continue feature work. Briefly explain what concept comes next and why it matters for parallel agents.

## Architecture Guidelines

Design the application so multiple agents can work independently.

Use modular boundaries that map naturally to parallel work:

- backend routers own HTTP endpoints
- backend schemas own request/response validation
- backend services own simple business logic
- frontend API clients own HTTP calls
- frontend components own UI rendering
- frontend pages or route-level views own screen composition
- tests live close to the behavior they verify

Create reusable modules only when they remove real duplication or make agent ownership clearer. Do not create generic utilities "just in case."

Prefer vertical slices for agent tasks. For example:

- one agent builds post listing API behavior
- one agent builds frontend post listing UI
- one agent writes tests for post creation
- one agent creates a skill or prompt for repeatable workflows

## Backend Guidelines

Use FastAPI idioms and keep handlers readable.

Backend structure:

- `app/main.py` — app setup
- `app/routers/` — route modules
- `app/schemas/` — Pydantic request/update schemas
- `app/models/` — simple domain models
- `app/services/` — simple in-memory business logic
- `tests/` — pytest tests

Use `uv` for Python dependency management.

Common backend commands:

```bash
cd backend
uv run pytest
uv run ruff check .
uv run mypy .
uv run uvicorn app.main:app --reload
```

Keep persistence simple. In-memory storage is acceptable for this learning scaffold.

## Frontend Guidelines

Use React + Vite with simple, readable components.

Prefer:

- functional React components
- plain TypeScript
- small API client modules in `src/api/`
- clear component names
- minimal state management
- CSS that is easy to inspect and modify

Do not add a router, query library, global store, or design system unless the user asks or the lesson requires it.

## Testing Guidelines

Write focused tests for changed behavior only.

Prefer:

- backend endpoint tests with pytest + httpx
- clear test names
- small fixtures
- no complex mocking unless necessary

## Agent Hierarchy

This project uses a three-tier agent system. Each tier has a specific role and clear boundaries.

```
User
 └── Orchestrator  — plans work, sets up worktrees, coordinates slices
      ├── Designer  — reads codebase, designs feature (UI + API + logic + data)
      └── Implementer (×N) — implements one vertical slice end-to-end
```

| Agent | File | Invokes | Does NOT |
|---|---|---|---|
| Orchestrator | `.github/agents/orchestrator.agent.md` | Designer, Implementer | Write code |
| Designer | `.github/agents/designer.agent.md` | — | Write code |
| Implementer | `.github/agents/implementer.agent.md` | — | Touch other slices |

### How to Use

1. Open Copilot Chat → switch to **Agent** mode → select **Orchestrator**
2. Describe the feature: `"I want to add comments to posts"`
3. The Orchestrator delegates to the Designer, then creates worktree + branch + task file per slice
4. Open a new VS Code window per slice worktree → run the **Implementer** agent with the task file

### Design Artifacts

The Designer writes `.github/prompts/design-{feature}.prompt.md`.
The Orchestrator writes `.github/prompts/task-{slice}.prompt.md` per slice.
These files are the shared contract between tiers — read them before implementing.

## Parallel-Agent Workflow

Keep work easy to split across Git branches or Git worktrees.

Before large changes, identify:

- which files this agent owns
- which files other agents might touch
- what contract connects frontend and backend
- what tests prove the slice works

For shared contracts, prefer explicit API shapes and simple examples over hidden assumptions.

When a task would be better handled by a focused customization file, suggest one of:

- `.github/instructions/*.instructions.md` — scoped coding conventions by file pattern
- `.github/prompts/*.prompt.md` — repeatable one-shot tasks
- `.github/skills/<name>/SKILL.md` — reusable multi-step workflows

## SDLC Defaults

Use basic SDLC practices without overbuilding:

- small branches
- clear commit messages
- focused tests
- linting before PRs
- CI for install, lint, and test
- issue-sized work items sized for a single agent

Do not introduce enterprise SDLC ceremony unless requested.

## Communication Style

Be explicit about tradeoffs.

If a production-grade pattern is intentionally skipped, say so briefly and explain that the project is optimized for learning.

When unsure, choose the simpler implementation and call out what could be upgraded later.
