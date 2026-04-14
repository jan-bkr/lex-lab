'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Event as LexEvent } from '@/types'

const TYPE_STYLES: Record<string, string> = {
  BFH: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  BGH: 'bg-blue-50 text-blue-700 border-blue-200',
  Gesetz: 'bg-amber-50 text-amber-700 border-amber-200',
  Konferenz: 'bg-gray-100 text-gray-600 border-gray-200',
}

interface EventRow {
  id: string
  title: string
  date: string
  type: string
  url: string | null
  description: string | null
  created_at: string
}

function mapRow(row: EventRow): LexEvent {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    type: row.type as LexEvent['type'],
    url: row.url ?? '#',
    description: row.description ?? '',
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function EventCard({ event }: { event: LexEvent }) {
  const isClickable = !!event.url && event.url !== '#'
  const cardClass =
    'bg-white border border-gray-100 rounded-xl p-4 flex-1 mb-4 transition-all' +
    (isClickable ? ' hover:shadow-md hover:border-gray-200 cursor-pointer' : '')

  const cardContent = (
    <>
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <span
          className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md border ${TYPE_STYLES[event.type] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}
        >
          {event.type}
        </span>
        <span className="text-xs text-gray-400">{formatDate(event.date)}</span>
      </div>
      <h3 className="font-sans font-semibold text-sm text-gray-900 leading-snug mb-1">
        {event.title}
      </h3>
      {event.description && (
        <p className="text-xs text-gray-400">{event.description}</p>
      )}
    </>
  )

  return (
    <div className="flex gap-4 pb-1">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-3 h-3 rounded-full bg-blue-400 border-2 border-white ring-2 ring-blue-100 mt-1" />
        <div className="w-px flex-1 bg-gray-100 mt-1" />
      </div>
      {isClickable ? (
        <a href={event.url} target="_blank" rel="noopener noreferrer" className={cardClass}>
          {cardContent}
        </a>
      ) : (
        <div className={cardClass}>{cardContent}</div>
      )}
    </div>
  )
}

export default function EventsPage() {
  const [events, setEvents] = useState<LexEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    async function fetchEvents() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })

      if (error) {
        setLoadError(true)
      } else {
        setEvents(data ? (data as EventRow[]).map(mapRow) : [])
      }
      setLoading(false)
    }
    fetchEvents()
  }, [])

  const now = new Date()
  const upcoming = events.filter(e => new Date(e.date) >= now)
  const past = events.filter(e => new Date(e.date) < now)

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-pulse space-y-4">
        <div className="h-8 bg-gray-100 rounded w-48" />
        <div className="h-4 bg-gray-100 rounded w-72" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl" />
        ))}
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-gray-900">Events & Termine</h1>
          <p className="text-gray-500 mt-1 text-sm">
            BFH/BGH-Verhandlungen, Gesetzgebungsfristen und Konferenzen
          </p>
        </div>
        <p className="text-sm text-gray-500">
          Events konnten nicht geladen werden. Bitte später erneut versuchen.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-gray-900">Events & Termine</h1>
        <p className="text-gray-500 mt-1 text-sm">
          BFH/BGH-Verhandlungen, Gesetzgebungsfristen und Konferenzen
        </p>
      </div>

      {upcoming.length > 0 && (
        <div className="mb-8">
          <h2 className="font-display font-semibold text-gray-700 text-xs uppercase tracking-widest mb-5">
            Kommende Termine
          </h2>
          {upcoming.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h2 className="font-display font-semibold text-gray-400 text-xs uppercase tracking-widest mb-5">
            Vergangene Termine
          </h2>
          <div className="opacity-60">
            {past.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {events.length === 0 && (
        <div className="text-center py-16 text-sm text-gray-400">
          Keine Termine gefunden.
        </div>
      )}
    </div>
  )
}
