import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  CircleAlert,
  Clock3,
  ExternalLink,
  RefreshCw,
  Scale,
  ShieldCheck,
} from 'lucide-react'
import {
  getLegalModelBenchmark,
  LEGAL_BENCHMARK_METHODOLOGY,
  LEGAL_BENCHMARK_SOURCE,
  type LegalModelBenchmarkRow,
} from '@/lib/legal-model-benchmark'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Legal AI Model Benchmark 2026',
  description: 'Welche Sprachmodelle juristische Vertragsaufgaben vollständig richtig lösen: Aufgaben- und Kriterien-Quote, Form, Kosten und Mandatsdaten-Check. Stand Oktober 2026.',
  openGraph: {
    title: 'Legal AI Model Benchmark 2026 | LexLab',
    description: 'Welche Sprachmodelle eignen sich für juristische Aufgaben? Aktuelle Ergebnisse (Oktober 2026) und Datenschutz-Einordnung für Kanzleien.',
  },
  alternates: { canonical: 'https://www.lex-lab.de/research/legal-model-benchmark' },
}

const RELEASE_WATCH = [
  {
    model: 'Gemini 4 Argon',
    provider: 'Google',
    releasedAt: 'Oktober 2026',
    note: 'Neues Spitzenmodell von Google, in der API als stabil gelistet. In der Legal-Rangliste noch nicht ausgewiesen; dort steht Google bisher nur mit Gemini 3.8 Flash.',
    href: 'https://ai.google.dev/gemini-api/docs/models',
  },
]

// Seit September 2026 neu in der Rangliste (Changelog der Quelle)
const NEW_IN_RANKING = new Set([
  'Claude Opus 5.5',
  'Claude Sonnet 5.5',
  'GPT-6.1 Sol',
  'Claude Haiku 5.5',
  'Mistral Large 4',
])

const TAKEAWAYS = [
  {
    title: 'Spitze geteilt, Preise nicht',
    body: 'Claude Opus 5.5, Claude Fable 5.1 und Muse Spark 1.3 bestehen gleich viele Vertragsaufgaben. Muse Spark kostet je Aufgabe rund 86 % weniger als die beiden Claude-Modelle.',
  },
  {
    title: 'Fast alles richtig ist nicht fertig',
    body: 'GPT-6 Astra erfüllt 87,1 % der Einzelkriterien, besteht aber nur rund ein Viertel der Aufgaben vollständig. Ein verfehltes Kriterium lässt die ganze Aufgabe durchfallen.',
  },
  {
    title: 'Hoher Rang, schmale Basis',
    body: 'Qwen 3.8 Flash steht weit oben, erfüllt aber weniger als die Hälfte der Kriterien. Vor dem Rang lohnt der Blick auf die Kriterien-Quote.',
  },
  {
    title: 'Kein Modell ohne Prüfung',
    body: 'Auch das beste Ergebnis verfehlt in mehr als der Hälfte der Vertragsaufgaben mindestens eine Anforderung. Die anwaltliche Durchsicht bleibt Pflicht.',
  },
]

const DEPLOYMENTS = [
  {
    product: 'ChatGPT / OpenAI API',
    provider: 'OpenAI',
    consumer: 'Nur anonymisiert verwenden',
    professional: 'Business, Enterprise oder API sind prüffähig',
    protection: 'Geschäftsdaten werden standardmäßig nicht zum Modelltraining verwendet; Aufbewahrung und Datenresidenz hängen von Produkt und Vertrag ab.',
    href: 'https://openai.com/business-data/',
  },
  {
    product: 'Claude / Claude API',
    provider: 'Anthropic',
    consumer: 'Nur anonymisiert verwenden',
    professional: 'Team, Enterprise oder API sind prüffähig',
    protection: 'Ein- und Ausgaben kommerzieller Produkte werden standardmäßig nicht für das Modelltraining genutzt; Enterprise bietet zusätzliche Retention Controls.',
    href: 'https://privacy.anthropic.com/en/articles/7996868-is-my-data-used-for-model-training',
  },
  {
    product: 'Gemini / Vertex AI',
    provider: 'Google',
    consumer: 'Nur anonymisiert verwenden',
    professional: 'Workspace Core Service oder Vertex AI sind prüffähig',
    protection: 'Workspace- und Vertex-Angebote bieten Schutz vor Modelltraining ohne Freigabe; der konkrete Workspace-Status muss administrativ geprüft werden.',
    href: 'https://support.google.com/gemini/answer/14620100?hl=en',
  },
]

