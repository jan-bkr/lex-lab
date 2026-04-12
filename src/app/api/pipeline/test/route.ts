import Parser from 'rss-parser'
import https from 'https'
import http from 'http'
import { RSS_SOURCES } from '@/lib/rss-sources'

// Do not cache
export const dynamic = 'force-dynamic'

const fetchFeed = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; lex-lab-bot/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
    }, (res) => {
      const chunks: Buffer[] = []
      res.on('data', (chunk: Buffer) => chunks.push(chunk))
      res.on('end', () => {
        const buffer = Buffer.concat(chunks)
        resolve(buffer.toString('utf8'))
      })
      res.on('error', reject)
    }).on('error', reject)
  })
}

const parser = new Parser()

export async function GET(): Promise<Response> {
  const source = RSS_SOURCES.find(s => s.name === 'Finance Magazin')!

  let feed: Awaited<ReturnType<typeof parser.parseString>>
  try {
    const xml = await fetchFeed(source.url)
    feed = await parser.parseString(xml)
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
      message: 'No broken titles found — encoding fix is working or feed is already clean',
      allTitles: feed.items.map(i => i.title ?? ''),
    })
  }

  return Response.json({
    rawTitle: broken.title,
    note: 'If this still shows broken chars, the Buffer approach did not help for this feed',
  })
}
