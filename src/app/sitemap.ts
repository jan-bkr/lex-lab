import { MetadataRoute } from 'next'
import { adminSupabase } from '@/lib/supabase/admin'
import { EDITORIAL_ARTICLES } from '@/app/beitraege/articles'

const BASE = 'https://www.lex-lab.de'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static routes
  const static_routes: MetadataRoute.Sitemap = [
    { url: BASE,               lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/tools`,              lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/tools/finder`,       lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/tools/steuerrecht`,  lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/tools/ma`,           lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/news`,               lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/radar`,              lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/collections`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/collections/ma-due-diligence`,       lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/collections/datenschutzstark`,       lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/collections/steuerrecht-essentials`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/collections/inhouse-stack`,          lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/collections/einsteiger-stack`,       lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/state-of-legal-ai`,  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/workflows`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/prompts`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/prompts/builder`,    lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/method`,             lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/research`,           lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/research/legal-model-benchmark`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/tools/compare`,      lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/tools/compare/harvey-vs-luminance`,   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/tools/compare/copilot-vs-harvey`,     lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/tools/compare/chatgpt-vs-claude`,     lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/tools/compare/datev-vs-lexisnexis`,   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/tools/compare/clio-vs-advoware`,      lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/events`,             lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/beitraege`,          lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/newsletter`,         lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/kontakt`,            lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/impressum`,          lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/datenschutz`,        lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ]

  // Dynamic tool routes
  const { data: tools } = await adminSupabase
    .from('tools')
    .select('slug, created_at')
    .eq('status', 'approved')
  const tool_routes: MetadataRoute.Sitemap = (tools ?? []).map(t => ({
    url: `${BASE}/tools/${t.slug}`,
    lastModified: new Date(t.created_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Dynamic workflow routes
  const { data: workflows } = await adminSupabase
    .from('workflows')
    .select('slug, created_at')
    .eq('published', true)
  const workflow_routes: MetadataRoute.Sitemap = (workflows ?? []).map(w => ({
    url: `${BASE}/workflows/${w.slug}`,
    lastModified: new Date(w.created_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const [{ data: prompts }, { data: news }] = await Promise.all([
    adminSupabase.from('prompts').select('slug, created_at'),
    adminSupabase.from('news_articles').select('slug, published_at').not('slug', 'is', null),
  ])

  const prompt_routes: MetadataRoute.Sitemap = (prompts ?? []).map(prompt => ({
    url: `${BASE}/prompts/${prompt.slug}`,
    lastModified: new Date(prompt.created_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const news_routes: MetadataRoute.Sitemap = (news ?? [])
    .filter(article => article.slug)
    .map(article => ({
      url: `${BASE}/news/${article.slug}`,
      lastModified: new Date(article.published_at),
      changeFrequency: 'never' as const,
      priority: 0.6,
    }))

  const editorial_routes: MetadataRoute.Sitemap = EDITORIAL_ARTICLES.map(article => ({
    url: `${BASE}/beitraege/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...static_routes, ...tool_routes, ...workflow_routes, ...prompt_routes, ...news_routes, ...editorial_routes]
}
