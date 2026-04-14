// Weights: Praxisreife 30%, Datenschutz 25%, DACH 25%, UX 10%, Preis 10%
export function computeLexlabScore(
  p: number | null, d: number | null, dach: number | null,
  ux: number | null, pr: number | null
): number | null {
  const scores = [
    { v: p,    w: 30 },
    { v: d,    w: 25 },
    { v: dach, w: 25 },
    { v: ux,   w: 10 },
    { v: pr,   w: 10 },
  ]
  let total = 0, totalWeight = 0
  for (const { v, w } of scores) {
    if (v != null && v > 0) { total += v * w; totalWeight += w }
  }
  if (totalWeight === 0) return null
  return Math.round((total / totalWeight) * 10)
}
