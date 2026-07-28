'use client'

import { useState } from 'react'
import { Check, Copy, ExternalLink } from 'lucide-react'

export default function PromptActions({ promptText }: { promptText: string }) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(promptText)
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 2000)
    } catch {
      setCopyState('error')
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        type="button"
        onClick={handleCopy}
        className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
          copyState === 'copied'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-[#111827] hover:bg-[#1f2937] text-white border border-[#111827]'
        }`}
      >
        {copyState === 'copied' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copyState === 'copied' ? 'Prompt kopiert' : 'Prompt kopieren'}
      </button>
      <a
        href={`https://claude.ai/new?q=${encodeURIComponent(promptText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors"
      >
        In Claude öffnen <ExternalLink className="w-4 h-4" />
      </a>
      <p className="sr-only" role="status" aria-live="polite">
        {copyState === 'copied' ? 'Prompt wurde in die Zwischenablage kopiert.' : copyState === 'error' ? 'Kopieren nicht möglich.' : ''}
      </p>
      {copyState === 'error' && (
        <p className="sm:basis-full text-xs text-red-600">
          Kopieren war nicht möglich. Bitte markiere den Prompt manuell.
        </p>
      )}
    </div>
  )
}
