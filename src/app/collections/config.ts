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
