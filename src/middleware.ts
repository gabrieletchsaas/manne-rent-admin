import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const CTO_EMAILS = ['gabrieletchisse@gmail.com', 'mannerentcontact@gmail.com'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Racine → dashboard admin directement
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard/admin', request.url));
  }

  // Protection de la route /dashboard/admin
  if (pathname.startsWith('/dashboard/admin')) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const isAdmin = CTO_EMAILS.includes(user.email ?? '');
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)'],
};
