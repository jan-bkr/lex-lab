import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, EyeOff } from 'lucide-react'
import {
  SKILL_BIBLIOTHEK_INTRO,
  SKILL_BIBLIOTHEK_PRINCIPLES,
  PRIVATE_PROJECT_NOTICE,
} from '@/lib/skill-bibliothek'

export const metadata: Metadata = {
  title: 'Skill-Bibliothek',
  description:
    'Arbeitsanleitungen für KI-Assistenten, fachlich verantwortet wie ein Kommentar: wie Kanzleiwissen für die KI verbindlich wird, wo das Sprachmodell nicht rechnet und was beim Berufsträger bleibt.',
  alternates: { canonical: 'https://www.lex-lab.de/skill-bibliothek' },
  openGraph: {
    title: 'Skill-Bibliothek — LexLab',
    description:
      'Arbeitsanleitungen für KI-Assistenten, fachlich verantwortet wie ein Kommentar. Was die Bibliothek kann und wo ihre Grenzen liegen.',
    url: 'https://www.lex-lab.de/skill-bibliothek',
  },
}

// ─── Statische Inhalte ────────────────────────────────────────────────────────

const NOT_SHOWN = [
  'Inhalte einzelner Anleitungen',
  'Umfang der Bibliothek und Fachgebiete',
  'Beispiele aus Mandaten oder Transaktionen',
]

const RELATED = [
  {
    href: '/schwerpunkte/langdock',
    title: 'Langdock',
    desc: 'Plattform, die Sprachmodelle, Anleitungen und Integrationen bündelt.',
  },
  {
    href: '/schwerpunkte/klardaten',
    title: 'Klardaten',
    desc: 'Verbindet DATEV über definierte Schnittstellen mit KI-Werkzeugen.',
  },
  {
    href: '/research/legal-model-benchmark',
    title: 'Legal Model Benchmark',
    desc: 'Welche Sprachmodelle für juristische Arbeit taugen.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SkillBibliothekPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">

      {/* ─── Header ─── */}
      <section className="pt-14 pb-12 max-w-3xl">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-4">Das Projekt</p>
        <h1 className="font-display text-4xl sm:text-5xl text-[#111827] leading-tight tracking-tight">
          Die Skill-Bibliothek
        </h1>
        <p className="font-display text-xl sm:text-2xl text-gray-700 leading-snug mt-6">
          {SKILL_BIBLIOTHEK_INTRO}
        </p>
        <p className="text-sm text-gray-500 leading-relaxed mt-4">
          Diese Seite beschreibt, was die Bibliothek leistet. Was in ihr steht, bleibt in der Kanzlei.
        </p>
      </section>

      {/* ─── Fünf Grundsätze ─── */}
      <section className="mb-16" aria-labelledby="grundsaetze-heading">
        <h2 id="grundsaetze-heading" className="sr-only">Was die Bibliothek leistet</h2>
        <ol className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-100 overflow-hidden">
          {SKILL_BIBLIOTHEK_PRINCIPLES.map((principle, index) => (
            <li key={principle.label} className="grid grid-cols-1 sm:grid-cols-[12rem_minmax(0,1fr)] gap-2 sm:gap-8 px-5 sm:px-8 py-6 sm:py-7">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-2xl text-blue-600 leading-none tabular-nums">{index + 1}</span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{principle.label}</span>
              </div>
              <p className="text-base sm:text-lg text-[#111827] leading-relaxed">{principle.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ─── Grenzen ─── */}
      <section className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <EyeOff className="w-4 h-4 text-gray-400" />
            <h2 className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Was hier bewusst fehlt</h2>
          </div>
          <ul className="space-y-2 mb-5">
            {NOT_SHOWN.map(item => (
              <li key={item} className="flex gap-2 text-sm text-gray-700">
                <span className="text-gray-300">—</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 leading-relaxed">
            Gründe sind die anwaltliche Verschwiegenheit nach § 43a Abs. 2 BRAO und der Schutz interner Arbeitsweisen der Kanzlei.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-4">Einordnung</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{PRIVATE_PROJECT_NOTICE}</p>
          <p className="text-sm text-gray-500 leading-relaxed mt-3">
            Die Seite beschreibt ein Vorgehen. Sie bietet keine Leistungen an und ist keine Rechtsberatung.
          </p>
        </div>
      </section>

      {/* ─── Weiterlesen ─── */}
      <section className="border-t border-gray-100 pt-8 pb-16">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Dazu auf LexLab</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {RELATED.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-white border border-gray-100 hover:border-gray-200 rounded-xl p-5 transition-all"
            >
              <p className="flex items-center justify-between gap-2 text-sm font-semibold text-gray-800 group-hover:text-[#111827]">
                {item.title}
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#111827] transition-colors" />
              </p>
              <p className="text-xs text-gray-500 leading-relaxed mt-1.5">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
