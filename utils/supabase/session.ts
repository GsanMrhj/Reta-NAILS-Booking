// =====================================================================
// utils/supabase/middleware.ts
// =====================================================================
// Refreshes the Supabase auth session on every request and keeps the
// browser + server cookies in sync. Called from the root middleware.ts.
// =====================================================================
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not add any logic between createServerClient() and
  // supabase.auth.getUser(). Even a small mistake here can make it very
  // hard to debug users being randomly signed out.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Example route protection — uncomment and adjust once you have an
  // OTP login page. Keep this in sync with the matcher in the root
  // middleware.ts.
  //
  // const isAuthRoute = request.nextUrl.pathname.startsWith('/login')
  // const isProtectedRoute = request.nextUrl.pathname.startsWith('/account')
  //   || request.nextUrl.pathname.startsWith('/booking')
  //
  // if (!user && isProtectedRoute) {
  //   const url = request.nextUrl.clone()
  //   url.pathname = '/login'
  //   return NextResponse.redirect(url)
  // }

  // IMPORTANT: You must return the supabaseResponse object as-is. If you
  // need to build a new response, copy the cookies from supabaseResponse
  // onto it — otherwise the browser and server can fall out of sync and
  // sessions will randomly break.
  return supabaseResponse
}