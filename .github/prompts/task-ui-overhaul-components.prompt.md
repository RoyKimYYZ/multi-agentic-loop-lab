# Task: UI Overhaul — Components Slice (Slice 2 of 2)

**Design artifact:** [design-ui-overhaul.prompt.md](./design-ui-overhaul.prompt.md)
**Implementation plan:** [docs/features/ui-overhaul-plan.md](../../docs/features/ui-overhaul-plan.md)
**Worktree:** `../parallel-agent-ui-overhaul-components`
**Branch:** `feat/ui-overhaul-components`

> ⚠️ **Do NOT begin until Slice 1 (`feat/ui-overhaul-system`) is merged to `main` and you have pulled `main` into this worktree.** This slice depends on CSS tokens in `index.css` and utility classes in `App.css` that Slice 1 writes. Without them, nothing will render correctly.

> ⚠️ **Read the full design artifact and plan before writing any code.** Every CSS value, every class name, every layout decision is specified exactly.

---

## Your Mission

Style the **PostList into a card grid**, restyle the **PostDetailPage as a reading article**, and polish the **EditPostForm**. All styling uses design tokens already in place from Slice 1 — you only append to `App.css`, never touch `index.css` or `App.tsx`.

---

## First Step: Pull Main

```bash
cd /home/rkadmin/parallel-agent-ui-overhaul-components
git pull origin main
cd frontend && npm install
```

---

## Implementation Plan for This Slice

### Ordered Steps

1. **Append to `frontend/src/App.css`** (append only — do NOT remove any rules Slice 1 wrote):

   **HomePage layout:**
   ```css
   .home-page {
     max-width: 1200px;
     margin: 0 auto;
     padding: var(--space-10) var(--space-6);
   }
   .page-header {
     margin-bottom: var(--space-8);
   }
   .page-title {
     font-size: clamp(1.5rem, 3vw, 2rem);
     font-weight: 700;
     color: var(--color-text);
     margin-bottom: var(--space-2);
   }
   .page-subtitle {
     color: var(--color-text-muted);
     font-size: var(--font-size-base);
   }
   ```

   **Post grid:**
   ```css
   .post-grid {
     list-style: none;
     margin: 0;
     padding: 0;
     display: grid;
     grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
     gap: var(--space-6);
   }
   .empty-state {
     color: var(--color-text-muted);
     font-size: var(--font-size-base);
     text-align: center;
     padding: var(--space-16) 0;
   }
   ```

   **Post card:**
   ```css
   .post-card {
     background: var(--color-card);
     border: 1px solid var(--color-border);
     border-radius: var(--radius-lg);
     padding: var(--space-6);
     position: relative;
     overflow: hidden;
     display: flex;
     flex-direction: column;
     transition: background var(--transition-base), border-color var(--transition-base),
                 transform var(--transition-base), box-shadow var(--transition-base);
     animation: card-reveal 320ms ease both;
   }
   .post-card:hover {
     background: var(--color-card-hover);
     border-color: var(--color-border-strong);
     transform: translateY(-3px);
     box-shadow: var(--shadow-md);
   }
   .card-accent-bar {
     position: absolute;
     top: 0;
     left: 0;
     right: 0;
     height: 3px;
     background: var(--color-accent-gradient);
     border-radius: var(--radius-lg) var(--radius-lg) 0 0;
   }
   ```

   **Card content:**
   ```css
   .card-title {
     font-size: var(--font-size-lg);
     font-weight: var(--font-weight-semibold);
     color: var(--color-text);
     text-decoration: none;
     line-height: 1.3;
     display: block;
     margin-bottom: var(--space-3);
     transition: color var(--transition-base);
   }
   .card-title:hover {
     color: var(--color-accent);
   }
   .card-snippet {
     font-size: var(--font-size-base);
     color: var(--color-text-soft);
     line-height: var(--line-height-base);
     margin: 0 0 var(--space-5) 0;
     display: -webkit-box;
     -webkit-line-clamp: 2;
     -webkit-box-orient: vertical;
     overflow: hidden;
   }
   .card-footer {
     display: flex;
     align-items: center;
     justify-content: space-between;
     gap: var(--space-3);
     margin-top: auto;
   }
   .author-chip {
     background: var(--color-accent-dim);
     color: var(--color-accent);
     border-radius: var(--radius-sm);
     padding: var(--space-1) var(--space-2);
     font-size: var(--font-size-xs);
     font-weight: var(--font-weight-semibold);
   }
   .card-date {
     font-size: var(--font-size-xs);
     color: var(--color-text-muted);
   }
   .btn-delete-card {
     background: none;
     border: none;
     color: var(--color-text-muted);
     font-size: var(--font-size-xs);
     font-weight: var(--font-weight-medium);
     cursor: pointer;
     padding: var(--space-1) var(--space-2);
     border-radius: var(--radius-sm);
     font-family: var(--font-sans);
     transition: color var(--transition-base), background var(--transition-base);
   }
   .btn-delete-card:hover {
     color: var(--color-destructive);
     background: var(--color-destructive-hover-bg);
   }
   ```

   **Detail page:**
   ```css
   .detail-page {
     max-width: 680px;
     margin: 0 auto;
     padding-top: calc(60px + var(--space-10));
     padding-bottom: var(--space-16);
     padding-left: var(--space-4);
     padding-right: var(--space-4);
   }
   .back-link {
     font-size: var(--font-size-sm);
     color: var(--color-text-muted);
     text-decoration: none;
     display: inline-flex;
     align-items: center;
     gap: var(--space-1);
     margin-bottom: var(--space-8);
     transition: color var(--transition-base);
   }
   .back-link:hover {
     color: var(--color-text-soft);
   }
   .state-message {
     color: var(--color-text-muted);
     font-size: var(--font-size-base);
     margin-top: var(--space-8);
   }
   .state-error {
     background: var(--color-error-bg);
     color: var(--color-error-text);
     border-radius: var(--radius-md);
     padding: var(--space-3) var(--space-4);
     margin-top: var(--space-4);
   }
   ```

   **Article:**
   ```css
   .post-article {
     animation: article-in 300ms ease both;
   }
   .article-title {
     font-size: var(--font-size-2xl);
     font-weight: 700;
     color: var(--color-text);
     line-height: var(--line-height-tight);
     margin: 0 0 var(--space-4) 0;
     letter-spacing: -0.02em;
   }
   .article-meta {
     font-size: var(--font-size-sm);
     color: var(--color-text-muted);
     margin-bottom: var(--space-8);
     display: flex;
     align-items: center;
     gap: var(--space-2);
   }
   .article-divider {
     border: none;
     border-top: 1px solid var(--color-border);
     margin: 0 0 var(--space-8) 0;
   }
   .article-body {
     font-size: var(--font-size-md);
     line-height: var(--line-height-relaxed);
     color: var(--color-text-soft);
     margin: 0 0 var(--space-10) 0;
   }
   .article-actions {
     display: flex;
     gap: var(--space-3);
     align-items: center;
   }
   ```

   **Edit form:**
   ```css
   .edit-form {
     animation: slide-down 200ms ease both;
     display: grid;
     gap: var(--space-5);
   }
   .edit-meta {
     font-size: var(--font-size-sm);
     color: var(--color-text-muted);
     margin-top: var(--space-2);
     display: flex;
     gap: var(--space-3);
     align-items: center;
   }
   .edit-actions {
     display: flex;
     gap: var(--space-3);
     margin-top: var(--space-6);
     align-items: center;
   }
   ```

   **Responsive breakpoints** (append at end of file):
   ```css
   @media (max-width: 1024px) {
     .post-grid {
       grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
     }
   }
   @media (max-width: 640px) {
     .post-grid {
       grid-template-columns: 1fr;
     }
     .home-page {
       padding: var(--space-6) var(--space-4);
     }
     .detail-page {
       padding-left: var(--space-4);
       padding-right: var(--space-4);
     }
   }
   ```

