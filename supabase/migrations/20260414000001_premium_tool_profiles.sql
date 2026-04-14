-- ─── Premium Tool Profiles ────────────────────────────────────────────────────
-- Adds rich editorial + scoring fields to tools,
-- and a star rating column to tool_comments.

-- ── tools: editorial content ──────────────────────────────────────────────────

alter table tools
  add column if not exists long_description  text,
  add column if not exists best_for          text[],
  add column if not exists not_for           text[],
  add column if not exists verdict           text,
  add column if not exists last_reviewed_at  date;

-- ── tools: LexLab Score subscores (each 1–10, null = not yet rated) ──────────

alter table tools
  add column if not exists score_praxisreife smallint check (score_praxisreife between 1 and 10),
  add column if not exists score_datenschutz smallint check (score_datenschutz between 1 and 10),
  add column if not exists score_dach        smallint check (score_dach        between 1 and 10),
  add column if not exists score_ux          smallint check (score_ux          between 1 and 10),
  add column if not exists score_preis       smallint check (score_preis       between 1 and 10),
  -- Weighted total 0–100 (stored, updated by admin on save)
  -- Weights: Praxisreife 30%, Datenschutz 25%, DACH 25%, UX 10%, Preis 10%
  add column if not exists lexlab_score      smallint check (lexlab_score between 0 and 100);

-- ── tool_comments: optional star rating (1–5) + make comment nullable ────────

alter table tool_comments
  add column if not exists rating smallint check (rating between 1 and 5);

-- Allow comment-only-rating (no text): make comment column nullable.
-- Constraint: at least one of comment or rating must be present (checked in app layer).
alter table tool_comments
  alter column comment drop not null;
