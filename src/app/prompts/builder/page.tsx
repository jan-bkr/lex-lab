import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Compass, Grid3X3 } from 'lucide-react'
import { PROMPT_BUILDER_PAUSED } from '@/lib/site-status'
import BuilderClient from './BuilderClient'

export const metadata: Metadata = {
  title: 'Prompt Builder',
  description: 'KI-Prompts für juristische Aufgaben in wenigen Schritten generieren — optimiert für Steuerrecht, M&A, Gesellschaftsrecht und Venture Capital.',
  alternates: { canonical: 'https://www.lex-lab.de/prompts/builder' },
  openGraph: {
    title: 'Prompt Builder — LexLab',
    description: 'KI-Prompts für juristische Aufgaben in wenigen Schritten generieren — optimiert für den deutschen Rechtsmarkt.',
  },
}

// ─── Pausiert ─────────────────────────────────────────────────────────────────

const ALTERNATIVES = [
  {
    href: '/prompts',
    icon: BookOpen,
    title: 'Prompt-Bibliothek',
    desc: 'Kopierfertige Prompts für Steuerrecht, M&A, Gesellschaftsrecht und Venture Capital.',
  },
  {
    href: '/tools',
    icon: Grid3X3,
    title: 'KI-Tools entdecken',
    desc: 'Alle kuratierten Tools mit LexLab Score und DACH-Einordnung.',
  },
  {
    href: '/tools/finder',
    icon: Compass,
    title: 'Tool Finder',
    desc: 'Vier Fragen — eine persönliche Tool-Empfehlung.',
  },
]

function BuilderPaused() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
          In Überarbeitung
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-[#111827] leading-tight tracking-tight">
          Prompt Builder
        </h1>
        <p className="text-gray-500 text-base sm:text-lg leading-relaxed mt-4 max-w-2xl">
          Der Prompt Builder wird derzeit überarbeitet und ist vorübergehend pausiert. Bis zur Wiedereröffnung können keine neuen Prompts generiert werden.
        </p>
      </div>

      {/* Status-Block */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 sm:p-6 mb-10">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Status</p>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
            <p className="text-gray-700"><span className="font-semibold text-[#111827]">Generierung pausiert</span> — der Builder nimmt aktuell keine Anfragen entgegen.</p>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
            <p className="text-gray-700"><span className="font-semibold text-[#111827]">Prompt-Bibliothek verfügbar</span> — alle kuratierten Prompts bleiben vollständig abrufbar.</p>
          </div>
        </div>
      </div>

      {/* Alternativen */}
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Bis dahin</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ALTERNATIVES.map(a => (
            <Link
              key={a.href}
              href={a.href}
              className="group flex flex-col bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm rounded-xl p-5 transition-all"
            >
              <a.icon className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors mb-3" />
              <p className="text-sm font-semibold text-gray-900 group-hover:text-[#111827] mb-1">{a.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed flex-1">{a.desc}</p>
              <span className="mt-3 text-xs text-gray-400 group-hover:text-[#111827] transition-colors inline-flex items-center gap-1">
                Öffnen <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuilderPage() {
  if (PROMPT_BUILDER_PAUSED) return <BuilderPaused />
  return <BuilderClient />
}
