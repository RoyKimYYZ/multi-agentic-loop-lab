# Design: Delete Post

## Summary
Allow users to delete a blog post from either the post list on the home page or the post detail page, with a browser confirmation prompt before the deletion is committed.

---

## Diagrams

- [UI Wireframe](./diagrams/design-delete-post-wireframe.svg)
- [Sequence Diagram](./diagrams/design-delete-post-sequence.svg)

---

## Data Model

**No changes required.** The `Post` model (id, title, content, author, created_at) is already fully sufficient for deletion — the endpoint only needs the post's `id`. The in-memory store (`_db: dict[int, Post]`) already supports deletion via `del _db[post_id]`.

### Confirmation

The backend service (`post_service.delete_post`) and the router endpoint (`DELETE /{post_id}`) are **already implemented** in the codebase. The backend slice's sole job is to write test coverage for this existing endpoint.

---

## API Contract

This is the shared contract between both slices. The backend already implements it; the frontend must consume it exactly as specified here.

```
DELETE /api/posts/{post_id}

Path parameter:
  post_id   integer   The ID of the post to delete

Request body: none

Success response:
  HTTP 204 No Content
  (empty body)

Error responses:
  HTTP 404 Not Found
  { "detail": "Post not found" }
```

**Frontend note:** Because the success response is 204 (no body), the API client function must NOT call `res.json()`. It should resolve `void` on success.

---

## Business Logic

### Backend (already implemented — write tests only)

**File:** `backend/app/services/post_service.py`
```python
def delete_post(post_id: int) -> bool:
    # Returns True if deleted, False if not found
    if post_id not in _db:
        return False
    del _db[post_id]
    return True
```

**File:** `backend/app/routers/posts.py`
```python
@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: int):
    if not post_service.delete_post(post_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
```

Both functions exist and are correct. No modifications needed.

### Frontend (new)

**File:** `frontend/src/api/posts.ts` — add one exported function:
```ts
export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete post");
  // No res.json() — 204 has no body
}
```

**File:** `frontend/src/pages/HomePage.tsx` — add handler:
```ts
async function handleDelete(id: number) {
  try {
    await deletePost(id);
    setPosts(posts.filter(p => p.id !== id));  // optimistic removal
  } catch {
    setError("Failed to delete post.");
  }
}
```
Pass handler to PostList: `<PostList posts={posts} onDelete={handleDelete} />`

**File:** `frontend/src/pages/PostDetailPage.tsx` — add handler:
```ts
const navigate = useNavigate();

async function handleDelete() {
  if (!window.confirm("Delete this post?")) return;
  try {
    await deletePost(Number(id));
    navigate("/");
  } catch {
    setError("Failed to delete post.");
  }
}
```

---

## UI

### UX Decisions (concrete, implementers must follow exactly)

| Decision | Choice | Rationale |
|---|---|---|
| Delete button placement | In each `PostList` item AND on `PostDetailPage` | Users can delete from wherever they are |
| Confirmation | `window.confirm("Delete this post?")` before API call | Prevents accidental deletion; native dialog needs no new component |
| After delete (list view) | Remove post from state immediately (optimistic) — no refetch | Simpler and faster; matches the list-filter pattern |
| After delete (detail view) | Navigate to `/` using `useNavigate` | The post no longer exists; detail page would 404 |
| On delete failure | Show `"Failed to delete post."` in existing `error` state | Consistent with create-post error pattern in `HomePage` |

---

### Component: `PostList` (modified)

**File:** `frontend/src/components/PostList.tsx`

**Props interface** (add `onDelete` to existing `posts` prop):
```ts
interface Props {
  posts: Post[];
  onDelete: (id: number) => void;  // NEW
}
```

**Change:** Add a Delete button inside each `<li>`. The component owns the `window.confirm` call so `HomePage` stays clean.

**Rendering spec for each list item:**
```tsx
<li key={post.id}>
  <h2><Link to={`/posts/${post.id}`}>{post.title}</Link></h2>
  <p>{post.content}</p>
  <small>by {post.author}</small>
  <button
    onClick={() => {
      if (window.confirm("Delete this post?")) {
        onDelete(post.id);
      }
    }}
  >
    Delete
  </button>
</li>
```

The `<Link>` and existing markup are unchanged. The `<button>` is appended inside the `<li>`.

---

### Page: `HomePage` (modified)

**File:** `frontend/src/pages/HomePage.tsx`

