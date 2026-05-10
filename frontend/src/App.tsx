import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { createPost, deletePost, listPosts, type Post, type PostCreate } from './api/posts'
import { TopNav } from './components/TopNav'
import { PostForm } from './components/PostForm'
import { HomePage } from './pages/HomePage'
import { PostDetailPage } from './pages/PostDetailPage'
import './App.css'

function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  async function loadPosts() {
    listPosts().then(setPosts).catch(console.error)
  }

  useEffect(() => {
    loadPosts()
  }, [])

  async function handleSubmit(data: PostCreate) {
    setSubmitting(true)
    try {
      await createPost(data)
      await loadPosts()
      setIsModalOpen(false)
    } catch {
      // error is surfaced via disabled state; keep modal open
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    try {
      await deletePost(id)
      setPosts((prev) => prev.filter((p) => p.id !== id))
    } catch {
      console.error('Failed to delete post.')
    }
  }

  return (
    <div className="app">
      <TopNav onNewPost={() => setIsModalOpen(true)} />
      <PostForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        disabled={submitting}
      />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage posts={posts} onDelete={handleDelete} />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

