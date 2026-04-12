import { adminSupabase } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  const { error, count } = await adminSupabase
    .from('news_articles')
    .delete({ count: 'exact' })
    .or("source_url.eq.#,source_url.is.null,source_url.eq.")

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ deleted: count ?? 0 })
}
