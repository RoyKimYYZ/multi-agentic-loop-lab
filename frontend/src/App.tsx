import { useEffect, useState } from 'react'
import { listPosts, type Post } from './api/posts'
import { PostList } from './components/PostList'
import './App.css'

function App() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    listPosts().then(setPosts).catch(console.error)
  }, [])

  return (
    <>
      <header>
        <h1>Blog</h1>
      </header>
      <main>
        <PostList posts={posts} />
      </main>
    </>
  )
}

export default App
