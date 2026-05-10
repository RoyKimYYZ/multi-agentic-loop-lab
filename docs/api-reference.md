# API Reference

Base URL: `http://localhost:8000/api/posts`

Interactive docs (Swagger UI): **http://localhost:8000/docs**

---

## Endpoints

### List Posts

```
GET /api/posts/
```

Returns all posts in insertion order.

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "title": "Hello world",
    "content": "Post body text",
    "author": "Roy",
    "created_at": "2026-05-09T20:00:00"
  }
]
```

---

### Get Post

```
GET /api/posts/{id}
```

**Path parameter:** `id` — integer post ID

**Response `200 OK`:** single Post object (see shape above)

**Response `404 Not Found`:**
```json
{ "detail": "Post not found" }
```

---

### Create Post

```
POST /api/posts/
```

**Request body:**
```json
{
  "title": "string",
  "content": "string",
  "author": "string"
}
```

All three fields are required.

**Response `201 Created`:** the newly created Post object (with assigned `id` and `created_at`)

---

### Update Post

```
PUT /api/posts/{id}
```

**Path parameter:** `id` — integer post ID

**Request body** (all fields optional):
```json
{
  "title": "string",
  "content": "string",
  "author": "string"
}
```

Only provided fields are updated. Omitted fields are unchanged.

**Response `200 OK`:** updated Post object

**Response `404 Not Found`:**
```json
{ "detail": "Post not found" }
```

---

### Delete Post

```
DELETE /api/posts/{id}
```

**Path parameter:** `id` — integer post ID

**Response `204 No Content`:** empty body (post was deleted)

**Response `404 Not Found`:**
```json
{ "detail": "Post not found" }
```

> ⚠️ **Frontend note:** Because the 204 response has no body, the API client function must NOT call `res.json()` on the response.

---

## Data Shapes

### Post (response model)

| Field | Type | Notes |
|---|---|---|
| `id` | `integer` | Auto-assigned, starts at 1 |
| `title` | `string` | Required, no length limit |
| `content` | `string` | Required, no length limit |
| `author` | `string` | Required |
| `created_at` | `datetime` (ISO 8601) | Set at creation time, never updated |

### PostCreate (request body for POST)

| Field | Type | Required |
|---|---|---|
| `title` | `string` | ✅ |
| `content` | `string` | ✅ |
| `author` | `string` | ✅ |

### PostUpdate (request body for PUT)

| Field | Type | Required |
|---|---|---|
| `title` | `string` | ❌ optional |
| `content` | `string` | ❌ optional |
| `author` | `string` | ❌ optional |

---

## Health Check

```
GET /api/posts/
```

A 200 response from the list endpoint confirms the backend is running. There is no separate `/health` route.
