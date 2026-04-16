'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock, ArrowLeft, ArrowRight, Calendar, Lock } from 'lucide-react'
import { RechtsgebietTag } from '@/components/RechtsgebietTag'
import { createClient } from '@/lib/supabase/client'
import { Workflow, Rechtsgebiet } from '@/types'

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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ─── Premium bald-Platzhalter für Workflow-Schritte ────────────────────────
const STEP_LABELS = [
  'Scope & Vorbereitung',
  'Daten & Kontext aufbereiten',
  'KI-Analyse durchführen',
  'Ergebnisse prüfen & verdichten',
  'Dokument finalisieren',
]

function WorkflowStepsTeaser() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-5 border-b border-gray-50">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h2 className="font-display text-gray-900">Schritt-für-Schritt-Anleitung</h2>
          <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-200 rounded-md px-2 py-0.5 whitespace-nowrap flex-shrink-0">
            In Vorbereitung
          </span>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          Die vollständige Anleitung mit konkreten Prompts, Praxisbeispielen und Checklisten erscheint in Kürze.
        </p>
      </div>

      {/* Steps preview with gradient fade */}
      <div className="relative px-6 pt-5">
        <ol className="space-y-3.5 pb-16 select-none">
          {STEP_LABELS.map((label, i) => (
            <li
              key={i}
              className="flex items-center gap-3"
              style={{ opacity: Math.max(0.12, 1 - i * 0.2) }}
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-400">
                {i + 1}
              </span>
              <div className="flex-1 flex items-center justify-between gap-2">
                <span className="text-sm text-gray-500">{label}</span>
                <Lock className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
              </div>
            </li>
          ))}
        </ol>
        {/* Gradient overlay fading into the CTA below */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      {/* Newsletter CTA */}
      <div className="px-6 pb-6">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
          <p className="text-sm font-semibold text-blue-900 mb-1">Vollständige Anleitung folgt.</p>
          <p className="text-sm text-blue-700 leading-relaxed mb-4">
            Abonniere den Newsletter — du wirst als Erster benachrichtigt, wenn dieser Workflow vollständig verfügbar ist.
          </p>
          <Link
            href="/newsletter"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            Newsletter abonnieren
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    async function fetchWorkflows() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('workflows')
        .select('id, title, slug, rechtsgebiet, reading_time, excerpt, published, created_at')
        .eq('published', true)

      if (error) {
        setLoadError(true)
      } else {
        setWorkflows(data ? (data as WorkflowRow[]).map(mapRow) : [])
      }
      setLoading(false)
    }
    fetchWorkflows()
  }, [])

  const workflow = workflows.find(w => w.slug === slug)
  const similar = workflows
    .filter(w => w.slug !== slug && w.rechtsgebiet.some(r => workflow?.rechtsgebiet.includes(r)))
    .slice(0, 2)

  if (loadError) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-sm text-gray-500">
          Workflow konnte nicht geladen werden. Bitte später erneut versuchen.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-pulse space-y-4">
        <div className="h-4 bg-gray-100 rounded w-24" />
        <div className="h-8 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8 mt-6">
          <div className="space-y-4">
            <div className="h-32 bg-gray-100 rounded-xl" />
            <div className="h-64 bg-gray-100 rounded-xl" />
          </div>
          <div className="space-y-4">
            <div className="h-40 bg-gray-100 rounded-xl" />
            <div className="h-28 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!workflow) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="font-display text-2xl text-gray-900 mb-2">
          Workflow nicht gefunden
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          Dieser Workflow existiert nicht oder wurde entfernt.
        </p>
        <Link href="/workflows" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          &larr; Workflows
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8">
        {/* Left */}
        <div>
          <Link
            href="/workflows"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Workflows
          </Link>

          <h1 className="font-display text-2xl text-gray-900 mb-4 leading-snug">
            {workflow.title}
          </h1>

          <div className="flex items-center gap-3 flex-wrap mb-5">
            {workflow.rechtsgebiet.map(tag => (
              <RechtsgebietTag key={tag} tag={tag} />
            ))}
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {workflow.readingTime} Min. Lesezeit
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              {formatDate(workflow.createdAt)}
            </span>
          </div>

          {/* Preview-Banner */}
          <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 mb-5">
            <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-700 leading-snug">Workflow-Vorschau</p>
              <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                Die vollständige Schritt-für-Schritt-Anleitung ist in Vorbereitung. Abonniere den Newsletter, um als Erster informiert zu werden.
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-6 mb-4 border-l-4 border-l-blue-200">
            <p className="text-[15px] text-gray-600 leading-relaxed">{workflow.excerpt}</p>
          </div>

          <WorkflowStepsTeaser />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {similar.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <h3 className="font-display font-semibold text-sm text-gray-900 mb-3">
                Ähnliche Workflows
              </h3>
              <div className="space-y-3">
                {similar.map(w => (
                  <Link key={w.id} href={`/workflows/${w.slug}`} className="block group">
                    <p className="text-sm text-gray-700 group-hover:text-blue-600 leading-snug transition-colors">
                      {w.title}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <Clock className="w-3 h-3" />
                      {w.readingTime} Min.
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <h3 className="font-display font-semibold text-sm text-blue-900 mb-1">Newsletter</h3>
            <p className="text-xs text-blue-700 leading-relaxed mb-3">
              Neue Workflows und Prompts direkt in dein Postfach — wöchentlich, kostenlos.
            </p>
            <Link
              href="/newsletter"
              className="block text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
            >
              Jetzt abonnieren
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
