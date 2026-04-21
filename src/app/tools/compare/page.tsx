import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { COMPARE_PAIRS } from './config'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'KI-Tool Vergleiche',
  description: 'Kuratierte Vergleiche der wichtigsten KI-Tools für den deutschen Rechts- und Steuermarkt — Harvey vs. Luminance, Copilot vs. Harvey, ChatGPT vs. Claude und mehr.',
  openGraph: {
    title: 'LexLab Compare — KI-Tools direkt verglichen',
    description: 'Kuratierte Vergleiche der wichtigsten KI-Tools für DACH-Kanzleien.',
  },
  alternates: { canonical: 'https://www.lex-lab.de/tools/compare' },
}

export default function ComparePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">

      {/* ─── Hero ─── */}
      <section className="pt-14 pb-12 max-w-3xl">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          LexLab Compare
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-[#111827] leading-tight tracking-tight mb-5">
          KI-Tools direkt verglichen.
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">
          Kuratierte Gegenüberstellungen für die häufigsten Entscheidungsfragen im DACH-Rechtsmarkt — mit Score-Vergleich, klarer Orientierung und LexLab-Einschätzung.
        </p>
      </section>

      {/* ─── Compare pair grid ─── */}
      <section className="mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMPARE_PAIRS.map(pair => (
            <Link
              key={pair.pair}
              href={`/tools/compare/${pair.pair}`}
              className="group flex flex-col bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm rounded-2xl p-5 transition-all"
            >
              {/* Eyebrow */}
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                {pair.eyebrow}
              </p>

              {/* Title */}
              <h2 className="font-display text-xl text-[#111827] leading-tight mb-2 group-hover:underline">
                {pair.toolA.name}
                <span className="text-gray-300 font-normal mx-2">vs.</span>
                {pair.toolB.name}
              </h2>

              {/* Intro */}
              <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">
                {pair.intro}
              </p>

              {/* Score chips */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5">
                  <span className="text-xs font-semibold text-[#111827]">{pair.toolA.scores.total}</span>
                  <span className="text-[10px] text-gray-400">{pair.toolA.name.split(' ')[0]}</span>
                </div>
                <span className="text-gray-200 text-xs">vs.</span>
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5">
                  <span className="text-xs font-semibold text-[#111827]">{pair.toolB.scores.total}</span>
                  <span className="text-[10px] text-gray-400">{pair.toolB.name.split(' ')[0]}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-400 group-hover:text-[#111827] transition-colors">
                Vergleich lesen
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Method note ─── */}
      <section className="mb-16 max-w-3xl">
        <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Methodik</p>
          <p className="text-sm text-gray-500 leading-relaxed">
            Alle Vergleiche basieren auf dem LexLab Score — fünf gewichteten Dimensionen (Praxisreife, DACH-Relevanz, Datenschutz, UX, Preis-Leistung). Scores und Einschätzungen werden regelmäßig aktualisiert.{' '}
            <Link href="/method#score" className="text-gray-400 hover:text-gray-700 underline underline-offset-2 transition-colors">
              Score-Methodik →
            </Link>
          </p>
        </div>
      </section>

      {/* ─── Bottom CTAs ─── */}
      <section className="border-t border-gray-100 pt-8 pb-16 max-w-3xl">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Weiter entdecken</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/tools/finder"
            className="flex items-center justify-between gap-2 bg-white border border-gray-100 hover:border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 hover:text-[#111827] transition-all group"
          >
            <span className="font-medium">Persönliche Empfehlung</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#111827] flex-shrink-0 transition-colors" />
          </Link>
          <Link
            href="/collections"
            className="flex items-center justify-between gap-2 bg-white border border-gray-100 hover:border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 hover:text-[#111827] transition-all group"
          >
            <span className="font-medium">Kuratierte Shortlists</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#111827] flex-shrink-0 transition-colors" />
          </Link>
          <Link
            href="/tools"
            className="flex items-center justify-between gap-2 bg-white border border-gray-100 hover:border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 hover:text-[#111827] transition-all group"
          >
            <span className="font-medium">Alle Tools</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#111827] flex-shrink-0 transition-colors" />
          </Link>
        </div>
      </section>

    </div>
  )
}
