import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// ─── In-memory rate limiter (resets on server restart) ────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const DAILY_LIMIT = 10

export async function POST(req: NextRequest) {
  try {
    // ── Rate limiting ──
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'

    const now = Date.now()
    const midnight = new Date()
    midnight.setHours(24, 0, 0, 0)
    const resetAt = midnight.getTime()

    const current = rateLimitMap.get(ip)
    if (current && now < current.resetAt) {
      if (current.count >= DAILY_LIMIT) {
        return NextResponse.json(
          { error: 'RATE_LIMIT_EXCEEDED', limit: DAILY_LIMIT },
          { status: 429 }
        )
      }
      rateLimitMap.set(ip, { count: current.count + 1, resetAt: current.resetAt })
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt })
    }

    // ── Validate input ──
    const { rechtsgebiet, aufgabe, sachverhalt, detailtiefe, sprache } = await req.json()

    if (!rechtsgebiet?.length || !aufgabe || !sachverhalt) {
      return NextResponse.json({ error: 'Fehlende Pflichtfelder.' }, { status: 400 })
    }

    // ── Call Anthropic ──
    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1500,
      system: `Du bist ein erfahrener Rechtsanwalt und Steuerberater auf Partnerniveau einer führenden deutschen Wirtschaftskanzlei. Erstelle einen präzisen, professionellen Prompt der einen KI-Assistenten anweist, die beschriebene juristische Aufgabe auf höchstem Niveau zu bearbeiten. Der Prompt soll: (1) die KI in die richtige Rolle versetzen, (2) die Aufgabe klar strukturieren mit nummerierten Prüfungsschritten, (3) relevante Gesetze, Normen und Prüfungspunkte explizit nennen, (4) das gewünschte Ausgabeformat definieren, (5) einen Platzhalter [SACHVERHALT EINFÜGEN] für den konkreten Fall enthalten. Antworte NUR mit dem fertigen Prompt, ohne Erklärungen oder Präambel.`,
      messages: [
        {
          role: 'user',
          content: `Rechtsgebiet(e): ${rechtsgebiet.join(', ')}
Aufgabentyp: ${aufgabe}
Kontext/Sachverhalt: ${sachverhalt}
Detailtiefe: ${detailtiefe}
Sprache: ${sprache}

Erstelle den optimalen Prompt für diese juristische Aufgabe.`,
        },
      ],
    })

    const promptText =
      message.content[0].type === 'text' ? message.content[0].text : ''

    const remaining = DAILY_LIMIT - (rateLimitMap.get(ip)?.count ?? 1)

    return NextResponse.json({ prompt: promptText, remaining })
  } catch (err) {
    console.error('[prompts/generate] error:', err)
    return NextResponse.json({ error: 'Fehler bei der Prompt-Generierung.' }, { status: 500 })
  }
}
