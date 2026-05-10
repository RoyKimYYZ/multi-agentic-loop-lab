# Implementation Plan: Full UI Overhaul — 2026 Aesthetic

**Status:** In Progress
**Design artifact:** [design-ui-overhaul.prompt.md](../../.github/prompts/design-ui-overhaul.prompt.md)

---

## Slices

| # | Slice | Branch | Depends on |
|---|---|---|---|
| 1 | ui-overhaul-system | `feat/ui-overhaul-system` | — |
| 2 | ui-overhaul-components | `feat/ui-overhaul-components` | Slice 1 merged |

> ⚠️ **Sequencing:** Slice 2 must NOT begin until Slice 1 is merged to `main`. Slice 2 reads CSS tokens from `index.css` and global utility classes from `App.css` that Slice 1 writes. There is no way to run them in true parallel.

---

## Technical Decisions (fixed — Implementers must NOT deviate)

- Dark mode only — canvas is `#0d0f14`, no light mode toggle
- Single accent: electric violet `#8b5cf6` / `#7c3aed`
- Font: **Plus Jakarta Sans** only — remove Newsreader and Space Grotesk imports entirely
- All colors, radii, shadows, spacing, fonts reference CSS custom properties from `:root` — no hardcoded hex values in component CSS
- PostForm becomes a **controlled modal** — `isOpen`/`onClose`/`onSubmit`/`disabled` props; renders `null` when closed
- `posts`, `submitting`, `createError`, `isModalOpen` state all live in **`App.tsx`** (lifted from `HomePage`)
- `HomePage` becomes a pure props receiver: `{ posts: Post[], onDelete: (id: number) => void }`
- No CSS Modules, no Tailwind, no styled-components — plain class names matching existing project pattern
- `window.confirm()` for delete — no custom modal
- No toast/snackbar library
- No router changes — `/` and `/posts/:id` routes unchanged
- `api/posts.ts` is untouched by both slices

## Off-Limits for Implementers

- Do not add authentication, dark mode toggle, or theme switcher
- Do not install any new npm packages (Plus Jakarta Sans loads via Google Fonts CDN in CSS)
- Do not change `frontend/src/api/posts.ts`
- Do not add a separate `/new` route for post creation — modal only
- Do not modify test files (the existing Vitest tests must still pass after each slice)
- Slice 1: do not touch `PostList.tsx`, `EditPostForm.tsx`, `PostDetailPage.tsx`
- Slice 2: do not touch `index.css`, `App.tsx`, `TopNav.tsx`, `PostForm.tsx`, `HomePage.tsx`

---

## Slice Plans

### Slice 1: ui-overhaul-system

**Purpose:** Lay the design token foundation, rebuild App.tsx with topnav + modal architecture, ship PostForm as a modal. After this slice, the app is functional with the new dark theme even before card styling lands.

**Ordered steps:**
1. Rewrite `frontend/src/index.css`:
   - Replace font imports with `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap')`
   - Remove Newsreader and Space Grotesk `@import` lines
   - Add all 21 color tokens, 5 radius tokens, 6 shadow tokens, 15 font tokens, 10 spacing tokens, 3 transition tokens to `:root` (exact values from design token table)
   - Add global reset: `* { box-sizing: border-box; margin: 0; padding: 0; }`
   - Set `html` to use `var(--font-sans)`, `var(--font-size-base)`, `var(--color-text)`, `var(--color-bg)`, `antialiased`
   - Set `body { margin: 0; min-height: 100vh; background-color: var(--color-bg); }`
   - Set `#root { min-height: 100vh; }` — remove old border/border-radius/width/margin-auto
   - Define all 5 keyframe animations: `card-reveal`, `backdrop-in`, `modal-in`, `article-in`, `slide-down`
