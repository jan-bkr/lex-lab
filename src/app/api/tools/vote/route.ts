import { adminSupabase } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(request: Request): Promise<Response> {
  let toolId: string
  try {
    const body = await request.json()
    toolId = body.toolId
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!toolId) {
    return Response.json({ error: 'Missing toolId' }, { status: 400 })
  }

  // Fetch current vote count
  const { data: current, error: fetchError } = await adminSupabase
    .from('tools')
    .select('votes')
    .eq('id', toolId)
    .maybeSingle()

  if (fetchError || !current) {
    console.error('[vote] fetch error:', fetchError?.message)
    return Response.json({ error: 'Tool not found' }, { status: 404 })
  }

  const newVotes = (current.votes ?? 0) + 1

  const { error: updateError } = await adminSupabase
    .from('tools')
    .update({ votes: newVotes })
    .eq('id', toolId)

  if (updateError) {
    console.error('[vote] update error:', updateError.message)
    return Response.json({ error: 'Vote failed' }, { status: 500 })
  }

  return Response.json({ votes: newVotes })
}
