import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { adminSupabase } from '@/lib/supabase/admin'
import { checkRateLimit } from '@/lib/rate-limit'
import { getHashedIp } from '@/lib/ip'

type Params = { params: Promise<{ id: string }> }
type AllowedRechtsgebiet = 'Steuerrecht' | 'M&A' | 'Gesellschaftsrecht' | 'Venture Capital'

const COMMENT_LIMIT = 500
const NAME_LIMIT = 80
const ROLE_LIMIT = 80
const ALLOWED_RECHTSGEBIETE: AllowedRechtsgebiet[] = [
  'Steuerrecht',
  'M&A',
  'Gesellschaftsrecht',
  'Venture Capital',
]

function isSameOrigin(request: NextRequest): boolean {
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

// ─── GET: fetch approved comments for a tool ──────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const { data, error } = await adminSupabase
    .from('tool_comments')
    .select('id, name, role, rechtsgebiet, comment, rating, created_at')
    .eq('tool_id', id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[comments GET] error:', error)
    return NextResponse.json({ comments: [] })
  }

  return NextResponse.json({ comments: data ?? [] })
}

// ─── POST: submit a new (pending) comment ─────────────────────────────────────

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params

  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Ungültige Herkunft.' }, { status: 403 })
  }

  if (!id || id.length > 120) {
    return NextResponse.json({ error: 'Ungültige Tool-ID.' }, { status: 400 })
  }

  const { allowed } = await checkRateLimit('comments', getHashedIp(req))
  if (!allowed) {
    return NextResponse.json({ error: 'Zu viele Anfragen. Bitte später erneut versuchen.' }, { status: 429 })
  }

  try {
    const { name, role, comment, rating, rechtsgebiet } = await req.json()
    const safeName    = typeof name    === 'string' ? name.trim()    : ''
    const safeRole    = typeof role    === 'string' ? role.trim()    : ''
    const safeComment = typeof comment === 'string' ? comment.trim() : null
    const safeRating  = typeof rating  === 'number' && rating >= 1 && rating <= 5
      ? Math.round(rating)
      : null
    const safeRechtsgebiet = Array.isArray(rechtsgebiet)
      ? rechtsgebiet
          .filter((value): value is AllowedRechtsgebiet =>
            typeof value === 'string' &&
            ALLOWED_RECHTSGEBIETE.includes(value as AllowedRechtsgebiet)
          )
          .slice(0, ALLOWED_RECHTSGEBIETE.length)
      : []

    if (!safeName) {
      return NextResponse.json({ error: 'Name ist ein Pflichtfeld.' }, { status: 400 })
    }
    if (!safeComment && !safeRating) {
      return NextResponse.json({ error: 'Bitte gib einen Kommentar oder eine Bewertung ab.' }, { status: 400 })
    }
    if (safeName.length > NAME_LIMIT) {
      return NextResponse.json({ error: 'Name ist zu lang.' }, { status: 400 })
    }
    if (safeRole.length > ROLE_LIMIT) {
      return NextResponse.json({ error: 'Rolle ist zu lang.' }, { status: 400 })
    }
    if (safeComment && safeComment.length > COMMENT_LIMIT) {
      return NextResponse.json({ error: 'Kommentar darf maximal 500 Zeichen lang sein.' }, { status: 400 })
    }

    const { data: toolRow, error: toolErr } = await adminSupabase
      .from('tools')
      .select('slug')
      .eq('id', id)
      .maybeSingle()

    if (toolErr || !toolRow) {
      return NextResponse.json({ error: 'Tool nicht gefunden.' }, { status: 404 })
    }

    const { error } = await adminSupabase.from('tool_comments').insert({
      tool_id: id,
      tool_slug: toolRow.slug,
      name: safeName,
      role: safeRole || 'Sonstiges',
      comment: safeComment,
      rating: safeRating,
      rechtsgebiet: safeRechtsgebiet,
      status: 'pending',
    })

    if (error) {
      console.error('[comments POST] error:', error)
      return NextResponse.json({ error: 'Fehler beim Speichern.' }, { status: 500 })
    }

    // ─── Admin notification (fire-and-forget) ────────────────────────────────
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const stars = safeRating ? '★'.repeat(safeRating) + '☆'.repeat(5 - safeRating) : '–'
      resend.emails.send({
        from: 'lex-lab.de <kontakt@lex-lab.de>',
        to: 'janiklas.dropbox@web.de',
        subject: `[lex-lab.de] Neuer Kommentar: ${toolRow.slug}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #111827; margin-bottom: 4px;">Neuer Kommentar zur Prüfung</h2>
            <p style="color: #6B7280; font-size: 13px; margin-top: 0;">via lex-lab.de · Tool: ${toolRow.slug}</p>
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 16px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr><td style="padding: 6px 0; color: #6B7280; width: 120px;">Name</td><td style="padding: 6px 0; color: #111827; font-weight: 500;">${safeName}</td></tr>
              <tr><td style="padding: 6px 0; color: #6B7280;">Rolle</td><td style="padding: 6px 0; color: #111827;">${safeRole || 'Sonstiges'}</td></tr>
              <tr><td style="padding: 6px 0; color: #6B7280;">Bewertung</td><td style="padding: 6px 0; color: #111827;">${stars}</td></tr>
              <tr><td style="padding: 6px 0; color: #6B7280;">Rechtsgebiet</td><td style="padding: 6px 0; color: #111827;">${safeRechtsgebiet.join(', ') || '–'}</td></tr>
              <tr><td style="padding: 6px 0; color: #6B7280; vertical-align: top;">Kommentar</td><td style="padding: 6px 0; color: #111827;">${safeComment ?? '–'}</td></tr>
            </table>
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 16px 0;">
            <a href="https://www.lex-lab.de/admin/comments" style="display: inline-block; background: #2563EB; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500;">
              Im Admin prüfen →
            </a>
          </div>
        `,
      }).catch(err => console.error('[comments POST] admin notification failed:', err))
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[comments POST] exception:', err)
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }
}
