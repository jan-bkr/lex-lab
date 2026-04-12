'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock, ArrowLeft, Calendar } from 'lucide-react'
import { RechtsgebietTag } from '@/components/RechtsgebietTag'
import { createClient } from '@/lib/supabase/client'
import { mockWorkflows } from '@/lib/mock-data'
import { Workflow, Rechtsgebiet } from '@/types'

interface WorkflowRow {
  id: string
  title: string
  slug: string
  rechtsgebiet: string[] | null
  reading_time: number | null
  excerpt: string | null
  content: string | null
  published: boolean
  created_at: string
}

function mapRow(row: WorkflowRow): Workflow {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    rechtsgebiet: (row.rechtsgebiet ?? []) as Rechtsgebiet[],
    readingTime: row.reading_time ?? 0,
    excerpt: row.excerpt ?? '',
    createdAt: row.created_at,
  }
}

const WORKFLOW_STEPS: Record<string, string[]> = {
  'due-diligence-claude-ma': [
    'Scope definieren: Erstelle mit Claude eine strukturierte Checkliste der DD-Bereiche (Legal, Tax, IP, HR) basierend auf dem Term Sheet.',
    'Dokumenten-Upload und Indexierung: Lade Verträge, Jahresabschlüsse und Korrespondenz in Claude und erstelle eine vollständige Dokumentenübersicht.',
    'Red-Flag-Analyse: Nutze den Due Diligence Red Flag Scanner-Prompt für jeden Vertragstyp. Kategorisiere Findings nach Deal Breaker / Nachverhandlung / Standard.',
    'Risikomatrix erstellen: Verdichte alle Findings in einer priorisierten Risikomatrix mit Handlungsempfehlungen und Verantwortlichkeiten.',
    'DD-Bericht generieren: Erstelle den finalen Bericht strukturiert nach Bereichen, inklusive Executive Summary und Management Letter für den Mandanten.',
  ],
  'steuermemo-prompt-kette': [
    'Sachverhalt aufbereiten: Strukturiere die Fakten in Kategorien (Beteiligte, Transaktionsstruktur, Zeitachse, Beträge) und übergib sie als Kontext an Claude.',
    'Normenidentifikation: Führe den ersten Prompt aus — Claude identifiziert einschlägige Normen (EStG, KStG, UmwStG) und gibt eine erste rechtliche Einschätzung.',
    'Tatbestandsprüfung: Zweiter Prompt für die detaillierte Subsumtion: Tatbestandsmerkmale werden systematisch gegen den Sachverhalt geprüft.',
    'Steuerberechnung: Dritter Prompt mit konkreten Zahlen — Claude berechnet steuerliche Auswirkungen und prüft Wahlrechte (z.B. Teileinkünfteverfahren, Optionen).',
    'Memo finalisieren: Abschlussprompt generiert das strukturierte Steuermemo im Kanzleiformat mit Ergebnis, Begründung und Gestaltungshinweisen.',
  ],
  'term-sheet-review-ki': [
    'Term Sheet strukturieren: Unterteile das Dokument in Abschnitte (Bewertung, Finanzierung, Governance, Exit) und lade jeden Abschnitt separat in Claude.',
    'Wirtschaftliche Kernklauseln analysieren: Prüfe Bewertung (Pre-/Post-Money), Liquidationspräferenz (partizipierend vs. nicht-partizipierend) und Anti-Dilution-Mechanismus.',
    'Governance-Analyse: Untersuche Board-Zusammensetzung, Vetorechte, Drag-along- und Tag-along-Klauseln sowie Vesting-Bedingungen für Gründer.',
    'Marktvergleich generieren: Claude vergleicht die Konditionen mit marktüblichen Standards und identifiziert konkrete Verhandlungsspielräume.',
    'Mandantenbriefing erstellen: Generiere eine klare Zusammenfassung der Key Issues mit priorisierten Verhandlungsempfehlungen für das Mandantengespräch.',
  ],
  'gmbh-gruendung-automatisiert': [
    'Mandantendaten erfassen: Strukturierter Fragebogen für Gesellschafter, Stammkapital, Unternehmensgegenstand, Sitz und Geschäftsführerbestellung.',
    'Standardfall vs. Individualfall: Claude prüft, ob das vereinfachte Musterprotokoll (§ 2 Abs. 1a GmbHG) ausreicht oder eine individuelle Satzung erforderlich ist.',
    'Satzungsentwurf generieren: KI erstellt den Satzungsentwurf mit allen Pflichtangaben und mandantenspezifischen Regelungen (Vinkulierung, Einziehung, Wettbewerbsverbot).',
    'Gesellschafterliste und Unterlagen: Automatische Erstellung der Gesellschafterliste nach § 40 GmbHG sowie Checkliste für Einzahlungsnachweis und Handelsregisteranmeldung.',
    'Notartermin vorbereiten: Vollständige Checkliste mit allen erforderlichen Dokumenten, Legitimationsnachweisen und Vollmachten für den Beurkundungstermin.',
  ],
}

