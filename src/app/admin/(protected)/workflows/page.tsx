'use client'

import { useState, useEffect, useTransition } from 'react'
import { Trash2, Plus, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react'
import {
  fetchAllWorkflows,
  addWorkflow,
  toggleWorkflowPublished,
  deleteWorkflow,
  type AdminWorkflow,
} from '../../actions'

const RECHTSGEBIETE = ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Venture Capital']

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

interface AddForm {
  title: string
  slug: string
  rechtsgebiet: string[]
  reading_time: string
  excerpt: string
}

const EMPTY_FORM: AddForm = {
  title: '',
  slug: '',
  rechtsgebiet: [],
  reading_time: '5',
  excerpt: '',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function AdminWorkflowsPage() {
  const [workflows, setWorkflows]   = useState<AdminWorkflow[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [showForm, setShowForm]     = useState(false)
  const [form, setForm]             = useState<AddForm>(EMPTY_FORM)
  const [formError, setFormError]   = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    fetchAllWorkflows()
      .then(setWorkflows)
      .catch(e => setError(e instanceof Error ? e.message : 'Fehler'))
      .finally(() => setLoading(false))
  }, [])

  function handleTitleChange(title: string) {
    setForm(f => ({ ...f, title, slug: slugify(title) }))
  }

  function handleRgToggle(tag: string) {
    setForm(f => ({
      ...f,
      rechtsgebiet: f.rechtsgebiet.includes(tag)
        ? f.rechtsgebiet.filter(r => r !== tag)
        : [...f.rechtsgebiet, tag],
    }))
  }

  function handleTogglePublished(wf: AdminWorkflow) {
    const next = !wf.published
    setWorkflows(prev => prev.map(w => w.id === wf.id ? { ...w, published: next } : w))
    startTransition(async () => {
      try {
        await toggleWorkflowPublished(wf.id, next)
      } catch {
        setWorkflows(prev => prev.map(w => w.id === wf.id ? { ...w, published: wf.published } : w))
        setError('Fehler beim Aktualisieren.')
      }
    })
  }

  function handleDelete(id: string) {
    const wf = workflows.find(w => w.id === id)
    if (!wf) return
    setWorkflows(prev => prev.filter(w => w.id !== id))
    startTransition(async () => {
      try {
        await deleteWorkflow(id)
      } catch {
        setWorkflows(prev => [wf, ...prev])
        setError('Fehler beim Löschen.')
      }
    })
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!form.title.trim() || !form.excerpt.trim()) {
      setFormError('Bitte Titel und Beschreibung ausfüllen.')
      return
    }
    if (!form.slug.trim()) {
      setFormError('Slug darf nicht leer sein.')
      return
    }
    const rt = parseInt(form.reading_time, 10)
    if (isNaN(rt) || rt < 1) {
      setFormError('Lesezeit muss eine Zahl größer 0 sein.')
      return
    }
    startTransition(async () => {
      try {
        await addWorkflow({
          title: form.title.trim(),
          slug: form.slug.trim(),
          rechtsgebiet: form.rechtsgebiet,
          reading_time: rt,
          excerpt: form.excerpt.trim(),
        })
        const fresh = await fetchAllWorkflows()
        setWorkflows(fresh)
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
        <h1 className="font-display text-2xl font-bold text-gray-900">Workflows verwalten</h1>
        <button
          onClick={() => setShowForm(v => !v)}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Workflow hinzufügen
          {showForm ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white border border-blue-100 rounded-xl p-5 mb-6 space-y-4"
        >
          <h2 className="font-display font-semibold text-sm text-gray-900">Neuen Workflow hinzufügen</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Titel <span className="text-red-500">*</span>
              </label>
              <input
                value={form.title}
                onChange={e => handleTitleChange(e.target.value)}
                className={inputCls}
                placeholder="Due Diligence mit Claude"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Slug</label>
              <input
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                className={`${inputCls} font-mono`}
                placeholder="due-diligence-mit-claude"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Lesezeit (Minuten)</label>
              <input
                type="number"
                min="1"
                value={form.reading_time}
                onChange={e => setForm(f => ({ ...f, reading_time: e.target.value }))}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Rechtsgebiet</label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {RECHTSGEBIETE.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleRgToggle(tag)}
                    className={`text-[11px] font-medium px-2 py-1 rounded-md border transition-colors ${
                      form.rechtsgebiet.includes(tag)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Kurzbeschreibung <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.excerpt}
                onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                rows={3}
                className={`${inputCls} resize-none`}
                placeholder="Schritt-für-Schritt-Anleitung für KI-gestützte Due Diligence…"
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
              {isPending ? 'Wird gespeichert…' : 'Workflow speichern'}
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
              <div className="h-3 bg-gray-100 rounded w-16" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : workflows.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-10 text-center text-sm text-gray-400">
          Keine Workflows vorhanden.
        </div>
      ) : (
        <div className="space-y-2">
          {workflows.map(wf => (
            <div
              key={wf.id}
              className={`bg-white border rounded-xl px-4 py-3 flex items-start gap-3 transition-colors ${
                wf.published ? 'border-green-100' : 'border-gray-100'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md border ${
                    wf.published
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    {wf.published ? 'Veröffentlicht' : 'Entwurf'}
                  </span>
                  {wf.reading_time && (
                    <span className="text-[10px] text-gray-400">{wf.reading_time} Min.</span>
                  )}
                  <span className="text-[10px] text-gray-300">{formatDate(wf.created_at)}</span>
                </div>
                <p className="text-sm font-medium text-gray-900 leading-snug mb-1">{wf.title}</p>
                <p className="text-xs text-gray-400 font-mono">{wf.slug}</p>
                {wf.rechtsgebiet && wf.rechtsgebiet.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {wf.rechtsgebiet.map(tag => (
                      <span key={tag} className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                <button
                  onClick={() => handleTogglePublished(wf)}
                  disabled={isPending}
                  className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                    wf.published
                      ? 'text-green-500 hover:text-gray-400 hover:bg-gray-50'
                      : 'text-gray-300 hover:text-green-500 hover:bg-green-50'
                  }`}
                  title={wf.published ? 'Verbergen' : 'Veröffentlichen'}
                >
                  {wf.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDelete(wf.id)}
                  disabled={isPending}
                  className="p-1.5 text-gray-300 hover:text-red-500 disabled:opacity-40 transition-colors rounded-lg"
                  title="Löschen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
