import { adminSupabase } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown'
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const toolId = (searchParams.get('toolId') ?? '').trim()

  if (!toolId || toolId.length > 120) {
    return Response.json({ voted: false })
  }

  const ip = getClientIp(request)

  const { data } = await adminSupabase
    .from('tool_votes')
    .select('id')
    .eq('tool_id', toolId)
    .eq('voter_ip', ip)
    .maybeSingle()

  return Response.json({ voted: data !== null })
}
