import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Activity, TrendingUp, AlertTriangle, Zap, Package, BarChart2, Mail } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { NewsletterForm } from '@/components/NewsletterForm'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'LexLab Radar — Marktintelligenz für Legal AI',
  description: 'Neue Tools, Preisänderungen, Features und regulatorische Entwicklungen für KI im deutschen Rechts- und Steuermarkt.',
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = 'tool' | 'feature' | 'pricing' | 'regulation' | 'market'
type Impact    = 'hoch' | 'mittel' | 'niedrig'

interface Signal {
  id: string
  title: string
  summary: string
  assessment?: string
  category: Category
  impact: Impact
  date: string
  tags?: string[]
  isNew?: boolean
}

// ─── Signal data ──────────────────────────────────────────────────────────────

const SIGNALS: Signal[] = [
  {
    id: 'eu-ai-act-2026',
    title: 'EU AI Act: Hochrisiko-Anforderungen gelten ab Mai 2026',
    summary: 'Ab Mai 2026 treten die Hochrisiko-Bestimmungen des EU AI Acts in Kraft. Legal-AI-Anbieter müssen Transparenz-, Datenschutz- und Robustheitsnachweise erbringen. Kanzleien und Steuerberatungen sollten ihre Verträge mit Tool-Anbietern auf Compliance-Klauseln prüfen.',
    assessment: 'Jetzt Vertragswerk prüfen und von Tool-Anbietern Compliance-Nachweise anfordern — insbesondere für Tools, die Mandantendaten verarbeiten.',
    category: 'regulation',
    impact: 'hoch',
    date: '2026-04-10',
    tags: ['Alle Rechtsgebiete'],
    isNew: true,
  },
  {
    id: 'harvey-dach',
    title: 'Harvey AI — Offizielle DACH-Expansion mit deutschsprachiger Dokumentenunterstützung',
    summary: 'Harvey AI hat die Expansion in den DACH-Markt bestätigt. Erstmals vollständige Unterstützung für deutschsprachige Rechtsdokumente, deutsche Gesetzesstrukturen und DSGVO-konforme Datenverarbeitung. Mehrere deutsche Großkanzleien haben Pilotprogramme gestartet.',
    assessment: 'Hohes Potenzial für M&A- und Gesellschaftsrechts-Teams. Datenschutz-Compliance für deutsche Mandate laut Anbieter gewährleistet — eigene Prüfung empfohlen.',
    category: 'tool',
    impact: 'hoch',
    date: '2026-04-08',
    tags: ['M&A', 'Gesellschaftsrecht'],
    isNew: true,
  },
  {
    id: 'luminance-pricing',
    title: 'Luminance — Enterprise-Preise um bis zu 40 % gestiegen',
    summary: 'Luminance hat die Preise für Enterprise-Lizenzen bei Vertragsverlängerungen erhöht. Bestandskunden berichten von Steigerungen zwischen 25 und 40 Prozent. Der Anbieter begründet dies mit gestiegenen KI-Infrastrukturkosten und erweiterten Compliance-Features.',
    assessment: 'Bestehende Verträge möglichst vor Ablauf verlängern. Für Due-Diligence-Teams lohnt sich ein Vergleich mit Kira Systems oder ThoughtRiver.',
    category: 'pricing',
    impact: 'hoch',
    date: '2026-04-05',
    tags: ['M&A', 'Gesellschaftsrecht'],
    isNew: true,
  },
  {
    id: 'ms-copilot-legal',
    title: 'Microsoft 365 Copilot — Neue Legal-Features für Word und Teams',
    summary: 'Microsoft hat spezifische Legal-Erweiterungen für Copilot angekündigt: automatische Zusammenfassung von Vertragsklauseln, Risiko-Highlighting in Word-Dokumenten und Legal-Workflow-Templates für Teams. Rollout für DACH-Kunden ist für Q2 2026 geplant.',
    assessment: 'Interessant für Kanzleien, die Microsoft 365 bereits nutzen. EU Data Boundary sichert DSGVO-Konformität. Kein Ersatz für spezialisierte Legal-AI-Tools.',
    category: 'feature',
    impact: 'mittel',
    date: '2026-04-03',
    tags: ['Alle Rechtsgebiete'],
  },
  {
    id: 'dsgvo-us-cloud',
    title: 'DSK-Orientierungshilfe: US-Cloud bei sensiblen Mandantendaten kritisch',
    summary: 'Die Datenschutzkonferenz (DSK) hat eine neue Orientierungshilfe zu US-Cloud-Diensten veröffentlicht. Viele gängige Legal-AI-Dienste ohne Transfer Impact Assessment (TIA) und Standardvertragsklauseln sind demnach nicht rechtskonform einsetzbar — insbesondere für Tools ohne EU-Serverstandort.',
    assessment: 'Sofortiger Handlungsbedarf für Kanzleien, die US-basierte KI-Dienste ohne EU-Datenschutzvertrag einsetzen. Datenschutz-Scores im LexLab-Verzeichnis bieten erste Orientierung.',
    category: 'regulation',
    impact: 'hoch',
    date: '2026-03-25',
    tags: ['Alle Rechtsgebiete'],
  },
  {
    id: 'lexisnexis-dach',
    title: 'LexisNexis+ AI — DACH-Launch für Q3 2026 bestätigt',
    summary: 'LexisNexis hat den Launch von Lexis+ AI für Deutschland, Österreich und die Schweiz für Q3 2026 bestätigt. Das Produkt soll deutsches Fallrecht, BFH-Entscheidungen und aktuelle Gesetzgebung integrieren und direkt gegen juris AI und beck-online antreten.',
    category: 'tool',
    impact: 'mittel',
    date: '2026-03-28',
    tags: ['Steuerrecht', 'Gesellschaftsrecht'],
  },
  {
    id: 'datev-ki',
    title: 'DATEV — KI-Funktionen für Steuerberater-Software angekündigt',
    summary: 'DATEV hat erste KI-Funktionen für die Steuerberater-Software bekannt gegeben: automatische Belegzuordnung, Steueroptimierungs-Hinweise und eine KI-gestützte Mandanten-Kommunikationshilfe. Ein Pilotprogramm startet für ausgewählte Kanzleien in Q2 2026.',
    assessment: 'Für DATEV-Kanzleien relevant — kein Ersatz für spezialisierte Legal-AI-Tools, aber sinnvolle Ergänzung im bestehenden Workflow.',
    category: 'feature',
    impact: 'mittel',
    date: '2026-03-20',
    tags: ['Steuerrecht'],
  },
  {
    id: 'aleph-alpha-legal',
    title: 'Aleph Alpha — Legal-AI-Partnerschaft für den deutschen Markt',
    summary: 'Das deutsche KI-Unternehmen Aleph Alpha hat eine strategische Partnerschaft mit einem Legal-Tech-Anbieter bekannt gegeben. Die Integration soll DSGVO-konforme KI-Verarbeitung mit On-Premise-Option für besonders datenschutzsensible Mandate ermöglichen.',
    assessment: 'Relevantes Signal für Kanzleien mit hohen Datenschutzanforderungen. Preis und Marktreife des Produkts noch zu evaluieren.',
    category: 'market',
    impact: 'mittel',
    date: '2026-03-10',
    tags: ['Alle Rechtsgebiete'],
  },
  {
    id: 'kira-vc-templates',
    title: 'Kira Systems — Neue deutschsprachige Venture-Capital-Templates',
    summary: 'Kira Systems hat sein Template-Verzeichnis um deutschsprachige Venture-Capital-Klauseln erweitert: Term Sheets, SAFE-Agreements und Gesellschaftervereinbarungen nach deutschem GmbH-Recht sind jetzt vortrainiert verfügbar.',
    category: 'feature',
    impact: 'niedrig',
    date: '2026-03-15',
    tags: ['Venture Capital', 'Gesellschaftsrecht'],
  },
]

