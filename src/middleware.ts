import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Racine → dashboard admin directement
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL('/dashboard/admin', request.url)
    );
  }

  // NE JAMAIS rediriger vers manne-rent-app
  return NextResponse.next();
}

export const config = {
  matcher: ['/']
};
