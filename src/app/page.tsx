import Link from 'next/link'
import { ArrowRight, Flame, Calendar, BookOpen, Copy, Zap, Building2, TrendingUp, Briefcase, ExternalLink } from 'lucide-react'
import { mockTools, mockWorkflows, mockPrompts, mockNews, mockEvents } from '@/lib/mock-data'
import { ToolCard } from '@/components/ToolCard'
import { RechtsgebietTag } from '@/components/RechtsgebietTag'
import { formatDistanceToNow, format } from 'date-fns'
import { de } from 'date-fns/locale'
import { Rechtsgebiet } from '@/types'

const rechtsgebietMeta: Record<Rechtsgebiet, { icon: React.ReactNode; color: string; bg: string; border: string; count: number }> = {
  'Steuerrecht': { icon: <span className="text-2xl font-display font-black text-emerald-600">§</span>, color: 'text-emerald-700', bg: 'bg-emerald-50 hover:bg-emerald-100', border: 'border-emerald-100 hover:border-emerald-200', count: 14 },
  'M&A': { icon: <Briefcase className="w-6 h-6 text-purple-600" />, color: 'text-purple-700', bg: 'bg-purple-50 hover:bg-purple-100', border: 'border-purple-100 hover:border-purple-200', count: 21 },
  'Gesellschaftsrecht': { icon: <Building2 className="w-6 h-6 text-blue-600" />, color: 'text-blue-700', bg: 'bg-blue-50 hover:bg-blue-100', border: 'border-blue-100 hover:border-blue-200', count: 11 },
  'Venture Capital': { icon: <TrendingUp className="w-6 h-6 text-orange-600" />, color: 'text-orange-700', bg: 'bg-orange-50 hover:bg-orange-100', border: 'border-orange-100 hover:border-orange-200', count: 9 },
}

const sourceBadgeStyle: Record<string, string> = {
  BFH: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  BGH: 'bg-blue-50 text-blue-700 border-blue-100',
  BMF: 'bg-amber-50 text-amber-700 border-amber-100',
  JUVE: 'bg-purple-50 text-purple-700 border-purple-100',
  LTO: 'bg-gray-50 text-gray-600 border-gray-200',
}

const eventTypeBadge: Record<string, string> = {
  BFH: 'bg-emerald-50 text-emerald-700',
  BGH: 'bg-blue-50 text-blue-700',
  Gesetz: 'bg-amber-50 text-amber-700',
  Konferenz: 'bg-gray-100 text-gray-600',
}

const workflowBorder: Record<Rechtsgebiet, string> = {
  Steuerrecht: 'border-l-emerald-400',
  'M&A': 'border-l-purple-400',
  Gesellschaftsrecht: 'border-l-blue-400',
  'Venture Capital': 'border-l-orange-400',
}

