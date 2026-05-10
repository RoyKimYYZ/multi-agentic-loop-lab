# Design: Full UI Overhaul — 2026 Aesthetic

## Summary
Replace the current warm-parchment, mixed-layout UI with a dark-mode-first, electric-violet-accented design system featuring a fixed topnav with modal post creation, a responsive card grid for the post feed, and a centered article layout for post detail — all driven by a single CSS token system.

---

## Diagrams
- [UI Wireframe](./diagrams/design-ui-overhaul-wireframe.svg)
- [Sequence Diagram](./diagrams/design-ui-overhaul-sequence.svg)
- [Architecture Diagram](./diagrams/design-ui-overhaul-architecture.svg)

---

## Design Vision

The overhauled blog feels like a premium editorial platform from 2026: a near-black canvas (`#0d0f14`) gives depth and focus, while electric violet (`#7c3aed` / `#8b5cf6`) provides a single, confident accent used sparingly on interactive elements, accent bars on cards, and the primary CTA. Cards sit on a slightly lighter surface (`#1a1d28`) with a 1px near-transparent border and a 3px violet top-bar, lifting out of the background through layered depth rather than flat color. **Plus Jakarta Sans** at 400/600/700 gives a friendly-but-sharp geometric feel for UI chrome, while long-form body text in the post detail uses a generous line-height (`1.8`) for comfortable reading. Every interactive element responds in `0.2s ease`: cards lift, buttons glow, form fields illuminate at focus. The fixed topnav anchors the app chrome; a "New Post" pill button at top-right triggers a backdrop-blurred modal — the post form is never visible inline on the page again.

---

## Design Token Table

All tokens are defined as CSS custom properties on `:root` in `index.css`. Every component references only these tokens — no hardcoded color, radius, or shadow values anywhere in component CSS.

### Color Tokens

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#0d0f14` | Page/html/body background |
| `--color-surface` | `#13161e` | TopNav background |
| `--color-card` | `#1a1d28` | Card and modal dialog background |
| `--color-card-hover` | `#1e2235` | Card background on hover |
| `--color-border` | `rgba(255, 255, 255, 0.08)` | Default borders (cards, inputs) |
| `--color-border-strong` | `rgba(255, 255, 255, 0.14)` | Focused/hovered borders, modal dialog border |
| `--color-text` | `#f0f2f8` | Primary text (headings, body) |
| `--color-text-soft` | `#8b92a9` | Secondary text (snippets, meta) |
| `--color-text-muted` | `#555c73` | Tertiary text (placeholders, dates) |
| `--color-accent` | `#8b5cf6` | Accent text, links, card top-bar |
| `--color-accent-dark` | `#7c3aed` | Accent button fill, interactive accent |
| `--color-accent-dim` | `rgba(139, 92, 246, 0.15)` | Author chip background |
| `--color-accent-glow` | `rgba(139, 92, 246, 0.30)` | Focus ring on accent buttons |
| `--color-accent-gradient` | `linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)` | Primary CTA button fill |
| `--color-overlay` | `rgba(0, 0, 0, 0.72)` | Modal backdrop |
| `--color-nav-bg` | `rgba(19, 22, 30, 0.88)` | TopNav background with transparency for blur |
| `--color-success-bg` | `rgba(16, 185, 129, 0.12)` | Success status message background |
| `--color-success-text` | `#6ee7b7` | Success status message text |
| `--color-error-bg` | `rgba(239, 68, 68, 0.12)` | Error status message background |
| `--color-error-text` | `#fca5a5` | Error status message text |
| `--color-destructive` | `#ef4444` | Delete button border/text |
| `--color-destructive-hover-bg` | `rgba(239, 68, 68, 0.10)` | Delete button hover background |

### Radius Tokens

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `6px` | Small inner elements (chips, tags) |
| `--radius-md` | `10px` | Input fields |
| `--radius-lg` | `16px` | Cards |
| `--radius-xl` | `22px` | Modal dialog |
| `--radius-pill` | `9999px` | Pill buttons (New Post, Publish Post) |

