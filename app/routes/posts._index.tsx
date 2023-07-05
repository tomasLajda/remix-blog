import { type LoaderArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import { db } from '~/utils/db.server';
import { getUser } from '~/utils/session.server';

type Post = {
  id: string;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
};

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  const data = {
    posts: await db.post.findMany({
      take: 20,
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
    user,
  };

  return data;
};

function PostItems() {
  const { posts, user } = useLoaderData();

  return (
    <>
      <div className="page-header">
        <h1>Posts</h1>
        {user && (
          <Link to={'new'} className="btn">
            New Post
          </Link>
        )}
      </div>
      <ul className="posts-list">
        {posts.map((post: Post) => (
          <li key={post.id}>
            <Link to={post.id}>
              <h3>{post.title}</h3>
              {new Date(post.createdAt).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
export default PostItems;
