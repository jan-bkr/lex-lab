// ─── Legal Workflow Intelligence — Blueprint Config ───────────────────────────
// Static blueprint data for all Workflow Blueprints.
// Blueprints are always visible, independent of DB workflow records.
// DB workflows (published) are additive.

export type StepType =
  | 'retrieval'
  | 'assistive'
  | 'drafting'
  | 'review_gate'
  | 'human_approval'
  | 'source_check'
  | 'handover'

export type MaturityLevel = 'blueprint' | 'praxisnah' | 'research-led'

export interface BlueprintStep {
  id: string
  type: StepType
  title: string
  description: string
  tool?: string
  duration?: string
}

export interface BlueprintTool {
  name: string
  role: string
  optional?: boolean
}

export interface WorkflowBlueprint {
  slug: string
  title: string
  subtitle: string
  categoryLabel: string
  maturity: MaturityLevel
  rechtsgebiet: string[]
  readingTime: number
  audience: string[]
  problem: string
  goal: string
  inputs: string[]
  tools: BlueprintTool[]
  steps: BlueprintStep[]
  humanReviewGates: string[]
  output: string
  risks: string[]
  datenschutzNote: string
  dachRelevance: 'hoch' | 'mittel' | 'niedrig'
  relatedCollectionSlug?: string
}

// ─── DB row shape (used by listing + detail server pages) ─────────────────────
export interface DbWorkflowRow {
  id: string
  title: string
  slug: string
  rechtsgebiet: string[] | null
  reading_time: number | null
  excerpt: string | null
  created_at: string
}

// ─── Maturity display config ───────────────────────────────────────────────────
export const MATURITY_CONFIG: Record<MaturityLevel, { label: string; cls: string }> = {
  'praxisnah': {
    label: 'Praxisnah',
    cls: 'text-emerald-700 bg-emerald-50 border border-emerald-200',
  },
  'blueprint': {
    label: 'Blueprint',
    cls: 'text-slate-600 bg-slate-50 border border-slate-200',
  },
  'research-led': {
    label: 'Research-led',
    cls: 'text-blue-700 bg-blue-50 border border-blue-200',
  },
}

// ─── Step type display config ──────────────────────────────────────────────────
export const STEP_TYPE_CONFIG: Record<StepType, {
  label: string
  dotCls: string
  badgeCls: string
  cardCls: string
  numBg: string
  numText: string
  numRing: string
}> = {
  retrieval: {
    label: 'Retrieval',
    dotCls: 'bg-blue-400',
    badgeCls: 'text-blue-700 bg-blue-50',
    cardCls: 'border-gray-100',
    numBg: 'bg-blue-50',
    numText: 'text-blue-700',
    numRing: 'ring-blue-200',
  },
  assistive: {
    label: 'Assistiv',
    dotCls: 'bg-slate-400',
    badgeCls: 'text-slate-600 bg-slate-50',
    cardCls: 'border-gray-100',
    numBg: 'bg-slate-50',
    numText: 'text-slate-600',
    numRing: 'ring-slate-200',
  },
  drafting: {
    label: 'Entwurf',
    dotCls: 'bg-violet-400',
    badgeCls: 'text-violet-700 bg-violet-50',
    cardCls: 'border-gray-100',
    numBg: 'bg-violet-50',
    numText: 'text-violet-700',
    numRing: 'ring-violet-200',
  },
  review_gate: {
    label: 'Review Gate',
    dotCls: 'bg-amber-400',
    badgeCls: 'text-amber-700 bg-amber-50',
    cardCls: 'border-amber-200 bg-amber-50/30',
    numBg: 'bg-amber-50',
    numText: 'text-amber-700',
    numRing: 'ring-amber-300',
  },
  human_approval: {
    label: 'Freigabe',
    dotCls: 'bg-gray-800',
    badgeCls: 'text-gray-100 bg-gray-800',
    cardCls: 'border-gray-800/20 bg-gray-900/[0.03]',
    numBg: 'bg-gray-900',
    numText: 'text-white',
    numRing: 'ring-gray-700',
  },
  source_check: {
    label: 'Quellencheck',
    dotCls: 'bg-sky-400',
    badgeCls: 'text-sky-700 bg-sky-50',
    cardCls: 'border-gray-100',
    numBg: 'bg-sky-50',
    numText: 'text-sky-700',
    numRing: 'ring-sky-200',
  },
  handover: {
    label: 'Übergabe',
    dotCls: 'bg-gray-300',
    badgeCls: 'text-gray-500 bg-gray-100',
    cardCls: 'border-gray-100',
    numBg: 'bg-gray-100',
    numText: 'text-gray-500',
    numRing: 'ring-gray-200',
  },
}

