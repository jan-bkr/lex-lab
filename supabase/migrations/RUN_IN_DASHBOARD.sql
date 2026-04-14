-- ────────────────────────────────────────────────────────────────────────────
-- LexLab — pending migrations (run once in Supabase Dashboard → SQL editor)
-- After running, delete this file or keep it as documentation.
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. Fix tool_votes privacy (20260414000002) ──────────────────────────────
-- Removes the overly permissive SELECT policy that exposed voter_ip (PII) to
-- any anon client. Both vote routes use the service-role client and need no RLS.

drop policy if exists "tool_votes_select" on tool_votes;


-- ── 2. Atomic vote toggle RPC (20260414000003) ───────────────────────────────
-- Single-transaction function: INSERT/DELETE on tool_votes + atomic
-- UPDATE tools SET votes = votes ± 1. Called via adminSupabase.rpc().

create or replace function toggle_tool_vote(p_tool_id uuid, p_voter_ip text)
returns json
language plpgsql
security definer
as $$
declare
  v_existing_id uuid;
  v_new_votes   int;
  v_voted       boolean;
begin
  select id into v_existing_id
  from tool_votes
  where tool_id = p_tool_id and voter_ip = p_voter_ip;

  if v_existing_id is null then
    insert into tool_votes (tool_id, voter_ip) values (p_tool_id, p_voter_ip);
    update tools
      set votes = coalesce(votes, 0) + 1
      where id = p_tool_id
      returning votes into v_new_votes;
    v_voted := true;
  else
    delete from tool_votes where id = v_existing_id;
    update tools
      set votes = greatest(0, coalesce(votes, 0) - 1)
      where id = p_tool_id
      returning votes into v_new_votes;
    v_voted := false;
  end if;

  return json_build_object(
    'voted', v_voted,
    'votes', coalesce(v_new_votes, 0)
  );
end;
$$;
