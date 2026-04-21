import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'LexLab Method',
  description: 'Wie LexLab KI-Tools auswählt, bewertet und einordnet — das Bewertungssystem, Auswahlprinzipien und die Platform-Module erklärt.',
  openGraph: {
    title: 'LexLab Method — Wie wir auswählen und bewerten',
    description: 'Das Bewertungssystem, die Auswahlprinzipien und die Platform-Module von LexLab erklärt.',
  },
  alternates: { canonical: 'https://www.lex-lab.de/method' },
}

// ─── Score criteria ────────────────────────────────────────────────────────────

const SCORE_CRITERIA = [
  {
    id: 'praxisreife',
    label: 'Praxisreife',
    weight: 35,
    description: 'Wie gut funktioniert das Tool in realen Kanzlei- und Steuerberatungsumgebungen? Entscheidend sind ausgereifte Features, verlässliche Ergebnisse und echte Nutzbarkeit im Berufsalltag — nicht technische Versprechen.',
  },
  {
    id: 'dach',
    label: 'DACH-Relevanz',
    weight: 25,
    description: 'Unterstützt das Tool deutschsprachige Inhalte, DACH-spezifische Rechtsbereiche und lokale Anforderungen? Bewertet werden Sprachqualität, lokale Integrationen und erkennbare DACH-Marktpräsenz.',
  },
  {
    id: 'datenschutz',
    label: 'Datenschutz',
    weight: 20,
    description: 'Wie gut erfüllt das Tool DSGVO-Anforderungen? Bewertet werden: Serverstandort, Datenverarbeitungsverträge (DPA), On-Premise-Optionen und Transparenz über KI-Trainingsnutzung von Nutzerdaten.',
  },
  {
    id: 'ux',
    label: 'UX & Bedienbarkeit',
    weight: 10,
    description: 'Wie intuitiv ist das Tool ohne aufwändige Einarbeitung zu bedienen? Relevanz für die tägliche Nutzung in einem professionellen Umfeld.',
  },
  {
    id: 'preis',
    label: 'Preis-Leistung',
    weight: 10,
    description: 'Wie gut ist das Preis-Leistungs-Verhältnis für kleine und mittlere DACH-Kanzleien? Bewertet wird der Einstiegspreis im Verhältnis zur tatsächlich gelieferten Leistung.',
  },
]

// ─── Principles ───────────────────────────────────────────────────────────────

const PRINCIPLES = [
  {
    num: '01',
    title: 'Kein Sponsoring, kein Affiliate',
    body: 'Kein Tool zahlt für seine Aufnahme ins Verzeichnis oder sein Ranking. LexLab wird nicht durch Tool-Anbieter finanziert. Die Bewertungen sind unabhängig von kommerziellen Interessen.',
  },
  {
    num: '02',
    title: 'DACH-Fokus statt globale Breite',
    body: 'LexLab bewertet aus der Perspektive kleiner und mittlerer Kanzleien und Steuerberatungsbüros in Deutschland, Österreich und der Schweiz. Tools ohne relevante DACH-Unterstützung werden entsprechend niedriger bewertet — unabhängig von globaler Bekanntheit.',
  },
  {
    num: '03',
    title: 'Praxis vor Technologie',
    body: 'Technische Features werden nur dort hoch bewertet, wo sie echten Praxisnutzen liefern. Ein fokussiertes Tool mit verlässlichem Output rankt höher als ein technisch beeindruckendes Tool, das im Kanzleialltag nicht funktioniert.',
  },
  {
    num: '04',
    title: 'Datenschutz als Bewertungsdimension',
    body: 'Datenschutz ist für juristische Kanzleien kein nice-to-have. LexLab gewichtet ihn explizit mit 20 % im Gesamtscore. Kein Tool mit gravierenden Datenschutz-Problemen erscheint in empfehlenden Shortlists — unabhängig vom Gesamtscore.',
  },
  {
    num: '05',
    title: 'Orientierung statt Vollständigkeit',
    body: 'LexLab ist kein vollständiges Verzeichnis aller KI-Tools auf dem Markt. Das Ziel ist gezielte Orientierung — lieber 50 gut bewertete und eingeordnete Tools als 500 ohne Einordnung.',
  },
]

// ─── Platform modules ─────────────────────────────────────────────────────────