2. Rewrite `frontend/src/App.css`:
   - Add `.app { min-height: 100vh; display: flex; flex-direction: column; }`
   - Add `.main-content { flex: 1; padding-top: 60px; }`
   - Add `.nav` (position fixed, height 60px, bg `var(--color-nav-bg)`, blur, border-bottom)
   - Add `.nav-inner` (flex, space-between, 60px height, max-width 1200px, centered)
   - Add `.nav-logo` styles (accent color, bold, no underline)
   - Add `.btn-primary` — gradient bg, pill border-radius, white text, hover/active/focus-visible states
   - Add `.btn-outline` — transparent bg, border `var(--color-border-strong)`, hover accent states
   - Add `.btn-ghost-destructive` — transparent bg, hover red states
   - Add `.modal-backdrop` (fixed, inset 0, z-index 200, overlay bg, blur, flex center, `backdrop-in` animation)
   - Add `.modal-dialog` (card bg, border, radius-xl, shadow-modal, max-width 500px, `modal-in` animation)
   - Add `.modal-heading`, `.modal-close` styles
   - Add `.field-group` (flex column, gap space-2)
   - Add shared input/textarea styles (dark bg, border, radius-md, focus ring, placeholder muted)
   - Add `.status-banner`, `.status-error`, `.status-success` styles
   - Add responsive breakpoints for nav at ≤640px
3. Create `frontend/src/components/TopNav.tsx` (NEW FILE):
   - Props: `{ onNewPost: () => void }`
   - Renders: `<nav className="nav"><div className="nav-inner"><Link to="/" className="nav-logo">◈ Blog</Link><button className="btn-primary" onClick={onNewPost}>+ New Post</button></div></nav>`
   - Import `Link` from `react-router-dom`
4. Rewrite `frontend/src/components/PostForm.tsx`:
   - New props: `{ isOpen: boolean; onClose: () => void; onSubmit: (data: PostCreate) => void; disabled: boolean }`
   - When `!isOpen`, return `null`
   - Add `useEffect` Escape key listener (calls `onClose` on Escape; clean up on unmount/`isOpen` change)
   - Render: `.modal-backdrop` (onClick → onClose) → `.modal-dialog` (onClick → stopPropagation) → header (h2 + ✕ button) → form (Title, Author, Content fields) → `.btn-primary.btn-full` submit button
   - After `onSubmit({ title, content, author })`, reset all three fields to `''`
   - Import `PostCreate` type from `../api/posts`
5. Rewrite `frontend/src/App.tsx`:
   - Lift state: `const [posts, setPosts] = useState<Post[]>([])`; `const [submitting, setSubmitting] = useState(false)`; `const [createError, setCreateError] = useState<string | null>(null)`; `const [isModalOpen, setIsModalOpen] = useState(false)`
   - Move `handleSubmit` and `handleDelete` logic from `HomePage` to `App.tsx`
   - `handleSubmit` calls `createPost`, on success: pushes to posts, calls `setIsModalOpen(false)`, resets error
   - `handleDelete` calls `deletePost`, on success removes from posts
   - Render: `<div className="app"><TopNav onNewPost={() => setIsModalOpen(true)} /><PostForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} disabled={submitting} /><main className="main-content"><Routes>...</Routes></main></div>`
   - Pass `posts` and `onDelete` to `<HomePage>`
   - Keep `useEffect(() => { listPosts().then(setPosts) }, [])` to seed posts on load
6. Update `frontend/src/pages/HomePage.tsx`:
   - Remove all local state (`posts`, `submitting`, `error`, `handleSubmit`)
   - Change props to `{ posts: Post[], onDelete: (id: number) => void }`
   - Remove `PostForm` import and usage
   - Render: `<div className="home-page"><div className="page-header"><h1 className="page-title">Latest Posts</h1><p className="page-subtitle">A collection of ideas, tutorials, and thoughts.</p></div><PostList posts={posts} onDelete={onDelete} /></div>`
   - Do NOT add `.home-page` CSS rules — that is Slice 2's job
7. Run `npm run build` — must succeed with zero errors
8. Run `npm run lint` — must pass
9. Run `npm test` — existing Vitest tests must still pass (update any test that relied on old HomePage state shape)
10. Commit only owned files

**Files owned:**
- `frontend/src/index.css`
- `frontend/src/App.css`
- `frontend/src/App.tsx`
- `frontend/src/components/TopNav.tsx` (new)
- `frontend/src/components/PostForm.tsx`
- `frontend/src/pages/HomePage.tsx`

**Files off-limits:**
- `frontend/src/components/PostList.tsx`
- `frontend/src/components/EditPostForm.tsx`
- `frontend/src/pages/PostDetailPage.tsx`
- `frontend/src/api/posts.ts`
- `frontend/src/pages/PostDetailPage.test.tsx`
- `frontend/src/pages/HomePage.test.tsx`