### Shadow Tokens

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 4px rgba(0,0,0,0.5)` | Subtle lift |
| `--shadow-md` | `0 4px 20px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.4)` | Card hover, modal dialog |
| `--shadow-lg` | `0 12px 48px rgba(0,0,0,0.65), 0 4px 20px rgba(0,0,0,0.5)` | Elevated modal |
| `--shadow-modal` | `0 28px 80px rgba(0,0,0,0.80), 0 8px 32px rgba(0,0,0,0.55)` | New Post modal dialog |
| `--shadow-accent-focus` | `0 0 0 3px rgba(139,92,246,0.35)` | Focus ring on accent CTA buttons |
| `--shadow-input-focus` | `0 0 0 3px rgba(139,92,246,0.22)` | Focus ring on form inputs |

### Font Tokens

| Token | Value | Usage |
|---|---|---|
| `--font-sans` | `'Plus Jakarta Sans', 'Inter', system-ui, sans-serif` | All UI text |
| `--font-size-xs` | `0.6875rem` | `11px` — captions, dates, chips |
| `--font-size-sm` | `0.8125rem` | `13px` — labels, meta |
| `--font-size-base` | `1rem` | `16px` — body text |
| `--font-size-md` | `1.125rem` | `18px` — article body |
| `--font-size-lg` | `1.25rem` | `20px` — card titles |
| `--font-size-xl` | `1.5rem` | `24px` — modal heading |
| `--font-size-2xl` | `clamp(1.75rem, 4vw, 2.75rem)` | Article h1 |
| `--font-weight-regular` | `400` | Body |
| `--font-weight-medium` | `500` | Labels, meta |
| `--font-weight-semibold` | `600` | Card titles, form labels |
| `--font-weight-bold` | `700` | Nav logo, primary headings, CTA text |
| `--line-height-tight` | `1.25` | Headings |
| `--line-height-base` | `1.5` | UI text |
| `--line-height-relaxed` | `1.8` | Article body prose |

### Spacing Tokens

| Token | Value | Pixels |
|---|---|---|
| `--space-1` | `0.25rem` | 4px |
| `--space-2` | `0.5rem` | 8px |
| `--space-3` | `0.75rem` | 12px |
| `--space-4` | `1rem` | 16px |
| `--space-5` | `1.25rem` | 20px |
| `--space-6` | `1.5rem` | 24px |
| `--space-8` | `2rem` | 32px |
| `--space-10` | `2.5rem` | 40px |
| `--space-12` | `3rem` | 48px |
| `--space-16` | `4rem` | 64px |

### Transition Tokens

| Token | Value |
|---|---|
| `--transition-fast` | `0.15s ease` |
| `--transition-base` | `0.2s ease` |
| `--transition-slow` | `0.3s ease` |

---

## Typography Spec

**Font import** (in `index.css`, replace the current Google Fonts import):
```
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
```

Remove the existing Newsreader + Space Grotesk imports entirely.

| Role | Element | `font-family` | `font-size` | `font-weight` | `line-height` | `color` |
|---|---|---|---|---|---|---|
| Nav logo | `.nav-logo` | `--font-sans` | `1.125rem` | `700` | `1` | `--color-accent` |
| Page h1 (article) | `h1.article-title` | `--font-sans` | `--font-size-2xl` | `700` | `--line-height-tight` | `--color-text` |
| Card title | `.card-title` | `--font-sans` | `--font-size-lg` | `600` | `1.3` | `--color-text` |
| Modal heading | `.modal-heading` | `--font-sans` | `--font-size-xl` | `700` | `1` | `--color-text` |
| Body / UI | body, p, input | `--font-sans` | `--font-size-base` | `400` | `--line-height-base` | `--color-text` |
| Article body | `.article-body` | `--font-sans` | `--font-size-md` | `400` | `--line-height-relaxed` | `--color-text-soft` |
| Meta / caption | `.post-meta` | `--font-sans` | `--font-size-sm` | `500` | `1` | `--color-text-muted` |
| Form labels | `label` | `--font-sans` | `--font-size-sm` | `600` | `1` | `--color-text-soft` |
| Chips | `.author-chip` | `--font-sans` | `--font-size-xs` | `600` | `1` | `--color-accent` |

---

## Component Specs

### 1. TopNav (NEW — `TopNav.tsx`)

**Props:** `{ onNewPost: () => void }`

**Placement:** Rendered directly in `App.tsx`, above `<main>`, always visible.

**Appearance:**
- `position: fixed; top: 0; left: 0; right: 0; z-index: 100`
- `height: 60px`
- `background: var(--color-nav-bg)` (`rgba(19, 22, 30, 0.88)`)
- `backdrop-filter: blur(20px) saturate(1.6)`
- `-webkit-backdrop-filter: blur(20px) saturate(1.6)`
- `border-bottom: 1px solid var(--color-border)`
- Inner layout: `display: flex; align-items: center; justify-content: space-between; padding: 0 var(--space-6); max-width: 1200px; margin: 0 auto; height: 100%`

**Logo (left side):**
- Element: `<span className="nav-logo">◈ Blog</span>` — the `◈` is a Unicode diamond, part of the text node, not a separate element
- `font-size: var(--font-size-base)` (`1rem`)
- `font-weight: var(--font-weight-bold)` (`700`)
- `color: var(--color-accent)`
- `letter-spacing: -0.01em`
- `cursor: default`
- Clicking the logo navigates to `/` — wrap in `<Link to="/" className="nav-logo">`; remove default link underline with `text-decoration: none`

**"New Post" button (right side):**
- Element: `<button className="btn-primary" onClick={onNewPost}>+ New Post</button>`
- `background: var(--color-accent-gradient)`
- `color: #fff`
- `border: none`
- `border-radius: var(--radius-pill)`
- `padding: var(--space-2) var(--space-5)` (8px 20px)
- `font-family: var(--font-sans)`
- `font-size: var(--font-size-sm)` (13px)
- `font-weight: var(--font-weight-bold)` (700)
- `cursor: pointer`
- `transition: opacity var(--transition-base), transform var(--transition-fast), box-shadow var(--transition-base)`
- On hover: `opacity: 0.92; transform: translateY(-1px); box-shadow: var(--shadow-accent-focus)`
- On active/pressed: `transform: translateY(0); opacity: 1`
- On focus-visible: `outline: none; box-shadow: var(--shadow-accent-focus)`

