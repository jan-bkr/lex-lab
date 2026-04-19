import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { adminSupabase } from '@/lib/supabase/admin'
import WorkflowDetailClient from './WorkflowDetailClient'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data } = await adminSupabase
    .from('workflows')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (!data) return { title: 'Workflow nicht gefunden' }

  return {
    title: data.title,
    description: data.excerpt ?? '',
    openGraph: {
      title: `${data.title} — LexLab`,
      description: data.excerpt ?? '',
    },
  }
}

export default async function WorkflowDetailPage({ params }: Props) {
  const { slug } = await params
  const { data } = await adminSupabase
    .from('workflows')
    .select('id')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (!data) notFound()

  return <WorkflowDetailClient params={params} />
}
