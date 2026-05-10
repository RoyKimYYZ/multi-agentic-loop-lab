# Feature: View Post

**Status:** Merged ✅  
**Branch:** `feat/view-post-ui`  
**Slices:** 1 (frontend)

**Artifacts:**
- Design: [`.github/prompts/design-view-post.prompt.md`](../../.github/prompts/design-view-post.prompt.md)
- Task: [`.github/prompts/task-view-post-ui.prompt.md`](../../.github/prompts/task-view-post-ui.prompt.md)

---

## What It Does

Allows a user to click a post title on the home page and navigate to a dedicated detail page showing the full post content.

---

## User Flow

1. Home page shows a list of posts. Each post title is a clickable link.
2. Clicking a title navigates to `/posts/{id}`.
3. The detail page fetches the post from the API and displays: title, content, author, created date.
4. A "Back to posts" link returns the user to the home page.
5. If the post ID does not exist, the page shows an error message.

---

## Files Changed

| File | Change |
|---|---|
| `frontend/src/api/posts.ts` | Added `getPost(id)` function |
| `frontend/src/pages/PostDetailPage.tsx` | New page component |
| `frontend/src/App.tsx` | Added `/posts/:id` route |

---

## API Used

```
GET /api/posts/{id}
→ 200 Post  |  404 { "detail": "Post not found" }
```

See [API Reference](../api-reference.md#get-post).
