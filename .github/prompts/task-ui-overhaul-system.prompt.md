# Task: UI Overhaul — System Slice (Slice 1 of 2)

**Design artifact:** [design-ui-overhaul.prompt.md](./design-ui-overhaul.prompt.md)
**Implementation plan:** [docs/features/ui-overhaul-plan.md](../../docs/features/ui-overhaul-plan.md)
**Worktree:** `../multi-agentic-loop-lab-ui-overhaul-system`
**Branch:** `feat/ui-overhaul-system`

> ⚠️ **Read the full design artifact and plan before writing any code.** Every CSS value, every component prop, every class name is specified exactly. Do not invent or approximate.

---

## Your Mission

Lay the **complete design token foundation** for the 2026 UI overhaul and rebuild the application shell:
- Replace all CSS with a dark-mode token system (electric violet accent, Plus Jakarta Sans)
- Create a fixed TopNav with a modal "New Post" trigger
- Rebuild PostForm as a controlled modal overlay
- Lift posts/modal state from HomePage into App.tsx
- Leave PostList, PostDetailPage, EditPostForm completely untouched (Slice 2's job)

---

## Implementation Plan for This Slice

### Ordered Steps

1. **Rewrite `frontend/src/index.css`** (full rewrite):
   - Replace font imports with: `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap')`
   - Remove all Newsreader and Space Grotesk `@import` lines
   - Add all tokens to `:root` (see Design Token Table in design artifact — every single token, exact values)
   - Add global reset: `* { box-sizing: border-box; margin: 0; padding: 0; }`
   - Set `html`: `font-family: var(--font-sans); font-size: var(--font-size-base); font-weight: var(--font-weight-regular); color: var(--color-text); background-color: var(--color-bg); line-height: var(--line-height-base); font-synthesis: none; text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`
   - Set `body { margin: 0; min-height: 100vh; background-color: var(--color-bg); }`
   - Set `#root { min-height: 100vh; }` — remove old border/border-radius/width/margin/padding
   - Define all 5 keyframe animations: `card-reveal`, `backdrop-in`, `modal-in`, `article-in`, `slide-down` (exact keyframes in design artifact → Animation Spec section)

2. **Rewrite `frontend/src/App.css`** (full rewrite):
   - `.app { min-height: 100vh; display: flex; flex-direction: column; }`
   - `.main-content { flex: 1; padding-top: 60px; }`
   - `.nav` — `position: fixed; top: 0; left: 0; right: 0; z-index: 100; height: 60px; background: var(--color-nav-bg); backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6); border-bottom: 1px solid var(--color-border);`
   - `.nav-inner` — `display: flex; align-items: center; justify-content: space-between; height: 100%; max-width: 1200px; margin: 0 auto; padding: 0 var(--space-6);`
   - `.nav-logo` — `color: var(--color-accent); font-weight: var(--font-weight-bold); font-size: var(--font-size-base); letter-spacing: -0.01em; text-decoration: none; cursor: default;`
   - `.btn-primary` — `background: var(--color-accent-gradient); color: #fff; border: none; border-radius: var(--radius-pill); padding: var(--space-2) var(--space-5); font-family: var(--font-sans); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); cursor: pointer; transition: opacity var(--transition-base), transform var(--transition-fast), box-shadow var(--transition-base);` + hover: `opacity: 0.92; transform: translateY(-1px); box-shadow: var(--shadow-accent-focus)` + active: `transform: translateY(0); opacity: 1` + focus-visible: `outline: none; box-shadow: var(--shadow-accent-focus)` + disabled: `opacity: 0.5; cursor: not-allowed; transform: none`
   - `.btn-full { width: 100%; padding: var(--space-3) var(--space-4); font-size: var(--font-size-base); margin-top: var(--space-2); }`
   - `.btn-outline` — `background: none; border: 1.5px solid var(--color-border-strong); color: var(--color-text-soft); border-radius: var(--radius-pill); padding: var(--space-2) var(--space-5); font-family: var(--font-sans); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); cursor: pointer; transition: border-color var(--transition-base), color var(--transition-base), background var(--transition-base);` + hover/focus-visible: `border-color: var(--color-accent); color: var(--color-accent); background: var(--color-accent-dim)`
   - `.btn-ghost-destructive` — `background: none; border: 1.5px solid transparent; color: var(--color-text-muted); border-radius: var(--radius-pill); padding: var(--space-2) var(--space-5); font-family: var(--font-sans); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); cursor: pointer; transition: border-color var(--transition-base), color var(--transition-base), background var(--transition-base);` + hover/focus-visible: `border-color: var(--color-destructive); color: var(--color-destructive); background: var(--color-destructive-hover-bg)`
   - `.modal-backdrop` — `position: fixed; inset: 0; z-index: 200; background: var(--color-overlay); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: var(--space-4); animation: backdrop-in var(--transition-base) ease both;`
   - `.modal-dialog` — `background: var(--color-card); border: 1px solid var(--color-border-strong); border-radius: var(--radius-xl); box-shadow: var(--shadow-modal); width: 100%; max-width: 500px; padding: var(--space-8); animation: modal-in var(--transition-base) ease both; position: relative;`
   - `.modal-header` — `display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-6);`
   - `.modal-heading` — `font-size: var(--font-size-xl); font-weight: 700; color: var(--color-text); margin: 0;`
   - `.modal-close` — `background: var(--color-border); border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: var(--color-text-soft); font-size: 1rem; cursor: pointer; transition: background var(--transition-base), color var(--transition-base);` + hover: `background: var(--color-border-strong); color: var(--color-text)`
   - `.form-grid` — `display: grid; gap: var(--space-5);`
   - `.field-group` — `display: flex; flex-direction: column; gap: var(--space-2);`
   - `label` scoped to form — `font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-soft); letter-spacing: 0.04em; text-transform: uppercase;`
   - `.field-group input, .field-group textarea` — `width: 100%; box-sizing: border-box; background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-3) var(--space-4); font-family: var(--font-sans); font-size: var(--font-size-base); color: var(--color-text); outline: none; transition: border-color var(--transition-base), box-shadow var(--transition-base);` + `::placeholder { color: var(--color-text-muted) }` + focus: `border-color: var(--color-accent); box-shadow: var(--shadow-input-focus)`
   - `.field-group textarea` — `resize: vertical; min-height: 120px; line-height: var(--line-height-base);`
   - `.status-banner` — `border-radius: var(--radius-md); padding: var(--space-3) var(--space-4); margin-bottom: var(--space-6); font-size: var(--font-size-sm);`
   - `.status-error` — `background: var(--color-error-bg); color: var(--color-error-text);`
   - Responsive: `@media (max-width: 640px) { .nav-inner { padding: 0 var(--space-4); } }`

3. **Create `frontend/src/components/TopNav.tsx`** (NEW FILE):
   ```tsx
   import { Link } from 'react-router-dom'
   
   interface Props {
     onNewPost: () => void
   }
   
   export default function TopNav({ onNewPost }: Props) {
     return (
       <nav className="nav">
         <div className="nav-inner">
           <Link to="/" className="nav-logo">◈ Blog</Link>
           <button className="btn-primary" onClick={onNewPost}>+ New Post</button>
         </div>
       </nav>
     )
   }
   ```

4. **Rewrite `frontend/src/components/PostForm.tsx`** as a modal:
   - New props: `{ isOpen: boolean; onClose: () => void; onSubmit: (data: PostCreate) => void; disabled: boolean }`
   - Return `null` when `!isOpen`
   - `useEffect` for Escape key: `document.addEventListener('keydown', handler)` where handler checks `e.key === 'Escape'` and calls `onClose`; cleanup on return
   - Backdrop: `<div className="modal-backdrop" onClick={onClose}>` — stopPropagation on the dialog
   - Dialog: `<div className="modal-dialog" onClick={e => e.stopPropagation()}>` with header (h2.modal-heading "New Post" + button.modal-close "✕" onClick=onClose) + `<form className="form-grid" onSubmit={handleSubmit}>` with three `.field-group` divs (Title, Author, Content) + `<button type="submit" disabled={disabled} className="btn-primary btn-full">Publish Post</button>`
   - After calling `props.onSubmit({ title, content, author })`, reset title/content/author to `''`
   - Import `PostCreate` from `../api/posts`

5. **Rewrite `frontend/src/App.tsx`**:
   - State: `posts`, `submitting`, `createError`, `isModalOpen`
   - `useEffect` to `listPosts().then(setPosts)` on mount
   - `handleSubmit(data: PostCreate)`: `setSubmitting(true)` → `createPost(data)` → add to posts → `setIsModalOpen(false)` → `setSubmitting(false)`; on error: `setCreateError(msg)`, `setSubmitting(false)`
   - `handleDelete(id: number)`: `deletePost(id)` → filter posts
   - Render structure:
     ```tsx
     <div className="app">
       <TopNav onNewPost={() => setIsModalOpen(true)} />
       <PostForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} disabled={submitting} />
       <main className="main-content">
         <Routes>
           <Route path="/" element={<HomePage posts={posts} onDelete={handleDelete} />} />
           <Route path="/posts/:id" element={<PostDetailPage />} />
         </Routes>
       </main>
     </div>
     ```
   - Import `TopNav`, `PostForm`, `HomePage`, `PostDetailPage`

6. **Update `frontend/src/pages/HomePage.tsx`**:
   - Remove: all local state, `handleSubmit`, `handleDelete`, `PostForm` import
   - New props: `{ posts: Post[], onDelete: (id: number) => void }`
   - Render:
     ```tsx
     <div className="home-page">
       <div className="page-header">
         <h1 className="page-title">Latest Posts</h1>
         <p className="page-subtitle">A collection of ideas, tutorials, and thoughts.</p>
       </div>
       <PostList posts={posts} onDelete={onDelete} />
     </div>
     ```
   - Do NOT add CSS for `.home-page`, `.page-header`, `.page-title`, `.page-subtitle` — Slice 2 owns those

7. Run `npm run build` — fix any TypeScript or import errors
8. Run `npm run lint` — fix any lint warnings
9. Run `npm test` — existing tests must still pass (update `HomePage.test.tsx` if the props contract changed)
10. Commit only owned files

---

## Files Owned

- `frontend/src/index.css`
- `frontend/src/App.css`
- `frontend/src/App.tsx`
- `frontend/src/components/TopNav.tsx` (new)
- `frontend/src/components/PostForm.tsx`
- `frontend/src/pages/HomePage.tsx`

## Files Off-Limits

- `frontend/src/components/PostList.tsx`
- `frontend/src/components/EditPostForm.tsx`
- `frontend/src/pages/PostDetailPage.tsx`
- `frontend/src/api/posts.ts`
- `frontend/src/pages/PostDetailPage.test.tsx`
- `frontend/src/pages/HomePage.test.tsx` *(update only if breaking change in props — minimal touch)*

---

## Acceptance Criteria

1. `:root` in `index.css` contains every token from the design token table; no hardcoded hex colors in `App.css`
2. `Plus Jakarta Sans` imported; `body` uses `var(--font-sans)`; Newsreader and Space Grotesk removed
3. `body` and `#root` render against `#0d0f14` — warm parchment gradients gone
4. Fixed TopNav bar visible at top of every page; does not scroll away; contains `◈ Blog` (left) and `+ New Post` (right)
5. Clicking `+ New Post` opens the modal overlay (backdrop + dialog visible)
6. Backdrop has `backdrop-filter: blur(6px)` applied
7. Clicking `×` inside dialog closes the modal
8. Clicking outside dialog (on backdrop) closes the modal
9. Pressing `Escape` while modal is open closes it
10. Filling all three fields and submitting calls create API; new post appears, modal closes, fields reset
11. While `disabled={true}`, submit button has `opacity: 0.5` and `cursor: not-allowed`
12. Opening modal triggers `backdrop-in` and `modal-in` animations
13. `HomePage` no longer manages `posts` state; receives `posts` and `onDelete` as props from `App.tsx`
14. On viewports ≤ 640px, nav inner padding reduces to `var(--space-4)`
15. `/` and `/posts/:id` routes still navigate correctly

---

## Gates Before Reporting Done

```bash
cd /home/rkadmin/multi-agentic-loop-lab-ui-overhaul-system/frontend
npm run build    # must succeed, zero errors
npm run lint     # must pass
npm test         # all existing tests must pass
```

Report back to the Orchestrator with the test output when all three pass.
