-- Newsletter-Ausgaben (LexLab Weekly Brief)
-- Zugriff ausschließlich via Service-Role (adminSupabase) — keine öffentlichen Policies.

create table if not exists newsletter_issues (
  id                   uuid        primary key default gen_random_uuid(),
  title                text        not null,
  preheader            text        not null default '',
  issue_date           date        not null default current_date,
  editors_note_auto    text        not null default '',
  editors_note_manual  text,
  editors_note_mode    text        not null default 'auto'
                                   check (editors_note_mode in ('auto', 'manual')),
  top_developments     jsonb       not null default '[]',
  tool_watch           jsonb,
  radar_signals        jsonb       not null default '[]',
  lexlab_pick          jsonb,
  status               text        not null default 'draft'
                                   check (status in ('draft', 'ready', 'sent')),
  sent_at              timestamptz,
  recipient_count      integer,
  created_at           timestamptz not null default now()
);

alter table newsletter_issues enable row level security;
-- Kein public SELECT / INSERT / UPDATE / DELETE — alle Operationen via service role.
