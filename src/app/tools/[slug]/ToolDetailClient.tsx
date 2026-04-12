'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, ChevronUp, Copy, Check, ArrowLeft } from 'lucide-react'
import { RechtsgebietTag } from '@/components/RechtsgebietTag'
import { ToolCard } from '@/components/ToolCard'
import { createClient } from '@/lib/supabase/client'
import { mockTools } from '@/lib/mock-data'
import { Tool, Rechtsgebiet } from '@/types'

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
  submitted_by: string | null
  created_at: string
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
  }
}

function relativeDate(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)
  if (days === 0) return 'Heute'
  if (days === 1) return 'Gestern'
  if (days < 7) return `vor ${days} Tagen`
  if (days < 30) return `vor ${Math.floor(days / 7)} Wochen`
  return `vor ${Math.floor(days / 30)} Monaten`
}

function generateUseCases(tool: Tool): string[] {
  const cases: string[] = []
  if (tool.rechtsgebiet.includes('M&A'))
    cases.push('Due Diligence und Vertragsanalyse in M&A-Prozessen')
  if (tool.rechtsgebiet.includes('Steuerrecht'))
    cases.push('Steuerliche Analyse und Berechnung komplexer Sachverhalte')
  if (tool.rechtsgebiet.includes('Gesellschaftsrecht'))
    cases.push('Prüfung gesellschaftsrechtlicher Dokumente und Beschlüsse')
  if (tool.rechtsgebiet.includes('Venture Capital'))
    cases.push('Analyse von Term Sheets und Investmentverträgen')
  if (tool.category.includes('Vertragsanalyse') && !cases.some(c => c.includes('Vertrags')))
    cases.push('Systematische Vertragsanalyse und Risikoidentifikation')
  const fallbacks = [
    'Effizienzsteigerung bei wiederkehrenden Aufgaben',
    'Mandantenberatung und Dokumentenerstellung',
    'Qualitätssicherung und Risikoprüfung',
  ]
  while (cases.length < 3) cases.push(fallbacks[cases.length % fallbacks.length])
  return cases.slice(0, 3)
}

export default function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [votes, setVotes] = useState(0)
  const [voted, setVoted] = useState(false)

  useEffect(() => {
    async function fetchTools() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('status', 'approved')

      if (error || !data || data.length === 0) {
        setTools(mockTools)
      } else {
        setTools((data as SupabaseToolRow[]).map(mapRow))
      }
      setLoading(false)
    }
    fetchTools()
  }, [])

  const tool = tools.find(t => t.slug === slug)

  useEffect(() => {
    if (tool) setVotes(tool.votes)
  }, [tool])

  const similarTools = tools
    .filter(t => t.slug !== slug && t.rechtsgebiet.some(r => tool?.rechtsgebiet.includes(r)))
    .slice(0, 3)

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleVote() {
    if (!voted) {
      setVotes(v => v + 1)
      setVoted(true)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-pulse space-y-4">
        <div className="h-4 bg-gray-100 rounded w-24" />
        <div className="h-8 bg-gray-100 rounded w-64" />
        <div className="h-4 bg-gray-100 rounded w-96" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 mt-8">
          <div className="space-y-4">
            <div className="h-40 bg-gray-100 rounded-xl" />
            <div className="h-32 bg-gray-100 rounded-xl" />
          </div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-100 rounded-xl" />
            <div className="h-12 bg-gray-100 rounded-xl" />
            <div className="h-28 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!tool) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">Tool nicht gefunden</h1>
        <p className="text-gray-500 mb-6 text-sm">Dieses Tool existiert nicht oder wurde entfernt.</p>
        <Link href="/tools" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          ← Alle Tools
        </Link>
      </div>
    )
  }

  const useCases = generateUseCases(tool)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        {/* Left column */}
        <div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Alle Tools
          </Link>

          {/* Tool header */}
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
              <span className="font-display font-bold text-lg text-gray-600">
                {tool.name.charAt(0)}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-2xl font-bold text-gray-900">{tool.name}</h1>
                {tool.isNew && (
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md border border-blue-100">
                    NEU
                  </span>
                )}
              </div>
              <p className="text-gray-500 mt-1 text-sm">{tool.tagline}</p>
            </div>
          </div>

          {/* Rechtsgebiet tags */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {tool.rechtsgebiet.map(tag => (
              <RechtsgebietTag key={tag} tag={tag} />
            ))}
          </div>

          {/* Description */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 mb-4">
            <h2 className="font-display font-semibold text-gray-900 mb-3">Beschreibung</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{tool.description}</p>
          </div>

          {/* Use Cases */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
            <h2 className="font-display font-semibold text-gray-900 mb-3">Use Cases</h2>
            <ul className="space-y-2.5">
              {useCases.map((uc, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  {uc}
                </li>
              ))}
            </ul>
          </div>

          {/* Similar tools */}
          {similarTools.length > 0 && (
            <div>
              <h2 className="font-display font-semibold text-gray-900 mb-3">Ähnliche Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {similarTools.map(t => (
                  <div
                    key={t.id}
                    onClick={() => router.push(`/tools/${t.slug}`)}
                    className="cursor-pointer"
                  >
                    <ToolCard tool={t} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-3">
          {/* External CTA */}
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors text-sm"
          >
            Tool ansehen
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* Upvote */}
          <button
            onClick={handleVote}
            className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
              voted
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <ChevronUp className="w-4 h-4" />
            {votes} {votes === 1 ? 'Vote' : 'Votes'}
          </button>

          {/* Meta info */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
            {tool.category.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Kategorie</p>
                <p className="text-sm text-gray-700">{tool.category.join(', ')}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Hinzugefügt</p>
              <p className="text-sm text-gray-700">{relativeDate(tool.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Rechtsgebiet</p>
              <p className="text-sm text-gray-700">{tool.rechtsgebiet.join(', ')}</p>
            </div>
          </div>

          {/* Share */}
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-2">Teilen</p>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 w-full text-sm text-gray-600 hover:text-gray-900 transition-colors group"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-green-600">Link kopiert!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                  <span>Link kopieren</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