2. **Rewrite `frontend/src/components/PostList.tsx`**:

   ```tsx
   import { Link } from 'react-router-dom'
   import type { Post } from '../api/posts'

   interface Props {
     posts: Post[]
     onDelete: (id: number) => void
   }

   export default function PostList({ posts, onDelete }: Props) {
     if (posts.length === 0) {
       return <p className="empty-state">No posts yet. Write the first one →</p>
     }
     return (
       <ul className="post-grid">
         {posts.map((post, index) => (
           <li
             key={post.id}
             className="post-card"
             style={{ animationDelay: `${Math.min(index, 4) * 40}ms` }}
           >
             <div className="card-accent-bar" aria-hidden="true" />
             <Link to={`/posts/${post.id}`} className="card-title">{post.title}</Link>
             <p className="card-snippet">{post.content}</p>
             <div className="card-footer">
               <span className="author-chip">@{post.author}</span>
               <time className="card-date">
                 {new Date(post.created_at).toLocaleDateString('en-US', {
                   month: 'short', day: 'numeric', year: 'numeric'
                 })}
               </time>
               <button
                 className="btn-delete-card"
                 onClick={() => { if (window.confirm('Delete this post?')) onDelete(post.id) }}
               >
                 Delete
               </button>
             </div>
           </li>
         ))}
       </ul>
     )
   }
   ```

