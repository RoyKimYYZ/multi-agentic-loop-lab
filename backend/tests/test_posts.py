from collections.abc import AsyncIterator
from importlib import import_module
from typing import Any, cast

import pytest
from httpx import ASGITransport, AsyncClient

app = cast(Any, import_module("app.main").app)


@pytest.fixture
async def client() -> AsyncIterator[AsyncClient]:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_health(client: AsyncClient) -> None:
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_list_posts(client: AsyncClient) -> None:
    response = await client.get("/api/posts/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_create_and_get_post(client: AsyncClient) -> None:
    payload = {"title": "Test Post", "content": "Hello world", "author": "tester"}
    create_resp = await client.post("/api/posts/", json=payload)
    assert create_resp.status_code == 201
    post_id = create_resp.json()["id"]

    get_resp = await client.get(f"/api/posts/{post_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["title"] == "Test Post"


@pytest.mark.asyncio
async def test_delete_post_returns_204(client: AsyncClient) -> None:
    payload = {"title": "Delete Me", "content": "To be deleted", "author": "tester"}
    create_resp = await client.post("/api/posts/", json=payload)
    assert create_resp.status_code == 201
    post_id = create_resp.json()["id"]

    delete_resp = await client.delete(f"/api/posts/{post_id}")
    assert delete_resp.status_code == 204
    assert delete_resp.content == b""


@pytest.mark.asyncio
async def test_delete_post_not_found_returns_404(client: AsyncClient) -> None:
    delete_resp = await client.delete("/api/posts/99999")
    assert delete_resp.status_code == 404
    assert delete_resp.json() == {"detail": "Post not found"}


@pytest.mark.asyncio
async def test_delete_post_removes_from_get(client: AsyncClient) -> None:
    payload = {"title": "Gone Post", "content": "Will be gone", "author": "tester"}
    create_resp = await client.post("/api/posts/", json=payload)
    assert create_resp.status_code == 201
    post_id = create_resp.json()["id"]

    delete_resp = await client.delete(f"/api/posts/{post_id}")
    assert delete_resp.status_code == 204

    get_resp = await client.get(f"/api/posts/{post_id}")
    assert get_resp.status_code == 404


@pytest.mark.asyncio
async def test_delete_post_not_in_list(client: AsyncClient) -> None:
    payload = {"title": "Unlisted Post", "content": "Should disappear", "author": "tester"}
    create_resp = await client.post("/api/posts/", json=payload)
    assert create_resp.status_code == 201
    post_id = create_resp.json()["id"]

    delete_resp = await client.delete(f"/api/posts/{post_id}")
    assert delete_resp.status_code == 204

    list_resp = await client.get("/api/posts/")
    assert list_resp.status_code == 200
    ids = [post["id"] for post in list_resp.json()]
    assert post_id not in ids


@pytest.mark.asyncio
async def test_update_post_returns_updated_fields_and_preserves_immutable_fields(
    client: AsyncClient,
) -> None:
    payload = {"title": "Original Title", "content": "Original content", "author": "tester"}
    create_resp = await client.post("/api/posts/", json=payload)
    assert create_resp.status_code == 201
    created_post = create_resp.json()
    post_id = created_post["id"]

    update_resp = await client.put(
        f"/api/posts/{post_id}",
        json={"title": "Updated Title", "content": "Updated content"},
    )
    assert update_resp.status_code == 200
    assert update_resp.json() == {
        "id": created_post["id"],
        "title": "Updated Title",
        "content": "Updated content",
        "author": created_post["author"],
        "created_at": created_post["created_at"],
    }


@pytest.mark.asyncio
async def test_update_post_supports_partial_put_and_preserves_untouched_fields(
    client: AsyncClient,
) -> None:
    payload = {"title": "Keep Content", "content": "Still here", "author": "tester"}
    create_resp = await client.post("/api/posts/", json=payload)
    assert create_resp.status_code == 201
    created_post = create_resp.json()
    post_id = created_post["id"]

    update_resp = await client.put(f"/api/posts/{post_id}", json={"title": "New Title Only"})
    assert update_resp.status_code == 200
    assert update_resp.json() == {
        "id": created_post["id"],
        "title": "New Title Only",
        "content": created_post["content"],
        "author": created_post["author"],
        "created_at": created_post["created_at"],
    }


@pytest.mark.asyncio
async def test_update_post_not_found_returns_404(client: AsyncClient) -> None:
    update_resp = await client.put("/api/posts/99999", json={"title": "Missing post"})
    assert update_resp.status_code == 404
    assert update_resp.json() == {"detail": "Post not found"}
