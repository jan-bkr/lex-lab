// ─── Legal AI Model Benchmark ─────────────────────────────────────────────────
//
// Quelle: legalbenchmarks.ai (Models-Leaderboard, Kategorie Contract Workflows).
// Seit dem Methodikwechsel im August/September 2026 gelten andere Kennzahlen:
// Task-Passrate (Rang), Kriterien-Passrate, Form, Kosten je Aufgabe, Latenz.
// Ergebnisse vor August 2026 sind laut Quelle nicht vergleichbar.
//
// Der Parser ordnet Spalten über die Tabellenköpfe zu, damit eine geänderte
// Spaltenreihenfolge nicht still falsche Werte erzeugt. Scheitert er, greift der
// geprüfte Fallback-Datensatz — `sourceMode` macht das auf der Seite sichtbar.

export type LegalModelBenchmarkRow = {
  rank: number
  model: string
  provider: string
  taskPass: number
  criteriaPass: number
  form: number
  costPerTask: number
  latency: string
}

export type LegalModelBenchmark = {
  rows: LegalModelBenchmarkRow[]
  sourceUpdatedAt: string
  sourceMode: 'live' | 'fallback'
}

export const LEGAL_BENCHMARK_SOURCE = 'https://www.legalbenchmarks.ai/leaderboard'
export const LEGAL_BENCHMARK_METHODOLOGY = 'https://www.legalbenchmarks.ai/methodology'

// Geprüfter Stand: Leaderboard „Results updated October 2026", abgerufen 2026-10-27
const FALLBACK_UPDATED_AT = 'Oktober 2026'
const FALLBACK_ROWS: LegalModelBenchmarkRow[] = [
  { rank: 1,  model: 'Claude Opus 5.5',    provider: 'Anthropic',   taskPass: 48.4, criteriaPass: 91.7, form: 93.9, costPerTask: 1.47, latency: '3m 03s' },
  { rank: 1,  model: 'Claude Fable 5.1',   provider: 'Anthropic',   taskPass: 48.4, criteriaPass: 90.7, form: 89.7, costPerTask: 1.50, latency: '3m 51s' },
  { rank: 1,  model: 'Muse Spark 1.3',     provider: 'Meta',        taskPass: 48.4, criteriaPass: 87.4, form: 87.8, costPerTask: 0.20, latency: '4m 35s' },
  { rank: 4,  model: 'Claude Opus 5',      provider: 'Anthropic',   taskPass: 45.2, criteriaPass: 90.1, form: 90.8, costPerTask: 0.90, latency: '4m 02s' },
  { rank: 5,  model: 'Qwen 3.8 Flash',     provider: 'Qwen',        taskPass: 38.7, criteriaPass: 49.1, form: 67.7, costPerTask: 0.03, latency: '8m 21s' },
  { rank: 6,  model: 'Claude Haiku 5.5',   provider: 'Anthropic',   taskPass: 35.5, criteriaPass: 76.9, form: 83.1, costPerTask: 0.16, latency: '1m 41s' },
  { rank: 7,  model: 'Claude Sonnet 5.5',  provider: 'Anthropic',   taskPass: 29.0, criteriaPass: 85.3, form: 91.1, costPerTask: 0.98, latency: '1m 54s' },
  { rank: 7,  model: 'Qwen 3.8 Max',       provider: 'Qwen',        taskPass: 29.0, criteriaPass: 32.2, form: 64.2, costPerTask: 0.39, latency: '6m 21s' },
  { rank: 9,  model: 'GPT-6 Astra',        provider: 'OpenAI',      taskPass: 25.8, criteriaPass: 87.1, form: 91.9, costPerTask: 1.13, latency: '2m 55s' },
  { rank: 9,  model: 'GPT-6.1 Sol',        provider: 'OpenAI',      taskPass: 25.8, criteriaPass: 86.3, form: 90.8, costPerTask: 0.11, latency: '2m 22s' },
  { rank: 9,  model: 'Gemini 3.8 Flash',   provider: 'Google',      taskPass: 25.8, criteriaPass: 65.9, form: 76.4, costPerTask: 0.22, latency: '6m 11s' },
  { rank: 9,  model: 'Grok 4.6',           provider: 'xAI',         taskPass: 25.8, criteriaPass: 62.2, form: 76.8, costPerTask: 0.28, latency: '4m 28s' },
  { rank: 9,  model: 'Mistral Large 4',    provider: 'Mistral',     taskPass: 25.8, criteriaPass: 30.6, form: 63.4, costPerTask: 0.09, latency: '5m 11s' },
  { rank: 14, model: 'GPT-5.6 Sol',        provider: 'OpenAI',      taskPass: 22.6, criteriaPass: 84.8, form: 89.2, costPerTask: 0.18, latency: '2m 51s' },
  { rank: 14, model: 'Kimi K3',            provider: 'Moonshot AI', taskPass: 22.6, criteriaPass: 78.8, form: 84.7, costPerTask: 0.26, latency: '2m 10s' },
  { rank: 14, model: 'DeepSeek V4 Flash',  provider: 'DeepSeek',    taskPass: 22.6, criteriaPass: 57.1, form: 73.4, costPerTask: 0.01, latency: '4m 18s' },
  { rank: 14, model: 'GLM-5.3 Flash',      provider: 'Z.ai',        taskPass: 22.6, criteriaPass: 56.0, form: 67.8, costPerTask: 0.02, latency: '4m 21s' },
  { rank: 18, model: 'GPT-5.6 Luna',       provider: 'OpenAI',      taskPass: 19.4, criteriaPass: 80.9, form: 86.1, costPerTask: 0.02, latency: '2m 54s' },
  { rank: 18, model: 'DeepSeek V4 Pro',    provider: 'DeepSeek',    taskPass: 19.4, criteriaPass: 78.6, form: 88.3, costPerTask: 0.08, latency: '3m 58s' },
  { rank: 18, model: 'GLM-5.3',            provider: 'Z.ai',        taskPass: 19.4, criteriaPass: 68.1, form: 81.9, costPerTask: 0.09, latency: '3m 31s' },
  { rank: 21, model: 'GPT-5.6 Terra',      provider: 'OpenAI',      taskPass: 16.1, criteriaPass: 81.2, form: 86.0, costPerTask: 0.14, latency: '1m 41s' },
  { rank: 21, model: 'Claude Sonnet 5',    provider: 'Anthropic',   taskPass: 16.1, criteriaPass: 80.1, form: 86.9, costPerTask: 0.36, latency: '2m 52s' },
  { rank: 23, model: 'MiniMax M3',         provider: 'MiniMax',     taskPass: 12.9, criteriaPass: 80.1, form: 83.4, costPerTask: 0.03, latency: '2m 03s' },
  { rank: 24, model: 'Mistral Medium 3.5', provider: 'Mistral',     taskPass: 9.7,  criteriaPass: 47.7, form: 75.0, costPerTask: 0.32, latency: '2m 52s' },
]

