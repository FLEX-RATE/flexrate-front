export type JwtClaims = {
  role?: string;
  roleName?: string;
  authority?: string;
  authorities?: { authority?: string }[];
  roles?: string[];
};

const padB64 = (s: string) => s + '='.repeat((4 - (s.length % 4)) % 4);

export function decodeJwtPayload(token: string): unknown | null {
  try {
    const p = token.split('.')[1] ?? '';
    const n = padB64(p.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(Buffer.from(n, 'base64').toString());
  } catch {
    return null;
  }
}

export function extractRoleFromClaims(c: unknown): string | null {
  const o = c as Partial<JwtClaims> | null;
  if (!o || typeof o !== 'object') return null;
  if (typeof o.role === 'string') return o.role;
  if (typeof o.roleName === 'string') return o.roleName;
  if (typeof o.authority === 'string') return o.authority;
  const a = o.authorities?.find((x) => x && typeof x.authority === 'string');
  if (a?.authority) return a.authority;
  const r = o.roles?.find((x) => typeof x === 'string');
  return (r as string) ?? null;
}
