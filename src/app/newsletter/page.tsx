import type { Metadata } from 'next'
import { NewsletterForm } from '@/components/NewsletterForm'
import { Mail, Zap, BookOpen, Newspaper } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Newsletter',
  description: 'Wöchentlich die besten KI-Tools, Workflows und News für den deutschen Rechtsmarkt. Kostenlos, kein Spam.',
}

export default function NewsletterPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl mb-6">
          <Mail className="w-7 h-7 text-blue-600" />
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-900 mb-4 leading-tight">
          KI-News für Juristen.<br />Wöchentlich kuratiert.
        </h1>
        <p className="text-gray-500 text-base leading-relaxed max-w-md mx-auto">
          Kein Spam. Keine Werbung. Nur die relevantesten Tools, Workflows und
          Rechtsentwicklungen aus dem deutschen Rechtsmarkt.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
          <Zap className="w-5 h-5 text-blue-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-800">Top Tools der Woche</p>
          <p className="text-xs text-gray-400 mt-0.5">Kuratiert & kommentiert</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
          <BookOpen className="w-5 h-5 text-purple-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-800">Neue Workflows & Prompts</p>
          <p className="text-xs text-gray-400 mt-0.5">Sofort einsetzbar</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
          <Newspaper className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-800">Rechtsprechung & News</p>
          <p className="text-xs text-gray-400 mt-0.5">Was Juristen wissen müssen</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-8">
        <NewsletterForm variant="page" />
        <p className="text-xs text-gray-400 mt-4 text-center">
          Mit der Anmeldung akzeptierst du unsere{' '}
          <a href="/datenschutz" className="underline hover:text-gray-600">Datenschutzerklärung</a>.
          Jederzeit abmeldbar.
        </p>
      </div>
    </div>
  )
}
