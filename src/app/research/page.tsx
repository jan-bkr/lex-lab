import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, TrendingUp, BarChart2, Newspaper, BookOpen, Scale } from 'lucide-react'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'LexLab Research',
  description: 'Marktintelligenz für den deutschen Rechts- und Steuermarkt — State of Legal AI, Radar-Signale, News und kuratierte Einordnung.',
  openGraph: {
    title: 'LexLab Research — Marktintelligenz für den Rechtsmarkt',
    description: 'State of Legal AI Germany 2026, Radar-Signale und kuratierte Marktbeobachtung.',
  },
  alternates: { canonical: 'https://www.lex-lab.de/research' },
}

// ─── Research modules ──────────────────────────────────────────────────────────

const MODULES = [
  {
    href: '/state-of-legal-ai',
    badge: 'Neu',
    icon: BookOpen,
    title: 'State of Legal AI Germany 2026',
    desc: 'Marktanalyse, Marktsegmente, Red Flags und Auswahlframework für den deutschen Rechts- und Steuermarkt. Ca. 12 Minuten Lesezeit.',
    meta: 'LexLab Research · Edition 2026',
    featured: true,
  },
  {
    href: '/research/legal-model-benchmark',
    badge: '24h Sync',
    icon: Scale,
    title: 'Legal AI Model Benchmark',
    desc: 'Aktueller Modellvergleich für juristische Aufgaben — Zuverlässigkeit, Nutzbarkeit, Kosten und Mandatsdaten-Check.',
    meta: 'Neue Tests automatisch',
    featured: false,
  },
  {
    href: '/radar',
    badge: 'Laufend',
    icon: BarChart2,
    title: 'LexLab Radar',
    desc: 'Kuratierte Marktsignale mit LexLab-Einschätzung: neue Tools, Feature-Updates, Pricing-Änderungen, regulatorische Entwicklungen und Marktbewegungen.',
    meta: 'Regelmäßig aktualisiert',
    featured: false,
  },
  {
    href: '/news',
    badge: 'Täglich',
    icon: Newspaper,
    title: 'Kuratierte News',
    desc: 'Täglich kuratierte Meldungen aus Rechtsprechung, Gesetzgebung und Legal-Tech-Markt — KI-zusammengefasst, manuell ausgewählt.',
    meta: 'Täglich kuratiert',
    featured: false,
  },
  {
    href: '/beitraege',
    badge: 'Editorial',
    icon: TrendingUp,
    title: 'Beiträge & Einblicke',
    desc: 'Einordnungen, Perspektiven und Hintergrundberichte vom LexLab-Team — über KI im Rechtsmarkt, Plattform-Entwicklung und Methodologie.',
    meta: 'Von Jan Becker, Rechtsanwalt',
    featured: false,
  },
]

// ─── Research principles ───────────────────────────────────────────────────────