const COMPLEMENTARY_SIGNALS = [
  {
    source: 'Arena.ai',
    badge: 'Live · Community',
    title: 'Dokumentqualität & Faktentreue',
    adds: 'Die Document Arena vergleicht Modelle bei PDF- und Langdokument-Aufgaben anhand realer Nutzerpräferenzen. Der Factuality-Modus ergänzt Präferenzurteile um die überprüfte Richtigkeit einzelner Web-Claims.',
    limit: 'Kein juristischer Lösungsschlüssel, keine deutsche Rechtsordnung und keine Prüfung von Fundstellenqualität. Rank Spreads zeigen, wie unsicher ein Rang statistisch noch ist.',
    links: [
      { label: 'Document Arena', href: 'https://arena.ai/leaderboard/document/overall-add-style-control' },
      { label: 'Factuality-Methodik', href: 'https://arena.ai/blog/factuality-in-arena' },
    ],
  },
  {
    source: 'METR',
    badge: 'TH 1.1 · Stand Sept. 2026',
    title: 'Mehrstufige Aufgabenreichweite',
    adds: 'Die 50%-Time-Horizon beschreibt die menschliche Expertenzeit einer Aufgabe, bei der ein Agent voraussichtlich in der Hälfte der Fälle erfolgreich ist. Das ist ein nützlicher Hinweis auf planungsintensive Workflows.',
    limit: 'Gemessen werden überwiegend Software-, ML- und Cybersecurity-Aufgaben — nicht Recht. Der Wert ist weder reale Laufzeit noch Garantie für selbstständige Kanzleiarbeit; Messungen über 16 Stunden gelten als unzuverlässig. METR aktualisiert die Seite seit dem 8. September 2026 nicht mehr aktiv.',
    links: [
      { label: 'METR Time Horizons', href: 'https://metr.org/time-horizons/' },
    ],
  },
]

function providerAccent(provider: string) {
  if (provider === 'OpenAI') return 'bg-emerald-500'
  if (provider === 'Anthropic') return 'bg-orange-500'
  if (provider === 'Google') return 'bg-blue-500'
  return 'bg-gray-400'
}

function formatCost(row: LegalModelBenchmarkRow) {
  return `$${row.costPerTask.toFixed(2)}`
}

function formatPercent(value: number) {
  return `${value.toFixed(1).replace('.', ',')} %`
}

