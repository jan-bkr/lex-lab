-- Migration: add tool_votes table for IP-based vote tracking (toggle support)

create table if not exists tool_votes (
  id         uuid        primary key default gen_random_uuid(),
  tool_id    uuid        not null references tools(id) on delete cascade,
  voter_ip   text        not null,
  created_at timestamptz default now(),
  unique(tool_id, voter_ip)
);

-- RLS: publicly readable (vote-status checks), write-only via Service Role
alter table tool_votes enable row level security;

create policy "tool_votes_select" on tool_votes
  for select using (true);
