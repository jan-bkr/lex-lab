export interface RssSource {
  name: string
  url: string
  category: string
}

export const RSS_SOURCES: RssSource[] = [
  { name: 'BFH',            url: 'https://www.bundesfinanzhof.de/rss/entscheidungen/',                                                                              category: 'Steuerrecht'     },
  { name: 'BGH',            url: 'https://www.bundesgerichtshof.de/SiteGlobals/Forms/RSS/bgh_rss_en.xml',                                                           category: 'Gesellschaftsrecht' },
  { name: 'BMF',            url: 'https://www.bundesfinanzministerium.de/SiteGlobals/Functions/RSS/DE/Feed/RSSNewsletter/RSSNewsletter_Steuern.xml',                 category: 'Steuerrecht'     },
  { name: 'LTO',            url: 'https://www.lto.de/feeds/nachrichten/',                                                                                           category: 'Legal Tech'      },
  { name: 'JUVE',           url: 'https://www.juve.de/feed/',                                                                                                       category: 'M&A'             },
  { name: 'Haufe Steuer',   url: 'https://www.haufe.de/steuern/rss',                                                                                               category: 'Steuerrecht'     },
  { name: 'Beck Aktuell',   url: 'https://rsw.beck.de/rss/beckaktuell',                                                                                            category: 'Gesellschaftsrecht' },
  { name: 'VC Magazin',     url: 'https://www.vc-magazin.de/feed/',                                                                                                category: 'Venture Capital' },
  { name: 'Finance Magazin',url: 'https://www.finance-magazin.de/feed/',                                                                                           category: 'M&A'             },
]