---

### 2. PostCard (NEW — inside `PostList.tsx`, replaces `<li>`)

**No separate file** — `PostCard` is a named internal component or inline JSX inside `PostList.tsx`. It renders each post item. `PostList.tsx` is the file that owns this.

**Props (of the card unit):** `{ post: Post; onDelete: (id: number) => void }`

**Appearance:**
- `background: var(--color-card)`
- `border: 1px solid var(--color-border)`
- `border-radius: var(--radius-lg)` (16px)
- `padding: var(--space-6)` (24px) on all sides
- `position: relative`
- `overflow: hidden`
- `transition: background var(--transition-base), border-color var(--transition-base), transform var(--transition-base), box-shadow var(--transition-base)`
- `animation: card-reveal 320ms ease both`
- On hover: `background: var(--color-card-hover); border-color: var(--color-border-strong); transform: translateY(-3px); box-shadow: var(--shadow-md)`

**Accent top-bar:**
- A pseudo-element `::before` (or an absolutely-positioned `<div>` with `aria-hidden="true"` since pseudo-elements in CSS-modules are fine):
  - `position: absolute; top: 0; left: 0; right: 0; height: 3px`
  - `background: var(--color-accent-gradient)`
  - `border-radius: var(--radius-lg) var(--radius-lg) 0 0`

**Card title:**
- `<Link to={/posts/${post.id}} className="card-title">`
- `font-size: var(--font-size-lg)` (20px)
- `font-weight: var(--font-weight-semibold)` (600)
- `color: var(--color-text)`
- `text-decoration: none`
- `line-height: 1.3`
- `display: block`
- `margin-bottom: var(--space-3)` (12px)
- On hover: `color: var(--color-accent)`
- `transition: color var(--transition-base)`

**Content snippet:**
- `<p className="card-snippet">`
- `font-size: var(--font-size-base)` (16px)
- `color: var(--color-text-soft)`
- `line-height: var(--line-height-base)` (1.5)
- `margin: 0 0 var(--space-5) 0` (bottom margin 20px)
- Text is truncated to 2 lines:
  ```css
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  ```

**Card footer row:**
- `display: flex; align-items: center; justify-content: space-between; gap: var(--space-3)`
- `margin-top: auto`

**Author chip (inside footer):**
- `<span className="author-chip">@{post.author}</span>`
- `background: var(--color-accent-dim)`
- `color: var(--color-accent)`
- `border-radius: var(--radius-sm)` (6px)
- `padding: var(--space-1) var(--space-2)` (4px 8px)
- `font-size: var(--font-size-xs)` (11px)
- `font-weight: var(--font-weight-semibold)` (600)

**Date (inside footer):**
- `<time className="card-date">{formatted date}</time>`
- `font-size: var(--font-size-xs)` (11px)
- `color: var(--color-text-muted)`
- Format the date: use `new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })`. If parsing fails, show the raw string.

**Delete button (inside footer):**
- `<button className="btn-delete-card" onClick={() => { if (window.confirm('Delete this post?')) onDelete(post.id) }}>Delete</button>`
- `background: none`
- `border: none`
- `color: var(--color-text-muted)`
- `font-size: var(--font-size-xs)` (11px)
- `font-weight: var(--font-weight-medium)` (500)
- `cursor: pointer`
- `padding: var(--space-1) var(--space-2)`
- `border-radius: var(--radius-sm)`
- `transition: color var(--transition-base), background var(--transition-base)`
- On hover: `color: var(--color-destructive); background: var(--color-destructive-hover-bg)`

---

### 3. PostGrid / PostList (CHANGED — `PostList.tsx`)

**Props:** `{ posts: Post[]; onDelete: (id: number) => void }` — identical to current interface.

**Grid container (replaces `<ul>`):**
- Element: `<ul className="post-grid">`
- `list-style: none; margin: 0; padding: 0`
- `display: grid`
- `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))`
- `gap: var(--space-6)` (24px)

**Empty state:**
- `<p className="empty-state">No posts yet. Write the first one →</p>`
- `color: var(--color-text-muted)`
- `font-size: var(--font-size-base)`
- `text-align: center`
- `padding: var(--space-16) 0`

---

### 4. PostForm Modal (CHANGED — `PostForm.tsx`)

The PostForm component is redesigned to operate as a **modal overlay**. Its props change.

**New Props:**
```typescript
interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: PostCreate) => void
  disabled: boolean
}
```

**Behavior:**
- When `isOpen` is `false`, render `null` (no DOM output).
- When `isOpen` is `true`, render the modal structure.
- Closing triggers:
  1. User clicks the backdrop (the outer overlay div, not the dialog)
  2. User clicks the `×` button inside the dialog header
  3. User presses the `Escape` key — register a `keydown` listener in a `useEffect` that calls `onClose` on `Escape`; clean up the listener on unmount or when `isOpen` changes.
- After a successful submit (`onSubmit` called), the form fields reset to empty strings. `onClose()` is NOT called by PostForm — the parent (`App.tsx`) decides to close on success.

