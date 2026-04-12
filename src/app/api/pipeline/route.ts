import Parser from 'rss-parser'
import { TextDecoder } from 'util'
import { adminSupabase } from '@/lib/supabase/admin'
import { RSS_SOURCES, type RssSource } from '@/lib/rss-sources'
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

// Do not cache — always run fresh
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

async function summariseWithClaude(title: string, snippet: string): Promise<string> {
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
          content: `Fasse diesen Artikel in 2-3 prägnanten deutschen Sätzen zusammen. Fokus auf das Wesentliche für Juristen und Steuerberater. Titel: ${title}. Inhalt: ${snippet}. Antworte nur mit der Zusammenfassung, kein Präambel.`,
        },
      ],
    }),
  })

  if (!res.ok) {
    throw new Error(`Claude API error: ${res.status} ${await res.text()}`)
  }

  const json = (await res.json()) as ClaudeResponse
  return json.content[0]?.text?.trim() ?? ''
}

interface PipelineResult {
  source: string
  processed: number
  inserted: number
  skipped: number
  error?: string
}

async function processSource(
  source: RssSource,
  maxItems: number,
  cutoffMs: number
): Promise<PipelineResult> {
  const result: PipelineResult = { source: source.name, processed: 0, inserted: 0, skipped: 0 }

  let feed: Awaited<ReturnType<typeof parser.parseURL>>
  try {
    feed = await parser.parseURL(source.url)
  } catch (e) {
    result.error = e instanceof Error ? e.message : String(e)
    console.error(`[pipeline] ${source.name} — feed fetch failed:`, result.error)
    return result
  }

  const items = feed.items.slice(0, maxItems)
  console.log(`[pipeline] ${source.name} — ${items.length} item(s) to evaluate`)

  for (const item of items) {
    result.processed++
    const title = fixRSSEncoding(item.title?.trim() ?? '')
    const link  = item.link?.trim()

    if (!title || !link) {
      console.log(`[pipeline] ${source.name} — skipping item without title/link`)
      result.skipped++
      continue
    }

    // Age gate — skip if older than cutoff
    const pubDate = item.isoDate ? new Date(item.isoDate) : item.pubDate ? new Date(item.pubDate) : null
    if (pubDate && pubDate.getTime() < cutoffMs) {
      console.log(`[pipeline] ${source.name} — skipping "${title}" (too old: ${pubDate.toISOString()})`)
      result.skipped++
      continue
    }

    const slug = slugify(title) + '-' + Date.now()

    // Deduplicate by source_url
    const { data: existing } = await adminSupabase
      .from('news_articles')
      .select('id')
      .eq('source_url', link)
      .maybeSingle()

    if (existing) {
      console.log(`[pipeline] ${source.name} — skipping "${title}" (already exists)`)
      result.skipped++
      continue
    }

    // Summarise with Claude
    const snippet = fixRSSEncoding(item.contentSnippet ?? item.summary ?? item.content ?? '')
    console.log(`[pipeline] ${source.name} — title before Claude: "${title}"`)
    let summary: string
    try {
      summary = cleanText(await summariseWithClaude(title, snippet.slice(0, 1000)))
    } catch (e) {
      console.error(`[pipeline] ${source.name} — Claude failed for "${title}":`, e)
      result.skipped++
      continue
    }

    // Insert into Supabase
    const publishedAt = pubDate?.toISOString() ?? new Date().toISOString()
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
      console.error(`[pipeline] ${source.name} — insert failed for "${title}":`, insertError.message)
      result.skipped++
      continue
    }

    console.log(`[pipeline] ${source.name} — inserted "${title}"`)
    result.inserted++
  }

  return result
}

export async function POST(request: Request): Promise<Response> {
  // Auth check
  const auth = request.headers.get('Authorization')
  const expected = `Bearer ${process.env.CRON_SECRET}`
  if (!auth || auth !== expected) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[pipeline] Starting full pipeline run…')
  const cutoffMs = Date.now() - 24 * 60 * 60 * 1000

  const results = await Promise.allSettled(
    RSS_SOURCES.map(source => processSource(source, 3, cutoffMs))
  )

  let totalProcessed = 0
  let totalInserted  = 0
  let totalSkipped   = 0
  const errors: string[] = []

  for (const r of results) {
    if (r.status === 'fulfilled') {
      totalProcessed += r.value.processed
      totalInserted  += r.value.inserted
      totalSkipped   += r.value.skipped
      if (r.value.error) errors.push(`${r.value.source}: ${r.value.error}`)
    } else {
      errors.push(String(r.reason))
    }
  }

  console.log(`[pipeline] Done — processed: ${totalProcessed}, inserted: ${totalInserted}, skipped: ${totalSkipped}, errors: ${errors.length}`)

  return Response.json({
    processed: totalProcessed,
    inserted:  totalInserted,
    skipped:   totalSkipped,
    errors,
  })
}
