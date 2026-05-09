---
description: "Slice task: implement the create-post-form-ui slice for the create post form feature"
agent: "agent"
---
# Slice Task: create-post-form-ui

## Design Artifact
Read this file first — it has the full technical design:
[design-create-post-form.prompt.md](./design-create-post-form.prompt.md)

## Your Branch
`feat/create-post-form-ui`

## Your Worktree
`../parallel-agent-create-post-form-ui/`

## Files You Own
Create or modify only these files:

- `frontend/src/components/PostForm.tsx` — new controlled form component
- `frontend/src/pages/HomePage.tsx` — wire in the form and submission logic

## Files That Are Off-Limits
Do NOT touch:

- `frontend/src/api/posts.ts` — `createPost` and `PostCreate` already exist, no changes needed
- `frontend/src/components/PostList.tsx` — owned by a different slice
- `frontend/src/App.tsx` — routing is already set up, no changes needed
- All files under `backend/`
- `.github/` agent and prompt files

## Implementation Plan

Work in this order:

### 1. Read existing patterns first
Before writing anything, read:
- `frontend/src/components/PostList.tsx` — match the named export style and props pattern
- `frontend/src/pages/HomePage.tsx` — understand the current useState/useEffect shape before modifying it
- `frontend/src/api/posts.ts` — confirm `createPost` and `PostCreate` are already exported

### 2. Create `PostForm.tsx`
- Named export: `export function PostForm({ onSubmit, disabled }: Props)`
- Props interface: `{ onSubmit: (data: PostCreate) => void; disabled: boolean }`
- Three controlled string fields: `title`, `content`, `author` — all initialised to `""`
- Render: `<form>` with `<input>` for title, `<textarea>` for content, `<input>` for author, `<button type="submit">` disabled when `props.disabled === true`
- On submit: `event.preventDefault()`, call `props.onSubmit({ title, content, author })`, reset all three fields to `""`
- Import `PostCreate` from `"../api/posts"`

### 3. Modify `HomePage.tsx`
- Extract the existing `listPosts().then(setPosts)` call into a named `loadPosts` async function (call it in `useEffect` as before)
- Add two new state variables: `submitting: boolean` (false) and `error: string | null` (null)
- Add a `handleSubmit` async function:
  1. `setSubmitting(true)`, `setError(null)`
  2. `await createPost(data)`
  3. `await loadPosts()` to refresh the list
  4. On catch: `setError("Failed to create post.")`
  5. In finally: `setSubmitting(false)`
- Update the return value to:
  ```tsx
  <div>
    <PostForm onSubmit={handleSubmit} disabled={submitting} />
    {error && <p>{error}</p>}
    <PostList posts={posts} />
  </div>
  ```

### 4. Verify
```bash
cd frontend
npm run lint
npm run build
```
Fix all TypeScript errors and lint warnings before declaring done.

## Acceptance Criteria
All of these must be true before you are done:

- [ ] `PostForm` renders fields for `title`, `content`, and `author` and a `Submit` button
- [ ] `Submit` button is disabled while `disabled={true}` is passed as a prop
- [ ] Submitting the form calls `props.onSubmit` with `{ title, content, author }`
- [ ] After calling `props.onSubmit`, all three fields clear to empty strings
- [ ] `HomePage` renders `<PostForm>` above `<PostList>`
- [ ] A successful form submission calls `createPost` then re-fetches the post list — the new post appears without a page reload
- [ ] If `createPost` throws, `<p>Failed to create post.</p>` is rendered
- [ ] The `Submit` button is disabled for the duration of the request and re-enabled afterwards
- [ ] No behaviour of `PostList` or `PostDetailPage` is changed
- [ ] `npm run build` passes with no TypeScript errors
- [ ] `npm run lint` passes

## How to Verify
```bash
cd frontend
npm install
npm run build
npm run lint
```

Then run the dev server and check manually:
```bash
npm run dev
```
- Fill in the form on the home page and submit → the new post should appear in the list immediately
- While submitting, the Submit button should be disabled
- With the backend stopped, submit → `Failed to create post.` should appear