**Backdrop:**
- `position: fixed; inset: 0; z-index: 200`
- `background: var(--color-overlay)`
- `backdrop-filter: blur(6px)`
- `-webkit-backdrop-filter: blur(6px)`
- `display: flex; align-items: center; justify-content: center; padding: var(--space-4)`
- `animation: backdrop-in var(--transition-base) ease both`
- Click handler on this element calls `onClose()`; stop propagation on the dialog so clicking inside doesn't close.

**Dialog:**
- `background: var(--color-card)`
- `border: 1px solid var(--color-border-strong)`
- `border-radius: var(--radius-xl)` (22px)
- `box-shadow: var(--shadow-modal)`
- `width: 100%; max-width: 500px`
- `padding: var(--space-8)` (32px)
- `animation: modal-in var(--transition-base) ease both`
- `position: relative`

**Dialog header:**
- `display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-6)`
- Heading: `<h2 className="modal-heading">New Post</h2>` — `font-size: var(--font-size-xl)` (24px), `font-weight: 700`, `color: var(--color-text)`, `margin: 0`
- Close button: `<button className="modal-close" aria-label="Close">✕</button>`
  - `background: var(--color-border)` (rgba white)
  - `border: none; border-radius: 50%; width: 32px; height: 32px`
  - `display: flex; align-items: center; justify-content: center`
  - `color: var(--color-text-soft); font-size: 1rem; cursor: pointer`
  - On hover: `background: var(--color-border-strong); color: var(--color-text)`
  - `transition: background var(--transition-base), color var(--transition-base)`

**Form layout:**
- `display: grid; gap: var(--space-5)` (20px between fields)
- Three fields in order: **Title**, **Author**, **Content**

**Form field group:**
Each field is a `<div className="field-group">` containing a `<label>` and an `<input>` or `<textarea>`.
- `display: flex; flex-direction: column; gap: var(--space-2)` (8px label-to-input gap)

**Labels:**
- `font-size: var(--font-size-sm)` (13px)
- `font-weight: var(--font-weight-semibold)` (600)
- `color: var(--color-text-soft)`
- `letter-spacing: 0.04em`
- `text-transform: uppercase`

**Inputs and Textarea:**
- `width: 100%; box-sizing: border-box`
- `background: var(--color-bg)` (`#0d0f14` — darker than card)
- `border: 1px solid var(--color-border)`
- `border-radius: var(--radius-md)` (10px)
- `padding: var(--space-3) var(--space-4)` (12px 16px)
- `font-family: var(--font-sans); font-size: var(--font-size-base)`
- `color: var(--color-text)`
- `outline: none`
- `transition: border-color var(--transition-base), box-shadow var(--transition-base)`
- Placeholder color: `var(--color-text-muted)` — set via `::placeholder { color: var(--color-text-muted) }`
- On focus: `border-color: var(--color-accent); box-shadow: var(--shadow-input-focus)`
- **Textarea specific:** `resize: vertical; min-height: 120px; line-height: var(--line-height-base)`

**Submit button:**
- `<button type="submit" disabled={disabled} className="btn-primary btn-full">`
- All `.btn-primary` styles (same as nav "New Post") plus:
- `width: 100%`
- `padding: var(--space-3) var(--space-4)` (12px 16px)
- `font-size: var(--font-size-base)` (16px)
- `margin-top: var(--space-2)` (8px extra top margin)
- When `disabled`: `opacity: 0.5; cursor: not-allowed; transform: none`

**State reset after submit:**
After calling `onSubmit({ title, content, author })`, reset all three local state values to `''`. The component does NOT call `onClose`.

---

### 5. PostDetailPage (CHANGED — `PostDetailPage.tsx`)

**Overall page wrapper:**
- `<div className="detail-page">`
- `padding-top: calc(60px + var(--space-10))` (60px nav + 40px breathing room = 100px)
- `padding-bottom: var(--space-16)` (64px)
- `padding-left: var(--space-4); padding-right: var(--space-4)`
- `max-width: 680px`
- `margin: 0 auto`

**Back link:**
- `<Link to="/" className="back-link">← Back to posts</Link>`
- `font-size: var(--font-size-sm)` (13px)
- `color: var(--color-text-muted)`
- `text-decoration: none`
- `display: inline-flex; align-items: center; gap: var(--space-1)`
- `margin-bottom: var(--space-8)` (32px)
- On hover: `color: var(--color-text-soft)`
- `transition: color var(--transition-base)`

**Loading state:**
- `<p className="state-message">Loading...</p>`
- `color: var(--color-text-muted); font-size: var(--font-size-base); margin-top: var(--space-8)`

**Error state:**
- `<p className="state-message state-error">{error}</p>`
- `background: var(--color-error-bg); color: var(--color-error-text)`
- `border-radius: var(--radius-md); padding: var(--space-3) var(--space-4)`
- `margin-top: var(--space-4)`

