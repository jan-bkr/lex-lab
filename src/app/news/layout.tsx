import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Legal Tech News',
  description: 'Täglich kuratierte KI-News aus Steuerrecht, M&A, Gesellschaftsrecht und Venture Capital.',
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
