// ─── Collection definitions ────────────────────────────────────────────────────
// Shared between the listing page and individual collection pages.
// Filter logic maps to Supabase queries on the tools table.

export type CollectionSlug =
  | 'ma-due-diligence'
  | 'datenschutzstark'
  | 'steuerrecht-essentials'
  | 'inhouse-stack'
  | 'einsteiger-stack'

export interface CollectionFilter {
  rechtsgebietOverlaps?: string[]
  minScore?: number
  minDatenschutz?: number
  maxTools: number
  orderBy: 'lexlab_score' | 'score_datenschutz'
}

export interface CollectionDef {
  slug: CollectionSlug
  title: string
  eyebrow: string
  description: string
  benefit: string
  methodology: string
  forWhom: string
  context: string
  whenUseful: string
  whenNot: string
  theme: 'purple' | 'blue' | 'emerald' | 'amber' | 'gray'
  filter: CollectionFilter
}

export const COLLECTIONS: CollectionDef[] = [
  {
    slug: 'ma-due-diligence',
    title: 'Top Tools für M&A Due Diligence',
    eyebrow: 'M&A · Gesellschaftsrecht',
    description: 'Die leistungsstärksten KI-Tools für die strukturierte Prüfung von Dokumenten in M&A-Transaktionen — von der ersten Analyse bis zum Signing.',
    benefit: 'Bis zu 60 % weniger Zeit bei der Dokumentenprüfung.',
    methodology: 'Tools aus den Rechtsgebieten M&A und Gesellschaftsrecht, absteigend nach LexLab-Gesamtscore sortiert. Alle enthaltenen Tools wurden manuell geprüft und freigegeben.',
    forWhom: 'Transaktionsanwälte, M&A-Berater und Corporate-Teams, die Dokumentenprüfungen effizienter gestalten wollen.',
    context: 'M&A-Transaktionen sind dokumentenintensiv. Diese Shortlist fasst die leistungsstärksten KI-Tools zusammen, die den gesamten Prozess von der ersten Vertragsprüfung bis zum Signing beschleunigen — mit DACH-Relevanz und Datenschutz als Bewertungsgrundlage.',
    whenUseful: 'Wenn du nach einer fundierten Auswahl für den Einstieg in KI-gestützte M&A-Workflows suchst — oder gezielt einzelne Phasen des Transaktionsprozesses beschleunigen möchtest.',
    whenNot: 'Wenn du primär allgemeine Rechtsfragen oder Arbeitsrechtsfälle bearbeitest — dafür eignen sich andere Shortlists besser.',
    theme: 'purple',
    filter: {
      rechtsgebietOverlaps: ['M&A', 'Gesellschaftsrecht'],
      maxTools: 8,
      orderBy: 'lexlab_score',
    },
  },
  {
    slug: 'datenschutzstark',
    title: 'Datenschutzstarke Tools für sensible Mandate',
    eyebrow: 'Datenschutz · DSGVO',
    description: 'KI-Tools mit hohem Datenschutzniveau für Kanzleien, die Mandantendaten besonders schützen müssen — EU-Serverstandort, DSGVO-Konformität und On-Premise-Optionen.',
    benefit: 'DSGVO-konformer KI-Einsatz ohne Kompromisse.',
    methodology: 'Tools mit einem LexLab-Datenschutz-Score von mindestens 7/10 — EU-Serverstandort, DSGVO-Konformität und On-Premise-Optionen als Bewertungsdimensionen. Sortiert nach Datenschutz-Score.',
    forWhom: 'Kanzleien und Rechtsabteilungen, die besonders sensible Mandantendaten verarbeiten und DSGVO-Konformität priorisieren.',
    context: 'Die DSGVO stellt KI-Tools im Rechtsbereich vor erhöhte Anforderungen. Diese Shortlist bewertet Tools ausschließlich nach Datenschutz-Score — EU-Serverstandort, DSGVO-Compliance und On-Premise-Optionen sind die Kernkriterien.',
    whenUseful: 'Wenn du Tools für die Verarbeitung vertraulicher Mandantendaten suchst und Compliance-Anforderungen eine zentrale Rolle spielen.',
    whenNot: 'Wenn Datenschutz keine besondere Priorität hat und du nach dem besten Tool für ein spezifisches Rechtsgebiet suchst — dann sind die Rechtsgebiets-Shortlists besser geeignet.',
    theme: 'emerald',
    filter: {
      minDatenschutz: 7,
      maxTools: 8,
      orderBy: 'score_datenschutz',
    },
  },
  {
    slug: 'steuerrecht-essentials',
    title: 'Steuerrecht-Essentials für Steuerberater',
    eyebrow: 'Steuerrecht',
    description: 'Die wichtigsten KI-Tools für steuerrechtliche Recherche, Mandantenkommunikation und die Arbeit mit Finanzdaten — speziell für Steuerberatungskanzleien kuratiert.',
    benefit: 'Praxiserprobte Tools für den deutschen Steuermarkt.',
    methodology: 'Tools mit explizitem Steuerrecht-Bezug, absteigend nach LexLab-Gesamtscore sortiert. Bewertet aus Perspektive einer Steuerberatungskanzlei mit DACH-Fokus.',
    forWhom: 'Steuerberatungskanzleien und Steuerabteilungen, die KI für Recherche, Mandantenkommunikation und Dokumentenarbeit einsetzen wollen.',
    context: 'Der Steuerberatungsmarkt in Deutschland, Österreich und der Schweiz hat spezifische Anforderungen: Nähe zu DATEV, deutsche Steuerrechts-Datenbanken und Verständnis des DACH-Steuerrechts. Diese Shortlist bewertet nur Tools mit explizitem Steuerrechtsbezug und DACH-Praxisreife.',
    whenUseful: 'Wenn du als Steuerberater oder in einer Steuerabteilung arbeitest und konkrete Tool-Empfehlungen für den Einstieg in KI-gestützte Steuerarbeit brauchst.',
    whenNot: 'Wenn du nach reinen Buchführungs- oder ERP-Systemen ohne KI-Komponente suchst — diese sind nicht Teil der Shortlist.',
    theme: 'emerald',
    filter: {
      rechtsgebietOverlaps: ['Steuerrecht'],
      maxTools: 8,
      orderBy: 'lexlab_score',
    },
  },
  {
    slug: 'inhouse-stack',
    title: 'Inhouse-Stack für Unternehmensjuristen',
    eyebrow: 'Inhouse · Gesellschaftsrecht',
    description: 'KI-Tools für Inhouse-Legal-Teams in Unternehmen: Vertragsmanagement, Compliance, M&A-Transaktionen und tägliche Rechtsfragen effizient bearbeiten.',
    benefit: 'Mehr Output mit kleinem Team — ohne Qualitätsverlust.',
    methodology: 'Tools mit Bezug zu M&A und Gesellschaftsrecht, nach LexLab-Gesamtscore sortiert — bewertet auf Praxisreife, DACH-Relevanz und UX für Inhouse-Kontexte.',
    forWhom: 'Inhouse-Juristen in Unternehmen, die mit kleinem Team einen hohen Output erreichen müssen.',
    context: 'Inhouse-Legal-Teams arbeiten unter anderen Bedingungen als Kanzleien: direkterer Unternehmenskontext, schnellere Entscheidungszyklen, oft breiteres Aufgabenspektrum. Diese Shortlist priorisiert Tools, die in Unternehmensumgebungen besonders gut funktionieren — mit Fokus auf Integration und Skalierbarkeit.',
    whenUseful: 'Wenn du in einem Inhouse-Legal-Team arbeitest und nach KI-Tools suchst, die auf deinen Unternehmenskontext zugeschnitten sind.',
    whenNot: 'Wenn du eine klassische Mandatskanzlei führst — einige dieser Tools sind auf Unternehmensstrukturen optimiert und weniger auf klassische Kanzleiworkflows ausgelegt.',
    theme: 'blue',
    filter: {
      rechtsgebietOverlaps: ['M&A', 'Gesellschaftsrecht'],
      maxTools: 8,
      orderBy: 'lexlab_score',
    },
  },
  {
    slug: 'einsteiger-stack',
    title: 'Einsteiger-Stack: Erste Schritte mit Legal AI',
    eyebrow: 'Alle Rechtsgebiete',
    description: 'Der optimale Startpunkt für Kanzleien und Steuerberater, die mit KI-Tools beginnen wollen — einsteigerfreundlich, gut bewertet und kostenlos testbar.',
    benefit: 'In einer Woche produktiv — ohne technisches Vorwissen.',
    methodology: 'Tools mit einem LexLab-Score von mindestens 60/100, rechtsgebietsübergreifend. Kriterium: sofort einsetzbar, niedrige Einstiegshürde, kostenlos testbar.',
    forWhom: 'Kanzleien und Steuerberater, die noch keine KI-Tools nutzen und niedrigschwellig, aber solide einsteigen wollen.',
    context: 'Der Einstieg in Legal AI muss nicht komplex sein. Diese Shortlist fasst Tools zusammen, die sofort nutzbar sind, kostenlos testbar und von LexLab mit mindestens 60/100 Punkten bewertet wurden. Der Fokus liegt auf Zugänglichkeit — nicht auf Spezialtiefe.',
    whenUseful: 'Wenn du noch keine KI-Tools in deiner Kanzlei einsetzt und einen soliden, bewährten Einstiegspunkt suchst.',
    whenNot: 'Wenn du bereits KI-Tools nutzt und jetzt spezialisierte oder besonders leistungsfähige Tools für bestimmte Rechtsgebiete brauchst — dann sind die Rechtsgebiets-Shortlists besser geeignet.',
    theme: 'amber',
    filter: {
      minScore: 60,
      maxTools: 6,
      orderBy: 'lexlab_score',
    },
  },
]

export function getCollection(slug: string): CollectionDef | undefined {
  return COLLECTIONS.find(c => c.slug === slug)
}
