'use client'

import { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { Check, X, Clock, ExternalLink } from 'lucide-react'
import { fetchComments, approveComment, rejectComment, type AdminComment } from '../actions'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function CommentRow({
  comment,
  onApprove,
  onReject,
  isPending,
}: {
  comment: AdminComment
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  isPending: boolean
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="font-semibold text-sm text-gray-900">{comment.name}</span>
            <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md border border-gray-200">
              {comment.role}
            </span>
            {comment.rating != null && (
              <span className="text-[11px] text-amber-500 font-medium tracking-tight">
                {'★'.repeat(comment.rating)}{'☆'.repeat(5 - comment.rating)}
              </span>
            )}
            {comment.rechtsgebiet?.map(rg => (
              <span key={rg} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md border border-blue-100">
                {rg}
              </span>
            ))}
          </div>
          {comment.tools && (
            <Link
              href={`/tools/${comment.tools.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
            >
              Tool: {comment.tools.name} <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          {formatDate(comment.created_at)}
        </div>
      </div>

      {comment.comment ? (
        <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3">
          {comment.comment}
        </p>
      ) : (
        <p className="text-xs text-gray-400 italic bg-gray-50 rounded-lg p-3">
          Nur Bewertung, kein Kommentartext.
        </p>
      )}

      {onApprove && onReject && (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onReject(comment.id)}
            disabled={isPending}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 disabled:opacity-50 transition-colors"
          >
            <X className="w-3 h-3" /> Ablehnen
          </button>
          <button
            onClick={() => onApprove(comment.id)}
            disabled={isPending}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 disabled:opacity-50 transition-colors"
          >
            <Check className="w-3 h-3" /> Genehmigen
          </button>
        </div>
      )}
    </div>
  )
}

const TABS = ['Ausstehend', 'Genehmigt'] as const
type Tab = (typeof TABS)[number]

export default function AdminCommentsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Ausstehend')
  const [pending, setPending] = useState<AdminComment[]>([])
  const [approved, setApproved] = useState<AdminComment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [p, a] = await Promise.all([fetchComments('pending'), fetchComments('approved')])
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
    const item = pending.find(c => c.id === id)
    if (!item) return
    setPending(prev => prev.filter(c => c.id !== id))
    startTransition(async () => {
      try {
        await approveComment(id)
        setApproved(prev => [{ ...item, status: 'approved' as const }, ...prev])
      } catch {
        setPending(prev => [item, ...prev])
        setError('Fehler beim Genehmigen.')
      }
    })
  }

  function handleReject(id: string) {
    const item = pending.find(c => c.id === id)
    if (!item) return
    setPending(prev => prev.filter(c => c.id !== id))
    startTransition(async () => {
      try {
        await rejectComment(id)
      } catch {
        setPending(prev => [item, ...prev])
        setError('Fehler beim Ablehnen.')
      }
    })
  }

  const currentList = activeTab === 'Ausstehend' ? pending : approved

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Kommentare verwalten</h1>

      <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit mb-6">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-800'
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
          {[1, 2].map(i => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 animate-pulse space-y-2">
              <div className="h-4 bg-gray-100 rounded w-1/4" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
              <div className="h-10 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : currentList.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-10 text-center text-sm text-gray-400">
          {activeTab === 'Ausstehend' ? 'Keine ausstehenden Kommentare.' : 'Noch keine genehmigten Kommentare.'}
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map(c => (
            <CommentRow
              key={c.id}
              comment={c}
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
