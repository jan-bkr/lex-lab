import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Calculator, ShieldCheck } from 'lucide-react'
import { adminSupabase } from '@/lib/supabase/admin'
import { ToolCard } from '@/components/ToolCard'
import { Tool, Rechtsgebiet } from '@/types'

export const revalidate = 3600

const BASE = 'https://www.lex-lab.de'

export const metadata: Metadata = {
  title: 'KI-Tools für Steuerrecht',
  description: 'Die besten KI-Tools für steuerrechtliche Recherche, Mandantenkommunikation und Finanzdatenarbeit — bewertet nach Praxisreife, DSGVO-Konformität und DACH-Eignung.',
  alternates: { canonical: `${BASE}/tools/steuerrecht` },
  openGraph: {
    title: 'KI-Tools für Steuerrecht — LexLab',
    description: 'Die besten KI-Tools für Steuerberater und Steuerjuristen in Deutschland — kuratiert und bewertet nach Praxisreife und DSGVO-Konformität.',
    url: `${BASE}/tools/steuerrecht`,
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
    { '@type': 'ListItem', position: 3, name: 'Steuerrecht', item: `${BASE}/tools/steuerrecht` },
  ],
}

export default async function SteuerrechtHubPage() {
  const { data } = await adminSupabase
    .from('tools')
    .select('id, name, slug, url, tagline, description, rechtsgebiet, category, votes, is_new, created_at, lexlab_score')
    .eq('status', 'approved')
    .overlaps('rechtsgebiet', ['Steuerrecht'])
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
          <span className="text-gray-600">Steuerrecht</span>
        </nav>

        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3">
            <Calculator className="w-3.5 h-3.5" />
            Steuerrecht
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-gray-900 leading-tight tracking-tight mb-4">
            KI-Tools für Steuerrecht
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            Kuratierte KI-Tools für Steuerberater, Steuerjuristen und interdisziplinäre Kanzleien — bewertet nach Praxisreife, DSGVO-Konformität und DACH-Eignung. Alle Tools wurden aus einer Kanzleiperspektive auf Eignung für den deutschen Steuermarkt geprüft.
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
          <Link href="/collections/steuerrecht-essentials"
            className="group bg-emerald-50 border border-emerald-100 rounded-xl p-5 hover:border-emerald-200 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Shortlist</span>
            </div>
            <p className="font-display font-semibold text-gray-900 text-sm leading-snug mb-1">
              Steuerrecht Essentials
            </p>
            <p className="text-xs text-gray-500">Die wichtigsten Tools für Steuerberater — kurz und bewertet.</p>
            <div className="mt-3 text-xs font-medium text-emerald-700 group-hover:text-emerald-800 flex items-center gap-1">
              Shortlist ansehen <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          <Link href="/tools/finder"
            className="group bg-white border border-gray-100 rounded-xl p-5 hover:border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Tool Finder</span>
            </div>
            <p className="font-display font-semibold text-gray-900 text-sm leading-snug mb-1">
              Persönliche Empfehlung
            </p>
            <p className="text-xs text-gray-500">Beantworte 4 Fragen — LexLab empfiehlt das passende Tool für deine Kanzlei.</p>
            <div className="mt-3 text-xs font-medium text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
              Finder starten <ArrowRight className="w-3 h-3" />
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
            <p className="text-xs text-gray-400">Marktanalyse und Auswahlframework für den deutschen Rechtsmarkt.</p>
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
