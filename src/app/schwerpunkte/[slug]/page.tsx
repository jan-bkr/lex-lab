import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ExternalLink, ListChecks } from 'lucide-react'
import { SCHWERPUNKTE, getSchwerpunkt, schwerpunktDisclosure } from '../config'
import { PRIVATE_PROJECT_NOTICE } from '@/lib/skill-bibliothek'

export const dynamicParams = false

export function generateStaticParams() {
  return SCHWERPUNKTE.map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const s = getSchwerpunkt(slug)
  if (!s) return {}
  const url = `https://www.lex-lab.de/schwerpunkte/${s.slug}`
  return {
    title: `${s.name} für Kanzleien`,
    description: s.intro,
    alternates: { canonical: url },
    openGraph: {
      title: `${s.name} für Kanzleien — LexLab`,
      description: s.intro,
      url,
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SchwerpunktPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = getSchwerpunkt(slug)
  if (!s) notFound()

  const others = SCHWERPUNKTE.filter(o => o.slug !== s.slug)

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'LexLab', item: 'https://www.lex-lab.de' },
      { '@type': 'ListItem', position: 2, name: s.name, item: `https://www.lex-lab.de/schwerpunkte/${s.slug}` },
    ],
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      {/* ─── Header ─── */}
      <section className="pt-14 pb-10 max-w-3xl">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-4">{s.eyebrow}</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#111827] leading-tight tracking-tight">
          {s.headline}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed mt-5">{s.intro}</p>
        <a
          href={s.vendor.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#111827] transition-colors"
        >
          {s.vendor.name}, {s.vendor.seat} <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <p className="mt-5 text-xs text-gray-500 leading-relaxed bg-white border border-gray-100 rounded-xl px-4 py-3">
          {schwerpunktDisclosure(s.name)}
        </p>
      </section>

      {/* ─── Warum Schwerpunkt ─── */}
      <section className="mb-12 max-w-3xl">
        <div className="border-l-2 border-blue-600 pl-5 py-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Bezug zur Skill-Bibliothek</p>
          <p className="text-base text-[#111827] leading-relaxed">{s.relevance}</p>
          <Link
            href="/skill-bibliothek"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Zur Skill-Bibliothek <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ─── Herstellerangaben + Prüfpunkte ─── */}
      <section className="mb-12 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-5">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8">
          <h2 className="font-display text-xl text-[#111827] mb-1">Was {s.name} bietet</h2>
          <p className="text-xs text-gray-400 mb-6">Nach Angaben des Anbieters, Stand {s.asOf}</p>
          <div className="space-y-6">
            {s.vendorFacts.map(section => (
              <div key={section.title}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-3">{section.title}</p>
                <ul className="space-y-2">
                  {section.items.map(item => (
                    <li key={item} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                      <span className="text-gray-300 flex-shrink-0">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-1">
            <ListChecks className="w-4 h-4 text-gray-500" />
            <h2 className="font-display text-xl text-[#111827]">Vor dem Einsatz prüfen</h2>
          </div>
          <p className="text-xs text-gray-400 mb-6">Berufsrecht und Datenschutz, ohne Anspruch auf Vollständigkeit</p>
          <ul className="space-y-3">
            {s.checks.map(item => (
              <li key={item} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Quellen + Hinweis ─── */}
      <section className="mb-12 max-w-3xl">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Quellen</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
          {s.sources.map(src => (
            <li key={src.url}>
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#111827] transition-colors"
              >
                {src.label} <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-400 leading-relaxed">
          Die Angaben beruhen auf öffentlichen Informationen des Anbieters und sind nicht unabhängig geprüft. Sie sind keine Empfehlung für den Einzelfall und keine Rechtsberatung. {PRIVATE_PROJECT_NOTICE}
        </p>
      </section>

      {/* ─── Weiter ─── */}
      <section className="border-t border-gray-100 pt-8 pb-16">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Weitere Schwerpunkte</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/skill-bibliothek"
            className="flex items-center justify-between gap-2 bg-white border border-gray-100 hover:border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 hover:text-[#111827] transition-all group"
          >
            <span className="font-medium">Skill-Bibliothek</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#111827] flex-shrink-0 transition-colors" />
          </Link>
          {others.map(o => (
            <Link
              key={o.slug}
              href={`/schwerpunkte/${o.slug}`}
              className="flex items-center justify-between gap-2 bg-white border border-gray-100 hover:border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 hover:text-[#111827] transition-all group"
            >
              <span className="font-medium">{o.name}</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#111827] flex-shrink-0 transition-colors" />
            </Link>
          ))}
          <Link
            href="/research/legal-model-benchmark"
            className="flex items-center justify-between gap-2 bg-white border border-gray-100 hover:border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 hover:text-[#111827] transition-all group"
          >
            <span className="font-medium">Legal Model Benchmark</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#111827] flex-shrink-0 transition-colors" />
          </Link>
        </div>
      </section>

    </div>
  )
}
