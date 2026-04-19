import type { Metadata } from 'next'
import KontaktClient from './KontaktClient'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Fragen, Feedback oder Kooperationsanfragen — schreib uns direkt. LexLab, die kuratierte Plattform für KI-Tools im deutschen Rechtsmarkt.',
  alternates: { canonical: 'https://www.lex-lab.de/kontakt' },
  openGraph: {
    title: 'Kontakt — LexLab',
    description: 'Fragen, Feedback oder Kooperationsanfragen — schreib uns direkt.',
  },
}

export default function KontaktPage() {
  return <KontaktClient />
}
