# Design: Edit Post

## Summary
Allow a user to edit an existing post's title and content from the post detail page, then stay on that page and see the updated post immediately.

## Diagrams
- [UI Wireframe](./diagrams/design-edit-post-wireframe.svg)
- [Sequence Diagram](./diagrams/design-edit-post-sequence.svg)

## Data Model

### Existing backend support
The backend already includes update support:
- `PostUpdate` schema in `backend/app/schemas/post.py`
- `update_post(post_id, data)` service in `backend/app/services/post_service.py`
- `PUT /api/posts/{post_id}` router in `backend/app/routers/posts.py`

### Impact
No new model is needed.

The existing data remains:
- `Post`
  - `id: int`
  - `title: str`
  - `content: str`
  - `author: str`
  - `created_at: datetime`

The existing in-memory store remains:
- `_db: dict[int, Post]`

### Fixed edit scope
Edit supports:
- `title`
- `content`

Edit does **not** support:
- `author`
- `created_at`
- `id`

### Contract resolution
The current backend uses `PUT` with an optional-field schema (`PostUpdate`), so the effective contract is **partial update via PUT**. That is already implemented and this feature will preserve it exactly.

To avoid drift:
- backend must **not** be changed to `PATCH`
- frontend must **not** send `author`
- frontend UI will still send **both** editable fields (`title` and `content`) on save

## API Contract

### Existing endpoint used by this feature
**Method:** `PUT`  
**Path:** `/api/posts/{post_id}`

### Path params
- `post_id: integer`

### Request body
JSON object:
- `title?: string`
- `content?: string`

Frontend contract for this feature:
- the edit form must send both:
  - `title`
  - `content`
- it must not send:
  - `author`
  - `created_at`
  - `id`

Example shape:
```json
{
  "title": "Updated title",
  "content": "Updated content"
}
```

### Success response
**200 OK**

Response body:
```json
{
  "id": 1,
  "title": "Updated title",
  "content": "Updated content",
  "author": "coach",
  "created_at": "2026-01-01T00:00:00Z"
}
```

### Error responses
**404 Not Found**
```json
{ "detail": "Post not found" }
```

**422 Unprocessable Entity**
- FastAPI default validation response for malformed request bodies / wrong types

### Related existing endpoint
The detail page continues to use:

**GET** `/api/posts/{post_id}`
- to load the post before editing

## Business Logic

### Backend
No backend application-code changes are required.

Existing function signatures already in the repo:
- `get_post(post_id: int) -> Post | None`
- `update_post(post_id: int, data: PostUpdate) -> Post | None`

Existing update behavior already implemented:
- load post from `_db`
- if missing: return `None`
- merge only provided fields
- preserve all other fields
- save updated `Post` back into `_db`
- return updated `Post`

### Backend work required
Backend slice should add tests only, to lock the current behavior.

Tests must verify:
1. updating an existing post returns `200`
2. updated `title` and `content` are persisted
3. `author`, `id`, and `created_at` are unchanged after update
4. partial PUT is supported by the backend contract (for example, only `title`)
5. updating a missing post returns `404` with `{"detail": "Post not found"}`

### Frontend
Add a new API client contract in `frontend/src/api/posts.ts`:
- `PostUpdate`
  - `title?: string`
  - `content?: string`
- `updatePost(id: number, data: PostUpdate): Promise<Post>`

### Frontend detail-page behavior
`PostDetailPage` owns:
- existing fetch of the post
- local edit/view toggle
- save handler
- save error display

Required page state:
- `post: Post | null`
- `error: string | null`
- `isEditing: boolean`
- `saving: boolean`

Save flow:
1. user clicks `Edit`
2. page switches into edit mode on the same URL
3. user changes title/content
4. user clicks `Save`
5. page calls `updatePost(Number(id), { title, content })`
6. on success:
   - replace local `post` with the response body
   - set `isEditing = false`
   - stay on `/posts/{id}`
   - do not refetch with GET
   - do not navigate
7. on failure:
   - show `Failed to update post.`
   - keep `isEditing = true`
   - keep typed form values intact

Cancel flow:
1. user clicks `Cancel`
2. no API call is made
3. page exits edit mode
4. original loaded post view is shown again

## UI

### Fixed UX decisions
These are mandatory.

| Decision | Fixed choice |
|---|---|
| Edit UI location | **Post detail page only** |
| Edit access from list page | **Not allowed**; no edit button in `PostList` or `HomePage` |
| Edit layout | **Inline edit mode on `PostDetailPage`**, not a separate route/page |
| Editable fields | **title** and **content** only |
| Non-editable fields | `author`, `created_at`, `id` |
| HTTP contract | Keep existing **PUT** partial-update backend contract |
| UI request payload | Frontend sends both `title` and `content` on save |
| Success behavior | Stay on detail page, exit edit mode, update local post from PUT response |
| Refetch after save | **No refetch** |
| Navigation after save | **No navigation** |
| Validation | No field-level validation beyond existing browser behavior |
| Save error message | Exactly `Failed to update post.` |
| Error placement | Same page-level error area used by `PostDetailPage` |
| Delete during edit mode | Do not show Delete button while edit form is visible |

