'use client'

import { useState, useEffect, useTransition } from 'react'
import { Sparkles, Send, Trash2, ChevronDown, ChevronUp, Check } from 'lucide-react'
import {
  fetchNewsletterIssues,
  generateNewsletterIssue,
  updateIssueEditorsNote,
  sendNewsletterIssue,
  deleteNewsletterIssue,
  type AdminNewsletterIssue,
} from '../../actions'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatIssueDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
  ]
  return `${day}. ${months[month - 1]} ${year}`
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AdminNewsletterIssue['status'] }) {
  const map = {
    draft: { label: 'Entwurf',       cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    ready: { label: 'Versandbereit', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    sent:  { label: 'Versendet',     cls: 'bg-green-50 text-green-700 border-green-200' },
  }
  const { label, cls } = map[status]
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md border ${cls}`}>
      {label}
    </span>
  )
}

// ─── Single issue row ─────────────────────────────────────────────────────────

function IssueRow({
  issue,
  onUpdate,
}: {
  issue: AdminNewsletterIssue
  onUpdate: () => void
}) {
  const [expanded,     setExpanded]     = useState(false)
  const [noteMode,     setNoteMode]     = useState<'auto' | 'manual'>(issue.editors_note_mode)
  const [manualNote,   setManualNote]   = useState(issue.editors_note_manual ?? '')
  const [noteSaved,    setNoteSaved]    = useState(false)
  const [isPending,    startTransition] = useTransition()
  const [actionError,  setActionError]  = useState('')

  const activeNote = noteMode === 'manual' && manualNote.trim()
    ? manualNote
    : issue.editors_note_auto

  function handleSaveNote() {
    setActionError('')
    startTransition(async () => {
      try {
        await updateIssueEditorsNote(issue.id, manualNote, noteMode)
        setNoteSaved(true)
        setTimeout(() => setNoteSaved(false), 2000)
        onUpdate()
      } catch (e) {
        setActionError(e instanceof Error ? e.message : 'Fehler beim Speichern')
      }
    })
  }

  function handleSend() {
    if (!window.confirm(`Ausgabe "${issue.title}" an alle bestätigten Abonnenten versenden?`)) return
    setActionError('')
    startTransition(async () => {
      try {
        const { sent } = await sendNewsletterIssue(issue.id)
        alert(`Erfolgreich versendet an ${sent} Abonnenten.`)
        onUpdate()
      } catch (e) {
        setActionError(e instanceof Error ? e.message : 'Versand fehlgeschlagen')
      }
    })
  }

  function handleDelete() {
    if (!window.confirm('Entwurf löschen?')) return
    setActionError('')
    startTransition(async () => {
      try {
        await deleteNewsletterIssue(issue.id)
        onUpdate()
      } catch (e) {
        setActionError(e instanceof Error ? e.message : 'Fehler beim Löschen')
      }
    })
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      {/* ─── Row header ─── */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 text-sm truncate">{issue.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {formatIssueDate(issue.issue_date)} · Erstellt {formatDate(issue.created_at)}
            {issue.status === 'sent' && issue.recipient_count != null && (
              <span className="ml-2">· {issue.recipient_count} Empfänger</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={issue.status} />
          {issue.status !== 'sent' && (
            <>
              <button
                onClick={handleSend}
                disabled={isPending}
                title="Ausgabe versenden"
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#111827] text-white text-xs font-medium rounded-lg hover:bg-gray-800 disabled:opacity-40 transition-colors"
              >
                <Send className="w-3 h-3" />
                Versenden
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                title="Entwurf löschen"
                className="p-1.5 text-gray-300 hover:text-red-500 disabled:opacity-40 transition-colors rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={() => setExpanded(v => !v)}
            className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded-lg"
            title={expanded ? 'Einklappen' : 'Details anzeigen'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ─── Expanded detail ─── */}
      {expanded && (
        <div className="border-t border-gray-50 px-4 py-4 space-y-4">
          {actionError && (
            <div className="px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
              {actionError}
            </div>
          )}

          {/* Editor's Note */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Einschätzung (Editor&apos;s Note)
              </p>
              {issue.status !== 'sent' && (
                <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={noteMode === 'manual'}
                    onChange={e => setNoteMode(e.target.checked ? 'manual' : 'auto')}
                    className="w-3 h-3 accent-gray-800"
                  />
                  Manuell überschreiben
                </label>
              )}
            </div>

            {noteMode === 'manual' && issue.status !== 'sent' ? (
              <div className="space-y-2">
                <textarea
                  value={manualNote}
                  onChange={e => setManualNote(e.target.value)}
                  rows={4}
                  placeholder="Manuelle Editor's Note eingeben…"
                  className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveNote}
                    disabled={isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111827] text-white text-xs font-medium rounded-lg hover:bg-gray-800 disabled:opacity-40 transition-colors"
                  >
                    {noteSaved ? <Check className="w-3 h-3" /> : null}
                    {noteSaved ? 'Gespeichert' : 'Speichern'}
                  </button>
                  <button
                    onClick={() => { setNoteMode('auto'); setManualNote('') }}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Auf Auto zurücksetzen
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600 leading-relaxed italic">{activeNote || '—'}</p>
            )}
          </div>

          {/* Preheader */}
          {issue.preheader && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Preheader</p>
              <p className="text-xs text-gray-500">{issue.preheader}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function IssuesClient() {
  const [issues,       setIssues]       = useState<AdminNewsletterIssue[]>([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [generating,   setGenerating]   = useState(false)
  const [genError,     setGenError]     = useState('')

  async function loadIssues() {
    try {
      const data = await fetchNewsletterIssues()
      setIssues(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Laden')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadIssues() }, [])

  async function handleGenerate() {
    setGenError('')
    setGenerating(true)
    try {
      await generateNewsletterIssue()
      await loadIssues()
    } catch (e) {
      setGenError(e instanceof Error ? e.message : 'Generierung fehlgeschlagen')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="font-display text-lg font-bold text-gray-900">Ausgaben</h2>
          <p className="text-xs text-gray-400 mt-0.5">Weekly Brief generieren, prüfen und versenden</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-3 py-2 bg-[#111827] text-white text-sm font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          {generating ? 'Wird generiert…' : 'Neue Ausgabe generieren'}
        </button>
      </div>

      {genError && (
        <div className="mb-3 px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
          {genError}
        </div>
      )}

      {generating && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
            Claude generiert die Ausgabe — das dauert ca. 10–20 Sekunden…
          </div>
        </div>
      )}

      {error && (
        <div className="mb-3 px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
          {error}
        </div>
      )}

      {!generating && (
        loading ? (
          <div className="space-y-2">
            {[1, 2].map(i => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-72 mb-1.5" />
                <div className="h-3 bg-gray-50 rounded w-48" />
              </div>
            ))}
          </div>
        ) : issues.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-sm text-gray-400">
            Noch keine Ausgaben. Erste Ausgabe generieren →
          </div>
        ) : (
          <div className="space-y-2">
            {issues.map(issue => (
              <IssueRow key={issue.id} issue={issue} onUpdate={loadIssues} />
            ))}
          </div>
        )
      )}
    </div>
  )
}
