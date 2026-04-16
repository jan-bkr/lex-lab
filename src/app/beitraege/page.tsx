import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NewsletterForm } from '@/components/NewsletterForm'

export const metadata: Metadata = {
  title: 'Beiträge — LexLab',
  description: 'Praxisberichte, Tool-Reviews und Einblicke aus dem Rechtsalltag mit KI — von Jan Becker, Rechtsanwalt und LexLab-Gründer.',
}

// ─── Teaser-Artikel ────────────────────────────────────────────────────────
interface Article {
  category: string
  categoryColor: string
  title: string
  preview: string
  readingTime: string
}

const ARTICLES: Article[] = [
  {
    category: 'Erfahrungsbericht',
    categoryColor: 'text-blue-600 bg-blue-50 border-blue-100',
    title: 'AI Legal Club: Mein Erfahrungsbericht zum KI-Onlinekurs für Juristen',
    preview:
      'Ich habe den Onlinekurs des AI Legal Clubs absolviert und ein Zertifikat nach AI Act Art. 4 erhalten. In diesem Beitrag teile ich meine Erfahrungen: Was taugt der Kurs wirklich für den Kanzleialltag? Welche KI-Tools sind für Rechtsanwälte tatsächlich praxisrelevant? Und lohnt sich die Investition?',
    readingTime: '8 Min. Lesezeit',
  },
  {
    category: 'Tool-Review',
    categoryColor: 'text-purple-600 bg-purple-50 border-purple-100',
    title: 'TaxGraph im Praxistest: Der Claude-Konnektor für deutsches Steuerrecht',
    preview:
      'TaxGraph ist ein MCP-Konnektor für Claude, der direkten Zugriff auf deutsches Steuerrecht, BMF-Schreiben und aktuelle Rechtsprechung ermöglicht — direkt in der Claude-Oberfläche ohne Copy-Paste. Ich habe TaxGraph intensiv in meiner täglichen Kanzleiarbeit getestet. Mein Fazit: Was funktioniert wirklich, wo sind die Grenzen, und lohnt sich der Einsatz für Steuerrechtler und M&A-Anwälte?',
    readingTime: '10 Min. Lesezeit',
  },
]

export default function BeitraegePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

      {/* ─── Header ─── */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          In Vorbereitung
        </div>
        <h1 className="font-display text-4xl text-gray-900 mb-3">Beiträge</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Praxisberichte, Tool-Reviews und Einblicke aus dem Rechtsalltag mit KI.
        </p>
      </div>

      {/* ─── Article teasers ─── */}
      <div className="space-y-6 mb-10">
        {ARTICLES.map((article) => (
          <article
            key={article.title}
            className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"
          >
            {/* Status badge */}
            <div className="flex justify-end mb-4">
              <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 uppercase tracking-wide leading-none">
                bald
              </span>
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/jan-becker.jpg"
                alt="Jan Becker"
                width={40}
                height={40}
                className="rounded-full object-cover object-top flex-shrink-0"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-none">Jan Becker</p>
                <p className="text-xs text-gray-400 mt-0.5">Rechtsanwalt · {article.readingTime}</p>
              </div>
            </div>

            {/* Category */}
            <div className="mb-3">
              <span
                className={`text-[11px] font-semibold border rounded-md px-2 py-0.5 uppercase tracking-wide ${article.categoryColor}`}
              >
                {article.category}
              </span>
            </div>

            {/* Title */}
            <h2 className="font-display text-2xl text-gray-900 leading-snug mb-3">
              {article.title}
            </h2>

            {/* Preview text */}
            <p className="text-sm text-gray-600 leading-relaxed">
              {article.preview} <span className="text-gray-400">— Der vollständige Beitrag erscheint in Kürze.</span>
            </p>
          </article>
        ))}
      </div>

      {/* ─── Newsletter CTA ─── */}
      <div className="bg-[#F0F4FF] border border-blue-100 rounded-xl p-6 mb-16">
        <p className="text-sm font-semibold text-gray-900 mb-1">Beiträge erscheinen in Kürze.</p>
        <p className="text-sm text-gray-600 mb-5">
          Abonniere den Newsletter — du wirst als Erster informiert, wenn neue Beiträge erscheinen.
        </p>
        <NewsletterForm />
        <p className="text-xs text-gray-400 mt-3">
          Bereits abonniert?{' '}
          <Link href="/newsletter" className="underline hover:text-gray-600 transition-colors">
            Zur Newsletter-Seite
          </Link>
        </p>
      </div>

      {/* ─── Founder / Editor Block ─── */}
      <section className="pt-12 border-t border-gray-100">
        <div className="mb-8">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Hinter LexLab
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-8">

          {/* Photo */}
          <div className="flex-shrink-0">
            <Image
              src="/jan-becker.jpg"
              alt="Jan Becker"
              width={112}
              height={112}
              className="rounded-2xl object-cover object-top shadow-sm"
            />
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="font-display text-2xl text-gray-900 mb-0.5">Jan Becker</p>
            <p className="text-sm text-gray-400 mb-5">
              Rechtsanwalt · Steuerrecht, M&A, Gesellschaftsrecht
            </p>

            <div className="space-y-3.5 text-[15px] text-gray-600 leading-relaxed">
              <p>
                LexLab ist aus einer persönlichen Frage entstanden: Was kann KI in der juristischen Praxis heute wirklich leisten — und was nicht?
              </p>
              <p>
                Als Anwalt mit Schwerpunkten in Steuerrecht, M&A und Gesellschaftsrecht arbeite ich täglich mit den Tools, die ich hier bewerte. LexLab ist der Versuch, das gesammelte Wissen über KI-Werkzeuge im deutschen Rechtsmarkt sichtbar und nutzbar zu machen — für andere Juristen, die schneller lernen und besser einordnen wollen, was wirklich relevant ist.
              </p>
              <p>
                Keine Werbung. Keine Affiliate-Deals. Nur eigene Einschätzungen aus der Praxis.
              </p>
            </div>

            <p className="mt-7 font-display text-xl text-gray-300 italic leading-snug">
              building a platform. to learn more.
            </p>
          </div>

        </div>
      </section>

    </div>
  )
}