export default function HomePage() {
  const topTools = [...mockTools].sort((a, b) => b.votes - a.votes).slice(0, 3)
  const promptOfDay = mockPrompts[0]
  const recentNews = mockNews.slice(0, 4)
  const upcomingEvents = mockEvents.slice(0, 3)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* HERO */}
      <section className="pt-16 pb-14 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 mb-6">
          <Zap className="w-3 h-3 text-blue-500" />
          <span className="text-xs text-blue-600 font-medium">Täglich kuratiert — KI für den deutschen Rechtsmarkt</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-gray-900 leading-tight tracking-tight">
          KI für Juristen.<br /><span className="text-blue-600">Täglich</span> kuratiert.
        </h1>
        <p className="mt-5 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Die besten Tools, Workflows und Prompts für Steuerrecht, M&A, Gesellschaftsrecht und Venture Capital.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/tools" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors text-sm">
            Tools entdecken <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/newsletter" className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium px-5 py-2.5 rounded-xl border border-gray-200 transition-colors text-sm">
            Newsletter abonnieren
          </Link>
        </div>
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400">
          <span>✦ Kostenlos</span><span>✦ Kein Spam</span><span>✦ Community-kuratiert</span>
        </div>
      </section>

      {/* TOOLS OF THE WEEK */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-xl text-gray-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" /> Tools der Woche
          </h2>
          <Link href="/tools" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            Alle Tools <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topTools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
        </div>
      </section>

      {/* KATEGORIEN */}
      <section className="mb-14">
        <h2 className="font-display font-bold text-xl text-gray-900 mb-5">Nach Rechtsgebiet</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {(Object.keys(rechtsgebietMeta) as Rechtsgebiet[]).map(rg => {
            const meta = rechtsgebietMeta[rg]
            return (
              <Link key={rg} href={`/tools?rechtsgebiet=${encodeURIComponent(rg)}`}
                className={`flex flex-col gap-3 p-4 rounded-xl border transition-all duration-150 ${meta.bg} ${meta.border}`}>
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">{meta.icon}</div>
                <div>
                  <p className={`font-display font-semibold text-sm ${meta.color}`}>{rg}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{meta.count} Tools</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* WORKFLOWS + PROMPT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-14">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gray-400" /> Neue Workflows
            </h2>
            <Link href="/workflows" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Alle <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {mockWorkflows.slice(0, 3).map(wf => (
              <Link key={wf.id} href={`/workflows/${wf.slug}`}
                className={`block bg-white border border-gray-100 border-l-4 ${workflowBorder[wf.rechtsgebiet[0]]} rounded-xl p-4 hover:shadow-md hover:border-gray-200 transition-all group`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">{wf.title}</p>
                  <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <RechtsgebietTag tag={wf.rechtsgebiet[0]} />
                  <span className="text-xs text-gray-400">{wf.readingTime} min</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-gray-900">Prompt des Tages</h2>
            <Link href="/prompts" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Alle <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <RechtsgebietTag tag={promptOfDay.rechtsgebiet[0]} />
                <span className="text-xs text-gray-400 font-medium">{promptOfDay.useCase}</span>
              </div>
              <h3 className="font-display font-bold text-base text-gray-900 leading-snug mb-3">{promptOfDay.title}</h3>
              <div className="prompt-fade bg-white/60 rounded-lg p-3 max-h-20 overflow-hidden">
                <p className="text-xs text-gray-600 font-mono leading-relaxed">{promptOfDay.promptText}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                <Copy className="w-3 h-3" /> Prompt kopieren
              </button>
              <span className="text-xs text-gray-400">Täglich neu kuratiert</span>
            </div>
          </div>
        </section>
      </div>

      {/* NEWS + EVENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-14">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-gray-900">Aktuelles</h2>
            <Link href="/news" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Alle News <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-50 overflow-hidden">
            {recentNews.map(article => (
              <a key={article.id} href={article.sourceUrl} className="flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors group">
                <span className={`flex-shrink-0 text-[10px] font-bold border rounded-md px-1.5 py-0.5 mt-0.5 ${sourceBadgeStyle[article.sourceName] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                  {article.sourceName}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">{article.title}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true, locale: de })}
                    {article.aiGenerated && <span className="ml-2 text-gray-300">· KI-Zusammenfassung</span>}
                  </p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-0.5 group-hover:text-blue-400 transition-colors" />
              </a>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" /> Events
            </h2>
            <Link href="/events" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Alle <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {upcomingEvents.map(ev => (
              <div key={ev.id} className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${eventTypeBadge[ev.type]}`}>{ev.type}</span>
                  <span className="text-xs text-gray-400">{format(new Date(ev.date), 'd. MMM', { locale: de })}</span>
                </div>
                <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">{ev.title}</p>
                {ev.description && <p className="text-xs text-gray-400 mt-1">{ev.description}</p>}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* NEWSLETTER CTA */}
      <section className="bg-white border border-gray-100 rounded-2xl p-8 mb-16 text-center">
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">Wöchentlich die besten KI-Tools für Juristen</h2>
        <p className="text-gray-500 text-sm mb-6">Kein Spam. Jederzeit abmeldbar. Kostenlos.</p>
        <form className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <input type="email" placeholder="deine@email.de"
            className="flex-1 w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          <button type="submit"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap">
            Anmelden
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-3">
          Mit der Anmeldung akzeptierst du unsere <a href="/datenschutz" className="underline hover:text-gray-600">Datenschutzerklärung</a>.
        </p>
      </section>
    </div>
  )
}
