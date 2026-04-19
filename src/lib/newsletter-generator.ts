import Anthropic from '@anthropic-ai/sdk'
import { adminSupabase } from '@/lib/supabase/admin'
import type {
  NewsletterDevelopment,
  NewsletterToolWatch,
  NewsletterRadarSignal,
  NewsletterPick,
} from '@/types'

export interface GeneratedIssueContent {
  title: string
  preheader: string
  editorsNote: string
  topDevelopments: NewsletterDevelopment[]
  toolWatch: NewsletterToolWatch | null
  radarSignals: NewsletterRadarSignal[]
  lexlabPick: NewsletterPick | null
}

export async function generateNewsletterContent(): Promise<GeneratedIssueContent> {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not set')

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [articlesResult, toolsResult] = await Promise.all([
    adminSupabase
      .from('news_articles')
      .select('title, summary, source_url, source_name, category, published_at')
      .gte('published_at', sevenDaysAgo)
      .order('published_at', { ascending: false })
      .limit(10),
    adminSupabase
      .from('tools')
      .select('name, slug, tagline, rechtsgebiet, lexlab_score')
      .eq('status', 'approved')
      .not('lexlab_score', 'is', null)
      .order('lexlab_score', { ascending: false })
      .limit(5),
  ])

  const articles = articlesResult.data ?? []
  const tools = toolsResult.data ?? []

  const dateLabel = new Date().toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const newsBlock =
    articles.length > 0
      ? articles
          .map(
            (a, i) =>
              `${i + 1}. [${a.category ?? 'Allgemein'}] ${a.title}\n   ${a.summary ?? '(keine Zusammenfassung)'}\n   Quelle: ${a.source_name ?? 'unbekannt'} | ${a.source_url ?? ''}`
          )
          .join('\n\n')
      : '(In den letzten 7 Tagen wurden keine Artikel erfasst.)'

  const toolsBlock =
    tools.length > 0
      ? tools
          .map(
            t =>
              `- ${t.name} (slug: ${t.slug}) — ${(t.rechtsgebiet as string[] | null)?.join(', ') ?? 'Allgemein'}: ${t.tagline ?? ''} [Score: ${t.lexlab_score}]`
          )
          .join('\n')
      : '(Keine bewerteten Tools verfügbar.)'

  const prompt = `Du bist Chefredakteur von LexLab, einer Premium-Plattform für KI-Tools im deutschen Rechts- und Steuermarkt.

Erstelle die wöchentliche Newsletter-Ausgabe "LexLab Weekly Brief" (${dateLabel}).

NEWS-ARTIKEL DER LETZTEN 7 TAGE:
${newsBlock}

TOP TOOLS NACH LEXLAB SCORE:
${toolsBlock}

Erstelle eine kuratierte Ausgabe als valides JSON-Objekt (nur JSON, keine Kommentare, kein Markdown drumherum):

{
  "title": "Betreff-Zeile — prägnant, 6-10 Wörter, deutsch",
  "preheader": "Vorschau-Text — 1 Satz, max. 90 Zeichen, keine Wiederholung des Betreffs",
  "editorsNote": "Persönliche Wocheneinschätzung — 80-120 Wörter, erste Person Singular, präzise, substanziell, kein Marketing-Jargon",
  "topDevelopments": [
    {
      "title": "Titel der Entwicklung",
      "summary": "2-3 prägnante Sätze mit konkreter Einordnung für Juristen",
      "sourceUrl": "URL wenn vorhanden, sonst weglassen",
      "category": "Kategorie"
    }
  ],
  "toolWatch": {
    "toolSlug": "slug aus der Tool-Liste oben",
    "toolName": "Name des Tools",
    "why": "Warum dieses Tool jetzt? — 2-3 konkrete, substanzielle Sätze"
  },
  "radarSignals": [
    {
      "title": "Signal-Titel",
      "context": "1-2 Sätze Einordnung — warum relevant für den Rechtsmarkt?"
    }
  ],
  "lexlabPick": {
    "type": "tool",
    "slug": "slug aus der Tool-Liste oben",
    "name": "Name",
    "why": "Empfehlungsbegründung — 2 Sätze, konkret und nützlich"
  }
}

Vorgaben:
- Genau 3 topDevelopments (aus den News auswählen und einordnen)
- Genau 2 radarSignals (Trends oder Tendenzen aus den News ableiten)
- toolWatch und lexlabPick: nur Tools aus der obigen Liste; toolWatch ≠ lexlabPick
- Ton: präzise, ruhig, professionell — keine generische KI-Sprache, kein Hype
- Wenn zu wenig News-Daten: knapp und ehrlich bleiben, nicht auffüllen
- Ausgabe: ausschließlich das JSON-Objekt`

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2500,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
  const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()

  let parsed: GeneratedIssueContent
  try {
    parsed = JSON.parse(cleaned) as GeneratedIssueContent
  } catch {
    throw new Error(`Claude returned invalid JSON: ${cleaned.slice(0, 300)}`)
  }

  return {
    title:            parsed.title            ?? 'LexLab Weekly Brief',
    preheader:        parsed.preheader        ?? '',
    editorsNote:      parsed.editorsNote      ?? '',
    topDevelopments:  Array.isArray(parsed.topDevelopments) ? parsed.topDevelopments.slice(0, 3) : [],
    toolWatch:        parsed.toolWatch        ?? null,
    radarSignals:     Array.isArray(parsed.radarSignals) ? parsed.radarSignals.slice(0, 3) : [],
    lexlabPick:       parsed.lexlabPick       ?? null,
  }
}
