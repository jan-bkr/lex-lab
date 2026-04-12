/**
 * Replace common Windows-1252 / Latin-1 sequences that appear in
 * RSS feeds whose XML is mis-declared as UTF-8.
 */
export const cleanText = (str: string): string => {
  if (!str) return ''
  return str
    .replace(/Ã¼/g, 'ü').replace(/Ã¶/g, 'ö').replace(/Ã¤/g, 'ä')
    .replace(/Ãœ/g, 'Ü').replace(/Ã–/g, 'Ö').replace(/Ã„/g, 'Ä')
    .replace(/ÃŸ/g, 'ß').replace(/â€"/g, '–').replace(/â€œ/g, '\u201c')
    .replace(/â€/g, '\u201d').replace(/â€˜/g, '\u2018').replace(/â€™/g, '\u2019')
    .replace(/Ã©/g, 'é').replace(/Ã¨/g, 'è').replace(/Ã /g, 'à')
}
