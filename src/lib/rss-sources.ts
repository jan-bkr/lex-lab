export interface RssSource {
  name: string
  url: string
  category: string
}

export const RSS_SOURCES: RssSource[] = [
  { name: 'Golem KI',            url: 'https://rss.golem.de/rss.php?feed=ATOM1.0',                      category: 'Legal Tech'         },
  { name: 'Finance Magazin',     url: 'https://www.finance-magazin.de/feed/',                            category: 'M&A'                },
  { name: 'JUVE',                url: 'https://www.juve.de/feed/',                                       category: 'M&A'                },
  { name: 'Heise',               url: 'https://www.heise.de/rss/heise-atom.xml',                         category: 'Legal Tech'         },
  { name: 'Datenschutz-Notizen', url: 'https://www.datenschutz-notizen.de/feed/',                        category: 'Regulierung'        },
  { name: 'Gründerszene',        url: 'https://www.gruenderszene.de/feed',                               category: 'Venture Capital'    },
  { name: 'Handelsblatt Tech',   url: 'https://www.handelsblatt.com/contentexport/feed/technologie',     category: 'Legal Tech'         },
  { name: 'Capital',             url: 'https://www.capital.de/feed/',                                    category: 'M&A'                },
]
