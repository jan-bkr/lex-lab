import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { COMPARE_PAIRS, getComparePair, CompareTool } from '../config'

export const revalidate = 86400

// ─── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return COMPARE_PAIRS.map(c => ({ pair: c.pair }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ pair: string }> }
): Promise<Metadata> {
  const { pair } = await params
  const config = getComparePair(pair)
  if (!config) return {}
  const desc = `${config.toolA.name} vs. ${config.toolB.name} im direkten Vergleich — LexLab Score, Stärken, Schwächen und Einschätzung für DACH-Kanzleien.`
  return {
    title: `${config.toolA.name} vs. ${config.toolB.name}`,
    description: desc,
    openGraph: {
      title: `${config.title} — LexLab Compare`,
      description: desc,
    },
    alternates: { canonical: `https://www.lex-lab.de/tools/compare/${pair}` },
  }
}

// ─── Score bar component ───────────────────────────────────────────────────────

function ScoreBar({
  label,
  scoreA,
  scoreB,
  nameA,
  nameB,
}: {
  label: string
  scoreA: number
  scoreB: number
  nameA: string
  nameB: string
}) {
  const max = 10
  const pctA = (scoreA / max) * 100
  const pctB = (scoreB / max) * 100
  const higher = scoreA > scoreB ? 'A' : scoreB > scoreA ? 'B' : null

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">{label}</p>
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-white/40 w-20 truncate flex-shrink-0">{nameA.split(' ')[0]}</span>
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${higher === 'A' ? 'bg-white' : 'bg-white/40'}`}
            style={{ width: `${pctA}%` }}
          />
        </div>
        <span className={`text-xs font-mono w-6 text-right flex-shrink-0 ${higher === 'A' ? 'text-white font-semibold' : 'text-white/50'}`}>
          {scoreA}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-white/40 w-20 truncate flex-shrink-0">{nameB.split(' ')[0]}</span>
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${higher === 'B' ? 'bg-white' : 'bg-white/40'}`}
            style={{ width: `${pctB}%` }}
          />
        </div>
        <span className={`text-xs font-mono w-6 text-right flex-shrink-0 ${higher === 'B' ? 'text-white font-semibold' : 'text-white/50'}`}>
          {scoreB}
        </span>
      </div>
    </div>
  )
}

// ─── Tool summary card ────────────────────────────────────────────────────────

