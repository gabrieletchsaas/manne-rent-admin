import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mwnvxiaalidauubzczul.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13bnZ4aWFhbGlkYXV1YnpjenVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3OTEyOTYsImV4cCI6MjA4OTM2NzI5Nn0.m98s53GhEamB-8DfuVpD3eITsIc8vLhelkKbfQACcm4'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Ignoré en Server Component — le middleware gère le refresh de session
        }
      },
    },
  })
}
