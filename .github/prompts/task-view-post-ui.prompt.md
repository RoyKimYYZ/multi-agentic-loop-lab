---
description: "Slice task: implement the view-post-ui slice for the view individual post feature"
agent: "agent"
---
# Slice Task: view-post-ui

## Design Artifact
Read this file first — it has the full technical design:
[design-view-post.prompt.md](./design-view-post.prompt.md)

## Your Branch
`feat/view-post-ui`

## Your Worktree
`../multi-agentic-loop-lab-view-post-ui/`

## Files You Own
Create or modify only these files:

- `frontend/package.json` — add `react-router-dom`
- `frontend/src/main.tsx` — wrap app in `<BrowserRouter>`
- `frontend/src/App.tsx` — convert to route shell
- `frontend/src/pages/HomePage.tsx` — new, extracted from current App.tsx
- `frontend/src/pages/PostDetailPage.tsx` — new, post detail page
- `frontend/src/components/PostList.tsx` — add `<Link>` to post titles

## Files That Are Off-Limits
Do NOT touch:

- `frontend/src/api/posts.ts` — already has `getPost`, no changes needed
- All files under `backend/`
- `.github/` agent and prompt files

## React Router — Teaching Note
This is the first time React Router is introduced in this project.
The goal is to show the *minimal* router setup clearly.

Key steps:
1. `npm install react-router-dom` in `frontend/`
2. Wrap `<App />` in `<BrowserRouter>` in `main.tsx` — one import, one wrapper
3. Replace `App.tsx` body with a `<Routes>` / `<Route>` shell — two routes only
4. Move the existing post-list fetch logic into `pages/HomePage.tsx`
5. Create `pages/PostDetailPage.tsx` — uses `useParams` to get `id`, calls `getPost`

## Acceptance Criteria
All of these must be true before you are done:

- [ ] Visiting `/` shows the post list; each title is a clickable link
- [ ] Clicking a title navigates to `/posts/{id}` — no full page reload
- [ ] `/posts/{id}` shows: title, full content, author, `created_at`
- [ ] `/posts/{id}` has a "← Back to posts" `<Link>` to `/`
- [ ] Visiting `/posts/9999` shows an error message (not a crash)
- [ ] `npm run build` passes with no TypeScript errors
- [ ] `npm run lint` passes

## How to Verify
```bash
cd frontend
npm install
npm run build
npm run lint
```

Then run the dev server and manually check:
```bash
npm run dev
```
