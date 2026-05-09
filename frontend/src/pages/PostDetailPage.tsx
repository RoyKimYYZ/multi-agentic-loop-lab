import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPost, type Post } from '../api/posts'

export function PostDetailPage() {
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getPost(Number(id))
      .then(setPost)
      .catch((err: Error) => setError(err.message))
  }, [id])

  return (
    <div>
      <Link to="/">← Back to posts</Link>
      {error && <p>{error}</p>}
      {!error && !post && <p>Loading...</p>}
      {post && (
        <article>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <small>by {post.author}</small>
          <time>{post.created_at}</time>
        </article>
      )}
    </div>
  )
}
