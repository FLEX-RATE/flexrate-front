import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export function readJwtFromRequestCookies(req: NextRequest): string | null {
  const keys = [
    'access_token',
    'accessToken',
    'authorization',
    'Authorization',
    'jwt',
    'id_token',
    'idToken',
  ];
  for (const k of keys) {
    const raw = req.cookies.get(k)?.value;
    if (!raw) continue;
    if (/^Bearer\s+/i.test(raw)) return raw.replace(/^Bearer\s+/i, '');
    if (raw.split('.').length === 3) return raw;
  }
  return null;
}

export function cookieHeaderFromServer(): string {
  return cookies().toString();
}