**Additional import:**
```ts
import { deletePost } from '../api/posts'
```

**New state:** none — reuse existing `error` state for delete errors.

**New handler** (add alongside existing `handleSubmit`):
```ts
async function handleDelete(id: number) {
  try {
    await deletePost(id);
    setPosts(posts.filter(p => p.id !== id));
  } catch {
    setError("Failed to delete post.");
  }
}
```

**Rendering spec** — change only the `PostList` call:
```tsx
<PostList posts={posts} onDelete={handleDelete} />
```
Everything else in the return value is unchanged.

---

### Page: `PostDetailPage` (modified)

**File:** `frontend/src/pages/PostDetailPage.tsx`

**Additional imports:**
```ts
import { getPost, deletePost, type Post } from '../api/posts'
import { Link, useParams, useNavigate } from 'react-router-dom'
```

**Additional hook** (add inside the component):
```ts
const navigate = useNavigate();
```

**New handler** (add inside the component):
```ts
async function handleDelete() {
  if (!window.confirm("Delete this post?")) return;
  try {
    await deletePost(Number(id));
    navigate("/");
  } catch {
    setError("Failed to delete post.");
  }
}
```

**Rendering spec** — add a Delete button inside the `{post && (...)}` block, after the existing `<time>` element:
```tsx
{post && (
  <article>
    <h2>{post.title}</h2>
    <p>{post.content}</p>
    <small>by {post.author}</small>
    <time>{post.created_at}</time>
    <button onClick={handleDelete}>Delete</button>
  </article>
)}
```

---

## Slices

### Slice 1: delete-post-api (backend)
- **Branch:** `feat/delete-post-api`
- **Worktree:** `../parallel-agent-delete-post-api/`

**Files owned (modify only):**
- `backend/tests/test_posts.py` — add four new test cases for the delete endpoint

**Files off-limits (do NOT touch):**
- `backend/app/routers/posts.py` — already implemented; do not modify unless a bug is found
- `backend/app/services/post_service.py` — already implemented; do not modify
- `backend/app/models/post.py`
- `backend/app/schemas/post.py`
- Everything under `frontend/`

**Acceptance criteria:**

1. `DELETE /api/posts/{id}` with a valid existing post ID returns HTTP **204** with an empty body.
2. `DELETE /api/posts/{id}` with a non-existent ID returns HTTP **404** with body `{"detail": "Post not found"}`.
3. After a successful `DELETE /api/posts/{id}`, a subsequent `GET /api/posts/{id}` returns HTTP **404**.
4. After a successful `DELETE /api/posts/{id}`, the deleted post does **not** appear in the response from `GET /api/posts/`.
5. All existing tests (`test_health`, `test_list_posts`, `test_create_and_get_post`) continue to pass.

---

### Slice 2: delete-post-ui (frontend)
- **Branch:** `feat/delete-post-ui`
- **Worktree:** `../parallel-agent-delete-post-ui/`

**Files owned (create or modify):**
- `frontend/src/api/posts.ts` — add `deletePost` export
- `frontend/src/components/PostList.tsx` — add `onDelete` prop and Delete button
- `frontend/src/pages/HomePage.tsx` — add `handleDelete`, pass it to `PostList`
- `frontend/src/pages/PostDetailPage.tsx` — add Delete button and `handleDelete`

**Files off-limits (do NOT touch):**
- `frontend/src/App.tsx`
- `frontend/src/components/PostForm.tsx`
- Everything under `backend/`

**Acceptance criteria:**

1. Each post item rendered by `PostList` contains a visible Delete button.
2. Clicking the Delete button in `PostList` displays a `window.confirm("Delete this post?")` dialog.
3. If the user cancels the confirm dialog, no API call is made and the list is unchanged.
4. If the user confirms, `DELETE /api/posts/{id}` is called; on HTTP 204, the post is removed from the list immediately without a full refetch.
5. `PostDetailPage` renders a Delete button inside the post `<article>`.
6. Clicking Delete on `PostDetailPage` shows the same confirm dialog; on success, the page navigates to `/`.
7. If the `deletePost` API call throws (e.g., network error or 404), the message `"Failed to delete post."` is displayed on screen.
8. The `PostForm` create-post flow, existing post list rendering, and navigation to detail pages are entirely unaffected.
9. `deletePost` in `posts.ts` does not call `res.json()` (the 204 response has no body).
