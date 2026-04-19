'use client'

import { Suspense, useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { FlaskConical, AlertCircle } from 'lucide-react'
import { loginAdmin } from './actions'

const INITIAL_STATE = { error: '' }

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
    >
      {pending ? 'Wird angemeldet…' : 'Anmelden'}
    </button>
  )
}

function AdminLoginForm({ nextPath }: { nextPath: string }) {
  const [state, formAction] = useActionState(loginAdmin, INITIAL_STATE)

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 mb-3">
            <FlaskConical className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
            <span className="font-display font-bold text-lg text-gray-900">
              lex-lab<span className="text-blue-600">.</span>
              <span className="text-gray-400 font-normal">de</span>
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Admin-Bereich</h1>
          <p className="text-sm text-gray-500 mt-1">Bitte melde dich an.</p>
        </div>

        {/* Form */}
        <form action={formAction} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <input type="hidden" name="next" value={nextPath} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">E-Mail</label>
            <input
              type="email"
              name="email"
              required
              autoFocus
              autoComplete="email"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Passwort</label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {state.error && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {state.error}
            </div>
          )}

          <SubmitButton />
        </form>
      </div>
    </div>
  )
}

function AdminLoginPageInner() {
  const searchParams = useSearchParams()
  const nextPath = searchParams.get('next') ?? '/admin'

  return <AdminLoginForm nextPath={nextPath} />
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<AdminLoginForm nextPath="/admin" />}>
      <AdminLoginPageInner />
    </Suspense>
  )
}