const MONTHS: Record<string, string> = {
  january: 'Januar',
  february: 'Februar',
  march: 'März',
  april: 'April',
  may: 'Mai',
  june: 'Juni',
  july: 'Juli',
  august: 'August',
  september: 'September',
  october: 'Oktober',
  november: 'November',
  december: 'Dezember',
}

// Spaltenköpfe der Quelle (kleingeschrieben) → Feld
const COLUMNS = {
  rank: 'rank',
  model: 'model',
  provider: 'provider',
  taskPass: 'task pass rate',
  criteriaPass: 'criteria pass rate',
  form: 'form',
  costPerTask: 'cost per task',
  latency: 'latency',
} as const

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&rarr;/g, '→')
}

function textContent(value: string) {
  return decodeHtml(value.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
}

function percent(value: string) {
  return Number.parseFloat(value.replace('%', ''))
}

export function parseLegalBenchmarkHtml(html: string): LegalModelBenchmark {
  const thead = html.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i)?.[1]
  const tbody = html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i)?.[1]
  if (!thead || !tbody) throw new Error('Benchmark table not found')

  const headers = [...thead.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)].map(h => textContent(h[1]).toLowerCase())
  const index = Object.fromEntries(
    Object.entries(COLUMNS).map(([field, label]) => [field, headers.indexOf(label)])
  ) as Record<keyof typeof COLUMNS, number>
  const missing = Object.entries(index).filter(([, i]) => i < 0).map(([field]) => field)
  if (missing.length) throw new Error(`Benchmark columns missing: ${missing.join(', ')}`)

  const rows = [...tbody.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].flatMap(match => {
    const cells = [...match[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(cell => textContent(cell[1]))
    if (cells.length < headers.length) return []

    const row: LegalModelBenchmarkRow = {
      rank: Number.parseInt(cells[index.rank], 10),
      model: cells[index.model].replace(/\s+New$/i, ''),
      provider: cells[index.provider],
      taskPass: percent(cells[index.taskPass]),
      criteriaPass: percent(cells[index.criteriaPass]),
      form: percent(cells[index.form]),
      costPerTask: Number.parseFloat(cells[index.costPerTask].replace(/[^0-9.]/g, '')),
      latency: cells[index.latency],
    }

    const numbers = [row.rank, row.taskPass, row.criteriaPass, row.form, row.costPerTask]
    return numbers.every(Number.isFinite) && row.model ? [row] : []
  })

  if (rows.length < 5) throw new Error('Benchmark table is incomplete')

  const updatedMatch = textContent(html).match(/(?:Results updated|Last updated:?)\s*([A-Za-z]+)\s+(\d{4})/i)
  const sourceUpdatedAt = updatedMatch
    ? `${MONTHS[updatedMatch[1].toLowerCase()] ?? updatedMatch[1]} ${updatedMatch[2]}`
    : 'laufend'

  return { rows, sourceUpdatedAt, sourceMode: 'live' }
}

export async function getLegalModelBenchmark(): Promise<LegalModelBenchmark> {
  try {
    const response = await fetch(LEGAL_BENCHMARK_SOURCE, {
      headers: { 'User-Agent': 'LexLab-Research/1.0 (+https://www.lex-lab.de/research/legal-model-benchmark)' },
      next: { revalidate: 86400, tags: ['legal-model-benchmark'] },
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) throw new Error(`Benchmark source returned ${response.status}`)
    return parseLegalBenchmarkHtml(await response.text())
  } catch (e) {
    console.error('[legal-model-benchmark] falling back:', e instanceof Error ? e.message : String(e))
    return {
      rows: FALLBACK_ROWS,
      sourceUpdatedAt: FALLBACK_UPDATED_AT,
      sourceMode: 'fallback',
    }
  }
}
