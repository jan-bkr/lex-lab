import type { Metadata } from 'next'
import { adminSupabase } from '@/lib/supabase/admin'
import { Prompt, Rechtsgebiet } from '@/types'
import PromptsContent from './PromptsContent'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Prompt-Bibliothek',
  description: 'Kopierfertige KI-Prompts für Steuerrecht, M&A, Gesellschaftsrecht und Venture Capital — kuratiert für Rechtsanwälte und Steuerberater im deutschen Rechtsmarkt.',
  openGraph: {
    title: 'Prompt-Bibliothek — LexLab',
    description: 'Kopierfertige KI-Prompts für Steuerrecht, M&A, Gesellschaftsrecht und Venture Capital — kuratiert für den deutschen Rechtsmarkt.',
  },
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PromptRow {
  id: string
  title: string
  slug: string
  prompt_text: string
  use_case: string | null
  rechtsgebiet: string[] | null
  example_output: string | null
  created_at: string
}

function mapRow(row: PromptRow): Prompt {
  return {
    id:            row.id,
    title:         row.title,
    slug:          row.slug,
    promptText:    row.prompt_text,
    useCase:       row.use_case ?? '',
    rechtsgebiet:  (row.rechtsgebiet ?? []) as Rechtsgebiet[],
    exampleOutput: row.example_output ?? '',
    createdAt:     row.created_at,
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PromptsPage() {
  const { data, error } = await adminSupabase
    .from('prompts')
    .select('id, title, slug, prompt_text, use_case, rechtsgebiet, example_output, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('[prompts] failed to load:', error.message)
  }

  const initialPrompts: Prompt[] = (data ?? []).map(row => mapRow(row as PromptRow))

  return <PromptsContent initialPrompts={initialPrompts} />
}
