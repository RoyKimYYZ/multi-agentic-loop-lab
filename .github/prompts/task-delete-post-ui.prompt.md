# Task: delete-post-ui (Frontend)

**Design artifact:** [design-delete-post.prompt.md](./design-delete-post.prompt.md)

---

## Your Role

You are implementing the **frontend slice** for the delete-post feature.

You will add a Delete button to both `PostList` (home page) and `PostDetailPage`, wire them through the API client, and ensure the UI updates correctly after deletion.

---

## Implementation Steps (follow in order)

1. **`frontend/src/api/posts.ts`** — add `deletePost` export
2. **`frontend/src/components/PostList.tsx`** — add `onDelete` prop and Delete button per item
3. **`frontend/src/pages/HomePage.tsx`** — add `handleDelete`, pass to `PostList`
4. **`frontend/src/pages/PostDetailPage.tsx`** — add Delete button and `handleDelete`
5. Run `npm run build` from `frontend/` — fix any TypeScript errors
6. Run `npm run lint` from `frontend/` — fix any lint errors you introduced
7. Commit your changes

---

## Files You Own

**Modify only:**
- `frontend/src/api/posts.ts`
- `frontend/src/components/PostList.tsx`
- `frontend/src/pages/HomePage.tsx`
- `frontend/src/pages/PostDetailPage.tsx`

## Files Off-Limits (do NOT touch)

- `frontend/src/App.tsx`
- `frontend/src/components/PostForm.tsx`
- Everything under `backend/`

---

## API Contract

```
DELETE /api/posts/{post_id}
HTTP 204 No Content   (empty body on success)
HTTP 404 Not Found    { "detail": "Post not found" }
```

**Critical:** The 204 response has no body. Do NOT call `res.json()` in `deletePost`.

---

## Exact Implementation Specs

### `frontend/src/api/posts.ts`

Add this exported function (do not change existing functions):

```ts
export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete post");
  // No res.json() — 204 has no body
}
```

---

### `frontend/src/components/PostList.tsx`

Add `onDelete` to the Props interface:

```ts
interface Props {
  posts: Post[];
  onDelete: (id: number) => void;  // NEW
}
```

Add a Delete button inside each `<li>`. The component owns the `window.confirm` call:

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

---

### `frontend/src/pages/HomePage.tsx`

Add import:
```ts
import { deletePost } from '../api/posts'
```

Add handler alongside existing `handleSubmit`:
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

Update the `PostList` call:
```tsx
<PostList posts={posts} onDelete={handleDelete} />
```

Everything else in the return value is unchanged.

---

### `frontend/src/pages/PostDetailPage.tsx`

Update imports to include `deletePost` and `useNavigate`:
```ts
import { getPost, deletePost, type Post } from '../api/posts'
import { Link, useParams, useNavigate } from 'react-router-dom'
```

Add inside the component body:
```ts
const navigate = useNavigate();
```

Add handler:
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

Add Delete button inside the `{post && (...)}` block, after the `<time>` element:
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

## Acceptance Criteria (your slice is done when all pass)

1. Each post in `PostList` shows a visible Delete button
2. Clicking Delete in `PostList` triggers `window.confirm("Delete this post?")`
3. Cancel confirm → no API call, list unchanged
4. Confirm → `DELETE /api/posts/{id}` called; on 204, post removed from list immediately (no refetch)
5. `PostDetailPage` has a Delete button inside the `<article>`
6. Confirm on detail page → navigates to `/`
7. Any API failure → shows `"Failed to delete post."` on screen
8. `PostForm` create flow and post list navigation are unaffected
9. `deletePost` does NOT call `res.json()`

Run this to verify build + lint:
```bash
cd /home/rkadmin/multi-agentic-loop-lab-delete-post-ui/frontend
npm run build
npm run lint
```

---

## Worktree Path

```
/home/rkadmin/multi-agentic-loop-lab-delete-post-ui
```

Branch: `feat/delete-post-ui`
