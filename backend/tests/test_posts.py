import pytest
from httpx import AsyncClient, ASGITransport
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
