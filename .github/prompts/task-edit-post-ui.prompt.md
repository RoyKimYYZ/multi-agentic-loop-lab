# Task: edit-post-ui (Frontend)

**Design artifact:** [design-edit-post.prompt.md](./design-edit-post.prompt.md)  
**Implementation plan:** [../../docs/features/edit-post-plan.md](../../docs/features/edit-post-plan.md)

---

## Your Role

You are implementing the **frontend slice** for the edit-post feature.

This feature adds inline editing to the post detail page only. The backend update endpoint already exists, so your job is to wire the API client and detail-page UI without changing the backend contract.

---

## Slice Plan (copy from the implementation plan)

**Ordered steps:**
1. Add `PostUpdate` type and `updatePost(id, data)` to `frontend/src/api/posts.ts`
2. Create `frontend/src/components/EditPostForm.tsx`
3. Update `frontend/src/pages/PostDetailPage.tsx` to support view/edit mode toggle and save flow
4. Keep delete behavior available only outside edit mode
5. Run `npm run build`
6. Run `npm run lint`
7. Commit only owned frontend files

**Files owned:**
- `frontend/src/api/posts.ts`
- `frontend/src/components/EditPostForm.tsx`
- `frontend/src/pages/PostDetailPage.tsx`

**Files off-limits:**
- `frontend/src/App.tsx`
- `frontend/src/pages/HomePage.tsx`
- `frontend/src/components/PostList.tsx`
- `frontend/src/components/PostForm.tsx`
- everything under `backend/`

**Acceptance criteria:**
1. `PostDetailPage` shows an `Edit` button when a post is loaded
2. Clicking `Edit` switches the page into inline edit mode on the same URL
3. Edit mode shows prefilled `title` and `content`
4. Edit mode shows `author` and `created_at` as read-only text
5. Clicking `Save` sends `PUT /api/posts/{id}` with only `title` and `content`
6. Successful save stays on `/posts/{id}`
7. Successful save exits edit mode and shows updated content immediately from the `PUT` response
8. No GET refetch happens after a successful save
9. Clicking `Cancel` exits edit mode with no API call
10. Save failure shows exactly `Failed to update post.`
11. Save failure keeps the form open with the user's typed values intact
12. There is still no edit button on the home page list
13. Existing delete behavior remains unchanged outside edit mode

---

## Fixed decisions you must preserve

- Edit lives on `PostDetailPage` only
- Edit is inline on the same route, not a separate page
- Editable fields are `title` and `content` only
- Do not send `author`, `id`, or `created_at` in the update payload
- Keep the existing `PUT` contract; do not introduce `PATCH`
- On success: stay on the same page, exit edit mode, and update local state from the `PUT` response
- No GET refetch after save
- Error message must be exactly `Failed to update post.`
- While edit mode is open, do not render the Delete button

---

## UI spec

Create a new component:

### `frontend/src/components/EditPostForm.tsx`

Props:
- `initialTitle: string`
- `initialContent: string`
- `author: string`
- `createdAt: string`
- `saving: boolean`
- `onSave: (data: PostUpdate) => void | Promise<void>`
- `onCancel: () => void`

Render:
- title input, prefilled
- content textarea, prefilled
- read-only `by {author}`
- read-only `{createdAt}`
- `Save` button
- `Cancel` button

Behavior:
- local controlled state for `title` and `content`
- `Save` submits `{ title, content }`
- `Save` and `Cancel` disabled while `saving`
- never auto-clear fields

### `frontend/src/pages/PostDetailPage.tsx`

Add:
- `isEditing` state
- `saving` state
- `handleSave`
- `Edit` button in view mode

View mode:
- show existing article
- show `Edit`
- show existing `Delete`

Edit mode:
- keep back link
- show page-level error if present
- render `EditPostForm`
- hide static article
- hide Delete button

Cancel:
- exits edit mode
- no API call

Save success:
- call `updatePost(Number(id), { title, content })`
- set local `post` from response
- exit edit mode
- stay on `/posts/{id}`

Save failure:
- show `Failed to update post.`
- keep form open with typed values intact

---

## Validation

Run from this worktree:

```bash
cd /home/rkadmin/parallel-agent-edit-post-ui/frontend
npm run build
npm run lint
```

## Commit

```bash
cd /home/rkadmin/parallel-agent-edit-post-ui
git add frontend/src/api/posts.ts frontend/src/components/EditPostForm.tsx frontend/src/pages/PostDetailPage.tsx
git commit -m "feat: add inline edit flow on post detail page

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```
