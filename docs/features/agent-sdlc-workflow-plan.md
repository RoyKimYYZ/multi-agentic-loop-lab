# Implementation Plan: Agent SDLC Workflow

**Status:** In Progress
**Design artifact:** [design-agent-sdlc-workflow.prompt.md](../../.github/prompts/design-agent-sdlc-workflow.prompt.md)

---

## Slices

| # | Slice | Branch | Depends on |
|---|---|---|---|
| 1 | agent-sdlc-workflow-docs | `feat/agent-sdlc-workflow-docs` | — |

---

## Technical Decisions (fixed — Implementers must NOT deviate)

- The primary teaching page stays `docs/workflow.md`
- The animated diagram ships as one standalone SVG at `docs/diagrams/agent-sdlc-workflow.svg`
- The diagram is embedded with Markdown image syntax, not Mermaid or JavaScript
- The `## SDLC Outline` list must mirror the repository's existing 9-step workflow terminology
- The SVG must remain understandable as a static image with visible labels, arrows, numbered phases, and two parallel implementer lanes
- This is a docs-only slice with no backend, frontend, or API changes

## Off-Limits for Implementers (do not let agents decide these)

- Do not add Mermaid for the final animated diagram
- Do not add JavaScript, CSS tooling, image-generation dependencies, or a docs site generator
- Do not create a new primary docs page for implementation
- Do not change the step order or invent new agent roles
- Do not modify backend files, frontend files, `README.md`, `docs/index.md`, `docs/api-reference.md`, or `docs/features/agent-sdlc-workflow.md`

---

## Slice Plans

### Slice 1: agent-sdlc-workflow-docs

**Ordered steps:**
1. Update `docs/workflow.md` by inserting a new `## Visual Workflow` section after `## The Three-Tier System`
2. Embed `./diagrams/agent-sdlc-workflow.svg` with descriptive alt text and add the fallback note that labels and numbered phases are the source of truth if animation is not visible
3. Add a `## SDLC Outline` numbered list that matches the repository's existing Step 1–9 workflow language
4. Create `docs/diagrams/agent-sdlc-workflow.svg` as a self-contained animated SVG showing the required actors, the eight labeled phases, arrows, legend, and two parallel implementer lanes
5. Keep the implementation docs-only and avoid changes outside the owned files
6. Commit the slice branch changes

**Files owned:**
- `docs/workflow.md`
- `docs/diagrams/agent-sdlc-workflow.svg`

**Files off-limits:**
- `README.md`
- `docs/index.md`
- `docs/api-reference.md`
- `docs/features/agent-sdlc-workflow.md`
- Everything under `backend/`
- Everything under `frontend/`
- Any file not listed in the owned files section

**Acceptance criteria:**
1. `docs/workflow.md` includes a new `## Visual Workflow` section in the specified location
2. The page embeds `./diagrams/agent-sdlc-workflow.svg` with descriptive alt text
3. The page includes a numbered `## SDLC Outline` aligned to the existing 9-step workflow language
4. `docs/diagrams/agent-sdlc-workflow.svg` shows `User`, `Orchestrator`, `Designer`, `Implementer A`, `Implementer B`, and `Merge / Docs`
5. The SVG shows the phases `Request`, `Design`, `Plan`, `Worktrees`, `Parallel Build`, `Gate`, `Docs`, and `Merge`
6. The SVG uses simple built-in animation only and still reads clearly when viewed as a static image
7. Parallel work is visible through two side-by-side implementer lanes/cards during the build phase
8. No files outside the owned list are modified during implementation
