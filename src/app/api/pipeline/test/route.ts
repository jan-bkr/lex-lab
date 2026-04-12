import Parser from 'rss-parser'
import { RSS_SOURCES } from '@/lib/rss-sources'
import { fixEncoding } from '@/lib/clean-text'

// Do not cache
export const dynamic = 'force-dynamic'

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; lex-lab-bot/1.0)',
  },
})

export async function GET(): Promise<Response> {
  const source = RSS_SOURCES.find(s => s.name === 'Finance Magazin')!

  let feed: Awaited<ReturnType<typeof parser.parseURL>>
  try {
    feed = await parser.parseURL(source.url)
  } catch (e) {
    return Response.json(
      { error: `Feed fetch failed: ${e instanceof Error ? e.message : String(e)}` },
      { status: 500 }
    )
  }

  const item = feed.items[4]
  if (!item) {
    return Response.json({ error: 'No fifth item in feed' }, { status: 500 })
  }

  return Response.json({
    rawTitle: item.title,
    fixedTitle: fixEncoding(item.title ?? ''),
    wouldInsert: true,
  })
}
