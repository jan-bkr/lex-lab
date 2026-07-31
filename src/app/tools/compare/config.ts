// ─── Compare configuration ────────────────────────────────────────────────────
// Self-contained: all editorial content + scores are in config.
// Tool page links are optional (slug only shown if tool is in LexLab directory).

export interface CompareScore {
  praxisreife: number  // 1–10
  datenschutz: number  // 1–10
  dach: number         // 1–10
  ux: number           // 1–10
  preis: number        // 1–10
  total: number        // 0–100 (LexLab Score formula)
}

export interface CompareTool {
  name: string
  slug?: string        // optional: link to LexLab tool page if it exists
  tagline: string
  origin: string       // e.g. "USA · SaaS" or "Deutschland · On-Premise / Cloud"
  pricing: 'Kostenlos' | 'Freemium' | 'Kostenpflichtig' | 'Enterprise'
  pricingDetail: string
  scores: CompareScore
  strengths: string[]
  weaknesses: string[]
}

export interface CompareConfig {
  pair: string                   // URL slug, e.g. "harvey-vs-luminance"
  title: string
  eyebrow: string
  intro: string                  // 1 sentence positioning
  context: string                // 2–3 sentences context
  toolA: CompareTool
  toolB: CompareTool
  whenA: string[]                // 3–4 bullets: when to choose A
  whenB: string[]                // 3–4 bullets: when to choose B
  verdict: string                // LexLab's 2–3 sentence assessment
  relatedCollections: Array<{ slug: string; label: string }>
  publishedAt: string            // ISO date string
}

// ─── Formula helper ───────────────────────────────────────────────────────────

export function calcScore(s: Omit<CompareScore, 'total'>): number {
  return Math.round((s.praxisreife * 35 + s.dach * 25 + s.datenschutz * 20 + s.ux * 10 + s.preis * 10) / 10)
}

// ─── Compare pairs ────────────────────────────────────────────────────────────

