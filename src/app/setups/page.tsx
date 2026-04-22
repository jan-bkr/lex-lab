import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Working Setups',
  description: 'Professionelle KI-Arbeitsarchitekturen für den deutschen Rechtsmarkt — wie Teams Modelle, Tools, Quellen und Review-Layer sinnvoll kombinieren.',
  openGraph: {
    title: 'LexLab Working Setups — Arbeitsarchitekturen für professionelle Teams',
    description: 'Kuratierte Setup-Blueprints: wie Teams Modelle, Tools, Quellen und Review-Layer im deutschen Rechtsmarkt kombinieren.',
  },
  alternates: { canonical: 'https://www.lex-lab.de/setups' },
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface StackEntry { label: string; primary: string; note: string }
interface SetupStep  { num: string; text: string }

interface Setup {
  id:          string
  num:         string
  persona:     string
  title:       string
  lead:        string
  stack:       { model: StackEntry; tools: StackEntry; review: StackEntry }
  steps:       SetupStep[]
  humanReview: string
  whenYes:     string[]
  whenNo:      string[]
  collection:  { href: string; label: string } | null
  toolsHref:   string | null
}

// ─── Setup data ───────────────────────────────────────────────────────────────

const SETUPS: Setup[] = [
  {
    id:      'transaktionsanalyse',
    num:     '01',
    persona: 'Transaktionskanzleien · M&A-Teams',
    title:   'Transaktionsanalyse',
    lead:    'Strukturierte Sichtung und Priorisierung großer Dokumentenmengen bei M&A-Transaktionen — mit klarem Review-Protokoll und definierten Entscheidungsverantwortungen.',
    stack: {
      model: {
        label:   'Modell-Layer',
        primary: 'Claude Sonnet / GPT-4o',
        note:    'Klassifikation, Zusammenfassung, Risikoidentifikation großer Dokumentenmengen',
      },
      tools: {
        label:   'Tool-Layer',
        primary: 'Legartis · NotebookLM',
        note:    'Contract Review, strukturiertes Dokumentenrepository, Klauselvergleich',
      },
      review: {
        label:   'Review-Layer',
        primary: 'Strukturierter Anwalts-Review',
        note:    'Flagged-Items-Protokoll, Material-Issues-Entscheidung durch Berufsträger',
      },
    },
    steps: [
      { num: '01', text: 'Dokumente werden nach Vertragstyp und Risikorelevanz klassifiziert und priorisiert.' },
      { num: '02', text: 'Modell fasst Schlüsselklauseln zusammen und markiert Abweichungen vom Standardmuster.' },
      { num: '03', text: 'Flagged Items werden in strukturiertem Review-Log erfasst und nach Risikoklasse sortiert.' },
      { num: '04', text: 'Anwalt prüft alle flagged Items manuell und trifft finale Einschätzung zu Material Issues.' },
    ],
    humanReview: 'Alle als kritisch markierten Klauseln, Abweichungen vom Standardmuster und Risikoklasse-A-Items werden zwingend manuell geprüft. KI-Output ist Vorsichtung — keine abschließende rechtliche Beurteilung.',
    whenYes: [
      'Deals mit mehr als 20–50 Dokumenten gleichen Typs',
      'Wiederholbare Prüfstrukturen (z.B. SPAs, Garantieklauseln, MAC-Klauseln)',
      'Teams mit etabliertem Review-Protokoll und definierten Eskalationspfaden',
    ],
    whenNo: [
      'Hochgradig individualisierte Einzelverträge ohne Standardstruktur',
      'Erste Due-Diligence-Erfahrung ohne definierten Review-Prozess',
    ],
    collection: { href: '/collections/ma-due-diligence', label: 'M&A Due Diligence' },
    toolsHref:  '/tools?rechtsgebiet=M%26A',
  },
  {
    id:      'kanzleikommunikation',
    num:     '02',
    persona: 'Kanzleien · Steuerberatungsbüros',
    title:   'Kanzleikommunikation',
    lead:    'Schnelle, konsistente und qualitätssichere Mandantenschreiben und Briefings — mit strukturiertem Berater-Review vor jedem Versand.',
    stack: {
      model: {
        label:   'Modell-Layer',
        primary: 'Claude Sonnet',
        note:    'Entwurfsgenerierung, Strukturierung, Sprachqualität auf Deutsch',
      },
      tools: {
        label:   'Tool-Layer',
        primary: 'DATEV · Beck-Online',
        note:    'Kanzleisoftware-Integration, juristische Fachdatenbanken als Quellenreferenz',
      },
      review: {
        label:   'Review-Layer',
        primary: 'Berater-Review vor Versand',
        note:    'Rechtliche Grundlagen, Ton und Mandantenindividualität geprüft',
      },
    },
    steps: [
      { num: '01', text: 'Sachverhalt und relevante Mandanteninformationen werden strukturiert eingegeben.' },
      { num: '02', text: 'Modell generiert Briefentwurf mit rechtlicher Einordnung und Quellenreferenzen.' },
      { num: '03', text: 'Berater prüft Substanz, Ton und Rechtslage — passt an wo nötig.' },
      { num: '04', text: 'Freigabe und Versand nach vollständigem Berater-Review.' },
    ],
    humanReview: 'Jedes Schreiben wird vor dem Versand vollständig geprüft. Rechtliche Einschätzungen, Empfehlungen und alle mandatenrelevanten Aussagen liegen in der Verantwortung des Berufsträgers.',
    whenYes: [
      'Standardisierbare Schreiben mit ähnlicher Struktur (z.B. Mandanteninformationen, Erläuterungsschreiben)',
      'Hohes Kommunikationsvolumen mit wiederholbaren Sachverhalten',
      'Teams mit klar definiertem Review-Schritt vor dem Versand',
    ],
    whenNo: [
      'Komplex individualisierte Erstberatungsschreiben ohne vergleichbaren Präzedenzfall',
      'Schreiben mit unmittelbarer Haftungsrelevanz, die ohne vollständigen Berater-Review versendet werden',
    ],
    collection: { href: '/collections/steuerrecht-essentials', label: 'Steuerrecht Essentials' },
    toolsHref:  '/tools?rechtsgebiet=Steuerrecht',
  },
  {
    id:      'inhouse-compliance',
    num:     '03',
    persona: 'Inhouse Legal · Compliance-Teams',
    title:   'Inhouse Compliance',
    lead:    'Kontinuierliches Monitoring von Vertragsbeständen und Regulierungsänderungen — mit definiertem Eskalationsprotokoll für kritische Findings.',
    stack: {
      model: {
        label:   'Modell-Layer',
        primary: 'Harvey / Microsoft Copilot',
        note:    'Enterprise-Stack; alternativ Claude Teams für datenschutzkonforme Umgebungen',
      },
      tools: {
        label:   'Tool-Layer',
        primary: 'CLM-System · Risk Dashboard',
        note:    'Ironclad, Juro oder äquivalente Contract-Management-Lösungen',
      },
      review: {
        label:   'Review-Layer',
        primary: 'Legal Team Review',
        note:    'High-Risk-Findings manuell, regelmäßige Stichproben zur Qualitätssicherung',
      },
    },
    steps: [
      { num: '01', text: 'KI screent Vertragsdatenbank nach definierten Risikoindikatoren und Fristabläufen.' },
      { num: '02', text: 'Flagged Items werden nach Risikoklasse kategorisiert und ins Risk Dashboard eingespielt.' },
      { num: '03', text: 'Legal Team reviewed High-Risk Findings und entscheidet über Eskalationsbedarf.' },
      { num: '04', text: 'Regelmäßige Stichproben-Reviews sichern die Klassifikationsqualität über die Zeit.' },
    ],
    humanReview: 'Alle High-Risk-Findings und Eskalationsempfehlungen werden zwingend manuell geprüft. Stichproben-Reviews verhindern schleichenden Drift der KI-Klassifikationsqualität.',
    whenYes: [
      'Große, standardisierbare Vertragsbestände (ca. 100+ aktive Verträge)',
      'Wiederkehrende Monitoring-Anforderungen (Laufzeiten, Klausel-Compliance, Regulierungsänderungen)',
      'Teams mit definierten Eskalationspfaden und Governance-Strukturen',
    ],
    whenNo: [
      'Kleine Teams ohne strukturierten Review-Prozess und definierte Verantwortlichkeiten',
      'Hochgradig individualisierte Einzelverträge ohne Standardstruktur',
    ],
    collection: { href: '/collections/inhouse-stack', label: 'Inhouse Stack' },
    toolsHref:  null,
  },
  {
    id:      'juristische-recherche',
    num:     '04',
    persona: 'Anwälte · Steuerberater · Juristen',
    title:   'Juristische Recherche',
    lead:    'Fundierte Hintergrundrecherchen, Gutachten-Vorarbeiten und strukturierte Briefings — mit konsequenter Primärquellenverifikation.',
    stack: {
      model: {
        label:   'Modell-Layer',
        primary: 'Claude Sonnet (extended)',
        note:    'Synthese, Strukturierung, Analyse, Gliederungsentwicklung',
      },
      tools: {
        label:   'Tool-Layer',
        primary: 'Perplexity Pro · Beck-Online',
        note:    'KI-gestützte Erstrecherche kombiniert mit juristischer Primärquellen-DB',
      },
      review: {
        label:   'Review-Layer',
        primary: 'Quellenverifikation durch Bearbeiter',
        note:    'Alle zitierten Quellen manuell geprüft, inhaltlicher Review durch Fachperson',
      },
    },
    steps: [
      { num: '01', text: 'Perplexity Pro für strukturierten Rechercheeinstieg: aktuelle Quellen, Überblick, Lückenidentifikation.' },
      { num: '02', text: 'Modell strukturiert die Erkenntnisse, analysiert Widersprüche, entwickelt Gliederungsvorschlag.' },
      { num: '03', text: 'Fachdatenbank für Primärquellenverifikation — kein KI-Output ersetzt die Primärquelle.' },
      { num: '04', text: 'Bearbeiter prüft alle Quellen, ergänzt eigene Einschätzung, gibt Briefing frei.' },
    ],
    humanReview: 'Jede zitierte Quelle wird manuell verifiziert. Struktur und Rechercheeinstieg kommen vom Modell — die rechtliche Einordnung, Gewichtung und finale Einschätzung liegen beim Berufsträger.',
    whenYes: [
      'Einstieg in neue Rechtsfragen oder unbekannte Rechtsgebiete',
      'Strukturierung größerer Recherchen mit vielen Teilfragen',
      'Briefing-Vorbereitung für Mandantengespräche und Besprechungen',
    ],
    whenNo: [
      'Wenn Primärquellen-Genauigkeit sofort und ohne Toleranz entscheidend ist',
      'Wenn die Fachkenntnis für einen kritischen Review des Modell-Outputs fehlt',
    ],
    collection: null,
    toolsHref:  '/tools',
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function StackLayer({ entry }: { entry: StackEntry }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
      <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
        {entry.label}
      </p>
      <p className="text-sm font-semibold text-[#111827] leading-snug mb-1.5">
        {entry.primary}
      </p>
      <p className="text-xs text-gray-500 leading-relaxed">
        {entry.note}
      </p>
    </div>
  )
}

function SetupBlueprint({ setup }: { setup: Setup }) {
  return (
    <article className="border border-gray-100 rounded-2xl overflow-hidden">

      {/* ── Header ── */}
      <div className="bg-white px-6 sm:px-8 pt-7 pb-6 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-gray-300">{setup.num}</span>
            <span className="text-[9px] font-semibold text-gray-400 bg-gray-50 border border-gray-100 rounded px-2 py-0.5 uppercase tracking-wide">
              {setup.persona}
            </span>
          </div>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl text-[#111827] tracking-tight mb-3">
          {setup.title}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
          {setup.lead}
        </p>
      </div>

      <div className="px-6 sm:px-8 py-6 space-y-6">

        {/* ── Stack Architecture ── */}
        <div>
          <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Stack-Architektur
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StackLayer entry={setup.stack.model} />
            <StackLayer entry={setup.stack.tools} />
            <StackLayer entry={setup.stack.review} />
          </div>
        </div>

        {/* ── Working Logic ── */}
        <div>
          <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Arbeitslogik
          </p>
          <ol className="space-y-2.5">
            {setup.steps.map(step => (
              <li key={step.num} className="flex gap-4">
                <span className="font-mono text-xs text-gray-300 flex-shrink-0 pt-0.5 w-4">
                  {step.num}
                </span>
                <p className="text-sm text-gray-600 leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* ── Human Review ── */}
        <div className="flex gap-3 bg-[#111827]/[0.03] border border-[#111827]/[0.07] rounded-xl px-5 py-4">
          <ShieldCheck className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
              Human Review Layer
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {setup.humanReview}
            </p>
          </div>
        </div>

        {/* ── When yes / When not ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-widest mb-2.5">
              Geeignet wenn
            </p>
            <ul className="space-y-2">
              {setup.whenYes.map((item, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-600 leading-relaxed">
                  <span className="text-gray-300 flex-shrink-0 mt-0.5">+</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
              Weniger geeignet wenn
            </p>
            <ul className="space-y-2">
              {setup.whenNo.map((item, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-500 leading-relaxed">
                  <span className="text-gray-300 flex-shrink-0 mt-0.5">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Related ── */}
        {(setup.collection || setup.toolsHref) && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mr-1">
              Passend dazu:
            </p>
            {setup.collection && (
              <Link
                href={setup.collection.href}
                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[#111827] border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-1.5 transition-colors"
              >
                {setup.collection.label}
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
            {setup.toolsHref && (
              <Link
                href={setup.toolsHref}
                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[#111827] border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-1.5 transition-colors"
              >
                Tools entdecken
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SetupsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">

      {/* ─── Hero ─── */}
      <section className="pt-14 pb-10 max-w-3xl">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          LexLab Working Setups
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-[#111827] leading-tight tracking-tight mb-5">
          Arbeitsarchitekturen<br className="hidden sm:block" /> für professionelle Teams.
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">
          Einzelne Tools sind Bausteine. Wie sie zu einer vollständigen Arbeitsumgebung zusammenspielen — mit Modellen, Quellen, Review-Schichten und klaren Verantwortungen — das zeigen LexLab Working Setups.
        </p>
      </section>

      {/* ─── Module thesis ─── */}
      <section className="max-w-3xl mb-12">
        <div className="border-t border-gray-100 pt-8 grid sm:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-[#111827] mb-1.5">Kein Tool-Hype</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Jedes Setup beginnt mit dem Problem — nicht mit dem Tool. Technologie folgt dem Anwendungsfall.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#111827] mb-1.5">Vollständige Architektur</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Modell, Tools, Quellen und Review-Layer gehören zusammen. Setups zeigen, wie das in der Praxis aussieht.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#111827] mb-1.5">Klare Grenzen</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Jedes Setup benennt explizit, wann es passt — und wann nicht. Keine Lösung für jeden Kontext.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Setup blueprints ─── */}
      <section className="max-w-3xl mb-16 space-y-6">
        {SETUPS.map(setup => (
          <SetupBlueprint key={setup.id} setup={setup} />
        ))}
      </section>

      {/* ─── Methodology note ─── */}
      <section className="max-w-3xl mb-16">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 sm:p-8">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Einordnung</p>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            LexLab Working Setups beschreiben praxisnahe Arbeitsarchitekturen — keine vollständige technische Spezifikation und keine universellen Blaupausen. Jedes Setup ist ein Orientierungsrahmen: Was typischerweise gut funktioniert, welche Verantwortungen explizit bleiben müssen und wo die sinnvollen Grenzen liegen.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Die Wahl der richtigen Modelle und Tools hängt von Kanzleigröße, Datenschutzanforderungen, vorhandener IT-Infrastruktur und spezifischen Compliance-Anforderungen ab. Für detaillierte Evaluierungen: <Link href="/tools/finder" className="text-[#111827] font-medium hover:underline">Tool Finder starten</Link>.
          </p>
        </div>
      </section>

      {/* ─── Bottom CTAs ─── */}
      <section className="border-t border-gray-100 pt-8 pb-16 max-w-3xl">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Weiter entdecken</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/collections"
            className="flex items-center justify-between gap-2 bg-white border border-gray-100 hover:border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 hover:text-[#111827] transition-all group"
          >
            <span className="font-medium">Kuratierte Shortlists</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#111827] flex-shrink-0 transition-colors" />
          </Link>
          <Link
            href="/workflows"
            className="flex items-center justify-between gap-2 bg-white border border-gray-100 hover:border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 hover:text-[#111827] transition-all group"
          >
            <span className="font-medium">Workflow-Guides</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#111827] flex-shrink-0 transition-colors" />
          </Link>
          <Link
            href="/method"
            className="flex items-center justify-between gap-2 bg-white border border-gray-100 hover:border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 hover:text-[#111827] transition-all group"
          >
            <span className="font-medium">LexLab Method</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#111827] flex-shrink-0 transition-colors" />
          </Link>
        </div>
      </section>

    </div>
  )
}
