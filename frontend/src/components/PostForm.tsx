import { useEffect, useState } from 'react'
import type { PostCreate } from '../api/posts'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: PostCreate) => void
  disabled: boolean
}

export function PostForm({ isOpen, onClose, onSubmit, disabled }: Props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    onSubmit({ title, content, author })
    setTitle('')
    setContent('')
    setAuthor('')
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-heading">New Post</h2>
          <button className="modal-close" aria-label="Close" onClick={onClose}>
            ✕
          </button>
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="post-title">Title</label>
            <input
              id="post-title"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="field-group">
            <label htmlFor="post-author">Author</label>
            <input
              id="post-author"
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="field-group">
            <label htmlFor="post-content">Content</label>
            <textarea
              id="post-content"
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <button type="submit" disabled={disabled} className="btn-primary btn-full">
            Publish Post
          </button>
        </form>
      </div>
    </div>
  )
}

