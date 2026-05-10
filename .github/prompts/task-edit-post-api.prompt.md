# Task: edit-post-api (Backend Tests)

**Design artifact:** [design-edit-post.prompt.md](./design-edit-post.prompt.md)  
**Implementation plan:** [../../docs/features/edit-post-plan.md](../../docs/features/edit-post-plan.md)

---

## Your Role

You are implementing the **backend test slice** for the edit-post feature.

The backend update endpoint already exists. Your job is to add tests that lock its behavior so the frontend can rely on it safely.

---

## Slice Plan (copy from the implementation plan)

**Ordered steps:**
1. Open `backend/tests/test_posts.py`
2. Add focused tests for the existing `PUT /api/posts/{id}` endpoint
3. Cover both full update assertions and partial update preservation
4. Run `PYTHONPATH=. uv run pytest -q`
5. Run `uv run ruff check .`
6. Commit only the test file

**Files owned:**
- `backend/tests/test_posts.py`

**Files off-limits:**
- `backend/app/routers/posts.py`
- `backend/app/services/post_service.py`
- `backend/app/models/post.py`
- `backend/app/schemas/post.py`
- everything under `frontend/`

**Acceptance criteria:**
1. `PUT /api/posts/{id}` for an existing post returns `200`
2. Response body contains updated `title` and `content`
3. `author`, `id`, and `created_at` are unchanged after update
4. Partial update with only one field still succeeds and preserves untouched fields
5. `PUT /api/posts/99999` returns `404`
6. Missing post response body is `{"detail": "Post not found"}`
7. All existing tests continue to pass

---

## Technical decisions you must preserve

- Keep the existing `PUT /api/posts/{id}` contract; do not change it to `PATCH`
- The backend contract supports partial update already; tests must verify that behavior
- `author`, `created_at`, and `id` are not editable through this feature
- Do not change backend application code unless you discover a real defect in existing update behavior

---

## Test coverage to add

Add tests that verify:

1. Full update of an existing post:
   - create a post
   - `PUT /api/posts/{id}` with updated `title` and `content`
   - assert `200`
   - assert response body contains updated fields
   - assert `author`, `id`, and `created_at` are unchanged

2. Partial update behavior:
   - create a post
   - `PUT /api/posts/{id}` with only `title`
   - assert `200`
   - assert `title` changed
   - assert `content` and `author` are preserved

3. Missing post:
   - `PUT /api/posts/99999` with valid body
   - assert `404`
   - assert JSON body equals `{"detail": "Post not found"}`

Follow the existing test style in `backend/tests/test_posts.py`.

---

## Validation

Run from this worktree:

```bash
cd /home/rkadmin/multi-agentic-loop-lab-edit-post-api/backend
PYTHONPATH=. uv run pytest -q
uv run ruff check .
```

## Commit

```bash
cd /home/rkadmin/multi-agentic-loop-lab-edit-post-api
git add backend/tests/test_posts.py
git commit -m "test: add edit post endpoint coverage

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```
