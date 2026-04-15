'use client'

import { useState, useEffect, useTransition } from 'react'
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import {
  fetchAllEvents,
  addEvent,
  deleteEvent,
  type AdminEvent,
} from '../actions'

const EVENT_TYPES = ['BFH', 'BGH', 'Gesetz', 'Konferenz']

interface AddForm {
  title: string
  date: string
  type: string
  url: string
  description: string
}

const EMPTY_FORM: AddForm = {
  title: '',
  date: '',
  type: 'Konferenz',
  url: '',
  description: '',
}

const TYPE_STYLES: Record<string, string> = {
  BFH:       'bg-emerald-50 text-emerald-700 border-emerald-200',
  BGH:       'bg-blue-50 text-blue-700 border-blue-200',
  Gesetz:    'bg-amber-50 text-amber-700 border-amber-200',
  Konferenz: 'bg-gray-100 text-gray-600 border-gray-200',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function isPast(dateStr: string): boolean {
  return new Date(dateStr) < new Date()
}

export default function AdminEventsPage() {
  const [events, setEvents]         = useState<AdminEvent[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [showForm, setShowForm]     = useState(false)
  const [form, setForm]             = useState<AddForm>(EMPTY_FORM)
  const [formError, setFormError]   = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    fetchAllEvents()
      .then(setEvents)
      .catch(e => setError(e instanceof Error ? e.message : 'Fehler'))
      .finally(() => setLoading(false))
  }, [])

  function handleDelete(id: string) {
    const ev = events.find(e => e.id === id)
    if (!ev) return
    setEvents(prev => prev.filter(e => e.id !== id))
    startTransition(async () => {
      try {
        await deleteEvent(id)
      } catch {
        setEvents(prev => [ev, ...prev])
        setError('Fehler beim Löschen.')
      }
    })
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!form.title.trim() || !form.date) {
      setFormError('Bitte Titel und Datum ausfüllen.')
      return
    }
    startTransition(async () => {
      try {
        await addEvent({
          title:       form.title.trim(),
          date:        form.date,
          type:        form.type,
          url:         form.url.trim(),
          description: form.description.trim(),
        })
        const fresh = await fetchAllEvents()
        setEvents(fresh)
        setForm(EMPTY_FORM)
        setShowForm(false)
      } catch (e) {
        setFormError(e instanceof Error ? e.message : 'Fehler beim Speichern.')
      }
    })
  }

  const inputCls = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Events & Termine</h1>
        <button
          onClick={() => setShowForm(v => !v)}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Termin hinzufügen
          {showForm ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white border border-blue-100 rounded-xl p-5 mb-6 space-y-4"
        >
          <h2 className="font-display font-semibold text-sm text-gray-900">Neuen Termin hinzufügen</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Titel <span className="text-red-500">*</span>
              </label>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className={inputCls}
                placeholder="BFH-Urteil: Behandlung digitaler Assets"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Datum <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Typ</label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {EVENT_TYPES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, type: t }))}
                    className={`text-[11px] font-medium px-2 py-1 rounded-md border transition-colors ${
                      form.type === t
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">URL (optional)</label>
              <input
                value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                className={inputCls}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Beschreibung (optional)</label>
              <input
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className={inputCls}
                placeholder="Kurze Beschreibung des Termins"
              />
            </div>
          </div>

          {formError && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
              {formError}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {isPending ? 'Wird gespeichert…' : 'Termin speichern'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setFormError('') }}
              className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 animate-pulse space-y-2">
              <div className="h-3 bg-gray-100 rounded w-24" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-10 text-center text-sm text-gray-400">
          Keine Termine vorhanden.
        </div>
      ) : (
        <div className="space-y-2">
          {events.map(ev => {
            const past = isPast(ev.date)
            return (
              <div
                key={ev.id}
                className={`bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-start gap-3 transition-colors ${
                  past ? 'opacity-50' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md border ${TYPE_STYLES[ev.type] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      {ev.type}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(ev.date)}</span>
                    {past && (
                      <span className="text-[10px] text-gray-300 font-medium">vergangen</span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900 leading-snug">{ev.title}</p>
                  {ev.description && (
                    <p className="text-xs text-gray-400 mt-0.5">{ev.description}</p>
                  )}
                  {ev.url && (
                    <a
                      href={ev.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:text-blue-700 mt-0.5 block truncate"
                    >
                      {ev.url}
                    </a>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(ev.id)}
                  disabled={isPending}
                  className="flex-shrink-0 p-1.5 text-gray-300 hover:text-red-500 disabled:opacity-40 transition-colors rounded-lg mt-0.5"
                  title="Löschen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
