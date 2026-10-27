import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Mail, RefreshCw, Scale } from 'lucide-react'
import { ToolCard } from '@/components/ToolCard'
import { NewsletterForm } from '@/components/NewsletterForm'
import { adminSupabase } from '@/lib/supabase/admin'
import { getLegalModelBenchmark } from '@/lib/legal-model-benchmark'
import { SKILL_BIBLIOTHEK_INTRO, SKILL_BIBLIOTHEK_PRINCIPLES, PRIVATE_PROJECT_NOTICE } from '@/lib/skill-bibliothek'
import { SCHWERPUNKTE } from '@/app/schwerpunkte/config'
import { NEWSLETTER_PAUSED, NEWSLETTER_PAUSED_NOTE } from '@/lib/site-status'
import { Rechtsgebiet, Tool } from '@/types'

export const revalidate = 3600

export const metadata: Metadata = {
  title: { absolute: 'LexLab — Skill-Bibliothek, Langdock, Klardaten & Legal AI Benchmark' },
  description: 'Wie Kanzleiwissen für KI-Assistenten verbindlich wird: der Aufbau einer Skill-Bibliothek, Einordnungen zu Langdock und Klardaten und ein Benchmark juristischer Sprachmodelle. Privates Projekt von Jan Becker, Rechtsanwalt.',
  alternates: { canonical: 'https://www.lex-lab.de' },
  openGraph: {
    title: 'LexLab — Kanzleiwissen, verbindlich für die KI',
    description: 'Der Aufbau einer Skill-Bibliothek für KI-Assistenten in der Kanzlei, dazu Langdock, Klardaten und ein Benchmark juristischer Sprachmodelle.',
  },
}

// ─── DB row → domain type mappers ─────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTool(r: any): Tool {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    url: r.url ?? '#',
    tagline: r.tagline ?? '',
    description: r.description ?? '',
    rechtsgebiet: (r.rechtsgebiet ?? []) as Rechtsgebiet[],
    category: r.category ?? [],
    votes: r.votes ?? 0,
    isNew: r.is_new ?? false,
    createdAt: r.created_at,
  }
}

