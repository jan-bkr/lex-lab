import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  ArrowRight, AlertTriangle, Shield, FileText,
  Scale, Lock, Search, BarChart3,
  BookOpen, Mail, Target, Building2,
  TrendingUp, Briefcase, Zap, Eye, Clock,
  Users,
} from 'lucide-react'
import { NewsletterForm } from '@/components/NewsletterForm'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'State of Legal AI Germany 2026 — LexLab Research',
  description: 'Strukturierte Marktanalyse: KI-Tools im deutschen Rechts- und Steuermarkt. Marktsegmente, Red Flags, Shortlists und Auswahlframework für Kanzleien, Steuerberater und Inhouse-Teams.',
  openGraph: {
    title: 'State of Legal AI Germany 2026 — LexLab Research',
    description: 'Marktanalyse für KI-Tools im deutschen Rechts- und Steuermarkt — Marktsegmente, Red Flags, Auswahlframework.',
    type: 'article',
  },
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-2">{children}</p>
  )
}

function InsightCard({
  number, title, body, accent = false,
}: {
  number: string; title: string; body: string; accent?: boolean
}) {
  return (
    <div className={`bg-white rounded-xl border p-5 flex flex-col gap-2 ${accent ? 'border-l-4 border-l-blue-400 border-blue-100' : 'border-gray-100'}`}>
      <span className="font-display font-black text-3xl text-gray-100 leading-none">{number}</span>
      <h3 className="font-semibold text-sm text-gray-900 leading-snug">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
    </div>
  )
}

