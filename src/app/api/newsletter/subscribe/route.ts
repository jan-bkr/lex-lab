import { adminSupabase } from '@/lib/supabase/admin'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request): Promise<Response> {
  // Guard: verify env vars are present
  if (!process.env.RESEND_API_KEY) {
    console.error('[newsletter] RESEND_API_KEY is not set')
    return Response.json({ error: 'RESEND_API_KEY not set' }, { status: 500 })
  }

  let email: string
  try {
    const body = await request.json()
    email = (body.email ?? '').trim().toLowerCase()
  } catch (err) {
    console.error('[newsletter] JSON parse error:', err)
    return Response.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }

  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ error: 'Bitte gib eine gültige E-Mail-Adresse ein.' }, { status: 400 })
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
    return Response.json({ error: 'DB error (check): ' + String(err) }, { status: 500 })
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
    return Response.json({ error: 'DB error (insert): ' + String(err) }, { status: 500 })
  }

  // Send welcome email via Resend
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error: resendError } = await resend.emails.send({
      from: 'lex-lab.de <newsletter@lex-lab.de>',
      to: email,
      subject: 'Willkommen bei lex-lab.de',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #111827;">Willkommen bei lex-lab.de</h1>
          <p>Du erhältst ab jetzt wöchentlich die besten KI-Tools, Workflows und News für den deutschen Rechtsmarkt.</p>
          <p style="color: #6B7280; font-size: 14px;">Du kannst dich jederzeit abmelden. Kein Spam, versprochen.</p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;">
          <p style="color: #9CA3AF; font-size: 12px;">lex-lab.de · Kein Rechtsrat · Keine Steuerberatung</p>
        </div>
      `,
    })
    if (resendError) {
      console.error('[newsletter] resend API error:', resendError)
      return Response.json({ error: 'Email error: ' + resendError.message }, { status: 500 })
    }
  } catch (err) {
    console.error('[newsletter] resend exception:', err)
    return Response.json({ error: 'Email error: ' + String(err) }, { status: 500 })
  }

  return Response.json({ success: true })
}
