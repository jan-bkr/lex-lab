import Parser from 'rss-parser'
import { TextDecoder } from 'util'
import { adminSupabase } from '@/lib/supabase/admin'
import { RSS_SOURCES } from '@/lib/rss-sources'
import { cleanText } from '@/lib/clean-text'

const fixRSSEncoding = (str: string): string => {
  if (!str) return ''
  try {
    const bytes = new Uint8Array(str.split('').map(c => c.charCodeAt(0) & 0xff))
    const decoded = new TextDecoder('utf-8').decode(bytes)
    if (!decoded.includes('\uFFFD')) return decoded
    return str
  } catch {
    return str
  }
}

// Do not cache
export const dynamic = 'force-dynamic'

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; lex-lab-bot/1.0)',
  },
})

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

interface ClaudeTextContent {
  type: 'text'
  text: string
}

interface ClaudeResponse {
  content: ClaudeTextContent[]
}

export async function GET(): Promise<Response> {
  const source = RSS_SOURCES.find(s => s.name === 'Finance Magazin')!

  console.log(`[pipeline/test] Fetching ${source.name} feed…`)

  // 1. Fetch feed
  let feed: Awaited<ReturnType<typeof parser.parseURL>>
  try {
    feed = await parser.parseURL(source.url)
  } catch (e) {
    return Response.json(
      { error: `Feed fetch failed: ${e instanceof Error ? e.message : String(e)}` },
      { status: 500 }
    )
  }

  const item = feed.items[3]
  if (!item) {
    return Response.json({ error: 'No fourth item in feed' }, { status: 500 })
  }

  const title = fixRSSEncoding(item.title?.trim() ?? '')
  const link  = item.link?.trim() ?? ''

  if (!title || !link) {
    return Response.json({ error: 'First item has no title or link' }, { status: 500 })
  }

  console.log(`[pipeline/test] Item: "${title}"`)

  // 2. Check for duplicate
  const { data: existing } = await adminSupabase
    .from('news_articles')
    .select('id')
    .eq('source_url', link)
    .maybeSingle()

  if (existing) {
    return Response.json({
      status: 'skipped',
      reason: 'Article already exists in database',
      title,
      source_url: link,
    })
  }

  // 3. Summarise with Claude
  const snippet = fixRSSEncoding(item.contentSnippet ?? item.summary ?? item.content ?? '')
  console.log(`[pipeline/test] Title before Claude: "${title}"`)
  console.log(`[pipeline/test] Calling Claude API…`)

  let summary: string
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: `Fasse diesen Artikel in 2-3 prägnanten deutschen Sätzen zusammen. Fokus auf das Wesentliche für Juristen und Steuerberater. Titel: ${title}. Inhalt: ${snippet.slice(0, 1000)}. Antworte nur mit der Zusammenfassung, kein Präambel.`,
          },
        ],
      }),
    })

    if (!res.ok) {
      throw new Error(`Claude API error: ${res.status} ${await res.text()}`)
    }

    const json = (await res.json()) as ClaudeResponse
    summary = cleanText(json.content[0]?.text?.trim() ?? '')
  } catch (e) {
    return Response.json(
      { error: `Claude summarisation failed: ${e instanceof Error ? e.message : String(e)}` },
      { status: 500 }
    )
  }

  console.log(`[pipeline/test] Summary: "${summary}"`)

  // 4. Insert into Supabase
  const pubDate = item.isoDate ? new Date(item.isoDate) : item.pubDate ? new Date(item.pubDate) : null
  const publishedAt = pubDate?.toISOString() ?? new Date().toISOString()
  const slug = slugify(title) + '-' + Date.now()

  const { error: insertError } = await adminSupabase.from('news_articles').insert({
    title,
    slug,
    summary,
    source_url: link,
    source_name: source.name,
    category: source.category,
    published_at: publishedAt,
    ai_generated: true,
  })

  if (insertError) {
    return Response.json(
      { error: `DB insert failed: ${insertError.message}` },
      { status: 500 }
    )
  }

  console.log(`[pipeline/test] Inserted successfully`)

  return Response.json({
    status: 'inserted',
    rawTitle: item.title,
    fixedTitle: fixRSSEncoding(item.title ?? ''),
    title,
    slug,
    summary,
    source_url: link,
    source_name: source.name,
    category: source.category,
    published_at: publishedAt,
  })
}
