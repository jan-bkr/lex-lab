'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FlaskConical } from 'lucide-react'

export default function Footer() {
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) return null

  return (
    <footer className="border-t border-gray-100 bg-white mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <FlaskConical className="w-3.5 h-3.5 text-blue-600" strokeWidth={2.5} />
            <span className="font-display text-sm font-700 text-gray-700">
              lex-lab<span className="text-blue-600">.</span><span className="text-gray-400 font-normal">de</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href="/impressum" className="hover:text-gray-600 transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-gray-600 transition-colors">Datenschutz</Link>
            <span className="text-gray-200">|</span>
            <span>Kein Rechtsrat. Keine Steuerberatung.</span>
          </div>
          <p className="text-xs text-gray-400">© 2025 lex-lab.de</p>
        </div>
      </div>
    </footer>
  )
}
