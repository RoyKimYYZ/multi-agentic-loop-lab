# Multi-Agent Workflow

This project is structured to teach **parallel AI agent development** — multiple Copilot agents working on independent branches simultaneously, coordinated by an Orchestrator.

## Visual Workflow

![Multi-agent loop diagram](./diagrams/multi-agent-loop.svg)

The diagram shows the recurring request → design → plan → worktree → parallel build → gate → docs → merge loop.

---

## The Three-Tier System

```
User
 └── Orchestrator   plans, coordinates, gates
      ├── Designer   reads codebase, writes design artifact
      └── Implementer × N   one per slice, work in parallel
```

| Agent | Mode | Role |
|---|---|---|
| **Orchestrator** | `orchestrator` | Turns a feature request into a parallel work plan. Coordinates Designer and Implementers. Gates each slice before merge. |
| **Designer** | `designer` | Reads the current codebase. Produces a structured design artifact with API contract, data model, and UI spec. Does NOT write code. |
| **Implementer** | `implementer` | Implements one vertical slice end-to-end from a task file. Owns specific files. Does NOT touch other slices. |

---

## What Is a Slice?

A **slice** is one self-contained unit of work — a coherent user-visible behaviour from API to UI. Each slice:

- Lives on its own Git branch
- Has its own Git worktree (an isolated checkout)
- Owns a specific list of files
- Has a task file with acceptance criteria

**Good slice:** "list posts API + service" or "PostList React component + API client"  
**Bad slice:** "entire posts feature" or "all backend work"

---

## The Workflow (Steps 1–9)

### Step 1 — Design
The Orchestrator invokes the Designer, which reads the codebase and produces:
```
.github/prompts/design-{feature}.prompt.md
```
This file is the **single source of truth** for what gets built. Both the backend and frontend Implementers read it — they cannot talk to each other, so the design must be explicit and unambiguous.

### Step 2–3 — Plan
The Orchestrator extracts slices from the design, writes an implementation plan per slice, and answers: what steps to follow, what decisions are already made, what must not drift.

### Step 4 — Worktrees
One Git worktree per slice:
```bash
git worktree add ../multi-agentic-loop-lab-{slice} -b feat/{slice}
```
Each worktree is a full checkout of the repo on its own branch. Agents in different worktrees write to different files and cannot conflict.

### Step 5 — Task Files
Each slice gets a task file at:
```
.github/prompts/task-{slice}.prompt.md
```
The task file contains: link to design, implementation steps, files owned, files off-limits, acceptance criteria.

### Step 6 — Brief
The Orchestrator tells the user how many slices exist, which worktree path to open, and how to start the Implementer agent.

### Step 7 — Gate
When an Implementer reports done, the Orchestrator runs automated checks before telling the user anything:

**Backend slice:**
```bash
cd {worktree}/backend
PYTHONPATH=. uv run pytest -q
uv run ruff check .
```

**Frontend slice:**
```bash
cd {worktree}/frontend
npm run build
npm run lint
```

Then runs the browser smoke test:
```bash
./smoke-test.sh {worktree-path}
```

The user confirms manually in the browser before the slice is cleared for merge.

### Step 8 — Docs
The Orchestrator updates `README.md` and `docs/` to reflect the new feature before declaring complete.

### Step 9 — Merge
The user runs `merge-slice.sh` to merge, remove the worktree, and delete the branch:
```bash
./merge-slice.sh {slice-name}
```

---

## Why Git Worktrees?

A Git worktree lets you check out a branch into a **separate directory** without cloning the repo again. This means:

- Two agents can edit different files on different branches simultaneously
- No stashing, no branch switching, no context loss
- Each agent sees only its own branch — clean isolation

```
/home/user/multi-agentic-loop-lab/                    ← main branch
/home/user/multi-agentic-loop-lab-delete-post-api/    ← feat/delete-post-api
/home/user/multi-agentic-loop-lab-delete-post-ui/     ← feat/delete-post-ui
```

All three share the same `.git` folder — they are not copies, just different working trees.

---

## Rebase Conflicts

If two slices both modify the same file (e.g. `App.tsx`), a rebase conflict will occur when merging the second branch.

**Resolution strategy:**
1. Keep `main`'s version of the shared file as the base
2. Re-apply only the net-new additions from the feature branch
3. If a feature's changes can be moved to a file the slice owns exclusively (e.g. move a component into its own page), do that instead

The design artifact should minimize shared-file conflicts by giving each slice exclusive ownership of its files.

---

## Agent Files

| File | Purpose |
|---|---|
| `.github/agents/orchestrator.agent.md` | Full workflow definition for the Orchestrator |
| `.github/agents/designer.agent.md` | Instructions for the Designer |
| `.github/agents/implementer.agent.md` | Instructions for the Implementer |
| `.github/agents/backend-engineer.agent.md` | FastAPI specialist |
| `.github/agents/frontend-engineer.agent.md` | React specialist |
| `.github/agents/backend-tester.agent.md` | pytest specialist |
| `.github/agents/frontend-tester.agent.md` | Vitest specialist |
| `.github/agents/code-reviewer.agent.md` | Quality gate reviewer |

---

## Artifact Files (Generated Per Feature)

Every feature produces these artifact files. They are **never deleted after merge** — they serve as a permanent record of design decisions.

### Design Artifact

**Who creates it:** Designer agent  
**Location:** `.github/prompts/design-{feature-slug}.prompt.md`  
**Purpose:** Single source of truth for what gets built. Contains API contract, data model, UI spec, and slice breakdown. Both backend and frontend Implementers read this — it is their only shared contract.

### Implementation Plan

**Who creates it:** Orchestrator (Step 3, before any code)  
**Location:** `docs/features/{feature-slug}-plan.md`  
**Purpose:** Captures the Orchestrator's decisions: slice list, dependencies, technical choices that are fixed, and decisions that Implementers must NOT make independently. Committed to `main` before worktrees are created — visible to the user as a reviewable record before implementation begins.

### Task Files

**Who creates them:** Orchestrator  
**Location:** `.github/prompts/task-{slice-name}.prompt.md` (one per slice)  
**Purpose:** Step-by-step implementation instructions for one Implementer agent. Contains: link to design artifact, link to plan file, ordered implementation steps, files owned, files off-limits, acceptance criteria.

### Wiki Feature Page

**Who creates it:** Orchestrator (Step 8, after merge)  
**Location:** `docs/features/{feature-slug}.md`  
**Purpose:** Living outcome documentation. Describes what shipped, what changed, what API is exposed, and links back to the design artifact, plan file, and task files.

### How They Connect

```
Designer produces
  └── .github/prompts/design-{feature}.prompt.md
         │
         └── Orchestrator reads → writes (Step 3)
                  ├── docs/features/{feature}-plan.md           ← decisions made before coding
                  │
                  └── Orchestrator creates worktrees + writes (Steps 4-5)
                           ├── .github/prompts/task-{slice-1}.prompt.md  → Implementer 1
                           ├── .github/prompts/task-{slice-2}.prompt.md  → Implementer 2
                           │
                           └── (after merge, Step 8)
                                    docs/features/{feature}.md  → links back to all artifacts
```

