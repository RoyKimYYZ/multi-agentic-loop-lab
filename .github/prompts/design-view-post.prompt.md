# Design: View Individual Post

## Summary
Clicking a post title in the list navigates to `/posts/{id}`, a detail page that fetches and displays the post's title, full content, author, and creation date.

---

## React Router Setup

React Router is not yet installed. The minimal setup is:

1. **Install** `react-router-dom` as a runtime dependency in `frontend/package.json`.

2. **`main.tsx`** — wrap `<App />` with `<BrowserRouter>`:
   ```
   import { BrowserRouter } from 'react-router-dom'
   ...
   <StrictMode>
     <BrowserRouter>
       <App />
     </BrowserRouter>
   </StrictMode>
   ```

3. **`App.tsx`** — convert to a route shell using `<Routes>` and `<Route>`. Move the current post-fetching logic into a new `HomePage`. App becomes:
   ```
   import { Routes, Route } from 'react-router-dom'
   import { HomePage } from './pages/HomePage'
   import { PostDetailPage } from './pages/PostDetailPage'

   function App() {
     return (
       <>
         <header><h1>Blog</h1></header>
         <main>
           <Routes>
             <Route path="/" element={<HomePage />} />
             <Route path="/posts/:id" element={<PostDetailPage />} />
           </Routes>
         </main>
       </>
     )
   }
   ```

Two routes only. No nested layouts, no lazy loading, no route guards.

---

## API Changes

`getPost(id: number): Promise<Post>` already exists in `src/api/posts.ts` and works correctly against `GET /api/posts/{id}`. **No changes needed.**

`listPosts()` and the `Post` interface are also unchanged.

---

## Components

### `src/pages/HomePage.tsx` (new)
Extracted directly from current `App.tsx`. Contains the `useEffect` + `useState` for fetching all posts, renders `<PostList posts={posts} />`.

Props: none.

### `src/pages/PostDetailPage.tsx` (new)
Reads `id` from the URL using `useParams`. Fetches the single post with `getPost`. Renders the full post.

Props: none.

State:
- `post: Post | null` — the fetched post
- `error: string | null` — simple error message if fetch fails

Renders:
- While loading: `<p>Loading...</p>`
- On error: `<p>{error}</p>`
- On success:
  ```
  <article>
    <h2>{post.title}</h2>
    <p>{post.content}</p>
    <small>by {post.author}</small>
    <time>{post.created_at}</time>
  </article>
  ```
- A `<Link to="/">← Back to posts</Link>` at the top.

### `src/components/PostList.tsx` (modified)
Minimal change: wrap each post's `<h2>` title in a `<Link to={/posts/${post.id}}>`:
```
import { Link } from 'react-router-dom'
...
<h2><Link to={`/posts/${post.id}`}>{post.title}</Link></h2>
```
The rest of the component is unchanged.

---

## Files Changed / Created

| File | Status |
|---|---|
| `frontend/package.json` | Modified — add `react-router-dom` dependency |
| `frontend/src/main.tsx` | Modified — wrap app in `<BrowserRouter>` |
| `frontend/src/App.tsx` | Modified — convert to route shell |
| `frontend/src/pages/HomePage.tsx` | New — extracted from current `App.tsx` |
| `frontend/src/pages/PostDetailPage.tsx` | New — post detail page |
| `frontend/src/components/PostList.tsx` | Modified — add `<Link>` to titles |

No backend files change.

---

## Slices

This feature is small, entirely frontend, and has no parallel work — one slice is correct.

### Slice 1: view-post-ui

- **Branch:** `feat/view-post-ui`
- **Owns:**
  - `frontend/package.json`
  - `frontend/src/main.tsx`
  - `frontend/src/App.tsx`
  - `frontend/src/pages/HomePage.tsx`
  - `frontend/src/pages/PostDetailPage.tsx`
  - `frontend/src/components/PostList.tsx`
- **Off-limits:**
  - All backend files
  - `frontend/src/api/posts.ts` (already has `getPost` — do not modify)
- **Acceptance criteria:**
  - Visiting `/` shows the post list with clickable titles
  - Clicking a post title navigates to `/posts/{id}` without a full page reload
  - `/posts/{id}` displays the post's title, full content, author, and `created_at`
  - `/posts/{id}` has a "← Back to posts" link that returns to `/`
  - Visiting `/posts/9999` (nonexistent id) shows an error message, not a crash
  - `npm run build` completes without TypeScript errors
