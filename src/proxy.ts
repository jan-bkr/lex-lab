import { NextResponse, type NextRequest } from 'next/server'

function getSupabaseAuthCookiePrefix() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return null

  try {
    const projectRef = new URL(supabaseUrl).hostname.split('.')[0]
    return `sb-${projectRef}-auth-token`
  } catch {
    return null
  }
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  // Only gate /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // Login page is always accessible
  if (pathname === '/admin/login') {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // Proxy should stay fast in Next 16: only do an optimistic cookie check here.
  const authCookiePrefix = getSupabaseAuthCookiePrefix()
  const hasSessionCookie = authCookiePrefix
    ? request.cookies.getAll().some(cookie => cookie.name.startsWith(authCookiePrefix))
    : false

  if (!hasSessionCookie) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/admin/:path*'],
}
