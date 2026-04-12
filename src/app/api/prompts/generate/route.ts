import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { rechtsgebiet, aufgabe, sachverhalt, detailtiefe, sprache } = await req.json()

    if (!rechtsgebiet?.length || !aufgabe || !sachverhalt) {
      return NextResponse.json({ error: 'Fehlende Pflichtfelder.' }, { status: 400 })
    }

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

    return NextResponse.json({ prompt: promptText })
  } catch (err) {
    console.error('[prompts/generate] error:', err)
    return NextResponse.json({ error: 'Fehler bei der Prompt-Generierung.' }, { status: 500 })
  }
}