**Acceptance criteria:**
1. `:root` in `index.css` contains every token from the design token table; no hardcoded hex colors in `App.css`
2. `Plus Jakarta Sans` imported; `body` uses `var(--font-sans)`; Newsreader and Space Grotesk removed
3. `body` and `#root` render against `#0d0f14` — warm parchment gradients gone
4. Fixed TopNav bar visible at top of every page; contains `◈ Blog` logo (left) and `+ New Post` button (right)
5. Clicking `+ New Post` opens the modal overlay (backdrop + dialog visible)
6. Backdrop has `backdrop-filter: blur(6px)` applied
7. Clicking `×` inside dialog closes the modal
8. Clicking outside dialog (on backdrop) closes the modal
9. Pressing `Escape` while modal is open closes it
10. Filling all three fields and submitting calls create API; new post appears, modal closes, fields reset
11. While `disabled={true}`, submit button has `opacity: 0.5` and `cursor: not-allowed`
12. Opening modal triggers `backdrop-in` and `modal-in` animations
13. `HomePage` no longer manages `posts` state or `handleSubmit`; receives them as props from `App.tsx`
14. On viewports ≤ 640px, nav inner padding reduces to `var(--space-4)`
15. `/` and `/posts/:id` routes still navigate correctly

---

### Slice 2: ui-overhaul-components

**Purpose:** Polish PostList into a card grid, restyle PostDetailPage as a reading article, and polish EditPostForm. This slice assumes all CSS tokens and utility classes from Slice 1 are already in `index.css` and `App.css`.

> ⚠️ Do NOT begin until Slice 1 is merged to `main` and pulled into this worktree.

**Ordered steps:**
1. Pull latest `main` into the worktree (tokens and utility classes are now available)
2. Append component CSS to `frontend/src/App.css` (do NOT remove anything already there):
   - `.home-page`, `.page-header`, `.page-title`, `.page-subtitle`
   - `.post-grid` (grid, auto-fill, minmax 300px, gap space-6)
   - `.post-card` (card bg, border, radius-lg, padding space-6, relative, overflow hidden, transition, card-reveal animation)
   - `.post-card::before` (absolute top bar, 3px, accent-gradient) — or inline `<div aria-hidden>` if pseudo not feasible
   - `.card-title` (link, font-lg, weight-600, no underline, hover accent)
   - `.card-snippet` (text-soft, line-clamp 2)
   - `.author-chip` (accent-dim bg, accent text, radius-sm, xs font)
   - `.card-date` (text-muted, xs font)
   - `.btn-delete-card` (ghost, hover destructive)
   - `.detail-page` (max-width 680px, centered, padding-top calc(60px + space-10))
   - `.back-link` (muted, no underline, hover text-soft)
   - `.article-title` (font-size-2xl, weight-700, letter-spacing -0.02em)
   - `.article-meta` (flex, sm font, muted, mb space-8)
   - `.article-divider` (1px border-top, no border else)
   - `.article-body` (font-md, line-height-relaxed, text-soft)
   - `.article-actions` (flex, gap space-3)
   - `.edit-form` (slide-down animation)
   - `.edit-meta` (sm font, muted, flex gap)
   - `.state-message` (base font, muted, mt space-8)
   - `.state-error` (error-bg bg, error-text color, radius-md padding)
   - Responsive: ≤1024px grid → minmax(280px, 1fr); ≤640px grid → 1fr; ≤640px .home-page → padding space-6 space-4
3. Rewrite `frontend/src/components/PostList.tsx`:
   - Render `<ul className="post-grid">` as grid container
   - For each post, render a PostCard (inline component or named function inside the file):
     - `<li className="post-card" style={{ animationDelay: `${Math.min(index, 4) * 40}ms` }}>`
     - `<div className="card-accent-bar" aria-hidden="true" />` (or use CSS `::before` if the linter is happy)
     - `<Link to={/posts/${post.id}} className="card-title">{post.title}</Link>`
     - `<p className="card-snippet">{post.content}</p>`
     - `<div className="card-footer">` with `<span className="author-chip">@{post.author}</span>`, `<time className="card-date">{formattedDate}</time>`, delete button
   - Delete button: `<button className="btn-delete-card" onClick={() => { if (window.confirm('Delete this post?')) onDelete(post.id) }}>Delete</button>`
   - Date format: `new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })`
   - Empty state: `<p className="empty-state">No posts yet. Write the first one →</p>`