const DEFAULT_STEPS = [
  'Aufgabe definieren: Kläre den genauen Umfang und die Ziele des Workflows gemeinsam mit dem Mandanten.',
  'Unterlagen strukturieren: Sammle alle relevanten Dokumente und bereite sie für die KI-Analyse vor.',
  'Erstanalyse durchführen: Nutze Claude für eine erste Einschätzung und Identifikation der Kernsachverhalte.',
  'Detailprüfung: Gehe systematisch durch die identifizierten Kernpunkte mit spezifischen Folgeprompts.',
  'Ergebnis dokumentieren: Erstelle eine strukturierte Zusammenfassung mit konkreten Handlungsempfehlungen.',
]

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWorkflows() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('published', true)

      if (error || !data || data.length === 0) {
        setWorkflows(mockWorkflows)
      } else {
        setWorkflows((data as WorkflowRow[]).map(mapRow))
      }
      setLoading(false)
    }
    fetchWorkflows()
  }, [])

  const workflow = workflows.find(w => w.slug === slug)
  const similar = workflows
    .filter(w => w.slug !== slug && w.rechtsgebiet.some(r => workflow?.rechtsgebiet.includes(r)))
    .slice(0, 2)

  const steps = WORKFLOW_STEPS[slug] ?? DEFAULT_STEPS

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-pulse space-y-4">
        <div className="h-4 bg-gray-100 rounded w-24" />
        <div className="h-8 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8 mt-6">
          <div className="space-y-4">
            <div className="h-32 bg-gray-100 rounded-xl" />
            <div className="h-64 bg-gray-100 rounded-xl" />
          </div>
          <div className="space-y-4">
            <div className="h-40 bg-gray-100 rounded-xl" />
            <div className="h-28 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!workflow) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="font-display text-2xl text-gray-900 mb-2">
          Workflow nicht gefunden
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          Dieser Workflow existiert nicht oder wurde entfernt.
        </p>
        <Link href="/workflows" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          ← Workflows
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8">
        {/* Left */}
        <div>
          <Link
            href="/workflows"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Workflows
          </Link>

          <h1 className="font-display text-2xl text-gray-900 mb-4 leading-snug">
            {workflow.title}
          </h1>

          <div className="flex items-center gap-3 flex-wrap mb-6">
            {workflow.rechtsgebiet.map(tag => (
              <RechtsgebietTag key={tag} tag={tag} />
            ))}
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {workflow.readingTime} Min. Lesezeit
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              {formatDate(workflow.createdAt)}
            </span>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-6 mb-4">
            <p className="text-gray-600 leading-relaxed text-sm">{workflow.excerpt}</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="font-display font-semibold text-gray-900 mb-5">Workflow-Schritte</h2>
            <ol className="space-y-5">
              {steps.map((step, i) => {
                const colonIdx = step.indexOf(':')
                const label = colonIdx !== -1 ? step.slice(0, colonIdx) : step
                const body = colonIdx !== -1 ? step.slice(colonIdx + 1).trim() : ''
                return (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                      {i + 1}
                    </span>
                    <div className="pt-0.5 text-sm">
                      <span className="font-semibold text-gray-800">{label}:</span>
                      {body && <span className="text-gray-600"> {body}</span>}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {similar.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <h3 className="font-display font-semibold text-sm text-gray-900 mb-3">
                Ähnliche Workflows
              </h3>
              <div className="space-y-3">
                {similar.map(w => (
                  <Link key={w.id} href={`/workflows/${w.slug}`} className="block group">
                    <p className="text-sm text-gray-700 group-hover:text-blue-600 leading-snug transition-colors">
                      {w.title}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <Clock className="w-3 h-3" />
                      {w.readingTime} Min.
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <h3 className="font-display font-semibold text-sm text-blue-900 mb-1">Newsletter</h3>
            <p className="text-xs text-blue-700 leading-relaxed mb-3">
              Neue Workflows und Prompts direkt in dein Postfach — wöchentlich, kostenlos.
            </p>
            <Link
              href="/newsletter"
              className="block text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
            >
              Jetzt abonnieren
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
