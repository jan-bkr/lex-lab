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
