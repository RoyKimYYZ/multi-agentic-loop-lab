# Orchestration Backlog

Gaps identified in the agent-based development lifecycle for this project.
Revisit when ready to mature the multi-agentic-loop-lab workflow.

---

## Current Coverage

| Phase | Agent(s) |
|---|---|
| Design | `Designer` |
| Plan | `Orchestrator` + task/design templates |
| Implement | `Implementer`, `backend-engineer`, `frontend-engineer` |
| Validate | `backend-tester`, `frontend-tester`, `code-reviewer` |

---

## Missing Pieces

### 1. CI Workflow (GitHub Actions) — Highest Priority

**Why:** Validation without CI is only as reliable as the human who remembers to run `npm run build` before merging. CI catches regressions when two parallel branches land.

**What to create:** `.github/workflows/ci.yml`

Minimum jobs:
- `backend`: `cd backend && PYTHONPATH=. uv run pytest -q && uv run ruff check .`
- `frontend`: `cd frontend && npm ci && npm run lint && npm run build`

Trigger on: `push` to any `feat/*` branch and `pull_request` to `main`.

---

### 2. Researcher Agent — Pre-Design Phase

**Why:** Currently, if a question like "should we use polling or WebSockets for live updates?" arises, there is no agent that investigates options, reads existing patterns, and produces a written recommendation *before* the Designer starts. Without a researcher, the Designer guesses or the Orchestrator fills in — neither is clean.

**What to create:** `.github/agents/researcher.agent.md`

Role: Read codebase, search GitHub issues/docs, evaluate options, write a short recommendation artifact at `.github/prompts/research-{topic}.md`. Read-only — no code changes.

---

### 3. Scoped Coding Instructions

**Why:** Multiple agents who never share context need explicit written conventions. Currently agents infer conventions by reading existing files — fragile when new agents start with no history.

**What to create:**
- `.github/instructions/backend.instructions.md` — apply to `backend/**`
- `.github/instructions/frontend.instructions.md` — apply to `frontend/**`

Content: import ordering, type annotation expectations, naming conventions, test patterns — extracted from existing code so agents get it automatically.

---

### 4. Bug Fixer Agent — Post-Validate Loop

**Why:** When validation fails (tests break after merge, CI goes red), there is no agent that owns "read the failure, identify the file, fix it, re-verify." The `code-reviewer` is intentionally read-only, so nothing closes the loop automatically today.

**What to create:** `.github/agents/bug-fixer.agent.md`

Role: Given a failing test output or CI log, identify the root cause, fix only the broken file, re-run the check, and report. Scoped to the failing slice only.

---

### 5. GitHub Issues Integration

**Why:** The Orchestrator creates worktrees and task files but doesn't create GitHub Issues. With Issues, each slice becomes a trackable work item, PRs can close issues automatically (`Closes #N`), and the project board shows real progress.

**What to add to `orchestrator.agent.md`:** A step between "Set Up Worktrees" and "Produce Slice Task Files" that runs:
```bash
gh issue create --title "feat({slice}): {summary}" --body "Task file: .github/prompts/task-{slice}.prompt.md"
```

---

## Recommended Order

1. **CI workflow** — affects every future slice immediately
2. **Scoped instructions** — affects every future agent immediately
3. **Researcher agent** — needed before the next non-trivial feature decision
4. **Bug fixer agent** — needed once CI exists and can surface failures
5. **GitHub Issues integration** — quality of life, not blocking
