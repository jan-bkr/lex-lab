import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { NewsletterForm } from '@/components/NewsletterForm'
import { EDITORIAL_ARTICLES, getEditorialArticle } from '../articles'

const BASE = 'https://www.lex-lab.de'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return EDITORIAL_ARTICLES.map(article => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getEditorialArticle(slug)
  if (!article) return { title: 'Beitrag nicht gefunden' }

  return {
    title: article.title,
    description: article.preview,
    alternates: { canonical: `${BASE}/beitraege/${slug}` },
    openGraph: {
      title: `${article.title} — LexLab`,
      description: article.preview,
      type: 'article',
      url: `${BASE}/beitraege/${slug}`,
      publishedTime: article.publishedAt,
      authors: ['Jan Becker'],
    },
  }
}

export default async function EditorialArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getEditorialArticle(slug)
  if (!article) notFound()

  const moreArticles = EDITORIAL_ARTICLES.filter(item => item.slug !== slug).slice(0, 2)
  const publishedLabel = format(new Date(article.publishedAt), 'd. MMMM yyyy', { locale: de })

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.preview,
    datePublished: article.publishedAt,
    author: { '@type': 'Person', name: 'Jan Becker' },
    publisher: { '@type': 'Organization', name: 'LexLab', url: BASE },
    mainEntityOfPage: `${BASE}/beitraege/${slug}`,
    inLanguage: 'de-DE',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <Link href="/beitraege" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-9">
        <ArrowLeft className="w-4 h-4" /> Alle Beiträge
      </Link>

      <article className="max-w-3xl">
        <header className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">{article.category}</span>
          <h1 className="font-display text-4xl sm:text-5xl text-gray-900 leading-tight tracking-tight mt-3">
            {article.title}
          </h1>
          <p className="mt-5 text-lg text-gray-600 leading-relaxed">{article.preview}</p>
          <div className="mt-6 flex items-center gap-3">
            <Image src="/jan-becker.jpg" alt="Jan Becker" width={42} height={42} className="rounded-full object-cover object-top" />
            <div className="text-xs">
              <p className="font-semibold text-gray-900">Jan Becker, Rechtsanwalt</p>
              <p className="text-gray-400">{publishedLabel} · {article.readingTime} Lesezeit</p>
            </div>
          </div>
        </header>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 sm:p-6 mb-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-2">Kurz gesagt</p>
          <p className="text-base text-blue-950 leading-relaxed">{article.takeaway}</p>
        </div>

        <div className="space-y-10">
          {article.sections.map(section => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl sm:text-3xl text-gray-900 mb-4">{section.heading}</h2>
              <div className="space-y-4">
                {section.paragraphs.map(paragraph => (
                  <p key={paragraph} className="text-[16px] text-gray-600 leading-7">{paragraph}</p>
                ))}
              </div>
              {section.bullets && (
                <ul className="mt-5 space-y-3">
                  {section.bullets.map(bullet => (
                    <li key={bullet} className="flex gap-3 text-[15px] text-gray-700 leading-relaxed">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>

      <section className="max-w-3xl mt-14 bg-[#111827] rounded-2xl p-6 sm:p-8 text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">LexLab Weekly Brief</p>
        <h2 className="font-display text-2xl mb-2">Neue Einordnungen direkt ins Postfach.</h2>
        <p className="text-sm text-gray-400 mb-5">Einmal pro Woche. Kuratiert für den deutschen Rechtsmarkt.</p>
        <NewsletterForm source={`article-${article.slug}`} />
      </section>

      <section className="mt-14 pt-10 border-t border-gray-100">
        <h2 className="font-display text-2xl text-gray-900 mb-5">Weiterlesen</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {moreArticles.map(item => (
            <Link key={item.slug} href={`/beitraege/${item.slug}`} className="group bg-white border border-gray-100 hover:border-gray-200 rounded-xl p-5 transition-colors">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.category}</span>
              <h3 className="mt-2 font-display text-xl text-gray-900 group-hover:text-blue-600 leading-snug transition-colors">{item.title}</h3>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-blue-600">Lesen <ArrowRight className="w-3.5 h-3.5" /></span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
