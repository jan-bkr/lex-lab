'use client'

import Link from 'next/link'
import { ArrowLeft, Clock, Users, ShieldCheck, AlertTriangle, Lock, ArrowRight } from 'lucide-react'
import { RechtsgebietTag } from '@/components/RechtsgebietTag'
import { Rechtsgebiet } from '@/types'
import {
  WORKFLOW_BLUEPRINTS,
  MATURITY_CONFIG,
  STEP_TYPE_CONFIG,
  type WorkflowBlueprint,
  type BlueprintStep,
  type DbWorkflowRow,
} from '../blueprints'

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
      {children}
    </p>
  )
}

function ReviewGateMarker() {
  return (
    <div className="flex items-center gap-2 py-1 my-1">
      <div className="flex-1 h-px bg-amber-200" />
      <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1 whitespace-nowrap">
        <ShieldCheck className="w-3 h-3" />
        Review Gate
      </span>
      <div className="flex-1 h-px bg-amber-200" />
    </div>
  )
}

function HumanApprovalMarker() {
  return (
    <div className="flex items-center gap-2 py-1 my-1">
      <div className="flex-1 h-px bg-gray-300" />
      <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-100 bg-gray-900 border border-gray-700 rounded-full px-2.5 py-1 whitespace-nowrap">
        <Lock className="w-3 h-3" />
        Freigabe
      </span>
      <div className="flex-1 h-px bg-gray-300" />
    </div>
  )
}

