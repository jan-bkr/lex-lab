import type { Metadata } from 'next'
import EventsClient from './EventsClient'

export const metadata: Metadata = {
  title: 'Events & Termine',
  description: 'BFH/BGH-Verhandlungen, Gesetzgebungsfristen und Konferenzen im Überblick — relevante Termine für Juristen und Steuerberater in Deutschland.',
  alternates: { canonical: 'https://www.lex-lab.de/events' },
  openGraph: {
    title: 'Events & Termine — LexLab',
    description: 'BFH/BGH-Verhandlungen, Gesetzgebungsfristen und Konferenzen — relevante Termine für Juristen und Steuerberater.',
  },
}

export default function EventsPage() {
  return <EventsClient />
}
