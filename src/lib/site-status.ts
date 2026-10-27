// ─── Pausierte Module ─────────────────────────────────────────────────────────
//
// Zentrale Schalter für vorübergehend pausierte Bereiche. Zum Reaktivieren das
// jeweilige Flag auf `false` setzen.
//
// NEWS_PIPELINE_PAUSED steuert nur die Darstellung (Hinweise, Copy). Die
// Pipeline selbst wird über die Cron-Einträge in `vercel.json` gestoppt —
// beim Reaktivieren dort wieder eintragen:
//   { "path": "/api/pipeline", "schedule": "0 6 * * *" }
//   { "path": "/api/pipeline", "schedule": "0 12 * * *" }

export const NEWS_PIPELINE_PAUSED = true

// NEWSLETTER_PAUSED kennzeichnet den Weekly Brief als pausiert (Newsletter-Seite,
// Anmelde-Boxen, Willkommensmail). Anmeldung und Admin-Versand bleiben technisch
// möglich — Abonnenten werden vorgemerkt.
export const NEWSLETTER_PAUSED = true

export const NEWSLETTER_PAUSED_NOTE =
  'Der Newsletter ist pausiert, solange LexLab neu aufgestellt wird. Wenn du dich jetzt einträgst, bekommst du die nächste Ausgabe, sobald es weitergeht.'
