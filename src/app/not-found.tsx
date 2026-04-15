import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Seite nicht gefunden',
}

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Status indicator */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
          404
        </p>

        <h1 className="font-display text-3xl text-gray-900 mb-3">
          Seite nicht gefunden
        </h1>

        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          Diese Seite existiert nicht oder wurde verschoben.
          Vielleicht hilft dir eines der folgenden Angebote weiter.
        </p>

        {/* Quick links */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 text-left space-y-2">
          {[
            { href: '/tools', label: 'KI-Tool-Verzeichnis', desc: 'Kuratierte Tools für Juristen' },
            { href: '/workflows', label: 'Workflows', desc: 'Schritt-für-Schritt KI-Anleitungen' },
            { href: '/prompts', label: 'Prompt-Bibliothek', desc: 'Praxiserprobte Prompts fürs Recht' },
            { href: '/news', label: 'News', desc: 'Aktuelle LegalTech-Nachrichten' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between group py-2 border-b border-gray-50 last:border-0"
            >
              <div>
                <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {link.label}
                </span>
                <p className="text-xs text-gray-400 mt-0.5">{link.desc}</p>
              </div>
              <span className="text-gray-300 group-hover:text-blue-400 transition-colors text-sm">&rarr;</span>
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          &larr; Zurück zur Startseite
        </Link>
      </div>
    </div>
  )
}
