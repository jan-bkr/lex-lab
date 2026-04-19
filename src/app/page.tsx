import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Flame, Calendar, BookOpen, Zap, Building2, TrendingUp, Briefcase, Grid3X3, Newspaper, Mail } from 'lucide-react'
import { ToolCard } from '@/components/ToolCard'
import { RechtsgebietTag } from '@/components/RechtsgebietTag'
import { NewsletterForm } from '@/components/NewsletterForm'
import { PromptOfDay } from '@/components/PromptOfDay'
import { FinderPanel } from '@/components/FinderPanel'
import { adminSupabase } from '@/lib/supabase/admin'
import { formatDistanceToNow, format } from 'date-fns'
import { de } from 'date-fns/locale'
import { Rechtsgebiet, Tool, Workflow, Prompt, NewsArticle, Event } from '@/types'

export const revalidate = 3600

export const metadata: Metadata = {
  title: { absolute: 'LexLab — KI-Tools für Juristen' },
  description: 'Die kuratierte Plattform für KI-Tools, Workflows und Prompts für Steuerrecht, M&A, Gesellschaftsrecht und Venture Capital.',
  alternates: { canonical: 'https://www.lex-lab.de' },
  openGraph: {
    title: 'LexLab — KI-Tools für Juristen',
    description: 'KI-Tools, Workflows und Prompts für den deutschen Rechtsmarkt — kuratiert und bewertet für Kanzleien, Steuerberater und Inhouse-Teams.',
  },
}

