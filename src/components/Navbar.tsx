'use client'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import LexLabLogo from '@/components/LexLabLogo'

interface NavLink {
  href: string
  label: string
  soon?: boolean
  isNew?: boolean
  highlight?: boolean
}

const navLinks: NavLink[] = [
  { href: '/tools', label: 'Tools' },
  { href: '/tools/compare', label: 'Vergleiche', isNew: true },
  { href: '/prompts', label: 'Prompts' },
  { href: '/prompts/builder', label: '✦ Builder', highlight: true },
  { href: '/workflows', label: 'Workflows' },
  { href: '/news', label: 'News' },
  { href: '/radar', label: 'Radar' },
  { href: '/research', label: 'Research' },
]

// Spotlight glow from the logo side — matches design file "spotlight" variant
const HEADER_BG = 'radial-gradient(ellipse 60% 120% at 8% 50%, rgba(59,123,255,0.20) 0%, rgba(10,14,20,0) 60%), linear-gradient(180deg, #0E1422 0%, #0A0E14 100%)'
const BORDER_B = '1px solid rgba(59,123,255,0.22)'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) return null

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{ background: HEADER_BG, borderBottom: BORDER_B }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <LexLabLogo size="sm" dark animate />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Hauptnavigation">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href || (link.href !== '/' && pathname?.startsWith(`${link.href}/`)) ? 'page' : undefined}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-all duration-150 font-medium ${
                  link.highlight
                    ? 'text-blue-400 hover:text-blue-300 hover:bg-white/5'
                    : 'hover:bg-white/5'
                }`}
                style={link.highlight ? undefined : { color: 'rgba(244,241,234,0.55)' }}
                onMouseEnter={e => { if (!link.highlight) (e.currentTarget as HTMLAnchorElement).style.color = '#F4F1EA' }}
                onMouseLeave={e => { if (!link.highlight) (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(244,241,234,0.55)' }}
              >
                {link.label}
                {link.soon && (
                  <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded px-1 py-0.5 leading-none">
                    bald
                  </span>
                )}
                {link.isNew && (
                  <span className="text-[9px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded px-1 py-0.5 leading-none">
                    neu
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/newsletter"
              className="text-sm font-medium transition-colors"
              style={{ color: 'rgba(244,241,234,0.5)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#F4F1EA' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(244,241,234,0.5)' }}
            >
              Newsletter
            </Link>
            <Link
              href="/tools/submit"
              className="inline-flex items-center gap-1.5 text-sm font-medium px-3.5 py-1.5 rounded-lg transition-all duration-150"
              style={{
                color: '#F4F1EA',
                border: '1px solid rgba(59,123,255,0.45)',
                background: 'rgba(59,123,255,0.10)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(59,123,255,0.20)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(59,123,255,0.10)' }}
            >
              Tool einreichen
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg transition-colors"
            aria-label={open ? 'Navigation schließen' : 'Navigation öffnen'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            style={{ color: 'rgba(244,241,234,0.7)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-navigation"
          className="md:hidden px-4 pb-4 pt-2"
          role="navigation"
          aria-label="Mobile Navigation"
          style={{ background: '#0A0E14', borderTop: '1px solid rgba(244,241,234,0.08)' }}
        >
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href || pathname?.startsWith(`${link.href}/`) ? 'page' : undefined}
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 py-2.5 text-sm font-medium transition-colors"
              style={{ color: link.highlight ? '#60A5FA' : 'rgba(244,241,234,0.6)' }}
            >
              {link.label}
              {link.soon && (
                <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded px-1 py-0.5 leading-none">
                  bald
                </span>
              )}
              {link.isNew && (
                <span className="text-[9px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded px-1 py-0.5 leading-none">
                  neu
                </span>
              )}
            </Link>
          ))}
          <Link
            href="/newsletter"
            onClick={() => setOpen(false)}
            className="block py-2.5 text-sm font-medium"
            style={{ color: 'rgba(244,241,234,0.6)' }}
          >
            Newsletter
          </Link>
          <Link
            href="/tools/submit"
            onClick={() => setOpen(false)}
            className="mt-3 block text-center text-sm font-medium px-4 py-2 rounded-lg transition-all"
            style={{
              color: '#F4F1EA',
              border: '1px solid rgba(59,123,255,0.45)',
              background: 'rgba(59,123,255,0.10)',
            }}
          >
            Tool einreichen
          </Link>
        </div>
      )}
    </header>
  )
}