// ─── Blueprint Data ────────────────────────────────────────────────────────────

export const WORKFLOW_BLUEPRINTS: WorkflowBlueprint[] = [
  {
    slug: 'ma-due-diligence-ki',
    title: 'M&A Due Diligence mit KI',
    subtitle: 'Vertragsprüfung und Red-Flag-Analyse',
    categoryLabel: 'Due Diligence',
    maturity: 'praxisnah',
    rechtsgebiet: ['M&A'],
    readingTime: 12,
    audience: ['Anwalt', 'Inhouse-Counsel'],
    problem:
      'DD-Prozesse binden unverhältnismäßig viele Personalstunden für strukturierte Erstanalyse — Zeit, die in fachliche Urteilsbildung und Verhandlungsstrategie fließen sollte.',
    goal:
      'KI-gestützte Erstsichtung und Klausel-Extraktion reduziert die manuelle Dokumentenarbeit. Human-in-the-loop bleibt für Bewertung, Priorisierung und Freigabe zentral.',
    inputs: [
      'Kaufvertragsentwurf (SPA)',
      'NDA / Geheimhaltungsvereinbarungen',
      'Garantiekatalog',
      'Ggf. Unternehmensunterlagen (Handelsregister, Jahresabschluss)',
    ],
    tools: [
      { name: 'Claude', role: 'Klausel-Extraktion, Red-Flag-Analyse, Report-Entwurf' },
      { name: 'ChatPDF / Humata', role: 'Dokumentensichtung bei großen Dateien', optional: true },
      { name: 'Perplexity', role: 'Hintergrundrecherche zu Gegenparteien', optional: true },
    ],
    steps: [
      {
        id: '01',
        type: 'retrieval',
        title: 'Dokumentensichtung & Klassifikation',
        description:
          'Eingehende Unterlagen werden nach Dokumententyp, Länge und Due-Diligence-Relevanz klassifiziert. KI analysiert Struktur und priorisiert die Bearbeitungsreihenfolge.',
        tool: 'Claude / ChatPDF',
        duration: '5–10 min',
      },
      {
        id: '02',
        type: 'retrieval',
        title: 'Klausel-Extraktion',
        description:
          'Relevante Klauseln zu Haftung, Gewährleistung, Change of Control, Wettbewerbsverboten, MAC und Closing Conditions werden systematisch identifiziert und extrahiert.',
        tool: 'Claude',
        duration: '10–20 min',
      },
      {
        id: '03',
        type: 'assistive',
        title: 'Red-Flag-Analyse',
        description:
          'KI bewertet extrahierte Klauseln gegen etablierte M&A-Red-Flag-Muster: ungewöhnliche Haftungsbeschränkungen, einseitige Garantieregelungen, problematische Change-of-Control-Klauseln.',
        tool: 'Claude',
        duration: '15–25 min',
      },
      {
        id: '04',
        type: 'review_gate',
        title: 'Fachliche Prüfung durch Anwalt',
        description:
          'Anwalt oder Inhouse-Counsel prüft KI-Ergebnisse: Fehlklassifikationen korrigieren, Red Flags gewichten und priorisieren, mandatsspezifischen Kontext einbringen.',
        duration: '30–60 min',
      },
      {
        id: '05',
        type: 'drafting',
        title: 'DD-Report generieren',
        description:
          'KI erstellt strukturierten Berichtsentwurf: Executive Summary, Klauselmatrix, priorisierte Red Flags, offene Punkte für die Verhandlung. Anwalt passt Tenor und fachliche Einschätzungen an.',
        tool: 'Claude',
        duration: '15–20 min',
      },
      {
        id: '06',
        type: 'human_approval',
        title: 'Freigabe & Übergabe',
        description:
          'Mandatsverantwortlicher prüft den finalen Report, übernimmt fachliche Verantwortung und gibt das Dokument an Mandant oder Verhandlungsteam weiter.',
        duration: '15–30 min',
      },
    ],
    humanReviewGates: [
      'Klauselbewertung nach KI-Analyse (Schritt 4) — vor der Report-Erstellung',
      'Freigabe des finalen Reports (Schritt 6) — Fachverantwortung verbleibt beim Anwalt',
    ],
    output:
      'Strukturierter DD-Report: Executive Summary, Klauselmatrix, priorisierte Red Flags mit Handlungsempfehlungen.',
    risks: [
      'KI übersieht kontextuelle Risiken ohne vollständige Dokumentenlage',
      'Red-Flag-Pattern ohne kanzleispezifische Anpassung ggf. zu generisch',
      'Kein Ersatz für strukturierte Legal Opinion oder vollständige anwaltliche Prüfung',
    ],
    datenschutzNote:
      'Vertragsdaten sind hochsensible Mandantendaten. KI-Dienste nur nach geprüfter Auftragsverarbeitungsvereinbarung (AVV). Für besonders sensitive Transaktionen: Enterprise-Vereinbarungen oder On-Premise-Modelle prüfen.',
    dachRelevance: 'hoch',
    relatedCollectionSlug: 'ma-due-diligence',
  },

  {
    slug: 'gmbh-gruendung-ki',
    title: 'GmbH-Gründung: KI-gestützte Dokumentation',
    subtitle: 'Gesellschaftsrechtliche Gründungsdokumentation',
    categoryLabel: 'Gesellschaftsrecht',
    maturity: 'blueprint',
    rechtsgebiet: ['Gesellschaftsrecht'],
    readingTime: 14,
    audience: ['Anwalt', 'Steuerberater'],
    problem:
      'Standard-Gründungsdokumente sind repetitiv und strukturiert — dennoch bindet die Erstellung unverhältnismäßig Kapazität, die besser in die fachliche Gestaltungsberatung fließen sollte.',
    goal:
      'KI-gestützte Erstellung von Gesellschaftsvertrag, Gründungsprotokoll und Registeranmeldung auf Basis strukturierter Mandantenbriefings — mit anwaltlicher Qualitätskontrolle in jedem kritischen Schritt.',
    inputs: [
      'Mandantenbriefing (Gesellschafter, Stammkapital, Unternehmensgegenstand, Sitz)',
      'Ggf. kanzleieigene Musterverträge',
      'Ggf. bestehende Gesellschaftervereinbarungen',
    ],
    tools: [
      { name: 'Claude', role: 'Vertragsentwurf, Konsistenzprüfung, Formatierung' },
      { name: 'Kanzleieigene Vorlagen', role: 'Ausgangsbasis für KI-gestützte Anpassung' },
      { name: 'Perplexity', role: 'Recherche zu aktuellen Registeranforderungen', optional: true },
    ],
    steps: [
      {
        id: '01',
        type: 'retrieval',
        title: 'Gründungsbriefing strukturieren',
        description:
          'Strukturierter Prompt erfasst alle Gründungsparameter: Gesellschafter und Anteile, Stammkapital, Unternehmensgegenstand, Sitz, Geschäftsführung, gewünschte Sonderregelungen.',
        tool: 'Claude',
        duration: '10–15 min',
      },
      {
        id: '02',
        type: 'drafting',
        title: 'Gesellschaftsvertrag entwerfen',
        description:
          'KI generiert vollständigen Gesellschaftsvertragsentwurf auf Basis der strukturierten Parameter und der kanzleieigenen Musterstruktur. Klauseln werden nach Relevanz priorisiert.',
        tool: 'Claude',
        duration: '10–20 min',
      },
      {
        id: '03',
        type: 'assistive',
        title: 'Konsistenzprüfung',
        description:
          'KI prüft den generierten Entwurf auf interne Konsistenz: Gesellschafteranteile, Stimmrechte, Geschäftsführungsbefugnisse, Gewinnverteilung — keine stillen Widersprüche.',
        tool: 'Claude',
        duration: '5–10 min',
      },
      {
        id: '04',
        type: 'review_gate',
        title: 'Anwaltliche Qualitätsprüfung',
        description:
          'Anwalt prüft Entwurf auf rechtliche Korrektheit, Mandantenwünsche, notarielle Formanforderungen und individuelle Gestaltungsspielräume (Vesting, Drag-along, Sonderrechte).',
        duration: '30–45 min',
      },
      {
        id: '05',
        type: 'drafting',
        title: 'Begleitdokumente erstellen',
        description:
          'KI erstellt Gründungsprotokoll, Gesellschafterliste und strukturiert die Unterlagen für die Registeranmeldung nach aktuellem Anforderungskatalog.',
        tool: 'Claude',
        duration: '10–15 min',
      },
      {
        id: '06',
        type: 'human_approval',
        title: 'Notartermin & Registeranmeldung',
        description:
          'Anwalt koordiniert Beurkundungsunterlagen, bereitet den Notartermin vor und verantwortet die Einreichung beim Handelsregister vollständig.',
        duration: '20–30 min',
      },
    ],
    humanReviewGates: [
      'Qualitätsprüfung des Gesellschaftsvertragsentwurfs (Schritt 4) — notarielle Formanforderungen prüfen',
      'Notarielle Vorbereitung und Registeranmeldung (Schritt 6) — Anwalt trägt volle Verantwortung',
    ],
    output:
      'Beurkundungsreifer Gesellschaftsvertragsentwurf, Gründungsprotokoll, strukturierte Registeranmeldungsunterlagen.',
    risks: [
      'KI-generierte Entwürfe erfüllen nicht automatisch notarielle Formanforderungen',
      'Individuelle Klauseln (Vesting, Drag-along, Sonderrechte) erfordern zwingend fachliche Prüfung',
      'Anwaltliche Haftung für Korrektheit verbleibt vollständig beim beauftragten Berufsträger',
    ],
    datenschutzNote:
      'Gesellschafterdaten und Stammkapitalstruktur sind personenbezogene und wirtschaftlich sensitive Daten. KI-Nutzung nur mit geprüfter AVV. Für mandatsrelevante Inhalte: Datenschutzfolgenabschätzung prüfen.',
    dachRelevance: 'hoch',
    relatedCollectionSlug: 'inhouse-stack',
  },

  {
    slug: 'steuerliche-betriebspruefung',
    title: 'Betriebsprüfung: KI-gestützte Vorbereitung',
    subtitle: 'Strukturierte Analyse und Argumentationsvorbereitung',
    categoryLabel: 'Steuerrecht',
    maturity: 'research-led',
    rechtsgebiet: ['Steuerrecht'],
    readingTime: 10,
    audience: ['Steuerberater', 'Inhouse-Counsel'],
    problem:
      'Betriebsprüfungen erfordern umfassende Aufarbeitung steuerlicher Sachverhalte — unter Zeitdruck, mit hoher Ergebnisrelevanz und in enger Abstimmung mit dem Mandanten.',
    goal:
      'KI-gestützte Analyse von Prüfungsfeldern, strukturierte Sachverhaltsaufbereitung und Vorbereitung belastbarer Argumentation — der Steuerberater behält fachliche Kontrolle in jedem Schritt.',
    inputs: [
      'BP-Ankündigungsschreiben',
      'Relevante Steuerbescheide (Prüfungsjahre)',
      'Bilanzen / GuV des Prüfungszeitraums',
      'Buchungsunterlagen und Belege',
    ],
    tools: [
      { name: 'Claude', role: 'Sachverhaltsanalyse, Argumentationsstruktur, Memo-Erstellung' },
      { name: 'Perplexity', role: 'Recherche zu aktueller Rechtsprechung und BMF-Schreiben' },
      { name: 'DATEV / StO', role: 'Mandantendaten und Buchführungsunterlagen' },
    ],
    steps: [
      {
        id: '01',
        type: 'retrieval',
        title: 'Prüfungsfelder identifizieren',
        description:
          'KI analysiert das Ankündigungsschreiben und identifiziert systematisch alle angekündigten Prüfungsfelder, Steuerjahre, Buchungskreise und besonderen Prüfungsschwerpunkte.',
        tool: 'Claude',
        duration: '10–15 min',
      },
      {
        id: '02',
        type: 'source_check',
        title: 'Rechtsprechungs- und BMF-Recherche',
        description:
          'Für jeden Prüfungspunkt: Recherche zu aktueller Rechtsprechung (BFH, FG), einschlägigen BMF-Schreiben, OFD-Verfügungen und Kommentarliteratur.',
        tool: 'Perplexity',
        duration: '20–40 min',
      },
      {
        id: '03',
        type: 'assistive',
        title: 'Sachverhalt und Argumentation strukturieren',
        description:
          'KI strukturiert die Verteidigungsposition zu jedem Prüfungsfeld: Sachverhalt, einschlägige Rechtsgrundlagen, günstige Rechtsprechung, mögliche Schwachstellen der Argumentation.',
        tool: 'Claude',
        duration: '20–30 min',
      },
      {
        id: '04',
        type: 'review_gate',
        title: 'Fachliche Prüfung und Ergänzung',
        description:
          'Steuerberater prüft KI-Analyse, ergänzt mandatsspezifisches Wissen, bewertet Prozessrisiken realistisch und legt die Verhandlungsstrategie fest.',
        duration: '45–90 min',
      },
      {
        id: '05',
        type: 'drafting',
        title: 'Argumentationsmemo und Unterlagen aufbereiten',
        description:
          'KI erstellt strukturiertes Argumentationsmemo, Checkliste der bereitzustellenden Unterlagen und Gesprächsleitfaden für die Besprechung mit dem Betriebsprüfer.',
        tool: 'Claude',
        duration: '15–20 min',
      },
      {
        id: '06',
        type: 'human_approval',
        title: 'Prüfungsbegleitung und Abschluss',
        description:
          'Steuerberater führt Gespräche mit dem Betriebsprüfer, kommentiert Feststellungen und verantwortet die abschließende Stellungnahme. KI-Memos sind Arbeitshilfe, nicht Ersatz für das Fachurteil.',
        duration: 'Individuell',
      },
    ],
    humanReviewGates: [
      'Fachliche Prüfung jedes Prüfungsfelds und Bewertung der Verteidigungsposition (Schritt 4)',
      'Freigabe des Argumentationsmemos und aller mandantenrelevanten Unterlagen (nach Schritt 5)',
      'Gesamtverantwortung für Verhandlungsstrategie und Prüfungsbegleitung (Schritt 6)',
    ],
    output:
      'Argumentationsmemo pro Prüfungsfeld, Unterlagencheckliste, Gesprächsleitfaden für das Betriebsprüfungsgespräch.',
    risks: [
      'KI-Rechtsprechungsrecherche kann veraltete oder periphere Urteile einbeziehen — immer verifizieren',
      'Mandatsspezifische Besonderheiten und interne Belege kennt nur der Steuerberater',
      'Kein Ersatz für fundierte steuerrechtliche Fachprüfung — Ergebnisse sind Arbeitshilfen',
    ],
    datenschutzNote:
      'Buchungsunterlagen und Steuerdaten sind streng vertraulich. KI-Dienste nicht für Rohdaten aus Mandantenbuchhaltung nutzen — nur für anonymisierte oder strukturierte Sachverhaltsdarstellungen. DATEV-Daten bleiben im gesicherten Mandantenumfeld.',
    dachRelevance: 'hoch',
    relatedCollectionSlug: 'steuerrecht-essentials',
  },
]
