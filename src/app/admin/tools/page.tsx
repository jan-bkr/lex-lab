'use client'

import { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { ExternalLink, Check, X, Clock, Pencil } from 'lucide-react'
import { fetchTools, approveTool, rejectTool, type AdminTool } from '../actions'

const TABS = ['Ausstehend', 'Genehmigt'] as const
type Tab = (typeof TABS)[number]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function RechtsgebietPill({ tag }: { tag: string }) {
  return (
    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200">
      {tag}
    </span>
  )
}

function ToolRow({
  tool,
  onApprove,
  onReject,
  isPending,
}: {
  tool: AdminTool
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  isPending: boolean
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-display font-semibold text-sm text-gray-900">{tool.name}</span>
            {tool.is_new && (
              <span className="text-[9px] font-bold uppercase tracking-wide bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded-md">
                Neu
              </span>
            )}
          </div>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
          >
            {tool.url} <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          {formatDate(tool.created_at)}
          {tool.submitted_by && <span className="ml-1">· {tool.submitted_by}</span>}
        </div>
      </div>

      {tool.tagline && <p className="text-xs text-gray-500 italic">{tool.tagline}</p>}
      {tool.description && (
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{tool.description}</p>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex flex-wrap gap-1">
          {tool.rechtsgebiet.map(tag => (
            <RechtsgebietPill key={tag} tag={tag} />
          ))}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/admin/tools/${tool.id}/edit`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <Pencil className="w-3 h-3" />
            Bearbeiten
          </Link>
          {onApprove && onReject && (
            <>
              <button
                onClick={() => onReject(tool.id)}
                disabled={isPending}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 disabled:opacity-50 transition-colors"
              >
                <X className="w-3 h-3" />
                Ablehnen
              </button>
              <button
                onClick={() => onApprove(tool.id)}
                disabled={isPending}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 disabled:opacity-50 transition-colors"
              >
                <Check className="w-3 h-3" />
                Genehmigen
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminToolsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Ausstehend')
  const [pending, setPending] = useState<AdminTool[]>([])
  const [approved, setApproved] = useState<AdminTool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [p, a] = await Promise.all([fetchTools('pending'), fetchTools('approved')])
        setPending(p)
        setApproved(a)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Fehler beim Laden')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function handleApprove(id: string) {
    const tool = pending.find(t => t.id === id)
    if (!tool) return
    setPending(prev => prev.filter(t => t.id !== id)) // optimistic
    startTransition(async () => {
      try {
        await approveTool(id)
        setApproved(prev => [{ ...tool, status: 'approved' as const }, ...prev])
      } catch {
        setPending(prev => [tool, ...prev]) // revert
        setError('Fehler beim Genehmigen. Bitte erneut versuchen.')
      }
    })
  }

  function handleReject(id: string) {
    const tool = pending.find(t => t.id === id)
    if (!tool) return
    setPending(prev => prev.filter(t => t.id !== id)) // optimistic
    startTransition(async () => {
      try {
        await rejectTool(id)
      } catch {
        setPending(prev => [tool, ...prev]) // revert
        setError('Fehler beim Ablehnen. Bitte erneut versuchen.')
      }
    })
  }

  const currentList = activeTab === 'Ausstehend' ? pending : approved

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Tools verwalten</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit mb-6">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab}
            <span className="ml-1.5 text-xs opacity-70">
              ({tab === 'Ausstehend' ? pending.length : approved.length})
            </span>
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 animate-pulse space-y-2">
              <div className="h-4 bg-gray-100 rounded w-1/4" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
              <div className="h-3 bg-gray-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : currentList.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-10 text-center text-sm text-gray-400">
          {activeTab === 'Ausstehend'
            ? 'Keine ausstehenden Tools — alles geprüft!'
            : 'Noch keine genehmigten Tools.'}
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map(tool => (
            <ToolRow
              key={tool.id}
              tool={tool}
              onApprove={activeTab === 'Ausstehend' ? handleApprove : undefined}
              onReject={activeTab === 'Ausstehend' ? handleReject : undefined}
              isPending={isPending}
            />
          ))}
        </div>
      )}
    </div>
  )
}
