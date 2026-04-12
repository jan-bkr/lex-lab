import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: '400',
  style: ['normal', 'italic'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.lex-lab.de'),
  title: {
    default: 'lex-lab.de — KI-Tools für Juristen',
    template: '%s | lex-lab.de',
  },
  description: 'Die kuratierte Plattform für KI-Tools, Workflows und Prompts für Steuerrecht, M&A, Gesellschaftsrecht und Venture Capital.',
  keywords: ['KI Tools Juristen', 'Legal Tech Deutschland', 'Steuerrecht KI', 'M&A Tools', 'Rechtsanwalt KI', 'Legal AI', 'Prompt Bibliothek Recht'],
  authors: [{ name: 'lex-lab.de' }],
  creator: 'lex-lab.de',
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://www.lex-lab.de',
    siteName: 'lex-lab.de',
    title: 'lex-lab.de — KI-Tools für Juristen',
    description: 'Die kuratierte Plattform für KI-Tools, Workflows und Prompts für Steuerrecht, M&A, Gesellschaftsrecht und Venture Capital.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'lex-lab.de — KI-Tools für Juristen',
    description: 'KI-Tools, Workflows und Prompts für den deutschen Rechtsmarkt.',
  },
  alternates: {
    canonical: 'https://www.lex-lab.de',
  },
  verification: {
    google: 'BZAgD_Ti6XbDu2S8ZW_H3nWMJUWGBK2xS3yDOES3PmU',
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%232563EB'/><text x='50%' y='50%' dominant-baseline='central' text-anchor='middle' fill='white' font-size='18' font-family='serif' font-weight='bold'>§</text></svg>",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${dmSerifDisplay.variable} ${dmSans.variable}`}>
      <body className="bg-[#F7F7F5] text-[#111827] antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
