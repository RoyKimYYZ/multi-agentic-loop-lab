---
description: "Template for a feature design artifact. Produced by the Designer agent. Read by Implementer agents and the Orchestrator."
name: "Feature Design Template"
agent: "ask"
---
# Design: {Feature Name}

## Summary
{One sentence: what does this feature let the user do?}

## Data Model
{New fields on an existing model, or a new model entirely. Keep it flat.}

```python
# Example: new Comment model
class Comment(BaseModel):
    id: int
    post_id: int
    content: str
    author: str
    created_at: datetime
```

## API Contract
{Every new endpoint. This is the shared contract between backend and frontend slice agents.}

| Method | Path | Request Body | Response |
|--------|------|-------------|----------|
| GET | /api/posts/{id}/comments | — | `list[Comment]` |
| POST | /api/posts/{id}/comments | `CommentCreate` | `Comment` |

Request/response schemas:
```python
class CommentCreate(BaseModel):
    content: str
    author: str
```

## Business Logic
{Service layer functions. Keep signatures simple.}

```python
def list_comments(post_id: int) -> list[Comment]: ...
def create_comment(post_id: int, data: CommentCreate) -> Comment: ...
```

## UI
{Components needed, their props, and what API calls they make.}

- `CommentList` — receives `postId: number`, fetches and renders comments
- `CommentForm` — receives `postId: number`, `onSubmit: () => void`, posts new comment

## Slices

### Slice 1: {slug} (e.g. comments-api)
- **Branch**: `feat/{slug}`
- **Worktree**: `../{repo}-{slug}/`
- **Owns**:
  - `backend/app/models/{model}.py`
  - `backend/app/schemas/{schema}.py`
  - `backend/app/services/{service}.py`
  - `backend/app/routers/{router}.py`
  - `backend/tests/test_{feature}.py`
- **Acceptance criteria**:
  - `GET /api/posts/1/comments` returns `[]`
  - `POST /api/posts/1/comments` returns 201 with the new comment
  - All tests pass, ruff clean

### Slice 2: {slug} (e.g. comments-ui)
- **Branch**: `feat/{slug}`
- **Worktree**: `../{repo}-{slug}/`
- **Owns**:
  - `frontend/src/api/{feature}.ts`
  - `frontend/src/components/{Component}.tsx`
- **Acceptance criteria**:
  - Component renders a list of comments fetched from the API
  - Form submits a new comment and refreshes the list
  - `npm run build` passes
