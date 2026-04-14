import Parser from 'rss-parser'
import { adminSupabase } from '@/lib/supabase/admin'
import { RSS_SOURCES, type RssSource } from '@/lib/rss-sources'

// ─── Runtime config ───────────────────────────────────────────────────────────
// Vercel Hobby: max 60s. Without this the default is 10s — far too short for
// 11 RSS feeds + Claude summarisation calls.
export const maxDuration = 60
export const dynamic = 'force-dynamic'

// ─── Constants ────────────────────────────────────────────────────────────────
const RSS_FETCH_TIMEOUT_MS  = 8_000  // abort slow feeds before they stall the pipeline
const CLAUDE_TIMEOUT_MS     = 15_000 // Claude Haiku is fast but give headroom
const MAX_ITEMS_PER_SOURCE  = 3

const parser = new Parser({
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; lex-lab-bot/1.0)' },
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

/** Races a promise against a timeout; throws with a descriptive message on expiry. */
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms: ${label}`)), ms)
    ),
  ])
}

// ─── Claude summarisation ─────────────────────────────────────────────────────

interface ClaudeTextContent { type: 'text'; text: string }
interface ClaudeResponse    { content: ClaudeTextContent[] }

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
      messages: [{
        role: 'user',
        content: `Fasse diesen Artikel in 2-3 prägnanten deutschen Sätzen zusammen. Fokus auf das Wesentliche für Juristen und Steuerberater. Titel: ${title}. Inhalt: ${snippet}. Antworte nur mit der Zusammenfassung, kein Präambel.`,
      }],
    }),
  })

  if (!res.ok) {
    throw new Error(`Claude API error: ${res.status} ${await res.text()}`)
  }

  const json = (await res.json()) as ClaudeResponse
  return json.content[0]?.text?.trim() ?? ''
}

// ─── Per-source processing ────────────────────────────────────────────────────

interface PipelineResult {
  source:    string
  processed: number
  inserted:  number
  skipped:   number
  durationMs: number
  error?:    string
}

async function processSource(
  source: RssSource,
  cutoffMs: number
): Promise<PipelineResult> {
  const t0     = Date.now()
  const result: PipelineResult = {
    source: source.name, processed: 0, inserted: 0, skipped: 0, durationMs: 0,
  }

  // ── Fetch RSS with timeout ──
  let feed: Awaited<ReturnType<typeof parser.parseURL>>
  try {
    feed = await withTimeout(
      parser.parseURL(source.url),
      RSS_FETCH_TIMEOUT_MS,
      `RSS ${source.name}`
    )
  } catch (e) {
    result.error    = e instanceof Error ? e.message : String(e)
    result.durationMs = Date.now() - t0
    console.error(`[pipeline] ${source.name} — feed fetch failed (${result.durationMs}ms):`, result.error)
    return result
  }

  const items = feed.items.slice(0, MAX_ITEMS_PER_SOURCE)
  console.log(`[pipeline] ${source.name} — ${items.length} item(s) to evaluate`)

  for (const item of items) {
    result.processed++
    const title = item.title?.trim() ?? ''
    const link  = item.link?.trim()

    if (!title || !link) {
      result.skipped++
      continue
    }

    // Age gate — skip if older than cutoff
    const pubDate = item.isoDate
      ? new Date(item.isoDate)
      : item.pubDate ? new Date(item.pubDate) : null

    if (pubDate && pubDate.getTime() < cutoffMs) {
      console.log(`[pipeline] ${source.name} — skip (too old): "${title}"`)
      result.skipped++
      continue
    }

    // Dedup by source_url
    const { data: existing } = await adminSupabase
      .from('news_articles')
      .select('id')
      .eq('source_url', link)
      .maybeSingle()

    if (existing) {
      console.log(`[pipeline] ${source.name} — skip (duplicate): "${title}"`)
      result.skipped++
      continue
    }

    // Summarise with Claude (with timeout)
    const snippet = item.contentSnippet ?? item.summary ?? item.content ?? ''
    let summary: string
    try {
      summary = await withTimeout(
        summariseWithClaude(title, snippet.slice(0, 1000)),
        CLAUDE_TIMEOUT_MS,
        `Claude ${source.name} / ${title.slice(0, 40)}`
      )
    } catch (e) {
      console.error(`[pipeline] ${source.name} — Claude failed for "${title}":`, e)
      result.skipped++
      continue
    }

    // Insert
    const publishedAt = pubDate?.toISOString() ?? new Date().toISOString()
    const { error: insertError } = await adminSupabase.from('news_articles').insert({
      title,
      slug:        slugify(title) + '-' + Date.now(),
      summary,
      source_url:  link,
      source_name: source.name,
      category:    source.category,
      published_at: publishedAt,
      ai_generated: true,
    })

    if (insertError) {
      console.error(`[pipeline] ${source.name} — insert failed for "${title}":`, insertError.message)
      result.skipped++
      continue
    }

    console.log(`[pipeline] ${source.name} — inserted: "${title}"`)
    result.inserted++
  }

  result.durationMs = Date.now() - t0
  console.log(`[pipeline] ${source.name} — done in ${result.durationMs}ms (inserted: ${result.inserted}, skipped: ${result.skipped})`)
  return result
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  const runStart = Date.now()
  const runId    = Math.random().toString(36).slice(2, 8)

  // ── Auth ──
  const authHeader    = request.headers.get('Authorization')
  const isVercelCron  = request.headers.get('x-vercel-cron') === '1'
  const isManualTrigger = authHeader === `Bearer ${process.env.CRON_SECRET}`

  if (!isVercelCron && !isManualTrigger) {
    console.warn(`[pipeline][${runId}] Unauthorized request — origin: ${request.headers.get('origin')}`)
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const trigger = isVercelCron ? 'vercel-cron' : 'manual'
  const cutoffMs = Date.now() - 24 * 60 * 60 * 1000

  console.log(
    `[pipeline][${runId}] ▶ START — trigger: ${trigger}, sources: ${RSS_SOURCES.length}, cutoff: ${new Date(cutoffMs).toISOString()}`
  )

  // ── Run all sources in parallel ──
  const results = await Promise.allSettled(
    RSS_SOURCES.map(source => processSource(source, cutoffMs))
  )

  // ── Aggregate ──
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

  const totalMs = Date.now() - runStart

  console.log(
    `[pipeline][${runId}] ■ END — ${totalMs}ms | processed: ${totalProcessed} | inserted: ${totalInserted} | skipped: ${totalSkipped} | errors: ${errors.length}`
  )
  if (errors.length > 0) {
    console.error(`[pipeline][${runId}] Errors:`, errors)
  }

  return Response.json({
    runId,
    trigger,
    durationMs: totalMs,
    processed:  totalProcessed,
    inserted:   totalInserted,
    skipped:    totalSkipped,
    errors,
  })
}