4. Rewrite `frontend/src/pages/PostDetailPage.tsx`:
   - Outer wrapper: `<div className="detail-page">`
   - Back link: `<Link to="/" className="back-link">← Back to posts</Link>`
   - Loading: `<p className="state-message">Loading...</p>`
   - Error: `<p className="state-message state-error">{error}</p>`
   - Article view (when `!isEditing`): `<article className="post-article">` with title (h1.article-title), meta row (.article-meta), divider (hr.article-divider), body (p.article-body), action row (.article-actions) with Edit (.btn-outline) and Delete (.btn-ghost-destructive) buttons
   - Edit mode: render `<EditPostForm ... />` (unchanged props)
   - Delete handler: `window.confirm('Delete this post?')` then `deletePost`, navigate to `/`
   - All existing state and logic (isEditing, saving, handleSave, handleCancel, handleDelete) must still work
5. Rewrite `frontend/src/components/EditPostForm.tsx`:
   - Container: `<form className="edit-form" onSubmit={handleSubmit}>`
   - Title field: `.field-group` with label + input (same token classes as modal)
   - Content field: `.field-group` with label + textarea (min-height 160px)
   - Meta row: `<div className="edit-meta">by {author} · {createdAt}</div>`
   - Action row: Save button (`.btn-primary`, disabled when saving), Cancel button (`.btn-outline`, disabled when saving)
   - All existing props and logic unchanged: `{ initialTitle, initialContent, author, createdAt, saving, onSave, onCancel }`
6. Run `npm run build` — must succeed
7. Run `npm run lint` — must pass
8. Run `npm test` — all existing tests must pass
9. Commit only owned files

**Files owned:**
- `frontend/src/components/PostList.tsx`
- `frontend/src/pages/PostDetailPage.tsx`
- `frontend/src/components/EditPostForm.tsx`
- `frontend/src/App.css` (append only — do NOT remove Slice 1's rules)

**Files off-limits:**
- `frontend/src/index.css`
- `frontend/src/App.tsx`
- `frontend/src/components/TopNav.tsx`
- `frontend/src/components/PostForm.tsx`
- `frontend/src/pages/HomePage.tsx`
- `frontend/src/api/posts.ts`

**Acceptance criteria:**
1. On viewports ≥ 1024px, posts render in a multi-column grid (auto-fill, minmax 300px, 1fr)
2. On viewports ≤ 640px, posts render in a single column
3. Card gap is 24px (matches `--space-6`)
4. Each card has a 3px violet top bar (gradient from `--color-accent-gradient`)
5. Hovering a card produces `translateY(-3px)` and `box-shadow: var(--shadow-md)` with 0.2s ease
6. Hovering the card title link changes color to `var(--color-accent)`
7. Post content is clamped to 2 lines with `-webkit-line-clamp: 2`
8. Each card shows author name in a violet chip with `background: var(--color-accent-dim)`
9. Dates formatted as `MMM D, YYYY` (e.g. "Jan 12, 2026") using `toLocaleDateString`
10. Cards animate in with `card-reveal` — staggered 40ms × index, max 4 steps — via inline `animationDelay` style
11. When no posts exist, centered `.empty-state` message appears with muted text
12. `.detail-page` wrapper is `max-width: 680px; margin: 0 auto`
13. `.detail-page` has `padding-top: calc(60px + var(--space-10))` to clear the fixed nav
14. Article `<h1>` uses `var(--font-size-2xl)`, weight 700, `letter-spacing: -0.02em`
15. Article body uses `var(--font-size-md)` (18px) at `line-height: var(--line-height-relaxed)` (1.8)
16. Back link uses muted color; gains `color: var(--color-text-soft)` on hover
17. Edit button in article view uses `.btn-outline` — transparent bg, accent border on hover
18. Delete button uses `.btn-ghost-destructive` — no border by default, red border/text on hover
19. When `isEditing` is true, `<EditPostForm>` renders with `animation: slide-down 200ms ease both`
20. Title input and Content textarea in edit form use `.field-group` token-based styles
21. Save uses `.btn-primary`, Cancel uses `.btn-outline`; both disabled when `saving` is true
22. Neither `PostList.tsx`, `PostDetailPage.tsx`, nor `EditPostForm.tsx` contain hardcoded hex color values
