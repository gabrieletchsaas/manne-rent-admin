import { createBrowserClient } from '@supabase/ssr'

// URL et clé publique (anon) Supabase — valeurs publiques NEXT_PUBLIC_
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mwnvxiaalidauubzczul.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13bnZ4aWFhbGlkYXV1YnpjenVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3OTEyOTYsImV4cCI6MjA4OTM2NzI5Nn0.m98s53GhEamB-8DfuVpD3eITsIc8vLhelkKbfQACcm4'

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