### Component: `EditPostForm`
**File:** `frontend/src/components/EditPostForm.tsx`  
**New component**

Props:
- `initialTitle: string`
- `initialContent: string`
- `author: string`
- `createdAt: string`
- `saving: boolean`
- `onSave: (data: PostUpdate) => void | Promise<void>`
- `onCancel: () => void`

Responsibilities:
- hold local controlled state for `title` and `content`
- initialize those fields from props
- render the edit form
- call `onSave({ title, content })`
- never clear fields automatically on submit
- render `author` and `createdAt` as read-only text

Exact rendering:
- one text input for title
  - placeholder: `Title`
  - prefilled from current post title
- one textarea for content
  - placeholder: `Content`
  - prefilled from current post content
- read-only metadata below fields:
  - `by {author}`
  - `{createdAt}`
- two buttons:
  - `Save`
  - `Cancel`

Button behavior:
- `Save`
  - `type="submit"`
  - disabled while `saving === true`
- `Cancel`
  - `type="button"`
  - disabled while `saving === true`

### Page: `PostDetailPage`
**File:** `frontend/src/pages/PostDetailPage.tsx`

View mode rendering (when `post` is loaded and `isEditing === false`):
- back link at top: `← Back to posts`
- page-level error message if `error` exists
- article showing:
  - title
  - content
  - author
  - created_at
- action row with:
  - `Edit`
  - existing `Delete`

Edit mode rendering (when `post` is loaded and `isEditing === true`):
- back link unchanged
- page-level error message if `error` exists
- render `EditPostForm`
- do not render the static article body
- do not render the Delete button

Loading/error behavior:
- keep existing load behavior:
  - loading text before fetch resolves
  - fetch failure shows existing error text
- save failure uses:
  - `Failed to update post.`

### Files unchanged by design
These files should remain unchanged for this feature:
- `frontend/src/pages/HomePage.tsx`
- `frontend/src/components/PostList.tsx`
- `frontend/src/components/PostForm.tsx`
- `frontend/src/App.tsx`

## Slices

## Dependency notes
The slices can run in parallel.

Reason:
- backend update support already exists on the main branch
- backend slice only adds tests
- frontend slice consumes an already-implemented endpoint
- file ownership does not overlap

The Orchestrator must preserve this:
- no slice may change the shared backend update contract
- no slice may expand editing to `author`

### Slice 1: edit-post-api
- **Branch:** `feat/edit-post-api`
- **Worktree:** `../parallel-agent-edit-post-api/`

**Owns:**
- `backend/tests/test_posts.py`

**Off-limits:**
- `backend/app/routers/posts.py`
- `backend/app/services/post_service.py`
- `backend/app/models/post.py`
- `backend/app/schemas/post.py`
- everything under `frontend/`

**Acceptance criteria:**
1. `PUT /api/posts/{id}` for an existing post returns `200`
2. response body contains updated `title` and `content`
3. `author`, `id`, and `created_at` are unchanged after update
4. a partial PUT body (for example only `title`) still succeeds and preserves untouched fields
5. `PUT /api/posts/99999` returns `404`
6. `PUT /api/posts/99999` returns `{"detail": "Post not found"}`
7. all existing tests continue to pass

### Slice 2: edit-post-ui
- **Branch:** `feat/edit-post-ui`
- **Worktree:** `../parallel-agent-edit-post-ui/`

**Owns:**
- `frontend/src/api/posts.ts`
- `frontend/src/components/EditPostForm.tsx`
- `frontend/src/pages/PostDetailPage.tsx`

**Off-limits:**
- `frontend/src/App.tsx`
- `frontend/src/pages/HomePage.tsx`
- `frontend/src/components/PostList.tsx`
- `frontend/src/components/PostForm.tsx`
- everything under `backend/`

**Acceptance criteria:**
1. `PostDetailPage` shows an `Edit` button when a post is loaded
2. clicking `Edit` switches the existing detail page into inline edit mode on the same URL
3. edit mode shows prefilled `title` and `content`
4. edit mode shows `author` and `created_at` as read-only text
5. clicking `Save` sends `PUT /api/posts/{id}` with only `title` and `content`
6. successful save keeps the user on `/posts/{id}`
7. successful save exits edit mode and shows updated content immediately from the PUT response
8. no extra GET refetch happens after a successful save
9. clicking `Cancel` exits edit mode without any API call
10. save failure shows exactly `Failed to update post.`
11. save failure keeps the form open with the user's typed values intact
12. there is still no edit button on the home page list
13. existing delete behavior on the detail page remains unchanged outside edit mode
