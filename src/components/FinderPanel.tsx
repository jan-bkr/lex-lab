import Link from 'next/link'
import { Sparkles } from 'lucide-react'

interface FinderPanelProps {
  compact?: boolean
}

export function FinderPanel({ compact = false }: FinderPanelProps) {
  return (
    <div
      className={`bg-white border border-blue-100 rounded-2xl shadow-sm ${
        compact ? 'px-5 py-4' : 'px-6 py-6 sm:px-8 sm:py-7'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-[11px] font-semibold border border-blue-100 rounded-full px-2.5 py-0.5 mb-3">
            <Sparkles className="w-3 h-3 flex-shrink-0" />
            Empfohlen
          </div>
          <p
            className={`font-display text-gray-900 leading-snug ${
              compact ? 'text-lg' : 'text-xl sm:text-[22px]'
            }`}
          >
            Welches KI-Tool passt zu Ihrer Praxis?
          </p>
          <p
            className={`text-gray-500 mt-1.5 leading-relaxed ${
              compact ? 'text-xs' : 'text-sm'
            }`}
          >
            {compact
              ? '4 Fragen, persönliche Empfehlung — in unter 2 Minuten.'
              : 'In 4 Schritten zur personalisierten Tool-Empfehlung für Kanzleien und Rechtsteams — kostenlos, sofort, ohne Registrierung.'}
          </p>
        </div>
        <Link
          href="/tools/finder"
          className={`flex-shrink-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors whitespace-nowrap self-start sm:self-auto ${
            compact ? 'text-sm px-4 py-2' : 'text-sm px-5 py-2.5'
          }`}
        >
          Tool Finder starten →
        </Link>
      </div>
    </div>
  )
}
