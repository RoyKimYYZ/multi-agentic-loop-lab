import { Link } from "react-router-dom";
import type { Post } from "../api/posts";

interface Props {
  posts: Post[];
  onDelete: (id: number) => void;
}

export function PostList({ posts, onDelete }: Props) {
  if (posts.length === 0) {
    return <p>No posts yet.</p>;
  }

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <h2><Link to={`/posts/${post.id}`}>{post.title}</Link></h2>
          <p>{post.content}</p>
          <small>by {post.author}</small>
          <button
            onClick={() => {
              if (window.confirm("Delete this post?")) {
                onDelete(post.id);
              }
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
