import Parser from 'rss-parser'
import { RSS_SOURCES } from '@/lib/rss-sources'

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

  // Find first item with a broken umlaut sequence
  const broken = feed.items.find(i =>
    i.title && (i.title.includes('Ã') || i.title.includes('â€') || i.title.includes('Â'))
  )

  if (!broken) {
    return Response.json({
      message: 'No broken titles found — feed is clean UTF-8',
      allTitles: feed.items.map(i => i.title ?? ''),
    })
  }

  return Response.json({
    rawTitle: broken.title,
    note: 'This title has broken encoding from the feed source itself',
  })
}
