import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Kontaktiere lex-lab.de — Fragen, Feedback oder Tool-Empfehlungen.',
}

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
