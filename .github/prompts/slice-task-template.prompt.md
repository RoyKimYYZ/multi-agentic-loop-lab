---
description: "Template for a slice task file. Produced by the Orchestrator agent. Read by the Slice agent assigned to this work."
name: "Slice Task Template"
agent: "ask"
---
# Slice Task: {Slice Name}

## Design Artifact
Read this file first: [design-{feature-slug}.prompt.md](./design-{feature-slug}.prompt.md)

## Your Branch
`feat/{slice-name}`

## Your Worktree
`../{repo-name}-{slice-name}/`

## Files You Own
{List every file this slice creates or modifies. Be explicit.}

- `backend/app/models/{model}.py`
- `backend/app/schemas/{schema}.py`
- `backend/app/services/{service}.py`
- `backend/app/routers/{router}.py`
- `backend/tests/test_{feature}.py`

## Files That Are Off-Limits
{Files owned by other slices running in parallel.}

- `frontend/src/` — owned by the frontend slice agent
- Any file not in your owned list above

## Acceptance Criteria
{What must be true for this slice to be considered done.}

- [ ] All listed endpoints return correct HTTP status codes
- [ ] All new tests pass: `uv run pytest`
- [ ] Linter is clean: `uv run ruff check .`
- [ ] No files outside the owned list were modified

## Notes from the Designer
{Any design decisions, tradeoffs, or implementation hints the designer left for this slice.}
