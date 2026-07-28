import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { NewsletterForm } from '@/components/NewsletterForm'
import { EDITORIAL_ARTICLES } from './articles'

export const metadata: Metadata = {
  title: 'Beiträge & Einblicke',
  description: 'Praxisleitfäden, Methodik und Einordnung zu Legal AI — von Jan Becker, Rechtsanwalt und LexLab-Gründer.',
  alternates: { canonical: 'https://www.lex-lab.de/beitraege' },
  openGraph: {
    title: 'Beiträge & Einblicke — LexLab',
    description: 'Praxisleitfäden, Methodik und Einordnung zu Legal AI für den deutschen Rechtsmarkt.',
  },
}

export default function BeitraegePage() {
  const [featured, ...articles] = EDITORIAL_ARTICLES

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <header className="max-w-2xl mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">LexLab Editorial</p>
        <h1 className="font-display text-4xl sm:text-5xl text-gray-900 tracking-tight">Beiträge &amp; Einblicke</h1>
        <p className="text-gray-500 mt-4 leading-relaxed">
          Praxisleitfäden, Methodik und Einordnung für Juristen, die KI verantwortlich und wirksam einsetzen wollen.
        </p>
      </header>

      <Link href={`/beitraege/${featured.slug}`} className="group block bg-[#111827] rounded-2xl p-6 sm:p-8 mb-6 text-white">
        <div className="grid sm:grid-cols-[1fr_auto] gap-8 items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">{featured.category} · Neu</span>
            <h2 className="font-display text-3xl sm:text-4xl leading-tight mt-3 group-hover:text-blue-200 transition-colors">{featured.title}</h2>
            <p className="text-sm text-gray-400 leading-relaxed mt-4 max-w-2xl">{featured.preview}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm text-blue-400 font-semibold whitespace-nowrap">
            Beitrag lesen <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>

      <div className="grid sm:grid-cols-2 gap-4">
        {articles.map(article => (
          <Link key={article.slug} href={`/beitraege/${article.slug}`} className="group bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm rounded-2xl p-6 transition-all">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{article.category}</span>
            <h2 className="font-display text-2xl text-gray-900 leading-snug mt-3 group-hover:text-blue-600 transition-colors">{article.title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed mt-3">{article.preview}</p>
            <div className="mt-5 flex items-center justify-between text-xs">
              <span className="text-gray-400">{article.readingTime} Lesezeit</span>
              <span className="text-blue-600 font-semibold">Lesen →</span>
            </div>
          </Link>
        ))}
      </div>

      <section className="mt-14 pt-12 border-t border-gray-100 grid md:grid-cols-[1fr_1.4fr] gap-8 items-start">
        <div className="flex items-center gap-4">
          <Image src="/jan-becker.jpg" alt="Jan Becker" width={72} height={72} className="rounded-2xl object-cover object-top" />
          <div>
            <p className="font-display text-xl text-gray-900">Jan Becker</p>
            <p className="text-xs text-gray-400 mt-1">Rechtsanwalt · Gründer von LexLab</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600 leading-relaxed">
            LexLab verbindet juristische Praxis mit nüchterner Technologie-Einordnung. Keine bezahlten Listings, keine Affiliate-Deals — sondern nachvollziehbare Kriterien und konkrete Arbeitsmethoden.
          </p>
          <Link href="/method" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
            Zur LexLab Method <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      <section className="mt-14 bg-blue-50 border border-blue-100 rounded-2xl p-6 sm:p-8">
        <h2 className="font-display text-2xl text-gray-900">Neue Beiträge nicht verpassen.</h2>
        <p className="text-sm text-gray-600 mt-2 mb-5">Der Weekly Brief bringt neue Einordnungen und Marktbewegungen einmal pro Woche ins Postfach.</p>
        <NewsletterForm />
      </section>
    </div>
  )
}
