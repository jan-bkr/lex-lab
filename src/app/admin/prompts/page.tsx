'use client'

import { useState, useEffect, useTransition } from 'react'
import { Trash2, Plus, ChevronDown, ChevronUp, Star, StarOff } from 'lucide-react'
import {
  fetchAllPrompts,
  deletePrompt,
  addPrompt,
  setPromptOfDay,
  clearPromptOfDay,
  type AdminPrompt,
} from '../actions'

const RECHTSGEBIETE = [
  'Steuerrecht',
  'M&A',
  'Gesellschaftsrecht',
  'Arbeitsrecht',
  'Vertragsrecht',
  'Legal Tech',
  'Regulierung',
]

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
  prompt_text: string
  use_case: string
  rechtsgebiet: string[]
  example_output: string
}

const EMPTY_FORM: AddForm = {
  title: '',
  slug: '',
  prompt_text: '',
  use_case: '',
  rechtsgebiet: [],
  example_output: '',
}

function RechtsgebietPill({ tag }: { tag: string }) {
  return (
    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200">
      {tag}
    </span>
  )
}

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState<AdminPrompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<AddForm>(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    fetchAllPrompts()
      .then(setPrompts)
      .catch(e => setError(e instanceof Error ? e.message : 'Fehler'))
      .finally(() => setLoading(false))
  }, [])

  function handleDelete(id: string) {
    const prompt = prompts.find(p => p.id === id)
    if (!prompt) return
    setPrompts(prev => prev.filter(p => p.id !== id)) // optimistic
    startTransition(async () => {
      try {
        await deletePrompt(id)
      } catch {
        setPrompts(prev => [prompt, ...prev]) // revert
        setError('Fehler beim Löschen.')
      }
    })
  }

  function handleTogglePromptOfDay(prompt: AdminPrompt) {
    if (prompt.is_prompt_of_day) {
      // Clear it
      setPrompts(prev =>
        prev.map(p => (p.id === prompt.id ? { ...p, is_prompt_of_day: false } : p))
      )
      startTransition(async () => {
        try {
          await clearPromptOfDay(prompt.id)
        } catch {
          setPrompts(prev =>
            prev.map(p => (p.id === prompt.id ? { ...p, is_prompt_of_day: true } : p))
          )
          setError('Fehler beim Aktualisieren.')
        }
      })
    } else {
      // Set this one, clear all others
      setPrompts(prev =>
        prev.map(p => ({ ...p, is_prompt_of_day: p.id === prompt.id }))
      )
      startTransition(async () => {
        try {
          await setPromptOfDay(prompt.id)
        } catch {
          setPrompts(prev =>
            prev.map(p => ({
              ...p,
              is_prompt_of_day: p.id === prompt.id ? false : p.is_prompt_of_day,
            }))
          )
          setError('Fehler beim Aktualisieren.')
        }
      })
    }
  }

  function handleTitleChange(title: string) {
    setForm(f => ({ ...f, title, slug: slugify(title) }))
  }

  function handleRechtsgebietToggle(tag: string) {
    setForm(f => ({
      ...f,
      rechtsgebiet: f.rechtsgebiet.includes(tag)
        ? f.rechtsgebiet.filter(r => r !== tag)
        : [...f.rechtsgebiet, tag],
    }))
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!form.title.trim() || !form.prompt_text.trim()) {
      setFormError('Bitte Titel und Prompt-Text ausfüllen.')
      return
    }
    if (!form.slug.trim()) {
      setFormError('Slug darf nicht leer sein.')
      return
    }
    startTransition(async () => {
      try {
        await addPrompt({
          title: form.title.trim(),
          slug: form.slug.trim(),
          prompt_text: form.prompt_text.trim(),
          use_case: form.use_case.trim(),
          rechtsgebiet: form.rechtsgebiet,
          example_output: form.example_output.trim(),
        })
        const fresh = await fetchAllPrompts()
        setPrompts(fresh)
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
        <h1 className="font-display text-2xl font-bold text-gray-900">Prompts verwalten</h1>
        <button
          onClick={() => setShowForm(v => !v)}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Prompt hinzufügen
          {showForm ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white border border-blue-100 rounded-xl p-5 mb-6 space-y-4"
        >
          <h2 className="font-display font-semibold text-sm text-gray-900">Neuen Prompt hinzufügen</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Titel <span className="text-red-500">*</span>
              </label>
              <input
                value={form.title}
                onChange={e => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Vertragsprüfung NDA"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Slug</label>
              <input
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="vertragspruefung-nda"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Anwendungsfall</label>
              <input
                value={form.use_case}
                onChange={e => setForm(f => ({ ...f, use_case: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Vertragsrecht, M&A-Due-Diligence"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Rechtsgebiet</label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {RECHTSGEBIETE.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleRechtsgebietToggle(tag)}
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
                Prompt-Text <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.prompt_text}
                onChange={e => setForm(f => ({ ...f, prompt_text: e.target.value }))}
                rows={5}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
                placeholder="Du bist ein erfahrener Rechtsanwalt. Analysiere den folgenden Vertrag..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Beispiel-Output</label>
              <textarea
                value={form.example_output}
                onChange={e => setForm(f => ({ ...f, example_output: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Beispiel einer KI-Antwort auf diesen Prompt..."
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
              {isPending ? 'Wird gespeichert…' : 'Prompt speichern'}
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

      {/* Prompt list */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 animate-pulse space-y-2">
              <div className="h-3 bg-gray-100 rounded w-16" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : prompts.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-10 text-center text-sm text-gray-400">
          Keine Prompts vorhanden.
        </div>
      ) : (
        <div className="space-y-2">
          {prompts.map(prompt => (
            <div
              key={prompt.id}
              className={`bg-white border rounded-xl px-4 py-3 flex items-start gap-3 transition-colors ${
                prompt.is_prompt_of_day ? 'border-amber-200 bg-amber-50/30' : 'border-gray-100'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {prompt.is_prompt_of_day && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                      Prompt des Tages
                    </span>
                  )}
                  {prompt.use_case && (
                    <span className="text-[10px] text-gray-400 font-medium">{prompt.use_case}</span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900 leading-snug mb-1.5">{prompt.title}</p>
                <div className="flex flex-wrap gap-1">
                  {prompt.rechtsgebiet.map(tag => (
                    <RechtsgebietPill key={tag} tag={tag} />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                <button
                  onClick={() => handleTogglePromptOfDay(prompt)}
                  disabled={isPending}
                  className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                    prompt.is_prompt_of_day
                      ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50'
                      : 'text-gray-300 hover:text-amber-400 hover:bg-amber-50'
                  }`}
                  title={prompt.is_prompt_of_day ? 'Als Prompt des Tages entfernen' : 'Als Prompt des Tages setzen'}
                >
                  {prompt.is_prompt_of_day ? (
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ) : (
                    <StarOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(prompt.id)}
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
