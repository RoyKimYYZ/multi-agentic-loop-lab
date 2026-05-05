import type { Post } from "../api/posts";

interface Props {
  posts: Post[];
}

export function PostList({ posts }: Props) {
  if (posts.length === 0) {
    return <p>No posts yet.</p>;
  }

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <small>by {post.author}</small>
        </li>
      ))}
    </ul>
  );
}
