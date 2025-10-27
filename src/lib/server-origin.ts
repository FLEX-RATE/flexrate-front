import { headers } from 'next/headers';
export function serverOrigin(): string {
  const h = headers();
  return `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('x-forwarded-host') ?? h.get('host')!}`;
}
