import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, AlertTriangle, Building2 } from 'lucide-react'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'KI-Setups für die Rechtspraxis',
  description: 'Fünf kuratierte Real-World-Setups für juristische Teams: Claude Team, ergänzende Tools, Connector-Logik und klare menschliche Prüfpflichten — für Steuerrecht, M&A, Inhouse und mehr.',
  openGraph: {
    title: 'KI-Setups für die Rechtspraxis — LexLab',
    description: 'Fünf kuratierte Setups für den Kanzlei- und Inhouse-Alltag: von Steuerrecht bis Due Diligence.',
  },
  alternates: { canonical: 'https://www.lex-lab.de/setups' },
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface SetupComponent {
  label: string
  role: string
  isCore?: boolean
}

interface Setup {
  id: string
  audience: string
  audienceCls: string
  complexity: 'Professionell' | 'Fortgeschritten'
  complexityCls: string
  title: string
  subtitle: string
  problem: string
  claudeRole: string
  components: SetupComponent[]
  humanReview: string[]
  limitations: string
  enterpriseNote: string
  relatedHref: string
  relatedLabel: string
}

// ─── Setup data ───────────────────────────────────────────────────────────────

const SETUPS: Setup[] = [
  {
    id: 'steuerrecht',
    audience: 'Für Steuerberater',
    audienceCls: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    complexity: 'Professionell',
    complexityCls: 'bg-blue-50 text-blue-600 border-blue-100',
    title: 'Steuerrecht-Basis-Setup',
    subtitle: 'Strukturierte Recherche und Mandantenmemos für kleine bis mittlere Steuerberatungspraxen',
    problem:
      'Umfangreiche normative Recherche, regelmäßige Mandantenmemos und steuerfachliche Analysen — mit begrenztem Team und konstantem Qualitätsanspruch. Der Einsatz spezialisierter Legal-AI-Software ist für viele Praxen unverhältnismäßig aufwändig.',
    claudeRole:
      'Claude Team übernimmt Recherche-Synthese, strukturiert fachliche Inhalte und erstellt Entwürfe für Mandantenmemos. Über Projekte kann kanzleispezifisches Wissen dauerhaft bereitgestellt werden — interne Standards, Mandantenprofile, bevorzugte Formulierungen.',
    components: [
      { label: 'Claude Team (Projekte)', role: 'Memo-Entwürfe, Recherche-Synthese, Sachverhaltsanalyse', isCore: true },
      { label: 'Steuerrechtliche Fachdatenbank', role: 'beck-online, Jurion oder NWB als normative Grundlage' },
      { label: 'LexLab Prompt Builder', role: 'Strukturierte Prompt-Erzeugung für wiederkehrende Fallmuster' },
    ],
    humanReview: [
      'Alle steuerrechtlichen Einschätzungen und Mandantenratschläge',
      'Aktuelle Urteile und BMF-Schreiben müssen manuell verifiziert werden',
      'Ausgehende Mandantenschreiben vor Versand',
    ],
    limitations:
      'Claude verarbeitet keine Echtzeit-Datenbank-Updates. Aktuelle Verwaltungsanweisungen und Urteile müssen manuell eingebracht werden.',
    enterpriseNote:
      'Für Praxen mit mehr als 20 Beratern oder branchenspezifischen Workflows: Harvey, DATEV-KI-Integrationslösungen oder Taxdoo vergleichen.',
    relatedHref: '/collections/steuerrecht-essentials',
    relatedLabel: 'Steuerrecht-Essentials Collection',
  },
  {
    id: 'ma',
    audience: 'Für M&A-Teams',
    audienceCls: 'bg-purple-50 text-purple-700 border-purple-100',
    complexity: 'Fortgeschritten',
    complexityCls: 'bg-amber-50 text-amber-700 border-amber-100',
    title: 'M&A Due-Diligence-Setup',
    subtitle: 'Dokumentenanalyse und Risk-Flagging für Boutiquen ohne vollintegrierte DD-Software',
    problem:
      'Hohe Dokumentenmengen, enge Zeitfenster, Checklisten-getriebene Risikoanalyse — mit kleinem Team. Spezialisierte DD-Software ist teuer und für Boutiquen mit selektivem Deal-Flow oft überdimensioniert.',
    claudeRole:
      'Summarization komplexer Vertragswerke, Checklisten-Matching auf Basis interner Templates, strukturierter Output für Review-Meetings. Claude übernimmt kein eigenständiges rechtliches Urteil — das bleibt menschliche Aufgabe.',
    components: [
      { label: 'Claude Team', role: 'Dokumenten-Summarization, Checklisten-Matching, Strukturierter Review-Output', isCore: true },
      { label: 'Elektronischer Datenraum', role: 'Datasite, Intralinks oder iDeals für Datenhaltung und Zugangskontrolle' },
      { label: 'Interne DD-Checklisten', role: 'Als Projektkontext in Claude hochgeladen — ergibt konsistente Analysestruktur' },
    ],
    humanReview: [
      'Jede rechtliche Risikobewertung und Vertragsinterpretation',
      'Final Red Flag Report und Empfehlungen an den Mandanten',
      'Einschätzung zur Materialität von Auffälligkeiten',
    ],
    limitations:
      'Bei sehr hohen Dokumentenmengen stoßen Kontext-Limits an Grenzen. Kein nativ strukturiertes Bulk-Processing über hunderte Dokumente.',
    enterpriseNote:
      'Für volumetrische DD-Prozesse mit strukturiertem Dokument-Workflow: Luminance, Harvey oder Kira System mit tieferem Bulk-Processing.',
    relatedHref: '/collections/ma-due-diligence',
    relatedLabel: 'M&A Due Diligence Collection',
  },
  {
    id: 'inhouse',
    audience: 'Für Inhouse-Teams',
    audienceCls: 'bg-blue-50 text-blue-700 border-blue-100',
    complexity: 'Professionell',
    complexityCls: 'bg-blue-50 text-blue-600 border-blue-100',
    title: 'Inhouse Compact Stack',
    subtitle: 'Breite Aufgabenabdeckung für kleine Rechtsabteilungen mit großem Aufgabenspektrum',
    problem:
      'Kleines Inhouse-Team, breites Aufgabenfeld: Vertragsreview, NDA-Prüfungen, Policy-Drafting, interne Beratung, Regulierungs-Recherche — ohne eigene KI-Infrastruktur, mit hohem Konsistenzanspruch.',
    claudeRole:
      'Allrounder für juristische Alltagsaufgaben. Über Claude-Projekte kann unternehmensinternes Wissen dauerhaft bereitgestellt werden: Muster-Verträge, Compliance-Policies, interne Rechtsgrundsätze. Das reduziert Einarbeitungszeit und erhöht die Konsistenz der Ergebnisse.',
    components: [
      { label: 'Claude Team (Projekte)', role: 'Vertragsreview, Policy-Drafting, Memo-Erstellung mit dauerhaftem Unternehmenskontext', isCore: true },
      { label: 'Interne Wissensdatenbank', role: 'Notion, SharePoint oder Confluence — via MCP-Anbindung oder manuellen Upload als Kontext' },
      { label: 'LexLab Prompt Builder', role: 'Standardisierte Prompts für wiederkehrende Dokumententypen' },
    ],
    humanReview: [
      'Final sign-off auf alle ausgehenden Dokumente',
      'Vertragsschlüsse und bindende Zusagen',
      'Regulatorische Einschätzungen und Compliance-Entscheidungen',
    ],
    limitations:
      'MCP-Anbindungen an interne Systeme erfordern technische Einrichtung und IT-Freigabe. Ohne Anbindung muss Kontext manuell bereitgestellt werden.',
    enterpriseNote:
      'Für Rechtsabteilungen mit mehr als 5 Juristen oder komplexen Compliance-Anforderungen: Noxtua, Harvey for Enterprise oder Contract-Management-Systeme wie Ironclad oder Juro.',
    relatedHref: '/collections/inhouse-stack',
    relatedLabel: 'Inhouse Stack Collection',
  },
  {
    id: 'research',
    audience: 'Rechtsgebietübergreifend',
    audienceCls: 'bg-gray-100 text-gray-600 border-gray-200',
    complexity: 'Professionell',
    complexityCls: 'bg-blue-50 text-blue-600 border-blue-100',
    title: 'Research-first Setup',
    subtitle: 'Tiefgehende Analyse und Gutachtenerstellung — für analytisch arbeitende Juristen aller Rechtsgebiete',
    problem:
      'Umfangreiche juristische Recherche, Argumentationsaufbau, Gutachtenerstellung — oft auf mehreren Rechtsgebieten gleichzeitig. Klassische Fachdatenbanken liefern Quellen, aber wenig Synthese.',
    claudeRole:
      'Verbindet bereitgestellte Quellinhalte zu strukturierten Analysen, entwickelt Argumentationsketten und erstellt Gutachten-Entwürfe. Besonders stark, wenn Primärquellen als Kontext bereitgestellt werden — dann wird Claude zum präzisen Synthesewerkzeug statt zum halluzinierenden Ratgeber.',
    components: [
      { label: 'Claude Team', role: 'Synthese, Gutachten-Entwürfe, Argumentationsstrukturierung mit bereitgestellten Quellen', isCore: true },
      { label: 'Fachdatenbank', role: 'beck-online, juris, Legios oder WestLaw als normative Primärquelle' },
      { label: 'LexLab Prompt Builder', role: 'JURIST_PERSONA-gestützte Prompts für fachspezifische Qualität' },
    ],
    humanReview: [
      'Jede normative Einschätzung und Quellverifikation',
      'Finale Gutachten-Version vor Abgabe oder Weiterleitung',
      'Einschätzungen zur Akzeptanz in Spruchkörpern',
    ],
    limitations:
      'Claude generiert keine verifizierten Quellenverweise und kann Rechtsprechung nicht eigenständig abrufen. Jede normative Aussage braucht manuelle Prüfung.',
    enterpriseNote:
      'Für Literaturdatenbank-Auswertungen oder AI-gestützte Case-Prediction: Lexis+ AI, Casetext (Thomson Reuters) oder Linklaters Lexa.',
    relatedHref: '/tools/finder',
    relatedLabel: 'Personalisierte Tool-Empfehlung',
  },
  {
    id: 'privacy',
    audience: 'Datenschutz-sensitiv',
    audienceCls: 'bg-amber-50 text-amber-700 border-amber-100',
    complexity: 'Fortgeschritten',
    complexityCls: 'bg-amber-50 text-amber-700 border-amber-100',
    title: 'Privacy-Aware Stack',
    subtitle: 'KI-Nutzung mit hoher DSGVO-Sensibilität und anwaltlicher Verschwiegenheitspflicht',
    problem:
      'Juristische KI-Nutzung in Mandaten mit personenbezogenen Daten, Verschwiegenheitspflicht und erhöhten Compliance-Anforderungen. Nicht jeder Cloud-KI-Dienst ist für sensible Mandate geeignet.',
    claudeRole:
      'Claude Team (Anthropic) bietet einen Datenverarbeitungsvertrag (DPA) für die Team-Tier-Nutzung und verarbeitet Nutzer-Content nicht für Modell-Training. Das macht ihn für viele datenschutzrechtlich beurteilbare Szenarien einsetzbar — aber kein Ersatz für On-Premise-Systeme.',
    components: [
      { label: 'Claude Team (DPA vorhanden)', role: 'KI-Verarbeitung mit dokumentierbarer Datengrundlage für Team-Tier-Nutzer', isCore: true },
      { label: 'Anonymisierungsworkflow', role: 'Personenbezogene Daten vor Claude-Verarbeitung bereinigen — als Workflow-Schritt dokumentiert' },
      { label: 'KI-Nutzungsdokumentation', role: 'DSGVO-Compliance-Schritt: wer hat was wann verarbeitet?' },
    ],
    humanReview: [
      'Alles — besonders Einschätzungen zu personenbezogenen Daten',
      'Entscheidungen über Datenübermittlungen und Drittlandtransfers',
      'Einschätzungen zur DSGVO-Konformität des eigenen KI-Einsatzes',
    ],
    limitations:
      'Claude Team ist kein On-Premise-System. Für Mandate mit absoluter Datenisolierungsanforderung ist eine lokal betriebene Lösung notwendig.',
    enterpriseNote:
      'Für On-Premise-Anforderungen oder Großkanzlei-Compliance: BRYTER (deutsch, DSGVO-konform), Noxtua oder lokal betriebene Open-Source-Modelle als Hochsicherheitsvariante.',
    relatedHref: '/collections/datenschutzstark',
    relatedLabel: 'Datenschutzstark Collection',
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function ComplexityBadge({ label, cls }: { label: string; cls: string }) {
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-wider border rounded px-1.5 py-0.5 leading-none ${cls}`}>
      {label}
    </span>
  )
}

function AudienceBadge({ label, cls }: { label: string; cls: string }) {
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-wider border rounded px-1.5 py-0.5 leading-none ${cls}`}>
      {label}
    </span>
  )
}

