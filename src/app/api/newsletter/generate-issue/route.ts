import { adminSupabase } from '@/lib/supabase/admin'
import { generateNewsletterContent } from '@/lib/newsletter-generator'

export const dynamic = 'force-dynamic'

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = request.headers.get('authorization')
  return auth === `Bearer ${secret}` || request.headers.get('x-vercel-cron') === '1'
}

export async function POST(request: Request): Promise<Response> {
  if (!isAuthorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const content   = await generateNewsletterContent()
    const issueDate = new Date().toISOString().slice(0, 10)

    const { data, error } = await adminSupabase
      .from('newsletter_issues')
      .insert({
        title:               content.title,
        preheader:           content.preheader,
        issue_date:          issueDate,
        editors_note_auto:   content.editorsNote,
        editors_note_manual: null,
        editors_note_mode:   'auto',
        top_developments:    content.topDevelopments,
        tool_watch:          content.toolWatch,
        radar_signals:       content.radarSignals,
        lexlab_pick:         content.lexlabPick,
        status:              'draft',
      })
      .select('id')
      .single()

    if (error) {
      console.error('[newsletter/generate-issue] DB error:', error.message)
      return Response.json({ error: 'DB-Fehler beim Speichern' }, { status: 500 })
    }

    const issueId = (data as { id: string }).id
    console.log(`[newsletter/generate-issue] Created draft: ${issueId}`)
    return Response.json({ issueId }, { status: 201 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[newsletter/generate-issue] Error:', msg)
    return Response.json({ error: msg }, { status: 500 })
  }
}
