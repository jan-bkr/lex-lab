import { createHmac, timingSafeEqual } from 'crypto'
import { adminSupabase } from '@/lib/supabase/admin'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

function makeToken(email: string): string {
  const secret = process.env.CRON_SECRET
  if (!secret) throw new Error('CRON_SECRET not configured')
  return createHmac('sha256', secret)
    .update(email.toLowerCase())
    .digest('hex')
}

function verifyToken(email: string, token: string): boolean {
  // makeToken throws if CRON_SECRET is not set — caller must handle
  const expected = Buffer.from(makeToken(email), 'hex')
  const actual   = Buffer.from(token, 'hex')
  if (expected.length !== actual.length) return false
  return timingSafeEqual(expected, actual)
}

export async function GET(req: NextRequest): Promise<Response> {
  const email = (req.nextUrl.searchParams.get('email') ?? '').toLowerCase().trim()
  const token = req.nextUrl.searchParams.get('token') ?? ''

  if (!email || !token) {
    return Response.redirect(new URL('/newsletter/abgemeldet?status=invalid', req.url))
  }

  let tokenValid: boolean
  try {
    tokenValid = verifyToken(email, token)
  } catch (e) {
    console.error('[newsletter/unsubscribe] Token verification failed — CRON_SECRET missing?', e)
    return Response.redirect(new URL('/newsletter/abgemeldet?status=error', req.url))
  }

  if (!tokenValid) {
    return Response.redirect(new URL('/newsletter/abgemeldet?status=invalid', req.url))
  }

  const { error } = await adminSupabase
    .from('newsletter_subscribers')
    .delete()
    .eq('email', email)

  if (error) {
    console.error('[newsletter/unsubscribe] DB error:', error.message)
    return Response.redirect(new URL('/newsletter/abgemeldet?status=error', req.url))
  }

  console.log(`[newsletter/unsubscribe] Removed: ${email}`)
  return Response.redirect(new URL('/newsletter/abgemeldet?status=ok', req.url))
}

/** Exported so subscribe/route.ts can use it to generate links */
export { makeToken }
