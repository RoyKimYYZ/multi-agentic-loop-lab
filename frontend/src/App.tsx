import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { PostDetailPage } from './pages/PostDetailPage'
import './App.css'

function App() {
  return (
    <>
      <header>
        <h1>Blog</h1>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
