import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

async function forward(req: NextRequest) {
  const url = new URL(req.url);
  const trimmed = url.pathname.replace(/^\/api\/bff\//, '');
  const target = `${API_BASE}/${trimmed}${url.search}`;

  const rawCookie = req.headers.get('cookie') ?? '';

  const accessToken =
    req.cookies.get('access_token')?.value || req.cookies.get('accessToken')?.value || null;

  const hasBody = !(req.method === 'GET' || req.method === 'HEAD');
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const headers: Record<string, string> = {};

  if (rawCookie) headers['cookie'] = rawCookie;

  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  const ct = req.headers.get('content-type');
  if (hasBody && ct) headers['content-type'] = ct;

  const res = await fetch(target, {
    method: req.method,
    headers,
    body,
    cache: 'no-store',
  });

  const buf = await res.arrayBuffer();
  const out = new NextResponse(buf, { status: res.status });
  res.headers.forEach((v, k) => {
    if (k.toLowerCase() === 'set-cookie') out.headers.append('set-cookie', v);
    else out.headers.set(k, v);
  });

  return out;
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
