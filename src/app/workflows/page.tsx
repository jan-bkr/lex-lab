'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'
import { RechtsgebietTag } from '@/components/RechtsgebietTag'
import { createClient } from '@/lib/supabase/client'
import { Workflow, Rechtsgebiet } from '@/types'

const RECHTSGEBIETE: Rechtsgebiet[] = ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Venture Capital']

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
        <div className="text-center py-16 text-sm text-gray-400">
          Noch keine Workflows verfügbar.
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-sm text-gray-400">
          Keine Workflows für dieses Rechtsgebiet gefunden.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(w => (
            <div
              key={w.id}
              className={`bg-white border border-gray-100 border-l-4 ${borderColor(w.rechtsgebiet)} rounded-xl p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200 flex flex-col gap-3`}
            >
              <div>
                <h2 className="font-display font-semibold text-[15px] text-gray-900 leading-snug mb-1">
                  {w.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{w.excerpt}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {w.rechtsgebiet.map(tag => (
                  <RechtsgebietTag key={tag} tag={tag} />
                ))}
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {w.readingTime} Min.
                </span>
              </div>
              <Link
                href={`/workflows/${w.slug}`}
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors mt-auto"
              >
                Lesen <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
