'use client'

import { useState } from 'react'
import { Star, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { RechtsgebietTag } from '@/components/RechtsgebietTag'
import { PromptModal } from '@/components/PromptModal'
import { Prompt, Rechtsgebiet } from '@/types'

const RECHTSGEBIETE: Rechtsgebiet[] = ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Venture Capital']

interface PromptWithDay extends Prompt {
  isPromptOfDay: boolean
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

export default function PromptsContent({ initialPrompts }: { initialPrompts: PromptWithDay[] }) {
  const [activeFilter,   setActiveFilter]   = useState<Rechtsgebiet | 'Alle'>('Alle')
  const [selectedPrompt, setSelectedPrompt] = useState<PromptWithDay | null>(null)

  const filtered = initialPrompts.filter(
    p => activeFilter === 'Alle' || p.rechtsgebiet.includes(activeFilter)
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-gray-900">Prompt-Bibliothek</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Kopierfertige KI-Prompts für Steuerrecht, M&amp;A, Gesellschaftsrecht und Venture Capital
        </p>
      </div>

      {/* Builder CTA */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-900">Prompt Builder</p>
            <p className="text-sm text-blue-700 mt-0.5">
              Lass LexLab deinen optimalen Prompt generieren — in 30 Sekunden.
            </p>
          </div>
        </div>
        <Link
          href="/prompts/builder"
          className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          Jetzt ausprobieren →
        </Link>
      </div>

      {/* Filter pills */}
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

      {filtered.length === 0 && activeFilter === 'Alle' ? (
        <div className="text-center py-16 text-sm text-gray-400">
          Noch keine Prompts verfügbar.
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
