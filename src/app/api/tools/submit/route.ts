import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'
import { checkRateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const RECHTSGEBIETE = ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Venture Capital'] as const

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function POST(req: NextRequest) {
  // ─── Rate limit ───────────────────────────────────────────────────────────────
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  const { allowed } = await checkRateLimit('toolsubmit', ip)
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
  // Append a short timestamp suffix to the slug to prevent collisions when
  // multiple tools share the same name (e.g. two "ChatGPT" submissions).
  const nameStr = (name as string).trim()
  const slug    = `${slugify(nameStr)}-${Date.now().toString(36)}`

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
    // Unique-constraint violations (code 23505) on slug are theoretically
    // impossible now (timestamp suffix), but guard against edge cases.
    return NextResponse.json(
      { error: 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
