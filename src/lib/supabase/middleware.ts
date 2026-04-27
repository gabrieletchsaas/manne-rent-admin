import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Récupération sécurisée des variables d'environnement (Edge runtime)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Si les variables sont absentes (ex: build Vercel sans secrets liés), on passe silencieusement 
  // pour ne pas crasher tout le routage de l'application avec un 500.
  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    })

    // This will refresh the session if it's expired
    await supabase.auth.getUser()
  } catch (err) {
    // Ne jamais planter le middleware (et donc l'accès à la plateforme)
    console.error('Middleware Supabase Error:', err);
  }

  return supabaseResponse
}