function SegmentCard({
  icon, title, description,
}: {
  icon: ReactNode; title: string; description: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-2.5">
      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 flex-shrink-0">
        {icon}
      </div>
      <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
      <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StateOfLegalAIPage() {
  return (
    <div>

      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section className="bg-[#111827] pt-16 pb-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/80 text-[11px] font-semibold rounded-full px-3 py-1">
              <BookOpen className="w-3 h-3" /> LexLab Research
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/70 text-[11px] font-medium rounded-full px-3 py-1">
              Edition 2026
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/70 text-[11px] font-medium rounded-full px-3 py-1">
              <Clock className="w-3 h-3" /> Stand April 2026
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display leading-tight tracking-tight mb-5">
            <span className="block text-white/50 text-2xl sm:text-3xl font-normal">State of</span>
            <span className="block text-white text-5xl sm:text-6xl lg:text-7xl font-bold">Legal AI</span>
            <span className="block text-blue-400 text-5xl sm:text-6xl lg:text-7xl font-bold">Germany 2026</span>
          </h1>

          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl leading-relaxed mb-8">
            Wie KI den deutschen Rechts- und Steuermarkt verändert — eine strukturierte Marktanalyse für Entscheider in Kanzleien, Steuerberatung und Inhouse Legal.
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/40 text-sm mb-10">
            <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> ca. 12 Min. Lesezeit</span>
            <span aria-hidden>·</span>
            <span>Jan Becker, Rechtsanwalt</span>
            <span aria-hidden>·</span>
            <span>LexLab Editorial</span>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: '42+', label: 'evaluierte Tools' },
              { value: '4', label: 'Rechtsgebiete' },
              { value: '8', label: 'Marktsegmente' },
              { value: '2026', label: 'aktuelle Ausgabe' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="font-display font-bold text-2xl text-white">{stat.value}</p>
                <p className="text-xs text-white/50 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STICKY ANCHOR NAV ────────────────────────────────────────── */}
      <div className="sticky top-14 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="overflow-x-auto scrollbar-none">
            <nav className="flex items-center gap-0.5 h-10 whitespace-nowrap" aria-label="Seitenabschnitte">
              {[
                { href: '#uberblick', label: 'Überblick' },
                { href: '#marktsegmente', label: 'Marktsegmente' },
                { href: '#was-zahlt', label: 'Was zählt' },
                { href: '#red-flags', label: 'Red Flags' },
                { href: '#shortlists', label: 'Shortlists' },
                { href: '#framework', label: 'Auswahlframework' },
                { href: '#vendor-watch', label: 'Vendor Watch' },
              ].map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* ─── CONTENT ──────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Executive Summary ── */}
        <section id="uberblick" className="pt-14 pb-14 border-b border-gray-100 scroll-mt-[100px]">
          <SectionLabel>Executive Summary</SectionLabel>
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-2">Die sechs Kernthesen</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-2xl">
            Die wichtigsten Beobachtungen aus der LexLab-Marktanalyse — verdichtet für strategische Entscheidungen.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InsightCard
              number="01"
              title="Datensouveränität entscheidet — nicht Modellintelligenz"
              body="Ob Daten in der EU bleiben, in Deutschland liegen oder auf US-Servern verarbeitet werden, ist 2026 der zentrale Kaufentscheid für Kanzleien und Steuerberater. Die Qualität des Sprachmodells ist nachrangig."
              accent
            />
            <InsightCard
              number="02"
              title="Der DATEV-Effekt dominiert das Steuerrecht"
              body="DATEV-Kompatibilität ist im Steuerrecht kein Feature, sondern Marktzugangsbedingung. Anbieter ohne native DATEV-Integration kämpfen gegen einen strukturellen Nachteil."
            />
            <InsightCard
              number="03"
              title="Compliance-Theater: DSGVO-Badges ohne Substanz"
              body="Viele Anbieter präsentieren DSGVO-Badges, ohne belastbare Verarbeitungsverträge oder EU-Datenhaltungsgarantien anzubieten. Kanzleien, die sich auf Badges verlassen, tragen das Haftungsrisiko selbst."
              accent
            />
            <InsightCard
              number="04"
              title="Zwei-Lager-Spaltung unter deutschen Kanzleien"
              body="Eine aktiv adoptierende Minderheit nutzt 3–5 KI-Tools strukturiert. Die Mehrheit verharrt in der Beobachtungsphase oder testet ohne konkretes Einsatzziel."
            />
            <InsightCard
              number="05"
              title="Agentic AI ist 2026 Hype"
              body="Fast alle Anbieter, die 'KI-Agenten' vermarkten, liefern fortgeschrittene Autocomplete- und Template-Funktionen. Echte autonome Workflow-Automatisierung für die Rechtspraxis ist noch nicht marktreif."
              accent
            />
            <InsightCard
              number="06"
              title="Plattform-Konsolidierung läuft"
              body="Etablierte Anbieter saugen Legal-AI-Features in ihre Plattformen. Nischen-Tools stehen unter Druck, ihre eigenständige Wertschöpfung gegenüber Microsoft, Google und DATEV zu beweisen."
            />
          </div>
        </section>

        {/* ── Market Map ── */}
        <section id="marktsegmente" className="pt-14 pb-14 border-b border-gray-100 scroll-mt-[100px]">
          <SectionLabel>Market Map 2026</SectionLabel>
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-2">Marktsegmente im Überblick</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-2xl">
            Acht Segmente strukturieren den deutschen Legal-AI-Markt. Reifegrad und Wettbewerbsdynamik unterscheiden sich erheblich.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <SegmentCard
              icon={<FileText className="w-4 h-4" />}
              title="Dokumenten-KI"
              description="Vertragsentwurf, Schriftsatzerstellung, Gutachten — höchste Marktdichte, reifste Angebote."
            />
            <SegmentCard
              icon={<Search className="w-4 h-4" />}
              title="Legal Research"
              description="Urteilssuche, Normenrecherche, Datenbankabfragen — etablierte Anbieter unter Disruptionsdruck."
            />
            <SegmentCard
              icon={<BarChart3 className="w-4 h-4" />}
              title="Due Diligence"
              description="M&A-Dokumentenprüfung, Data-Room-Analyse — starke Enterprise-Nachfrage, hoher ROI."
            />
            <SegmentCard
              icon={<TrendingUp className="w-4 h-4" />}
              title="Tax Tech"
              description="Steuererklärung, Prüfungsunterstützung — DATEV-Integration als strukturelle Schlüsselfrage."
            />
            <SegmentCard
              icon={<Scale className="w-4 h-4" />}
              title="Contract Lifecycle"
              description="CLM, Vertragsverwaltung, Renewal-Tracking — wachsendes Segment, besonders Inhouse Legal."
            />
            <SegmentCard
              icon={<Shield className="w-4 h-4" />}
              title="Compliance & Regulatory"
              description="Gesetzgebungsmonitoring, Regulierungsänderungen — hoher Automatisierungsbedarf, noch fragmentiert."
            />
            <SegmentCard
              icon={<Users className="w-4 h-4" />}
              title="KI-Assistenten"
              description="Legal Q&A, Mandantenkommunikation, Wissensbasis — breite Nutzung, variabler Reifegrad."
            />
            <SegmentCard
              icon={<Clock className="w-4 h-4" />}
              title="Billing & Zeiterfassung"
              description="Automatisierte Abrechnung, Zeiterfassungsunterstützung — Nischensegment mit klarem Wachstumspfad."
            />
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Alle evaluierten Tools nach Segment durchsuchen <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* ── Was 2026 zählt ── */}
        <section id="was-zahlt" className="pt-14 pb-14 border-b border-gray-100 scroll-mt-[100px]">
          <SectionLabel>Marktbeobachtung</SectionLabel>
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-2">Was 2026 wirklich zählt</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-2xl">
            Fünf Einflussfaktoren, die Kaufentscheidungen und Implementierungserfolg im deutschen Rechtsmarkt 2026 maßgeblich bestimmen.
          </p>
          <div className="flex flex-col gap-4">
            {[
              {
                tag: 'Datenstrategie',
                tagColor: 'bg-blue-50 text-blue-700 border-blue-100',
                title: 'Lokale Datenhaltung ist Kaufentscheid, nicht Feature',
                body: 'Mandatsvertraulichkeit und berufsrechtliche Verschwiegenheitspflichten machen den Speicherort sensibler Daten zur Compliance-Frage. Anbieter ohne belastbare EU-Datenhaltungsgarantie fallen für viele Kanzleien strukturell aus — unabhängig von der KI-Qualität.',
                idx: 1,
              },
              {
                tag: 'Haftungsrisiko',
                tagColor: 'bg-amber-50 text-amber-700 border-amber-100',
                title: 'Halluzinations-Risiko ist rechtlich ungelöst',
                body: 'Kein Anbieter garantiert faktisch die Richtigkeit KI-generierter Rechtsinhalte. Die berufsrechtliche Haftung liegt beim Anwalt. 2026 fehlt ein belastbarer Marktstandard für die Qualitätssicherung KI-generierter Rechtsdokumente.',
                idx: 2,
              },
              {
                tag: 'Marktstruktur',
                tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                title: 'DATEV-Integration definiert Marktdurchdringung im Steuerrecht',
                body: 'Für Steuerberater ist das DATEV-Ökosystem die faktische Plattform. Anbieter ohne dokumentierte DATEV-Schnittstelle stehen vor erheblichen Integrationshürden. Native DATEV-KI-Funktionen nehmen zu und erhöhen den Druck auf unabhängige Anbieter.',
                idx: 3,
              },
              {
                tag: 'Qualitätsmerkmal',
                tagColor: 'bg-purple-50 text-purple-700 border-purple-100',
                title: 'Deutsche Rechtssprache ist noch echtes Differenzierungsmerkmal',
                body: 'Qualität juristischer Fachsprache, Kenntnis des deutschen Rechtssystems und aktuelle Normen- und Rechtsprechungsdatenbanken sind 2026 noch klare Differenzierungsmerkmale. Wer hier investiert, gewinnt Vertrauen.',
                idx: 4,
              },
              {
                tag: 'ROI-Realismus',
                tagColor: 'bg-gray-100 text-gray-600 border-gray-200',
                title: 'Im Abo-Modell entscheidet der ROI nach 90 Tagen',
                body: 'Die meisten Legal-AI-Tools werden als Monats- oder Jahresabo verkauft. Kanzleien, die keinen messbaren Produktivitätsgewinn in den ersten 90 Tagen sehen, kündigen. Anbieter ohne klare Onboarding-Strategie verlieren diese Kunden systematisch.',
                idx: 5,
              },
            ].map(item => (
              <div key={item.idx} className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex-shrink-0 sm:w-32">
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wide rounded-md px-2 py-0.5 border ${item.tagColor}`}>
                    {item.tag}
                  </span>
                  <p className="font-display font-black text-5xl text-gray-100 mt-2 leading-none select-none">
                    0{item.idx}
                  </p>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-900 mb-1.5 leading-snug">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Red Flags ── */}
        <section id="red-flags" className="pt-14 pb-14 border-b border-gray-100 scroll-mt-[100px]">
          <SectionLabel>Auswahlrisiken</SectionLabel>
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-2">Red Flags nach Zielgruppe</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-2xl">
            Häufige Fehler bei der KI-Tool-Auswahl — spezifisch nach Zielgruppe aufgeschlüsselt.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                persona: 'Kanzleien',
                icon: <Scale className="w-5 h-5" />,
                color: 'text-red-700',
                iconBg: 'bg-red-100',
                bg: 'bg-red-50',
                border: 'border-red-100',
                flagColor: 'text-red-500',
                flags: [
                  'Kein Verarbeitungsvertrag (AVV) nach DSGVO Art. 28 vorhanden',
                  'Datenhaltung außerhalb der EU ohne ausreichende Rechtsgrundlage',
                  'Keine explizite Zusicherung zur Mandantenvertraulichkeit',
                  'Berufsrechtliche Kompatibilität mit §§ 43, 43a BRAO nicht thematisiert',
                  'Kein Audit-Trail für KI-generierte Dokumente und Entscheidungen',
                ],
              },
              {
                persona: 'Steuerberater',
                icon: <TrendingUp className="w-5 h-5" />,
                color: 'text-amber-700',
                iconBg: 'bg-amber-100',
                bg: 'bg-amber-50',
                border: 'border-amber-100',
                flagColor: 'text-amber-500',
                flags: [
                  'Fehlende oder undokumentierte DATEV-Schnittstelle',
                  'Steuer-Wissensdatenbank veraltet (kein Aktualisierungs-SLA)',
                  'Anbieter ohne Erfahrung mit StBerG-spezifischen Anforderungen',
                  'Keine Mandantentrennung in Multi-Tenant-Systemen dokumentiert',
                  'Fehlende aktuelle BMF-Schreiben und Verwaltungsanweisungen',
                ],
              },
              {
                persona: 'Inhouse Legal',
                icon: <Building2 className="w-5 h-5" />,
                color: 'text-orange-700',
                iconBg: 'bg-orange-100',
                bg: 'bg-orange-50',
                border: 'border-orange-100',
                flagColor: 'text-orange-500',
                flags: [
                  'Shadow-IT durch unkontrollierte Einzellizenzen von Mitarbeitern',
                  'Keine Governance-Policy für KI-generierten Output definiert',
                  'Halluzinationsrisiko bei Compliance-kritischen Aufgaben ohne Prüfpflicht',
                  'Fehlende Integration in bestehende DMS/CLM-Systeme',
                  'Kein Vendor-Management für KI-Tool-Portfolio und Lizenzkosten',
                ],
              },
            ].map(section => (
              <div key={section.persona} className={`rounded-xl border ${section.border} ${section.bg} p-5`}>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className={`w-8 h-8 ${section.iconBg} rounded-lg flex items-center justify-center ${section.color}`}>
                    {section.icon}
                  </div>
                  <h3 className={`font-semibold text-sm ${section.color}`}>{section.persona}</h3>
                </div>
                <ul className="flex flex-col gap-3">
                  {section.flags.map((flag, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${section.flagColor}`} />
                      <span className="text-xs text-gray-600 leading-relaxed">{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Shortlists ── */}
        <section id="shortlists" className="pt-14 pb-14 border-b border-gray-100 scroll-mt-[100px]">
          <SectionLabel>Shortlists</SectionLabel>
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-2">Tool-Empfehlungen nach Profil</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-2xl">
            Vier Einstiegsprofile mit konkreten Schwerpunkten — keine generischen Listen, sondern praxisorientierte Prioritätensetzung.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              {
                profile: 'Kleine Kanzlei (1–5 Anwälte)',
                icon: <Briefcase className="w-4 h-4" />,
                color: 'bg-blue-600',
                priorities: [
                  { label: 'Must', text: 'DSGVO-konformes Tool mit EU-Datenhaltung' },
                  { label: 'Must', text: 'Kein komplexes Setup, sofort praxistauglich' },
                  { label: 'Should', text: 'Dokumentenentwurf und Schriftsatzhilfe' },
                  { label: 'Could', text: 'Rechtsprechungsrecherche als Zusatzfunktion' },
                ],
              },
              {
                profile: 'Großkanzlei / Enterprise',
                icon: <Building2 className="w-4 h-4" />,
                color: 'bg-purple-600',
                priorities: [
                  { label: 'Must', text: 'API-Zugang + Enterprise-Security (SSO, Audit-Log)' },
                  { label: 'Must', text: 'Dediziertes Vertragsmanagement (CLM)' },
                  { label: 'Should', text: 'Due-Diligence-Automatisierung für M&A' },
                  { label: 'Could', text: 'Mehrsprachigkeit und Cross-Jurisdiction-Fähigkeit' },
                ],
              },
              {
                profile: 'Steuerberater',
                icon: <TrendingUp className="w-4 h-4" />,
                color: 'bg-emerald-600',
                priorities: [
                  { label: 'Must', text: 'Dokumentierte DATEV-Integration oder native Funktion' },
                  { label: 'Must', text: 'Aktuelle Steuerrecht-Wissensdatenbank mit lfd. Updates' },
                  { label: 'Should', text: 'Mandantenkommunikations-Unterstützung' },
                  { label: 'Could', text: 'Assistenz bei Steuerdeklaration und Prüfung' },
                ],
              },
              {
                profile: 'Inhouse Legal Team',
                icon: <Target className="w-4 h-4" />,
                color: 'bg-orange-500',
                priorities: [
                  { label: 'Must', text: 'CLM-Lösung mit DMS-Integration' },
                  { label: 'Must', text: 'Governance-Features: Rollen, Freigabeprozesse, Audit' },
                  { label: 'Should', text: 'Compliance-Monitoring und Regulatory Tracker' },
                  { label: 'Could', text: 'Automated Contract Review für Standardverträge' },
                ],
              },
            ].map(p => (
              <div key={p.profile} className="bg-white border border-gray-100 rounded-xl p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className={`w-7 h-7 ${p.color} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                    {p.icon}
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900">{p.profile}</h3>
                </div>
                <div className="flex flex-col gap-2.5">
                  {p.priorities.map((pr, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className={`flex-shrink-0 text-[9px] font-bold rounded px-1.5 py-0.5 mt-0.5 leading-none ${
                        pr.label === 'Must'
                          ? 'bg-gray-900 text-white'
                          : pr.label === 'Should'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-gray-50 text-gray-400 border border-gray-200'
                      }`}>{pr.label}</span>
                      <p className="text-xs text-gray-600 leading-relaxed">{pr.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Finder CTA */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900 mb-1">Personalisierte Tool-Empfehlungen</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Beantworte 4 kurze Fragen — LexLab gibt dir eine auf dein Profil zugeschnittene Top-5-Empfehlung mit Bewertung.
              </p>
            </div>
            <Link
              href="/tools/finder"
              className="flex-shrink-0 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Zum Tool Finder <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ── Auswahlframework ── */}
        <section id="framework" className="pt-14 pb-14 border-b border-gray-100 scroll-mt-[100px]">
          <SectionLabel>Entscheidungsframework</SectionLabel>
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-2">In 5 Schritten zur richtigen Wahl</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-2xl">
            Ein strukturiertes Framework für die KI-Tool-Auswahl im Rechtsmarkt — anwendbar unabhängig von Kanzleigröße oder Fachgebiet.
          </p>
          <div className="flex flex-col gap-3">
            {[
              {
                step: '01',
                title: 'Daten-Due-Diligence: Wo landen meine Daten?',
                body: 'Klären Sie vor jeder anderen Frage: Wo werden Daten verarbeitet und gespeichert? EU-Serverstandort, Subauftragnehmer, Drittlandtransfer nach Art. 46 DSGVO — diese Antworten müssen vorliegen, bevor Sie Demo-Termine vereinbaren.',
                icon: <Shield className="w-4 h-4" />,
              },
              {
                step: '02',
                title: 'Use-Case-Priorisierung: Was löst das Tool konkret?',
                body: 'Definieren Sie den primären Use Case präzise: Dokumentenentwurf, Rechtsprechungsrecherche, Vertragsreview oder Due Diligence? Kein Tool ist in allen Anwendungsfeldern gleich stark. Investieren Sie Evaluierungsaufwand zielgerichtet.',
                icon: <Target className="w-4 h-4" />,
              },
              {
                step: '03',
                title: 'Integrations-Check: Passt es in die bestehende Infrastruktur?',
                body: 'Prüfen Sie Kompatibilität mit bestehender Software: DATEV, Microsoft 365, beA, DMS-Systeme. Ein Tool, das als Insel ohne Anbindung läuft, erzeugt Medienbrüche und niedrige Adoption.',
                icon: <Zap className="w-4 h-4" />,
              },
              {
                step: '04',
                title: 'Compliance-Audit: Berufsrecht und DSGVO prüfen',
                body: 'Fragen Sie konkret nach: AVV, TOM-Dokumentation, Unterauftragnehmerliste, Löschfristen. Lassen Sie sich nicht mit allgemeinen Datenschutzerklärungen abspeisen. Beziehen Sie bei Unsicherheit die Berufshaftpflicht ein.',
                icon: <Lock className="w-4 h-4" />,
              },
              {
                step: '05',
                title: 'Pilotphase: 30 Tage mit echten Mandatsdaten messen',
                body: 'Testen Sie ausschließlich mit realen Mandatsanfragen — nicht mit Demo-Daten. Messen Sie: Zeitersparnis pro Aufgabentyp, Fehlerrate, Nutzerakzeptanz. Kein KI-Tool rechtfertigt seinen Preis ohne messbare Produktivitätswirkung.',
                icon: <BarChart3 className="w-4 h-4" />,
              },
            ].map(item => (
              <div key={item.step} className="flex gap-5 bg-white border border-gray-100 rounded-xl p-5">
                <div className="flex-shrink-0 w-10">
                  <p className="font-display font-black text-4xl text-gray-100 leading-none select-none">{item.step}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 flex-shrink-0">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold text-sm text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Vendor Watch ── */}
        <section id="vendor-watch" className="pt-14 pb-14 border-b border-gray-100 scroll-mt-[100px]">
          <SectionLabel>Vendor Watch 2026</SectionLabel>
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-2">Marktbewegungen im Blick</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-2xl">
            Sechs prägende Marktbewegungen, die Legal-AI-Entscheider im Blick behalten sollten.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[
              {
                signal: 'DATEV-Ökosystem wächst von innen',
                tag: 'Marktstruktur',
                body: 'DATEV integriert native KI-Funktionen in bestehende Produkte. Unabhängige Legal-AI-Anbieter im Steuerrechtssegment geraten unter Innovationsdruck von innen.',
              },
              {
                signal: 'Microsoft Copilot als Einfallstor',
                tag: 'Plattform',
                body: 'Microsoft Copilot for Legal ist die meistgenutzte KI-Infrastruktur in deutschen Großkanzleien — nicht wegen überlegener Rechtsqualität, sondern wegen bestehender M365-Lizenzen.',
              },
              {
                signal: 'US-Legal-AI kommt nach Europa',
                tag: 'Globalisierung',
                body: 'Harvey, Ironclad und weitere US-Anbieter expandieren nach Europa. Datenschutzkonformität bleibt ihr strukturelles Hindernis im deutschen Markt.',
              },
              {
                signal: 'EU AI Act verschärft Anforderungen',
                tag: 'Regulierung',
                body: 'Legal-AI-Anwendungen mit Hochrisikoklassifikation nach EU AI Act müssen 2026/2027 Transparenz- und Protokollierungspflichten erfüllen. Frühzeitige Compliance sichert Marktposition.',
              },
              {
                signal: 'Halluzinations-Garantien als Differenzierungsmerkmal',
                tag: 'Produktentwicklung',
                body: 'Erste Anbieter bieten schriftliche Qualitätszusicherungen für KI-Output an. Dieser Trend wird Kaufentscheidungen zunehmend prägen und den Druck auf andere Anbieter erhöhen.',
              },
              {
                signal: 'Lokale LLM-Anbieter gewinnen Glaubwürdigkeit',
                tag: 'Infrastruktur',
                body: 'Open-Source-Modelle auf deutschen Servern (Mistral, LLaMA-basierte Fine-Tunes) werden wettbewerbsfähiger. Das Argument "EU-Cloud, aber US-Modell" verliert an Überzeugungskraft.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-5">
                <span className="inline-block text-[9px] font-bold uppercase tracking-wide text-gray-400 border border-gray-200 rounded-md px-2 py-0.5 mb-3">
                  {item.tag}
                </span>
                <h3 className="font-semibold text-sm text-gray-900 mb-1.5 leading-snug">{item.signal}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Alle 42+ Tools im LexLab-Verzeichnis ansehen <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* ── CTA / Nächste Schritte ── */}
        <section className="pt-14 pb-4 scroll-mt-[100px]">
          <SectionLabel>Nächste Schritte</SectionLabel>
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-2">Weiter auf der Plattform</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-2xl">
            Diese Analyse ist ein Ausgangspunkt. Die konkreten Entscheidungen treffen Sie mit den Werkzeugen der Plattform.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
            {[
              {
                href: '/tools',
                title: 'Tool-Verzeichnis',
                desc: '42+ evaluierte KI-Tools für den deutschen Rechtsmarkt',
                icon: <Search className="w-5 h-5" />,
                color: 'text-blue-600',
                bg: 'bg-blue-50',
              },
              {
                href: '/tools/finder',
                title: 'Tool Finder',
                desc: 'Personalisierte Top-5-Empfehlung in 4 Schritten',
                icon: <Target className="w-5 h-5" />,
                color: 'text-purple-600',
                bg: 'bg-purple-50',
              },
              {
                href: '/workflows',
                title: 'Workflow-Guides',
                desc: 'Schritt-für-Schritt-Anleitungen für KI-Integration',
                icon: <BookOpen className="w-5 h-5" />,
                color: 'text-emerald-600',
                bg: 'bg-emerald-50',
              },
              {
                href: '/newsletter',
                title: 'LexLab Newsletter',
                desc: 'Wöchentlich die wichtigsten Legal-AI-Updates',
                icon: <Mail className="w-5 h-5" />,
                color: 'text-orange-600',
                bg: 'bg-orange-50',
              },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm rounded-xl p-5 group transition-all"
              >
                <div className={`w-9 h-9 ${item.bg} rounded-lg flex items-center justify-center ${item.color} mb-3`}>
                  {item.icon}
                </div>
                <h3 className={`font-semibold text-sm text-gray-900 group-hover:${item.color} transition-colors mb-1`}>
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                <div className={`flex items-center gap-1 mt-3 text-xs font-medium ${item.color}`}>
                  Öffnen <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center mb-16">
            <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-2">Newsletter</p>
            <h3 className="font-display font-bold text-2xl text-gray-900 mb-2">Bleib auf dem Laufenden</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              Die nächste Ausgabe des State of Legal AI erscheint Ende 2026. Im Newsletter bekommst du Updates, neue Tool-Evaluierungen und Marktbeobachtungen — wöchentlich, kostenlos.
            </p>
            <NewsletterForm />
            <p className="text-xs text-gray-400 mt-3">
              Mit der Anmeldung akzeptierst du unsere{' '}
              <a href="/datenschutz" className="underline hover:text-gray-600">Datenschutzerklärung</a>.
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}
