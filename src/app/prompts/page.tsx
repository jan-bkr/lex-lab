import type { Metadata } from 'next'
import { adminSupabase } from '@/lib/supabase/admin'
import { Prompt, Rechtsgebiet } from '@/types'
import PromptsContent from './PromptsContent'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Prompt-Bibliothek — LexLab',
  description: 'Kopierfertige KI-Prompts für Steuerrecht, M&A, Gesellschaftsrecht und Venture Capital — kuratiert für den deutschen Rechtsmarkt.',
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
  is_prompt_of_day: boolean
  created_at: string
}

interface PromptWithDay extends Prompt {
  isPromptOfDay: boolean
}

function mapRow(row: PromptRow): PromptWithDay {
  return {
    id:            row.id,
    title:         row.title,
    slug:          row.slug,
    promptText:    row.prompt_text,
    useCase:       row.use_case ?? '',
    rechtsgebiet:  (row.rechtsgebiet ?? []) as Rechtsgebiet[],
    exampleOutput: row.example_output ?? '',
    createdAt:     row.created_at,
    isPromptOfDay: row.is_prompt_of_day,
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PromptsPage() {
  const { data, error } = await adminSupabase
    .from('prompts')
    .select('id, title, slug, prompt_text, use_case, rechtsgebiet, example_output, is_prompt_of_day, created_at')
    .order('is_prompt_of_day', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('[prompts] failed to load:', error.message)
  }

  const initialPrompts: PromptWithDay[] = (data ?? []).map(row => mapRow(row as PromptRow))

  return <PromptsContent initialPrompts={initialPrompts} />
}
