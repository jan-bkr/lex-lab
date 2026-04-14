import { adminSupabase } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import { makeToken } from '@/app/api/newsletter/unsubscribe/route'

export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SUBSCRIBE_WINDOW_MS = 60 * 60 * 1000
const MAX_SUBSCRIPTIONS_PER_IP = 5
const subscribeLimit = new Map<string, { count: number; resetAt: number }>()

// ─── Periodic cleanup: remove expired entries every hour ─────────────────────
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of subscribeLimit) {
    if (now >= val.resetAt) subscribeLimit.delete(key)
  }
}, 60 * 60 * 1000)

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown'
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true

  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  if (!host) return false

  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const current = subscribeLimit.get(key)

  if (!current || now >= current.resetAt) {
    subscribeLimit.set(key, { count: 1, resetAt: now + SUBSCRIBE_WINDOW_MS })
    return true
  }

  if (current.count >= MAX_SUBSCRIPTIONS_PER_IP) {
    return false
  }

  subscribeLimit.set(key, { count: current.count + 1, resetAt: current.resetAt })
  return true
}

export async function POST(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Ungültige Herkunft.' }, { status: 403 })
  }

  // Guard: verify env vars are present
  if (!process.env.RESEND_API_KEY) {
    console.error('[newsletter] RESEND_API_KEY is not set')
    return Response.json({ error: 'E-Mail-Versand derzeit nicht verfügbar.' }, { status: 500 })
  }

  let email: string
  try {
    const body = await request.json()
    email = (body.email ?? '').trim().toLowerCase()
  } catch (err) {
    console.error('[newsletter] JSON parse error:', err)
    return Response.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return Response.json({ error: 'Bitte gib eine gültige E-Mail-Adresse ein.' }, { status: 400 })
  }

  const ip = getClientIp(request)
  if (!checkRateLimit(ip)) {
    return Response.json({ error: 'Zu viele Anfragen. Bitte später erneut versuchen.' }, { status: 429 })
  }

  // Check for duplicate
  let existing = null
  try {
    const { data, error } = await adminSupabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .maybeSingle()
    if (error) throw error
    existing = data
  } catch (err) {
    console.error('[newsletter] duplicate-check error:', err)
    return Response.json({ error: 'Interner Fehler bei der Anmeldung.' }, { status: 500 })
  }

  if (existing) {
    return Response.json({ error: 'Diese E-Mail-Adresse ist bereits angemeldet.' }, { status: 409 })
  }

  // Insert subscriber
  try {
    const { error } = await adminSupabase
      .from('newsletter_subscribers')
      .insert({ email, confirmed: true })
    if (error) throw error
  } catch (err) {
    console.error('[newsletter] insert error:', err)
    return Response.json({ error: 'Interner Fehler bei der Anmeldung.' }, { status: 500 })
  }

  // Send welcome email via Resend
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const unsubToken = makeToken(email)
    const unsubUrl   = `https://www.lex-lab.de/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${unsubToken}`

    const { error: resendError } = await resend.emails.send({
      from: 'lex-lab.de <newsletter@lex-lab.de>',
      to: email,
      subject: 'Willkommen bei lex-lab.de',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #111827;">Willkommen bei lex-lab.de</h1>
          <p>Du erhältst ab jetzt wöchentlich die besten KI-Tools, Workflows und News für den deutschen Rechtsmarkt.</p>
          <p style="color: #6B7280; font-size: 14px;">Kein Spam, versprochen.</p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;">
          <p style="color: #9CA3AF; font-size: 12px;">
            lex-lab.de · Kein Rechtsrat · Keine Steuerberatung<br>
            <a href="${unsubUrl}" style="color: #9CA3AF;">Abmelden</a>
          </p>
        </div>
      `,
    })
    if (resendError) {
      console.error('[newsletter] resend API error:', resendError)
      return Response.json({ error: 'E-Mail konnte nicht gesendet werden.' }, { status: 500 })
    }
  } catch (err) {
    console.error('[newsletter] resend exception:', err)
    return Response.json({ error: 'E-Mail konnte nicht gesendet werden.' }, { status: 500 })
  }

  return Response.json({ success: true })
}
