# Implementation Plan: Edit Post

**Status:** Merged ✅
**Design artifact:** [design-edit-post.prompt.md](../../.github/prompts/design-edit-post.prompt.md)

---

## Slices

| # | Slice | Branch | Depends on |
|---|---|---|---|
| 1 | edit-post-api | `feat/edit-post-api` | — |
| 2 | edit-post-ui | `feat/edit-post-ui` | none |

The slices can run in parallel because the backend update contract already exists and file ownership does not overlap.

---

## Technical Decisions (fixed - Implementers must NOT deviate)

- Keep the existing `PUT /api/posts/{id}` partial-update backend contract; do not introduce `PATCH`
- The edit UI lives on `PostDetailPage` only; there is no edit button on the home page list
- Edit is inline on the detail page, not a separate route or page
- Editable fields are `title` and `content` only
- Frontend save requests must send only `title` and `content`
- Success behavior: stay on `/posts/{id}`, exit edit mode, and update local page state from the `PUT` response
- No extra GET refetch after save
- Save failure message is exactly `Failed to update post.`
- While edit mode is open, do not show the Delete button

## Off-Limits for Implementers (do not let agents decide these)

- Do not add a toast/snackbar library
- Do not add a custom modal or separate edit route
- Do not expand editing to `author`, `created_at`, or `id`
- Do not change the `Post` model or the backend route/service contract
- Do not modify `frontend/src/App.tsx`, `HomePage.tsx`, `PostList.tsx`, or `PostForm.tsx`

---

## Slice Plans

### Slice 1: edit-post-api

**Ordered steps:**
1. Open `backend/tests/test_posts.py`
2. Add focused tests for the existing `PUT /api/posts/{id}` endpoint
3. Cover both full update assertions and partial update preservation
4. Run `PYTHONPATH=. uv run pytest -q`
5. Run `uv run ruff check .`
6. Commit only the test file

**Files owned:**
- `backend/tests/test_posts.py`

**Files off-limits:**
- `backend/app/routers/posts.py`
- `backend/app/services/post_service.py`
- `backend/app/models/post.py`
- `backend/app/schemas/post.py`
- everything under `frontend/`

**Acceptance criteria:**
1. `PUT /api/posts/{id}` for an existing post returns `200`
2. Response body contains updated `title` and `content`
3. `author`, `id`, and `created_at` are unchanged after update
4. Partial update with only one field still succeeds and preserves untouched fields
5. `PUT /api/posts/99999` returns `404`
6. Missing post response body is `{"detail": "Post not found"}`
7. All existing tests continue to pass

---

### Slice 2: edit-post-ui

**Ordered steps:**
1. Add `PostUpdate` type and `updatePost(id, data)` to `frontend/src/api/posts.ts`
2. Create `frontend/src/components/EditPostForm.tsx`
3. Update `frontend/src/pages/PostDetailPage.tsx` to support view/edit mode toggle and save flow
4. Keep delete behavior available only outside edit mode
5. Run `npm run build`
6. Run `npm run lint`
7. Commit only owned frontend files

**Files owned:**
- `frontend/src/api/posts.ts`
- `frontend/src/components/EditPostForm.tsx`
- `frontend/src/pages/PostDetailPage.tsx`

**Files off-limits:**
- `frontend/src/App.tsx`
- `frontend/src/pages/HomePage.tsx`
- `frontend/src/components/PostList.tsx`
- `frontend/src/components/PostForm.tsx`
- everything under `backend/`

**Acceptance criteria:**
1. `PostDetailPage` shows an `Edit` button when a post is loaded
2. Clicking `Edit` switches the page into inline edit mode on the same URL
3. Edit mode shows prefilled `title` and `content`
4. Edit mode shows `author` and `created_at` as read-only text
5. Clicking `Save` sends `PUT /api/posts/{id}` with only `title` and `content`
6. Successful save stays on `/posts/{id}`
7. Successful save exits edit mode and shows updated content immediately from the `PUT` response
8. No GET refetch happens after a successful save
9. Clicking `Cancel` exits edit mode with no API call
10. Save failure shows exactly `Failed to update post.`
11. Save failure keeps the form open with the user's typed values intact
12. There is still no edit button on the home page list
13. Existing delete behavior remains unchanged outside edit mode
