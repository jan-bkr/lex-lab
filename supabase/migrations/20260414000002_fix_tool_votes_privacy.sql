-- Migration: remove publicly readable SELECT policy from tool_votes.
--
-- Background: the previous migration granted `for select using (true)`, which
-- makes voter_ip (an IP address = PII under GDPR) readable by any anon client.
--
-- Both /api/tools/vote and /api/tools/vote-status use the service-role client
-- (adminSupabase) which bypasses RLS entirely, so removing anon SELECT does not
-- break any existing functionality.

drop policy if exists "tool_votes_select" on tool_votes;
