import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_LIMIT = 120
const SUBJECT_LIMIT = 150
const MESSAGE_LIMIT = 5000
const CONTACT_WINDOW_MS = 60 * 60 * 1000
const MAX_CONTACT_REQUESTS_PER_IP = 5
const contactLimit = new Map<string, { count: number; resetAt: number }>()

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
  const current = contactLimit.get(key)

  if (!current || now >= current.resetAt) {
    contactLimit.set(key, { count: 1, resetAt: now + CONTACT_WINDOW_MS })
    return true
  }

  if (current.count >= MAX_CONTACT_REQUESTS_PER_IP) {
    return false
  }

  contactLimit.set(key, { count: current.count + 1, resetAt: current.resetAt })
  return true
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Ungültige Herkunft.' }, { status: 403 })
  }

  let name: string, email: string, subject: string, message: string
  try {
    const body = await request.json()
    name    = (body.name    ?? '').trim()
    email   = (body.email   ?? '').trim().toLowerCase()
    subject = (body.subject ?? '').trim()
    message = (body.message ?? '').trim()
  } catch (err) {
    console.error('[kontakt] parse error:', err)
    return Response.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }

  if (!name || !email || !message) {
    return Response.json({ error: 'Bitte alle Pflichtfelder ausfüllen.' }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: 'Bitte eine gültige E-Mail-Adresse angeben.' }, { status: 400 })
  }
  if (message.length < 20) {
    return Response.json({ error: 'Die Nachricht muss mindestens 20 Zeichen lang sein.' }, { status: 400 })
  }
  if (name.length > NAME_LIMIT || subject.length > SUBJECT_LIMIT || message.length > MESSAGE_LIMIT) {
    return Response.json({ error: 'Die Nachricht ist zu lang.' }, { status: 400 })
  }

  const ip = getClientIp(request)
  if (!checkRateLimit(ip)) {
    return Response.json({ error: 'Zu viele Anfragen. Bitte später erneut versuchen.' }, { status: 429 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[kontakt] RESEND_API_KEY not set')
    return Response.json({ error: 'E-Mail-Versand nicht konfiguriert.' }, { status: 500 })
  }

  const resend = new Resend(apiKey)
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeSubject = escapeHtml(subject)
  const safeMessage = escapeHtml(message)

  // Notify us
  try {
    const { data, error } = await resend.emails.send({
      from: 'lex-lab.de <kontakt@lex-lab.de>',
      to: 'janiklas.dropbox@web.de',
      replyTo: email,
      subject: `[lex-lab.de Kontakt] ${subject} — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111827; margin-bottom: 4px;">Neue Kontaktanfrage</h2>
          <p style="color: #6B7280; font-size: 13px; margin-top: 0;">via lex-lab.de Kontaktformular</p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 16px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #6B7280; width: 80px;">Name</td><td style="padding: 6px 0; color: #111827; font-weight: 500;">${safeName}</td></tr>
            <tr><td style="padding: 6px 0; color: #6B7280;">E-Mail</td><td style="padding: 6px 0;"><a href="mailto:${safeEmail}" style="color: #2563EB;">${safeEmail}</a></td></tr>
            <tr><td style="padding: 6px 0; color: #6B7280;">Betreff</td><td style="padding: 6px 0; color: #111827;">${safeSubject}</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 16px 0;">
          <p style="font-size: 13px; color: #6B7280; margin-bottom: 6px;">Nachricht:</p>
          <div style="background: #F9FAFB; border-radius: 8px; padding: 16px; font-size: 14px; color: #111827; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</div>
        </div>
      `,
    })
    console.log('[kontakt] resend response:', JSON.stringify({ data, error }, null, 2))
    if (error) {
      console.error('[kontakt] resend (notify) error:', error)
      return Response.json({ error: 'Nachricht konnte nicht gesendet werden: ' + error.message }, { status: 500 })
    }
  } catch (err) {
    console.error('[kontakt] resend (notify) exception:', err)
    return Response.json({ error: 'Nachricht konnte nicht gesendet werden.' }, { status: 500 })
  }

  // Auto-reply to sender
  try {
    await resend.emails.send({
      from: 'lex-lab.de <kontakt@lex-lab.de>',
      to: email,
      subject: 'Deine Nachricht an lex-lab.de',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111827;">Danke für deine Nachricht, ${safeName}!</h2>
          <p style="color: #374151; font-size: 14px; line-height: 1.6;">
            Wir haben deine Anfrage erhalten und melden uns innerhalb von 48 Stunden.
          </p>
          <p style="color: #6B7280; font-size: 13px; margin-top: 16px;">
            Betreff: <em>${safeSubject}</em>
          </p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;">
          <p style="color: #9CA3AF; font-size: 12px;">
            lex-lab.de · Kein Rechtsrat · Keine Steuerberatung
          </p>
        </div>
      `,
    })
  } catch (err) {
    // Auto-reply failure doesn't affect the user response
    console.error('[kontakt] resend (auto-reply) exception:', err)
  }

  return Response.json({ success: true })
}
