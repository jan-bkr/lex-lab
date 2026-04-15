'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to the browser console for debugging — no stack trace exposed to users
    console.error('[error-boundary]', error.digest ?? error.message)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Status indicator */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
          Fehler
        </p>

        <h1 className="font-display text-3xl text-gray-900 mb-3">
          Etwas ist schiefgelaufen
        </h1>

        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          Es ist ein unerwarteter Fehler aufgetreten. Bitte versuche es erneut
          oder kehre zur Startseite zurück.
          {error.digest && (
            <span className="block mt-2 text-xs text-gray-400 font-mono">
              Fehlerkennung: {error.digest}
            </span>
          )}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Erneut versuchen
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Zur Startseite
          </Link>
        </div>
      </div>
    </div>
  )
}
