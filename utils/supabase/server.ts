// =====================================================================
// utils/supabase/server.ts
// =====================================================================
// Supabase client for use inside Server Components, Route Handlers,
// and Server Actions. Must be created fresh on every call (per request)
// because it reads/writes the request's cookies — never module-level
// singleton this one.
// =====================================================================
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
            // `setAll` was called from a Server Component (not a Route
            // Handler / Server Action), where cookies can't be written.
            // Safe to ignore as long as middleware.ts is refreshing the
            // session on every request (see below).
          }
        },
      },
    }
  )
}