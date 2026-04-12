'use client'

import { useState, useEffect } from 'react'
import { Cpu } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { mockNews } from '@/lib/mock-data'
import { NewsArticle } from '@/types'

const CATEGORIES = ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Legal Tech', 'Regulierung']

const SOURCE_STYLES: Record<string, string> = {
  BFH: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  BGH: 'bg-blue-50 text-blue-700 border-blue-200',
  BMF: 'bg-purple-50 text-purple-700 border-purple-200',
  JUVE: 'bg-orange-50 text-orange-700 border-orange-200',
  LTO: 'bg-gray-100 text-gray-600 border-gray-200',
}

interface NewsRow {
  id: string
  title: string
  slug: string
  summary: string | null
  source_url: string | null
  source_name: string | null
  category: string | null
  published_at: string
  ai_generated: boolean
}

function mapRow(row: NewsRow): NewsArticle {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary ?? '',
    sourceUrl: row.source_url ?? '#',
    sourceName: row.source_name ?? '',
    category: row.category ?? '',
    publishedAt: row.published_at,
    aiGenerated: row.ai_generated,
  }
}

function relativeDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  if (mins < 60) return `vor ${mins} Min.`
  if (hours < 24) return `vor ${hours} Std.`
  if (days === 1) return 'Gestern'
  return `vor ${days} Tagen`
}

function sourceStyle(source: string): string {
  return SOURCE_STYLES[source] ?? 'bg-gray-100 text-gray-600 border-gray-200'
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('Alle')

  useEffect(() => {
    async function fetchNews() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('published_at', { ascending: false })

      if (error || !data || data.length === 0) {
        setArticles(mockNews)
      } else {
        setArticles((data as NewsRow[]).map(mapRow))
      }
      setLoading(false)
    }
    fetchNews()
  }, [])

  const filtered = articles
    .filter(a => activeFilter === 'Alle' || a.category === activeFilter)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">Aktuelles</h1>
        <p className="text-gray-500 mt-1 text-sm">
          KI-kuratierte News aus Steuerrecht, M&A, Gesellschaftsrecht und Venture Capital
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {(['Alle', ...CATEGORIES]).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              activeFilter === cat
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 animate-pulse space-y-2">
              <div className="h-3 bg-gray-100 rounded w-16" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-sm text-gray-400">
          Keine Artikel für diese Kategorie gefunden.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(article => {
            const hasUrl = article.sourceUrl && article.sourceUrl !== '#'
            const cardClass = `bg-white border border-gray-100 rounded-xl p-5 transition-all duration-200 ${
              hasUrl ? 'cursor-pointer hover:shadow-md hover:border-gray-200' : 'hover:shadow-sm'
            }`
            const inner = (
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md border ${sourceStyle(article.sourceName)}`}
                >
                  {article.sourceName}
                </span>
                {article.aiGenerated && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                    <Cpu className="w-2.5 h-2.5" />
                    KI-Zusammenfassung
                  </span>
                )}
                <span className="text-xs text-gray-400 ml-auto">
                  {relativeDate(article.publishedAt)}
                </span>
                <h2 className="w-full font-display font-semibold text-[14px] text-gray-900 leading-snug mb-0.5">
                  {article.title}
                </h2>
                <p className="w-full text-sm text-gray-500 leading-relaxed">{article.summary}</p>
              </div>
            )

            return hasUrl ? (
              <a
                key={article.id}
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClass}
              >
                {inner}
              </a>
            ) : (
              <div key={article.id} className={cardClass}>
                {inner}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
