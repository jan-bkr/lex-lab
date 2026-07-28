import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Bot, CheckCircle2 } from 'lucide-react'
import { adminSupabase } from '@/lib/supabase/admin'
import { RechtsgebietTag } from '@/components/RechtsgebietTag'
import PromptActions from '@/components/PromptActions'
import type { Prompt, Rechtsgebiet } from '@/types'

const BASE = 'https://www.lex-lab.de'

type Props = { params: Promise<{ slug: string }> }

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

function mapPrompt(row: PromptRow): Prompt {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    promptText: row.prompt_text,
    useCase: row.use_case ?? '',
    rechtsgebiet: (row.rechtsgebiet ?? []) as Rechtsgebiet[],
    exampleOutput: row.example_output ?? '',
    createdAt: row.created_at,
  }
}

async function getPrompt(slug: string): Promise<Prompt | null> {
  const { data } = await adminSupabase
    .from('prompts')
    .select('id, title, slug, prompt_text, use_case, rechtsgebiet, example_output, created_at')
    .eq('slug', slug)
    .maybeSingle()

  return data ? mapPrompt(data as PromptRow) : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const prompt = await getPrompt(slug)

  if (!prompt) return { title: 'Prompt nicht gefunden' }

  const description = prompt.useCase || `Kopierfertiger KI-Prompt: ${prompt.title}`
  return {
    title: prompt.title,
    description,
    alternates: { canonical: `${BASE}/prompts/${slug}` },
    openGraph: {
      title: `${prompt.title} — LexLab Prompt`,
      description,
      url: `${BASE}/prompts/${slug}`,
    },
  }
}

export default async function PromptDetailPage({ params }: Props) {
  const { slug } = await params
  const prompt = await getPrompt(slug)

  if (!prompt) notFound()

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'LexLab', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Prompt-Bibliothek', item: `${BASE}/prompts` },
      { '@type': 'ListItem', position: 3, name: prompt.title, item: `${BASE}/prompts/${slug}` },
    ],
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <Link href="/prompts" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Prompt-Bibliothek
      </Link>

      <header className="max-w-3xl mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {prompt.rechtsgebiet.map(tag => <RechtsgebietTag key={tag} tag={tag} />)}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-gray-900 leading-tight tracking-tight">
          {prompt.title}
        </h1>
        {prompt.useCase && (
          <p className="mt-4 text-base text-gray-500 leading-relaxed">{prompt.useCase}</p>
        )}
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_240px] gap-6 items-start">
        <div className="space-y-5">
          <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-500" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Kopierfertiger Prompt</h2>
            </div>
            <div className="p-5 sm:p-6">
              <pre className="font-mono text-[13px] sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                {prompt.promptText}
              </pre>
            </div>
          </section>

          <PromptActions promptText={prompt.promptText} />

          {prompt.exampleOutput && (
            <section className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6">
              <h2 className="font-display text-xl text-gray-900 mb-3">Beispiel-Output</h2>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{prompt.exampleOutput}</div>
            </section>
          )}
        </div>

        <aside className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Vor dem Absenden</p>
          <ul className="space-y-3">
            {[
              'Sachverhalt und Ziel ergänzen',
              'Vertrauliche Daten anonymisieren',
              'Ergebnis juristisch prüfen',
            ].map(item => (
              <li key={item} className="flex gap-2 text-sm text-blue-900">
                <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <Link href="/prompts/builder" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-900">
            Eigenen Prompt bauen <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </aside>
      </div>
    </div>
  )
}
