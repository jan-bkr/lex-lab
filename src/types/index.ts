export type Rechtsgebiet = 'Steuerrecht' | 'M&A' | 'Gesellschaftsrecht' | 'Venture Capital'

export interface Tool {
  id: string
  name: string
  slug: string
  url: string
  tagline: string
  description: string
  rechtsgebiet: Rechtsgebiet[]
  category: string[]
  votes: number
  isNew: boolean
  createdAt: string
  // Extended fields (populated on detail page)
  pricingType?: 'free' | 'freemium' | 'paid' | 'enterprise' | null
  pricingUrl?: string | null
  screenshotUrl?: string | null
  // Premium profile fields
  longDescription?: string | null
  bestFor?: string[] | null
  notFor?: string[] | null
  verdict?: string | null
  lastReviewedAt?: string | null
  // LexLab Score (each 1–10, null = not yet scored)
  scorePraxisreife?: number | null
  scoreDatenschutz?: number | null
  scoreDach?: number | null
  scoreUx?: number | null
  scorePreis?: number | null
  lexlabScore?: number | null
}

export interface ToolComment {
  id: string
  name: string
  role: string
  rechtsgebiet: string[]
  comment: string | null
  rating: number | null   // 1–5 stars, optional
  created_at: string
}

export interface Workflow {
  id: string
  title: string
  slug: string
  rechtsgebiet: Rechtsgebiet[]
  readingTime: number
  excerpt: string
  createdAt: string
}

export interface Prompt {
  id: string
  title: string
  slug: string
  promptText: string
  useCase: string
  rechtsgebiet: Rechtsgebiet[]
  exampleOutput: string
  createdAt: string
}

export interface NewsArticle {
  id: string
  title: string
  slug: string
  summary: string
  sourceUrl: string
  sourceName: string
  category: string
  publishedAt: string
  aiGenerated: boolean
}

export interface Event {
  id: string
  title: string
  date: string
  type: 'BGH' | 'BFH' | 'Gesetz' | 'Konferenz'
  url: string
  description: string
}
