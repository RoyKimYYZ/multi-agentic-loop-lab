import { useEffect, useState } from 'react'
import { listPosts, type Post } from '../api/posts'
import { PostList } from '../components/PostList'

export function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    listPosts().then(setPosts).catch(console.error)
  }, [])

  return <PostList posts={posts} />
}
