'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { RechtsgebietTag } from '@/components/RechtsgebietTag'
import { PromptModal } from '@/components/PromptModal'
import { createClient } from '@/lib/supabase/client'
import { mockPrompts } from '@/lib/mock-data'
import { Prompt, Rechtsgebiet } from '@/types'

const RECHTSGEBIETE: Rechtsgebiet[] = ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Venture Capital']

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
    id: row.id,
    title: row.title,
    slug: row.slug,
    promptText: row.prompt_text,
    useCase: row.use_case ?? '',
    rechtsgebiet: (row.rechtsgebiet ?? []) as Rechtsgebiet[],
    exampleOutput: row.example_output ?? '',
    createdAt: row.created_at,
    isPromptOfDay: row.is_prompt_of_day,
  }
}

function PromptCard({
  prompt,
  onClick,
}: {
  prompt: PromptWithDay
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-3 hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer group"
    >
      {/* Top row: badge + tags */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {prompt.rechtsgebiet.map(tag => (
            <RechtsgebietTag key={tag} tag={tag} />
          ))}
        </div>
        {prompt.isPromptOfDay && (
          <span className="flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md border border-amber-200 flex-shrink-0 whitespace-nowrap">
            <Star className="w-2.5 h-2.5" />
            Prompt des Tages
          </span>
        )}
      </div>

      {/* Title */}
      <h2 className="font-display font-semibold text-[14px] text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
        {prompt.title}
      </h2>

      {/* Use case */}
      {prompt.useCase && (
        <p className="text-sm text-gray-500 leading-snug">{prompt.useCase}</p>
      )}

      {/* CTA hint */}
      <p className="text-xs text-blue-600 font-medium mt-auto">Prompt ansehen →</p>
    </div>
  )
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<PromptWithDay[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<Rechtsgebiet | 'Alle'>('Alle')
  const [selectedPrompt, setSelectedPrompt] = useState<PromptWithDay | null>(null)

  useEffect(() => {
    async function fetchPrompts() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('is_prompt_of_day', { ascending: false })
        .order('created_at', { ascending: false })

      if (error || !data || data.length === 0) {
        setPrompts(mockPrompts.map(p => ({ ...p, isPromptOfDay: false })))
      } else {
        setPrompts((data as PromptRow[]).map(mapRow))
      }
      setLoading(false)
    }
    fetchPrompts()
  }, [])

  const filtered = prompts.filter(
    p => activeFilter === 'Alle' || p.rechtsgebiet.includes(activeFilter)
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">Prompt-Bibliothek</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Kopierfertige KI-Prompts für Steuerrecht, M&A, Gesellschaftsrecht und Venture Capital
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {(['Alle', ...RECHTSGEBIETE] as const).map(rg => (
          <button
            key={rg}
            onClick={() => setActiveFilter(rg)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              activeFilter === rg
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {rg}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 animate-pulse space-y-3">
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
              <div className="h-10 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-sm text-gray-400">
          Keine Prompts für dieses Rechtsgebiet gefunden.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <PromptCard key={p.id} prompt={p} onClick={() => setSelectedPrompt(p)} />
          ))}
        </div>
      )}

      {selectedPrompt && (
        <PromptModal prompt={selectedPrompt} onClose={() => setSelectedPrompt(null)} />
      )}
    </div>
  )
}
