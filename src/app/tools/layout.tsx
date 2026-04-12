import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KI-Tools für Juristen',
  description: 'Die größte kuratierte Datenbank für KI-Tools im deutschen Rechts- und Steuermarkt. Tools für Steuerrecht, M&A, Gesellschaftsrecht und Venture Capital.',
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
