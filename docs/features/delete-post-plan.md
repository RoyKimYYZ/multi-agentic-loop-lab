# Implementation Plan: Delete Post

**Status:** Merged ✅
**Design artifact:** [design-delete-post.prompt.md](../../.github/prompts/design-delete-post.prompt.md)

---

## Slices

| # | Slice | Branch | Depends on |
|---|---|---|---|
| 1 | delete-post-api | `feat/delete-post-api` | — |
| 2 | delete-post-ui | `feat/delete-post-ui` | — (parallel) |

Both slices can run in parallel — they own completely separate files.

---

## Technical Decisions (fixed — Implementers must NOT deviate)

- `DELETE /api/posts/{id}` returns **204 No Content** with an empty body (not 200)
- The frontend `deletePost()` function must **not** call `res.json()` on the 204 response
- Confirmation uses `window.confirm("Delete this post?")` — no custom modal or component
- After list delete: **optimistic removal** via `posts.filter()` — no refetch
- After detail delete: **navigate to "/"** via `useNavigate` — do not stay on the page
- On failure: show `"Failed to delete post."` in the existing `error` state — no new state variable
- Delete button placement: inside each `<li>` in `PostList` AND on `PostDetailPage`
- `window.confirm` call lives in `PostList` (not in `HomePage`) so `HomePage` stays clean

## Off-Limits for Implementers (do not let agents decide these)

- Do not add a toast or snackbar notification library
- Do not add a custom confirmation dialog component
- Do not add a loading/spinner state for the delete action
- Do not modify `App.tsx` or `PostForm.tsx`
- Do not modify any backend app code (route or service) — they are already correct

---

## Slice Plans

### Slice 1: delete-post-api

**Task file:** [task-delete-post-api.prompt.md](../../.github/prompts/task-delete-post-api.prompt.md)

**Ordered steps:**
1. Open `backend/tests/test_posts.py`
2. Add four new test functions after existing tests (do not modify existing tests)
3. Run `PYTHONPATH=. uv run pytest -q` — all 7 tests must pass
4. Run `uv run ruff check .` — fix any new lint errors
5. Commit

**Files owned:**
- `backend/tests/test_posts.py`

**Files off-limits:**
- `backend/app/routers/posts.py` (already implemented)
- `backend/app/services/post_service.py` (already implemented)
- Everything under `frontend/`

**Acceptance criteria:**
1. `DELETE /api/posts/{id}` valid → 204, empty body
2. `DELETE /api/posts/{id}` missing → 404, `{"detail": "Post not found"}`
3. After delete, `GET /api/posts/{id}` → 404
4. After delete, ID absent from `GET /api/posts/`
5. All 3 pre-existing tests still pass

---

### Slice 2: delete-post-ui

**Task file:** [task-delete-post-ui.prompt.md](../../.github/prompts/task-delete-post-ui.prompt.md)

**Ordered steps:**
1. Add `deletePost(id)` to `frontend/src/api/posts.ts`
2. Add `onDelete` prop + Delete button to `frontend/src/components/PostList.tsx`
3. Add `handleDelete` + wire `onDelete` in `frontend/src/pages/HomePage.tsx`
4. Add Delete button + `handleDelete` + `useNavigate` to `frontend/src/pages/PostDetailPage.tsx`
5. Run `npm run build` — fix any TypeScript errors
6. Run `npm run lint` — fix any new lint errors
7. Commit

**Files owned:**
- `frontend/src/api/posts.ts`
- `frontend/src/components/PostList.tsx`
- `frontend/src/pages/HomePage.tsx`
- `frontend/src/pages/PostDetailPage.tsx`

**Files off-limits:**
- `frontend/src/App.tsx`
- `frontend/src/components/PostForm.tsx`
- Everything under `backend/`

**Acceptance criteria:**
1. Each post in `PostList` has a visible Delete button
2. Clicking Delete triggers `window.confirm("Delete this post?")`
3. Cancel → no API call, list unchanged
4. Confirm → DELETE called; on 204, post removed immediately (no refetch)
5. `PostDetailPage` has Delete button; confirm → navigate to `/`
6. On API failure → `"Failed to delete post."` shown on screen
7. `PostForm` and navigation unaffected
8. `deletePost` does not call `res.json()`
