import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prompt-Bibliothek für Juristen',
  description: 'Kopierfertige KI-Prompts für Steuerrecht, M&A, Gesellschaftsrecht und Venture Capital.',
}

export default function PromptsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
