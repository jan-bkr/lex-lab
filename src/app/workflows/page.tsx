import type { Metadata } from 'next'
import { adminSupabase } from '@/lib/supabase/admin'
import WorkflowsClient from './WorkflowsClient'
import type { DbWorkflowRow } from './blueprints'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Workflow Blueprints',
  description:
    'Legal Workflow Intelligence für Kanzleien und Steuerberater — strukturierte Agent-Blueprints mit KI-Rollen, Human Review Gates und DACH-spezifischer Praxisausrichtung.',
  alternates: { canonical: 'https://www.lex-lab.de/workflows' },
  openGraph: {
    title: 'Workflow Blueprints — LexLab',
    description:
      'Strukturierte Arbeitsarchitekturen für KI-gestützte Rechtspraxis. Jeder Blueprint dokumentiert Schritte, Rollen, Tools und Review-Punkte.',
  },
}

export default async function WorkflowsPage() {
  const { data } = await adminSupabase
    .from('workflows')
    .select('id, title, slug, rechtsgebiet, reading_time, excerpt, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const initialDbWorkflows = (data ?? []) as DbWorkflowRow[]

  return <WorkflowsClient initialDbWorkflows={initialDbWorkflows} />
}
