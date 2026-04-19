'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export interface AdminLoginState {
  error: string
}

function getSafeNextPath(next: FormDataEntryValue | null): string {
  const value = typeof next === 'string' ? next : '/admin'

  if (!value.startsWith('/admin') || value.startsWith('/admin/login')) {
    return '/admin'
  }

  return value
}

export async function loginAdmin(
  _prevState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const nextPath = getSafeNextPath(formData.get('next'))

  if (!email || !password) {
    return { error: 'Bitte E-Mail-Adresse und Passwort eingeben.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Ungültige E-Mail-Adresse oder Passwort.' }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const allowedEmail = process.env.ADMIN_EMAIL
  if (!user || (allowedEmail && user.email !== allowedEmail)) {
    await supabase.auth.signOut()
    return { error: 'Dieses Konto hat keinen Admin-Zugriff.' }
  }

  redirect(nextPath)
}