3. **Rewrite `frontend/src/pages/PostDetailPage.tsx`**:
   - Keep all existing state: `post`, `error`, `isEditing`, `saving`
   - Keep all existing handlers: `handleSave`, `handleCancel`, `handleDelete`
   - New JSX structure:
     ```tsx
     <div className="detail-page">
       <Link to="/" className="back-link">← Back to posts</Link>
       {!post && !error && <p className="state-message">Loading...</p>}
       {error && <p className="state-message state-error">{error}</p>}
       {post && !isEditing && (
         <article className="post-article">
           <h1 className="article-title">{post.title}</h1>
           <div className="article-meta">
             <span>by {post.author}</span>
             <span aria-hidden="true">·</span>
             <time>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
           </div>
           <hr className="article-divider" />
           <p className="article-body">{post.content}</p>
           <div className="article-actions">
             <button className="btn-outline" onClick={() => setIsEditing(true)}>Edit</button>
             <button className="btn-ghost-destructive" onClick={handleDelete}>Delete</button>
           </div>
         </article>
       )}
       {post && isEditing && (
         <EditPostForm
           initialTitle={post.title}
           initialContent={post.content}
           author={post.author}
           createdAt={post.created_at}
           saving={saving}
           onSave={handleSave}
           onCancel={handleCancel}
         />
       )}
     </div>
     ```

4. **Rewrite `frontend/src/components/EditPostForm.tsx`**:
   - Keep all existing props: `{ initialTitle, initialContent, author, createdAt, saving, onSave, onCancel }`
   - Keep all existing state and logic (controlled inputs, handleSubmit)
   - New JSX structure:
     ```tsx
     <form className="edit-form" onSubmit={handleSubmit}>
       <div className="field-group">
         <label htmlFor="edit-title">Title</label>
         <input id="edit-title" type="text" value={title} onChange={e => setTitle(e.target.value)} required />
       </div>
       <div className="field-group">
         <label htmlFor="edit-content">Content</label>
         <textarea id="edit-content" value={content} onChange={e => setContent(e.target.value)} required style={{ minHeight: '160px' }} />
       </div>
       <div className="edit-meta">
         <span>by {author}</span>
         <span aria-hidden="true">·</span>
         <time>{createdAt}</time>
       </div>
       <div className="edit-actions">
         <button type="submit" disabled={saving} className="btn-primary">Save</button>
         <button type="button" disabled={saving} className="btn-outline" onClick={onCancel}>Cancel</button>
       </div>
     </form>
     ```

5. Run `npm run build` — fix any TypeScript errors
6. Run `npm run lint` — fix any lint warnings
7. Run `npm test` — all existing tests must pass
8. Commit only owned files

---

## Files Owned

- `frontend/src/components/PostList.tsx`
- `frontend/src/pages/PostDetailPage.tsx`
- `frontend/src/components/EditPostForm.tsx`
- `frontend/src/App.css` (**append only** — do NOT remove anything Slice 1 wrote)

## Files Off-Limits

- `frontend/src/index.css`
- `frontend/src/App.tsx`
- `frontend/src/components/TopNav.tsx`
- `frontend/src/components/PostForm.tsx`
- `frontend/src/pages/HomePage.tsx`
- `frontend/src/api/posts.ts`

---

## Acceptance Criteria

1. On viewports ≥ 1024px, posts render in a multi-column grid (auto-fill, minmax 300px, 1fr)
2. On viewports ≤ 640px, posts render in a single column
3. Card gap is 24px (matches `--space-6`)
4. Each card has a 3px violet top bar (gradient from `--color-accent-gradient`)
5. Hovering a card produces `translateY(-3px)` and `box-shadow: var(--shadow-md)` with 0.2s ease
6. Hovering the card title link changes color to `var(--color-accent)`
7. Post content clamped to 2 lines via `-webkit-line-clamp: 2`
8. Each card shows author name in a violet chip (`background: var(--color-accent-dim)`)
9. Dates formatted as `MMM D, YYYY` using `toLocaleDateString`
10. Cards animate in with `card-reveal`, staggered 40ms × index (max 4 steps) via inline `animationDelay`
11. Empty state: centered `.empty-state` message in muted text
12. `.detail-page` is `max-width: 680px; margin: 0 auto`
13. `.detail-page` has `padding-top: calc(60px + var(--space-10))` to clear the fixed nav
14. Article `<h1>` uses `var(--font-size-2xl)`, weight 700, `letter-spacing: -0.02em`
15. Article body uses `var(--font-size-md)` (18px) at `line-height: var(--line-height-relaxed)` (1.8)
16. Back link muted color; gains `color: var(--color-text-soft)` on hover
17. Edit button uses `.btn-outline` — accent border on hover
18. Delete button uses `.btn-ghost-destructive` — red border/text on hover
19. When `isEditing` is true, `<EditPostForm>` renders with `animation: slide-down 200ms ease both`
20. Edit form fields use `.field-group` token-based styles
21. Save uses `.btn-primary`, Cancel uses `.btn-outline`; both disabled when `saving=true`
22. No hardcoded hex color values in `PostList.tsx`, `PostDetailPage.tsx`, or `EditPostForm.tsx`

---

## Gates Before Reporting Done

```bash
cd /home/rkadmin/parallel-agent-ui-overhaul-components/frontend
npm run build    # must succeed, zero errors
npm run lint     # must pass
npm test         # all existing tests must pass
```

Report back to the Orchestrator with the test output when all three pass.
