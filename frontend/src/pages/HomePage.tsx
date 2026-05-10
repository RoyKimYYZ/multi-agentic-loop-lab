import type { Post } from '../api/posts'
import { PostList } from '../components/PostList'

interface Props {
  posts: Post[]
  onDelete: (id: number) => void
}

export function HomePage({ posts, onDelete }: Props) {
  return (
    <div className="home-page">
      <div className="page-header">
        <h1 className="page-title">Latest Posts</h1>
        <p className="page-subtitle">A collection of ideas, tutorials, and thoughts.</p>
      </div>
      <PostList posts={posts} onDelete={onDelete} />
    </div>
  )
}

