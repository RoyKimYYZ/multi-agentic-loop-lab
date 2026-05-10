import { Link } from 'react-router-dom'

interface Props {
  onNewPost: () => void
}

export function TopNav({ onNewPost }: Props) {
  return (
    <nav className="top-nav">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">◈ Blog</Link>
        <button className="btn-primary nav-btn" onClick={onNewPost}>
          + New Post
        </button>
      </div>
    </nav>
  )
}
