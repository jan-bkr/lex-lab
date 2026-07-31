'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  updateTool,
  type AdminToolFull, type UpdateToolPayload,
} from '@/app/admin/actions'
import { computeLexlabScore } from '@/lib/lexlab-score'

// ─── Constants ────────────────────────────────────────────────────────────────

const RECHTSGEBIETE = ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Venture Capital']
const PRICING_TYPES = ['free', 'freemium', 'paid', 'enterprise']
const SCORE_LABELS: Record<string, string> = {
  score_praxisreife: 'Praxisreife',
  score_datenschutz: 'Datenschutz / DSGVO',
  score_dach:        'DACH-Relevanz',
  score_ux:          'Bedienbarkeit (UX)',
  score_preis:       'Preis-Leistung',
}
const SCORE_WEIGHTS: Record<string, number> = {
  score_praxisreife: 35,
  score_datenschutz: 20,
  score_dach:        25,
  score_ux:          10,
  score_preis:       10,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(score: number | null): string {
  if (!score) return 'text-gray-400'
  if (score >= 80) return 'text-emerald-600'
  if (score >= 60) return 'text-amber-600'
  return 'text-red-500'
}

function tagsToString(arr: string[] | null): string {
  return (arr ?? []).join('\n')
}

function stringToTags(s: string): string[] {
  return s.split('\n').map(t => t.trim()).filter(Boolean)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">
        {label}
        {hint && <span className="ml-1.5 font-normal text-gray-400">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white'
const textareaCls = `${inputCls} resize-none leading-relaxed`

function ScoreSlider({
  label, weight, value, onChange,
}: { label: string; weight: number; value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400">Gewicht {weight}%</span>
          <span className={`text-sm font-bold w-5 text-center ${value === 0 ? 'text-gray-300' : 'text-gray-900'}`}>
            {value === 0 ? '–' : value}
          </span>
        </div>
      </div>
      <input
        type="range"
        min={0} max={10} step={1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-blue-600 h-1.5 rounded-full cursor-pointer"
      />
      <div className="flex justify-between text-[9px] text-gray-300 px-0.5">
        <span>–</span><span>1</span><span>2</span><span>3</span><span>4</span>
        <span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
      </div>
    </div>
  )
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export function EditForm({ tool }: { tool: AdminToolFull }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // Basic fields
  const [name, setName] = useState(tool.name)
  const [tagline, setTagline] = useState(tool.tagline ?? '')
  const [url, setUrl] = useState(tool.url)
  const [description, setDescription] = useState(tool.description ?? '')
  const [rechtsgebiet, setRechtsgebiet] = useState<string[]>(tool.rechtsgebiet ?? [])
  const [category, setCategory] = useState(tagsToString(tool.category))
  const [pricingType, setPricingType] = useState(tool.pricing ?? '')
  const [pricingUrl, setPricingUrl] = useState(tool.pricing_url ?? '')
  const [isNew, setIsNew] = useState(tool.is_new)
  const [featured, setFeatured] = useState(tool.featured)

  // Premium content
  const [longDescription, setLongDescription] = useState(tool.long_description ?? '')
  const [bestFor, setBestFor] = useState(tagsToString(tool.best_for))
  const [notFor, setNotFor] = useState(tagsToString(tool.not_for))
  const [verdict, setVerdict] = useState(tool.verdict ?? '')
  const [lastReviewedAt, setLastReviewedAt] = useState(tool.last_reviewed_at ?? '')

  // Scores (0 = not set)
  const [scores, setScores] = useState({
    score_praxisreife: tool.score_praxisreife ?? 0,
    score_datenschutz: tool.score_datenschutz ?? 0,
    score_dach:        tool.score_dach        ?? 0,
    score_ux:          tool.score_ux          ?? 0,
    score_preis:       tool.score_preis       ?? 0,
  })

  function setScore(key: string, v: number) {
    setScores(prev => ({ ...prev, [key]: v }))
  }

  const lexlabScore = computeLexlabScore(
    scores.score_praxisreife || null,
    scores.score_datenschutz || null,
    scores.score_dach        || null,
    scores.score_ux          || null,
    scores.score_preis       || null,
  )

  function toggleRg(rg: string) {
    setRechtsgebiet(prev =>
      prev.includes(rg) ? prev.filter(r => r !== rg) : [...prev, rg]
    )
  }

  async function handleSave() {
    if (!name.trim() || !url.trim()) {
      setError('Name und URL sind Pflichtfelder.')
      return
    }
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const payload: UpdateToolPayload = {
        slug:              tool.slug,
        name:              name.trim(),
        tagline:           tagline.trim(),
        url:               url.trim(),
        description:       description.trim(),
        rechtsgebiet,
        category:          stringToTags(category),
        pricing:           pricingType,
        pricing_url:       pricingUrl.trim(),
        is_new:            isNew,
        featured,
        long_description:  longDescription.trim(),
        best_for:          stringToTags(bestFor),
        not_for:           stringToTags(notFor),
        verdict:           verdict.trim(),
        last_reviewed_at:  lastReviewedAt,
        score_praxisreife: scores.score_praxisreife || null,
        score_datenschutz: scores.score_datenschutz || null,
        score_dach:        scores.score_dach        || null,
        score_ux:          scores.score_ux          || null,
        score_preis:       scores.score_preis       || null,
        lexlab_score:      lexlabScore,
      }
      await updateTool(tool.id, payload)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 pb-16">

      {/* ── Basic Info ── */}
      <Section title="Grunddaten">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Name *">
            <input className={inputCls} value={name} onChange={e => setName(e.target.value)} />
          </Field>
          <Field label="URL *">
            <input className={inputCls} value={url} onChange={e => setUrl(e.target.value)} type="url" />
          </Field>
        </div>
        <Field label="Tagline" hint="1 Zeile, max. 100 Zeichen">
          <input className={inputCls} value={tagline} onChange={e => setTagline(e.target.value)} maxLength={100} />
        </Field>
        <Field label="Kurzbeschreibung" hint="wird in Karten + Listen verwendet">
          <textarea className={textareaCls} rows={3} value={description} onChange={e => setDescription(e.target.value)} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Rechtsgebiet">
            <div className="flex flex-wrap gap-1.5 mt-1">
              {RECHTSGEBIETE.map(rg => (
                <button
                  key={rg} type="button" onClick={() => toggleRg(rg)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    rechtsgebiet.includes(rg)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {rg}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Funktionskategorie" hint="eine pro Zeile, z.B. Due Diligence">
            <textarea className={textareaCls} rows={3} value={category} onChange={e => setCategory(e.target.value)} placeholder={'Due Diligence\nVertragsanalyse'} />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Pricing-Typ">
            <select className={inputCls} value={pricingType} onChange={e => setPricingType(e.target.value)}>
              <option value="">— wählen —</option>
              {PRICING_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Pricing-URL" hint="optional">
            <input className={inputCls} value={pricingUrl} onChange={e => setPricingUrl(e.target.value)} type="url" placeholder="https://…/pricing" />
          </Field>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
            <input type="checkbox" checked={isNew} onChange={e => setIsNew(e.target.checked)} className="accent-blue-600 w-4 h-4" />
            Als neu markieren
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
            <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="accent-blue-600 w-4 h-4" />
            Featured (Startseite)
          </label>
        </div>
      </Section>

      {/* ── Premium Content ── */}
      <Section title="Premium-Profil">
        <Field label="Ausführliche Beschreibung" hint="3–5 Sätze, für die Tool-Detailseite">
          <textarea className={textareaCls} rows={5} value={longDescription} onChange={e => setLongDescription(e.target.value)} placeholder="Beschreibe das Tool ausführlich für Juristen und Steuerberater…" />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Best for" hint="eine Zeile = ein Punkt">
            <textarea className={textareaCls} rows={5} value={bestFor} onChange={e => setBestFor(e.target.value)} placeholder={'M&A-Anwälte in Due-Diligence-Prozessen\nSteuerberater bei Vertragsprüfung'} />
          </Field>
          <Field label="Not for" hint="eine Zeile = ein Punkt">
            <textarea className={textareaCls} rows={5} value={notFor} onChange={e => setNotFor(e.target.value)} placeholder={'Kleinstkanzleien ohne IT-Budget\nDeutsches Steuerrecht (kein DE-Support)'} />
          </Field>
        </div>
        <Field label="LexLab-Urteil" hint="2–3 Sätze redaktionelle Einschätzung">
          <textarea className={textareaCls} rows={4} value={verdict} onChange={e => setVerdict(e.target.value)} placeholder="Das Tool überzeugt besonders durch… Schwäche ist…" />
        </Field>
        <Field label="Zuletzt bewertet am">
          <input className={inputCls} type="date" value={lastReviewedAt} onChange={e => setLastReviewedAt(e.target.value)} />
        </Field>
      </Section>

      {/* ── LexLab Score ── */}
      <Section title="LexLab Score">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500">
            Slider auf 0 lassen = nicht bewertet (wird aus Gesamtbewertung ausgeschlossen)
          </p>
          <div className="text-right">
            <div className={`text-3xl font-bold ${scoreColor(lexlabScore)}`}>
              {lexlabScore != null ? lexlabScore : '–'}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">LexLab Score / 100</div>
          </div>
        </div>
        <div className="space-y-5 pt-2">
          {Object.entries(SCORE_LABELS).map(([key, label]) => (
            <ScoreSlider
              key={key}
              label={label}
              weight={SCORE_WEIGHTS[key]}
              value={scores[key as keyof typeof scores]}
              onChange={v => setScore(key, v)}
            />
          ))}
        </div>
      </Section>

      {/* ── Save bar ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex items-center justify-between gap-4 z-10">
        <div className="text-sm text-gray-500">
          {error && <span className="text-red-600">{error}</span>}
          {saved && <span className="text-emerald-600">✓ Gespeichert</span>}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/tools')}
            className="text-sm text-gray-500 hover:text-gray-800 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            {saving ? 'Speichert…' : 'Speichern'}
          </button>
        </div>
      </div>

    </div>
  )
}
