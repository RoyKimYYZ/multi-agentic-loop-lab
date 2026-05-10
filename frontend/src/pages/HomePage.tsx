import { useEffect, useState } from 'react'
import { createPost, deletePost, listPosts, type Post, type PostCreate } from '../api/posts'
import { PostForm } from '../components/PostForm'
import { PostList } from '../components/PostList'

export function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadPosts() {
    listPosts().then(setPosts).catch(console.error)
  }

  useEffect(() => {
    loadPosts()
  }, [])

  async function handleSubmit(data: PostCreate) {
    setSubmitting(true)
    setError(null)
    try {
      await createPost(data)
      await loadPosts()
    } catch {
      setError('Failed to create post.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    try {
      await deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch {
      setError("Failed to delete post.");
    }
  }

  return (
    <div>
      <PostForm onSubmit={handleSubmit} disabled={submitting} />
      {error && <p>{error}</p>}
      <PostList posts={posts} onDelete={handleDelete} />
    </div>
  )
}
