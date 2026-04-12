'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

const SUBJECTS = [
  'Allgemeine Anfrage',
  'Tool einreichen',
  'Fehler melden',
  'Kooperation',
  'Sonstiges',
]

export default function KontaktPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (message.length < 20) {
      setErrorMsg('Die Nachricht muss mindestens 20 Zeichen lang sein.')
      setStatus('error')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/kontakt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Ein Fehler ist aufgetreten.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('Verbindungsfehler. Bitte versuche es erneut.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <span className="text-2xl">✓</span>
        </div>
        <h1 className="font-display font-bold text-2xl text-gray-900 mb-3">Vielen Dank!</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Deine Nachricht ist angekommen. Wir melden uns innerhalb von 48 Stunden.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-gray-900 mb-2">Kontakt</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Fragen, Feedback oder Tool-Empfehlungen? Wir freuen uns über deine Nachricht.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700">Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Dein Name"
              disabled={status === 'loading'}
              className="px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700">E-Mail <span className="text-red-400">*</span></label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="deine@email.de"
              disabled={status === 'loading'}
              className="px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-700">Betreff</label>
          <select
            value={subject}
            onChange={e => setSubject(e.target.value)}
            disabled={status === 'loading'}
            className="px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          >
            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-700">
            Nachricht <span className="text-red-400">*</span>
            <span className="text-gray-400 font-normal ml-1">(min. 20 Zeichen)</span>
          </label>
          <textarea
            required
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Deine Nachricht..."
            rows={5}
            disabled={status === 'loading'}
            className="px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-60"
          />
          <p className="text-xs text-gray-400 text-right">{message.length} Zeichen</p>
        </div>

        {status === 'error' && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-3 rounded-xl transition-colors"
        >
          {status === 'loading' ? 'Wird gesendet…' : 'Nachricht senden'}
        </button>
      </form>
    </div>
  )
}
