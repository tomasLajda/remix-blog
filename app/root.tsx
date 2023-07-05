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
} from '@remix-run/react';
import type { ReactNode } from 'react';
import type {
  LinksFunction,
  V2_MetaFunction,
} from '@remix-run/react/dist/routeModules';

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
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          Remix
        </Link>
        <ul className="nav">
          <Link to="/posts">Posts</Link>
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
