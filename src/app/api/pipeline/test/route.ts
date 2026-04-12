import Parser from 'rss-parser'
import { RSS_SOURCES } from '@/lib/rss-sources'

// Do not cache
export const dynamic = 'force-dynamic'

const parser = new Parser({
  timeout: 10_000,
  headers: {
    'Accept': 'application/rss+xml, application/xml, text/xml; charset=utf-8',
    'User-Agent': 'lex-lab.de RSS Reader/1.0',
  },
  defaultRSS: 2.0,
})

const fixEncoding = (str: string): string => {
  try {
    return decodeURIComponent(escape(str))
  } catch {
    return str
  }
}

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
        const rawTitle = items[0]?.title?.trim() ?? '(no title)'
        return {
          source: source.name,
          url: source.url,
          status: 'ok',
          itemCount: items.length,
          latestTitle: fixEncoding(rawTitle),
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
    r.status === 'fulfilled'
      ? r.value
      : { source: '?', url: '?', status: 'error', error: String(r.reason) }
  )

  const ok    = output.filter(r => r.status === 'ok').length
  const error = output.filter(r => r.status === 'error').length

  console.log(`[pipeline/test] Done — ${ok} ok, ${error} failed`)

  return Response.json({ summary: { ok, error }, sources: output })
}
