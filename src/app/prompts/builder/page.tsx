import type { Metadata } from 'next'
import BuilderClient from './BuilderClient'

export const metadata: Metadata = {
  title: 'Prompt Builder',
  description: 'KI-Prompts für juristische Aufgaben in wenigen Schritten generieren — optimiert für Steuerrecht, M&A, Gesellschaftsrecht und Venture Capital.',
  alternates: { canonical: 'https://www.lex-lab.de/prompts/builder' },
  openGraph: {
    title: 'Prompt Builder — LexLab',
    description: 'KI-Prompts für juristische Aufgaben in wenigen Schritten generieren — optimiert für den deutschen Rechtsmarkt.',
  },
}

export default function BuilderPage() {
  return <BuilderClient />
}
