import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

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

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown'
}

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

  const ip = getClientIp(req)
  const { allowed } = await checkRateLimit('comments', ip)
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

    // Use anon client so RLS INSERT policy applies
    const supabase = await createClient()
    const { error } = await supabase.from('tool_comments').insert({
      tool_id: id,
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

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[comments POST] exception:', err)
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }
}