**Article view (when `!isEditing`):**
- `<article className="post-article">`
- `animation: article-in 300ms ease both`

  **Title:**
  - `<h1 className="article-title">{currentPost.title}</h1>`
  - `font-size: var(--font-size-2xl)` (`clamp(1.75rem, 4vw, 2.75rem)`)
  - `font-weight: 700`
  - `color: var(--color-text)`
  - `line-height: var(--line-height-tight)` (1.25)
  - `margin: 0 0 var(--space-4) 0` (16px below)
  - `letter-spacing: -0.02em`

  **Meta row:**
  - `<div className="article-meta">`
  - `font-size: var(--font-size-sm)` (13px)
  - `color: var(--color-text-muted)`
  - `margin-bottom: var(--space-8)` (32px)
  - `display: flex; align-items: center; gap: var(--space-2)`
  - Content: `by {currentPost.author} · {formatted date}`
  - A decorative separator `<span aria-hidden="true">·</span>` rendered between author and date

  **Article divider:**
  - `<hr className="article-divider">`
  - `border: none; border-top: 1px solid var(--color-border)`
  - `margin: 0 0 var(--space-8) 0` (32px below)

  **Body text:**
  - `<p className="article-body">{currentPost.content}</p>`
  - `font-size: var(--font-size-md)` (18px)
  - `line-height: var(--line-height-relaxed)` (1.8)
  - `color: var(--color-text-soft)`
  - `margin: 0 0 var(--space-10) 0` (40px below)

  **Action row:**
  - `<div className="article-actions">`
  - `display: flex; gap: var(--space-3); align-items: center`

  **Edit button:**
  - `<button className="btn-outline" onClick={...}>Edit</button>`
  - `.btn-outline`: `background: none; border: 1.5px solid var(--color-border-strong); color: var(--color-text-soft); border-radius: var(--radius-pill); padding: var(--space-2) var(--space-5); font-family: var(--font-sans); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); cursor: pointer; transition: border-color var(--transition-base), color var(--transition-base), background var(--transition-base)`
  - On hover: `border-color: var(--color-accent); color: var(--color-accent); background: var(--color-accent-dim)`

  **Delete button:**
  - `<button className="btn-ghost-destructive" onClick={handleDelete}>Delete</button>`
  - `background: none; border: 1.5px solid transparent; color: var(--color-text-muted); border-radius: var(--radius-pill); padding: var(--space-2) var(--space-5); font-family: var(--font-sans); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); cursor: pointer; transition: border-color var(--transition-base), color var(--transition-base), background var(--transition-base)`
  - On hover: `border-color: var(--color-destructive); color: var(--color-destructive); background: var(--color-destructive-hover-bg)`

---

### 6. EditPostForm (CHANGED — `EditPostForm.tsx`)

**Props:** Same as current — `{ initialTitle, initialContent, author, createdAt, saving, onSave, onCancel }`. No changes to the TypeScript interface.

**Container:**
- `<form className="edit-form" onSubmit={handleSubmit}>`
- `animation: slide-down 200ms ease both`

**Field groups:** Same structure as PostForm modal fields (`.field-group`, label + input/textarea) but inline on the page. Reuse the same CSS classes from the token system.

**Title input:** Same styling as PostForm modal inputs.

**Content textarea:** Same styling as PostForm modal textarea, `min-height: 160px`.

**Meta row** (author + date, read-only, shown below textarea):
- `<div className="edit-meta">`
- `font-size: var(--font-size-sm); color: var(--color-text-muted); margin-top: var(--space-2)`
- `display: flex; gap: var(--space-3); align-items: center`
- `by {author} · {createdAt}`

**Action row:**
- `display: flex; gap: var(--space-3); margin-top: var(--space-6); align-items: center`

**Save button:**
- `<button type="submit" disabled={saving} className="btn-primary">`
- Same `.btn-primary` styles as the nav button.
- `padding: var(--space-2) var(--space-6)` (8px 24px)
- When `saving`: `opacity: 0.5; cursor: not-allowed; transform: none`

**Cancel button:**
- `<button type="button" disabled={saving} className="btn-outline" onClick={onCancel}>Cancel</button>`
- Same `.btn-outline` styles as the article Edit button.

---

## Layout Spec

### Global Reset (index.css)

```
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-regular);
  color: var(--color-text);
  background-color: var(--color-bg);
  line-height: var(--line-height-base);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  min-height: 100vh;
  background-color: var(--color-bg);
}
```

**Remove entirely:** the current `radial-gradient` on `body`, the current `#root` card styling (border, border-radius, width min, margin auto), and the current font imports.

### #root

```css
#root {
  min-height: 100vh;
}
```

No border. No border-radius. No max-width at the root level. Full viewport.

### App.tsx Structure

```
<div class="app">
  <TopNav onNewPost={() => setIsModalOpen(true)} />
  <PostForm
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    onSubmit={handleSubmit}
    disabled={submitting}
  />
  <main class="main-content">
    <Routes>
      <Route path="/" element={<HomePage posts={posts} onDelete={handleDelete} />} />
      <Route path="/posts/:id" element={<PostDetailPage />} />
    </Routes>
  </main>
</div>
```

**`.app`:**
```css
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
```

**`.main-content`:**
```css
.main-content {
  flex: 1;
  padding-top: 60px; /* exact height of fixed topnav */
}
```

