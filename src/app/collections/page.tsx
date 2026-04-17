import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Layers, Briefcase, ShieldCheck, Calculator, Building2, Rocket } from 'lucide-react'
import { COLLECTIONS, CollectionDef } from './config'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Kuratierte Tool-Listen',
  description: 'Von LexLab zusammengestellte Tool-Shortlists für konkrete Anforderungen im deutschen Rechts- und Steuermarkt — M&A, Steuerrecht, Datenschutz, Inhouse.',
  openGraph: {
    title: 'Kuratierte KI-Tool-Listen — LexLab',
    description: 'Von LexLab zusammengestellte Tool-Shortlists für konkrete Anforderungen im deutschen Rechts- und Steuermarkt.',
  },
}

// ─── Theme config ──────────────────────────────────────────────────────────────

const themeConfig: Record<CollectionDef['theme'], {
  icon: React.ReactNode
  bg: string
  border: string
  borderLeft: string
  badgeColor: string
  badgeBg: string
  ctaHover: string
}> = {
  purple: {
    icon: <Briefcase className="w-5 h-5 text-purple-600" />,
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    borderLeft: 'border-l-purple-400',
    badgeColor: 'text-purple-700',
    badgeBg: 'bg-purple-50 border-purple-100',
    ctaHover: 'hover:text-purple-700',
  },
  emerald: {
    icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    borderLeft: 'border-l-emerald-400',
    badgeColor: 'text-emerald-700',
    badgeBg: 'bg-emerald-50 border-emerald-100',
    ctaHover: 'hover:text-emerald-700',
  },
  blue: {
    icon: <Building2 className="w-5 h-5 text-blue-600" />,
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    borderLeft: 'border-l-blue-400',
    badgeColor: 'text-blue-700',
    badgeBg: 'bg-blue-50 border-blue-100',
    ctaHover: 'hover:text-blue-700',
  },
  amber: {
    icon: <Rocket className="w-5 h-5 text-amber-600" />,
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    borderLeft: 'border-l-amber-400',
    badgeColor: 'text-amber-700',
    badgeBg: 'bg-amber-50 border-amber-100',
    ctaHover: 'hover:text-amber-700',
  },
  gray: {
    icon: <Calculator className="w-5 h-5 text-gray-500" />,
    bg: 'bg-gray-50',
    border: 'border-gray-100',
    borderLeft: 'border-l-gray-300',
    badgeColor: 'text-gray-600',
    badgeBg: 'bg-gray-50 border-gray-200',
    ctaHover: 'hover:text-gray-800',
  },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CollectionsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">

      {/* ─── Header ─── */}
      <section className="pt-14 pb-10 border-b border-gray-100">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            <Layers className="w-3.5 h-3.5 text-gray-400" />
            Kuratierte Listen
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-gray-900 leading-tight tracking-tight mb-4">
            Tool-Shortlists für konkrete Anforderungen
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            Von LexLab zusammengestellte Shortlists für M&A-Teams, Steuerberater, datenschutzbewusste Kanzleien und mehr — nach Anforderungsprofil gefiltert, nicht nach Alphabet.
          </p>
        </div>
      </section>

      {/* ─── Collections grid ─── */}
      <section className="py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {COLLECTIONS.map(collection => {
            const theme = themeConfig[collection.theme]
            return (
              <Link
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className={`group flex flex-col bg-white border border-gray-100 border-l-4 ${theme.borderLeft} rounded-xl p-6 hover:shadow-sm hover:border-gray-200 transition-all duration-150`}
              >
                {/* Icon + Eyebrow */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${theme.bg} border ${theme.border} flex-shrink-0`}>
                    {theme.icon}
                  </div>
                  <span className={`text-xs font-semibold border rounded-full px-2.5 py-0.5 ${theme.badgeColor} ${theme.badgeBg}`}>
                    {collection.eyebrow}
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-display font-semibold text-lg text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                  {collection.title}
                </h2>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">
                  {collection.description}
                </p>

                {/* Benefit */}
                <div className="flex items-start gap-2 mb-5">
                  <span className="text-green-600 text-sm mt-0.5 flex-shrink-0 font-bold leading-snug">✓</span>
                  <p className="text-sm text-gray-800 font-semibold leading-snug">{collection.benefit}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-[11px] text-gray-400">Kuratiert von LexLab</span>
                  <span className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                    Shortlist ansehen <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ─── Bottom note ─── */}
      <section className="py-8 border-t border-gray-100 mb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Listen werden regelmäßig aktualisiert, wenn neue Tools bewertet werden.{' '}
              <Link href="/tools" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">
                Alle Tools im Verzeichnis →
              </Link>
            </p>
          </div>
          <Link
            href="/tools/finder"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            Persönliche Empfehlung →
          </Link>
        </div>
      </section>

    </div>
  )
}