function SetupCard({ setup, index }: { setup: Setup; index: number }) {
  return (
    <div id={setup.id} className="scroll-mt-20 bg-white border border-gray-100 rounded-2xl overflow-hidden mb-6">

      {/* Header */}
      <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <AudienceBadge label={setup.audience} cls={setup.audienceCls} />
          <ComplexityBadge label={setup.complexity} cls={setup.complexityCls} />
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl text-[#111827] tracking-tight mb-1">
              {setup.title}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">{setup.subtitle}</p>
          </div>
          <span className="font-mono text-2xl text-gray-100 flex-shrink-0 mt-0.5 hidden sm:block">
            0{index + 1}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 sm:px-8 py-6 space-y-6">

        {/* Problem */}
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Ausgangssituation</p>
          <p className="text-sm text-gray-600 leading-relaxed">{setup.problem}</p>
        </div>

        {/* Claude Role — dark block */}
        <div className="bg-[#111827] rounded-xl p-5">
          <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-2">Claude Team — Rolle im Setup</p>
          <p className="text-sm text-white/80 leading-relaxed">{setup.claudeRole}</p>
        </div>

        {/* Components + Human Review — two columns on desktop */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Komponenten</p>
            <div className="space-y-2.5">
              {setup.components.map((c) => (
                <div key={c.label} className="flex items-start gap-2.5">
                  <div className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 ${c.isCore ? 'bg-[#111827]' : 'bg-gray-300'}`} />
                  <div>
                    <p className={`text-xs font-semibold leading-tight ${c.isCore ? 'text-[#111827]' : 'text-gray-600'}`}>
                      {c.label}
                      {c.isCore && (
                        <span className="ml-1.5 text-[9px] font-semibold text-white bg-[#111827] rounded px-1 py-0.5 leading-none align-middle">
                          Kern
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 leading-snug mt-0.5">{c.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-gray-400" />
                Menschliche Prüfung
              </span>
            </p>
            <div className="space-y-2">
              {setup.humanReview.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="text-gray-300 text-xs flex-shrink-0 mt-0.5">—</span>
                  <p className="text-xs text-gray-600 leading-snug">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 sm:px-8 py-5 bg-gray-50 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500 leading-relaxed">{setup.limitations}</p>
            </div>
            <div className="flex items-start gap-2">
              <Building2 className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500 leading-relaxed">
                <span className="font-medium text-gray-600">Enterprise-Hinweis:</span>{' '}
                {setup.enterpriseNote}
              </p>
            </div>
          </div>
          <Link
            href={setup.relatedHref}
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#111827] border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-2 transition-colors flex-shrink-0 self-end sm:self-auto"
          >
            {setup.relatedLabel}
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SetupsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">

      {/* ─── Hero ─── */}
      <section className="pt-14 pb-12 max-w-3xl">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Praxis-Setups
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-[#111827] leading-tight tracking-tight mb-5">
          KI-Setups für die<br className="hidden sm:block" /> Rechtspraxis.
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">
          Keine Tool-Listen. Sondern echte Arbeitsarchitekturen: welche Rolle Claude Team übernimmt, welche ergänzenden Tools sinnvoll sind, wo Grenzen liegen — und wann ein größeres Enterprise-Setup die bessere Wahl ist.
        </p>
      </section>

      {/* ─── Anchor nav ─── */}
      <nav className="border-t border-b border-gray-100 py-3 mb-10 overflow-x-auto">
        <div className="flex items-center gap-6 text-sm text-gray-400 whitespace-nowrap">
          <a href="#steuerrecht" className="hover:text-[#111827] transition-colors">Steuerrecht</a>
          <span className="text-gray-200">·</span>
          <a href="#ma" className="hover:text-[#111827] transition-colors">M&A</a>
          <span className="text-gray-200">·</span>
          <a href="#inhouse" className="hover:text-[#111827] transition-colors">Inhouse</a>
          <span className="text-gray-200">·</span>
          <a href="#research" className="hover:text-[#111827] transition-colors">Research</a>
          <span className="text-gray-200">·</span>
          <a href="#privacy" className="hover:text-[#111827] transition-colors">Privacy-Aware</a>
        </div>
      </nav>

      {/* ─── Intro block ─── */}
      <section className="mb-10 max-w-3xl">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 sm:p-8">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Was ist ein Setup?</p>
          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <p className="text-xs font-semibold text-[#111827] mb-1">Keine Produktwerbung</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Setups zeigen, wie Werkzeuge in echten Arbeitsabläufen zusammenwirken — nicht welche Anbieter gerade Partner sind.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#111827] mb-1">Human in the Loop</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Jedes Setup benennt explizit, wo menschliche Prüfung unverzichtbar ist. KI entscheidet nicht — sie bereitet vor.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#111827] mb-1">Grenzen inklusive</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Jedes Setup nennt seine Grenzen und wann eine größere Enterprise-Lösung sinnvoller ist. Keine Overselling-Logik.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Setup cards ─── */}
      <section className="max-w-4xl mb-16">
        {SETUPS.map((setup, i) => (
          <SetupCard key={setup.id} setup={setup} index={i} />
        ))}
      </section>

      {/* ─── Footer CTA ─── */}
      <section className="border-t border-gray-100 pt-10 pb-16 max-w-3xl">
        <div className="mb-8">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Weiter entdecken</p>
          <h2 className="font-display text-2xl text-[#111827] tracking-tight mb-3">
            Tools, Prompts und Orientierung
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-lg">
            Die Setups auf dieser Seite sind Architektur-Orientierung. Für die konkrete Tool-Wahl, individuelle Empfehlungen und juristische Prompts — hier weitermachen.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <Link
            href="/tools/finder"
            className="group bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm rounded-xl px-5 py-4 transition-all"
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Finder</p>
            <p className="text-sm font-semibold text-[#111827] mb-1 group-hover:text-[#111827]">Persönliche Empfehlung</p>
            <p className="text-xs text-gray-500">Vier Fragen — ein passendes Tool.</p>
          </Link>
          <Link
            href="/collections"
            className="group bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm rounded-xl px-5 py-4 transition-all"
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Collections</p>
            <p className="text-sm font-semibold text-[#111827] mb-1">Kuratierte Shortlists</p>
            <p className="text-xs text-gray-500">Vorgefertigte Tool-Sets nach Anforderungsprofil.</p>
          </Link>
          <Link
            href="/prompts/builder"
            className="group bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm rounded-xl px-5 py-4 transition-all"
          >
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">✦ Prompt Builder</p>
            <p className="text-sm font-semibold text-[#111827] mb-1">Juristische Prompts</p>
            <p className="text-xs text-gray-500">JURIST_PERSONA-gestützt, sofort einsetzbar.</p>
          </Link>
        </div>
      </section>

    </div>
  )
}
