export interface RssSource {
  name: string
  url: string
  category: string
}

export const RSS_SOURCES: RssSource[] = [
  { name: 'BFH',            url: 'https://www.bundesfinanzhof.de/rss/entscheidungen/',                                                                                              category: 'Steuerrecht'        },
  { name: 'BGH',            url: 'https://www.bundesgerichtshof.de/SiteGlobals/Functions/RSS/bgh_rss.xml',                                                                          category: 'Gesellschaftsrecht' },
  { name: 'BMF',            url: 'https://www.bundesfinanzministerium.de/SiteGlobals/Functions/RSS/DE/Feed/RSSNewsletter/RSSNewsletter_Steuern.xml',                                category: 'Steuerrecht'        },
  { name: 'Heise Recht',    url: 'https://www.heise.de/rechtspolitik/rss/rechtspolitik-atom.xml',                                                                                   category: 'Legal Tech'         },
  { name: 'Golem KI',       url: 'https://rss.golem.de/rss.php?feed=ATOM1.0',                                                                                                      category: 'Legal Tech'         },
  { name: 'VC Magazin',     url: 'https://www.vc-magazin.de/feed/',                                                                                                                category: 'Venture Capital'    },
  { name: 'Finance Magazin',url: 'https://www.finance-magazin.de/feed/',                                                                                                           category: 'M&A'                },
  { name: 'Haufe Steuer',   url: 'https://www.haufe.de/steuern/rss/steuern.rss',                                                                                                   category: 'Steuerrecht'        },
  { name: 'NWB Blog',       url: 'https://www.nwb.de/blog/feed/',                                                                                                                  category: 'Steuerrecht'        },
]
