import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ArrowLeft, Layers } from 'lucide-react'
import { adminSupabase } from '@/lib/supabase/admin'
import { COLLECTIONS, getCollection, CollectionDef } from '../config'

export const revalidate = 3600

// ─── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return COLLECTIONS.map(c => ({ slug: c.slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const collection = getCollection(slug)
  if (!collection) return {}
  return {
    title: collection.title,
    description: collection.description,
    openGraph: {
      title: `${collection.title} — LexLab`,
      description: collection.description,
    },
  }
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ToolRow {
  id: string
  name: string
  slug: string
  tagline: string | null
  rechtsgebiet: string[] | null
  pricing: string | null
  lexlab_score: number | null
  verdict: string | null
  best_for: string[] | null
}

// ─── Score badge (inline) ──────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number | null }) {
  if (score == null) return null
  const cls =
    score >= 80 ? 'bg-green-100 text-green-800' :
    score >= 60 ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {score}
    </span>
  )
}

// ─── Fetch tools for collection ────────────────────────────────────────────────

async function fetchCollectionTools(filter: CollectionDef['filter']): Promise<ToolRow[]> {
  let query = adminSupabase
    .from('tools')
    .select('id,name,slug,tagline,rechtsgebiet,pricing,lexlab_score,verdict,best_for')
    .eq('status', 'approved')

  if (filter.rechtsgebietOverlaps && filter.rechtsgebietOverlaps.length > 0) {
    query = query.overlaps('rechtsgebiet', filter.rechtsgebietOverlaps)
  }
  if (filter.minScore != null) {
    query = query.gte('lexlab_score', filter.minScore)
  }
  if (filter.minDatenschutz != null) {
    query = query.gte('score_datenschutz', filter.minDatenschutz)
  }

  query = query
    .order(filter.orderBy, { ascending: false })
    .limit(filter.maxTools)

  const { data, error } = await query
  if (error) return []
  return (data ?? []) as ToolRow[]
}

// ─── Theme config (colors for the collection header) ─────────────────────────

const headerTheme: Record<CollectionDef['theme'], { bg: string; border: string; eyebrowColor: string }> = {
  purple: { bg: 'bg-purple-50',  border: 'border-purple-100', eyebrowColor: 'text-purple-600' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', eyebrowColor: 'text-emerald-600' },
  blue:   { bg: 'bg-blue-50',    border: 'border-blue-100',   eyebrowColor: 'text-blue-600' },
  amber:  { bg: 'bg-amber-50',   border: 'border-amber-100',  eyebrowColor: 'text-amber-600' },
  gray:   { bg: 'bg-gray-50',    border: 'border-gray-100',   eyebrowColor: 'text-gray-600' },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CollectionDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const collection = getCollection(slug)
  if (!collection) notFound()

  const tools = await fetchCollectionTools(collection.filter)
  const theme = headerTheme[collection.theme]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">

      {/* ─── Breadcrumb ─── */}
      <div className="pt-8 pb-0">
        <Link
          href="/collections"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kuratierte Listen
        </Link>
      </div>

      {/* ─── Collection header ─── */}
      <section className={`mt-5 mb-10 rounded-2xl border p-6 sm:p-8 ${theme.bg} ${theme.border}`}>
        <div className="inline-flex items-center gap-2 mb-3">
          <Layers className="w-3.5 h-3.5 text-gray-400" />
          <span className={`text-xs font-semibold uppercase tracking-widest ${theme.eyebrowColor}`}>
            {collection.eyebrow}
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-gray-900 leading-tight tracking-tight mb-3">
          {collection.title}
        </h1>
        <p className="text-gray-600 text-base leading-relaxed mb-4 max-w-2xl">
          {collection.description}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-green-500 text-sm">✓</span>
            <span className="text-sm text-gray-600 font-medium">{collection.benefit}</span>
          </div>
          <span className="text-gray-200 hidden sm:block">·</span>
          <span className="text-xs text-gray-400">Kuratiert von LexLab · {tools.length} Tool{tools.length !== 1 ? 's' : ''}</span>
        </div>
      </section>

      {/* ─── Tool list ─── */}
      <section className="mb-10 max-w-3xl">
        {tools.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-100 rounded-xl">
            <p className="text-gray-500 text-sm mb-4">
              Diese Sammlung wird gerade kuratiert — noch keine Tools vorhanden.
            </p>
            <Link href="/tools" className="text-sm text-blue-600 hover:text-blue-700 underline">
              Alle Tools im Verzeichnis →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {tools.map((tool, i) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className={`block bg-white rounded-xl border p-5 hover:shadow-sm transition-all group ${
                  i === 0 ? 'border-[#111827]/20 shadow-[0_1px_4px_rgba(0,0,0,0.05)]' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                {/* Title row */}
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-mono text-gray-300 flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="font-semibold text-[#111827] truncate group-hover:underline">
                      {tool.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {i === 0 && (
                      <span className="text-[9px] font-bold bg-[#111827] text-white rounded-full px-2 py-0.5 leading-none tracking-wide uppercase">
                        Top-Pick
                      </span>
                    )}
                    {tool.lexlab_score != null && (
                      <span className="text-[10px] text-gray-400 font-medium">LexLab</span>
                    )}
                    <ScoreBadge score={tool.lexlab_score} />
                  </div>
                </div>

                {/* Tagline */}
                {tool.tagline && (
                  <p className="text-sm text-gray-500 mb-3 ml-7 leading-snug">{tool.tagline}</p>
                )}

                {/* Verdict */}
                {tool.verdict && (
                  <p className="text-sm text-[#111827]/80 bg-blue-50 rounded-lg px-3 py-2.5 ml-7 line-clamp-2 leading-relaxed">
                    {tool.verdict}
                  </p>
                )}

                {/* Footer row */}
                <div className="mt-3 ml-7 flex items-center gap-2 flex-wrap">
                  {(tool.rechtsgebiet ?? []).slice(0, 2).map(rg => (
                    <span key={rg} className="text-xs text-gray-500 bg-gray-100 rounded-full px-2.5 py-0.5">
                      {rg}
                    </span>
                  ))}
                  {tool.pricing && (
                    <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-0.5 capitalize">
                      {tool.pricing}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 ml-auto group-hover:text-[#111827] transition-colors">
                    Zum Tool →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ─── Bottom CTAs ─── */}
      <section className="border-t border-gray-100 pt-8 pb-16 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between max-w-3xl">
        <div>
          <p className="text-sm text-gray-500 mb-1">
            Nicht das Richtige dabei?
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/collections" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Alle Listen <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-gray-200">·</span>
            <Link href="/tools/finder" className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1">
              Tool Finder starten <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
        <Link
          href="/tools"
          className="flex-shrink-0 inline-flex items-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Alle Tools durchsuchen →
        </Link>
      </section>

    </div>
  )
}