const PRINCIPLES = [
  {
    title: 'Einordnung statt Nachricht',
    body: 'LexLab Research bewertet und gewichtet — jedes Signal erhält eine LexLab-Einschätzung mit Handlungsrelevanz für DACH-Kanzleien.',
  },
  {
    title: 'DACH-Praxisrelevanz als Filter',
    body: 'Nicht jede globale KI-Entwicklung ist für den deutschen Rechtsmarkt relevant. Wir filtern konsequent nach lokaler Handlungsrelevanz.',
  },
  {
    title: 'Keine Content-Masse',
    body: 'LexLab Research priorisiert Qualität über Quantität. Wenige starke Signale sind wertvoller als ein unkontrollierter Nachrichten-Feed.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResearchPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">

      {/* ─── Hero ─── */}
      <section className="pt-14 pb-12 max-w-3xl">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          LexLab Research
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-[#111827] leading-tight tracking-tight mb-5">
          Marktintelligenz<br className="hidden sm:block" /> für den Rechtsmarkt.
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">
          Kuratierte Einordnung, keine Content-Masse. LexLab Research beobachtet den DACH-Legal-AI-Markt und destilliert, was für Kanzleien, Steuerberater und Inhouse-Teams handlungsrelevant ist.
        </p>
      </section>

      {/* ─── Featured module ─── */}
      <section className="mb-6 max-w-3xl">
        {MODULES.filter(m => m.featured).map(m => (
          <Link
            key={m.href}
            href={m.href}
            className="group block bg-[#111827] rounded-2xl p-6 sm:p-8 hover:opacity-95 transition-opacity"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded px-1.5 py-0.5 uppercase tracking-wide">
                  {m.badge}
                </span>
                <span className="text-xs text-white/40">{m.meta}</span>
              </div>
              <m.icon className="w-4 h-4 text-white/20 flex-shrink-0" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-white leading-tight mb-3">
              {m.title}
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              {m.desc}
            </p>
            <div className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 group-hover:text-white transition-colors">
              Report lesen
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        ))}
      </section>

      {/* ─── Other modules ─── */}
      <section className="mb-16 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MODULES.filter(m => !m.featured).map(m => (
            <Link
              key={m.href}
              href={m.href}
              className="group flex flex-col bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm rounded-2xl p-5 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-semibold text-gray-400 bg-gray-50 border border-gray-100 rounded px-1.5 py-0.5 uppercase tracking-wide">
                  {m.badge}
                </span>
                <m.icon className="w-3.5 h-3.5 text-gray-200" />
              </div>
              <h3 className="font-semibold text-[#111827] text-sm mb-2 leading-snug group-hover:underline">
                {m.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed flex-1 mb-3">
                {m.desc}
              </p>
              <span className="text-xs text-gray-400 group-hover:text-[#111827] transition-colors flex items-center gap-1">
                {m.meta} <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Research principles ─── */}
      <section className="mb-16 max-w-3xl">
        <div className="mb-6">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Ansatz</p>
          <h2 className="font-display text-2xl text-[#111827] tracking-tight">
            Wie LexLab Research funktioniert
          </h2>
        </div>
        <div className="space-y-0 divide-y divide-gray-100 border-t border-b border-gray-100">
          {PRINCIPLES.map((p, i) => (
            <div key={i} className="py-4 flex gap-5">
              <span className="font-mono text-xs text-gray-200 flex-shrink-0 pt-0.5">0{i + 1}</span>
              <div>
                <p className="text-sm font-semibold text-[#111827] mb-1">{p.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Newsletter CTA ─── */}
      <section className="mb-16 max-w-3xl">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="text-sm font-semibold text-[#111827] mb-1">Research-Updates per E-Mail</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Neue Radar-Signale, State-of-Legal-AI-Updates und kurierte Marktbeobachtungen — wöchentlich zusammengefasst.
            </p>
          </div>
          <Link
            href="/newsletter"
            className="inline-flex items-center gap-1.5 bg-[#111827] hover:bg-[#1a2234] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex-shrink-0"
          >
            Newsletter
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ─── Bottom CTAs ─── */}
      <section className="border-t border-gray-100 pt-8 pb-16 max-w-3xl">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Weiter entdecken</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/tools"
            className="flex items-center justify-between gap-2 bg-white border border-gray-100 hover:border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 hover:text-[#111827] transition-all group"
          >
            <span className="font-medium">Tool-Verzeichnis</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#111827] flex-shrink-0 transition-colors" />
          </Link>
          <Link
            href="/tools/compare"
            className="flex items-center justify-between gap-2 bg-white border border-gray-100 hover:border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 hover:text-[#111827] transition-all group"
          >
            <span className="font-medium">Tool-Vergleiche</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#111827] flex-shrink-0 transition-colors" />
          </Link>
          <Link
            href="/method"
            className="flex items-center justify-between gap-2 bg-white border border-gray-100 hover:border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 hover:text-[#111827] transition-all group"
          >
            <span className="font-medium">LexLab Method</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#111827] flex-shrink-0 transition-colors" />
          </Link>
        </div>
      </section>

    </div>
  )
}
