'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, ChevronDown } from 'lucide-react'
import { ToolCard } from '@/components/ToolCard'
import { FinderPanel } from '@/components/FinderPanel'
import { Tool, Rechtsgebiet } from '@/types'

type SortOption = 'score' | 'votes' | 'newest' | 'alpha'

const RECHTSGEBIETE: Rechtsgebiet[] = ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Venture Capital']

// ─── Inner component (needs useSearchParams → Suspense boundary) ──────────────

function ToolsInner({ initialTools }: { initialTools: Tool[] }) {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const paramFilter = searchParams.get('rechtsgebiet') as Rechtsgebiet | null
  const initialFilter: Rechtsgebiet | 'Alle' =
    paramFilter && RECHTSGEBIETE.includes(paramFilter) ? paramFilter : 'Alle'

  const [search,       setSearch]       = useState('')
  const [activeFilter, setActiveFilter] = useState<Rechtsgebiet | 'Alle'>(initialFilter)
  const [sort,         setSort]         = useState<SortOption>('score')

  const filtered = initialTools
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
      if (sort === 'score')  return (b.lexlabScore ?? 0) - (a.lexlabScore ?? 0)
      if (sort === 'votes')  return b.votes - a.votes
      if (sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return a.name.localeCompare(b.name, 'de')
    })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-gray-900">Alle Tools</h1>
          <p className="text-gray-500 mt-1 text-sm leading-relaxed max-w-xl">
            KI-Tools für den deutschen Rechtsmarkt — bewertet nach Praxisreife, DACH-Relevanz und Datenschutz.
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
      <div className="mb-4">
        <FinderPanel compact />
      </div>

      {/* Kuratierte Listen — secondary discovery strip */}
      <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm px-1">
        <span className="text-gray-400 font-medium text-xs uppercase tracking-wider">Shortlists:</span>
        <Link href="/collections/ma-due-diligence"     className="text-gray-500 hover:text-blue-600 transition-colors">M&amp;A Due Diligence</Link>
        <span className="text-gray-200 hidden sm:block">·</span>
        <Link href="/collections/datenschutzstark"     className="text-gray-500 hover:text-blue-600 transition-colors">Datenschutzstark</Link>
        <span className="text-gray-200 hidden sm:block">·</span>
        <Link href="/collections/steuerrecht-essentials" className="text-gray-500 hover:text-blue-600 transition-colors">Steuerrecht</Link>
        <span className="text-gray-200 hidden sm:block">·</span>
        <Link href="/collections" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
          Alle Listen →
        </Link>
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
          {`${filtered.length} Tool${filtered.length !== 1 ? 's' : ''} gefunden`}
        </p>
      </div>

      {/* Content */}
      {filtered.length === 0 && !search && activeFilter === 'Alle' ? (
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
            onClick={() => { setSearch(''); setActiveFilter('Alle') }}
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

// ─── Exported component (Suspense boundary for useSearchParams) ───────────────

function ToolsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="h-8 bg-gray-100 rounded w-32 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-80 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 animate-pulse h-40" />
        ))}
      </div>
    </div>
  )
}

export default function ToolsContent({ initialTools }: { initialTools: Tool[] }) {
  return (
    <Suspense fallback={<ToolsSkeleton />}>
      <ToolsInner initialTools={initialTools} />
    </Suspense>
  )
}
