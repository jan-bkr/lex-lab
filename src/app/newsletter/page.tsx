import type { Metadata } from 'next'
import { NewsletterForm } from '@/components/NewsletterForm'

export const metadata: Metadata = {
  title: 'Weekly Brief',
  description: 'Der wöchentliche Brief für Juristen, Steuerberater und Inhouse-Teams. KI-Tools, Marktbeobachtungen und kurierte Einschätzungen aus dem deutschen Rechtsmarkt.',
  alternates: { canonical: 'https://www.lex-lab.de/newsletter' },
  openGraph: {
    title: 'LexLab Weekly Brief — Newsletter',
    description: 'Wöchentlich kuratiert: KI-Tools, Entwicklungen und Einschätzungen für den deutschen Rechtsmarkt.',
  },
}

export default function NewsletterPage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 sm:py-20">

      {/* Header */}
      <div className="mb-10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">LexLab</p>
        <h1 className="font-display text-3xl sm:text-4xl text-gray-900 leading-tight mb-4">
          Weekly Brief
        </h1>
        <p className="text-gray-500 text-base leading-relaxed">
          Einmal pro Woche: drei kuratierte Entwicklungen, ein Tool im Fokus,
          Marktbeobachtungen und eine persönliche Einschätzung —
          alles aus dem deutschen Rechts- und Steuermarkt.
        </p>
      </div>

      {/* What to expect */}
      <div className="border-t border-gray-100 pt-8 mb-10 space-y-4">
        {[
          { label: 'Entwicklungen',      desc: 'Drei kuratierte News — eingeordnet, nicht nur aufgelistet.' },
          { label: 'Tool Watch',          desc: 'Ein KI-Tool im Detail — warum es jetzt relevant ist.' },
          { label: 'Marktbeobachtung',    desc: 'Signale und Trends, die Juristen kennen sollten.' },
          { label: 'LexLab Pick',         desc: 'Eine persönliche Empfehlung aus dem Tool-Verzeichnis.' },
        ].map(({ label, desc }) => (
          <div key={label} className="flex gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mt-0.5 w-32 shrink-0">
              {label}
            </span>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-100 rounded-2xl p-7 sm:p-8">
        <p className="text-sm font-semibold text-gray-800 mb-1">Kostenlos abonnieren</p>
        <p className="text-xs text-gray-400 mb-5">
          Kein Spam. Kein Daily-Noise. Einmal pro Woche, wenn es sich lohnt.
        </p>
        <NewsletterForm variant="page" />
        <p className="text-xs text-gray-400 mt-4">
          Mit der Anmeldung akzeptierst du unsere{' '}
          <a href="/datenschutz" className="underline hover:text-gray-600">Datenschutzerklärung</a>.
          Jederzeit abmeldbar.
        </p>
      </div>

    </div>
  )
}
