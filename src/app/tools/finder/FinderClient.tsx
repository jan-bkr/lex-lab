'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

// ─── Domain types ────

type VisitorType = 'anwalt' | 'steuerberater' | 'interdisziplinaer' | 'inhouse'
type UseCase = 'recherche' | 'vertragsanalyse' | 'due-diligence' | 'drafting' | 'prompting'
type PrivacyLevel = 'sehr' | 'eher' | 'weniger'
type TeamSize = 'solo' | 'klein' | 'mittel' | 'gross'

interface Answers {
  visitor?: VisitorType
  useCase?: UseCase
  privacy?: PrivacyLevel
  teamSize?: TeamSize
}

interface ToolRow {
  id: string
  name: string
  slug: string
  tagline: string | null
  rechtsgebiet: string[] | null
  category: string[] | null
  verdict: string | null
  pricing: string | null
  score_datenschutz: number | null
  lexlab_score: number | null
  best_for: string[] | null
}

interface ToolResult extends ToolRow {
  matchScore: number
}

// ─── Step definitions ────

interface StepOption {
  value: string
  label: string
  desc: string
}

interface Step {
  key: keyof Answers
  question: string
  subtitle: string
  options: StepOption[]
}

const STEPS: Step[] = [
  {
    key: 'visitor',
    question: 'Wer bist du?',
    subtitle: 'So zeigen wir dir die relevantesten Empfehlungen.',
    options: [
      { value: 'anwalt',           label: 'Rechtsanwalt',              desc: 'Kanzlei oder Einzelanwalt' },
      { value: 'steuerberater',    label: 'Steuerberater',             desc: 'Steuerkanzlei oder -abteilung' },
      { value: 'interdisziplinaer',label: 'Interdisziplinäre Kanzlei', desc: 'Rechts- und Steuerberatung' },
      { value: 'inhouse',          label: 'Inhouse',                   desc: 'Unternehmensjurist oder -steuerberater' },
    ],
  },
  {
    key: 'useCase',
    question: 'Wofür brauchst du das Tool?',
    subtitle: 'Wähle deinen wichtigsten Anwendungsfall.',
    options: [
      { value: 'recherche',        label: 'Recherche',         desc: 'Gesetze, Urteile, Literatur finden' },
      { value: 'vertragsanalyse',  label: 'Vertragsanalyse',   desc: 'Verträge prüfen und kommentieren' },
      { value: 'due-diligence',    label: 'Due Diligence',     desc: 'Dokumente strukturiert auswerten' },
      { value: 'drafting',         label: 'Drafting',          desc: 'Dokumente erstellen oder umformulieren' },
      { value: 'prompting',        label: 'KI-Assistent',      desc: 'Mit KI arbeiten, Prompts optimieren' },
    ],
  },
  {
    key: 'privacy',
    question: 'Wie wichtig ist Datenschutz?',
    subtitle: 'Zum Beispiel bei der Verarbeitung sensibler Mandantendaten.',
    options: [
      { value: 'sehr',    label: 'Sehr wichtig',    desc: 'Keine US-Cloud, DSGVO-Konformität ist Pflicht' },
      { value: 'eher',    label: 'Eher wichtig',    desc: 'EU-Server bevorzugt, aber kein hartes K.O.-Kriterium' },
      { value: 'weniger', label: 'Weniger wichtig', desc: 'Funktionalität und Preis gehen vor' },
    ],
  },
  {
    key: 'teamSize',
    question: 'Wie groß ist dein Team?',
    subtitle: 'Hilft uns, das passende Preismodell zu empfehlen.',
    options: [
      { value: 'solo',   label: 'Nur ich',        desc: 'Solo-Kanzlei oder Freelancer' },
      { value: 'klein',  label: '2–10 Personen',  desc: 'Kleines Team' },
      { value: 'mittel', label: '11–50 Personen', desc: 'Mittelgroße Kanzlei' },
      { value: 'gross',  label: '50+ Personen',   desc: 'Große Kanzlei oder Unternehmen' },
    ],
  },
]

// ─── Matching logic ────

const USE_CASE_KEYWORDS: Record<UseCase, string[]> = {
  'recherche':       ['recherche', 'research', 'suche', 'legal research', 'nachschlagen'],
  'vertragsanalyse': ['vertragsanalyse', 'vertrag', 'contract', 'analyse', 'review', 'prüfung'],
  'due-diligence':   ['due diligence', ' dd ', 'dokumentenprüfung', 'transaktionsprüfung'],
  'drafting':        ['drafting', 'erstell', 'schreib', 'generier', 'entwurf', 'formulier'],
  'prompting':       ['prompt', 'ki-assistent', 'assistent', 'chat', 'copilot', 'ki-tool'],
}

