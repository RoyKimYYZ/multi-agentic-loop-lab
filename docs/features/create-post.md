# Feature: Create Post

**Status:** Merged ✅  
**Branch:** `feat/create-post-form-ui`  
**Slices:** 1 (frontend)

---

## What It Does

Adds a form at the top of the home page that lets a user submit a new blog post without leaving the page.

---

## User Flow

1. Home page shows a form with three fields: Title, Content, Author.
2. User fills the form and clicks **Publish**.
3. The form calls `POST /api/posts/` with the entered data.
4. On success, the new post appears at the top of the list immediately (full refetch).
5. On failure, an error message is shown below the form.
6. The Submit button is disabled while the request is in flight.

---

## Files Changed

| File | Change |
|---|---|
| `frontend/src/api/posts.ts` | Added `createPost(data)` function |
| `frontend/src/components/PostForm.tsx` | New form component |
| `frontend/src/pages/HomePage.tsx` | Wired `PostForm` + `handleSubmit` + `loadPosts` |

---

## API Used

```
POST /api/posts/
Body: { "title": "string", "content": "string", "author": "string" }
→ 201 Post
```

See [API Reference](../api-reference.md#create-post).
