import type { Metadata } from 'next'
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
      title: `${data.title} | LexLab`,
      description: data.excerpt ?? '',
    },
  }
}

export default function WorkflowDetailPage({ params }: Props) {
  return <WorkflowDetailClient params={params} />
}
