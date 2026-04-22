'use client'

import Link from 'next/link'
import { Clock, ArrowRight, Users, ShieldCheck } from 'lucide-react'
import { RechtsgebietTag } from '@/components/RechtsgebietTag'
import { Rechtsgebiet } from '@/types'
import { useState } from 'react'
import {
  WORKFLOW_BLUEPRINTS,
  MATURITY_CONFIG,
  STEP_TYPE_CONFIG,
  type DbWorkflowRow,
  type WorkflowBlueprint,
} from './blueprints'

const RECHTSGEBIETE: Rechtsgebiet[] = ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Venture Capital']

// ─── DB row → display item adapter ────────────────────────────────────────────
interface DbDisplayItem {
  kind: 'db'
  id: string
  slug: string
  title: string
  rechtsgebiet: Rechtsgebiet[]
  readingTime: number
  excerpt: string
}

function mapDbRow(row: DbWorkflowRow): DbDisplayItem {
  return {
    kind: 'db',
    id: row.id,
    slug: row.slug,
    title: row.title,
    rechtsgebiet: (row.rechtsgebiet ?? []) as Rechtsgebiet[],
    readingTime: row.reading_time ?? 0,
    excerpt: row.excerpt ?? '',
  }
}

// ─── Step type dot summary for cards ──────────────────────────────────────────
function StepTypeSummary({ blueprint }: { blueprint: WorkflowBlueprint }) {
  const reviewCount = blueprint.steps.filter(
    s => s.type === 'review_gate' || s.type === 'human_approval'
  ).length

  const typeMap: Partial<Record<string, number>> = {}
  for (const s of blueprint.steps) {
    typeMap[s.type] = (typeMap[s.type] ?? 0) + 1
  }

  return (
    <div className="flex items-center gap-3 text-[11px] text-gray-400">
      <span className="inline-flex items-center gap-1">
        <span className="font-medium text-gray-600">{blueprint.steps.length}</span> Schritte
      </span>
      {reviewCount > 0 && (
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-amber-500" />
          <span className="font-medium text-amber-600">{reviewCount}</span> Review Gates
        </span>
      )}
    </div>
  )
}

// ─── Blueprint card ────────────────────────────────────────────────────────────
function BlueprintCard({ blueprint }: { blueprint: WorkflowBlueprint }) {
  const maturity = MATURITY_CONFIG[blueprint.maturity]

  // Show the dominant step types as colored dots
  const typeOrder = ['retrieval', 'assistive', 'drafting', 'source_check', 'review_gate', 'human_approval', 'handover']
  const uniqueTypes = typeOrder.filter(t => blueprint.steps.some(s => s.type === t))

  return (
    <Link
      href={`/workflows/${blueprint.slug}`}
      className="group block bg-white border border-gray-100 rounded-xl p-6 hover:shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:border-gray-200 transition-all duration-200 flex flex-col gap-4"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {blueprint.rechtsgebiet.map(rg => (
            <RechtsgebietTag key={rg} tag={rg as Rechtsgebiet} />
          ))}
        </div>
        <span className={`flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md whitespace-nowrap ${maturity.cls}`}>
          {maturity.label}
        </span>
      </div>

      {/* Title + subtitle */}
      <div className="flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
          {blueprint.categoryLabel}
        </p>
        <h2 className="font-display text-[16px] text-gray-900 leading-snug mb-1.5 group-hover:text-[#111827] transition-colors">
          {blueprint.title}
        </h2>
        <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">
          {blueprint.problem}
        </p>
      </div>

      {/* Step type dots */}
      <div className="flex items-center gap-1.5">
        {uniqueTypes.map(t => (
          <span
            key={t}
            title={STEP_TYPE_CONFIG[t as keyof typeof STEP_TYPE_CONFIG]?.label}
            className={`w-2 h-2 rounded-full flex-shrink-0 ${STEP_TYPE_CONFIG[t as keyof typeof STEP_TYPE_CONFIG]?.dotCls ?? 'bg-gray-300'}`}
          />
        ))}
        <span className="text-[11px] text-gray-400 ml-1">
          {uniqueTypes.map(t => STEP_TYPE_CONFIG[t as keyof typeof STEP_TYPE_CONFIG]?.label).filter(Boolean).join(' · ')}
        </span>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <StepTypeSummary blueprint={blueprint} />
          <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
            <Users className="w-3 h-3" />
            {blueprint.audience.join(', ')}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
          <Clock className="w-3 h-3" />
          {blueprint.readingTime} min
        </span>
      </div>
    </Link>
  )
}

