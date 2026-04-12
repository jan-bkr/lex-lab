'use client'

import { Tool } from '@/types'
import { RechtsgebietTag } from './RechtsgebietTag'
import { ExternalLink, ChevronUp } from 'lucide-react'
import Link from 'next/link'

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <div className="group bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {/* Icon placeholder */}
          <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
            <span className="font-display font-bold text-sm text-gray-600">
              {tool.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-[14px] text-gray-900">{tool.name}</span>
              {tool.isNew && (
                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md border border-blue-100">
                  Neu
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5 leading-snug">{tool.tagline}</p>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{tool.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {tool.rechtsgebiet.map(tag => (
          <RechtsgebietTag key={tag} tag={tag} />
        ))}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Ansehen <ExternalLink className="w-3 h-3" />
        </a>
        <button onClick={e => e.stopPropagation()} className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 border border-gray-100 hover:border-gray-200 rounded-lg px-2 py-1 transition-all">
          <ChevronUp className="w-3 h-3" />
          <span>{tool.votes}</span>
        </button>
      </div>
    </div>
  )
}