### TopNav Container

The TopNav itself is `position: fixed; top: 0; left: 0; right: 0; z-index: 100; height: 60px`. The inner content wrapper inside TopNav:

```css
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}
```

### HomePage Layout

```css
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-10) var(--space-6);
}
```

(40px top, 24px sides)

**Page heading row** (optional, rendered inside HomePage above PostList):
- `<div class="page-header">` with `margin-bottom: var(--space-8)` (32px)
- `<h1 class="page-title">Latest Posts</h1>` — `font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 700; color: var(--color-text)`
- `<p class="page-subtitle">` — `color: var(--color-text-muted); font-size: var(--font-size-base)`; text: `"A collection of ideas, tutorials, and thoughts."`

**Error banner** (if `error` from parent):
- `<div class="status-banner status-error">{error}</div>`
- `background: var(--color-error-bg); color: var(--color-error-text); border-radius: var(--radius-md); padding: var(--space-3) var(--space-4); margin-bottom: var(--space-6); font-size: var(--font-size-sm)`

### PostDetail Page Layout

Max-width 680px, centered, as described in the PostDetailPage spec above.

### Responsive Breakpoints

All breakpoints use `@media (max-width: ...)` in `App.css`.

| Breakpoint | What changes |
|---|---|
| `max-width: 1024px` | `.post-grid` → `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` |
| `max-width: 640px` | `.post-grid` → `grid-template-columns: 1fr` (single column) |
| `max-width: 640px` | `.home-page` → `padding: var(--space-6) var(--space-4)` (24px top, 16px sides) |
| `max-width: 640px` | `.nav-inner` → `padding: 0 var(--space-4)` |
| `max-width: 640px` | `.detail-page` → `padding-left: var(--space-4); padding-right: var(--space-4)` |
| `max-width: 480px` | `.nav-logo` text reduces to just `◈ Blog` (already short, no truncation needed); "New Post" button `padding: var(--space-2) var(--space-3)` |

---

## Animation Spec

All animations are `@keyframes` defined in `index.css` and referenced in component CSS classes.

### Keyframes

**`card-reveal`** (PostCard entrance):
```css
@keyframes card-reveal {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
```
Applied on `.post-card` with `animation: card-reveal 320ms ease both`. Each card gets `animation-delay` staggered by index: `nth-child(1)` → `0ms`, `nth-child(2)` → `40ms`, `nth-child(3)` → `80ms`, `nth-child(4)` → `120ms`. Cap at 4 delays (beyond that use 160ms). Implement via inline style `animationDelay` on the `<li>` element in the JSX: `style={{ animationDelay: `${Math.min(index, 4) * 40}ms` }}`.

**`backdrop-in`** (Modal backdrop):
```css
@keyframes backdrop-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```
Applied on `.modal-backdrop` with `animation: backdrop-in 200ms ease both`.

**`modal-in`** (Modal dialog):
```css
@keyframes modal-in {
  from { opacity: 0; transform: scale(0.95) translateY(8px); }
  to   { opacity: 1; transform: scale(1)    translateY(0); }
}
```
Applied on `.modal-dialog` with `animation: modal-in 200ms ease both`.

**`article-in`** (Post detail article):
```css
@keyframes article-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```
Applied on `.post-article` with `animation: article-in 300ms ease both`.

**`slide-down`** (EditPostForm):
```css
@keyframes slide-down {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```
Applied on `.edit-form` with `animation: slide-down 200ms ease both`.

### Hover / Focus States (summary)

