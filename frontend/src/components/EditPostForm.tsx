import { useState } from 'react'
import type { PostUpdate } from '../api/posts'

interface Props {
  initialTitle: string
  initialContent: string
  author: string
  createdAt: string
  saving: boolean
  onSave: (data: PostUpdate) => void | Promise<void>
  onCancel: () => void
}

export function EditPostForm({
  initialTitle,
  initialContent,
  author,
  createdAt,
  saving,
  onSave,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    onSave({ title, content })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <small>by {author}</small>
      <time>{createdAt}</time>
      <button type="submit" disabled={saving}>Save</button>
      <button type="button" onClick={onCancel} disabled={saving}>Cancel</button>
    </form>
  )
}
