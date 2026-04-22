import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { adminSupabase } from '@/lib/supabase/admin'
import { WORKFLOW_BLUEPRINTS, type DbWorkflowRow } from '../blueprints'
import WorkflowDetailClient from './WorkflowDetailClient'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const blueprint = WORKFLOW_BLUEPRINTS.find(b => b.slug === slug)

  if (blueprint) {
    return {
      title: blueprint.title,
      description: `${blueprint.problem} — ${blueprint.subtitle}`,
      openGraph: {
        title: `${blueprint.title} — LexLab`,
        description: blueprint.problem,
      },
    }
  }

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

  const blueprint = WORKFLOW_BLUEPRINTS.find(b => b.slug === slug) ?? null

  let dbWorkflow: DbWorkflowRow | null = null
  if (!blueprint) {
    const { data } = await adminSupabase
      .from('workflows')
      .select('id, title, slug, rechtsgebiet, reading_time, excerpt, created_at')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()

    if (!data) notFound()
    dbWorkflow = data as DbWorkflowRow
  }

  return <WorkflowDetailClient blueprint={blueprint} dbWorkflow={dbWorkflow} slug={slug} />
}