// ─── DB row → domain type mappers ─────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTool(r: any): Tool {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    url: r.url ?? '#',
    tagline: r.tagline ?? '',
    description: r.description ?? '',
    rechtsgebiet: (r.rechtsgebiet ?? []) as Rechtsgebiet[],
    category: r.category ?? [],
    votes: r.votes ?? 0,
    isNew: r.is_new ?? false,
    createdAt: r.created_at,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapWorkflow(r: any): Workflow {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    rechtsgebiet: (r.rechtsgebiet ?? []) as Rechtsgebiet[],
    readingTime: r.reading_time ?? 0,
    excerpt: r.excerpt ?? '',
    createdAt: r.created_at,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPrompt(r: any): Prompt {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    promptText: r.prompt_text ?? '',
    useCase: r.use_case ?? '',
    rechtsgebiet: (r.rechtsgebiet ?? []) as Rechtsgebiet[],
    exampleOutput: r.example_output ?? '',
    createdAt: r.created_at,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapNews(r: any): NewsArticle {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug ?? '',
    summary: r.summary ?? '',
    sourceUrl: r.source_url ?? '#',
    sourceName: r.source_name ?? '',
    category: r.category ?? '',
    publishedAt: r.published_at,
    aiGenerated: r.ai_generated ?? false,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapEvent(r: any): Event {
  return {
    id: r.id,
    title: r.title,
    date: r.date,
    type: r.type as Event['type'],
    url: r.url ?? '#',
    description: r.description ?? '',
  }
}

// ─── Static style maps ────────────────────────────────────────────────────────

const rechtsgebietMeta: Record<Rechtsgebiet, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  'Steuerrecht': { icon: <span className="text-2xl font-display font-black text-emerald-600">§</span>, color: 'text-emerald-700', bg: 'bg-emerald-50 hover:bg-emerald-100', border: 'border-emerald-100 hover:border-emerald-200' },
  'M&A': { icon: <Briefcase className="w-6 h-6 text-purple-600" />, color: 'text-purple-700', bg: 'bg-purple-50 hover:bg-purple-100', border: 'border-purple-100 hover:border-purple-200' },
  'Gesellschaftsrecht': { icon: <Building2 className="w-6 h-6 text-blue-600" />, color: 'text-blue-700', bg: 'bg-blue-50 hover:bg-blue-100', border: 'border-blue-100 hover:border-blue-200' },
  'Venture Capital': { icon: <TrendingUp className="w-6 h-6 text-orange-600" />, color: 'text-orange-700', bg: 'bg-orange-50 hover:bg-orange-100', border: 'border-orange-100 hover:border-orange-200' },
}

const sourceBadgeStyle: Record<string, string> = {
  BFH: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  BGH: 'bg-blue-50 text-blue-700 border-blue-100',
  BMF: 'bg-amber-50 text-amber-700 border-amber-100',
  JUVE: 'bg-purple-50 text-purple-700 border-purple-100',
  LTO: 'bg-gray-50 text-gray-600 border-gray-200',
}

const eventTypeBadge: Record<string, string> = {
  BFH: 'bg-emerald-50 text-emerald-700',
  BGH: 'bg-blue-50 text-blue-700',
  Gesetz: 'bg-amber-50 text-amber-700',
  Konferenz: 'bg-gray-100 text-gray-600',
}

const workflowBorder: Record<Rechtsgebiet, string> = {
  Steuerrecht: 'border-l-emerald-400',
  'M&A': 'border-l-purple-400',
  Gesellschaftsrecht: 'border-l-blue-400',
  'Venture Capital': 'border-l-orange-400',
}

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'LexLab',
  url: 'https://www.lex-lab.de',
  description: 'KI-Tools, Workflows und Prompts für den deutschen Rechtsmarkt',
  inLanguage: 'de-DE',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.lex-lab.de/tools?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'LexLab',
  url: 'https://www.lex-lab.de',
  description: 'Kuratierte Plattform für KI-Tools, Workflows und Prompts für den deutschen Rechts- und Steuermarkt.',
  foundingDate: '2026',
  areaServed: [
    { '@type': 'Country', name: 'Germany' },
    { '@type': 'Country', name: 'Austria' },
    { '@type': 'Country', name: 'Switzerland' },
  ],
  knowsAbout: ['Legal Technology', 'Artificial Intelligence', 'German Tax Law', 'M&A', 'Corporate Law'],
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  // Fetch all sections in parallel
  const [toolsRes, newsRes, eventsRes, workflowsRes, promptRes, allToolsRes] = await Promise.all([
    adminSupabase.from('tools').select('id, name, slug, url, tagline, description, rechtsgebiet, category, votes, is_new, created_at').eq('status', 'approved').order('votes', { ascending: false }).limit(3),
    adminSupabase.from('news_articles').select('id, title, slug, summary, source_url, source_name, category, published_at, ai_generated').neq('source_url', '#').order('published_at', { ascending: false }).limit(4),
    adminSupabase.from('events').select('id, title, date, type, url, description').gte('date', new Date().toISOString().slice(0, 10)).order('date', { ascending: true }).limit(3),
    adminSupabase.from('workflows').select('id, title, slug, rechtsgebiet, reading_time, excerpt, created_at').eq('published', true).order('created_at', { ascending: false }).limit(3),
    adminSupabase.from('prompts').select('id, title, slug, prompt_text, use_case, rechtsgebiet, example_output, created_at').eq('is_prompt_of_day', true).limit(1),
    adminSupabase.from('tools').select('rechtsgebiet').eq('status', 'approved'),
  ])

  // Map without mock fallbacks — sections are hidden when data is absent
  const topTools: Tool[] = toolsRes.data?.length ? toolsRes.data.map(mapTool) : []

  const recentNews: NewsArticle[] = newsRes.data?.length ? newsRes.data.map(mapNews) : []

  const upcomingEvents: Event[] = eventsRes.data?.length ? eventsRes.data.map(mapEvent) : []

  const workflows: Workflow[] = workflowsRes.data?.length ? workflowsRes.data.map(mapWorkflow) : []

  const promptOfDay: Prompt | null =
    promptRes.data?.length ? mapPrompt(promptRes.data[0]) : null

  // Compute per-rechtsgebiet counts from all approved tools
  const fallbackCounts: Record<Rechtsgebiet, number> = { Steuerrecht: 0, 'M&A': 0, Gesellschaftsrecht: 0, 'Venture Capital': 0 }
  const rgCounts: Record<string, number> = {}
  if (allToolsRes.data && allToolsRes.data.length > 0) {
    for (const row of allToolsRes.data) {
      for (const rg of (row.rechtsgebiet as string[] ?? [])) {
        rgCounts[rg] = (rgCounts[rg] ?? 0) + 1
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }} />

      {/* HERO */}
      <section className="pt-16 pb-14 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 mb-6">
          <Zap className="w-3 h-3 text-blue-500" />
          <span className="text-xs text-blue-600 font-medium">Täglich kuratiert — KI für den deutschen Rechtsmarkt</span>
        </div>
        <h1>
          <span className="block font-display text-5xl sm:text-6xl lg:text-7xl text-gray-900 leading-tight tracking-tight">
            KI-Tools für den deutschen Rechtsmarkt.
          </span>
          <span className="block font-display text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight mt-2">
            <span className="text-blue-600">Kuratiert.</span>
            <span className="text-gray-900"> Praxisnah.</span>
          </span>
        </h1>
        <p className="mt-5 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Erprobte Tools, Workflows und Prompts für Kanzleien, Steuerberater und Inhouse-Teams — strukturiert nach Rechtsgebiet.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/tools" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors text-sm">
            Tools entdecken <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/prompts/builder" className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium px-5 py-2.5 rounded-xl border border-gray-200 transition-colors text-sm">
            Prompt Builder testen
          </Link>
        </div>
      </section>

      {/* STATE OF LEGAL AI — Research Report Callout */}
      <section className="mb-10">
        <Link href="/state-of-legal-ai" className="block group">
          <div className="bg-[#111827] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-[#1a2234] transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">LexLab Research</span>
                <span className="text-[10px] bg-blue-500 text-white font-bold px-2 py-0.5 rounded-full leading-none">Neu</span>
              </div>
              <p className="font-display font-bold text-lg text-white leading-snug">State of Legal AI Germany 2026</p>
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">Marktanalyse, Marktsegmente, Red Flags und Auswahlframework für den deutschen Rechts- und Steuermarkt.</p>
            </div>
            <div className="flex-shrink-0 inline-flex items-center gap-2 bg-white/10 group-hover:bg-white/15 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
              Report lesen <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>
      </section>

      {/* TOOLS OF THE WEEK */}
      {topTools.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-xl text-gray-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" /> Meist empfohlen
            </h2>
            <Link href="/tools" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Alle Tools <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topTools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
          </div>
        </section>
      )}

      {/* TOOL FINDER */}
      <section className="mb-12 pt-8 border-t border-gray-100">
        <FinderPanel />
      </section>

      {/* KATEGORIEN */}
      <section className="mb-14">
        <h2 className="font-display font-bold text-xl text-gray-900 flex items-center gap-2"><Grid3X3 className="w-5 h-5 text-gray-400" /> Tools nach Rechtsgebiet</h2>
        <p className="text-sm text-gray-500 mt-1 mb-4">Alle KI-Tools gefiltert nach deinem Fachgebiet</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {(Object.keys(rechtsgebietMeta) as Rechtsgebiet[]).map(rg => {
            const meta = rechtsgebietMeta[rg]
            const count = rgCounts[rg] ?? fallbackCounts[rg]
            return (
              <Link key={rg} href={`/tools?rechtsgebiet=${encodeURIComponent(rg)}`}
                className={`flex flex-col gap-3 p-4 rounded-xl border transition-all duration-150 ${meta.bg} ${meta.border}`}>
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">{meta.icon}</div>
                <div>
                  <p className={`font-display font-semibold text-sm ${meta.color}`}>{rg}</p>
                  <p className={`text-xs mt-0.5 ${meta.color} opacity-70`}>{count} Tools ansehen →</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* WORKFLOWS + PROMPT */}
      {(workflows.length > 0 || promptOfDay) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-14">
          {workflows.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-xl text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gray-400" /> Neue Workflows
                </h2>
                <Link href="/workflows" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  Alle <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {workflows.map(wf => (
                  <Link key={wf.id} href={`/workflows/${wf.slug}`}
                    className={`block bg-white border border-gray-100 border-l-4 ${workflowBorder[wf.rechtsgebiet[0]]} rounded-xl p-4 hover:shadow-md hover:border-gray-200 transition-all group`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-sans font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">{wf.title}</p>
                      <span className="flex-shrink-0 text-[9px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 mt-0.5 whitespace-nowrap">Vorschau</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <RechtsgebietTag tag={wf.rechtsgebiet[0]} />
                      <span className="text-xs text-gray-400">{wf.readingTime} min</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {promptOfDay && <PromptOfDay prompt={promptOfDay} />}
        </div>
      )}

      {/* NEWS + EVENTS */}
      {(recentNews.length > 0 || upcomingEvents.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-14">
          {recentNews.length > 0 && (
            <section className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-xl text-gray-900 flex items-center gap-2"><Newspaper className="w-5 h-5 text-gray-400" /> Aktuelles</h2>
                <Link href="/news" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  Alle News <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-50 overflow-hidden">
                {recentNews.map(article => (
                  <a key={article.id} href={article.sourceUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors group">
                    <span className={`flex-shrink-0 text-[10px] font-bold border rounded-md px-1.5 py-0.5 mt-0.5 ${sourceBadgeStyle[article.sourceName] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {article.sourceName}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">{article.title}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true, locale: de })}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {upcomingEvents.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-xl text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" /> Events
                </h2>
                <Link href="/events" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  Alle <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                {upcomingEvents.map(ev => {
                  const hasUrl = ev.url && ev.url !== '#'
                  const cardCls = `bg-white border border-gray-100 rounded-xl p-4 block${hasUrl ? ' hover:shadow-md hover:border-gray-200 transition-all duration-200 group' : ''}`
                  const inner = (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${eventTypeBadge[ev.type] ?? 'bg-gray-100 text-gray-600'}`}>{ev.type}</span>
                        <span className="text-xs text-gray-400">{format(new Date(ev.date), 'd. MMM', { locale: de })}</span>
                      </div>
                      <p className={`text-sm font-medium text-gray-800 leading-snug line-clamp-2${hasUrl ? ' group-hover:text-blue-600 transition-colors' : ''}`}>{ev.title}</p>
                      {ev.description && <p className="text-xs text-gray-400 mt-1">{ev.description}</p>}
                    </>
                  )
                  return hasUrl ? (
                    <a key={ev.id} href={ev.url} target="_blank" rel="noopener noreferrer" className={cardCls}>
                      {inner}
                    </a>
                  ) : (
                    <div key={ev.id} className={cardCls}>{inner}</div>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      )}

      {/* NEWSLETTER CTA */}
      <section className="bg-white border border-gray-100 rounded-2xl p-8 mb-16 text-center">
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-2 flex items-center justify-center gap-2"><Mail className="w-5 h-5 text-gray-400" /> KI-Tools, Workflows und News für Juristen</h2>
        <p className="text-gray-500 text-sm mb-6">Kein Spam. Jederzeit abmeldbar. Kostenlos.</p>
        <NewsletterForm />
        <p className="text-xs text-gray-400 mt-3">
          Mit der Anmeldung akzeptierst du unsere <a href="/datenschutz" className="underline hover:text-gray-600">Datenschutzerklärung</a>.
        </p>
      </section>
    </div>
  )
}
