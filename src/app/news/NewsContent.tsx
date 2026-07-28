'use client'

import { useState } from 'react'
import Link from 'next/link'
import { NewsArticle } from '@/types'

const CATEGORIES = ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Legal Tech', 'Regulierung', 'Venture Capital']

// ─── Source badge styles ───────────────────────────────────────────────────────

const SOURCE_STYLES: Record<string, string> = {
  'BFH':                 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'BGH':                 'bg-blue-50 text-blue-700 border-blue-200',
  'BMF':                 'bg-amber-50 text-amber-700 border-amber-200',
  'JUVE':                'bg-orange-50 text-orange-700 border-orange-200',
  'LTO':                 'bg-gray-100 text-gray-600 border-gray-200',
  'Finance Magazin':     'bg-gray-100 text-gray-600 border-gray-200',
  'M&A Magazin':         'bg-purple-50 text-purple-700 border-purple-200',
  'Datenschutz-Notizen': 'bg-rose-50 text-rose-700 border-rose-200',
  'TaxTech Blog':        'bg-teal-50 text-teal-700 border-teal-200',
  'Gründerszene':        'bg-amber-50 text-amber-700 border-amber-200',
  'Startbase':           'bg-lime-50 text-lime-700 border-lime-200',
  'Deutsche Startups':   'bg-cyan-50 text-cyan-700 border-cyan-200',
}

const CATEGORY_STYLES: Record<string, string> = {
  'Steuerrecht':       'bg-green-50 text-green-700 border-green-200',
  'M&A':               'bg-purple-50 text-purple-700 border-purple-200',
  'Gesellschaftsrecht':'bg-blue-50 text-blue-700 border-blue-200',
  'Legal Tech':        'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Regulierung':       'bg-rose-50 text-rose-700 border-rose-200',
  'Venture Capital':   'bg-orange-50 text-orange-700 border-orange-200',
}

function relativeDate(dateStr: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins < 60)  return `vor ${mins} Min.`
  if (hours < 24) return `vor ${hours} Std.`
  if (days === 1) return 'Gestern'
  return `vor ${days} Tagen`
}

export default function NewsContent({ initialArticles }: { initialArticles: NewsArticle[] }) {
  const [activeFilter, setActiveFilter] = useState('Alle')

  const filtered = initialArticles
    .filter(a => activeFilter === 'Alle' || a.category === activeFilter)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
          Täglich kuratiert
        </div>
        <h1 className="font-display text-3xl text-gray-900">Aktuelles</h1>
        <p className="text-gray-500 mt-1.5 text-sm leading-relaxed max-w-xl">
          Ausgewählte Meldungen aus dem deutschen Rechts- und Steuermarkt — aus juristischen Fachquellen. Zusammenfassungen sind KI-generiert und dienen der Orientierung.
        </p>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {(['Alle', ...CATEGORIES]).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              activeFilter === cat
                ? 'bg-[#111827] text-white border-[#111827]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && initialArticles.length === 0 ? (
        <div className="text-center py-16 text-sm text-gray-400">
          Aktuell keine Meldungen verfügbar.
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-sm text-gray-400">
          Keine Artikel für diese Kategorie gefunden.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(article => {
            const sourceCls  = SOURCE_STYLES[article.sourceName]  ?? 'bg-gray-100 text-gray-600 border-gray-200'
            const catCls     = CATEGORY_STYLES[article.category]  ?? 'bg-gray-100 text-gray-500 border-gray-200'

            const cardContent = (
              <>
                {/* Top row: source + category + date */}
                <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                  {article.sourceName && (
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md border ${sourceCls}`}>
                      {article.sourceName}
                    </span>
                  )}
                  {article.category && (
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md border ${catCls}`}>
                      {article.category}
                    </span>
                  )}
                  <span className="ml-auto text-xs text-gray-400 tabular-nums">
                    {relativeDate(article.publishedAt)}
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-sans font-semibold text-[14px] leading-snug text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h2>

                {/* Summary */}
                {article.summary && (
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {article.summary}
                  </p>
                )}
              </>
            )

            return article.slug ? (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="group block bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-gray-200 transition-all duration-150 cursor-pointer"
              >
                {cardContent}
              </Link>
            ) : (
              <div
                key={article.id}
                className="group bg-white border border-gray-100 rounded-xl p-5"
              >
                {cardContent}
              </div>
            )
          })}
        </div>
      )}

      {/* Footer note */}
      {filtered.length > 0 && (
        <p className="mt-10 text-xs text-gray-400 text-center">
          Meldungen stammen aus juristischen Fachquellen. Zusammenfassungen sind KI-generiert — bitte stets die verlinkte Originalquelle prüfen.
        </p>
      )}

    </div>
  )
}
