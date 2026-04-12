import type { Metadata } from 'next'
import { NewsletterForm } from '@/components/NewsletterForm'

export const metadata: Metadata = {
  title: 'Beiträge',
  description: 'Gedanken, Erfahrungen und Einblicke aus der Praxis — von Jan Becker, Rechtsanwalt.',
}

export default function BeitraegePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-4xl text-gray-900 mb-3">Beiträge</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Gedanken, Erfahrungen und Einblicke aus der Praxis.
        </p>
      </div>

      {/* Teaser card */}
      <div className="relative bg-white border border-gray-100 rounded-xl p-6 mb-8 shadow-sm">

        {/* Coming soon banner */}
        <div className="flex justify-end mb-4">
          <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
            📝 Wird bald veröffentlicht
          </span>
        </div>

        {/* Author row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold tracking-tight">JB</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-none">Jan Becker</p>
            <p className="text-xs text-gray-400 mt-0.5">Rechtsanwalt · Demnächst</p>
          </div>
        </div>

        {/* Category badge */}
        <div className="mb-3">
          <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-md px-2 py-0.5 uppercase tracking-wide">
            Erfahrungsbericht
          </span>
        </div>

        {/* Title */}
        <h2 className="font-display text-2xl text-gray-900 leading-snug mb-3">
          AI Legal Club: Mein Erfahrungsbericht zum KI-Onlinekurs für Juristen
        </h2>

        {/* Preview text */}
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Ich habe den Onlinekurs des AI Legal Clubs absolviert und ein Zertifikat nach AI Act Art. 4 erhalten.
          In diesem Beitrag teile ich meine Erfahrungen: Was taugt der Kurs wirklich für den Kanzleialltag?
          Welche KI-Tools sind für Rechtsanwälte tatsächlich praxisrelevant? Und lohnt sich die Investition?
          Der vollständige Beitrag erscheint in Kürze.
        </p>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <button disabled className="inline-flex items-center gap-1 text-xs text-gray-300 border border-gray-100 rounded-lg px-2.5 py-1.5 cursor-not-allowed">
              ✦ Wertvoll
            </button>
            <button disabled className="inline-flex items-center gap-1 text-xs text-gray-300 border border-gray-100 rounded-lg px-2.5 py-1.5 cursor-not-allowed">
              💡 Interessant
            </button>
            <button disabled className="inline-flex items-center gap-1 text-xs text-gray-300 border border-gray-100 rounded-lg px-2.5 py-1.5 cursor-not-allowed">
              ⚖ Praxisrelevant
            </button>
          </div>
          <span className="text-xs text-gray-400">💬 Kommentare folgen</span>
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
        <p className="text-sm font-medium text-blue-900 mb-1">Beiträge erscheinen in Kürze.</p>
        <p className="text-sm text-blue-700 mb-4">
          Abonniere den Newsletter um als Erster informiert zu werden.
        </p>
        <NewsletterForm />
      </div>
    </div>
  )
}
