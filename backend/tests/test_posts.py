import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_health(client):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_list_posts(client):
    response = await client.get("/api/posts/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_create_and_get_post(client):
    payload = {"title": "Test Post", "content": "Hello world", "author": "tester"}
    create_resp = await client.post("/api/posts/", json=payload)
    assert create_resp.status_code == 201
    post_id = create_resp.json()["id"]

    get_resp = await client.get(f"/api/posts/{post_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["title"] == "Test Post"


@pytest.mark.asyncio
async def test_delete_post_returns_204(client):
    payload = {"title": "Delete Me", "content": "To be deleted", "author": "tester"}
    create_resp = await client.post("/api/posts/", json=payload)
    assert create_resp.status_code == 201
    post_id = create_resp.json()["id"]

    delete_resp = await client.delete(f"/api/posts/{post_id}")
    assert delete_resp.status_code == 204
    assert delete_resp.content == b""


@pytest.mark.asyncio
async def test_delete_post_not_found_returns_404(client):
    delete_resp = await client.delete("/api/posts/99999")
    assert delete_resp.status_code == 404
    assert delete_resp.json() == {"detail": "Post not found"}


@pytest.mark.asyncio
async def test_delete_post_removes_from_get(client):
    payload = {"title": "Gone Post", "content": "Will be gone", "author": "tester"}
    create_resp = await client.post("/api/posts/", json=payload)
    assert create_resp.status_code == 201
    post_id = create_resp.json()["id"]

    delete_resp = await client.delete(f"/api/posts/{post_id}")
    assert delete_resp.status_code == 204

    get_resp = await client.get(f"/api/posts/{post_id}")
    assert get_resp.status_code == 404


@pytest.mark.asyncio
async def test_delete_post_not_in_list(client):
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
