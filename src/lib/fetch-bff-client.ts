type Opts = Omit<RequestInit, 'credentials' | 'cache'> & {
  credentials?: RequestCredentials;
  cache?: RequestCache;
};

export function fetchBFFClient(path: string, opts: Opts = {}) {
  const url = `/api/bff${path.startsWith('/') ? '' : '/'}${path}`;
  return fetch(url, {
    credentials: 'include',
    cache: 'no-store',
    ...opts,
  });
}

export async function fetchBFFJsonClient<T>(path: string, opts: Opts = {}) {
  const r = await fetchBFFClient(path, opts);
  if (!r.ok) return null;
  return (await r.json()) as T;
}
