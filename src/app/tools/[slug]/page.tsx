import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { adminSupabase } from '@/lib/supabase/admin'
import ToolDetailClient from './ToolDetailClient'

const BASE = 'https://www.lex-lab.de'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data } = await adminSupabase
    .from('tools')
    .select('name, tagline, description')
    .eq('slug', slug)
    .eq('status', 'approved')
    .maybeSingle()

  if (!data) return { title: 'Tool nicht gefunden' }

  const description = data.tagline ?? data.description ?? ''

  return {
    title: data.name,
    description,
    alternates: { canonical: `${BASE}/tools/${slug}` },
    openGraph: {
      title: `${data.name} — KI-Tool | LexLab`,
      description: data.description ?? description,
      url: `${BASE}/tools/${slug}`,
    },
  }
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params
  const { data } = await adminSupabase
    .from('tools')
    .select('id, name, tagline, description, rechtsgebiet, lexlab_score')
    .eq('slug', slug)
    .eq('status', 'approved')
    .maybeSingle()

  if (!data) notFound()

  // BreadcrumbList JSON-LD
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'LexLab', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'KI-Tools', item: `${BASE}/tools` },
      { '@type': 'ListItem', position: 3, name: data.name, item: `${BASE}/tools/${slug}` },
    ],
  }

  // SoftwareApplication JSON-LD
  const appLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: data.name,
    description: data.description ?? data.tagline ?? '',
    applicationCategory: 'LegalApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', priceCurrency: 'EUR' },
    inLanguage: 'de-DE',
  }
  if (data.lexlab_score != null) {
    appLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: String((data.lexlab_score / 10).toFixed(1)),
      bestRating: '10',
      worstRating: '1',
      ratingCount: '1',
    }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }} />
      <ToolDetailClient params={params} />
    </>
  )
}
