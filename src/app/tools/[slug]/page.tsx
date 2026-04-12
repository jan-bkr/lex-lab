import type { Metadata } from 'next'
import { adminSupabase } from '@/lib/supabase/admin'
import ToolDetailClient from './ToolDetailClient'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data } = await adminSupabase
    .from('tools')
    .select('name, tagline, description')
    .eq('slug', slug)
    .maybeSingle()

  if (!data) return { title: 'Tool nicht gefunden' }

  return {
    title: data.name,
    description: data.tagline ?? data.description ?? '',
    openGraph: {
      title: `${data.name} | lex-lab.de`,
      description: data.description ?? data.tagline ?? '',
    },
  }
}

export default function ToolDetailPage({ params }: Props) {
  return <ToolDetailClient params={params} />
}
