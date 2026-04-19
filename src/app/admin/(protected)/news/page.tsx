'use client'

import { useState, useEffect, useTransition } from 'react'
import { Trash2, Plus, ChevronDown, ChevronUp, Cpu } from 'lucide-react'
import {
  fetchAllNews,
  deleteNewsArticle,
  addNewsArticle,
  type AdminNewsArticle,
} from '../../actions'

const SOURCE_STYLES: Record<string, string> = {
  BFH: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  BGH: 'bg-blue-50 text-blue-700 border-blue-200',
  BMF: 'bg-purple-50 text-purple-700 border-purple-200',
  JUVE: 'bg-orange-50 text-orange-700 border-orange-200',
  LTO: 'bg-gray-100 text-gray-600 border-gray-200',
}

const CATEGORIES = ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Legal Tech', 'Regulierung']

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function sourceStyle(source: string) {
  return SOURCE_STYLES[source] ?? 'bg-gray-100 text-gray-600 border-gray-200'
}

interface AddForm {
  title: string
  summary: string
  source_name: string
  source_url: string
  category: string
  published_at: string
}

const EMPTY_FORM: AddForm = {
  title: '',
  summary: '',
  source_name: '',
  source_url: '',
  category: 'Legal Tech',
  published_at: new Date().toISOString().slice(0, 16),
}

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<AdminNewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<AddForm>(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    fetchAllNews()
      .then(setArticles)
      .catch(e => setError(e instanceof Error ? e.message : 'Fehler'))
      .finally(() => setLoading(false))
  }, [])

  function handleDelete(id: string) {
    const article = articles.find(a => a.id === id)
    if (!article) return
    setArticles(prev => prev.filter(a => a.id !== id)) // optimistic
    startTransition(async () => {
      try {
        await deleteNewsArticle(id)
      } catch {
        setArticles(prev => [article, ...prev]) // revert
        setError('Fehler beim Löschen.')
      }
    })
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!form.title.trim() || !form.summary.trim() || !form.source_name.trim()) {
      setFormError('Bitte alle Pflichtfelder ausfüllen.')
      return
    }
    startTransition(async () => {
      try {
        await addNewsArticle({
          ...form,
          published_at: new Date(form.published_at).toISOString(),
        })
        const fresh = await fetchAllNews()
        setArticles(fresh)
        setForm(EMPTY_FORM)
        setShowForm(false)
      } catch (e) {
        setFormError(e instanceof Error ? e.message : 'Fehler beim Speichern.')
      }
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">News verwalten</h1>
        <button
          onClick={() => setShowForm(v => !v)}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Artikel hinzufügen
          {showForm ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white border border-blue-100 rounded-xl p-5 mb-6 space-y-4"
        >
          <h2 className="font-display font-semibold text-sm text-gray-900">Neuen Artikel hinzufügen</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Titel <span className="text-red-500">*</span>
              </label>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="BFH: Neue Grundsätze zu..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Zusammenfassung <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.summary}
                onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Quelle <span className="text-red-500">*</span>
              </label>
              <input
                value={form.source_name}
                onChange={e => setForm(f => ({ ...f, source_name: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="BFH, BGH, LTO, JUVE..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Quell-URL</label>
              <input
                value={form.source_url}
                onChange={e => setForm(f => ({ ...f, source_url: e.target.value }))}
                type="url"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Kategorie</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Datum &amp; Uhrzeit</label>
              <input
                type="datetime-local"
                value={form.published_at}
                onChange={e => setForm(f => ({ ...f, published_at: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              {isPending ? 'Wird gespeichert…' : 'Artikel speichern'}
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

      {/* Article list */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 animate-pulse space-y-2">
              <div className="h-3 bg-gray-100 rounded w-16" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-10 text-center text-sm text-gray-400">
          Keine Artikel vorhanden.
        </div>
      ) : (
        <div className="space-y-2">
          {articles.map(article => (
            <div
              key={article.id}
              className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-start gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {article.source_name && (
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md border ${sourceStyle(article.source_name)}`}
                    >
                      {article.source_name}
                    </span>
                  )}
                  {article.ai_generated && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                      <Cpu className="w-2.5 h-2.5" />
                      KI
                    </span>
                  )}
                  <span className="text-xs text-gray-400 ml-auto">{formatDate(article.published_at)}</span>
                </div>
                <p className="text-sm font-medium text-gray-900 leading-snug">{article.title}</p>
              </div>
              <button
                onClick={() => handleDelete(article.id)}
                disabled={isPending}
                className="flex-shrink-0 text-gray-300 hover:text-red-500 disabled:opacity-40 transition-colors mt-0.5"
                title="Löschen"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
