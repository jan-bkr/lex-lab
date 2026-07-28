import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Sans, Spectral, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

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

const spectral = Spectral({
  subsets: ['latin'],
  variable: '--font-spectral',
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.lex-lab.de'),
  title: {
    default: 'LexLab — KI-Tools für Juristen',
    template: '%s | LexLab',
  },
  description: 'Die kuratierte Plattform für KI-Tools, Workflows und Prompts für Steuerrecht, M&A, Gesellschaftsrecht und Venture Capital.',
  keywords: ['KI Tools Juristen', 'Legal Tech Deutschland', 'Steuerrecht KI', 'M&A Tools', 'Rechtsanwalt KI', 'Legal AI', 'Prompt Bibliothek Recht'],
  authors: [{ name: 'LexLab' }],
  creator: 'LexLab',
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://www.lex-lab.de',
    siteName: 'LexLab',
    title: 'LexLab — KI-Tools für Juristen',
    description: 'Die kuratierte Plattform für KI-Tools, Workflows und Prompts für Steuerrecht, M&A, Gesellschaftsrecht und Venture Capital.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'LexLab — KI für den deutschen Rechtsmarkt' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LexLab — KI-Tools für Juristen',
    description: 'KI-Tools, Workflows und Prompts für den deutschen Rechtsmarkt.',
    images: ['/og.png'],
  },
  verification: {
    google: 'BZAgD_Ti6XbDu2S8ZW_H3nWMJUWGBK2xS3yDOES3PmU',
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23111827'/%3E%3Ctext x='4' y='14' font-family='Georgia%2C serif' font-size='11' font-weight='700' fill='white' letter-spacing='-0.5'%3Elex%3C/text%3E%3Ctext x='4' y='25' font-family='Georgia%2C serif' font-size='11' font-weight='700' fill='%232563EB' letter-spacing='-0.5'%3Elab%3C/text%3E%3C/svg%3E",
        type: "image/svg+xml",
      },
    ],
    apple: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23111827'/%3E%3Ctext x='4' y='14' font-family='Georgia%2C serif' font-size='11' font-weight='700' fill='white'%3Elex%3C/text%3E%3Ctext x='4' y='25' font-family='Georgia%2C serif' font-size='11' font-weight='700' fill='%232563EB'%3Elab%3C/text%3E%3C/svg%3E",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${dmSerifDisplay.variable} ${dmSans.variable} ${spectral.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-[#F7F7F5] text-[#111827] antialiased">
        <a href="#main-content" className="skip-link">Zum Inhalt springen</a>
        <Navbar />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
