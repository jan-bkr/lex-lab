'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronUp, Copy, Check, ArrowLeft, MessageSquare, Grid3X3 } from 'lucide-react'
import { RechtsgebietTag } from '@/components/RechtsgebietTag'
import { createClient } from '@/lib/supabase/client'
import { Tool, ToolComment, Rechtsgebiet } from '@/types'
import { useAnalytics } from '@/hooks/useAnalytics'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SupabaseToolRow {
  id: string
  name: string
  slug: string
  url: string
  tagline: string | null
  description: string | null
  rechtsgebiet: string[] | null
  category: string[] | null
  votes: number | null
  is_new: boolean | null
  status: string
  featured: boolean | null
  created_at: string
  pricing: 'free' | 'freemium' | 'paid' | 'enterprise' | null
  pricing_url: string | null
  screenshot_url: string | null
  // Premium profile fields
  long_description: string | null
  best_for: string[] | null
  not_for: string[] | null
  verdict: string | null
  last_reviewed_at: string | null
  score_praxisreife: number | null
  score_datenschutz: number | null
  score_dach: number | null
  score_ux: number | null
  score_preis: number | null
  lexlab_score: number | null
}

// Minimal shape used only for the "Ähnliche Tools" sidebar list
interface SimilarToolRow {
  id: string
  name: string
  slug: string
  rechtsgebiet: string[] | null
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapRow(row: SupabaseToolRow): Tool {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    url: row.url,
    tagline: row.tagline ?? '',
    description: row.description ?? '',
    rechtsgebiet: (row.rechtsgebiet ?? []) as Rechtsgebiet[],
    category: row.category ?? [],
    votes: row.votes ?? 0,
    isNew: row.is_new ?? false,
    createdAt: row.created_at,
    pricingType: row.pricing,
    pricingUrl: row.pricing_url,
    screenshotUrl: row.screenshot_url,
    longDescription: row.long_description,
    bestFor: row.best_for,
    notFor: row.not_for,
    verdict: row.verdict,
    lastReviewedAt: row.last_reviewed_at,
    scorePraxisreife: row.score_praxisreife,
    scoreDatenschutz: row.score_datenschutz,
    scoreDach: row.score_dach,
    scoreUx: row.score_ux,
    scorePreis: row.score_preis,
    lexlabScore: row.lexlab_score,
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeDate(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)
  if (days === 0) return 'Heute'
  if (days === 1) return 'Gestern'
  if (days < 7) return `vor ${days} Tagen`
  if (days < 30) return `vor ${Math.floor(days / 7)} Wochen`
  return `vor ${Math.floor(days / 30)} Monaten`
}

function generateUseCases(tool: Tool): string[] {
  const cases: string[] = []
  if (tool.rechtsgebiet.includes('M&A'))
    cases.push('Due Diligence und Vertragsanalyse in M&A-Prozessen')
  if (tool.rechtsgebiet.includes('Steuerrecht'))
    cases.push('Steuerliche Analyse und Berechnung komplexer Sachverhalte')
  if (tool.rechtsgebiet.includes('Gesellschaftsrecht'))
    cases.push('Prüfung gesellschaftsrechtlicher Dokumente und Beschlüsse')
  if (tool.rechtsgebiet.includes('Venture Capital'))
    cases.push('Analyse von Term Sheets und Investmentverträgen')
  if (tool.category.includes('Vertragsanalyse') && !cases.some(c => c.includes('Vertrags')))
    cases.push('Systematische Vertragsanalyse und Risikoidentifikation')
  const fallbacks = [
    'Effizienzsteigerung bei wiederkehrenden Aufgaben',
    'Mandantenberatung und Dokumentenerstellung',
    'Qualitätssicherung und Risikoprüfung',
  ]
  while (cases.length < 3) cases.push(fallbacks[cases.length % fallbacks.length])
  return cases.slice(0, 3)
}

// ─── Pricing badge ────────────────────────────────────────────────────────────

const PRICING_META: Record<string, { label: string; className: string }> = {
  free:       { label: 'Kostenlos',        className: 'bg-green-50 text-green-700 border-green-200' },
  freemium:   { label: 'Freemium',         className: 'bg-blue-50 text-blue-700 border-blue-200' },
  paid:       { label: 'Kostenpflichtig',  className: 'bg-purple-50 text-purple-700 border-purple-200' },
  enterprise: { label: 'Enterprise',       className: 'bg-gray-50 text-gray-700 border-gray-200' },
}

function PricingBadge({ type, url }: { type: string | null | undefined; url?: string | null }) {
  if (!type || !PRICING_META[type]) return null
  const { label, className } = PRICING_META[type]
  return (
    <div className="space-y-1.5">
      <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg border ${className}`}>
        {label}
      </span>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Preise ansehen →
        </a>
      )}
    </div>
  )
}

// ─── Similar tools compact list ───────────────────────────────────────────────

function SimilarToolsList({ tools }: { tools: Pick<Tool, 'id' | 'name' | 'slug' | 'rechtsgebiet'>[] }) {
  if (tools.length === 0) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <h2 className="font-display font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
        <Grid3X3 className="w-4 h-4 text-gray-400" />
        Ähnliche Tools
      </h2>
      <div className="space-y-2">
        {tools.map(t => (
          <Link
            key={t.id}
            href={`/tools/${t.slug}`}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              {t.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                {t.name}
              </p>
              {t.rechtsgebiet[0] && (
                <span className="text-[10px] text-gray-400">{t.rechtsgebiet[0]}</span>
              )}
            </div>
            <span className="text-gray-300 group-hover:text-blue-400 transition-colors text-sm">→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ─── LexLab Score ─────────────────────────────────────────────────────────────

const SCORE_ROWS: { key: keyof Tool; label: string }[] = [
  { key: 'scorePraxisreife', label: 'Praxisreife' },
  { key: 'scoreDatenschutz', label: 'Datenschutz/DSGVO' },
  { key: 'scoreDach',        label: 'DACH-Relevanz' },
  { key: 'scoreUx',         label: 'UX/Usability' },
  { key: 'scorePreis',      label: 'Preis-Leistung' },
]

function scoreColors(s: number) {
  if (s >= 80) return { ring: 'border-green-200', bg: 'bg-green-50', text: 'text-green-700', bar: 'bg-green-500' }
  if (s >= 60) return { ring: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-700', bar: 'bg-amber-400' }
  return { ring: 'border-red-200', bg: 'bg-red-50', text: 'text-red-600', bar: 'bg-red-400' }
}

function LexLabScoreCard({ tool }: { tool: Tool }) {
  if (!tool.lexlabScore) return null
  const c = scoreColors(tool.lexlabScore)
  const subScores = SCORE_ROWS.filter(r => tool[r.key] != null)
  return (
    <div className={`border rounded-xl p-4 space-y-3 ${c.ring} ${c.bg}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">LexLab Score</p>
        {tool.lastReviewedAt && (
          <p className="text-[10px] text-gray-400">
            Geprüft {relativeDate(tool.lastReviewedAt)}
          </p>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-4xl font-display font-bold ${c.text}`}>{tool.lexlabScore}</span>
        <span className="text-sm text-gray-400">/100</span>
      </div>
      {subScores.length > 0 && (
        <div className="space-y-2 pt-1">
          {subScores.map(({ key, label }) => {
            const val = tool[key] as number
            return (
              <div key={key}>
                <div className="flex justify-between mb-0.5">
                  <span className="text-[11px] text-gray-500">{label}</span>
                  <span className="text-[11px] font-semibold text-gray-600">{val}/10</span>
                </div>
                <div className="h-1 bg-white/70 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${val * 10}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Comment form ─────────────────────────────────────────────────────────────

const ROLES = ['Rechtsanwalt', 'Steuerberater', 'Inhouse-Jurist', 'Student/Referendar', 'Sonstiges']
const RECHTSGEBIETE: Rechtsgebiet[] = ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Venture Capital']
const MAX_COMMENT = 500

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i === value ? 0 : i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${i} Stern${i > 1 ? 'e' : ''}`}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <svg
            className={`w-6 h-6 transition-colors ${i <= (hovered || value) ? 'text-amber-400' : 'text-gray-200'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      {value > 0 && (
        <span className="ml-1 text-xs text-gray-500">{value}/5</span>
      )}
    </div>
  )
}

function CommentForm({ toolId, onSubmitted }: { toolId: string; onSubmitted: () => void }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState(ROLES[0])
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(0)
  const [rechtsgebiet, setRechtsgebiet] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const canSubmit = name.trim().length > 0 && (comment.trim().length > 0 || rating > 0)

  function toggleRg(rg: string) {
    setRechtsgebiet(prev =>
      prev.includes(rg) ? prev.filter(r => r !== rg) : [...prev, rg]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch(`/api/tools/${toolId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          role,
          comment: comment.trim() || null,
          rating: rating > 0 ? rating : null,
          rechtsgebiet,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error ?? 'Fehler beim Senden')
      }
      setStatus('success')
      onSubmitted()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Fehler beim Senden.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-green-700">
        ✓ Danke! Dein Beitrag wird geprüft und bald veröffentlicht.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Name / Kürzel *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Dein Name oder Kürzel"
            required
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Rolle</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
          >
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Bewertung (optional)</label>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Erfahrungsbericht <span className="font-normal text-gray-400">(optional, wenn Bewertung vergeben)</span>
        </label>
        <div className="relative">
          <textarea
            value={comment}
            onChange={e => { if (e.target.value.length <= MAX_COMMENT) setComment(e.target.value) }}
            placeholder="Teile deine Erfahrungen mit diesem Tool..."
            className="w-full min-h-[100px] text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none leading-relaxed"
          />
          <span className={`absolute bottom-2.5 right-3 text-xs ${comment.length > MAX_COMMENT * 0.9 ? 'text-amber-500' : 'text-gray-300'}`}>
            {comment.length}/{MAX_COMMENT}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Rechtsgebiet (optional)</label>
        <div className="flex flex-wrap gap-1.5">
          {RECHTSGEBIETE.map(rg => (
            <button
              key={rg}
              type="button"
              onClick={() => toggleRg(rg)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                rechtsgebiet.includes(rg)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              {rg}
            </button>
          ))}
        </div>
      </div>

      {status === 'error' && (
        <p className="text-xs text-red-600">{errorMsg}</p>
      )}

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-gray-400">Beiträge werden vor Veröffentlichung geprüft.</p>
        <button
          type="submit"
          disabled={status === 'loading' || !canSubmit}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          {status === 'loading' ? 'Wird gesendet…' : 'Erfahrung teilen'}
        </button>
      </div>
    </form>
  )
}

// ─── Comment card ─────────────────────────────────────────────────────────────

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} von 5 Sternen`}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  )
}

function CommentCard({ comment }: { comment: ToolComment }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0">
            {comment.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-gray-900">{comment.name}</span>
          <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md border border-gray-200">
            {comment.role}
          </span>
          {comment.rechtsgebiet?.map(rg => (
            <span key={rg} className="text-[10px] font-medium bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md border border-blue-100">
              {rg}
            </span>
          ))}
          {comment.rating != null && <StarDisplay rating={comment.rating} />}
        </div>
        <span className="text-xs text-gray-400">{relativeDate(comment.created_at)}</span>
      </div>
      {comment.comment && (
        <p className="text-sm text-gray-600 leading-relaxed">{comment.comment}</p>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const { trackEvent, AnalyticsEvents } = useAnalytics()
  const [tool, setTool] = useState<Tool | null>(null)
  const [similarTools, setSimilarTools] = useState<Pick<Tool, 'id' | 'name' | 'slug' | 'rechtsgebiet'>[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [copied, setCopied] = useState(false)
  const [votes, setVotes] = useState(0)
  const [voted, setVoted] = useState(false)
  const [comments, setComments] = useState<ToolComment[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)

  useEffect(() => {
    async function fetchTool() {
      const supabase = createClient()

      // Fetch only the requested tool — no submitted_by or other PII columns
      const { data, error } = await supabase
        .from('tools')
        .select('id,name,slug,url,tagline,description,rechtsgebiet,category,votes,is_new,status,featured,created_at,pricing,pricing_url,screenshot_url,long_description,best_for,not_for,verdict,last_reviewed_at,score_praxisreife,score_datenschutz,score_dach,score_ux,score_preis,lexlab_score')
        .eq('status', 'approved')
        .eq('slug', slug)
        .maybeSingle()

      if (error) {
        setLoadError(true)
        setLoading(false)
        return
      }

      if (!data) {
        // Tool not found or not approved
        setLoadError(true)
        setLoading(false)
        return
      }

      const toolData = mapRow(data as SupabaseToolRow)
      setTool(toolData)
      setVotes(toolData.votes)

      // Fetch similar tools (minimal columns) using rechtsgebiet overlap
      if (toolData.rechtsgebiet.length > 0) {
        const { data: similarData } = await supabase
          .from('tools')
          .select('id,name,slug,rechtsgebiet')
          .eq('status', 'approved')
          .neq('slug', slug)
          .overlaps('rechtsgebiet', toolData.rechtsgebiet)
          .limit(3)

        if (similarData) {
          setSimilarTools(
            (similarData as SimilarToolRow[]).map(r => ({
              id: r.id,
              name: r.name,
              slug: r.slug,
              rechtsgebiet: (r.rechtsgebiet ?? []) as Rechtsgebiet[],
            }))
          )
        }
      }

      setLoading(false)
    }
    fetchTool()
  }, [slug])

  useEffect(() => {
    if (tool) {
      // localStorage as fast initial state; server check below is the source of truth
      setVoted(localStorage.getItem(`voted_${tool.id}`) === '1')
      // Fetch server-side vote status (IP-based)
      fetch(`/api/tools/vote-status?toolId=${encodeURIComponent(tool.id)}`)
        .then(r => r.json())
        .then(d => {
          if (typeof d.voted === 'boolean') {
            setVoted(d.voted)
            if (d.voted) localStorage.setItem(`voted_${tool.id}`, '1')
            else localStorage.removeItem(`voted_${tool.id}`)
          }
        })
        .catch(() => {})
    }
  }, [tool?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch approved comments when tool is found
  useEffect(() => {
    if (!tool) return
    setCommentsLoading(true)
    fetch(`/api/tools/${tool.id}/comments`)
      .then(r => r.json())
      .then(d => setComments(d.comments ?? []))
      .catch(() => {})
      .finally(() => setCommentsLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps -- tool.id is the relevant dep; full tool object would cause spurious refetches on reference changes
  }, [tool?.id])

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleVote() {
    if (!tool) return
    const isVoting = !voted // true = adding, false = removing

    // Optimistic update
    setVotes(v => isVoting ? v + 1 : Math.max(0, v - 1))
    setVoted(isVoting)
    if (isVoting) localStorage.setItem(`voted_${tool.id}`, '1')
    else localStorage.removeItem(`voted_${tool.id}`)

    try {
      const res = await fetch('/api/tools/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: tool.id }),
      })
      if (res.ok) {
        const data = await res.json()
        setVotes(data.votes)
        setVoted(data.voted)
        if (data.voted) {
          localStorage.setItem(`voted_${tool.id}`, '1')
          trackEvent(AnalyticsEvents.TOOL_VOTE, { tool_slug: tool.slug, rechtsgebiet: tool.rechtsgebiet?.[0] })
        } else {
          localStorage.removeItem(`voted_${tool.id}`)
          trackEvent(AnalyticsEvents.TOOL_UNVOTE, { tool_slug: tool.slug, rechtsgebiet: tool.rechtsgebiet?.[0] })
        }
      } else {
        // Revert
        setVotes(v => isVoting ? v - 1 : v + 1)
        setVoted(!isVoting)
        if (isVoting) localStorage.removeItem(`voted_${tool.id}`)
        else localStorage.setItem(`voted_${tool.id}`, '1')
      }
    } catch {
      // Revert
      setVotes(v => isVoting ? v - 1 : v + 1)
      setVoted(!isVoting)
      if (isVoting) localStorage.removeItem(`voted_${tool.id}`)
      else localStorage.setItem(`voted_${tool.id}`, '1')
    }
  }

  // ── Error state ──
  if (loadError) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-sm text-gray-500">
          Tool konnte nicht geladen werden. Bitte später erneut versuchen.
        </p>
      </div>
    )
  }

  // ── Loading state ──
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-pulse space-y-4">
        <div className="h-4 bg-gray-100 rounded w-24" />
        <div className="h-8 bg-gray-100 rounded w-64" />
        <div className="h-4 bg-gray-100 rounded w-96" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 mt-8">
          <div className="space-y-4">
            <div className="h-40 bg-gray-100 rounded-xl" />
            <div className="h-32 bg-gray-100 rounded-xl" />
          </div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-100 rounded-xl" />
            <div className="h-12 bg-gray-100 rounded-xl" />
            <div className="h-28 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  // ── Not found state ──
  if (!tool) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="font-display text-2xl text-gray-900 mb-2">Tool nicht gefunden</h1>
        <p className="text-gray-500 mb-6 text-sm">Dieses Tool existiert nicht oder wurde entfernt.</p>
        <Link href="/tools" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          ← Alle Tools
        </Link>
      </div>
    )
  }

  const useCases = generateUseCases(tool)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">

        {/* ── Left column ── */}
        <div className="space-y-4">
          {/* Back link */}
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Alle Tools
          </Link>

          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
              <span className="font-display font-bold text-lg text-gray-600">
                {tool.name.charAt(0)}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-2xl text-gray-900">{tool.name}</h1>
                {tool.isNew && (
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md border border-blue-100">
                    NEU
                  </span>
                )}
              </div>
              <p className="text-gray-500 mt-1 text-sm">{tool.tagline}</p>
            </div>
          </div>

          {/* Rechtsgebiet tags */}
          <div className="flex flex-wrap gap-1.5">
            {tool.rechtsgebiet.map(tag => (
              <RechtsgebietTag key={tag} tag={tag} />
            ))}
          </div>

          {/* Description */}
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="font-display font-semibold text-gray-900 mb-3">Beschreibung</h2>
            <p className="text-gray-600 leading-relaxed text-sm">
              {tool.longDescription ?? tool.description}
            </p>
          </div>

          {/* Best For / Not For */}
          {((tool.bestFor && tool.bestFor.length > 0) || (tool.notFor && tool.notFor.length > 0)) && (
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <h2 className="font-display font-semibold text-gray-900 mb-4">Für wen geeignet?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tool.bestFor && tool.bestFor.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">Geeignet für</p>
                    <ul className="space-y-1.5">
                      {tool.bestFor.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="mt-0.5 w-4 h-4 flex-shrink-0 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tool.notFor && tool.notFor.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">Nicht geeignet für</p>
                    <ul className="space-y-1.5">
                      {tool.notFor.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="mt-0.5 w-4 h-4 flex-shrink-0 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-[10px] font-bold">✕</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Verdict */}
          {tool.verdict && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <h2 className="font-display font-semibold text-gray-900 mb-2">Redaktionelles Fazit</h2>
              <p className="text-gray-700 leading-relaxed text-sm italic">{tool.verdict}</p>
            </div>
          )}

          {/* Screenshot */}
          {tool.screenshotUrl && (
            <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tool.screenshotUrl} alt={`${tool.name} Screenshot`} className="w-full object-cover" />
            </div>
          )}

          {/* Use Cases */}
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="font-display font-semibold text-gray-900 mb-3">Use Cases</h2>
            <ul className="space-y-2.5">
              {useCases.map((uc, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  {uc}
                </li>
              ))}
            </ul>
          </div>

          {/* Similar Tools */}
          <SimilarToolsList tools={similarTools} />
        </div>

        {/* ── Right sidebar ── */}
        <div className="space-y-3">
          {/* Primary CTA */}
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors text-sm"
          >
            Tool ansehen →
          </a>

          {/* Pricing */}
          {(tool.pricingType) && (
            <div className="bg-white border border-gray-100 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400 mb-1.5">Preismodell</p>
              <PricingBadge type={tool.pricingType} url={tool.pricingUrl} />
            </div>
          )}

          {/* LexLab Score */}
          <LexLabScoreCard tool={tool} />

          {/* Upvote / Unvote toggle */}
          <button
            onClick={handleVote}
            title={voted ? 'Vote zurücknehmen' : 'Upvoten'}
            className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
              voted
                ? 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <ChevronUp className="w-4 h-4" />
            {votes} {votes === 1 ? 'Vote' : 'Votes'}
          </button>

          {/* Meta info */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
            {tool.category.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Kategorie</p>
                <p className="text-sm text-gray-700">{tool.category.join(', ')}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Hinzugefügt</p>
              <p className="text-sm text-gray-700">{relativeDate(tool.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Rechtsgebiet</p>
              <p className="text-sm text-gray-700">{tool.rechtsgebiet.join(', ')}</p>
            </div>
          </div>

          {/* Share */}
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-2">Teilen</p>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 w-full text-sm text-gray-600 hover:text-gray-900 transition-colors group"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-green-600">Link kopiert!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                  <span>Link kopieren</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Comments — full width below both columns ── */}
      <div className="mt-10 pt-10 border-t border-gray-100">
        <div className="mb-6">
          <h2 className="font-display text-xl text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gray-400" />
            Erfahrungsberichte &amp; Kommentare
          </h2>
          <p className="text-sm text-gray-500 mt-1">Teile deine Erfahrungen mit diesem Tool</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
          {/* Comments list */}
          <div className="space-y-3 order-2 lg:order-1">
            {commentsLoading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2].map(i => (
                  <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-4/5" />
                  </div>
                ))}
              </div>
            ) : comments.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-xl p-8 text-center">
                <MessageSquare className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Noch keine Erfahrungsberichte. Sei der Erste!</p>
              </div>
            ) : (
              comments.map(c => <CommentCard key={c.id} comment={c} />)
            )}
          </div>

          {/* Comment form */}
          <div className="order-1 lg:order-2">
            <CommentForm
              toolId={tool.id}
              onSubmitted={() => {
                // Re-fetch comments after submission
                fetch(`/api/tools/${tool.id}/comments`)
                  .then(r => r.json())
                  .then(d => setComments(d.comments ?? []))
                  .catch(() => {})
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
