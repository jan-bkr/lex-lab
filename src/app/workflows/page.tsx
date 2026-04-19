import type { Metadata } from 'next'
import WorkflowsClient from './WorkflowsClient'

export const metadata: Metadata = {
  title: 'Workflows',
  description: 'Schritt-für-Schritt-Anleitungen für juristische KI-Aufgaben — mit konkreten Prompts, Checklisten und Praxisbeispielen für Kanzleien und Steuerberater.',
  alternates: { canonical: 'https://www.lex-lab.de/workflows' },
  openGraph: {
    title: 'Workflows — LexLab',
    description: 'Schritt-für-Schritt-Anleitungen für juristische KI-Aufgaben — mit konkreten Prompts, Checklisten und Praxisbeispielen.',
  },
}

export default function WorkflowsPage() {
  return <WorkflowsClient />
}