const MODULES = [
  {
    href: '/tools',
    symbol: '⬚',
    title: 'Verzeichnis',
    desc: 'Alle kuratierten KI-Tools mit LexLab Score, Preismodell, Rechtsgebiet und DACH-Einordnung. Durchsucht, gefiltert und sortiert nach Bewertung.',
  },
  {
    href: '/tools/finder',
    symbol: '◎',
    title: 'Finder',
    desc: 'Vier gezielte Fragen — eine personalisierte Tool-Empfehlung. Für Teams ohne festgelegten Stack und Entscheider, die strukturiert einsteigen wollen.',
  },
  {
    href: '/collections',
    symbol: '◈',
    title: 'Collections',
    desc: 'Kuratierte Shortlists nach Anforderungsprofil: M&A, Datenschutz, Steuerrecht, Inhouse und Einsteiger. Jede Shortlist erklärt ihre eigene Filterlogik.',
  },
  {
    href: '/tools/compare',
    symbol: '⇌',
    title: 'Compare',
    desc: 'Direkte Gegenüberstellungen nach echten Entscheidungskriterien: wann Tool A, wann Tool B — mit Score-Vergleich und LexLab-Einschätzung.',
  },
  {
    href: '/research',
    symbol: '◐',
    title: 'Research',
    desc: 'State of Legal AI Germany 2026, Markt-Radar und kuratierte Signale. Strukturierte Marktbeobachtung für den DACH-Rechtsmarkt.',
  },
  {
    href: '/prompts/builder',
    symbol: '✦',
    title: 'Prompt Builder',
    desc: 'Professionelle juristische Prompts mit integrierter JURIST_PERSONA — für Gutachten, Vertragsanalysen, Due Diligence und mehr.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MethodPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">

      {/* ─── Hero ─── */}
      <section className="pt-14 pb-12 max-w-3xl">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          LexLab Method
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-[#111827] leading-tight tracking-tight mb-5">
          Wie wir auswählen,<br className="hidden sm:block" /> bewerten und einordnen.
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">
          LexLab ist keine Suchmaschine und kein Aggregator. Jedes Tool im Verzeichnis wurde manuell geprüft und entlang eines transparenten Bewertungssystems eingeordnet — aus der Perspektive des DACH-Rechtsmarkts.
        </p>
      </section>

      {/* ─── Anchor nav ─── */}
      <nav className="border-t border-b border-gray-100 py-3 mb-14 overflow-x-auto">
        <div className="flex items-center gap-6 text-sm text-gray-400 whitespace-nowrap">
          <a href="#score" className="hover:text-[#111827] transition-colors">Der Score</a>
          <span className="text-gray-200">·</span>
          <a href="#prinzipien" className="hover:text-[#111827] transition-colors">Auswahlprinzipien</a>
          <span className="text-gray-200">·</span>
          <a href="#module" className="hover:text-[#111827] transition-colors">Platform-Module</a>
          <span className="text-gray-200">·</span>
          <a href="#grenzen" className="hover:text-[#111827] transition-colors">Grenzen</a>
        </div>
      </nav>

      {/* ─── Score Section ─── */}
      <section id="score" className="scroll-mt-20 mb-20 max-w-3xl">
        <div className="mb-6">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Bewertungssystem</p>
          <h2 className="font-display text-2xl sm:text-3xl text-[#111827] tracking-tight mb-3">
            Der LexLab Score
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Jedes Tool im Verzeichnis erhält einen Score von 0–100. Der Score ergibt sich aus fünf gewichteten Dimensionen, die jeweils auf einer Skala von 1–10 bewertet werden. Die Gewichtung spiegelt die tatsächlichen Prioritäten von DACH-Kanzleien wider.
          </p>
        </div>

        {/* Score criteria */}
        <div className="bg-[#111827] rounded-2xl p-6 sm:p-8 mb-6">
          <div className="space-y-6">
            {SCORE_CRITERIA.map(c => (
              <div key={c.id}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-white text-sm font-semibold w-36 flex-shrink-0">{c.label}</span>
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${c.weight * 2.5}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-white/60 text-sm font-mono w-8 text-right flex-shrink-0">{c.weight}%</span>
                </div>
                <p className="text-white/50 text-xs leading-relaxed pl-0 sm:pl-[154px]">
                  {c.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-white/40 text-xs leading-relaxed">
              Score-Formel: (Praxisreife × 35 + DACH × 25 + Datenschutz × 20 + UX × 10 + Preis × 10) / 10 = Score 0–100
            </p>
          </div>
        </div>

        {/* Score interpretation */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
            <p className="text-lg font-bold text-green-700 mb-1">80–100</p>
            <p className="text-xs text-green-600">Empfehlenswert für den DACH-Kanzleialltag</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <p className="text-lg font-bold text-amber-700 mb-1">60–79</p>
            <p className="text-xs text-amber-600">Solide mit erkennbaren Einschränkungen</p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
            <p className="text-lg font-bold text-gray-600 mb-1">0–59</p>
            <p className="text-xs text-gray-500">Eingeschränkt für DACH-Kanzleien geeignet</p>
          </div>
        </div>
      </section>

      {/* ─── Principles Section ─── */}
      <section id="prinzipien" className="scroll-mt-20 mb-20 max-w-3xl">
        <div className="mb-8">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Haltung</p>
          <h2 className="font-display text-2xl sm:text-3xl text-[#111827] tracking-tight mb-3">
            Auswahlprinzipien
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Hinter jedem Score stehen Prinzipien, die die Bewertung leiten. Diese Prinzipien sind keine Marketing-Botschaften, sondern operative Entscheidungsregeln.
          </p>
        </div>

        <div className="space-y-0 divide-y divide-gray-100 border-t border-b border-gray-100">
          {PRINCIPLES.map(p => (
            <div key={p.num} className="py-5 flex gap-5">
              <span className="font-mono text-xs text-gray-300 flex-shrink-0 pt-0.5">{p.num}</span>
              <div>
                <h3 className="text-sm font-semibold text-[#111827] mb-1.5">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Modules Section ─── */}
      <section id="module" className="scroll-mt-20 mb-20 max-w-3xl">
        <div className="mb-8">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Platform</p>
          <h2 className="font-display text-2xl sm:text-3xl text-[#111827] tracking-tight mb-3">
            Die Platform-Module
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            LexLab besteht aus mehreren Modulen, die aufeinander aufgebaut sind und unterschiedliche Orientierungsbedürfnisse adressieren.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MODULES.map(m => (
            <Link
              key={m.href}
              href={m.href}
              className="group flex items-start gap-4 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm rounded-xl px-5 py-4 transition-all"
            >
              <span className="text-xl text-gray-300 flex-shrink-0 mt-0.5 group-hover:text-gray-500 transition-colors font-light">
                {m.symbol}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#111827] mb-1">{m.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{m.desc}</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-200 flex-shrink-0 mt-1 group-hover:text-gray-400 transition-colors ml-auto" />
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Limitations Section ─── */}
      <section id="grenzen" className="scroll-mt-20 mb-20 max-w-3xl">
        <div className="mb-6">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Ehrlichkeit</p>
          <h2 className="font-display text-2xl sm:text-3xl text-[#111827] tracking-tight mb-3">
            Was LexLab nicht ist
          </h2>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 sm:p-8">
          <div className="space-y-5">
            <div className="flex gap-4">
              <span className="text-gray-300 text-sm flex-shrink-0 mt-0.5">—</span>
              <div>
                <p className="text-sm font-semibold text-[#111827] mb-1">Kein vollständiges Marktverzeichnis</p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  LexLab listet keine Tools auf, die nicht manuell geprüft wurden. Es gibt weitaus mehr KI-Tools im Rechtsbereich als im Verzeichnis — das ist bewusst so.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-gray-300 text-sm flex-shrink-0 mt-0.5">—</span>
              <div>
                <p className="text-sm font-semibold text-[#111827] mb-1">Keine Echtzeit-Bewertungen</p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Scores werden regelmäßig aktualisiert, aber nicht täglich. Preisänderungen, neue Features und Datenschutz-Updates können zeitversetzt in der Bewertung reflektiert sein.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-gray-300 text-sm flex-shrink-0 mt-0.5">—</span>
              <div>
                <p className="text-sm font-semibold text-[#111827] mb-1">Kein Ersatz für individuelle Prüfung</p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  LexLab-Scores sind Orientierungswerte aus der Perspektive kleiner DACH-Kanzleien. Für spezifische Anforderungen (z.B. Großkanzlei, spezielles Rechtsgebiet, bestehende IT-Infrastruktur) sollte jedes Tool eigenständig evaluiert werden.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer CTA ─── */}
      <section className="border-t border-gray-100 pt-10 pb-16 max-w-3xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#111827] mb-1">Jetzt mit dem Verzeichnis starten</p>
            <p className="text-sm text-gray-500">Kuratiert, bewertet, eingeordnet — für den DACH-Rechtsmarkt.</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/tools/finder"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#111827] border border-gray-200 hover:border-gray-300 rounded-lg px-4 py-2 transition-colors"
            >
              Finder starten
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 bg-[#111827] hover:bg-[#1a2234] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Tools entdecken
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
