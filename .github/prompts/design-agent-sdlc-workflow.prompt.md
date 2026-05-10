# Design: Agent SDLC Workflow Documentation

## Summary
Add a learner-friendly workflow explainer that shows the project agents working together and walks readers through the repo's software development lifecycle from request to merge.

## Goal and Audience
- **Goal:** Make the multi-agentic-loop-lab workflow easy to understand at a glance before a learner reads the longer prose in `docs/workflow.md`.
- **Primary audience:** New learners opening the repo README and docs for the first time.
- **Secondary audience:** Users running the agent workflow who want a quick visual reminder of who does what and in what order.

## Diagrams
- **Shipped documentation asset:** `docs/diagrams/agent-sdlc-workflow.svg`
- **Embed location:** `docs/workflow.md`

This feature does **not** need separate design-review SVGs under `.github/prompts/diagrams/`; the shipped docs SVG is the artifact being designed.

## Simplest Implementation Approach
- Extend the existing workflow page instead of creating a new documentation page.
- Add one standalone animated SVG asset under `docs/diagrams/`.
- Embed that SVG near the top of `docs/workflow.md`.
- Add a short numbered SDLC outline directly below the diagram so the page still teaches the workflow even if SVG animation does not play in every Markdown renderer.
- Treat the repo workflow's post-merge feature record separately from the implementation target:
  - **Implementation target now:** improve `docs/workflow.md` and add `docs/diagrams/agent-sdlc-workflow.svg`.
  - **Post-merge workflow record later:** allow the standard repository process to create `docs/features/agent-sdlc-workflow.md` after merge completion.

This keeps the change docs-only, avoids new tooling, and matches the project's learning-scaffold style.

## Data Model
- **No backend or frontend runtime data model changes.**
- **No in-memory store changes.**
- New repository asset only:
  - `docs/diagrams/agent-sdlc-workflow.svg` — static file containing the animated documentation diagram.

## API Contract
- **No application API changes.**
- No backend endpoints, schemas, routers, services, or frontend API client contracts are affected.

## Business Logic
- **No backend/frontend business logic changes.**
- Documentation behavior is fixed as follows:
  1. `docs/workflow.md` becomes the canonical page for the visual workflow explanation.
  2. The page embeds `./diagrams/agent-sdlc-workflow.svg`.
  3. The page adds a concise SDLC outline that mirrors the existing Step 1–9 workflow already documented lower on the page.
  4. The SVG must remain understandable without motion by using visible labels, arrows, and numbered phases.
  5. The normal post-merge repository workflow may create `docs/features/agent-sdlc-workflow.md` as a feature record, but that record is **not** the primary teaching page for this feature.

## UI

### Documentation location
- **Modify:** `docs/workflow.md`
- **Create:** `docs/diagrams/agent-sdlc-workflow.svg`
- **Implementation slice must not create a new primary docs page.** Keep `docs/workflow.md` as the main teaching page.
- **Post-merge workflow record:** `docs/features/agent-sdlc-workflow.md` is allowed later if created by the repository's standard merge-completion workflow.
- **README update during implementation:** **Not needed.** The root README already links readers into `docs/index.md` and already introduces the agent workflow.
- **`docs/index.md` update during implementation:** **Not needed.** The existing link to `docs/workflow.md` remains correct.
- **After merge completion:** no additional README or `docs/index.md` change is required by this feature design; only the standard post-merge feature record is expected.

### `docs/workflow.md` content changes
Insert a new section **after `## The Three-Tier System` and before `## What Is a Slice?`** with this structure:

1. `## Visual Workflow`
2. One short intro sentence explaining that the diagram shows both agent collaboration and the lifecycle sequence.
3. Embedded SVG:
   ```md
   ![Animated diagram of the agent SDLC workflow](./diagrams/agent-sdlc-workflow.svg)
   ```
4. One short caption/note:
   - Explain that the labels and numbered phases are the source of truth if animation is not visible in the current Markdown renderer.
