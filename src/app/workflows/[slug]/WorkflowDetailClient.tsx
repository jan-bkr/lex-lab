'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock, ArrowLeft, Calendar, Lock } from 'lucide-react'
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
    <div className="bg-white border border-gray-100 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <h2 className="font-display font-semibold text-gray-900">Schritt-für-Schritt-Anleitung</h2>
        <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5 flex-shrink-0 ml-3">
          Erscheint in Kürze
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        Die vollständige Anleitung mit konkreten Prompts, Tipps und Praxisbeispielen ist in Vorbereitung.
      </p>

      {/* Faded step indicators */}
      <ol className="space-y-3 mb-6">
        {STEP_LABELS.map((label, i) => (
          <li key={i} className="flex items-center gap-3 opacity-40 select-none">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-400">
              {i + 1}
            </span>
            <div className="flex-1 flex items-center justify-between gap-2">
              <span className="text-sm text-gray-400">{label}</span>
              <Lock className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
            </div>
          </li>
        ))}
      </ol>

      <div className="border-t border-gray-50 pt-4">
        <p className="text-xs text-gray-400">
          Newsletter abonnieren — du wirst informiert, sobald dieser Workflow vollständig verfügbar ist.
        </p>
        <Link
          href="/newsletter"
          className="inline-block mt-2 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Jetzt abonnieren &rarr;
        </Link>
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

          <div className="flex items-center gap-3 flex-wrap mb-6">
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

          <div className="bg-white border border-gray-100 rounded-xl p-6 mb-4">
            <p className="text-gray-600 leading-relaxed text-sm">{workflow.excerpt}</p>
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
