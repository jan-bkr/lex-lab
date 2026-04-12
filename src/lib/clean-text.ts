/**
 * Fix UTF-8 bytes misread as Windows-1252/Latin-1 by rss-parser.
 * Apply to item.title and item.contentSnippet before use.
 */
export const fixEncoding = (str: string): string => {
  if (!str) return ''
  return str
    .replace(/â€ž/g, '„')
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€˜/g, '\u2018')
    .replace(/â€™/g, '\u2019')
    .replace(/â€"/g, '\u2013')
    .replace(/â€"/g, '\u2014')
    .replace(/â€¦/g, '\u2026')
    .replace(/Ã¤/g, 'ä')
    .replace(/Ã¶/g, 'ö')
    .replace(/Ã¼/g, 'ü')
    .replace(/Ã„/g, 'Ä')
    .replace(/Ã–/g, 'Ö')
    .replace(/Ãœ/g, 'Ü')
    .replace(/ÃŸ/g, 'ß')
    .replace(/Ã©/g, 'é')
    .replace(/Ã /g, 'à')
    .replace(/Ã¨/g, 'è')
    .replace(/Ã®/g, 'î')
    .replace(/Ã´/g, 'ô')
    .replace(/Ã»/g, 'û')
    .replace(/Â«/g, '«')
    .replace(/Â»/g, '»')
    .replace(/Â·/g, '·')
    .replace(/Â /g, ' ')
}
