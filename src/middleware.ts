import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Si racine → rediriger vers dashboard admin
  if (url.pathname === '/') {
    return NextResponse.redirect(
      new URL('https://manne-rent-app.vercel.app/dashboard/admin')
    );
  }

  // Toutes les autres routes → pointer vers le projet principal
  const mainAppUrl = 'https://manne-rent-app.vercel.app';
  const targetUrl = new URL(url.pathname + url.search, mainAppUrl);

  return NextResponse.redirect(targetUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|manifest.json).*)'],
};
