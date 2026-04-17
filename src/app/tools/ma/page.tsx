import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Briefcase } from 'lucide-react'
import { adminSupabase } from '@/lib/supabase/admin'
import { ToolCard } from '@/components/ToolCard'
import { Tool, Rechtsgebiet } from '@/types'

export const revalidate = 3600

const BASE = 'https://www.lex-lab.de'

export const metadata: Metadata = {
  title: 'KI-Tools für M&A',
  description: 'Die besten KI-Tools für M&A-Transaktionen, Due Diligence und Vertragsanalyse — bewertet nach Praxisreife, DSGVO-Konformität und DACH-Eignung.',
  alternates: { canonical: `${BASE}/tools/ma` },
  openGraph: {
    title: 'KI-Tools für M&A — LexLab',
    description: 'Die besten KI-Tools für M&A Due Diligence, Vertragsanalyse und Transaktionsmanagement — kuratiert für den deutschen Rechtsmarkt.',
    url: `${BASE}/tools/ma`,
  },
}

interface ToolRow {
  id: string; name: string; slug: string; url: string
  tagline: string | null; description: string | null
  rechtsgebiet: string[] | null; category: string[] | null
  votes: number | null; is_new: boolean | null
  created_at: string; lexlab_score: number | null
}

function mapRow(r: ToolRow): Tool {
  return {
    id: r.id, name: r.name, slug: r.slug, url: r.url,
    tagline: r.tagline ?? '', description: r.description ?? '',
    rechtsgebiet: (r.rechtsgebiet ?? []) as Rechtsgebiet[],
    category: r.category ?? [], votes: r.votes ?? 0,
    isNew: r.is_new ?? false, createdAt: r.created_at,
    lexlabScore: r.lexlab_score,
  }
}

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'LexLab', item: BASE },
    { '@type': 'ListItem', position: 2, name: 'KI-Tools', item: `${BASE}/tools` },
    { '@type': 'ListItem', position: 3, name: 'M&A', item: `${BASE}/tools/ma` },
  ],
}

export default async function MAHubPage() {
  const { data } = await adminSupabase
    .from('tools')
    .select('id, name, slug, url, tagline, description, rechtsgebiet, category, votes, is_new, created_at, lexlab_score')
    .eq('status', 'approved')
    .overlaps('rechtsgebiet', ['M&A'])
    .order('lexlab_score', { ascending: false, nullsFirst: false })
    .limit(12)

  const tools: Tool[] = (data ?? []).map(r => mapRow(r as ToolRow))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-600 transition-colors">LexLab</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-gray-600 transition-colors">KI-Tools</Link>
          <span>/</span>
          <span className="text-gray-600">M&amp;A</span>
        </nav>

        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-600 uppercase tracking-widest mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            M&amp;A
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-gray-900 leading-tight tracking-tight mb-4">
            KI-Tools für M&amp;A
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            Kuratierte KI-Tools für M&A-Teams, Corporate-Abteilungen und Transaktionskanzleien — mit Fokus auf Due Diligence, Vertragsanalyse und Transaktionsmanagement. Bewertet nach Praxisreife, DSGVO-Konformität und DACH-Eignung.
          </p>
        </div>

        {/* Tools grid */}
        {tools.length > 0 ? (
          <section className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
            </div>
          </section>
        ) : (
          <div className="text-center py-16 text-sm text-gray-400 mb-12">
            Tools werden geladen…
          </div>
        )}

        {/* Related resources */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <Link href="/collections/ma-due-diligence"
            className="group bg-purple-50 border border-purple-100 rounded-xl p-5 hover:border-purple-200 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Shortlist</span>
            </div>
            <p className="font-display font-semibold text-gray-900 text-sm leading-snug mb-1">
              M&amp;A Due Diligence
            </p>
            <p className="text-xs text-gray-500">Top Tools für strukturierte Dokumentenprüfung in M&A-Transaktionen.</p>
            <div className="mt-3 text-xs font-medium text-purple-700 group-hover:text-purple-800 flex items-center gap-1">
              Shortlist ansehen <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          <Link href="/collections/inhouse-stack"
            className="group bg-blue-50 border border-blue-100 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Shortlist</span>
            </div>
            <p className="font-display font-semibold text-gray-900 text-sm leading-snug mb-1">
              Inhouse-Stack
            </p>
            <p className="text-xs text-gray-500">KI-Tools für Inhouse-Legal-Teams: Vertragsmanagement, Compliance, M&A.</p>
            <div className="mt-3 text-xs font-medium text-blue-700 group-hover:text-blue-800 flex items-center gap-1">
              Shortlist ansehen <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          <Link href="/state-of-legal-ai"
            className="group bg-[#111827] rounded-xl p-5 hover:bg-[#1a2234] transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">LexLab Research</span>
            </div>
            <p className="font-display font-semibold text-white text-sm leading-snug mb-1">
              State of Legal AI 2026
            </p>
            <p className="text-xs text-gray-400">Marktanalyse und Shortlists für den deutschen Rechtsmarkt.</p>
            <div className="mt-3 text-xs font-medium text-blue-400 group-hover:text-blue-300 flex items-center gap-1">
              Report lesen <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        </div>

        {/* CTA back to all tools */}
        <div className="text-center">
          <Link href="/tools"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            Alle KI-Tools ansehen
          </Link>
        </div>
      </div>
    </>
  )
}
