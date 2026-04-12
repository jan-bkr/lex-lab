import Parser from 'rss-parser'
import { adminSupabase } from '@/lib/supabase/admin'
import { RSS_SOURCES } from '@/lib/rss-sources'

// Do not cache
export const dynamic = 'force-dynamic'

const parser = new Parser({ timeout: 10_000 })

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
  // Use only the LTO source with max 1 article (no age gate for easier testing)
  const lto = RSS_SOURCES.find(s => s.name === 'JUVE')!

  console.log('[pipeline/test] Fetching JUVE feed…')

  let feed: Awaited<ReturnType<typeof parser.parseURL>>
  try {
    feed = await parser.parseURL(lto.url)
  } catch (e) {
    return Response.json({ error: `Feed fetch failed: ${e instanceof Error ? e.message : String(e)}` }, { status: 500 })
  }

  const item = feed.items[0]
  if (!item) {
    return Response.json({ error: 'No items in LTO feed' }, { status: 500 })
  }

  const title = item.title?.trim() ?? '(no title)'
  const link  = item.link?.trim() ?? ''

  console.log(`[pipeline/test] Processing item: "${title}"`)

  // Check for duplicate
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

  // Summarise with Claude
  const snippet = item.contentSnippet ?? item.summary ?? item.content ?? ''
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
    summary = json.content[0]?.text?.trim() ?? ''
  } catch (e) {
    return Response.json({ error: `Claude summarisation failed: ${e instanceof Error ? e.message : String(e)}` }, { status: 500 })
  }

  // Insert
  const slug = slugify(title) + '-' + Date.now()
  const publishedAt = item.isoDate ?? item.pubDate ?? new Date().toISOString()

  const { error: insertError } = await adminSupabase.from('news_articles').insert({
    title,
    slug,
    summary,
    source_url: link,
    source_name: lto.name,
    category: lto.category,
    published_at: publishedAt,
    ai_generated: true,
  })

  if (insertError) {
    return Response.json({ error: `DB insert failed: ${insertError.message}` }, { status: 500 })
  }

  console.log(`[pipeline/test] Inserted "${title}"`)

  return Response.json({
    status: 'inserted',
    title,
    slug,
    summary,
    source_url: link,
    published_at: publishedAt,
  })
}
