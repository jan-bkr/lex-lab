'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) return null

  return (
    <footer className="border-t border-gray-100 bg-white mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="6" fill="#111827"/>
              <text x="5" y="13" fontFamily="Georgia, serif" fontSize="11" fontWeight="700" fill="white" letterSpacing="-0.5">lex</text>
              <text x="5" y="23" fontFamily="Georgia, serif" fontSize="11" fontWeight="700" fill="#2563EB" letterSpacing="-0.5">lab</text>
            </svg>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-[13px] tracking-tight text-gray-700">lex-lab.de</span>
              <span className="text-[9px] text-gray-400 tracking-widest uppercase font-medium">Legal AI</span>
            </div>
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
