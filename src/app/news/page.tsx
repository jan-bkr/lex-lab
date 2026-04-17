import type { Metadata } from 'next'
import { adminSupabase } from '@/lib/supabase/admin'
import { NewsArticle } from '@/types'
import NewsContent from './NewsContent'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Aktuelle Rechtsnachrichten',
  description: 'Ausgewählte Meldungen aus dem deutschen Rechts- und Steuermarkt — täglich aus juristischen Fachquellen kuratiert. KI-Zusammenfassungen mit Quellenangabe.',
  openGraph: {
    title: 'Aktuelle Rechtsnachrichten — LexLab',
    description: 'Ausgewählte Meldungen aus dem deutschen Rechts- und Steuermarkt — täglich aus juristischen Fachquellen kuratiert.',
  },
}

// ─── DB row → domain mapper ────────────────────────────────────────────────────

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
    id:          row.id,
    title:       row.title,
    slug:        row.slug,
    summary:     row.summary ?? '',
    sourceUrl:   row.source_url ?? '',
    sourceName:  row.source_name ?? '',
    category:    row.category ?? '',
    publishedAt: row.published_at,
    aiGenerated: row.ai_generated,
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function NewsPage() {
  const { data, error } = await adminSupabase
    .from('news_articles')
    .select('id, title, slug, summary, source_url, source_name, category, published_at, ai_generated')
    .neq('source_url', '#')
    .order('published_at', { ascending: false })
    .limit(60)

  if (error) {
    console.error('[news] failed to load articles:', error.message)
  }

  const initialArticles: NewsArticle[] = (data ?? []).map(row => mapRow(row as NewsRow))

  return <NewsContent initialArticles={initialArticles} />
}
