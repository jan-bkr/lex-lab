import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'
import { checkRateLimit } from '@/lib/rate-limit'
import { getHashedIp } from '@/lib/ip'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const RECHTSGEBIETE = ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Venture Capital'] as const

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true

  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
  if (!host) return false

  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

/** Returns a unique slug, appending -2/-3/... if the base slug is already taken. */
async function uniqueSlug(base: string): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`
    const { data } = await adminSupabase
      .from('tools')
      .select('id')
      .eq('slug', candidate)
      .maybeSingle()
    if (!data) return candidate
  }
  // Final fallback: append timestamp to guarantee uniqueness
  return `${base}-${Date.now()}`
}

export async function POST(req: NextRequest) {
  // ─── Same-Origin check ────────────────────────────────────────────────────────
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Ungültige Herkunft.' }, { status: 403 })
  }

  // ─── Rate limit ───────────────────────────────────────────────────────────────
  const { allowed } = await checkRateLimit('toolsubmit', getHashedIp(req))
  if (!allowed) {
    return NextResponse.json(
      { error: 'Zu viele Einreichungen. Bitte versuche es später erneut.' },
      { status: 429 }
    )
  }

  // ─── Parse body ───────────────────────────────────────────────────────────────
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiges Format.' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Ungültiges Format.' }, { status: 400 })
  }

  const { name, url, tagline, description, rechtsgebiet, email } = body as Record<string, unknown>

  // ─── Validation ───────────────────────────────────────────────────────────────
  if (typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Tool-Name ist erforderlich.' }, { status: 400 })
  }
  if (name.trim().length > 100) {
    return NextResponse.json({ error: 'Tool-Name darf maximal 100 Zeichen haben.' }, { status: 400 })
  }

  if (typeof url !== 'string' || !url.trim()) {
    return NextResponse.json({ error: 'URL ist erforderlich.' }, { status: 400 })
  }
  try {
    const parsed = new URL(url.trim())
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return NextResponse.json({ error: 'URL muss mit http:// oder https:// beginnen.' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Ungültige URL.' }, { status: 400 })
  }

  if (typeof tagline !== 'string' || !tagline.trim()) {
    return NextResponse.json({ error: 'Kurzbeschreibung ist erforderlich.' }, { status: 400 })
  }
  if (tagline.trim().length > 80) {
    return NextResponse.json({ error: 'Kurzbeschreibung darf maximal 80 Zeichen haben.' }, { status: 400 })
  }

  if (typeof description !== 'string' || !description.trim()) {
    return NextResponse.json({ error: 'Beschreibung ist erforderlich.' }, { status: 400 })
  }
  if (description.trim().length > 500) {
    return NextResponse.json({ error: 'Beschreibung darf maximal 500 Zeichen haben.' }, { status: 400 })
  }

  if (!Array.isArray(rechtsgebiet) || rechtsgebiet.length === 0) {
    return NextResponse.json({ error: 'Mindestens ein Rechtsgebiet muss ausgewählt sein.' }, { status: 400 })
  }
  const invalidRg = (rechtsgebiet as unknown[]).filter(
    r => !RECHTSGEBIETE.includes(r as typeof RECHTSGEBIETE[number])
  )
  if (invalidRg.length > 0) {
    return NextResponse.json({ error: 'Ungültiges Rechtsgebiet.' }, { status: 400 })
  }

  if (email !== undefined && email !== '' && typeof email !== 'string') {
    return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 })
  }
  if (typeof email === 'string' && email.length > 200) {
    return NextResponse.json({ error: 'E-Mail-Adresse zu lang.' }, { status: 400 })
  }

  // ─── Write (server-side, via admin client) ────────────────────────────────────
  const nameStr = (name as string).trim()
  const slug = await uniqueSlug(slugify(nameStr))
  const { error: dbError } = await adminSupabase.from('tools').insert({
    name: nameStr,
    slug,
    url: (url as string).trim(),
    tagline: (tagline as string).trim(),
    description: (description as string).trim(),
    rechtsgebiet: rechtsgebiet as string[],
    submitted_by: typeof email === 'string' && email.trim() ? email.trim() : null,
    status: 'pending',
  })

  if (dbError) {
    console.error('[tools/submit] DB error:', dbError.message)
    return NextResponse.json(
      { error: 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.' },
      { status: 500 }
    )
  }

  // ─── Admin notification (fire-and-forget, never blocks the user response) ───
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    resend.emails.send({
      from: 'lex-lab.de <kontakt@lex-lab.de>',
      to: 'janiklas.dropbox@web.de',
      subject: `[lex-lab.de] Neues Tool eingereicht: ${nameStr}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111827; margin-bottom: 4px;">Neues Tool zur Prüfung</h2>
          <p style="color: #6B7280; font-size: 13px; margin-top: 0;">via lex-lab.de Tool-Einreichung</p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 16px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #6B7280; width: 120px;">Name</td><td style="padding: 6px 0; color: #111827; font-weight: 500;">${escapeHtml(nameStr)}</td></tr>
            <tr><td style="padding: 6px 0; color: #6B7280;">URL</td><td style="padding: 6px 0;"><a href="${escapeHtml((url as string).trim())}" style="color: #2563EB;">${escapeHtml((url as string).trim())}</a></td></tr>
            <tr><td style="padding: 6px 0; color: #6B7280;">Tagline</td><td style="padding: 6px 0; color: #111827;">${escapeHtml((tagline as string).trim())}</td></tr>
            <tr><td style="padding: 6px 0; color: #6B7280;">Rechtsgebiet</td><td style="padding: 6px 0; color: #111827;">${escapeHtml((rechtsgebiet as string[]).join(', '))}</td></tr>
            <tr><td style="padding: 6px 0; color: #6B7280;">Einreicher</td><td style="padding: 6px 0; color: #111827;">${typeof email === 'string' && email.trim() ? escapeHtml(email.trim()) : '–'}</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 16px 0;">
          <a href="https://www.lex-lab.de/admin/tools" style="display: inline-block; background: #2563EB; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500;">
            Im Admin prüfen →
          </a>
        </div>
      `,
    }).catch(err => console.error('[tools/submit] admin notification failed:', err))
  }

  return NextResponse.json({ success: true })
}
