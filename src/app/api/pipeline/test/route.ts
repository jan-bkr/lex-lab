import Parser from 'rss-parser'
import { RSS_SOURCES } from '@/lib/rss-sources'

// Do not cache
export const dynamic = 'force-dynamic'

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; lex-lab-bot/1.0)',
  },
})

// Inlined here to guarantee it's present — also exported from @/lib/clean-text
const fixEncoding = (str: string): string => {
  if (!str) return ''
  return str
    .replace(/â€ž/g, '„')
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€˜/g, '\u2018')
    .replace(/â€™/g, '\u2019')
    .replace(/â€"/g, '\u2013')
    .replace(/â€"/g, '\u2014')
    .replace(/â€¦/g, '\u2026')
    .replace(/Ã¤/g, 'ä')
    .replace(/Ã¶/g, 'ö')
    .replace(/Ã¼/g, 'ü')
    .replace(/Ã„/g, 'Ä')
    .replace(/Ã–/g, 'Ö')
    .replace(/Ãœ/g, 'Ü')
    .replace(/ÃŸ/g, 'ß')
    .replace(/Ã©/g, 'é')
    .replace(/Ã /g, 'à')
    .replace(/Ã¨/g, 'è')
    .replace(/Ã®/g, 'î')
    .replace(/Ã´/g, 'ô')
    .replace(/Ã»/g, 'û')
    .replace(/Â«/g, '«')
    .replace(/Â»/g, '»')
    .replace(/Â·/g, '·')
    .replace(/Â /g, ' ')
}

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

  // Find first item with any known broken-encoding sequence
  const broken = feed.items.find(i =>
    i.title && (i.title.includes('Ã') || i.title.includes('â€') || i.title.includes('Â'))
  )

  if (!broken) {
    return Response.json({
      message: 'No broken titles found — feed may already be clean UTF-8',
      allTitles: feed.items.map(i => i.title ?? ''),
    })
  }

  return Response.json({
    rawTitle: broken.title,
    fixedTitle: fixEncoding(broken.title ?? ''),
  })
}
