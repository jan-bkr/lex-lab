'use client'

import { useEffect, useState } from 'react'
import { X, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { Prompt } from '@/types'
import { RechtsgebietTag } from './RechtsgebietTag'

interface Props {
  prompt: Prompt
  onClose: () => void
}

export function PromptModal({ prompt, onClose }: Props) {
  const [copied, setCopied] = useState(false)
  const [exampleOpen, setExampleOpen] = useState(false)

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt.promptText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`prompt-title-${prompt.id}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-8 pb-5">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {prompt.rechtsgebiet.map(tag => (
                <RechtsgebietTag key={tag} tag={tag} />
              ))}
              {prompt.useCase && (
                <span className="text-xs text-gray-400">{prompt.useCase}</span>
              )}
            </div>
            <h2 id={`prompt-title-${prompt.id}`} className="font-display font-bold text-2xl text-gray-900 leading-tight">
              {prompt.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            aria-label="Prompt schließen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <hr className="border-gray-100 mx-8" />

        {/* Prompt text */}
        <div className="p-8 pt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Prompt</p>
          <div className="bg-gray-50 rounded-xl p-4 text-sm font-mono leading-relaxed text-gray-700 whitespace-pre-wrap">
            {prompt.promptText}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={handleCopy}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
                copied
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-blue-600 hover:bg-blue-700 border-blue-600 text-white'
              }`}
            >
              {copied ? <><Check className="w-4 h-4" /> Kopiert!</> : <><Copy className="w-4 h-4" /> Prompt kopieren</>}
            </button>
            <a
              href={`https://claude.ai/new?q=${encodeURIComponent(prompt.promptText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 transition-all"
            >
              In Claude öffnen →
            </a>
          </div>

          {/* Collapsible example output */}
          {prompt.exampleOutput && (
            <div className="mt-5 border border-gray-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setExampleOpen(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <span>Beispiel-Output</span>
                {exampleOpen
                  ? <ChevronUp className="w-4 h-4 text-gray-400" />
                  : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {exampleOpen && (
                <div className="px-4 pb-4 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50">
                  {prompt.exampleOutput}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
