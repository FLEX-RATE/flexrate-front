import { cookieHeaderFromServer } from './cookies';
import { serverOrigin } from './server-origin';

type Opts = Omit<RequestInit, 'headers'> & { headers?: HeadersInit };

export async function fetchBFF(path: string, opts: Opts = {}) {
  const base = serverOrigin();
  const ck = cookieHeaderFromServer();
  const headers: HeadersInit = { ...(opts.headers ?? {}), cookie: ck };
  return fetch(`${base}/api/bff${path.startsWith('/') ? '' : '/'}${path}`, {
    cache: 'no-store',
    ...opts,
    headers,
  });
}
