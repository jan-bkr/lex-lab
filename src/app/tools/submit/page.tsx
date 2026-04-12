'use client'

import { useState } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Rechtsgebiet } from '@/types'

const RECHTSGEBIETE: Rechtsgebiet[] = ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Venture Capital']

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

interface FormState {
  name: string
  url: string
  tagline: string
  description: string
  rechtsgebiet: Rechtsgebiet[]
  email: string
}

interface FormErrors {
  name?: string
  url?: string
  tagline?: string
  description?: string
  rechtsgebiet?: string
}

export default function SubmitToolPage() {
  const [form, setForm] = useState<FormState>({
    name: '',
    url: '',
    tagline: '',
    description: '',
    rechtsgebiet: [],
    email: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function validate(): boolean {
    const e: FormErrors = {}
    if (!form.name.trim()) e.name = 'Bitte gib einen Tool-Namen ein.'
    if (!form.url.trim()) {
      e.url = 'Bitte gib eine Website-URL ein.'
    } else {
      try {
        new URL(form.url)
      } catch {
        e.url = 'Bitte gib eine gültige URL ein (z.B. https://tool.com).'
      }
    }
    if (!form.tagline.trim()) e.tagline = 'Bitte gib eine Kurzbeschreibung ein.'
    if (!form.description.trim()) e.description = 'Bitte beschreibe das Tool.'
    if (form.rechtsgebiet.length === 0)
      e.rechtsgebiet = 'Bitte wähle mindestens ein Rechtsgebiet aus.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setStatus('loading')
    const supabase = createClient()
    const { error } = await supabase.from('tools').insert({
      name: form.name.trim(),
      slug: slugify(form.name),
      url: form.url.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      rechtsgebiet: form.rechtsgebiet,
      submitted_by: form.email.trim() || null,
      status: 'pending',
    })

    if (error) {
      setErrorMsg('Es ist ein Fehler aufgetreten. Bitte versuche es erneut.')
      setStatus('error')
    } else {
      setStatus('success')
    }
  }

  function toggleRechtsgebiet(rg: Rechtsgebiet) {
    setForm(f => ({
      ...f,
      rechtsgebiet: f.rechtsgebiet.includes(rg)
        ? f.rechtsgebiet.filter(r => r !== rg)
        : [...f.rechtsgebiet, rg],
    }))
  }

  function reset() {
    setForm({ name: '', url: '', tagline: '', description: '', rechtsgebiet: [], email: '' })
    setErrors({})
    setStatus('idle')
    setErrorMsg('')
  }

  if (status === 'success') {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Danke!</h2>
        <p className="text-gray-500 mb-8 leading-relaxed text-sm">
          Wir prüfen dein Tool und schalten es bald frei.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          Weiteres Tool einreichen
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">Tool einreichen</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Schlage ein KI-Tool für die lex-lab.de Datenbank vor.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Tool Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Tool Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="z.B. Harvey AI"
            className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.name ? 'border-red-300' : 'border-gray-200'
            }`}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Website URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={form.url}
            onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
            placeholder="https://tool.com"
            className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.url ? 'border-red-300' : 'border-gray-200'
            }`}
          />
          {errors.url && <p className="text-xs text-red-500 mt-1">{errors.url}</p>}
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Kurzbeschreibung <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.tagline}
            onChange={e => setForm(f => ({ ...f, tagline: e.target.value.slice(0, 80) }))}
            placeholder="In einem Satz: Was macht dieses Tool?"
            className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.tagline ? 'border-red-300' : 'border-gray-200'
            }`}
          />
          <div className="flex justify-between mt-1">
            {errors.tagline ? (
              <p className="text-xs text-red-500">{errors.tagline}</p>
            ) : (
              <span />
            )}
            <p
              className={`text-xs ml-auto ${form.tagline.length >= 70 ? 'text-orange-500' : 'text-gray-400'}`}
            >
              {form.tagline.length}/80
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Beschreibung <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value.slice(0, 500) }))}
            placeholder="Was kann das Tool? Für welche Anwendungsfälle eignet es sich besonders?"
            rows={4}
            className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${
              errors.description ? 'border-red-300' : 'border-gray-200'
            }`}
          />
          <div className="flex justify-between mt-1">
            {errors.description ? (
              <p className="text-xs text-red-500">{errors.description}</p>
            ) : (
              <span />
            )}
            <p
              className={`text-xs ml-auto ${form.description.length >= 450 ? 'text-orange-500' : 'text-gray-400'}`}
            >
              {form.description.length}/500
            </p>
          </div>
        </div>

        {/* Rechtsgebiet */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rechtsgebiet <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {RECHTSGEBIETE.map(rg => (
              <label
                key={rg}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-all select-none ${
                  form.rechtsgebiet.includes(rg)
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.rechtsgebiet.includes(rg)}
                  onChange={() => toggleRechtsgebiet(rg)}
                  className="sr-only"
                />
                {rg}
              </label>
            ))}
          </div>
          {errors.rechtsgebiet && (
            <p className="text-xs text-red-500 mt-1.5">{errors.rechtsgebiet}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Deine E-Mail{' '}
            <span className="text-gray-400 font-normal">(optional, für Rückfragen)</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="deine@email.de"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Error state */}
        {status === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="ml-auto text-red-400 hover:text-red-600 underline text-xs"
            >
              Erneut versuchen
            </button>
          </div>
        )}

        {/* Submit */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm"
          >
            {status === 'loading' ? 'Wird eingereicht…' : 'Tool einreichen'}
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">
            Eingereichte Tools werden manuell geprüft bevor sie veröffentlicht werden.
          </p>
        </div>
      </form>
    </div>
  )
}
