import type { Metadata } from 'next'
import { NewsletterForm } from '@/components/NewsletterForm'
import { NEWSLETTER_PAUSED, NEWSLETTER_PAUSED_NOTE } from '@/lib/site-status'

export const metadata: Metadata = {
  title: 'Weekly Brief',
  description: 'Der LexLab Newsletter: neue Beiträge, Einordnungen zum Legal Model Benchmark und Notizen zum Aufbau der Skill-Bibliothek. Derzeit pausiert.',
  alternates: { canonical: 'https://www.lex-lab.de/newsletter' },
  openGraph: {
    title: 'LexLab Weekly Brief — Newsletter',
    description: 'Neue Beiträge, Benchmark-Einordnungen und Notizen zum Aufbau der Skill-Bibliothek. Derzeit pausiert.',
  },
}

export default function NewsletterPage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 sm:py-20">

      {/* Header */}
      <div className="mb-10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">LexLab</p>
        <h1 className="font-display text-3xl sm:text-4xl text-gray-900 leading-tight mb-4 flex items-center gap-3">
          Weekly Brief
          {NEWSLETTER_PAUSED && (
            <span className="font-sans text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 uppercase tracking-wide">
              Pausiert
            </span>
          )}
        </h1>
        {NEWSLETTER_PAUSED ? (
          <p className="text-gray-500 text-base leading-relaxed">{NEWSLETTER_PAUSED_NOTE}</p>
        ) : (
          <p className="text-gray-500 text-base leading-relaxed">
            Einmal pro Woche: drei kuratierte Entwicklungen, ein Tool im Fokus,
            Marktbeobachtungen und eine persönliche Einschätzung —
            alles aus dem deutschen Rechts- und Steuermarkt.
          </p>
        )}
      </div>

      {/* What to expect */}
      {!NEWSLETTER_PAUSED && (
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
      )}

      {/* Form */}
      <div className="bg-white border border-gray-100 rounded-2xl p-7 sm:p-8">
        <p className="text-sm font-semibold text-gray-800 mb-1">{NEWSLETTER_PAUSED ? 'Vormerken lassen' : 'Kostenlos abonnieren'}</p>
        <p className="text-xs text-gray-400 mb-5">
          {NEWSLETTER_PAUSED ? 'Kein Spam. Du hörst von LexLab erst wieder, wenn es etwas zu lesen gibt.' : 'Kein Spam. Kein Daily-Noise. Einmal pro Woche, wenn es sich lohnt.'}
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