function StepCard({ step, index, isLast }: { step: BlueprintStep; index: number; isLast: boolean }) {
  const cfg = STEP_TYPE_CONFIG[step.type]
  const isGate = step.type === 'review_gate' || step.type === 'human_approval'

  return (
    <div className="relative flex gap-4">
      {/* Step number + connector */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ring-2 z-10 ${cfg.numBg} ${cfg.numText} ${cfg.numRing}`}>
          {String(index + 1).padStart(2, '0')}
        </div>
        {!isLast && (
          <div className={`w-px flex-1 mt-1.5 mb-0 min-h-[24px] ${isGate ? 'bg-amber-200' : 'bg-gray-100'}`} />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-6 ${isLast ? '' : ''}`}>
        <div className={`rounded-xl border p-4 ${cfg.cardCls}`}>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${cfg.badgeCls}`}>
                {cfg.label}
              </span>
              {step.duration && (
                <span className="text-[11px] text-gray-400 inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {step.duration}
                </span>
              )}
            </div>
          </div>
          <h3 className={`text-sm font-semibold mb-1.5 leading-snug ${isGate ? '' : 'text-gray-900'}`}>
            {step.title}
          </h3>
          <p className={`text-[13px] leading-relaxed ${isGate && step.type === 'human_approval' ? 'text-gray-400' : 'text-gray-500'}`}>
            {step.description}
          </p>
          {step.tool && (
            <p className="mt-2.5 text-[11px] text-gray-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
              {step.tool}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Blueprint detail view ─────────────────────────────────────────────────────

function BlueprintDetail({ blueprint }: { blueprint: WorkflowBlueprint }) {
  const maturity = MATURITY_CONFIG[blueprint.maturity]

  // Insert visual markers before review_gate and human_approval steps
  const stepsWithMarkers: Array<{ kind: 'step'; step: BlueprintStep; originalIndex: number } | { kind: 'marker'; type: 'review_gate' | 'human_approval' }> = []
  blueprint.steps.forEach((step, i) => {
    if (step.type === 'review_gate') {
      stepsWithMarkers.push({ kind: 'marker', type: 'review_gate' })
    } else if (step.type === 'human_approval') {
      stepsWithMarkers.push({ kind: 'marker', type: 'human_approval' })
    }
    stepsWithMarkers.push({ kind: 'step', step, originalIndex: i })
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

      {/* Back link */}
      <Link
        href="/workflows"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Workflow Blueprints
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">

        {/* ── Left: main content ── */}
        <div>
          {/* Header */}
          <div className="mb-7">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {blueprint.rechtsgebiet.map(rg => (
                <RechtsgebietTag key={rg} tag={rg as Rechtsgebiet} />
              ))}
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${maturity.cls}`}>
                {maturity.label}
              </span>
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
              {blueprint.categoryLabel}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl text-gray-900 leading-snug mb-1.5">
              {blueprint.title}
            </h1>
            <p className="text-gray-500 text-base">{blueprint.subtitle}</p>

            {/* Meta bar */}
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-gray-400 border-t border-gray-100 pt-4">
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {blueprint.audience.join(' · ')}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {blueprint.readingTime} min Lesezeit
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                {blueprint.humanReviewGates.length} Review Gates
              </span>
              <span className="text-gray-400">
                DACH-Relevanz: <span className="font-medium text-gray-600">{blueprint.dachRelevance}</span>
              </span>
            </div>
          </div>

          {/* Problem + Ziel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Problem</p>
              <p className="text-[13px] text-gray-600 leading-relaxed">{blueprint.problem}</p>
            </div>
            <div className="bg-[#111827] rounded-xl p-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Ziel</p>
              <p className="text-[13px] text-gray-300 leading-relaxed">{blueprint.goal}</p>
            </div>
          </div>

          {/* Workflow steps */}
          <div className="mb-8">
            <SectionLabel>Workflow-Schritte</SectionLabel>
            <div className="space-y-0">
              {stepsWithMarkers.map((item, i) => {
                if (item.kind === 'marker') {
                  return item.type === 'review_gate'
                    ? <ReviewGateMarker key={`marker-${i}`} />
                    : <HumanApprovalMarker key={`marker-${i}`} />
                }
                return (
                  <StepCard
                    key={item.step.id}
                    step={item.step}
                    index={item.originalIndex}
                    isLast={item.originalIndex === blueprint.steps.length - 1}
                  />
                )
              })}
            </div>
          </div>

          {/* Human Review Gates */}
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <SectionLabel>Human Review Gates</SectionLabel>
            </div>
            <ul className="space-y-2">
              {blueprint.humanReviewGates.map((gate, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13px] text-amber-800">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  {gate}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-amber-600 leading-relaxed">
              Review Gates sind kein Einschränkungssignal — sie sind ein Qualitätsmerkmal. Fachverantwortung verbleibt stets beim Berufsträger.
            </p>
          </div>

          {/* Output */}
          <div className="mb-8">
            <SectionLabel>Output & Deliverables</SectionLabel>
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <p className="text-[13px] text-gray-700 leading-relaxed">{blueprint.output}</p>
            </div>
          </div>

          {/* Risks */}
          <div className="mb-8">
            <SectionLabel>Grenzen & Red Flags</SectionLabel>
            <div className="space-y-2">
              {blueprint.risks.map((risk, i) => (
                <div key={i} className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3">
                  <AlertTriangle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[13px] text-gray-600 leading-relaxed">{risk}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Datenschutz */}
          <div className="mb-2">
            <SectionLabel>Datenschutz & DACH</SectionLabel>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="text-[13px] text-slate-600 leading-relaxed">{blueprint.datenschutzNote}</p>
            </div>
          </div>
        </div>

        {/* ── Right: sidebar ── */}
        <div className="space-y-4 lg:pt-[112px]">

          {/* Inputs */}
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
              Benötigte Inputs
            </p>
            <ul className="space-y-1.5">
              {blueprint.inputs.map((inp, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] text-gray-600">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                  {inp}
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
              Beteiligte Tools & Systeme
            </p>
            <div className="space-y-3">
              {blueprint.tools.map((tool, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-semibold text-gray-800">{tool.name}</span>
                    {tool.optional && (
                      <span className="text-[9px] text-gray-400 bg-gray-100 rounded px-1 py-0.5 uppercase tracking-wide">
                        optional
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug">{tool.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related collection */}
          {blueprint.relatedCollectionSlug && (
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                Passende Collection
              </p>
              <Link
                href={`/collections/${blueprint.relatedCollectionSlug}`}
                className="flex items-center justify-between gap-2 text-[13px] text-gray-700 hover:text-[#111827] font-medium group transition-colors"
              >
                <span>Passende Tools entdecken</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
              </Link>
            </div>
          )}

          {/* Explore more */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Weiter entdecken
            </p>
            <Link href="/tools" className="flex items-center justify-between gap-2 text-[12px] text-gray-600 hover:text-[#111827] group transition-colors">
              <span>KI-Tools für Juristen</span>
              <ArrowRight className="w-3 h-3 text-gray-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </Link>
            <Link href="/prompts" className="flex items-center justify-between gap-2 text-[12px] text-gray-600 hover:text-[#111827] group transition-colors">
              <span>Prompt-Bibliothek</span>
              <ArrowRight className="w-3 h-3 text-gray-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </Link>
            <Link href="/workflows" className="flex items-center justify-between gap-2 text-[12px] text-gray-600 hover:text-[#111827] group transition-colors">
              <span>Alle Blueprints</span>
              <ArrowRight className="w-3 h-3 text-gray-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </Link>
          </div>

          {/* Newsletter */}
          <div className="bg-[#111827] rounded-xl p-4">
            <p className="text-[11px] font-semibold text-gray-300 mb-1">LexLab Weekly Brief</p>
            <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
              Neue Blueprints, Tools und Prompts — kuratiert für den deutschen Rechtsmarkt.
            </p>
            <Link
              href="/newsletter"
              className="block text-center bg-white/10 hover:bg-white/15 text-gray-200 text-[11px] font-medium px-3 py-2 rounded-lg transition-colors"
            >
              Abonnieren
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Fallback for DB workflows without a blueprint ─────────────────────────────

function DbWorkflowDetail({ dbWorkflow }: { dbWorkflow: DbWorkflowRow }) {
  const blueprint = WORKFLOW_BLUEPRINTS.find(b => b.slug === dbWorkflow.slug)
  if (blueprint) return <BlueprintDetail blueprint={blueprint} />

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/workflows"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Workflow Blueprints
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {(dbWorkflow.rechtsgebiet ?? []).map((rg: string) => (
              <RechtsgebietTag key={rg} tag={rg as Rechtsgebiet} />
            ))}
            {dbWorkflow.reading_time && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {dbWorkflow.reading_time} Min. Lesezeit
              </span>
            )}
          </div>

          <h1 className="font-display text-2xl text-gray-900 mb-4 leading-snug">
            {dbWorkflow.title}
          </h1>

          {dbWorkflow.excerpt && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 border-l-4 border-l-blue-200 mb-6">
              <p className="text-[15px] text-gray-600 leading-relaxed">{dbWorkflow.excerpt}</p>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
              Weiter entdecken
            </p>
            <Link href="/tools" className="block text-[12px] text-gray-600 hover:text-[#111827] py-1.5 transition-colors">
              KI-Tools für Juristen →
            </Link>
            <Link href="/prompts" className="block text-[12px] text-gray-600 hover:text-[#111827] py-1.5 transition-colors">
              Prompt-Bibliothek →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Root export ───────────────────────────────────────────────────────────────

export default function WorkflowDetailClient({
  blueprint,
  dbWorkflow,
  slug,
}: {
  blueprint: WorkflowBlueprint | null
  dbWorkflow: DbWorkflowRow | null
  slug: string
}) {
  if (blueprint) return <BlueprintDetail blueprint={blueprint} />
  if (dbWorkflow) return <DbWorkflowDetail dbWorkflow={dbWorkflow} />

  // Should not reach here — server page calls notFound() when neither exists
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
      <p className="text-sm text-gray-500">
        Workflow &quot;{slug}&quot; nicht gefunden.{' '}
        <Link href="/workflows" className="text-blue-600 hover:text-blue-700 font-medium">
          Alle Blueprints
        </Link>
      </p>
    </div>
  )
}
