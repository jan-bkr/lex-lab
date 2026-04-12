export interface RssSource {
  name: string
  url: string
  category: string
}

export const RSS_SOURCES: RssSource[] = [
  { name: 'Finance Magazin',     url: 'https://www.finance-magazin.de/feed/',           category: 'M&A'             },
  { name: 'JUVE',                url: 'https://www.juve.de/feed/',                       category: 'M&A'             },
  { name: 'M&A Magazin',         url: 'https://www.m-und-a.de/feed/',                   category: 'M&A'             },
  { name: 'Datenschutz-Notizen', url: 'https://www.datenschutz-notizen.de/feed/',        category: 'Regulierung'     },
  { name: 'TaxTech Blog',        url: 'https://www.taxtech.blog/feed',                  category: 'Legal Tech'      },
  { name: 'Gründerszene',        url: 'https://www.gruenderszene.de/feed',               category: 'Venture Capital' },
  { name: 'Startbase',           url: 'https://startbase.de/feed',                      category: 'Venture Capital' },
  { name: 'Deutsche Startups',   url: 'https://www.deutsche-startups.de/feed/',         category: 'Venture Capital' },
]
