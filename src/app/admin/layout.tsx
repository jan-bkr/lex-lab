import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''

  // Login page renders standalone (no chrome, no auth check — middleware guards the rest)
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Secondary auth check (middleware is primary)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminNav email={user.email ?? ''} />
      <main className="flex-1 pt-12 lg:pt-0 p-4 lg:p-8 overflow-auto min-h-screen">
        {children}
      </main>
    </div>
  )
}
