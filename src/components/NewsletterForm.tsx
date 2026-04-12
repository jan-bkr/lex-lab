'use client'

import { useState } from 'react'

export function NewsletterForm({
  variant = 'inline',
  successMessage,
}: {
  variant?: 'inline' | 'page'
  successMessage?: string
}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Ein Fehler ist aufgetreten.')
        setStatus('error')
      } else {
        setStatus('success')
        setEmail('')
      }
    } catch {
      setErrorMsg('Verbindungsfehler. Bitte versuche es erneut.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={variant === 'page' ? 'text-center py-4' : ''}>
        <p className="text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 inline-block">
          {successMessage ?? '✓ Angemeldet! Schau in dein Postfach für die Bestätigung.'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row items-center justify-center gap-3 ${variant === 'page' ? 'max-w-lg mx-auto' : 'max-w-md mx-auto'}`}>
      <input
        type="email"
        placeholder="deine@email.de"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        disabled={status === 'loading'}
        className="flex-1 w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
      >
        {status === 'loading' ? 'Wird angemeldet…' : 'Anmelden'}
      </button>
      {status === 'error' && (
        <p className="w-full text-xs text-red-600 text-center sm:text-left -mt-1">{errorMsg}</p>
      )}
    </form>
  )
}
