'use client'

import { useState, useEffect, useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { fetchAllSubscribers, deleteSubscriber, type AdminSubscriber } from '../../actions'
import IssuesClient from './IssuesClient'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<AdminSubscriber[]>([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [isPending,   startTransition] = useTransition()

  useEffect(() => {
    fetchAllSubscribers()
      .then(setSubscribers)
      .catch(e => setError(e instanceof Error ? e.message : 'Fehler'))
      .finally(() => setLoading(false))
  }, [])

  function handleDelete(id: string) {
    const sub = subscribers.find(s => s.id === id)
    if (!sub) return
    setSubscribers(prev => prev.filter(s => s.id !== id))
    startTransition(async () => {
      try {
        await deleteSubscriber(id)
      } catch {
        setSubscribers(prev => [sub, ...prev])
        setError('Fehler beim Löschen.')
      }
    })
  }

  const confirmed   = subscribers.filter(s => s.confirmed)
  const unconfirmed = subscribers.filter(s => !s.confirmed)

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-8">Newsletter</h1>

      {/* ─── Issues ─── */}
      <IssuesClient />

      {/* ─── Subscribers ─── */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-gray-900">Abonnenten</h2>
            <p className="text-xs text-gray-400 mt-0.5">Bestätigte Newsletter-Empfänger</p>
          </div>
          {!loading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-lg text-xs font-medium">
                {confirmed.length} bestätigt
              </span>
              {unconfirmed.length > 0 && (
                <span className="bg-gray-100 text-gray-500 border border-gray-200 px-2.5 py-1 rounded-lg text-xs font-medium">
                  {unconfirmed.length} unbestätigt
                </span>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-56" />
              </div>
            ))}
          </div>
        ) : subscribers.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-10 text-center text-sm text-gray-400">
            Noch keine Abonnenten.
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">E-Mail</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Angemeldet</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {subscribers.map(sub => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 text-sm">{sub.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md border ${
                        sub.confirmed
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}>
                        {sub.confirmed ? 'Bestätigt' : 'Ausstehend'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{formatDate(sub.created_at)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        disabled={isPending}
                        className="p-1.5 text-gray-300 hover:text-red-500 disabled:opacity-40 transition-colors rounded-lg"
                        title="Abonnenten entfernen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
