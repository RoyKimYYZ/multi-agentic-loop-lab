# Design: Create Post Form

## Summary
Add a form above the post list on the home page so users can write and submit a new blog post without leaving the page.

---

## Diagrams

- [UI Wireframe](./diagrams/design-create-post-form-wireframe.svg)
- [Sequence Diagram](./diagrams/design-create-post-form-sequence.svg)

---

## API Contract

The backend is **unchanged**. This design only consumes the existing endpoint and existing API client function.

### Existing endpoint (reference only)
```
POST /api/posts/
Content-Type: application/json

Request body:
{
  "title":   string,   // required
  "content": string,   // required
  "author":  string    // required
}

Response 200:
{
  "id":         number,
  "title":      string,
  "content":    string,
  "author":     string,
  "created_at": string
}
```

### Existing API client function (reference only, do NOT modify)
```ts
// frontend/src/api/posts.ts
createPost(data: PostCreate): Promise<Post>
```
`PostCreate` is already exported from `frontend/src/api/posts.ts` as:
```ts
interface PostCreate { title: string; content: string; author: string; }
```

---

## UI

### Component: `PostForm`
**File:** `frontend/src/components/PostForm.tsx`

**Props interface:**
```ts
interface Props {
  onSubmit: (data: PostCreate) => void;
  disabled: boolean;
}
```

**Local state** (three controlled fields, all `string`, all initialised to `""`):
- `title`
- `content`
- `author`

**Rendering spec:**
- Render a `<form>` containing:
  - `<input type="text">` bound to `title` (placeholder `"Title"`)
  - `<textarea>` bound to `content` (placeholder `"Content"`)
  - `<input type="text">` bound to `author` (placeholder `"Author"`)
  - `<button type="submit">` with label `"Submit"`, disabled when `props.disabled === true`
- On form `onSubmit`:
  1. Call `event.preventDefault()`
  2. Call `props.onSubmit({ title, content, author })`
  3. Reset all three local state fields to `""` (clear the form)
- No inline field-level validation required.

---

### Page: `HomePage` (modified)
**File:** `frontend/src/pages/HomePage.tsx`

**Additional imports needed:**
- `createPost` and `PostCreate` from `../api/posts`
- `PostForm` from `../components/PostForm`

**Additional state** (beyond the existing `posts` state):
| state variable | type            | initial value |
|----------------|-----------------|---------------|
| `submitting`   | `boolean`       | `false`       |
| `error`        | `string \| null`| `null`        |

**`loadPosts` helper** — extract the existing fetch logic into a named function so it can be called both on mount and after a successful submit:
```
async function loadPosts() {
  listPosts().then(setPosts).catch(console.error)
}
```
Call `loadPosts()` inside `useEffect` (same behaviour as today).

**`handleSubmit` handler:**
```
async function handleSubmit(data: PostCreate) {
  setSubmitting(true)
  setError(null)
  try {
    await createPost(data)
    await loadPosts()          // refresh list
  } catch {
    setError("Failed to create post.")
  } finally {
    setSubmitting(false)
  }
}
```

**Rendering spec** (return value):
```
<div>
  <PostForm onSubmit={handleSubmit} disabled={submitting} />
  {error && <p>{error}</p>}
  <PostList posts={posts} />
</div>
```
- `PostForm` appears **above** `PostList`.
- The error `<p>` is only rendered when `error` is non-null.
- `PostList` is unchanged — still receives `posts` from state.

---

## Slices

### Slice 1: create-post-form-ui  _(single slice — all frontend, no backend work)_

- **Branch:** `feat/create-post-form-ui`
- **Worktree:** `../multi-agentic-loop-lab-create-post-form-ui/`

**Files owned (create or modify):**
- `frontend/src/components/PostForm.tsx` — **create new**
- `frontend/src/pages/HomePage.tsx` — **modify existing**

**Files off-limits (do NOT touch):**
- `frontend/src/api/posts.ts`
- `frontend/src/components/PostList.tsx`
- `frontend/src/App.tsx`
- Anything under `backend/`

**Acceptance criteria:**

1. `PostForm` renders three fields (`title`, `content`, `author`) and a `Submit` button.
2. The `Submit` button is disabled while `disabled={true}` is passed.
3. Submitting the form calls `props.onSubmit` with the current field values as a `PostCreate` object.
4. After `props.onSubmit` is called, all three fields are cleared to empty strings.
5. `HomePage` renders `<PostForm>` above `<PostList>`.
6. Submitting a valid post via the form calls `createPost` and then re-fetches the list with `listPosts`, causing the new post to appear in `<PostList>` without a page reload.
7. If `createPost` throws, `<p>Failed to create post.</p>` is rendered and the post list is unchanged.
8. The `Submit` button is disabled for the duration of the in-flight `createPost` request and re-enabled afterwards (whether success or failure).
9. No existing behaviour of `PostList` or `PostDetailPage` is altered.
