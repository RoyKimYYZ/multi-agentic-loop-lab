# Task: delete-post-api (Backend Tests)

**Design artifact:** [design-delete-post.prompt.md](./design-delete-post.prompt.md)

---

## Your Role

You are implementing the **backend test slice** for the delete-post feature.

The `DELETE /api/posts/{post_id}` endpoint and `delete_post` service function are **already implemented and correct** in the codebase. Your only job is to write test coverage for them.

---

## Implementation Steps (follow in order)

1. Open `backend/tests/test_posts.py`
2. Add four new test functions after the existing tests. Do NOT modify existing tests.
3. Run `PYTHONPATH=. uv run pytest -q` from `backend/` to confirm all tests pass.
4. Run `uv run ruff check .` from `backend/` — fix any lint errors you introduced (not pre-existing ones).
5. Commit your changes with a clear message.

---

## Files You Own

**Modify only:**
- `backend/tests/test_posts.py` — add four new test cases

## Files Off-Limits (do NOT touch)

- `backend/app/routers/posts.py`
- `backend/app/services/post_service.py`
- `backend/app/models/post.py`
- `backend/app/schemas/post.py`
- Everything under `frontend/`

---

## API Contract (for reference)

```
DELETE /api/posts/{post_id}

Path parameter:
  post_id   integer   The ID of the post to delete

Request body: none

Success:
  HTTP 204 No Content  (empty body)

Error:
  HTTP 404 Not Found   { "detail": "Post not found" }
```

---

## Test Cases to Write

Write exactly these four test functions:

### 1. `test_delete_post_returns_204`
- Create a post via `POST /api/posts/`
- `DELETE /api/posts/{id}` → assert response status is **204**
- Assert response body is empty (no JSON)

### 2. `test_delete_post_not_found_returns_404`
- `DELETE /api/posts/99999` (an ID that does not exist) → assert status is **404**
- Assert response JSON is `{"detail": "Post not found"}`

### 3. `test_delete_post_removes_from_get`
- Create a post via `POST /api/posts/`
- `DELETE /api/posts/{id}` → 204
- `GET /api/posts/{id}` → assert status is **404**

### 4. `test_delete_post_not_in_list`
- Create a post via `POST /api/posts/`
- `DELETE /api/posts/{id}` → 204
- `GET /api/posts/` → assert the deleted post's ID is **not** present in the response list

---

## Acceptance Criteria (your slice is done when all pass)

1. `DELETE /api/posts/{id}` with valid ID → HTTP **204**, empty body
2. `DELETE /api/posts/{id}` with missing ID → HTTP **404**, `{"detail": "Post not found"}`
3. After delete, `GET /api/posts/{id}` → **404**
4. After delete, deleted post not in `GET /api/posts/` list
5. All pre-existing tests (`test_health`, `test_list_posts`, `test_create_and_get_post`) still pass

Run this to verify:
```bash
cd /home/rkadmin/multi-agentic-loop-lab-delete-post-api/backend
PYTHONPATH=. uv run pytest -q
```

---

## Worktree Path

```
/home/rkadmin/multi-agentic-loop-lab-delete-post-api
```

Branch: `feat/delete-post-api`
