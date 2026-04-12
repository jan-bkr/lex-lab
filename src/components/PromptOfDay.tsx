'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Prompt } from '@/types'
import { RechtsgebietTag } from './RechtsgebietTag'
import { PromptModal } from './PromptModal'

export function PromptOfDay({ prompt }: { prompt: Prompt }) {
  const [open, setOpen] = useState(false)

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-xl text-gray-900">Prompt des Tages</h2>
        <Link href="/prompts" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
          Alle <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="w-full text-left bg-blue-50 border border-blue-100 rounded-xl p-5 flex flex-col gap-4 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
      >
        <div>
          <div className="flex items-center gap-2 mb-3">
            <RechtsgebietTag tag={prompt.rechtsgebiet[0]} />
            <span className="text-xs text-gray-400 font-medium">{prompt.useCase}</span>
          </div>
          <h3 className="font-display font-bold text-base text-gray-900 leading-snug mb-3">
            {prompt.title}
          </h3>
          <div className="bg-white/60 rounded-lg p-3 max-h-20 overflow-hidden relative">
            <p className="text-xs text-gray-600 font-mono leading-relaxed line-clamp-3">
              {prompt.promptText}
            </p>
            <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-blue-50/80 to-transparent rounded-b-lg" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-blue-600 group-hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
            Prompt ansehen →
          </span>
          <span className="text-xs text-gray-400">Täglich neu kuratiert</span>
        </div>
      </button>

      {open && <PromptModal prompt={prompt} onClose={() => setOpen(false)} />}
    </section>
  )
}
