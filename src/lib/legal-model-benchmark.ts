export type LegalModelBenchmarkRow = {
  model: string
  provider: string
  reliability: number
  usefulness: number
  costPerTask: number
  approximateCost: boolean
}

export type LegalModelBenchmark = {
  rows: LegalModelBenchmarkRow[]
  sourceUpdatedAt: string
  sourceMode: 'live' | 'fallback'
}

export const LEGAL_BENCHMARK_SOURCE = 'https://www.legalbenchmarks.ai/leaderboard'

const FALLBACK_ROWS: LegalModelBenchmarkRow[] = [
  { model: 'Claude Opus 4.8', provider: 'Anthropic', reliability: 67.6, usefulness: 2.67, costPerTask: 0.29, approximateCost: true },
  { model: 'Claude Fable 5', provider: 'Anthropic', reliability: 61.8, usefulness: 2.66, costPerTask: 0.64, approximateCost: true },
  { model: 'Claude Opus 5', provider: 'Anthropic', reliability: 61.8, usefulness: 2.47, costPerTask: 0.74, approximateCost: true },
  { model: 'Grok 4.5', provider: 'xAI', reliability: 58.8, usefulness: 2.61, costPerTask: 0.19, approximateCost: true },
  { model: 'Kimi K3', provider: 'Moonshot', reliability: 58.8, usefulness: 2.64, costPerTask: 0.14, approximateCost: true },
  { model: 'Gemini 3.5 Flash', provider: 'Google', reliability: 55.9, usefulness: 2.60, costPerTask: 0.08, approximateCost: true },
  { model: 'Claude Sonnet 4.6', provider: 'Anthropic', reliability: 50.0, usefulness: 2.63, costPerTask: 0.13, approximateCost: false },
  { model: 'Gemini 3.1 Pro', provider: 'Google', reliability: 50.0, usefulness: 2.69, costPerTask: 0.07, approximateCost: false },
  { model: 'GPT 5.6 Sol', provider: 'OpenAI', reliability: 44.1, usefulness: 2.75, costPerTask: 0.19, approximateCost: true },
  { model: 'Qwen3.7 Max', provider: 'Alibaba', reliability: 44.1, usefulness: 2.67, costPerTask: 0.03, approximateCost: true },
  { model: 'GPT-5.5', provider: 'OpenAI', reliability: 41.2, usefulness: 2.77, costPerTask: 0.15, approximateCost: false },
  { model: 'DeepSeek V4 Pro', provider: 'DeepSeek', reliability: 26.5, usefulness: 2.68, costPerTask: 0.03, approximateCost: true },
  { model: 'GPT-5.4-mini', provider: 'OpenAI', reliability: 26.5, usefulness: 2.55, costPerTask: 0.01, approximateCost: true },
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

export function parseLegalBenchmarkHtml(html: string): LegalModelBenchmark {
  const tbody = html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i)?.[1]
  if (!tbody) throw new Error('Benchmark table not found')

  const rows = [...tbody.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].flatMap(match => {
    const cells = [...match[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(cell => textContent(cell[1]))
    if (cells.length < 5) return []

    const reliability = Number.parseFloat(cells[2].replace('%', ''))
    const usefulness = Number.parseFloat(cells[3])
    const costPerTask = Number.parseFloat(cells[4].replace(/[^0-9.]/g, ''))

    if (![reliability, usefulness, costPerTask].every(Number.isFinite)) return []

    return [{
      model: cells[0].replace(/\s+New$/i, ''),
      provider: cells[1].replace(/^[A-Z]\s+(?=[A-Z])/, ''),
      reliability,
      usefulness,
      costPerTask,
      approximateCost: cells[4].includes('~'),
    }]
  })

  if (rows.length < 5) throw new Error('Benchmark table is incomplete')

  const updatedMatch = textContent(html).match(/Last updated:\s*([A-Za-z]+)\s+(\d{4})/i)
  const sourceUpdatedAt = updatedMatch
    ? `${MONTHS[updatedMatch[1].toLowerCase()] ?? updatedMatch[1]} ${updatedMatch[2]}`
    : 'laufend'

  return { rows, sourceUpdatedAt, sourceMode: 'live' }
}

export async function getLegalModelBenchmark(): Promise<LegalModelBenchmark> {
  try {
    const response = await fetch(LEGAL_BENCHMARK_SOURCE, {
      headers: { 'User-Agent': 'LexLab-Research/1.0 (+https://www.lex-lab.de/research)' },
      next: { revalidate: 86400, tags: ['legal-model-benchmark'] },
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) throw new Error(`Benchmark source returned ${response.status}`)
    return parseLegalBenchmarkHtml(await response.text())
  } catch {
    return {
      rows: FALLBACK_ROWS,
      sourceUpdatedAt: 'Juli 2026',
      sourceMode: 'fallback',
    }
  }
}
