from datetime import datetime, timezone
from app.models.post import Post
from app.schemas.post import PostCreate, PostUpdate

# In-memory store — replace with a real DB later
_db: dict[int, Post] = {
    1: Post(
        id=1,
        title="Hello, Parallel Agents!",
        content="This blog is built to learn accelerated development with parallel AI agents.",
        author="coach",
        created_at=datetime(2026, 1, 1, tzinfo=timezone.utc),
    )
}
_counter = 2


def list_posts() -> list[Post]:
    return sorted(_db.values(), key=lambda p: p.created_at, reverse=True)


def get_post(post_id: int) -> Post | None:
    return _db.get(post_id)


def create_post(data: PostCreate) -> Post:
    global _counter
    post = Post(
        id=_counter,
        title=data.title,
        content=data.content,
        author=data.author,
        created_at=datetime.now(tz=timezone.utc),
    )
    _db[_counter] = post
    _counter += 1
    return post


def update_post(post_id: int, data: PostUpdate) -> Post | None:
    post = _db.get(post_id)
    if post is None:
        return None
    updated = post.model_copy(update=data.model_dump(exclude_none=True))
    _db[post_id] = updated
    return updated


def delete_post(post_id: int) -> bool:
    if post_id not in _db:
        return False
    del _db[post_id]
    return True