export default async function LegalModelBenchmarkPage() {
  const benchmark = await getLegalModelBenchmark()
  const leaders = benchmark.rows.filter(row => row.rank === 1)
  // Sobald die Quelle ein beobachtetes Modell rankt, verschwindet es aus dem Release Watch
  const pendingReleases = RELEASE_WATCH.filter(item => !benchmark.rows.some(row => row.model === item.model))

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
      <section className="pt-14 pb-10 max-w-4xl">
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded px-2 py-1 uppercase tracking-wider">
            LexLab Research
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-2 py-1 uppercase tracking-wider">
            <RefreshCw className="w-3 h-3" />
            Täglicher Abgleich
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-6xl text-[#111827] leading-[1.05] tracking-tight mb-6">
          Legal AI<br />Model Benchmark
        </h1>
        <p className="text-gray-500 text-lg sm:text-xl leading-relaxed max-w-3xl">
          Welche Sprachmodelle erledigen juristische Aufgaben vollständig richtig, und unter welchen Bedingungen darf eine Kanzlei sie einsetzen? Leistung und Mandatsdatenschutz werden bewusst getrennt bewertet. Stand: {benchmark.sourceUpdatedAt}.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-14 max-w-4xl">
        <div className="bg-[#111827] rounded-2xl p-5 text-white">
          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">{leaders.length > 1 ? 'Geteilte Spitze' : 'Spitze'}</p>
          <p className="font-display text-xl leading-tight mb-1">{leaders.map(row => row.model).join(' · ')}</p>
          <p className="text-sm text-white/50">{formatPercent(leaders[0].taskPass)} der Aufgaben vollständig bestanden</p>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">Vergleichsfeld</p>
          <p className="font-display text-2xl text-[#111827] mb-1">{benchmark.rows.length} Modelle</p>
          <p className="text-sm text-gray-500">{benchmark.sourceUpdatedAt}</p>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">Testumfang</p>
          <p className="font-display text-2xl text-[#111827] mb-1">2 Durchläufe</p>
          <p className="text-sm text-gray-500">je Aufgabe, beide müssen bestehen</p>
        </div>
      </section>

      <section className="mb-16" aria-labelledby="leaderboard-heading">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Praxis-Benchmark</p>
            <h2 id="leaderboard-heading" className="font-display text-3xl text-[#111827] tracking-tight mb-2">
              Vertragsarbeit: vollständig richtig oder durchgefallen
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Der Rang folgt der Aufgaben-Quote: Eine Aufgabe gilt nur als bestanden, wenn jedes Kriterium in beiden Durchläufen erfüllt ist. Die Kriterien-Quote zeigt, wie nah ein Modell dran war. Form misst, ob ein Anwalt das Ergebnis so verwenden würde. Kosten und Dauer beeinflussen den Rang nicht.
            </p>
          </div>
          <a
            href={LEGAL_BENCHMARK_SOURCE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#111827] flex-shrink-0"
          >
            Primärquelle <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
          <div className="sm:hidden px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-[10px] text-gray-400 text-right">
            ← Seitlich scrollen für alle Werte →
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12">#</th>
                  <th className="py-3 px-4">Modell</th>
                  <th className="py-3 px-4">Aufgaben bestanden</th>
                  <th className="py-3 px-4">Kriterien erfüllt</th>
                  <th className="py-3 px-4">Form</th>
                  <th className="py-3 px-4 text-right">Kosten / Aufgabe</th>
                  <th className="py-3 px-4 text-right">Dauer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {benchmark.rows.map(row => (
                  <tr key={`${row.provider}-${row.model}`} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 text-xs font-mono text-gray-300">{String(row.rank).padStart(2, '0')}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-1.5 h-7 rounded-full flex-shrink-0 ${providerAccent(row.provider)}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#111827]">{row.model}</span>
                            {NEW_IN_RANKING.has(row.model) && (
                              <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 rounded px-1.5 py-0.5 uppercase tracking-wide">Neu</span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">{row.provider}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold tabular-nums text-[#111827] w-14">{formatPercent(row.taskPass)}</span>
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#111827] rounded-full" style={{ width: `${row.taskPass}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm tabular-nums text-gray-600">{formatPercent(row.criteriaPass)}</td>
                    <td className="py-4 px-4 text-sm tabular-nums text-gray-600">{formatPercent(row.form)}</td>
                    <td className="py-4 px-4 text-sm tabular-nums text-gray-600 text-right">{formatCost(row)}</td>
                    <td className="py-4 px-4 text-sm tabular-nums text-gray-400 text-right whitespace-nowrap">{row.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50/60 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-gray-400">
            <span>Quelle: Legal AI Benchmarking · Contract Workflows · Kosten in USD zu Listenpreisen · „Neu“ = seit September 2026 aufgenommen</span>
            <span>{benchmark.sourceMode === 'live' ? `Quelle synchronisiert · ${benchmark.sourceUpdatedAt}` : `Geprüfter Datensatz · ${benchmark.sourceUpdatedAt}`}</span>
          </div>
        </div>
      </section>

      <section className="mb-16" aria-labelledby="takeaways-heading">
        <div className="max-w-3xl mb-6">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Oktober-Runde</p>
          <h2 id="takeaways-heading" className="font-display text-3xl text-[#111827] tracking-tight mb-2">Was die aktuelle Runde zeigt</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Kernaussagen der Quelle zur Oktober-Auswertung, übersetzt und gekürzt.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TAKEAWAYS.map(item => (
            <article key={item.title} className="border border-gray-100 rounded-2xl bg-white p-5">
              <h3 className="font-semibold text-[#111827] mb-1.5">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-16" aria-labelledby="signals-heading">
        <div className="max-w-3xl mb-6">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Ergänzende Qualitätssignale</p>
          <h2 id="signals-heading" className="font-display text-3xl text-[#111827] tracking-tight mb-2">Was Arena und METR zusätzlich zeigen</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Legal-Richtigkeit bleibt der Kern. Die folgenden externen Messungen liefern einen zweiten Blick auf Dokumentarbeit, Faktentreue und mehrstufige Ausführung — werden aber bewusst nicht in den Legal-Rang eingerechnet.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {COMPLEMENTARY_SIGNALS.map(signal => (
            <article key={signal.source} className="border border-gray-100 rounded-2xl bg-white p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-1">{signal.source}</p>
                  <h3 className="font-display text-xl text-[#111827]">{signal.title}</h3>
                </div>
                <span className="text-[9px] font-semibold text-gray-500 bg-gray-50 border border-gray-100 rounded px-2 py-1 text-right flex-shrink-0 max-w-[45%]">
                  {signal.badge}
                </span>
              </div>

              <div className="space-y-4 mb-5">
                <div>
                  <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mb-1.5">Was es ergänzt</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{signal.adds}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-amber-600 uppercase tracking-wider mb-1.5">Nicht übertragbar</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{signal.limit}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-4 border-t border-gray-100">
                {signal.links.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-[#111827]"
                  >
                    {link.label} <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 flex gap-3">
          <Scale className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-900/70 leading-relaxed">
            <strong className="font-semibold text-blue-900">LexLab-Lesart:</strong> Legal-Benchmark für fachliche Verlässlichkeit, Arena für erlebte Antwort- und Dokumentqualität, METR für agentische Aufgabenreichweite. Ein starkes Signal kann ein schwaches in einer anderen Dimension nicht ausgleichen.
          </p>
        </div>
      </section>

      {pendingReleases.length > 0 && (
      <section className="mb-16" aria-labelledby="watch-heading">
        <div className="max-w-2xl mb-6">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Release Watch</p>
          <h2 id="watch-heading" className="font-display text-3xl text-[#111827] tracking-tight mb-2">Neu veröffentlicht, noch nicht gerankt</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Neue Modelle erhalten erst dann einen Rang, wenn ein dokumentierter Legal-Test vorliegt. So wird Marketing nicht mit Messung verwechselt.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingReleases.map(item => (
            <a
              key={item.model}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-amber-100 bg-amber-50/50 rounded-2xl p-5 hover:border-amber-200 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider mb-1">Evaluation ausstehend</p>
                  <h3 className="font-display text-xl text-[#111827]">{item.model}</h3>
                </div>
                <Clock3 className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-xs text-gray-400 mb-2">{item.provider} · veröffentlicht {item.releasedAt}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{item.note}</p>
            </a>
          ))}
        </div>
      </section>
      )}

      <section className="mb-16" aria-labelledby="privacy-heading">
        <div className="max-w-3xl mb-6">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Mandatsdaten-Check</p>
          <h2 id="privacy-heading" className="font-display text-3xl text-[#111827] tracking-tight mb-2">Modellleistung ist nicht Produktfreigabe</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            ChatGPT, Claude und Gemini sind Anwendungen; GPT-6, Claude Opus oder Gemini 4 Argon sind Modelle. Für Verschwiegenheit und Datenschutz zählt das konkrete Produkt, der Tarif, die Konfiguration und der Vertrag — nicht der Benchmarkplatz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
          {DEPLOYMENTS.map(item => (
            <article key={item.product} className="border border-gray-100 rounded-2xl p-5 bg-white">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{item.provider}</p>
                  <h3 className="font-semibold text-[#111827]">{item.product}</h3>
                </div>
                <ShieldCheck className="w-4 h-4 text-gray-300" />
              </div>
              <div className="space-y-3 mb-4">
                <div className="rounded-xl bg-red-50 border border-red-100 p-3">
                  <p className="text-[9px] font-bold text-red-600 uppercase tracking-wider mb-1">Consumer-Zugang</p>
                  <p className="text-xs font-medium text-red-800">{item.consumer}</p>
                </div>
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                  <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Organisationszugang</p>
                  <p className="text-xs font-medium text-emerald-800">{item.professional}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{item.protection}</p>
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-[#111827]">
                Anbieterangaben <ExternalLink className="w-3 h-3" />
              </a>
            </article>
          ))}
        </div>

        <div className="flex gap-3 bg-[#111827] rounded-2xl p-5 sm:p-6 text-white">
          <CircleAlert className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold mb-1">Kein Tarif ist automatisch kanzleifreigegeben.</p>
            <p className="text-sm text-white/60 leading-relaxed">
              Vor Mandatsdaten sind mindestens Verschwiegenheit, Auftragsverarbeitung, Speicherfristen, Datenstandort, Unterauftragsverarbeiter, Zugriffsrechte und Kanzleirichtlinie konkret zu prüfen. Im Zweifel ausschließlich anonymisierte oder synthetische Inhalte verwenden.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16 grid grid-cols-1 lg:grid-cols-[1fr_0.7fr] gap-8 border-t border-gray-100 pt-10">
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Methodik & Grenzen</p>
          <h2 className="font-display text-2xl text-[#111827] tracking-tight mb-5">Was die Zahlen aussagen — und was nicht</h2>
          <div className="space-y-4">
            {[
              ['Praxisnaher Ausschnitt', 'Von Anwälten verfasste Aufgaben mit festen Bestanden-/Nicht-bestanden-Kriterien, Schwerpunkt Commercial, IP, Employment, M&A und Competition. Die Modelle arbeiten in einer abgeschlossenen Umgebung ohne Webzugriff und liefern Dateien ab.'],
              ['Kein deutscher Rechtsbenchmark', 'Die Aufgaben stammen aus 21 Rechtsordnungen, sind aber englischsprachig und US-/UK-lastig. Aussagen zu deutschem Recht, deutscher Zitierpraxis oder Fachterminologie lassen sich daraus nicht ableiten.'],
              ['Neue Methodik, kein Zeitvergleich', 'Seit August/September 2026 arbeiten die Modelle agentisch mit Dateien und jede Aufgabe läuft zweimal. Ergebnisse früherer Runden sind laut Quelle nicht vergleichbar. Bewertet wird durch geprüfte KI-Gutachter mit Stichproben durch Menschen.'],
              ['Automatische Aktualisierung mit Sicherheitsnetz', 'LexLab gleicht die veröffentlichte Rangliste alle 24 Stunden ab. Neu getestete Modelle erscheinen automatisch; fällt die Quelle aus oder ändert ihr Format, bleibt der zuletzt geprüfte Datensatz sichtbar.'],
            ].map(([title, body], index) => (
              <div key={title} className="flex gap-4">
                <span className="font-mono text-xs text-gray-200 pt-0.5">0{index + 1}</span>
                <div>
                  <p className="text-sm font-semibold text-[#111827] mb-1">{title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <aside className="bg-gray-50 border border-gray-100 rounded-2xl p-6 self-start">
          <Scale className="w-5 h-5 text-gray-300 mb-4" />
          <h3 className="font-semibold text-[#111827] mb-2">Weiterführende Quellen</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            Die Rangliste basiert auf dem unabhängigen Legal AI Benchmarking. Die Methodik der Quelle erklärt Aufgaben, Bewertung und Grenzen im Detail. LegalBench der Stanford-Community liefert zusätzlich eine offene Sammlung von 162 Legal-Reasoning-Aufgaben.
          </p>
          <div className="space-y-2">
            <a href={LEGAL_BENCHMARK_SOURCE} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm text-gray-600 hover:text-[#111827]">
              Legal AI Benchmarking <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a href={LEGAL_BENCHMARK_METHODOLOGY} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm text-gray-600 hover:text-[#111827]">
              Methodik der Quelle <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a href="https://hazyresearch.stanford.edu/legalbench/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm text-gray-600 hover:text-[#111827]">
              Stanford LegalBench <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a href="https://arena.ai/leaderboard/document/overall-add-style-control" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm text-gray-600 hover:text-[#111827]">
              Arena Document Leaderboard <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a href="https://metr.org/time-horizons/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm text-gray-600 hover:text-[#111827]">
              METR Time Horizons <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </aside>
      </section>

      <section className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <p className="text-sm font-semibold text-[#111827] mb-1">Spezialisierte Legal-AI-Produkte vergleichen</p>
          <p className="text-sm text-gray-500">Basismodelle sind nur eine Schicht des Kanzlei-Stacks.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/tools/compare" className="inline-flex items-center gap-1.5 border border-gray-200 text-sm font-medium text-gray-700 px-4 py-2.5 rounded-lg hover:border-gray-300 transition-colors">
            Tool-Vergleiche <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link href="/skill-bibliothek" className="inline-flex items-center gap-1.5 bg-[#111827] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#1a2234] transition-colors">
            Skill-Bibliothek <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </main>
  )
}
