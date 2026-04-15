'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, ChevronDown } from 'lucide-react'
import { ToolCard } from '@/components/ToolCard'
import { FinderPanel } from '@/components/FinderPanel'
import { createClient } from '@/lib/supabase/client'
import { Tool, Rechtsgebiet } from '@/types'

type SortOption = 'score' | 'votes' | 'newest' | 'alpha'

const RECHTSGEBIETE: Rechtsgebiet[] = ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Venture Capital']

interface SupabaseToolRow {
  id: string
  name: string
  slug: string
  url: string
  tagline: string | null
  description: string | null
  rechtsgebiet: string[] | null
  category: string[] | null
  votes: number | null
  is_new: boolean | null
  status: string
  featured: boolean | null
  created_at: string
  lexlab_score: number | null
}

function mapRow(row: SupabaseToolRow): Tool {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    url: row.url,
    tagline: row.tagline ?? '',
    description: row.description ?? '',
    rechtsgebiet: (row.rechtsgebiet ?? []) as Rechtsgebiet[],
    category: row.category ?? [],
    votes: row.votes ?? 0,
    isNew: row.is_new ?? false,
    createdAt: row.created_at,
    lexlabScore: row.lexlab_score,
  }
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 animate-pulse flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-gray-100 flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 bg-gray-100 rounded w-2/5" />
          <div className="h-2.5 bg-gray-100 rounded w-3/5" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-2.5 bg-gray-100 rounded w-full" />
        <div className="h-2.5 bg-gray-100 rounded w-5/6" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 bg-gray-100 rounded-md w-16" />
        <div className="h-5 bg-gray-100 rounded-md w-12" />
      </div>
    </div>
  )
}

function ToolsPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize filter from URL ?rechtsgebiet=Steuerrecht
  const paramFilter = searchParams.get('rechtsgebiet') as Rechtsgebiet | null
  const initialFilter: Rechtsgebiet | 'Alle' =
    paramFilter && RECHTSGEBIETE.includes(paramFilter) ? paramFilter : 'Alle'

  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<Rechtsgebiet | 'Alle'>(initialFilter)
  const [sort, setSort] = useState<SortOption>('score')

  useEffect(() => {
    async function fetchTools() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('tools')
        .select('id,name,slug,url,tagline,description,rechtsgebiet,category,votes,is_new,status,featured,created_at,lexlab_score')
        .eq('status', 'approved')

      if (error) {
        setLoadError(true)
      } else {
        setTools(data ? (data as SupabaseToolRow[]).map(mapRow) : [])
      }
      setLoading(false)
    }
    fetchTools()
  }, [])

  const filtered = tools
    .filter(t => {
      const q = search.toLowerCase()
      const matchesSearch =
        q === '' ||
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q)
      const matchesFilter = activeFilter === 'Alle' || t.rechtsgebiet.includes(activeFilter)
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (sort === 'score') return (b.lexlabScore ?? 0) - (a.lexlabScore ?? 0)
      if (sort === 'votes') return b.votes - a.votes
      if (sort === 'newest')
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return a.name.localeCompare(b.name, 'de')
    })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-gray-900">Alle Tools</h1>
          <p className="text-gray-500 mt-1 text-sm leading-relaxed max-w-xl">
            KI-Tools für den deutschen Rechtsmarkt — kuratiert und bewertet von der Community
          </p>
        </div>
        <Link
          href="/tools/submit"
          className="inline-flex items-center gap-1.5 border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800 text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          Tool einreichen →
        </Link>
      </div>

      {/* Tool Finder — primary product CTA */}
      <div className="mb-6">
        <FinderPanel compact />
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-[57px] z-10 bg-[#F7F7F5]/95 backdrop-blur-sm -mx-4 sm:-mx-6 px-4 sm:px-6 pt-3 pb-3 border-b border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Tool suchen..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-1.5">
            {(['Alle', ...RECHTSGEBIETE] as const).map(rg => (
              <button
                key={rg}
                onClick={() => setActiveFilter(rg)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  activeFilter === rg
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                {rg}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative sm:ml-auto flex-shrink-0">
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortOption)}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="score">LexLab Score</option>
              <option value="votes">Meiste Votes</option>
              <option value="newest">Neueste</option>
              <option value="alpha">Alphabetisch</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          {loading ? 'Laden…' : `${filtered.length} Tool${filtered.length !== 1 ? 's' : ''} gefunden`}
        </p>
      </div>

      {/* Content */}
      {loadError ? (
        <div className="text-center py-20">
          <p className="text-sm text-gray-500">
            Tools konnten nicht geladen werden. Bitte später erneut versuchen.
          </p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filtered.length === 0 && !search && activeFilter === 'Alle' ? (
        <div className="text-center py-20">
          <p className="text-sm text-gray-400">Noch keine Tools verfügbar.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Search className="w-5 h-5 text-gray-300" />
          </div>
          <h3 className="font-display font-semibold text-gray-700 mb-1">Keine Tools gefunden</h3>
          <p className="text-sm text-gray-400 mb-5">
            Versuche eine andere Suchanfrage oder ändere die Filter.
          </p>
          <button
            onClick={() => {
              setSearch('')
              setActiveFilter('Alle')
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Filter zurücksetzen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(tool => (
            <div
              key={tool.id}
              onClick={() => router.push(`/tools/${tool.slug}`)}
              className="cursor-pointer"
            >
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ToolsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-24">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 animate-pulse h-40" />
          ))}
        </div>
      </div>
    }>
      <ToolsPageInner />
    </Suspense>
  )
}
