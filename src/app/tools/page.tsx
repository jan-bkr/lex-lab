import type { Metadata } from 'next'
import { adminSupabase } from '@/lib/supabase/admin'
import { Tool, Rechtsgebiet } from '@/types'
import ToolsContent from './ToolsContent'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'KI-Tools für Juristen',
  description: 'Kuratierte KI-Tools für Steuerrecht, M&A, Gesellschaftsrecht und Venture Capital — bewertet nach Praxisreife, Datenschutz und DACH-Eignung.',
  openGraph: {
    title: 'KI-Tools für Juristen — LexLab',
    description: 'Kuratierte KI-Tools für Steuerrecht, M&A, Gesellschaftsrecht und Venture Capital — bewertet nach Praxisreife, Datenschutz und DACH-Eignung.',
  },
}

// ─── DB row → domain mapper ────────────────────────────────────────────────────

interface ToolRow {
  id: string
  name: string
  slug: string
  url: string
  tagline: string | null
  description: string | null
  rechtsgebiet: string[] | null
  category: string[] | null
  votes: number | null
  is_new: boolean | null
  created_at: string
  lexlab_score: number | null
}

function mapRow(row: ToolRow): Tool {
  return {
    id:           row.id,
    name:         row.name,
    slug:         row.slug,
    url:          row.url,
    tagline:      row.tagline ?? '',
    description:  row.description ?? '',
    rechtsgebiet: (row.rechtsgebiet ?? []) as Rechtsgebiet[],
    category:     row.category ?? [],
    votes:        row.votes ?? 0,
    isNew:        row.is_new ?? false,
    createdAt:    row.created_at,
    lexlabScore:  row.lexlab_score,
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ToolsPage() {
  const { data, error } = await adminSupabase
    .from('tools')
    .select('id, name, slug, url, tagline, description, rechtsgebiet, category, votes, is_new, created_at, lexlab_score')
    .eq('status', 'approved')

  if (error) {
    console.error('[tools] failed to load:', error.message)
  }

  const initialTools: Tool[] = (data ?? []).map(row => mapRow(row as ToolRow))

  return <ToolsContent initialTools={initialTools} />
}
