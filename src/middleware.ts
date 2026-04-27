import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  // Redirige tout le trafic vers le dashboard admin
  // sur le projet principal
  url.hostname = 'manne-rent-app.vercel.app'
  url.pathname = '/dashboard/admin' + url.pathname
  
  return NextResponse.rewrite(url)
}
