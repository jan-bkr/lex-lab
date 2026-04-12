import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KI-Workflows für Juristen',
  description: 'Schritt-für-Schritt KI-Workflows für Due Diligence, Steuermemos, Term Sheet Reviews und mehr.',
}

export default function WorkflowsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
