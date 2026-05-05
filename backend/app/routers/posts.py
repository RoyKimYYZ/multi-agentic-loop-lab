from fastapi import APIRouter, HTTPException, status
from app.models.post import Post
from app.schemas.post import PostCreate, PostUpdate
from app.services import post_service

router = APIRouter()


@router.get("/", response_model=list[Post])
def list_posts():
    return post_service.list_posts()


@router.get("/{post_id}", response_model=Post)
def get_post(post_id: int):
    post = post_service.get_post(post_id)
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return post


@router.post("/", response_model=Post, status_code=status.HTTP_201_CREATED)
def create_post(data: PostCreate):
    return post_service.create_post(data)


@router.put("/{post_id}", response_model=Post)
def update_post(post_id: int, data: PostUpdate):
    post = post_service.update_post(post_id, data)
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: int):
    if not post_service.delete_post(post_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