const VISITOR_RECHTSGEBIETE: Record<VisitorType, string[]> = {
  anwalt:            ['M&A', 'Gesellschaftsrecht', 'Venture Capital'],
  steuerberater:     ['Steuerrecht'],
  interdisziplinaer: ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Venture Capital'],
  inhouse:           ['M&A', 'Gesellschaftsrecht'],
}

const PRICING_PREFERENCE: Record<TeamSize, string[]> = {
  solo:   ['free', 'freemium'],
  klein:  ['freemium', 'paid'],
  mittel: ['paid', 'enterprise'],
  gross:  ['enterprise', 'paid'],
}

function computeMatchScore(tool: ToolRow, answers: Required<Answers>): number {
  let score = 0

  // Base: LexLab score normalized to 0–10
  score += (tool.lexlab_score ?? 50) / 10

  // Rechtsgebiet overlap: +1.5 per matching area
  const preferred = VISITOR_RECHTSGEBIETE[answers.visitor]
  const rg = tool.rechtsgebiet ?? []
  const rgMatches = rg.filter(r => preferred.includes(r)).length
  if (rg.length === 0 || rg.length === 4) {
    score += 2 // general-purpose tool — relevant for everyone
  } else {
    score += rgMatches * 1.5
  }

  // Use case keyword matching
  const keywords = USE_CASE_KEYWORDS[answers.useCase]
  const categoryText = (tool.category ?? []).join(' ').toLowerCase()
  const taglineText  = (tool.tagline ?? '').toLowerCase()
  const verdictText  = (tool.verdict ?? '').toLowerCase()
  const bestForText  = (tool.best_for ?? []).join(' ').toLowerCase()

  if (keywords.some(kw => categoryText.includes(kw))) score += 4
  if (keywords.some(kw => taglineText.includes(kw)))  score += 2
  if (keywords.some(kw => verdictText.includes(kw)))  score += 1.5
  if (keywords.some(kw => bestForText.includes(kw)))  score += 1.5

  // Data privacy weighting
  const ds = tool.score_datenschutz ?? 5
  if (answers.privacy === 'sehr') {
    score += ds >= 8 ? 5 : ds >= 6 ? 1 : -4
  } else if (answers.privacy === 'eher') {
    score += ds >= 6 ? 2 : 0
  }

  // Pricing match: +1
  const pricingPrefs = PRICING_PREFERENCE[answers.teamSize]
  if (tool.pricing && pricingPrefs.includes(tool.pricing)) score += 1

  return score
}

// ─── Score badge ────

function ScoreBadge({ score }: { score: number | null }) {
  if (score == null) return null
  const cls =
    score >= 80 ? 'bg-green-100 text-green-800' :
    score >= 60 ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {score}
    </span>
  )
}

// ─── Main component ────

