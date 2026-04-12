'use client'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/tools', label: 'Tools' },
  { href: '/workflows', label: 'Workflows' },
  { href: '/prompts', label: 'Prompts' },
  { href: '/news', label: 'News' },
  { href: '/events', label: 'Events' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) return null

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="font-display font-extrabold text-[17px] tracking-tight text-gray-900">lex</span>
            <span className="font-display font-extrabold text-[17px] tracking-tight text-blue-600">·</span>
            <span className="font-display font-light text-[17px] tracking-tight text-gray-900">lab</span>
            <span className="font-display font-extrabold text-[17px] tracking-tight text-blue-600 ml-0.5">.de</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-150 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/newsletter"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Newsletter
            </Link>
            <Link
              href="/tools/submit"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3.5 py-1.5 rounded-lg transition-colors"
            >
              Tool einreichen
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/tools/submit"
            onClick={() => setOpen(false)}
            className="mt-3 block text-center bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            Tool einreichen
          </Link>
        </div>
      )}
    </header>
  )
}
