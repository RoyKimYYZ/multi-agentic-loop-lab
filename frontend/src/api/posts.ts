export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
}

export interface PostCreate {
  title: string;
  content: string;
  author: string;
}

export interface PostUpdate {
  title?: string;
  content?: string;
}

const BASE = "http://localhost:8000/api/posts";

export async function listPosts(): Promise<Post[]> {
  const res = await fetch(`${BASE}/`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function getPost(id: number): Promise<Post> {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error("Post not found");
  return res.json();
}

export async function createPost(data: PostCreate): Promise<Post> {
  const res = await fetch(`${BASE}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

export async function updatePost(id: number, data: PostUpdate): Promise<Post> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update post");
  return res.json();
}

export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete post");
  // No res.json() — 204 has no body
}
