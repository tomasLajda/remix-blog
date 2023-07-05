import { useActionData } from '@remix-run/react';
import { type ActionArgs, json } from '@remix-run/node';
import { db } from '~/utils/db.server';
import { login, register, createUserSession } from '~/utils/session.server';

function validateUsername(username: string) {
  if (username.length < 3) {
    return 'Username must be at least 3 characters';
  }
}

function validatePassword(password: string) {
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
}

function badRequest(data: any) {
  return json(data, { status: 400 });
}

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const loginType = form.get('loginType');
  const username = form.get('username')?.toString() ?? '';
  const password = form.get('password')?.toString() ?? '';

  const fields = { loginType, username, password };

  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  switch (loginType) {
    case 'login': {
      const user = await login({ username, password });

      if (!user) {
        return badRequest({
          fields,
          fieldErrors: { username: 'Invalid Credentials' },
        });
      }
      return createUserSession(user.id, '/posts');
    }
    case 'register': {
      const userExists = await db.user.findFirst({
        where: {
          username,
        },
      });

      if (userExists) {
        return badRequest({
          fields,
          fieldError: { username: `User ${username} already exists` },
        });
      }

      const user = await register({ username, password });
      if (!user) {
        return badRequest({
          fields,
          formError: 'Something went wrong',
        });
      }

      return createUserSession(user.id, '/posts');
    }
    default: {
      return badRequest({
        fields,
        formError: 'Login type is not valid',
      });
    }
  }
};

function Login() {
  const actionData = useActionData();

  return (
    <div className="auth-container">
      <div className="pageheader">
        <h1>Login</h1>
      </div>

      <div className="page-content">
        <form method="POST">
          <fieldset>
            <legend>Login or Register</legend>
            <label htmlFor="">
              <input
                type="radio"
                name="loginType"
                value={'login'}
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === 'login'
                }
              />{' '}
              Login
            </label>
            <label htmlFor="">
              <input type="radio" name="loginType" value={'register'} />
              Register
            </label>
          </fieldset>
          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              defaultValue={actionData?.fields?.username}
            />
            <div className="error">
              {actionData?.fieldErrors?.username &&
                actionData?.fieldErrors?.username}
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              defaultValue={actionData?.fields?.password}
            />
            <div className="error">
              {actionData?.fieldErrors?.password &&
                actionData?.fieldErrors?.password}
            </div>
          </div>
          <button className="btn btn-block" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
