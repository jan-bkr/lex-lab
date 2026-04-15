import { adminSupabase } from '@/lib/supabase/admin'
import { checkRateLimit } from '@/lib/rate-limit'
import { getHashedIp } from '@/lib/ip'

export const dynamic = 'force-dynamic'

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

  const hashedIp = getHashedIp(request)

  const { allowed } = await checkRateLimit('vote', `${hashedIp}:${toolId}`)
  if (!allowed) {
    return Response.json({ error: 'Too many requests' }, { status: 429 })
  }

  // Reject votes for non-existent or non-approved tools
  const { data: toolRow, error: toolError } = await adminSupabase
    .from('tools')
    .select('id')
    .eq('id', toolId)
    .eq('status', 'approved')
    .maybeSingle()

  if (toolError) {
    console.error('[vote] tool lookup error:', toolError.message)
    return Response.json({ error: 'Vote failed' }, { status: 500 })
  }
  if (!toolRow) {
    return Response.json({ error: 'Tool not found' }, { status: 404 })
  }

  // ── Atomic vote toggle via RPC (single transaction: no read-then-write race) ──
  const { data, error } = await adminSupabase.rpc('toggle_tool_vote', {
    p_tool_id:  toolId,
    p_voter_ip: hashedIp,
  })

  if (error) {
    console.error('[vote] rpc error:', error.message)
    return Response.json({ error: 'Vote failed' }, { status: 500 })
  }

  const { voted, votes } = data as { voted: boolean; votes: number }
  return Response.json({ voted, votes })
}
