import { adminSupabase } from '@/lib/supabase/admin'
import Link from 'next/link'
import { ClipboardList, CheckCircle, Newspaper, BookOpen } from 'lucide-react'

export default async function AdminDashboardPage() {
  const [
    { count: pendingCount },
    { count: approvedCount },
    { count: newsCount },
    { count: promptsCount },
  ] = await Promise.all([
    adminSupabase.from('tools').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    adminSupabase.from('tools').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    adminSupabase.from('news_articles').select('*', { count: 'exact', head: true }),
    adminSupabase.from('prompts').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    {
      label: 'Ausstehende Tools',
      value: pendingCount ?? 0,
      icon: ClipboardList,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Genehmigte Tools',
      value: approvedCount ?? 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'News-Artikel',
      value: newsCount ?? 0,
      icon: Newspaper,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Prompts',
      value: promptsCount ?? 0,
      icon: BookOpen,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-xl p-5">
            <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="font-display font-semibold text-gray-900 mb-4">Schnellzugriff</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/tools"
            className="inline-flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors border border-amber-200"
          >
            <ClipboardList className="w-4 h-4" />
            Tools prüfen{(pendingCount ?? 0) > 0 ? ` (${pendingCount})` : ''}
          </Link>
          <Link
            href="/admin/news"
            className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors border border-blue-200"
          >
            <Newspaper className="w-4 h-4" />
            News verwalten
          </Link>
          <Link
            href="/admin/prompts"
            className="inline-flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors border border-purple-200"
          >
            <BookOpen className="w-4 h-4" />
            Prompts verwalten
          </Link>
        </div>
      </div>
    </div>
  )
}
