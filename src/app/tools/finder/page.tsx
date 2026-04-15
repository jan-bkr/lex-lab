import { Metadata } from 'next'
import FinderClient from './FinderClient'

export const metadata: Metadata = {
  title: 'Tool Finder – LexLab',
  description:
    'Finde in 4 Schritten das passende KI-Tool für deine Kanzlei oder dein Unternehmen. Kuratierte Empfehlungen vom LexLab-Team.',
}

export default function FinderPage() {
  return <FinderClient />
}