| Element | Hover | Focus-visible |
|---|---|---|
| PostCard | `translateY(-3px)`, `shadow-md`, `border-strong` | — |
| Card title link | `color: var(--color-accent)` | outline via browser default (don't suppress) |
| `.btn-primary` | `opacity: 0.92`, `translateY(-1px)`, `shadow-accent-focus` | `shadow-accent-focus` |
| `.btn-outline` | `border: accent`, `color: accent`, `bg: accent-dim` | same as hover |
| `.btn-ghost-destructive` | `border: destructive`, `color: destructive`, `bg: destructive-hover` | same as hover |
| `.btn-delete-card` | `color: destructive`, `bg: destructive-hover` | — |
| `input, textarea` | — | `border: accent`, `shadow-input-focus` |
| Back link | `color: text-soft` | browser default |
| Modal close `×` | `bg: border-strong`, `color: text` | same |

---

## API Contract

**Unchanged.** No backend modifications. `frontend/src/api/posts.ts` is owned by no slice and must not be modified.

The only architectural change is that `App.tsx` now imports and calls `createPost`, `listPosts`, and `deletePost` directly (state lifted from `HomePage`). `PostDetailPage` continues to call `getPost`, `updatePost`, `deletePost` independently. `api/posts.ts` stays identical.

### Modal open/close state

`isModalOpen: boolean` lives in `App.tsx` as `const [isModalOpen, setIsModalOpen] = useState(false)`.

`posts: Post[]`, `submitting: boolean`, and `createError: string | null` also lift from `HomePage` into `App.tsx`. The `handleSubmit` and `handleDelete` functions move to `App.tsx`. On successful create, `App.tsx` calls `setIsModalOpen(false)`. `HomePage` receives `posts` and `onDelete` as props.

---

## Slices

### Slice 1: `ui-overhaul-system`
**Branch:** `feat/ui-overhaul-system`

**Purpose:** Lay the design token foundation, rebuild App.tsx with topnav + modal architecture, and ship the PostForm as a modal. This slice makes the app functional with the new token system even before card styling lands.

**Files Owned (Slice 1 may only touch these files):**
- `frontend/src/index.css` — **full rewrite**: new Google Fonts import (Plus Jakarta Sans), all CSS custom properties on `:root`, global reset, all `@keyframes` definitions
- `frontend/src/App.css` — **full rewrite**: `.app`, `.main-content`, `.nav`, `.nav-inner`, `.nav-logo`, `.btn-primary`, `.btn-outline`, `.btn-ghost-destructive`, `.modal-backdrop`, `.modal-dialog`, `.modal-heading`, `.modal-close`, `.field-group`, form inputs/textareas shared styles, `.status-banner`, responsive breakpoints for nav
- `frontend/src/App.tsx` — **full rewrite**: lift `posts`, `submitting`, `createError` state, add `isModalOpen` state, render `<TopNav>`, render `<PostForm>` as modal overlay, pass `posts`+`onDelete` to `<HomePage>`, keep routes
- `frontend/src/components/TopNav.tsx` — **NEW FILE**: TopNav component (props: `onNewPost: () => void`)
- `frontend/src/components/PostForm.tsx` — **full rewrite**: new props (`isOpen`, `onClose`, `onSubmit`, `disabled`), modal structure with backdrop + dialog, Escape key handler, form fields, CSS classes matching the design spec
- `frontend/src/pages/HomePage.tsx` — **update props**: remove local `posts`/`submitting`/`error`/`handleSubmit` state; receive `posts: Post[]` and `onDelete: (id: number) => void` as props; remove `PostForm` import and usage; render a simple page wrapper with page header and `<PostList>` — but PostList styling is Slice 2's concern, so Slice 1's HomePage just renders `<PostList posts={posts} onDelete={onDelete} />` with its existing (unstyled) implementation

**Files Off-Limits (Slice 1 must NOT modify):**
- `frontend/src/components/PostList.tsx`
- `frontend/src/components/EditPostForm.tsx`
- `frontend/src/pages/PostDetailPage.tsx`
- `frontend/src/api/posts.ts`

**Acceptance Criteria (Slice 1):**

1. **Token presence:** `:root` in `index.css` contains every token from the Design Token Table above; no hardcoded hex colors appear in `App.css` or `App.tsx` beyond what's defined in tokens.
2. **Font loading:** `Plus Jakarta Sans` is imported; `body` uses `var(--font-sans)`; Newsreader and Space Grotesk imports are removed.
3. **Dark background:** `body` and `#root` render against `#0d0f14`. The previous warm parchment gradients are gone.
4. **TopNav renders:** A fixed bar is visible at the top of every page (home and detail). It does not scroll away. It contains the `◈ Blog` logo (left) and `+ New Post` button (right).
5. **Modal trigger:** Clicking `+ New Post` opens the modal overlay. The backdrop and dialog are visible.
6. **Backdrop blur:** The backdrop has `backdrop-filter: blur(6px)` applied.
7. **Modal close — X button:** Clicking the `×` inside the dialog closes the modal.
8. **Modal close — backdrop click:** Clicking outside the dialog (on the backdrop) closes the modal.
9. **Modal close — Escape key:** Pressing `Escape` while the modal is open closes it.
10. **Form submit:** Filling all three fields (title, author, content) and clicking "Publish Post" calls the create API; on success the new post appears in the grid, the modal closes, and the form fields reset to empty.
11. **Form submit disabled state:** While `disabled={true}`, the submit button has `opacity: 0.5` and `cursor: not-allowed`.
12. **Modal animation:** Opening the modal triggers the `backdrop-in` and `modal-in` animations (opacity + scale).
13. **HomePage props:** `HomePage` no longer manages `posts` state or `handleSubmit`; it receives them as props from `App.tsx`.
14. **Responsive nav:** On viewports ≤ 640px, the nav inner padding reduces to `var(--space-4)`.
15. **All existing routes work:** `/` and `/posts/:id` still navigate correctly.

---

### Slice 2: `ui-overhaul-components`
**Branch:** `feat/ui-overhaul-components`

**Depends on:** Slice 1 merged. CSS tokens (`--color-*`, `--space-*`, `--radius-*`, etc.) are available globally.

**Purpose:** Polish the PostList into a card grid, restyle the PostDetailPage as an article, and polish EditPostForm.

**Files Owned (Slice 2 may only touch these files):**
- `frontend/src/components/PostList.tsx` — **full rewrite**: grid container, PostCard internal component with accent bar, card title link, snippet (line-clamp), author chip, date formatting, delete button — all per spec
- `frontend/src/pages/PostDetailPage.tsx` — **full rewrite**: `.detail-page` wrapper, back link, loading/error states, article view (title, meta, divider, body, action row), edit mode toggle with `slide-down` animation
- `frontend/src/components/EditPostForm.tsx` — **full rewrite**: `.edit-form` with `slide-down` animation, field groups matching modal style, meta row, save + cancel buttons
- `frontend/src/App.css` — **append only** (do not remove existing rules): add `.home-page`, `.page-header`, `.page-title`, `.page-subtitle`, `.post-grid`, `.post-card`, `.card-title`, `.card-snippet`, `.author-chip`, `.card-date`, `.btn-delete-card`, `.detail-page`, `.back-link`, `.article-title`, `.article-meta`, `.article-divider`, `.article-body`, `.article-actions`, `.edit-form`, `.edit-meta`, `.state-message`, `.state-error`, and responsive grid breakpoints — all using design tokens only.

**Files Off-Limits (Slice 2 must NOT modify):**
- `frontend/src/index.css`
- `frontend/src/App.tsx`
- `frontend/src/components/TopNav.tsx`
- `frontend/src/components/PostForm.tsx`
- `frontend/src/pages/HomePage.tsx`
- `frontend/src/api/posts.ts`

**Acceptance Criteria (Slice 2):**

1. **Card grid — desktop:** On viewports ≥ 1024px, posts render in a multi-column grid with `auto-fill` and `minmax(300px, 1fr)` columns.
2. **Card grid — mobile:** On viewports ≤ 640px, posts render in a single column.
3. **Card gap:** Cards have `24px` gap between them (matches `--space-6`).
4. **Card accent bar:** Each card has a 3px violet top bar (gradient from `--color-accent-gradient`).
5. **Card hover lift:** Hovering a card produces `translateY(-3px)` and `box-shadow: var(--shadow-md)` with a `0.2s ease` transition.
6. **Card title hover:** Hovering the card title link changes its color to `var(--color-accent)`.
7. **Card snippet:** Post content is clamped to 2 lines using `-webkit-line-clamp: 2`.
8. **Author chip:** Each card shows the author name in a small violet chip.
9. **Date formatting:** Dates are formatted as `MMM D, YYYY` (e.g. "Jan 12, 2026") using `toLocaleDateString`.
10. **Card entrance animation:** Cards animate in with `card-reveal` (opacity 0→1, translateY 10px→0) with staggered delays (40ms × index, max 4 steps).
11. **Empty state:** When no posts exist, a centered `.empty-state` message appears with muted text.
12. **Detail page max-width:** The `.detail-page` wrapper is `max-width: 680px; margin: 0 auto`.
13. **Detail page padding-top:** The wrapper has `padding-top: calc(60px + var(--space-10))` to clear the fixed nav.
14. **Article title:** The article `<h1>` uses `var(--font-size-2xl)`, weight 700, `letter-spacing: -0.02em`.
15. **Article body font:** Body text is `var(--font-size-md)` (18px) at `line-height: var(--line-height-relaxed)` (1.8).
16. **Back link styled:** The back link shows muted color and gains `color: var(--color-text-soft)` on hover.
17. **Edit button outline style:** The Edit button in the article view uses `.btn-outline` — transparent background, accent border on hover.
18. **Delete button ghost-destructive:** The Delete button uses `.btn-ghost-destructive` — no border by default, red on hover.
19. **EditPostForm slide-in:** When `isEditing` becomes `true`, the `<EditPostForm>` renders with `animation: slide-down 200ms ease both`.
20. **EditPostForm field styling:** Title input and Content textarea in the edit form use the same `.field-group` token-based styles as the modal form.
21. **Save/Cancel buttons:** Save uses `.btn-primary`, Cancel uses `.btn-outline`; both are `disabled` when `saving` is true.
22. **No hardcoded colors:** Neither `PostList.tsx`, `PostDetailPage.tsx`, nor `EditPostForm.tsx` contain any hardcoded hex color values — all colors come from CSS token classes.

---

## Notes for Implementers

### CSS architecture pattern
Slice 1 writes all global tokens and resets into `index.css`. Utility button classes (`.btn-primary`, `.btn-outline`, `.btn-ghost-destructive`) are in `App.css` because they are shared across slices. Slice 2 appends its component-specific classes to `App.css` without removing anything Slice 1 wrote. Both slices use class names — no CSS Modules, no Tailwind, no styled-components — matching the existing project pattern.

### PostForm state flow
`App.tsx` is the single source of truth for `isModalOpen`. `PostForm` is purely controlled: it opens/closes based on `isOpen` prop. When the user submits, `PostForm` calls `props.onSubmit(data)` and resets its own field state. `App.tsx`'s `handleSubmit` calls the API and, on success, calls `setIsModalOpen(false)`. This means the modal stays open if the API call fails, showing an error state if needed (error handling: `App.tsx` sets `createError` state; `PostForm` does not need to show errors — it's the parent's responsibility to show the error banner on the page).

### Imports between slices
Slice 2 imports nothing new from Slice 1's files — it only uses CSS class names from `App.css` (e.g., `className="btn-primary"`). TypeScript component interfaces do not change between slices.

### No test files specified
The current project has no frontend test infrastructure. Acceptance criteria are validated by visual/functional review in the browser, not automated tests.