// ─── Category config ──────────────────────────────────────────────────────────

const categoryConfig: Record<Category, {
  label: string
  icon: React.ReactNode
  color: string
  bg: string
  border: string
  borderLeft: string
}> = {
  tool:       { label: 'Neues Tool',    icon: <Zap className="w-3 h-3" />,           color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100',  borderLeft: 'border-l-blue-400' },
  feature:    { label: 'Feature',       icon: <Package className="w-3 h-3" />,        color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', borderLeft: 'border-l-purple-400' },
  pricing:    { label: 'Preisänderung', icon: <TrendingUp className="w-3 h-3" />,     color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-100',  borderLeft: 'border-l-amber-400' },
  regulation: { label: 'Regulierung',   icon: <AlertTriangle className="w-3 h-3" />,  color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-100',    borderLeft: 'border-l-red-400' },
  market:     { label: 'Markt',         icon: <BarChart2 className="w-3 h-3" />,      color: 'text-gray-600',   bg: 'bg-gray-100',  border: 'border-gray-200',   borderLeft: 'border-l-gray-300' },
}

const impactConfig: Record<Impact, { label: string; filled: number }> = {
  hoch:    { label: 'Hohe Relevanz',    filled: 3 },
  mittel:  { label: 'Mittlere Relevanz', filled: 2 },
  niedrig: { label: 'Niedrige Relevanz', filled: 1 },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ImpactDots({ impact }: { impact: Impact }) {
  const cfg = impactConfig[impact]
  const dotColor = impact === 'hoch' ? 'bg-red-400' : impact === 'mittel' ? 'bg-amber-400' : 'bg-gray-300'
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex items-center gap-0.5">
        {[1, 2, 3].map(n => (
          <span
            key={n}
            className={`w-1.5 h-1.5 rounded-full ${n <= cfg.filled ? dotColor : 'bg-gray-200'}`}
          />
        ))}
      </span>
      {impact === 'hoch' && (
        <span className="text-[10px] font-semibold text-red-500 leading-none">{cfg.label}</span>
      )}
    </span>
  )
}

function SignalCard({ signal }: { signal: Signal }) {
  const cat = categoryConfig[signal.category]
  return (
    <article className={`bg-white rounded-xl border border-gray-100 border-l-4 ${cat.borderLeft} p-5 sm:p-6`}>
      {/* Meta row */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold rounded-full px-2.5 py-0.5 border ${cat.bg} ${cat.color} ${cat.border}`}>
          {cat.icon}
          {cat.label}
        </span>
        <ImpactDots impact={signal.impact} />
        {signal.isNew && (
          <span className="text-[9px] font-bold bg-blue-500 text-white rounded-full px-2 py-0.5 leading-none uppercase tracking-wide">
            Neu
          </span>
        )}
        <span className="ml-auto text-xs text-gray-400 tabular-nums">
          {format(new Date(signal.date), 'd. MMM yyyy', { locale: de })}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-[15px] text-gray-900 leading-snug mb-2">
        {signal.title}
      </h3>

      {/* Summary */}
      <p className="text-sm text-gray-500 leading-relaxed mb-0">
        {signal.summary}
      </p>

      {/* LexLab-Einschätzung */}
      {signal.assessment && (
        <div className="mt-3 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5">
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="font-semibold text-gray-700">LexLab-Einschätzung: </span>
            {signal.assessment}
          </p>
        </div>
      )}

      {/* Tags */}
      {signal.tags && signal.tags.length > 0 && (
        <div className="mt-3 flex gap-1.5 flex-wrap">
          {signal.tags.map(tag => (
            <span key={tag} className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RadarPage() {
  const sorted = [...SIGNALS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const newSignals  = sorted.filter(s => s.isNew)
  const restSignals = sorted.filter(s => !s.isNew)
  const latestDate  = sorted[0]?.date ?? SIGNALS[0].date
  const standLabel  = format(new Date(latestDate), 'MMMM yyyy', { locale: de })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">

      {/* ─── Header ─── */}
      <section className="pt-14 pb-10 border-b border-gray-100">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            <Activity className="w-3.5 h-3.5 text-blue-500" />
            LexLab Radar
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-gray-900 leading-tight tracking-tight mb-4">
            Was den Markt bewegt
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-6 max-w-xl">
            Neue Tools, Preisänderungen und regulatorische Entwicklungen — mit LexLab-Einschätzung.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              Stand: {standLabel}
            </span>
            <span>·</span>
            <span>Kuratiert von LexLab</span>
            <span>·</span>
            <span>{SIGNALS.length} Signale</span>
          </div>
        </div>
      </section>

      <div className="py-10 max-w-3xl">

        {/* ─── Neue Signale ─── */}
        {newSignals.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <h2 className="font-display font-semibold text-lg text-gray-900">Neu im Radar</h2>
              <span className="text-[10px] font-bold bg-blue-500 text-white rounded-full px-2 py-0.5 leading-none uppercase tracking-wide">
                {newSignals.length} neu
              </span>
            </div>
            <div className="space-y-4">
              {newSignals.map(signal => (
                <SignalCard key={signal.id} signal={signal} />
              ))}
            </div>
          </section>
        )}

        {/* ─── Ältere Signale ─── */}
        {restSignals.length > 0 && (
          <section className="mb-10">
            {newSignals.length > 0 && (
              <h2 className="font-display text-sm font-semibold text-gray-400 uppercase tracking-widest mb-5">Frühere Signale</h2>
            )}
            <div className="space-y-4">
              {restSignals.map(signal => (
                <SignalCard key={signal.id} signal={signal} />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* ─── Bottom CTAs ─── */}
      <div className="border-t border-gray-100 pt-10 pb-16 grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* State of Legal AI */}
        <Link
          href="/state-of-legal-ai"
          className="group flex flex-col gap-3 bg-[#111827] rounded-xl p-5 hover:bg-[#1a2234] transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">LexLab Research</span>
          </div>
          <p className="font-display font-semibold text-white text-base leading-snug">
            State of Legal AI Germany 2026
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            Marktanalyse, Shortlists und Auswahlframework für den deutschen Rechtsmarkt.
          </p>
          <div className="inline-flex items-center gap-1 text-sm text-blue-400 group-hover:text-blue-300 transition-colors mt-auto">
            Report lesen <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Newsletter */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">
            <Mail className="w-3.5 h-3.5 text-gray-400" />
            Radar-Updates per E-Mail
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Neue Signale, Tool-Bewertungen und Markteinblicke — kostenlos, jederzeit abmeldbar.
          </p>
          <NewsletterForm />
        </div>

      </div>

    </div>
  )
}