5. `## SDLC Outline`
6. A numbered list that maps to the existing workflow terminology:
   1. User requests a feature
   2. Orchestrator invokes Designer
   3. Designer produces the design artifact
   4. Orchestrator creates slices and plan
   5. Orchestrator creates worktrees and task files
   6. Implementers build slices in parallel
   7. Orchestrator gates each slice with tests and smoke checks
   8. Orchestrator updates docs
   9. User merges cleared slices

### Animated diagram format
Use a standalone SVG file, not Mermaid.

#### Why not Mermaid
- GitHub-flavored Markdown can render Mermaid diagrams, but Mermaid animation is not a reliable fit for this repo's plain Markdown docs.
- A self-contained SVG is simpler, requires no extra tooling, and can still render as a normal image if animation support is limited.

#### Fixed SVG spec
- **File:** `docs/diagrams/agent-sdlc-workflow.svg`
- **Canvas:** approximately `900×520`
- **Background:** white
- **Layout:** top row of actor boxes, middle workflow path, bottom legend
- **Actors to show:** `User`, `Orchestrator`, `Designer`, `Implementer A`, `Implementer B`, `Merge / Docs`
- **Phases to show in order:** `Request`, `Design`, `Plan`, `Worktrees`, `Parallel Build`, `Gate`, `Docs`, `Merge`
- **Animation style:** simple looped highlight only
  - one blue token/dot moves across the phase path
  - active phase box lightly pulses or changes fill briefly
  - duration roughly `10s–15s`, repeating
- **Static readability requirements:**
  - every phase has a visible label and number
  - arrows remain visible without animation
  - implementer parallelism is shown by two side-by-side implementer lanes/cards during the `Parallel Build` phase
  - include a small legend noting blue = active step, grey = waiting/complete context

## Fixed Technical Decisions
- Use **one standalone SVG asset** under `docs/diagrams/`.
- Embed the SVG from **existing** `docs/workflow.md`.
- Keep the SDLC outline aligned to the page's existing Step 1–9 terminology.
- Treat this as a **docs-only** feature.
- Use plain Markdown plus SVG only.

## Off-Limits Choices
- Do **not** add Mermaid for the final animated diagram.
- Do **not** add JavaScript, a docs site generator, CSS build tooling, or image-generation dependencies.
- Do **not** create a new primary docs page for this feature during implementation.
- Do **not** update backend or frontend application code.
- Do **not** change the existing step order or invent new agent roles.
- Do **not** replace the detailed prose already in `docs/workflow.md`; add the visual summary above it.

## Shared Contract
Not applicable. This is intentionally a **single slice** so no inter-slice contract is needed.

## Slices

### Slice 1: agent-sdlc-workflow-docs
- **Branch:** `feat/agent-sdlc-workflow-docs`
- **Owns:**
  - `docs/workflow.md`
  - `docs/diagrams/agent-sdlc-workflow.svg`
- **Acceptance criteria:**
  1. `docs/workflow.md` includes a new `## Visual Workflow` section in the specified location.
  2. The page embeds `./diagrams/agent-sdlc-workflow.svg` with descriptive alt text.
  3. The page includes a numbered `## SDLC Outline` that matches the existing 9-step workflow language already used in the repo.
  4. `docs/diagrams/agent-sdlc-workflow.svg` visually shows all required actors and all required phases.
  5. The SVG communicates parallel work by showing two implementer lanes/cards active during the build phase.
  6. The SVG uses simple built-in animation only; no external scripts or tooling are introduced.
  7. The diagram remains understandable when viewed as a static image because labels, arrows, and numbering are always visible.
  8. No changes are made during implementation to `README.md`, `docs/index.md`, backend files, frontend files, or `docs/features/agent-sdlc-workflow.md`.
  9. The design remains compatible with the repository's standard post-merge creation of `docs/features/agent-sdlc-workflow.md`, while keeping `docs/workflow.md` as the canonical teaching page.
