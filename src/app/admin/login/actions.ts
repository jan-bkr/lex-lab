'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export interface AdminLoginState {
  error: string
}

function normalizeEmail(email: string | null | undefined): string {
  return (email ?? '').trim().toLowerCase()
}

function getAllowedAdminEmails(): string[] {
  return (process.env.ADMIN_EMAIL ?? '')
    .split(/[,\n;]+/)
    .map(normalizeEmail)
    .filter(Boolean)
}

function isAllowedAdminEmail(email: string | null | undefined): boolean {
  const allowedEmails = getAllowedAdminEmails()
  if (!allowedEmails.length) return true

  return allowedEmails.includes(normalizeEmail(email))
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
  const email = normalizeEmail(String(formData.get('email') ?? ''))
  const password = String(formData.get('password') ?? '')
  const nextPath = getSafeNextPath(formData.get('next'))

  if (!email || !password) {
    return { error: 'Bitte E-Mail-Adresse und Passwort eingeben.' }
  }

  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Ungültige E-Mail-Adresse oder Passwort.' }
  }

  if (!user || !isAllowedAdminEmail(user.email)) {
    await supabase.auth.signOut()
    return { error: 'Dieses Konto hat keinen Admin-Zugriff.' }
  }

  redirect(nextPath)
}
