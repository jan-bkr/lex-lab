import Link from 'next/link'
import { Suspense } from 'react'
import { AbgemeldetContent } from './AbgemeldetContent'

export const metadata = { title: 'Abgemeldet | LexLab' }

export default function AbgemeldetPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <Suspense fallback={null}>
          <AbgemeldetContent />
        </Suspense>
        <Link
          href="/"
          className="inline-block text-sm text-gray-500 hover:text-gray-800 underline underline-offset-2"
        >
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  )
}