export default function FinderClient() {
  const [step, setStep]       = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [results, setResults] = useState<ToolResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(false)

  const currentStep = STEPS[step]
  const totalSteps  = STEPS.length
  const isLastStep  = step === totalSteps - 1

  async function handleSelect(value: string) {
    const newAnswers = { ...answers, [currentStep.key]: value } as Answers

    if (isLastStep) {
      setAnswers(newAnswers)
      await runFinder(newAnswers as Required<Answers>)
    } else {
      setAnswers(newAnswers)
      setStep(s => s + 1)
    }
  }

  async function runFinder(finalAnswers: Required<Answers>) {
    setLoading(true)
    setLoadError(false)

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('tools')
        .select('id,name,slug,tagline,rechtsgebiet,category,verdict,pricing,score_datenschutz,lexlab_score,best_for')
        .eq('status', 'approved')

      if (error) throw new Error(error.message)

      const scored: ToolResult[] = (data as ToolRow[] ?? []).map(tool => ({
        ...tool,
        matchScore: computeMatchScore(tool, finalAnswers),
      }))
      scored.sort((a, b) => b.matchScore - a.matchScore)
      setResults(scored.slice(0, 5))
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }

  function restart() {
    setStep(0)
    setAnswers({})
    setResults(null)
    setLoadError(false)
  }

  // ─── Loading ────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#111827] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Analysiere passende Tools…</p>
        </div>
      </div>
    )
  }

  // ─── Error ────
  if (loadError) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Tools konnten nicht geladen werden.</p>
          <button onClick={restart} className="text-sm text-blue-600 hover:text-blue-700 underline">
            Erneut versuchen
          </button>
        </div>
      </div>
    )
  }

  // ─── Results ────
  if (results) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] py-14 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Deine Empfehlungen</p>
            <h1 className="font-display text-3xl text-[#111827]">
              {results.length === 0
                ? 'Keine Treffer gefunden'
                : `${results.length} passende Tools`}
            </h1>
            {results.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">
                Das Verzeichnis wächst laufend — versuche andere Antworten oder{' '}
                <Link href="/tools" className="underline">browse alle Tools</Link>.
              </p>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                Basierend auf deinen Antworten — sortiert nach Relevanz
              </p>
            )}
          </div>

          {/* Result cards */}
          <div className="space-y-4 mb-8">
            {results.map((tool, i) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="block bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all group"
              >
                {/* Title row */}
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-mono text-gray-300 flex-shrink-0">0{i + 1}</span>
                    <h2 className="font-semibold text-[#111827] truncate group-hover:underline">
                      {tool.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {tool.lexlab_score != null && (
                      <span className="text-[10px] text-gray-400 font-medium">LexLab</span>
                    )}
                    <ScoreBadge score={tool.lexlab_score} />
                  </div>
                </div>

                {/* Tagline */}
                {tool.tagline && (
                  <p className="text-sm text-gray-500 mb-3 ml-7 leading-snug">{tool.tagline}</p>
                )}

                {/* Verdict */}
                {tool.verdict && (
                  <p className="text-sm text-[#111827]/80 bg-blue-50 rounded-lg px-3 py-2.5 ml-7 line-clamp-2 leading-relaxed">
                    {tool.verdict}
                  </p>
                )}

                {/* Footer row */}
                <div className="mt-3 ml-7 flex items-center gap-2 flex-wrap">
                  {(tool.rechtsgebiet ?? []).slice(0, 2).map(rg => (
                    <span key={rg} className="text-xs text-gray-500 bg-gray-100 rounded-full px-2.5 py-0.5">
                      {rg}
                    </span>
                  ))}
                  {tool.pricing && (
                    <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-0.5 capitalize">
                      {tool.pricing}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 ml-auto group-hover:text-[#111827] transition-colors">
                    Zum Tool →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <button
              onClick={restart}
              className="text-gray-500 hover:text-[#111827] underline underline-offset-2 transition-colors"
            >
              Finder neu starten
            </button>
            <Link href="/tools" className="text-gray-500 hover:text-[#111827] transition-colors">
              Alle Tools ansehen →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ─── Finder steps ────
  const selectedValue = answers[currentStep.key]

  return (
    <div className="min-h-screen bg-[#F7F7F5] py-14 px-4">
      <div className="max-w-lg mx-auto">

        {/* Progress bar */}
        <div className="flex items-center gap-1.5 mb-12">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-[#111827]' : 'bg-gray-200'
              } ${i === step ? 'flex-[2]' : 'flex-1'}`}
            />
          ))}
        </div>

        {/* Question */}
        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
            Schritt {step + 1} von {totalSteps}
          </p>
          <h1 className="font-display text-[2rem] leading-tight text-[#111827] mb-2">
            {currentStep.question}
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">{currentStep.subtitle}</p>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {currentStep.options.map(opt => {
            const isSelected = selectedValue === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left rounded-xl border px-5 py-4 transition-all duration-150 ${
                  isSelected
                    ? 'border-[#111827] bg-[#111827] text-white shadow-sm'
                    : 'border-gray-200 bg-white text-[#111827] hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="font-semibold text-[15px] leading-tight mb-0.5">
                  {opt.label}
                </div>
                <div className={`text-xs leading-snug ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                  {opt.desc}
                </div>
              </button>
            )
          })}
        </div>

        {/* Back button */}
        {step > 0 && (
          <div className="mt-7 text-center">
            <button
              onClick={() => setStep(s => s - 1)}
              className="text-sm text-gray-400 hover:text-[#111827] transition-colors"
            >
              ← Zurück
            </button>
          </div>
        )}

        {/* Exit link */}
        <div className="mt-6 text-center">
          <Link href="/tools" className="text-xs text-gray-300 hover:text-gray-500 transition-colors">
            Alle Tools durchsuchen
          </Link>
        </div>
      </div>
    </div>
  )
}
