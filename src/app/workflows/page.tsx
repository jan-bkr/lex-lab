'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock, ArrowRight, Lock } from 'lucide-react'
import { RechtsgebietTag } from '@/components/RechtsgebietTag'
import { NewsletterForm } from '@/components/NewsletterForm'
import { createClient } from '@/lib/supabase/client'
import { Workflow, Rechtsgebiet } from '@/types'

const RECHTSGEBIETE: Rechtsgebiet[] = ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Venture Capital']

// ─── Premium Teaser für noch nicht veröffentlichte Workflows ──────────────────
interface WorkflowTeaser {
  title: string
  excerpt: string
  rechtsgebiet: string
  readingTime: number
  categoryColor: string
  borderColor: string
}

const WORKFLOW_TEASERS: WorkflowTeaser[] = [
  {
    title: 'M&A Due Diligence mit KI: Vertragsprüfung und Red-Flag-Analyse',
    excerpt: 'Wie KI-Tools die Due-Diligence-Prüfung beschleunigen — von der ersten Sichtung bis zum vollständigen Red-Flag-Report. Mit konkreten Prompts und Checklisten für M&A-Teams.',
    rechtsgebiet: 'M&A',
    readingTime: 12,
    categoryColor: 'text-purple-700 bg-purple-50 border-purple-100',
    borderColor: 'border-l-purple-400',
  },
  {
    title: 'GmbH-Gründung Schritt für Schritt: KI-gestützte Gesellschaftsrechtspraxis',
    excerpt: 'Von der Satzungserstellung bis zur Handelsregistereintragung — wie KI-Tools Gesellschaftsrechtler bei der GmbH-Gründung unterstützen können.',
    rechtsgebiet: 'Gesellschaftsrecht',
    readingTime: 15,
    categoryColor: 'text-blue-700 bg-blue-50 border-blue-100',
    borderColor: 'border-l-blue-400',
  },
  {
    title: 'Steuerliche Betriebsprüfung: Vorbereitung und Begleitung mit KI',
    excerpt: 'Checklisten, Prompts und strukturierte Workflows für die Mandatsarbeit bei Betriebsprüfungen — KI-gestützte Prüfungsvorbereitung für Steuerberater.',
    rechtsgebiet: 'Steuerrecht',
    readingTime: 10,
    categoryColor: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    borderColor: 'border-l-emerald-400',
  },
]

const BORDER_COLORS: Record<string, string> = {
  Steuerrecht: 'border-l-emerald-400',
  'M&A': 'border-l-purple-400',
  Gesellschaftsrecht: 'border-l-blue-400',
  'Venture Capital': 'border-l-orange-400',
}

interface WorkflowRow {
  id: string
  title: string
  slug: string
  rechtsgebiet: string[] | null
  reading_time: number | null
  excerpt: string | null
  published: boolean
  created_at: string
}

function mapRow(row: WorkflowRow): Workflow {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    rechtsgebiet: (row.rechtsgebiet ?? []) as Rechtsgebiet[],
    readingTime: row.reading_time ?? 0,
    excerpt: row.excerpt ?? '',
    createdAt: row.created_at,
  }
}

function borderColor(rechtsgebiet: Rechtsgebiet[]): string {
  return BORDER_COLORS[rechtsgebiet[0]] ?? 'border-l-gray-300'
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [activeFilter, setActiveFilter] = useState<Rechtsgebiet | 'Alle'>('Alle')

  useEffect(() => {
    async function fetchWorkflows() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('workflows')
        .select('id, title, slug, rechtsgebiet, reading_time, excerpt, published, created_at')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) {
        setLoadError(true)
      } else {
        setWorkflows(data ? (data as WorkflowRow[]).map(mapRow) : [])
      }
      setLoading(false)
    }
    fetchWorkflows()
  }, [])

  const filtered = workflows.filter(
    w => activeFilter === 'Alle' || w.rechtsgebiet.includes(activeFilter)
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-gray-900">Workflows</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Schritt-für-Schritt KI-Workflows für juristische Aufgaben
        </p>
      </div>
      {!loading && !loadError && workflows.length > 0 && (
        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-6 text-sm text-slate-600">
          <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span>Die vollständigen Anleitungen erscheinen in Kürze. Abonniere den <a href="/newsletter" className="font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900 transition-colors">Newsletter</a>, um als Erster informiert zu werden.</span>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mb-6">
        {(['Alle', ...RECHTSGEBIETE] as const).map(rg => (
          <button
            key={rg}
            onClick={() => setActiveFilter(rg)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              activeFilter === rg
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {rg}
          </button>
        ))}
      </div>

      {loadError ? (
        <div className="text-center py-16 text-sm text-gray-500">
          Workflows konnten nicht geladen werden. Bitte später erneut versuchen.
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 animate-pulse space-y-3">
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 && activeFilter === 'Alle' ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {WORKFLOW_TEASERS.map((wf) => (
              <article
                key={wf.title}
                className={`bg-white/70 border border-gray-100 border-l-4 ${wf.borderColor} rounded-xl p-6 flex flex-col gap-3`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[11px] font-semibold border rounded-md px-2 py-0.5 uppercase tracking-wide flex-shrink-0 ${wf.categoryColor}`}>
                    {wf.rechtsgebiet}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 uppercase tracking-wide leading-none flex-shrink-0 whitespace-nowrap">
                    bald
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-[15px] text-gray-800 leading-snug mb-1.5">
                    {wf.title}
                  </h2>
                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                    {wf.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-300 pt-2 border-t border-gray-50">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {wf.readingTime} Min. Lesezeit
                  </span>
                  <Lock className="w-3 h-3" />
                </div>
              </article>
            ))}
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
            <p className="text-sm font-semibold text-blue-900 mb-1">Workflows erscheinen in Kürze.</p>
            <p className="text-sm text-blue-700 mb-5">
              Abonniere den Newsletter — du wirst als Erster informiert, wenn neue Workflows verfügbar sind.
            </p>
            <NewsletterForm />
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-sm text-gray-400">
          Keine Workflows für dieses Rechtsgebiet gefunden.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(w => (
            <Link
              key={w.id}
              href={`/workflows/${w.slug}`}
              className={`group bg-white border border-gray-100 border-l-4 ${borderColor(w.rechtsgebiet)} rounded-xl p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200 flex flex-col gap-3`}
            >
              <div className="flex items-start gap-2 justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  {w.rechtsgebiet.map(tag => (
                    <RechtsgebietTag key={tag} tag={tag} />
                  ))}
                </div>
                <span className="flex-shrink-0 text-[9px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 whitespace-nowrap">
                  Vorschau
                </span>
              </div>
              <div className="flex-1">
                <h2 className="font-display text-[15px] text-gray-900 leading-snug mb-1.5 group-hover:text-blue-700 transition-colors">
                  {w.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{w.excerpt}</p>
              </div>
              <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {w.readingTime} Min. Lesezeit
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                  Vorschau <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
