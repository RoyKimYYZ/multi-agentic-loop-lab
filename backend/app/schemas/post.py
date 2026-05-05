from pydantic import BaseModel


class PostCreate(BaseModel):
    title: str
    content: str
    author: str


class PostUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
