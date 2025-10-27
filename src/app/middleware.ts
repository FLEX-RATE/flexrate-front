import { NextResponse, NextRequest } from 'next/server';

import { readJwtFromRequestCookies } from '@/lib/cookies';
import { decodeJwtPayload, extractRoleFromClaims } from '@/lib/jwt';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/images') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const token = readJwtFromRequestCookies(req);
  const role = extractRoleFromClaims(token ? decodeJwtPayload(token) : null);
  const isAdmin = role === 'ADMIN';

  if (pathname === '/' && isAdmin) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/customer-management';
    return NextResponse.redirect(url);
  }

  if (isAdmin && pathname !== '/' && !pathname.startsWith('/admin')) {
    const url = req.nextUrl.clone();
    url.pathname = '/not-found';
    return NextResponse.rewrite(url);
  }

  if (pathname.startsWith('/admin') && !isAdmin) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/admin/:path*', '/((?!_next|static|images|api).*)'],
};
