import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAllowedAdminEmail } from '@/lib/admin-auth'
import AdminNav from '@/components/AdminNav'

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  if (!isAllowedAdminEmail(user.email)) redirect('/admin/login')

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminNav email={user.email ?? ''} />
      <main className="flex-1 pt-12 lg:pt-0 p-4 lg:p-8 overflow-auto min-h-screen">
        {children}
      </main>
    </div>
  )
}