export const COMPARE_PAIRS: CompareConfig[] = [
  // ── 1. Harvey AI vs. Luminance ─────────────────────────────────────────────
  {
    pair: 'harvey-vs-luminance',
    title: 'Harvey AI vs. Luminance',
    eyebrow: 'M&A · Dokumentenprüfung',
    intro: 'Zwei spezialisierte KI-Tools für die Due Diligence — unterschiedliche Ansätze, unterschiedliche Stärken.',
    context: 'Harvey AI und Luminance sind die bekanntesten spezialisierten KI-Plattformen für M&A-Dokumentenprüfung. Harvey setzt auf generative KI (Large Language Models) für flexibles Dokumenten-Q&A und juristisches Reasoning. Luminance nutzt supervised Machine Learning für mustererkennendes Lesen großer Dokumentenmengen. Beide haben DACH-Kunden, unterscheiden sich aber grundlegend in Ansatz und Stärken.',
    toolA: {
      name: 'Harvey',
      slug: 'harvey-ai',
      origin: 'USA · Cloud (SaaS)',
      tagline: 'KI-Plattform für juristisches Reasoning und Dokumentenanalyse',
      pricing: 'Enterprise',
      pricingDetail: 'Enterprise-Pricing auf Anfrage · keine öffentliche Preisliste',
      scores: {
        praxisreife: 9,
        datenschutz: 8,
        dach: 7,
        ux: 9,
        preis: 3,
        total: calcScore({ praxisreife: 9, datenschutz: 8, dach: 7, ux: 9, preis: 3 }),
      },
      strengths: [
        'Generative Stärke bei komplexem juristischem Reasoning',
        'Flexibles Dokumenten-Q&A quer über Transaktionsdokumentation',
        'Wachsende DACH-Präsenz mit deutschen Sprachmodellen',
        'Breite Einsatzmöglichkeiten über Due Diligence hinaus',
      ],
      weaknesses: [
        'US-Unternehmen — Datenstandort und Vertragssetup konkret prüfen',
        'Enterprise-only: kein Einstieg für kleinere Kanzleien',
        'Weniger spezialisiert auf reinen NLP-Dokumentenvergleich',
      ],
    },
    toolB: {
      name: 'Luminance',
      slug: 'luminance',
      origin: 'UK · Cloud (SaaS)',
      tagline: 'KI-gestützte Dokumentenanalyse für Transaktionen und Vertragsreview',
      pricing: 'Enterprise',
      pricingDetail: 'Enterprise-Pricing auf Anfrage · sehr hohe Einstiegspreise',
      scores: {
        praxisreife: 9,
        datenschutz: 8,
        dach: 6,
        ux: 8,
        preis: 4,
        total: calcScore({ praxisreife: 9, datenschutz: 8, dach: 6, ux: 8, preis: 4 }),
      },
      strengths: [
        'Etabliertes NLP für mustererkennendes Lesen großer Dokumentenmengen',
        'Starke Due-Diligence-Automatisierung bei standardisierten Prozessen',
        'UK-Unternehmen — stärkere EU-Datenschutz-Nähe als US-Wettbewerber',
        'Bewährt bei größeren Transaktionsteams mit hohem Dokumentenvolumen',
      ],
      weaknesses: [
        'Sehr hohe Einstiegskosten — kaum für kleine Kanzleien geeignet',
        'Weniger flexibel bei generativen Aufgaben außerhalb des Review-Flows',
        'Komplexere UI gegenüber neueren generativen Tools',
      ],
    },
    whenA: [
      'Du brauchst generative KI-Fähigkeiten über reines Dokumenten-Review hinaus',
      'Dein Team stellt viele freie Fragen an Transaktionsdokumente',
      'Du suchst eine Plattform, die auch für andere juristische Aufgaben nutzbar ist',
      'Deutschsprachige Dokumentenarbeit ist ein Schwerpunkt',
    ],
    whenB: [
      'Du prüfst sehr große Dokumentenmengen (hunderte bis tausende Dateien)',
      'Der Fokus liegt auf strukturiertem NLP-Review mit Mustererkennung',
      'Du bevorzugst ein etabliertes Tool mit längerem Track Record',
      'UK/EU-Datenschutz-Nähe ist wichtiger als US-Alternativen',
    ],
    verdict: 'Für DACH-M&A-Teams mit dem Fokus auf generative Analysefähigkeiten und Flexibilität hat Harvey AI aktuell die Nase vorn. Luminance ist stärker bei sehr hohem Dokumentenvolumen und standardisierten Review-Prozessen. Beide sind Enterprise-only — kein Tool für kleinere Kanzleien ohne dediziertes KI-Budget.',
    relatedCollections: [
      { slug: 'ma-due-diligence', label: 'M&A Due Diligence Shortlist' },
      { slug: 'datenschutzstark', label: 'Datenschutzstarke Tools' },
    ],
    publishedAt: '2026-07-31',
  },

  // ── 2. Microsoft 365 Copilot vs. Harvey AI ──────────────────────────────────
  {
    pair: 'copilot-vs-harvey',
    title: 'Microsoft 365 Copilot vs. Harvey AI',
    eyebrow: 'Produktivitäts-KI · Juristischer KI-Assistent',
    intro: 'Horizontale Integration vs. vertikale Spezialisierung — zwei grundlegend verschiedene Ansätze für KI im Kanzleialltag.',
    context: 'Microsoft 365 Copilot integriert KI tief in die Office-Suite — Word, Excel, Outlook, Teams. Harvey AI ist eine dedizierte Plattform für juristische Arbeit. Diese beiden Tools konkurrieren in der Praxis nicht direkt, werden aber häufig als Alternativen diskutiert. Der Vergleich zeigt, wann welcher Ansatz der richtige ist.',
    toolA: {
      name: 'Microsoft 365 Copilot',
      origin: 'USA · Cloud (Microsoft Azure, EU-Standorte verfügbar)',
      tagline: 'KI-Assistent für die gesamte Microsoft 365 Produktfamilie',
      pricing: 'Kostenpflichtig',
      pricingDetail: 'ca. 30 €/Monat/User als M365-Add-on (bei Enterprise-Lizenz)',
      scores: {
        praxisreife: 7,
        datenschutz: 8,
        dach: 9,
        ux: 8,
        preis: 7,
        total: calcScore({ praxisreife: 7, datenschutz: 8, dach: 9, ux: 8, preis: 7 }),
      },
      strengths: [
        'Tief in Office integriert — Word, Excel, Outlook, Teams ohne Workflow-Wechsel',
        'EU-Datenspeicherung konfigurierbar — hohe Datenschutz-Compliance',
        'Beste DACH-Relevanz durch Microsoft-Infrastruktur und deutschen Support',
        'Sofort verfügbar für alle M365-Kanzleien ohne zusätzliche Einführungskosten',
      ],
      weaknesses: [
        'Kein tiefes juristisches Reasoning — kein Verständnis von Transaktionsstrukturen',
        'Generalist: stark für Produktivität, schwach für spezialisierte Rechtsaufgaben',
        'Qualität hängt stark von der eigenen Prompt-Kompetenz ab',
      ],
    },
    toolB: {
      name: 'Harvey',
      slug: 'harvey-ai',
      origin: 'USA · Cloud (SaaS)',
      tagline: 'KI-Plattform für juristisches Reasoning und Dokumentenanalyse',
      pricing: 'Enterprise',
      pricingDetail: 'Enterprise-Pricing auf Anfrage · keine öffentliche Preisliste',
      scores: {
        praxisreife: 9,
        datenschutz: 8,
        dach: 7,
        ux: 9,
        preis: 3,
        total: calcScore({ praxisreife: 9, datenschutz: 8, dach: 7, ux: 9, preis: 3 }),
      },
      strengths: [
        'Tiefes juristisches Reasoning für komplexe Transaktionsaufgaben',
        'Auf Rechtsfragen optimierte Prompts und Strukturen',
        'Deutlich höhere Qualität bei spezialisierten Rechtsaufgaben',
        'Wachsendes DACH-Netzwerk und deutsche Sprachunterstützung',
      ],
      weaknesses: [
        'Enterprise-only: nicht für kleine Kanzleien zugänglich',
        'Zusätzliche Plattform neben dem bestehenden M365-Stack',
        'Datenstandort und Vertragssetup müssen konkret geprüft werden',
      ],
    },
    whenA: [
      'Du arbeitest bereits mit M365 und willst KI ohne neuen Workflow einführen',
      'Deine Hauptaufgaben: E-Mail-Drafting, Meeting-Zusammenfassung, Dokumente bearbeiten',
      'Datenschutz und EU-Compliance sind zentrale Anforderungen',
      'Du suchst einen preisgünstigen Einstieg mit schnellem Rollout',
    ],
    whenB: [
      'Du bearbeitest komplexe Transaktionen und brauchst juristisches Reasoning',
      'Dokumentenprüfung und Vertragsanalyse sind Kernaufgaben deines Teams',
      'Deine Kanzlei ist groß genug für eine dedizierte KI-Plattform',
      'Spezialtiefe ist wichtiger als Produktivitäts-Integration',
    ],
    verdict: 'Diese Tools ersetzen sich nicht — sie ergänzen sich. Copilot ist die Produktivitätsschicht für den täglichen M365-Workflow; Harvey ist das Spezialtool für juristische Hochleistungsaufgaben. Viele führende DACH-Kanzleien werden mittelfristig beides nutzen. Für kleinere Kanzleien ohne Harvey-Budget ist Copilot der sinnvolle Einstieg.',
    relatedCollections: [
      { slug: 'inhouse-stack', label: 'Inhouse-Stack' },
      { slug: 'einsteiger-stack', label: 'Einsteiger-Stack' },
    ],
    publishedAt: '2026-07-31',
  },

  // ── 3. ChatGPT vs. Claude ───────────────────────────────────────────────────
  {
    pair: 'chatgpt-vs-claude',
    title: 'ChatGPT vs. Claude',
    eyebrow: 'KI-Assistenten für den Kanzleialltag',
    intro: 'Die zwei meistgenutzten KI-Assistenten im deutschen Rechtsmarkt — praktisch verglichen für juristische Arbeit.',
    context: 'ChatGPT (OpenAI) und Claude (Anthropic) sind die dominierenden generativen KI-Assistenten im Kanzleialltag. Beide sind ohne Spezialisierung auf Rechtsarbeit gebaut, werden aber täglich von Anwälten, Steuerberatern und Inhouse-Juristen eingesetzt. Für DACH-Kanzleien stellt sich die Frage: welches Tool für welche Aufgaben?',
    toolA: {
      name: 'ChatGPT',
      origin: 'USA · Cloud (OpenAI)',
      tagline: 'Generativer KI-Assistent von OpenAI — meistgenutztes KI-Tool weltweit',
      pricing: 'Freemium',
      pricingDetail: 'Kostenloser Einstieg (GPT-3.5) · ChatGPT Plus 20 USD/Monat (GPT-4o)',
      scores: {
        praxisreife: 7,
        datenschutz: 5,
        dach: 6,
        ux: 9,
        preis: 8,
        total: calcScore({ praxisreife: 7, datenschutz: 5, dach: 6, ux: 9, preis: 8 }),
      },
      strengths: [
        'Sehr poliertes, intuitives Interface — niedrigste Einstiegshürde',
        'Riesiges Plugin- und GPT-Ökosystem für spezielle Aufgaben',
        'Starke Code- und Datenanalysefähigkeiten (für Excel-Arbeit u.ä.)',
        'Schnellste Antwortzeiten bei GPT-4o',
      ],
      weaknesses: [
        'US-Unternehmen — Standardnutzung ohne EU-Verarbeitung; Datenschutz-Risiko bei sensiblen Daten',
        'Kann bei langen, komplexen Dokumenten an Kontextgrenzen stoßen',
        'Tendenz zu selbstsicheren, aber potenziell falschen juristischen Aussagen',
      ],
    },
    toolB: {
      name: 'Claude',
      origin: 'USA · Cloud (Anthropic)',
      tagline: 'KI-Assistent von Anthropic — bekannt für sorgfältiges Reasoning und langen Kontext',
      pricing: 'Freemium',
      pricingDetail: 'Kostenloser Einstieg · Claude Pro 20 USD/Monat · API-Zugang verfügbar',
      scores: {
        praxisreife: 7,
        datenschutz: 6,
        dach: 6,
        ux: 8,
        preis: 8,
        total: calcScore({ praxisreife: 7, datenschutz: 6, dach: 6, ux: 8, preis: 8 }),
      },
      strengths: [
        'Sehr langer Kontextfenster (200k Token) — ideal für lange Verträge und Dokumente',
        'Stärkeres nuanciertes Reasoning bei komplexen juristischen Sachverhalten',
        'Folgt präzisen, langen Anweisungen zuverlässiger als Wettbewerber',
        'Angemessene Unsicherheitskommunikation bei juristischen Grenzfragen',
      ],
      weaknesses: [
        'US-Unternehmen — ähnliche Datenschutz-Einschränkungen wie ChatGPT',
        'Kein Plugin-Ökosystem vergleichbar mit ChatGPT',
        'Langsamere Antwortzeiten bei langen Kontexten',
      ],
    },
    whenA: [
      'Schnelle, unkomplizierte Alltagsaufgaben: E-Mails, kurze Zusammenfassungen, einfache Recherchen',
      'Arbeit mit Excel-Daten oder Code (z.B. Steuerberechnungen, Datenauswertungen)',
      'Du willst das meistgenutzte Interface mit dem größten Support-Ökosystem',
      'Dein Team ist noch nicht KI-erfahren und braucht maximalen Bedienkomfort',
    ],
    whenB: [
      'Du analysierst lange Verträge oder Dokumente (Claude verarbeitet mehr Kontext)',
      'Du brauchst präzises, nuanciertes juristisches Reasoning mit guter Unsicherheitskommunikation',
      'Deine Aufgaben erfordern genaues Befolgen langer, komplexer Anweisungen',
      'Prompt Builder-Ergebnisse per API weiterverarbeiten — Claude ist das Backbone von LexLab',
    ],
    verdict: 'Für die meisten Kanzleiteams sind beide Tools sinnvoll — für verschiedene Aufgaben. ChatGPT ist die bessere Wahl für Produktivitätsaufgaben und schnelle Antworten; Claude ist das stärkere Tool für sorgfältige Analyse langer Dokumente und nuanciertes juristisches Reasoning. Wichtig für beide: keine sensiblen Mandantendaten ohne entsprechende Enterprise-Vereinbarungen verarbeiten.',
    relatedCollections: [
      { slug: 'einsteiger-stack', label: 'Einsteiger-Stack' },
      { slug: 'datenschutzstark', label: 'Datenschutzstarke Tools' },
    ],
    publishedAt: '2026-04-21',
  },

  // ── 4. DATEV KI vs. LexisNexis+ AI ─────────────────────────────────────────
  {
    pair: 'datev-vs-lexisnexis',
    title: 'DATEV KI vs. LexisNexis+ AI',
    eyebrow: 'Steuerrecht · Rechtsrecherche',
    intro: 'Zwei DACH-relevante Tools für Steuerberater und Rechtsanwälte — mit unterschiedlichen Schwerpunkten in Workflow und Recherche.',
    context: 'DATEV ist die dominierende Plattform für deutsche Steuerberatungskanzleien — die KI-Funktionen von DATEV sind tief in den bestehenden Workflow integriert. LexisNexis+ AI kombiniert eine der größten juristischen Datenbanken mit KI-gestützter Recherche und Zusammenfassungen. Beide sind DACH-relevant, aber für sehr unterschiedliche Arbeitsprofile.',
    toolA: {
      name: 'DATEV KI-Funktionen',
      origin: 'Deutschland · Cloud / On-Premise',
      tagline: 'KI-Assistenz tief in die führende deutsche Steuerberatungsplattform integriert',
      pricing: 'Kostenpflichtig',
      pricingDetail: 'DATEV-Mitgliedschaft erforderlich · Kosten je nach DATEV-Produktpaket',
      scores: {
        praxisreife: 8,
        datenschutz: 9,
        dach: 10,
        ux: 5,
        preis: 6,
        total: calcScore({ praxisreife: 8, datenschutz: 9, dach: 10, ux: 5, preis: 6 }),
      },
      strengths: [
        'Höchste DACH-Relevanz: speziell für deutschen Steuermarkt entwickelt',
        'Beste Datenschutz-Position im Markt: deutsches Unternehmen, DSGVO-nativ',
        'Tief in bestehende DATEV-Workflows integriert',
        'Verarbeitet DATEV-Mandantendaten direkt — kein Datenexport nötig',
      ],
      weaknesses: [
        'Nur für DATEV-Mitglieder zugänglich',
        'Traditionelle UI — kein modernes KI-Chat-Interface',
        'KI-Funktionen noch im Aufbau — nicht so ausgereift wie eigenständige KI-Tools',
      ],
    },
    toolB: {
      name: 'LexisNexis+ AI',
      origin: 'USA / Europa · Cloud (SaaS)',
      tagline: 'KI-Recherche auf einer der größten juristischen Datenbanken weltweit',
      pricing: 'Kostenpflichtig',
      pricingDetail: 'Enterprise-Abonnement · hohe Einstiegskosten · Preisliste auf Anfrage',
      scores: {
        praxisreife: 7,
        datenschutz: 7,
        dach: 8,
        ux: 6,
        preis: 4,
        total: calcScore({ praxisreife: 7, datenschutz: 7, dach: 8, ux: 6, preis: 4 }),
      },
      strengths: [
        'Zugriff auf sehr große deutsche und europäische Rechtsdatenbank (Rechtsprechung, Kommentare)',
        'KI-Zusammenfassungen und Recherche-Antworten direkt auf Juris-Inhalten',
        'Starke Abdeckung für Steuerrecht, Handelsrecht und allgemeine Rechtsfragen',
        'Etablierte Plattform mit langjährigem DACH-Marktauftritt',
      ],
      weaknesses: [
        'Sehr hohe Kosten — für kleine und mittlere Kanzleien oft nicht wirtschaftlich',
        'Traditionelle Recherche-UI mit KI-Overlay — kein nativer KI-first Ansatz',
        'Primär Recherche-Tool, kein operatives Workflow-Tool',
      ],
    },
    whenA: [
      'Du arbeitest in einer Steuerberatungskanzlei mit DATEV-Infrastruktur',
      'Mandantendaten und Steuerworkflow sollen direkt KI-unterstützt werden',
      'Höchste Datenschutzstandards sind nicht verhandelbar',
      'Integration in bestehende DATEV-Prozesse ist wichtiger als neues Interface',
    ],
    whenB: [
      'Du brauchst Zugang zu einem breiten Korpus an Rechtsprechung und Kommentarliteratur',
      'Deine Arbeit erfordert tiefe juristische Recherche über das Steuerrecht hinaus',
      'Du willst KI-Zusammenfassungen von Gerichtsurteilen und Gesetzesänderungen',
      'Deine Kanzlei hat das Budget für eine umfangreiche juristische Datenbank',
    ],
    verdict: 'Diese Tools lösen unterschiedliche Probleme. DATEV KI ist das richtige Tool für Steuerberatungskanzleien, die KI in ihren bestehenden DATEV-Workflow integrieren wollen — mit höchster DACH-Compliance. LexisNexis+ AI ist das richtige Tool für tiefe juristische Recherche auf einer breiten Datenbank. Eine Steuerberatungskanzlei mit Rechtsberatungsmandat kann durchaus beides benötigen.',
    relatedCollections: [
      { slug: 'steuerrecht-essentials', label: 'Steuerrecht-Essentials' },
      { slug: 'datenschutzstark', label: 'Datenschutzstarke Tools' },
    ],
    publishedAt: '2026-04-21',
  },

  // ── 5. Clio vs. Advoware ────────────────────────────────────────────────────
  {
    pair: 'clio-vs-advoware',
    title: 'Clio vs. Advoware',
    eyebrow: 'Kanzleiverwaltung · Practice Management',
    intro: 'Modernes Cloud-SaaS vs. deutsches Spezialsystem — zwei Philosophien für die Kanzleiverwaltung.',
    context: 'Bei der Wahl einer Kanzleiverwaltungssoftware stehen DACH-Kanzleien oft vor der Entscheidung: internationales, modernes Cloud-SaaS oder bewährte deutsche Spezialsoftware mit tiefer lokaler Integration. Clio (Kanada/USA) und Advoware (Deutschland) repräsentieren diese zwei Pole beispielhaft.',
    toolA: {
      name: 'Clio',
      origin: 'Kanada / USA · Cloud (SaaS)',
      tagline: 'Modernes Kanzleimanagementsystem — Matter-Management, Billing, Client Portal',
      pricing: 'Kostenpflichtig',
      pricingDetail: 'ab ca. 39–89 USD/Monat/User je nach Plan',
      scores: {
        praxisreife: 8,
        datenschutz: 7,
        dach: 5,
        ux: 8,
        preis: 6,
        total: calcScore({ praxisreife: 8, datenschutz: 7, dach: 5, ux: 8, preis: 6 }),
      },
      strengths: [
        'Sehr modernes, intuitives Interface — beste UX im Kanzleisoftware-Markt',
        'Client Portal für sichere Mandantenkommunikation',
        'Starkes Integrations-Ökosystem (Zapier, Microsoft 365, Zoom u.a.)',
        'Schnell einsatzbereit — minimaler Implementierungsaufwand',
      ],
      weaknesses: [
        'Begrenzte DACH-Lokalisierung: keine DATEV-Integration, kein beA-Anschluss',
        'Kanada/USA-Unternehmen — Datenschutz erfordert aktive Konfiguration',
        'Für deutsche Rechtspflege-Spezifika (BRAGO, Kostenrecht) weniger optimiert',
      ],
    },
    toolB: {
      name: 'Advoware',
      origin: 'Deutschland · On-Premise / Cloud',
      tagline: 'Bewährte Kanzleisoftware mit tiefer Integration in deutsche Rechtspflege',
      pricing: 'Kostenpflichtig',
      pricingDetail: 'Monatliche Lizenzgebühr on-Premise oder Cloud · Preise je nach Kanzleigröße',
      scores: {
        praxisreife: 7,
        datenschutz: 9,
        dach: 10,
        ux: 5,
        preis: 7,
        total: calcScore({ praxisreife: 7, datenschutz: 9, dach: 10, ux: 5, preis: 7 }),
      },
      strengths: [
        'Höchste DACH-Integration: DATEV, beA, deutsche Gerichtsanbindungen',
        'Deutsches Unternehmen — DSGVO-nativ, Datensouveränität gewährleistet',
        'Bewährt über Jahrzehnte in deutschen Kanzleien verschiedener Größen',
        'On-Premise-Option für höchste Datensicherheitsanforderungen',
      ],
      weaknesses: [
        'Traditionelle UI — deutlich weniger modern als Cloud-native Wettbewerber',
        'Weniger Integrationen mit modernen SaaS-Produkten',
        'Implementierung und Konfiguration aufwändiger als Cloud-SaaS-Alternativen',
      ],
    },
    whenA: [
      'Deine Kanzlei legt Wert auf moderne UX und ein reibungsloses Nutzungserlebnis',
      'Du arbeitest international oder mit internationalen Mandanten',
      'Integration mit modernen SaaS-Produkten (Zoom, Microsoft 365 u.a.) ist wichtig',
      'Schneller Rollout ohne lange Implementierungsphase ist ein Erfolgsfaktor',
    ],
    whenB: [
      'Deutsche Rechtspflege-Integration (beA, DATEV) ist ein Muss',
      'Datensouveränität und On-Premise-Option sind nicht verhandelbar',
      'Deine Kanzlei hat bestehende DATEV-Infrastruktur',
      'Du willst eine bewährte Lösung mit langem Track Record im deutschen Markt',
    ],
    verdict: 'Die Entscheidung hängt vor allem von der Kanzleikultur ab: Wer moderne UX und internationale Workflows priorisiert, ist mit Clio gut beraten. Wer deutsche Rechtspflege-Integration, DATEV-Anbindung und höchste Datensouveränität braucht, kommt an Advoware und ähnlichen deutschen Systemen kaum vorbei. Für rein digital aufgestellte neue Kanzleien ohne DATEV-Zwang ist Clio heute die attraktivere Option.',
    relatedCollections: [
      { slug: 'inhouse-stack', label: 'Inhouse-Stack' },
      { slug: 'einsteiger-stack', label: 'Einsteiger-Stack' },
    ],
    publishedAt: '2026-04-21',
  },

  // ── 6. Noxtua vs. Libra ───────────────────────────────────────────────────
  {
    pair: 'noxtua-vs-libra',
    title: 'Noxtua vs. Libra',
    eyebrow: 'DACH Legal AI · Recherche & Drafting',
    intro: 'Souveräne KI-Infrastruktur vs. besonders breiter DACH-Workspace — die zwei wichtigsten deutschen Plattformansätze im direkten Vergleich.',
    context: 'Noxtua und Libra gehören 2026 zu den prägenden Legal-AI-Anbietern im deutschen Markt. Noxtua differenziert sich über ein souveränes europäisches Gesamtsystem mit eigener Technologie und besonders strikter Vertraulichkeitsarchitektur. Libra verbindet einen ausgereiften All-in-one-Workspace mit deutschen Rechtsquellen, Fachverlagsinhalten und tiefen Office-Integrationen.',
    toolA: {
      name: 'Noxtua',
      slug: 'noxtua',
      origin: 'Deutschland · souveräne EU-Infrastruktur',
      tagline: 'Europäische Rechts-KI mit Kontrolle über Modell, Daten und Infrastruktur',
      pricing: 'Enterprise',
      pricingDetail: 'Preise auf Anfrage · Produkt- und Content-Setup individuell',
      scores: {
        praxisreife: 8,
        datenschutz: 10,
        dach: 10,
        ux: 8,
        preis: 5,
        total: calcScore({ praxisreife: 8, datenschutz: 10, dach: 10, ux: 8, preis: 5 }),
      },
      strengths: [
        'Souveräne europäische Infrastruktur ohne Abhängigkeit vom US CLOUD Act',
        'Explizit auf Berufsgeheimnis, BRAO und § 203 StGB ausgerichtet',
        'Nutzerdaten werden nach Anbieterangaben nicht zum Training verwendet',
        'Breite Funktionen für Recherche, Analyse und Drafting',
      ],
      weaknesses: [
        'Keine transparente öffentliche Preisliste',
        'Quellenabdeckung hängt vom konkreten Produkt- und Content-Setup ab',
        'Einführung und Einkauf sind stärker Enterprise-geprägt als Self-Service',
      ],
    },
    toolB: {
      name: 'Libra',
      slug: 'libra',
      origin: 'Deutschland · EWR-Cloud · Wolters Kluwer',
      tagline: 'All-in-one Legal AI mit deutschen Quellen und Office-Integrationen',
      pricing: 'Kostenpflichtig',
      pricingDetail: 'Kostenlos testbar · weitere Tarife und Content-Lizenzen nach Setup',
      scores: {
        praxisreife: 9,
        datenschutz: 9,
        dach: 10,
        ux: 9,
        preis: 7,
        total: calcScore({ praxisreife: 9, datenschutz: 9, dach: 10, ux: 9, preis: 7 }),
      },
      strengths: [
        'Breite deutsche Quellenbasis einschließlich Fachverlags- und Handelsregisterinhalten',
        'Word-, Outlook-, SharePoint- und Kleos-Integrationen',
        'Recherche, Review, Drafting und Massendokumentenanalyse in einem Workspace',
        'EWR-Hosting, ISO 27001 und auf Berufsverschwiegenheit ausgerichtetes Setup',
      ],
      weaknesses: [
        'Bestimmte Premium-Inhalte setzen zusätzliche Lizenzen voraus',
        'Kein vollständig souveräner Technologie-Stack wie bei Noxtua',
        'Funktionsbreite kann für einen einzelnen eng begrenzten Use Case überdimensioniert sein',
      ],
    },
    whenA: [
      'Souveräne Infrastruktur und Schutz vor Drittstaatenzugriff sind harte Anforderungen',
      'Deine Organisation verlangt maximale Kontrolle über Modell- und Datenverarbeitung',
      'Du willst vertrauliche Mandatsarbeit in einer europäischen End-to-End-Architektur abbilden',
      'Das konkrete Quellen- und Produktsetup kann im Enterprise-Einkauf individuell geklärt werden',
    ],
    whenB: [
      'Du brauchst einen möglichst vollständigen Workspace für Recherche, Review und Drafting',
      'Deutsche Fachinhalte und überprüfbare Quellen sind ein zentraler Kaufgrund',
      'Word, Outlook, SharePoint oder Kleos sollen ohne Medienbruch eingebunden sein',
      'Ein schnellerer Test- und Einstiegspfad ist wichtiger als vollständige Technologiesouveränität',
    ],
    verdict: 'Libra erzielt im allgemeinen DACH-Score den höheren Wert, weil Quellenbreite, Integrationen und Bedienbarkeit besonders stark zusammenspielen. Noxtua ist dennoch die klarere Wahl, wenn Souveränität, Berufsgeheimnis und Kontrolle über den vollständigen Technologie-Stack Vorrang haben. Für beck-online-zentrierte Recherche sollte zusätzlich Beck-Noxtua separat geprüft werden.',
    relatedCollections: [
      { slug: 'datenschutzstark', label: 'Datenschutzstarke Tools' },
      { slug: 'inhouse-stack', label: 'Inhouse-Stack' },
    ],
    publishedAt: '2026-07-31',
  },
]

export function getComparePair(pair: string): CompareConfig | undefined {
  return COMPARE_PAIRS.find(c => c.pair === pair)
}
