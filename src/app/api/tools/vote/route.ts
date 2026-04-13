import { adminSupabase } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

// ─── In-memory rate limiter ────────────────────────────────────────────────────
const voteLimit = new Map<string, { count: number; resetAt: number }>()
const MAX_ACTIONS_PER_IP_AND_TOOL = 20
const VOTE_WINDOW_MS = 24 * 60 * 60 * 1000

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
  const current = voteLimit.get(key)
  if (!current || now >= current.resetAt) {
    voteLimit.set(key, { count: 1, resetAt: now + VOTE_WINDOW_MS })
    return true
  }
  if (current.count >= MAX_ACTIONS_PER_IP_AND_TOOL) return false
  voteLimit.set(key, { count: current.count + 1, resetAt: current.resetAt })
  return true
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Invalid origin' }, { status: 403 })
  }

  let toolId: string
  try {
    const body = await request.json()
    toolId = typeof body.toolId === 'string' ? body.toolId.trim() : ''
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!toolId || toolId.length > 120) {
    return Response.json({ error: 'Missing toolId' }, { status: 400 })
  }

  const ip = getClientIp(request)
  if (!checkRateLimit(`${ip}:${toolId}`)) {
    return Response.json({ error: 'Too many requests' }, { status: 429 })
  }

  // ── Check existing vote ──
  const { data: existingVote, error: voteCheckError } = await adminSupabase
    .from('tool_votes')
    .select('id')
    .eq('tool_id', toolId)
    .eq('voter_ip', ip)
    .maybeSingle()

  if (voteCheckError) {
    console.error('[vote] vote-check error:', voteCheckError.message)
    return Response.json({ error: 'Vote failed' }, { status: 500 })
  }

  // ── Fetch current vote count ──
  const { data: currentTool, error: fetchError } = await adminSupabase
    .from('tools')
    .select('votes')
    .eq('id', toolId)
    .maybeSingle()

  if (fetchError || !currentTool) {
    console.error('[vote] fetch error:', fetchError?.message)
    return Response.json({ error: 'Tool not found' }, { status: 404 })
  }

  const currentVotes = currentTool.votes ?? 0

  if (!existingVote) {
    // ── ADD VOTE ──
    const { error: insertError } = await adminSupabase
      .from('tool_votes')
      .insert({ tool_id: toolId, voter_ip: ip })

    if (insertError) {
      console.error('[vote] insert error:', insertError.message)
      return Response.json({ error: 'Vote failed' }, { status: 500 })
    }

    const newVotes = currentVotes + 1
    const { error: updateError } = await adminSupabase
      .from('tools')
      .update({ votes: newVotes })
      .eq('id', toolId)

    if (updateError) {
      console.error('[vote] update error:', updateError.message)
      return Response.json({ error: 'Vote failed' }, { status: 500 })
    }

    return Response.json({ voted: true, votes: newVotes })
  } else {
    // ── REMOVE VOTE ──
    const { error: deleteError } = await adminSupabase
      .from('tool_votes')
      .delete()
      .eq('id', existingVote.id)

    if (deleteError) {
      console.error('[vote] delete error:', deleteError.message)
      return Response.json({ error: 'Vote failed' }, { status: 500 })
    }

    const newVotes = Math.max(0, currentVotes - 1)
    const { error: updateError } = await adminSupabase
      .from('tools')
      .update({ votes: newVotes })
      .eq('id', toolId)

    if (updateError) {
      console.error('[vote] update error:', updateError.message)
      return Response.json({ error: 'Vote failed' }, { status: 500 })
    }

    return Response.json({ voted: false, votes: newVotes })
  }
}
