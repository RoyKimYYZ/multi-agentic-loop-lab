import { useState } from 'react'
import type { PostCreate } from '../api/posts'

interface Props {
  onSubmit: (data: PostCreate) => void
  disabled: boolean
}

export function PostForm({ onSubmit, disabled }: Props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    onSubmit({ title, content, author })
    setTitle('')
    setContent('')
    setAuthor('')
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
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <button type="submit" disabled={disabled}>Submit</button>
    </form>
  )
}
