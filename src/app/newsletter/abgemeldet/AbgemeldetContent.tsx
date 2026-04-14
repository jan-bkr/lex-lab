'use client'

import { useSearchParams } from 'next/navigation'

export function AbgemeldetContent() {
  const params  = useSearchParams()
  const status  = params.get('status')
  const isError = status === 'error'
  const isInvalid = status === 'invalid'

  if (isError || isInvalid) {
    return (
      <>
        <div className="text-4xl">⚠️</div>
        <h1 className="font-display text-2xl font-bold text-gray-900">
          {isInvalid ? 'Ungültiger Link' : 'Ein Fehler ist aufgetreten'}
        </h1>
        <p className="text-gray-500 text-sm">
          {isInvalid
            ? 'Der Abmeldelink ist abgelaufen oder ungültig.'
            : 'Bitte versuche es erneut oder schreib uns an kontakt@lex-lab.de.'}
        </p>
      </>
    )
  }

  return (
    <>
      <div className="text-4xl">👋</div>
      <h1 className="font-display text-2xl font-bold text-gray-900">
        Du wurdest abgemeldet.
      </h1>
      <p className="text-gray-500 text-sm">
        Schade, dass du gehst. Du erhältst ab sofort keine weiteren Mails von lex-lab.de.
      </p>
    </>
  )
}
