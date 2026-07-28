import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { adminSupabase } from '@/lib/supabase/admin'
import type { NewsArticle } from '@/types'

const BASE = 'https://www.lex-lab.de'

type Props = { params: Promise<{ slug: string }> }

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

function mapNews(row: NewsRow): NewsArticle {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary ?? '',
    sourceUrl: row.source_url ?? '',
    sourceName: row.source_name ?? '',
    category: row.category ?? '',
    publishedAt: row.published_at,
    aiGenerated: row.ai_generated,
  }
}

async function getArticle(slug: string): Promise<NewsArticle | null> {
  const { data } = await adminSupabase
    .from('news_articles')
    .select('id, title, slug, summary, source_url, source_name, category, published_at, ai_generated')
    .eq('slug', slug)
    .maybeSingle()

  return data ? mapNews(data as NewsRow) : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) return { title: 'Meldung nicht gefunden' }

  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: `${BASE}/news/${slug}` },
    openGraph: {
      title: `${article.title} — LexLab`,
      description: article.summary,
      url: `${BASE}/news/${slug}`,
      type: 'article',
      publishedTime: article.publishedAt,
    },
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) notFound()

  const { data: relatedRows } = await adminSupabase
    .from('news_articles')
    .select('id, title, slug, summary, source_url, source_name, category, published_at, ai_generated')
    .neq('id', article.id)
    .order('published_at', { ascending: false })
    .limit(3)

  const related = (relatedRows ?? []).map(row => mapNews(row as NewsRow))
  const hasSource = article.sourceUrl.startsWith('http')
  const published = format(new Date(article.publishedAt), 'd. MMMM yyyy, HH:mm', { locale: de })

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    datePublished: article.publishedAt,
    description: article.summary,
    inLanguage: 'de-DE',
    author: { '@type': 'Organization', name: 'LexLab' },
    publisher: { '@type': 'Organization', name: 'LexLab', url: BASE },
    mainEntityOfPage: `${BASE}/news/${slug}`,
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <Link href="/news" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Alle Meldungen
      </Link>

      <article>
        <header className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
            {article.sourceName && (
              <span className="font-bold uppercase tracking-wide text-blue-700 bg-blue-50 border border-blue-100 rounded-md px-2 py-1">
                {article.sourceName}
              </span>
            )}
            {article.category && (
              <span className="font-medium text-gray-600 bg-white border border-gray-200 rounded-md px-2 py-1">
                {article.category}
              </span>
            )}
            <time dateTime={article.publishedAt} className="text-gray-400">{published} Uhr</time>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-gray-900 leading-tight tracking-tight">
            {article.title}
          </h1>
        </header>

        <div className="mt-8 bg-white border border-gray-100 rounded-2xl p-6 sm:p-8">
          <p className="text-lg text-gray-700 leading-relaxed">{article.summary}</p>

          {hasSource && (
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 bg-[#111827] hover:bg-[#1f2937] text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
            >
              Originalquelle lesen <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        <div className="mt-5 flex gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
          <ShieldCheck className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 leading-relaxed">
            Diese Zusammenfassung dient der schnellen Orientierung und ersetzt weder die Originalquelle noch eine rechtliche Prüfung.
            {article.aiGenerated ? ' Sie wurde KI-gestützt erstellt und redaktionell kuratiert.' : ' Sie wurde redaktionell erstellt.'}
          </p>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-14 pt-10 border-t border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl text-gray-900">Weitere Meldungen</h2>
            <Link href="/news" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
              Alle <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {related.map(item => (
              <Link key={item.id} href={`/news/${item.slug}`} className="group bg-white border border-gray-100 hover:border-gray-200 rounded-xl p-4 transition-colors">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">{item.category || item.sourceName}</p>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 leading-snug transition-colors">{item.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
