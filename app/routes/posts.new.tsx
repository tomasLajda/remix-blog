import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Link } from '@remix-run/react';

import { db } from '~/utils/db.server';

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const title = form.get('title')?.toString();
  const body = form.get('body')?.toString();

  if (!title || !body) throw new Error('Data is missing');

  const fields = { title, body };
  const post = await db.post.create({ data: fields });

  return redirect(`/posts/${post.id}`);
};

function NewPost() {
  return (
    <>
      <div className="page-header">
        <h1>NewPost</h1>
        <Link to={'/posts'} className="btn btn-reverse">
          Back
        </Link>
      </div>
      <div className="page-content">
        <form method="POST">
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" required />
          </div>
          <div className="form-control">
            <label htmlFor="body">Post Body</label>
            <textarea name="body" id="body" required />
          </div>
          <button type="submit" className="btn btn-block ">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default NewPost;
