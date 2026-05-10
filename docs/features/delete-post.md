# Feature: Delete Post

**Status:** Merged ✅  
**Branches:** `feat/delete-post-api`, `feat/delete-post-ui`  
**Slices:** 2 (backend tests + frontend)

**Artifacts:**
- Design: [`.github/prompts/design-delete-post.prompt.md`](../../.github/prompts/design-delete-post.prompt.md)
- Plan: [`docs/features/delete-post-plan.md`](./delete-post-plan.md)
- Task (API): [`.github/prompts/task-delete-post-api.prompt.md`](../../.github/prompts/task-delete-post-api.prompt.md)
- Task (UI): [`.github/prompts/task-delete-post-ui.prompt.md`](../../.github/prompts/task-delete-post-ui.prompt.md)

---

## What It Does

Allows a user to delete a blog post from either the home page list or the post detail page, with a confirmation prompt before the deletion is committed.

---

## User Flow

### From the list (HomePage)
1. Each post in the list shows a **Delete** button.
2. Clicking Delete shows a browser confirm dialog: *"Delete this post?"*
3. Clicking **Cancel** — nothing happens, list unchanged.
4. Clicking **OK** — `DELETE /api/posts/{id}` is called. On success, the post disappears from the list immediately (optimistic removal, no refetch).
5. On failure — `"Failed to delete post."` appears on screen.

### From the detail page (PostDetailPage)
1. The post detail page shows a **Delete** button inside the article.
2. Same confirm dialog as above.
3. On success — navigates back to `/` (home page).
4. On failure — error message shown on the detail page.

---

## Files Changed

### Backend slice (`delete-post-api`)

| File | Change |
|---|---|
| `backend/tests/test_posts.py` | Added 4 new tests for `DELETE /api/posts/{id}` |

The endpoint itself (`routers/posts.py`) and service (`services/post_service.py`) were already implemented — no changes needed.

### Frontend slice (`delete-post-ui`)

| File | Change |
|---|---|
| `frontend/src/api/posts.ts` | Added `deletePost(id)` — issues DELETE, no `.json()` call (204 has no body) |
| `frontend/src/components/PostList.tsx` | Added `onDelete` prop; added Delete button with confirm guard per item |
| `frontend/src/pages/HomePage.tsx` | Added `handleDelete` handler; passes `onDelete` to `PostList` |
| `frontend/src/pages/PostDetailPage.tsx` | Added Delete button + `handleDelete` + `useNavigate` |

---

## API Used

```
DELETE /api/posts/{id}
→ 204 No Content  (empty body)
→ 404 { "detail": "Post not found" }
```

> ⚠️ The 204 response has no body. `deletePost()` must NOT call `res.json()`.

See [API Reference](../api-reference.md#delete-post).

---

## Test Coverage

| Test | Asserts |
|---|---|
| `test_delete_post_returns_204` | Valid delete → 204, empty body |
| `test_delete_post_not_found_returns_404` | Missing ID → 404 + error detail |
| `test_delete_post_removes_from_get` | After delete, GET by ID → 404 |
| `test_delete_post_not_in_list` | After delete, ID absent from GET list |