// ─── DB-only workflow card (fallback for DB workflows without a blueprint) ─────
function DbWorkflowCard({ item }: { item: DbDisplayItem }) {
  const BORDER_COLORS: Record<string, string> = {
    Steuerrecht: 'border-l-emerald-400',
    'M&A': 'border-l-purple-400',
    Gesellschaftsrecht: 'border-l-blue-400',
    'Venture Capital': 'border-l-orange-400',
  }
  const borderCls = BORDER_COLORS[item.rechtsgebiet[0]] ?? 'border-l-gray-300'

  return (
    <Link
      href={`/workflows/${item.slug}`}
      className={`group bg-white border border-gray-100 border-l-4 ${borderCls} rounded-xl p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200 flex flex-col gap-3`}
    >
      <div className="flex items-center gap-2 flex-wrap">
        {item.rechtsgebiet.map(tag => (
          <RechtsgebietTag key={tag} tag={tag} />
        ))}
      </div>
      <div className="flex-1">
        <h2 className="font-display text-[15px] text-gray-900 leading-snug mb-1.5 group-hover:text-[#111827] transition-colors">
          {item.title}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{item.excerpt}</p>
      </div>
      <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          {item.readingTime} Min.
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 group-hover:gap-2 transition-all">
          Ansehen <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function WorkflowsClient({ initialDbWorkflows }: { initialDbWorkflows: DbWorkflowRow[] }) {
  const [activeFilter, setActiveFilter] = useState<Rechtsgebiet | 'Alle'>('Alle')

  const dbItems = initialDbWorkflows.map(mapDbRow)

  // Blueprints always shown; DB rows only shown if no blueprint has the same slug
  const blueprintSlugs = new Set(WORKFLOW_BLUEPRINTS.map(b => b.slug))
  const extraDbItems = dbItems.filter(item => !blueprintSlugs.has(item.slug))

  const filteredBlueprints =
    activeFilter === 'Alle'
      ? WORKFLOW_BLUEPRINTS
      : WORKFLOW_BLUEPRINTS.filter(b =>
          b.rechtsgebiet.includes(activeFilter)
        )

  const filteredDbExtras =
    activeFilter === 'Alle'
      ? extraDbItems
      : extraDbItems.filter(item => item.rechtsgebiet.includes(activeFilter))

  const totalItems = filteredBlueprints.length + filteredDbExtras.length

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Legal Workflow Intelligence
        </p>
        <h1 className="font-display text-3xl text-gray-900 mb-3">Workflow Blueprints</h1>
        <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
          Strukturierte Arbeitsarchitekturen für KI-gestützte Rechtspraxis. Jeder Blueprint
          dokumentiert Schritte, KI-Rollen, Human Review Gates und Datenschutzhinweise —
          damit du KI verantwortungsvoll und effektiv in deinen Arbeitsablauf integrieren kannst.
        </p>

        {/* Agent role legend */}
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
          {(['retrieval', 'assistive', 'drafting', 'review_gate', 'human_approval', 'source_check'] as const).map(t => (
            <span key={t} className="inline-flex items-center gap-1.5 text-[11px] text-gray-500">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STEP_TYPE_CONFIG[t].dotCls}`} />
              {STEP_TYPE_CONFIG[t].label}
            </span>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5 mb-7">
        {(['Alle', ...RECHTSGEBIETE] as const).map(rg => (
          <button
            key={rg}
            onClick={() => setActiveFilter(rg)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              activeFilter === rg
                ? 'bg-[#111827] text-white border-[#111827]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {rg}
          </button>
        ))}
      </div>

      {/* Grid */}
      {totalItems === 0 ? (
        <div className="text-center py-16 text-sm text-gray-400">
          Keine Blueprints für dieses Rechtsgebiet gefunden.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBlueprints.map(bp => (
            <BlueprintCard key={bp.slug} blueprint={bp} />
          ))}
          {filteredDbExtras.map(item => (
            <DbWorkflowCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Bottom explainer */}
      <div className="mt-14 border-t border-gray-100 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
            Was ist ein Blueprint?
          </p>
          <p className="text-[13px] text-gray-500 leading-relaxed">
            Jeder Blueprint dokumentiert einen juristischen oder steuerlichen Arbeitsablauf
            mit klaren Schritten, KI-Rollen und menschlichen Kontrollpunkten.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
            Human-in-the-loop
          </p>
          <p className="text-[13px] text-gray-500 leading-relaxed">
            Review Gates und Freigabeschritte sind kein Einschränkungssignal — sie sind ein
            Qualitätsmerkmal. Fachverantwortung verbleibt stets beim Berufsträger.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
            Reifegrade
          </p>
          <p className="text-[13px] text-gray-500 leading-relaxed">
            <span className="font-medium text-gray-700">Praxisnah</span> · direkt einsetzbar ·{' '}
            <span className="font-medium text-gray-700">Blueprint</span> · konzeptionell ausgereift ·{' '}
            <span className="font-medium text-gray-700">Research-led</span> · forschungsbasiert
          </p>
        </div>
      </div>
    </div>
  )
}
