'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Wrench,
  Newspaper,
  BookOpen,
  MessageSquare,
  LogOut,
  ArrowLeft,
  FlaskConical,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/tools', label: 'Tools', icon: Wrench, exact: false },
  { href: '/admin/news', label: 'News', icon: Newspaper, exact: false },
  { href: '/admin/prompts', label: 'Prompts', icon: BookOpen, exact: false },
  { href: '/admin/comments', label: 'Kommentare', icon: MessageSquare, exact: false },
]

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname()
  const router = useRouter()

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────── */}
      <aside className="hidden lg:flex w-56 flex-col bg-white border-r border-gray-200 h-screen sticky top-0 flex-shrink-0">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-1.5">
          <FlaskConical className="w-3.5 h-3.5 text-blue-600" strokeWidth={2.5} />
          <span className="font-display font-bold text-sm text-gray-900">
            lex-lab<span className="text-blue-600">.</span>
            <span className="text-gray-400 font-normal">de</span>
          </span>
          <span className="ml-1 text-[9px] font-semibold text-gray-400 uppercase tracking-widest bg-gray-100 px-1.5 py-0.5 rounded">
            Admin
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive(href, exact)
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-100 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Zurück zur Website
          </Link>
          <p className="text-xs text-gray-400 truncate" title={email}>
            {email}
          </p>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Abmelden
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ──────────────────────────────── */}
      <nav className="lg:hidden fixed top-0 inset-x-0 z-20 bg-white border-b border-gray-200 flex items-center gap-1 px-3 h-12">
        <FlaskConical className="w-3.5 h-3.5 text-blue-600 mr-1" strokeWidth={2.5} />
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isActive(href, exact)
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        ))}
        <button
          onClick={handleSignOut}
          className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
          title="Abmelden"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </nav>
    </>
  )
}
