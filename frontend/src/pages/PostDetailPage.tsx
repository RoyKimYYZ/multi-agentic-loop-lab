import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getPost, updatePost, deletePost, type Post, type PostUpdate } from '../api/posts'
import { EditPostForm } from '../components/EditPostForm'

export function PostDetailPage() {
  const { id } = useParams()
  const postId = Number(id)
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let ignore = false

    getPost(postId)
      .then((nextPost) => {
        if (ignore) return
        setPost(nextPost)
        setError(null)
        setIsEditing(false)
      })
      .catch((err: Error) => {
        if (ignore) return
        setPost(null)
        setError(err.message)
      })

    return () => {
      ignore = true
    }
  }, [postId])

  async function handleSave(data: PostUpdate) {
    setSaving(true)
    setError(null)
    try {
      const updatedPost = await updatePost(postId, data)
      setPost(updatedPost)
      setIsEditing(false)
    } catch {
      setError('Failed to update post.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePost(postId);
      navigate("/");
    } catch {
      setError("Failed to delete post.");
    }
  }

  const currentPost = post?.id === postId ? post : null

  return (
    <div>
      <Link to="/">← Back to posts</Link>
      {error && <p>{error}</p>}
      {!error && !currentPost && <p>Loading...</p>}
      {currentPost && (
        <>
          {isEditing ? (
            <EditPostForm
              initialTitle={currentPost.title}
              initialContent={currentPost.content}
              author={currentPost.author}
              createdAt={currentPost.created_at}
              saving={saving}
              onSave={handleSave}
              onCancel={() => {
                setError(null)
                setIsEditing(false)
              }}
            />
          ) : (
            <article>
              <h2>{currentPost.title}</h2>
              <p>{currentPost.content}</p>
              <small>by {currentPost.author}</small>
              <time>{currentPost.created_at}</time>
              <button onClick={() => {
                setError(null)
                setIsEditing(true)
              }}
              >
                Edit
              </button>
              <button onClick={handleDelete}>Delete</button>
            </article>
          )}
        </>
      )}
    </div>
  )
}
