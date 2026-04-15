import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { adminSupabase } from '@/lib/supabase/admin'
import ToolDetailClient from './ToolDetailClient'

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

  return {
    title: data.name,
    description: data.tagline ?? data.description ?? '',
    openGraph: {
      title: `${data.name} | LexLab`,
      description: data.description ?? data.tagline ?? '',
    },
  }
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params
  const { data } = await adminSupabase
    .from('tools')
    .select('id')
    .eq('slug', slug)
    .eq('status', 'approved')
    .maybeSingle()

  if (!data) notFound()

  return <ToolDetailClient params={params} />
}
