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
export const PROMPT_BUILDER_PAUSED = true

export const PROMPT_BUILDER_PAUSED_MESSAGE =
  'Der Prompt Builder wird derzeit überarbeitet und ist vorübergehend pausiert.'
