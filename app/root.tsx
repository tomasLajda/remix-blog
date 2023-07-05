import type { LoaderArgs } from '@remix-run/node';
import type { ReactNode } from 'react';
import type {
  LinksFunction,
  V2_MetaFunction,
} from '@remix-run/react/dist/routeModules';
import {
  Outlet,
  ScrollRestoration,
  Scripts,
  LiveReload,
  Link,
  Links,
  Meta,
  useRouteError,
  isRouteErrorResponse,
  useLoaderData,
} from '@remix-run/react';

import { getUser } from './utils/session.server';

import globalStylesUrl from '~/styles/global.css';

export const links: LinksFunction = () => [
  ...(globalStylesUrl ? [{ rel: 'stylesheet', href: globalStylesUrl }] : []),
];

export const meta: V2_MetaFunction = () => {
  const name = 'A cool blog built with Remix';
  const content = 'remix, react, javascript';
  const title = 'My Remix blog';

  return [
    { title },
    { name, content },
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  const data = {
    user,
  };
  return data;
};

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </Layout>
    </Document>
  );
}

function Document({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>{children}</body>
    </html>
  );
}

function Layout({ children }: { children: ReactNode }) {
  const { user } = useLoaderData();

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          Remix
        </Link>
        <ul className="nav">
          <li>
            <Link to="/posts">Posts</Link>
          </li>
          {user ? (
            <li>
              <form action="/auth/logout" method="POST">
                <button className="btn" type="submit">
                  Logout {user.username}
                </button>
              </form>
            </li>
          ) : (
            <li>
              <Link to="/auth/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
      <div className="container">{children}</div>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const errorHandler = (error: unknown) => {
    if (isRouteErrorResponse(error)) {
      return (
        <div>
          <h1>
            {error.status} {error.statusText}
          </h1>
          <p>{error.data}</p>
        </div>
      );
    } else if (error instanceof Error) {
      return (
        <div>
          <h1>Error</h1>
          <p>{error.message}</p>
          <p>The stack trace is:</p>
          <pre>{error.stack}</pre>
        </div>
      );
    } else {
      return <h1>Unknown Error</h1>;
    }
  };

  return (
    <Document>
      <Layout>{errorHandler(error)}</Layout>
    </Document>
  );
}
