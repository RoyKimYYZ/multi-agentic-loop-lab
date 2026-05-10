# Feature: Edit Post

**Status:** Merged ✅
**Branch(es):** `feat/edit-post-api`, `feat/edit-post-ui`
**Slices:** 2 (1 backend tests, 1 frontend UI)

**Artifacts:**
- Design: [`.github/prompts/design-edit-post.prompt.md`](../../.github/prompts/design-edit-post.prompt.md)
- Plan: [`docs/features/edit-post-plan.md`](./edit-post-plan.md)
- Task (api): [`.github/prompts/task-edit-post-api.prompt.md`](../../.github/prompts/task-edit-post-api.prompt.md)
- Task (ui): [`.github/prompts/task-edit-post-ui.prompt.md`](../../.github/prompts/task-edit-post-ui.prompt.md)

---

## What It Does

Users can edit a post's title and content directly on the post detail page. The page switches to an inline edit form — no navigation to a separate route. After saving, the updated post is shown immediately without a page refresh.

## User Flow

1. Navigate to a post's detail page (click a post title on the home page)
2. Click the **Edit** button
3. The page switches to an inline edit form showing the current title and content (prefilled)
4. Author and date are shown as read-only text (not editable)
5. The **Delete** button is hidden while in edit mode
6. Edit the title and/or content
7. Click **Save** — the `PUT /api/posts/{id}` endpoint is called
8. On success: edit mode exits, updated post content is shown immediately (from the PUT response — no refetch)
9. On failure: error message `Failed to update post.` is shown; the form stays open with the user's typed values
10. Click **Cancel** at any time to exit edit mode with no API call

## Files Changed

| File | Change |
|---|---|
| `backend/tests/test_posts.py` | Added 3 tests for `PUT /api/posts/{id}`: full update, partial update, missing post |
| `frontend/src/api/posts.ts` | Added `PostUpdate` type and `updatePost(id, data)` function |
| `frontend/src/components/EditPostForm.tsx` | New component — inline edit form with controlled title/content fields, Save/Cancel |
| `frontend/src/pages/PostDetailPage.tsx` | Added `isEditing`/`saving` state, Edit button, inline form toggle, save/cancel handlers |
| `frontend/src/pages/PostDetailPage.test.tsx` | 7 Vitest/RTL tests covering all edit-mode flows |
| `frontend/src/pages/HomePage.test.tsx` | 1 test asserting no Edit button appears in the post list |
| `frontend/package.json` | Added `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `npm test` script |
| `frontend/vite.config.ts` | Added `test` block for Vitest/jsdom |

## API Used

`PUT /api/posts/{id}` — see [API Reference](../api-reference.md#update-post)

Request body (both fields optional):
```json
{ "title": "string", "content": "string" }
```

Response `200 OK`: updated Post object. Response `404`: `{"detail": "Post not found"}`.

## Test Coverage

### Backend (pytest)

| Test | Asserts |
|---|---|
| `test_update_post_full` | Full update returns 200, title and content are updated |
| `test_update_post_partial` | Partial update with one field preserves untouched fields |
| `test_update_post_not_found` | `PUT /api/posts/99999` returns 404 |

### Frontend (Vitest/RTL)

| Test | Asserts |
|---|---|
| `renders loading state` | Loading text shown before fetch resolves |
| `renders error if fetch fails` | Error message shown on network failure |
| `renders Edit button when loaded` | Edit button appears on loaded post |
| `enters edit mode on Edit click` | Form fields shown with prefilled values; Delete hidden |
| `cancel exits edit mode` | Cancel returns to read view without API call |
| `save calls updatePost and exits edit mode` | PUT called, updated content shown immediately |
| `shows error on save failure` | Error message shown; form stays open |
| `no Edit button on home page list` | Edit button not present in PostList |
