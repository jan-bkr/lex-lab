/**
 * Replace common Windows-1252 / Latin-1 sequences that appear in
 * RSS feeds whose XML is mis-declared as UTF-8.
 * En-dash (U+2013) and em-dash (U+2014) differ only in their last byte
 * (0x93 vs 0x94 in CP-1252), so we use explicit Unicode escapes as keys.
 */
const ENCODING_MAP: Record<string, string> = {
  'Ã¼': 'ü', 'Ã¶': 'ö', 'Ã¤': 'ä',
  'Ãœ': 'Ü', 'Ã–': 'Ö', 'Ã„': 'Ä',
  'ÃŸ': 'ß',
  'Ã©': 'é', 'Ã¨': 'è', 'Ã ': 'à',
  'Ã¢': 'â', 'Ã®': 'î', 'Ã´': 'ô', 'Ã»': 'û',
  // â€ + 0x93 (CP-1252 en-dash) → –
  ['â\u0080\u0093']: '\u2013',
  // â€ + 0x94 (CP-1252 em-dash) → —
  ['â\u0080\u0094']: '\u2014',
  // opening/closing double quotes
  'â€œ': '\u201c', 'â€\u009d': '\u201d',
  // opening/closing single quotes
  'â€˜': '\u2018', 'â€™': '\u2019',
  // ellipsis
  'â€¦': '\u2026',
  // guillemets and non-breaking space
  'Â«': '«', 'Â»': '»', 'Â ': ' ',
  // stray control char 0x13 → en-dash
  '\u0013': '\u2013',
}

export const cleanText = (str: string): string => {
  if (!str) return ''
  return Object.entries(ENCODING_MAP).reduce((s, [k, v]) => s.replaceAll(k, v), str)
}
