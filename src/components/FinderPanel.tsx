import Link from 'next/link'

interface FinderPanelProps {
  compact?: boolean
}

export function FinderPanel({ compact = false }: FinderPanelProps) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl ${
        compact ? 'px-5 py-4' : 'px-6 py-6 sm:px-8 sm:py-7'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Persönliche Empfehlung
          </div>
          <p
            className={`font-display text-gray-900 leading-snug ${
              compact ? 'text-lg' : 'text-xl sm:text-[22px]'
            }`}
          >
            Welches KI-Tool passt zu deiner Praxis?
          </p>
          <p
            className={`text-gray-500 mt-1.5 leading-relaxed ${
              compact ? 'text-xs' : 'text-sm'
            }`}
          >
            {compact
              ? '4 Fragen — deine persönliche Tool-Empfehlung, sofort.'
              : '4 Fragen zu deinem Fachgebiet, Anwendungsfall und Datenschutzbedarf — kostenlos, ohne Registrierung.'}
          </p>
        </div>
        <Link
          href="/tools/finder"
          className={`flex-shrink-0 inline-flex items-center gap-2 bg-[#111827] hover:bg-[#1a2234] text-white font-medium rounded-xl transition-colors whitespace-nowrap self-start sm:self-auto ${
            compact ? 'text-sm px-4 py-2' : 'text-sm px-5 py-2.5'
          }`}
        >
          Empfehlung starten →
        </Link>
      </div>
    </div>
  )
}
