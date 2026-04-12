'use client'

import { useState } from 'react'
import { Briefcase, Building2, TrendingUp, ArrowLeft, Loader2, Copy, Check, Zap } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3

interface FormState {
  rechtsgebiet: string[]
  aufgabe: string
  sachverhalt: string
  detailtiefe: string
  sprache: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const RECHTSGEBIETE = [
  {
    id: 'Steuerrecht',
    label: 'Steuerrecht',
    icon: <span className="text-2xl font-black text-emerald-600">§</span>,
    color: 'emerald',
    border: 'border-emerald-300',
    bg: 'bg-emerald-50',
    ring: 'ring-emerald-200',
    text: 'text-emerald-700',
  },
  {
    id: 'M&A',
    label: 'M&A',
    icon: <Briefcase className="w-6 h-6 text-purple-600" />,
    color: 'purple',
    border: 'border-purple-300',
    bg: 'bg-purple-50',
    ring: 'ring-purple-200',
    text: 'text-purple-700',
  },
  {
    id: 'Gesellschaftsrecht',
    label: 'Gesellschaftsrecht',
    icon: <Building2 className="w-6 h-6 text-blue-600" />,
    color: 'blue',
    border: 'border-blue-300',
    bg: 'bg-blue-50',
    ring: 'ring-blue-200',
    text: 'text-blue-700',
  },
  {
    id: 'Venture Capital',
    label: 'Venture Capital',
    icon: <TrendingUp className="w-6 h-6 text-orange-600" />,
    color: 'orange',
    border: 'border-orange-300',
    bg: 'bg-orange-50',
    ring: 'ring-orange-200',
    text: 'text-orange-700',
  },
]

const AUFGABEN = [
  'Gutachten / Memo',
  'Vertragsanalyse',
  'Due Diligence',
  'Mandantenberatung',
  'Schriftsatz / Brief',
  'Recherche',
]

const DETAILTIEFE_OPTIONS = [
  'Kurze Übersicht (für Mandanten)',
  'Strukturierte Analyse (Kanzlei-intern)',
  'Vollständiges Gutachten (Partnerniveau)',
]

const SPRACHE_OPTIONS = ['Deutsch (Standard)', 'Englisch']

const MAX_CHARS = 800

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: Step }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {([1, 2, 3] as Step[]).map(s => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
              s === step
                ? 'bg-blue-600 text-white'
                : s < step
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {s < step ? <Check className="w-3.5 h-3.5" /> : s}
          </div>
          {s < 3 && (
            <div className={`w-8 h-px ${s < step ? 'bg-blue-200' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
      <span className="ml-1 text-xs text-gray-400">
        {step === 1 ? 'Aufgabe' : step === 2 ? 'Details' : 'Ergebnis'}
      </span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuilderPage() {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormState>({
    rechtsgebiet: [],
    aufgabe: '',
    sachverhalt: '',
    detailtiefe: DETAILTIEFE_OPTIONS[1],
    sprache: SPRACHE_OPTIONS[0],
  })
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // ── Handlers ──

  function toggleRechtsgebiet(id: string) {
    setForm(f => ({
      ...f,
      rechtsgebiet: f.rechtsgebiet.includes(id)
        ? f.rechtsgebiet.filter(r => r !== id)
        : [...f.rechtsgebiet, id],
    }))
  }

  async function handleGenerate() {
    setLoading(true)
    setError('')
    setStep(3)
    try {
      const res = await fetch('/api/prompts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Unbekannter Fehler')
      setGeneratedPrompt(data.prompt)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler bei der Generierung.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(generatedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleReset() {
    setStep(1)
    setForm({ rechtsgebiet: [], aufgabe: '', sachverhalt: '', detailtiefe: DETAILTIEFE_OPTIONS[1], sprache: SPRACHE_OPTIONS[0] })
    setGeneratedPrompt('')
    setError('')
  }

  // ── Render ──

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-2">
        <h1 className="font-display text-4xl text-gray-900">Prompt Builder</h1>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">
          Beschreibe deine Aufgabe — LexLab generiert den optimalen Prompt.
        </p>
      </div>

      <div className="mt-8">
        <StepIndicator step={step} />

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="space-y-8">
            {/* Rechtsgebiet */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">Rechtsgebiet wählen</p>
              <div className="grid grid-cols-2 gap-3">
                {RECHTSGEBIETE.map(rg => {
                  const selected = form.rechtsgebiet.includes(rg.id)
                  return (
                    <button
                      key={rg.id}
                      onClick={() => toggleRechtsgebiet(rg.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 ${
                        selected
                          ? `${rg.border} ${rg.bg} ring-2 ${rg.ring}`
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                        {rg.icon}
                      </div>
                      <span className={`font-medium text-sm ${selected ? rg.text : 'text-gray-700'}`}>
                        {rg.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Aufgabentyp */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">Art der Aufgabe</p>
              <div className="flex flex-wrap gap-2">
                {AUFGABEN.map(a => {
                  const selected = form.aufgabe === a
                  return (
                    <button
                      key={a}
                      onClick={() => setForm(f => ({ ...f, aufgabe: a }))}
                      className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-all duration-150 ${
                        selected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {a}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Next button */}
            <button
              onClick={() => setStep(2)}
              disabled={form.rechtsgebiet.length === 0 || !form.aufgabe}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Weiter →
            </button>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="space-y-6">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Zurück
            </button>

            {/* Sachverhalt */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Beschreibe deinen Sachverhalt oder deine konkrete Aufgabe
              </label>
              <div className="relative">
                <textarea
                  value={form.sachverhalt}
                  onChange={e => {
                    if (e.target.value.length <= MAX_CHARS) {
                      setForm(f => ({ ...f, sachverhalt: e.target.value }))
                    }
                  }}
                  placeholder="z.B. GmbH-Anteilsübertragung, Käufer zahlt 2 Mio. €, Verkäufer hält seit 8 Jahren 30% der Anteile. Ich brauche eine steuerliche Analyse für den Mandanten."
                  className="w-full min-h-[160px] text-sm text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none leading-relaxed"
                />
                <span className={`absolute bottom-3 right-3 text-xs ${form.sachverhalt.length > MAX_CHARS * 0.9 ? 'text-amber-500' : 'text-gray-300'}`}>
                  {form.sachverhalt.length}/{MAX_CHARS}
                </span>
              </div>
            </div>

            {/* Detailtiefe */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Detailtiefe</label>
              <select
                value={form.detailtiefe}
                onChange={e => setForm(f => ({ ...f, detailtiefe: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white text-gray-800"
              >
                {DETAILTIEFE_OPTIONS.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            {/* Sprache */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Ausgabesprache</label>
              <select
                value={form.sprache}
                onChange={e => setForm(f => ({ ...f, sprache: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white text-gray-800"
              >
                {SPRACHE_OPTIONS.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            {/* Generate button */}
            <div>
              <button
                onClick={handleGenerate}
                disabled={!form.sachverhalt.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-3.5 rounded-xl transition-all text-sm shadow-sm"
              >
                Prompt generieren →
              </button>
              <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                <Zap className="w-3 h-3" /> Generierung dauert ca. 5–10 Sekunden
              </p>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div className="space-y-6">
            {loading ? (
              /* Loading skeleton */
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span>LexLab generiert deinen Prompt...</span>
                </div>
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-5/6" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-4/5" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                </div>
                <div className="flex gap-1 justify-center pt-2">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            ) : error ? (
              /* Error state */
              <div className="bg-red-50 border border-red-100 rounded-xl p-5 text-sm text-red-700">
                <p className="font-semibold mb-1">Fehler bei der Generierung</p>
                <p>{error}</p>
                <button
                  onClick={() => { setStep(2); setError('') }}
                  className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
                >
                  ← Zurück zu Details
                </button>
              </div>
            ) : (
              /* Result state */
              <div className="space-y-5">
                {/* Success badge */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                    <Check className="w-3 h-3" /> Prompt generiert
                  </span>
                </div>

                {/* Info row */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  {form.rechtsgebiet.map(rg => (
                    <span key={rg} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {rg}
                    </span>
                  ))}
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-500">{form.aufgabe}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-500">{form.detailtiefe.split(' ')[0]}</span>
                </div>

                {/* Prompt code block */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 max-h-96 overflow-y-auto">
                  <pre className="text-xs text-gray-800 font-mono whitespace-pre-wrap leading-relaxed">
                    {generatedPrompt}
                  </pre>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
                  >
                    {copied ? (
                      <><Check className="w-4 h-4" /> Kopiert!</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Prompt kopieren</>
                    )}
                  </button>
                  <a
                    href={`https://claude.ai/new?q=${encodeURIComponent(generatedPrompt)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
                  >
                    In Claude öffnen →
                  </a>
                </div>

                {/* Divider + reset */}
                <div className="border-t border-gray-100 pt-4 text-center">
                  <button
                    onClick={handleReset}
                    className="text-sm text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    Nicht zufrieden? Neu generieren
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
