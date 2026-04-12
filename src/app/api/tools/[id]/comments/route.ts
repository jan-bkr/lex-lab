import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

type Params = { params: Promise<{ id: string }> }

// ─── GET: fetch approved comments for a tool ──────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const { data, error } = await adminSupabase
    .from('tool_comments')
    .select('id, name, role, rechtsgebiet, comment, created_at')
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

  try {
    const { name, role, comment, rechtsgebiet } = await req.json()

    if (!name?.trim() || !comment?.trim()) {
      return NextResponse.json({ error: 'Name und Kommentar sind Pflichtfelder.' }, { status: 400 })
    }
    if (comment.trim().length > 500) {
      return NextResponse.json({ error: 'Kommentar darf maximal 500 Zeichen lang sein.' }, { status: 400 })
    }

    // Use anon client so RLS INSERT policy applies
    const supabase = await createClient()
    const { error } = await supabase.from('tool_comments').insert({
      tool_id: id,
      name: name.trim(),
      role: role ?? 'Sonstiges',
      comment: comment.trim(),
      rechtsgebiet: rechtsgebiet ?? [],
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
