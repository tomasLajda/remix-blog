import { Link, useLoaderData } from '@remix-run/react';

type Post = {
  id: number;
  title: string;
  body: string;
};

export const loader = () => {
  const data = {
    post: [
      { id: 1, title: 'Post 1', body: 'This is a test post' },
      { id: 2, title: 'Post 2', body: 'This is a test post' },
      { id: 3, title: 'Post 3', body: 'This is a test post' },
    ],
  };

  return data;
};

function PostItems() {
  const { post } = useLoaderData();

  return (
    <>
      <div className="page-header">
        <h1>Posts</h1>
        <Link to={'new'} className="btn">
          New Post
        </Link>
      </div>
      <ul className="posts-list">
        {post.map((post: Post) => (
          <li key={post.id}>
            <Link to={post.id.toString()}>
              <h3>{post.title}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
export default PostItems;