function ToolCard({ tool, label }: { tool: CompareTool; label: 'A' | 'B' }) {
  const scoreColor =
    tool.scores.total >= 80 ? 'bg-green-100 text-green-800' :
    tool.scores.total >= 60 ? 'bg-amber-100 text-amber-800' :
                              'bg-gray-100 text-gray-700'

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Tool {label}
          </p>
          <h3 className="font-display text-xl text-[#111827] leading-tight">{tool.name}</h3>
        </div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold flex-shrink-0 ${scoreColor}`}>
          {tool.scores.total}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-3 leading-relaxed">{tool.tagline}</p>
      <div className="flex flex-wrap gap-1.5">
        <span className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-2 py-0.5">
          {tool.origin}
        </span>
        <span className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-2 py-0.5">
          {tool.pricing} · {tool.pricingDetail.split('·')[0].trim()}
        </span>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ComparePairPage(
  { params }: { params: Promise<{ pair: string }> }
) {
  const { pair } = await params
  const config = getComparePair(pair)
  if (!config) notFound()

  const { toolA, toolB } = config

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">

      {/* ─── Breadcrumb ─── */}
      <div className="pt-8 pb-0">
        <Link
          href="/tools/compare"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Vergleiche
        </Link>
      </div>

      {/* ─── Header ─── */}
      <section className="mt-6 mb-8 max-w-3xl">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          {config.eyebrow}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-[#111827] leading-tight tracking-tight mb-3">
          {toolA.name}
          <span className="text-gray-300 mx-3 font-normal">vs.</span>
          {toolB.name}
        </h1>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl mb-3">
          {config.context}
        </p>
        <p className="text-xs text-gray-400">
          Stand: {new Date(config.publishedAt).toLocaleDateString('de-DE', { year: 'numeric', month: 'long' })} · Kuratiert von LexLab
        </p>
      </section>

      {/* ─── Verdict box ─── */}
      <section className="mb-8 max-w-3xl">
        <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">LexLab-Einschätzung</p>
          <p className="text-sm text-gray-700 leading-relaxed">{config.verdict}</p>
        </div>
      </section>

      {/* ─── Tool summary cards ─── */}
      <section className="mb-8 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ToolCard tool={toolA} label="A" />
          <ToolCard tool={toolB} label="B" />
        </div>
      </section>

      {/* ─── Score comparison ─── */}
      <section className="mb-8 max-w-3xl">
        <div className="bg-[#111827] rounded-2xl p-6 sm:p-8">
          {/* Total scores */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">LexLab Score</p>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{toolA.scores.total}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{toolA.name.split(' ')[0]}</p>
              </div>
              <span className="text-white/20 text-sm">vs.</span>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{toolB.scores.total}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{toolB.name.split(' ')[0]}</p>
              </div>
            </div>
          </div>

          {/* Dimension bars */}
          <div className="space-y-5">
            <ScoreBar
              label="Praxisreife (35%)"
              scoreA={toolA.scores.praxisreife}
              scoreB={toolB.scores.praxisreife}
              nameA={toolA.name}
              nameB={toolB.name}
            />
            <ScoreBar
              label="DACH-Relevanz (25%)"
              scoreA={toolA.scores.dach}
              scoreB={toolB.scores.dach}
              nameA={toolA.name}
              nameB={toolB.name}
            />
            <ScoreBar
              label="Datenschutz (20%)"
              scoreA={toolA.scores.datenschutz}
              scoreB={toolB.scores.datenschutz}
              nameA={toolA.name}
              nameB={toolB.name}
            />
            <ScoreBar
              label="UX & Bedienbarkeit (10%)"
              scoreA={toolA.scores.ux}
              scoreB={toolB.scores.ux}
              nameA={toolA.name}
              nameB={toolB.name}
            />
            <ScoreBar
              label="Preis-Leistung (10%)"
              scoreA={toolA.scores.preis}
              scoreB={toolB.scores.preis}
              nameA={toolA.name}
              nameB={toolB.name}
            />
          </div>

          <p className="mt-6 pt-4 border-t border-white/10 text-white/30 text-xs">
            Score-Formel: (Praxisreife×35 + DACH×25 + Datenschutz×20 + UX×10 + Preis×10) / 10
          </p>
        </div>
      </section>

      {/* ─── When A / When B ─── */}
      <section className="mb-8 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* When A */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Wann {toolA.name}?
            </p>
            <ul className="space-y-2.5">
              {config.whenA.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="w-3.5 h-3.5 text-[#111827] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* When B */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Wann {toolB.name}?
            </p>
            <ul className="space-y-2.5">
              {config.whenB.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="w-3.5 h-3.5 text-[#111827] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── Strengths + Weaknesses ─── */}
      <section className="mb-10 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tool A detail */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[#111827] px-1">{toolA.name}</p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">Stärken</p>
              <ul className="space-y-1.5">
                {toolA.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">Einschränkungen</p>
              <ul className="space-y-1.5">
                {toolA.weaknesses.map((w, i) => (
                  <li key={i} className="text-xs text-gray-500 flex items-start gap-2">
                    <span className="text-gray-300 mt-0.5 flex-shrink-0">−</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            {/* Pricing detail */}
            <div className="bg-white border border-gray-100 rounded-xl px-4 py-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Preis</p>
              <p className="text-xs text-gray-500">{toolA.pricingDetail}</p>
            </div>
          </div>

          {/* Tool B detail */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[#111827] px-1">{toolB.name}</p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">Stärken</p>
              <ul className="space-y-1.5">
                {toolB.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">Einschränkungen</p>
              <ul className="space-y-1.5">
                {toolB.weaknesses.map((w, i) => (
                  <li key={i} className="text-xs text-gray-500 flex items-start gap-2">
                    <span className="text-gray-300 mt-0.5 flex-shrink-0">−</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            {/* Pricing detail */}
            <div className="bg-white border border-gray-100 rounded-xl px-4 py-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Preis</p>
              <p className="text-xs text-gray-500">{toolB.pricingDetail}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Related collections ─── */}
      {config.relatedCollections.length > 0 && (
        <section className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Passende Shortlists</p>
          <div className="flex flex-wrap gap-2">
            {config.relatedCollections.map(col => (
              <Link
                key={col.slug}
                href={`/collections/${col.slug}`}
                className="inline-flex items-center gap-1.5 bg-white border border-gray-100 hover:border-gray-200 text-sm text-gray-600 hover:text-[#111827] rounded-lg px-3.5 py-2 transition-all"
              >
                {col.label}
                <ArrowRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── Bottom CTAs ─── */}
      <section className="border-t border-gray-100 pt-8 pb-16 max-w-3xl">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Weiter entdecken</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/tools/compare"
            className="flex items-center justify-between gap-2 bg-white border border-gray-100 hover:border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 hover:text-[#111827] transition-all group"
          >
            <span className="font-medium">Alle Vergleiche</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#111827] flex-shrink-0 transition-colors" />
          </Link>
          <Link
            href="/tools/finder"
            className="flex items-center justify-between gap-2 bg-white border border-gray-100 hover:border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 hover:text-[#111827] transition-all group"
          >
            <span className="font-medium">Persönliche Empfehlung</span>
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
