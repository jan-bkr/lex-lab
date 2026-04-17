import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { JURIST_PERSONA } from '@/lib/jurist-persona'
import { checkRateLimit } from '@/lib/rate-limit'
import { getHashedIp } from '@/lib/ip'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// ─── Constants ────────────────────────────────────────────────────────────────

const ALLOWED_RECHTSGEBIETE = ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Venture Capital'] as const
const ALLOWED_AUFGABEN = [
  'Gutachten / Memo',
  'Vertragsanalyse',
  'Due Diligence',
  'Mandantenberatung',
  'Schriftsatz / Brief',
  'Recherche',
] as const
const ALLOWED_DETAILTIEFE = [
  'Kurze Übersicht (für Mandanten)',
  'Strukturierte Analyse (Kanzlei-intern)',
  'Vollständiges Gutachten (Partnerniveau)',
] as const
const ALLOWED_SPRACHE = ['Deutsch (Standard)', 'Englisch'] as const

const SACHVERHALT_MAX = 800

function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true // server-to-server or same-origin (no Origin header)
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
  if (!host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // ── Origin check ──
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Ungültige Herkunft.' }, { status: 403 })
  }

  // ── Rate limiting ──
  const { allowed, remaining } = await checkRateLimit('prompts', getHashedIp(req))
  if (!allowed) {
    return NextResponse.json(
      { error: 'RATE_LIMIT_EXCEEDED', limit: 10 },
      { status: 429 }
    )
  }

  // ── Parse + validate input ──
  let rechtsgebiet: string[], aufgabe: string, sachverhalt: string, detailtiefe: string, sprache: string
  try {
    const body = await req.json()
    rechtsgebiet = Array.isArray(body.rechtsgebiet) ? body.rechtsgebiet : []
    aufgabe      = typeof body.aufgabe      === 'string' ? body.aufgabe.trim()      : ''
    sachverhalt  = typeof body.sachverhalt  === 'string' ? body.sachverhalt.trim()  : ''
    detailtiefe  = typeof body.detailtiefe  === 'string' ? body.detailtiefe.trim()  : ''
    sprache      = typeof body.sprache      === 'string' ? body.sprache.trim()      : ''
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }

  // Allowlist validation — only accept values that the UI can send
  const safeRechtsgebiet = rechtsgebiet.filter(
    (r): r is typeof ALLOWED_RECHTSGEBIETE[number] =>
      typeof r === 'string' && (ALLOWED_RECHTSGEBIETE as readonly string[]).includes(r)
  )

  if (safeRechtsgebiet.length === 0) {
    return NextResponse.json({ error: 'Fehlende Pflichtfelder.' }, { status: 400 })
  }
  if (!(ALLOWED_AUFGABEN as readonly string[]).includes(aufgabe)) {
    return NextResponse.json({ error: 'Ungültiger Aufgabentyp.' }, { status: 400 })
  }
  if (!sachverhalt || sachverhalt.length < 10) {
    return NextResponse.json({ error: 'Sachverhalt zu kurz.' }, { status: 400 })
  }
  if (sachverhalt.length > SACHVERHALT_MAX) {
    return NextResponse.json({ error: 'Sachverhalt zu lang.' }, { status: 400 })
  }
  // Detailtiefe + Sprache: fall back to defaults if invalid (non-breaking)
  const safeDetailtiefe = (ALLOWED_DETAILTIEFE as readonly string[]).includes(detailtiefe)
    ? detailtiefe
    : ALLOWED_DETAILTIEFE[1]
  const safeSprache = (ALLOWED_SPRACHE as readonly string[]).includes(sprache)
    ? sprache
    : ALLOWED_SPRACHE[0]

  // ── Call Anthropic ──
  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 2500,
      stop_sequences: ['[ENDE]'],
      system: JURIST_PERSONA + `\n\nDeine Aufgabe jetzt: Erstelle einen vollständig einsatzbereiten juristischen Prompt. Die juristische Basis-Persona wird automatisch vorangestellt — schreibe KEINE Rolleneinleitung, KEIN "Du bist...". Beginne direkt mit der Aufgabenbeschreibung.

Der generierte Prompt soll:
(1) Den konkreten Sachverhalt aus der Nutzereingabe vollständig und direkt aufnehmen — kein Platzhalter, der Sachverhalt wurde bereits eingegeben und muss im Prompt enthalten sein
(2) Die juristische Aufgabe präzise formulieren mit nummerierten Prüfungsschritten
(3) Relevante Normen, Gesetze und Prüfungspunkte zum Rechtsgebiet explizit nennen
(4) Das gewünschte Ausgabeformat und die Detailtiefe klar definieren
(5) Praxisgerecht strukturiert und direkt in einem KI-System verwendbar sein

Qualitätsstandard: Kein mechanischer Fülltext, kein unnötiges Wiederholen, keine leeren Formeln. Der Prompt soll so klingen, als hätte ihn ein erfahrener Rechtsanwalt selbst formuliert.

Antworte NUR mit dem fertigen Prompt-Text, ohne Erklärungen, ohne Präambel, ohne Markdown-Codeblock. Der Prompt muss mit einem vollständigen, abgeschlossenen Satz enden — niemals mitten in einem Satz aufhören. Beende deinen Output mit [ENDE].`,
      messages: [
        {
          role: 'user',
          content: `Rechtsgebiet(e): ${safeRechtsgebiet.join(', ')}
Aufgabentyp: ${aufgabe}
Kontext/Sachverhalt: ${sachverhalt}
Detailtiefe: ${safeDetailtiefe}
Sprache: ${safeSprache}

Erstelle den optimalen Prompt für diese juristische Aufgabe.`,
        },
      ],
    })

    const promptText = (
      message.content[0].type === 'text' ? message.content[0].text : ''
    ).replace(/\[ENDE\]\s*$/, '').trimEnd()

    return NextResponse.json({ prompt: promptText, remaining })
  } catch (err) {
    console.error('[prompts/generate] error:', err)
    return NextResponse.json({ error: 'Fehler bei der Prompt-Generierung.' }, { status: 500 })
  }
}
