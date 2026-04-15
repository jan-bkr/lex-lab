import { adminSupabase } from '@/lib/supabase/admin'
import { getHashedIp } from '@/lib/ip'

export const dynamic = 'force-dynamic'

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const toolId = (searchParams.get('toolId') ?? '').trim()

  if (!toolId || toolId.length > 120) {
    return Response.json({ voted: false })
  }

  const hashedIp = getHashedIp(request)

  const { data } = await adminSupabase
    .from('tool_votes')
    .select('id')
    .eq('tool_id', toolId)
    .eq('voter_ip', hashedIp)
    .maybeSingle()

  return Response.json({ voted: data !== null })
}
