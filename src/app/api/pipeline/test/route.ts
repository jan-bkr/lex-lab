import Parser from 'rss-parser'
import { RSS_SOURCES } from '@/lib/rss-sources'

// Do not cache
export const dynamic = 'force-dynamic'

const parser = new Parser({ timeout: 10_000 })

interface SourceResult {
  source: string
  url: string
  status: 'ok' | 'error'
  itemCount?: number
  latestTitle?: string
  error?: string
}

export async function GET(): Promise<Response> {
  console.log('[pipeline/test] Probing all RSS sources…')

  const results = await Promise.allSettled(
    RSS_SOURCES.map(async (source): Promise<SourceResult> => {
      try {
        const feed = await parser.parseURL(source.url)
        const items = feed.items ?? []
        return {
          source: source.name,
          url: source.url,
          status: 'ok',
          itemCount: items.length,
          latestTitle: items[0]?.title?.trim() ?? '(no title)',
        }
      } catch (e) {
        return {
          source: source.name,
          url: source.url,
          status: 'error',
          error: e instanceof Error ? e.message : String(e),
        }
      }
    })
  )

  const output: SourceResult[] = results.map(r =>
    r.status === 'fulfilled' ? r.value : { source: '?', url: '?', status: 'error', error: String(r.reason) }
  )

  const ok    = output.filter(r => r.status === 'ok').length
  const error = output.filter(r => r.status === 'error').length

  console.log(`[pipeline/test] Done — ${ok} ok, ${error} failed`)

  return Response.json({ summary: { ok, error }, sources: output })
}