// ─── Structured data ──────────────────────────────────────────────────────────

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'LexLab',
  url: 'https://www.lex-lab.de',
  description: 'Skill-Bibliothek für KI-Assistenten in der Kanzlei, Einordnungen zu Langdock und Klardaten und Legal AI Model Benchmark',
  inLanguage: 'de-DE',
  author: {
    '@type': 'Person',
    name: 'Jan Becker',
    jobTitle: 'Rechtsanwalt',
    sameAs: ['https://www.linkedin.com/in/jan-niklas-becker'],
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.lex-lab.de/tools?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [toolsRes, legalBenchmark] = await Promise.all([
    adminSupabase.from('tools').select('id, name, slug, url, tagline, description, rechtsgebiet, category, votes, is_new, created_at').eq('status', 'approved').order('votes', { ascending: false }).limit(3),
    getLegalModelBenchmark(),
  ])

  // Map without mock fallbacks — section is hidden when data is absent
  const topTools: Tool[] = toolsRes.data?.length ? toolsRes.data.map(mapTool) : []

  const benchmarkPreview = legalBenchmark.rows.slice(0, 5)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }} />

      {/* HERO */}
      <section className="pt-16 pb-14 max-w-3xl">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-5">
          LexLab · Privates Projekt von Jan Becker, Rechtsanwalt
        </p>
        <h1 className="font-display text-5xl sm:text-6xl text-[#111827] leading-[1.05] tracking-tight">
          Kanzleiwissen, verbindlich für die KI.
        </h1>
        <p className="mt-6 text-lg text-gray-500 leading-relaxed">
          LexLab zeigt, wie in einer Kanzlei eine Skill-Bibliothek für KI-Assistenten entsteht, und ordnet ein, was dafür gebraucht wird: Plattformen wie Langdock, Datenzugänge wie Klardaten und Sprachmodelle, die juristischer Arbeit standhalten.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link href="/skill-bibliothek" className="inline-flex items-center justify-center gap-2 bg-[#111827] hover:bg-[#1a2234] text-white font-medium px-5 py-2.5 rounded-xl transition-colors text-sm">
            Zur Skill-Bibliothek <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/research/legal-model-benchmark" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium px-5 py-2.5 rounded-xl border border-gray-200 transition-colors text-sm">
            Legal Model Benchmark
          </Link>
        </div>
      </section>

      {/* SKILL-BIBLIOTHEK */}
      <section className="mb-14 bg-white border border-gray-100 rounded-[1.75rem] p-6 sm:p-9 lg:p-11" aria-labelledby="skill-heading">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600 mb-3">Das Projekt</p>
            <h2 id="skill-heading" className="font-display text-3xl sm:text-4xl text-[#111827] leading-tight tracking-tight">
              {SKILL_BIBLIOTHEK_INTRO}
            </h2>
          </div>
          <Link href="/skill-bibliothek" className="group inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#111827] transition-colors flex-shrink-0">
            Mehr zur Skill-Bibliothek <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
          {SKILL_BIBLIOTHEK_PRINCIPLES.map((principle, index) => (
            <li key={principle.label} className="bg-white p-5 sm:p-6">
              <div className="flex items-baseline gap-2.5 mb-3">
                <span className="font-display text-xl text-blue-600 leading-none tabular-nums">{index + 1}</span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{principle.label}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{principle.text}</p>
            </li>
          ))}
          <li className="bg-gray-50 p-5 sm:p-6 flex flex-col justify-between gap-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              Keine Inhalte einzelner Anleitungen, keine Angaben zu Umfang oder Fachgebieten, keine Beispiele aus Mandaten.
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">{PRIVATE_PROJECT_NOTICE}</p>
          </li>
        </ol>
      </section>

      {/* SCHWERPUNKTE */}
      <section className="mb-14" aria-labelledby="schwerpunkte-heading">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-4">
          <h2 id="schwerpunkte-heading" className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Schwerpunkte</h2>
          <p className="text-xs text-gray-400">In der Kanzlei haben wir uns für beide entschieden. Keine Kooperation, keinerlei Vorteile.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCHWERPUNKTE.map(s => (
            <Link
              key={s.slug}
              href={`/schwerpunkte/${s.slug}`}
              className="group bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md rounded-2xl p-6 sm:p-7 transition-all"
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">{s.eyebrow}</p>
              <p className="font-display text-2xl text-[#111827] mb-2">{s.name}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{s.intro}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-gray-600 group-hover:text-[#111827] transition-colors">
                Einordnung lesen <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* LEGAL AI MODEL BENCHMARK */}
      <section
        className="relative overflow-hidden bg-[#0b1220] rounded-[1.75rem] px-5 py-7 sm:p-9 lg:p-11 mb-14"
        aria-labelledby="legal-benchmark-heading"
      >
        <div className="absolute -right-28 -top-32 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-32 -bottom-40 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-7 mb-9">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-400">LexLab Legal AI Benchmark</span>
                <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2 py-1 uppercase tracking-wide">
                  <RefreshCw className="w-2.5 h-2.5" /> täglich aktualisiert
                </span>
              </div>
              <h2 id="legal-benchmark-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.08] tracking-tight">
                Welches KI-Modell ist wirklich gut für juristische Arbeit?
              </h2>
              <p className="text-sm sm:text-base text-white/55 leading-relaxed mt-5 max-w-xl">
                ChatGPT, Claude, Gemini und weitere Modelle im Legal-Vergleich: Wie viele Vertragsaufgaben lösen sie vollständig richtig, und was kostet das?
              </p>
            </div>

            <div className="grid grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3 lg:min-w-56 xl:min-w-[25rem]">
              <div className="rounded-xl bg-white/[0.06] border border-white/10 px-3 py-3.5">
                <p className="font-display text-2xl text-white leading-none">{legalBenchmark.rows.length}</p>
                <p className="text-[9px] text-white/35 uppercase tracking-wider mt-1.5">Modelle</p>
              </div>
              <div className="rounded-xl bg-white/[0.06] border border-white/10 px-3 py-3.5">
                <p className="font-display text-2xl text-white leading-none">2×</p>
                <p className="text-[9px] text-white/35 uppercase tracking-wider mt-1.5">Je Aufgabe</p>
              </div>
              <div className="rounded-xl bg-white/[0.06] border border-white/10 px-3 py-3.5">
                <p className="text-xs sm:text-sm font-semibold text-white leading-none truncate">{legalBenchmark.sourceUpdatedAt}</p>
                <p className="text-[9px] text-white/35 uppercase tracking-wider mt-2">Datenstand</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_0.55fr] gap-5">
            <div className="rounded-2xl bg-white/[0.045] border border-white/10 overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-white/10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/45">Aktuelle Top 5</p>
                <p className="text-[10px] text-white/30">Aufgaben bestanden</p>
              </div>
              <div className="divide-y divide-white/[0.07]">
                {benchmarkPreview.map(row => (
                  <div key={`${row.provider}-${row.model}`} className="grid grid-cols-[1.5rem_minmax(0,1fr)_3.25rem] sm:grid-cols-[2rem_minmax(0,1fr)_minmax(7rem,0.7fr)_3.5rem] items-center gap-3 px-4 sm:px-5 py-3.5">
                    <span className={`text-xs font-semibold ${row.rank === 1 ? 'text-blue-300' : 'text-white/30'}`}>{row.rank}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{row.model}</p>
                      <p className="text-[10px] text-white/35 mt-0.5">{row.provider}</p>
                    </div>
                    <div className="hidden sm:block h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300" style={{ width: `${row.taskPass}%` }} />
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-right text-white">{row.taskPass.toFixed(1).replace('.', ',')} %</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-2xl bg-blue-500/10 border border-blue-400/20 p-5 flex-1">
                <Scale className="w-5 h-5 text-blue-300 mb-4" />
                <p className="font-display text-xl text-white leading-tight">Mehr als eine Rangliste</p>
                <p className="text-xs text-white/45 leading-relaxed mt-2">
                  Einordnung für Kanzleien: Kriterien-Quote, Form, Kosten, Mandatsdaten-Risiken sowie ergänzende Signale von Arena und METR.
                </p>
              </div>
              <Link
                href="/research/legal-model-benchmark"
                className="group inline-flex items-center justify-between gap-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl px-5 py-4 transition-colors"
              >
                Vollständigen Benchmark öffnen
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/state-of-legal-ai" className="text-xs text-white/40 hover:text-white/70 transition-colors text-center">
                Dazu: State of Legal AI Germany 2026 →
              </Link>
            </div>
          </div>

          <p className="text-[10px] text-white/25 leading-relaxed mt-5">
            Die Rangliste ist ein Orientierungspunkt aus englischsprachigen, US-/UK-lastigen Aufgaben und ersetzt keine eigene Prüfung für Rechtsgebiet, Datenschutz und konkreten Anwendungsfall.
          </p>
        </div>
      </section>

      {/* TOOLS */}
      {topTools.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-xl text-gray-900">Aus dem Tool-Verzeichnis</h2>
              <p className="text-sm text-gray-500 mt-1">KI-Werkzeuge für den Rechts- und Steuermarkt, bewertet nach der LexLab Method.</p>
            </div>
            <Link href="/tools" className="text-sm text-gray-600 hover:text-[#111827] font-medium flex items-center gap-1 flex-shrink-0">
              Alle Tools <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topTools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
          </div>
        </section>
      )}

      {/* NEWSLETTER CTA */}
      <section className="bg-white border border-gray-100 rounded-2xl p-8 mb-16 text-center">
        <h2 className="font-display text-2xl text-gray-900 mb-2 flex items-center justify-center gap-2">
          <Mail className="w-5 h-5 text-gray-400" /> Neues von LexLab per E-Mail
          {NEWSLETTER_PAUSED && (
            <span className="font-sans text-[9px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 uppercase tracking-wide">Pausiert</span>
          )}
        </h2>
        <p className="text-gray-500 text-sm mb-6 max-w-xl mx-auto">
          {NEWSLETTER_PAUSED ? NEWSLETTER_PAUSED_NOTE : 'Neue Beiträge, Benchmark-Einordnungen und Notizen zum Aufbau der Skill-Bibliothek. Jederzeit abmeldbar.'}
        </p>
        <NewsletterForm />
        <p className="text-xs text-gray-400 mt-3">
          Mit der Anmeldung akzeptierst du unsere <a href="/datenschutz" className="underline hover:text-gray-600">Datenschutzerklärung</a>.
        </p>
      </section>
    </div>
  )
}
