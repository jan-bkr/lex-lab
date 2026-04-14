-- Migration: atomic vote toggle via PostgreSQL function.
--
-- Problem: the previous vote route read tools.votes, then wrote votes + 1 in a
-- separate statement. Under concurrent requests this could produce a lost update
-- (both reads see the same count, both write count+1, net result is +1 instead +2).
--
-- Fix: a single PL/pgSQL function runs inside one implicit transaction.
--   • INSERT or DELETE on tool_votes (unique constraint prevents double-voting)
--   • UPDATE tools SET votes = votes ± 1  (atomic integer arithmetic in Postgres)
-- The caller (adminSupabase.rpc) only needs one round-trip.

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
  -- Check whether this IP has already voted on this tool
  select id into v_existing_id
  from tool_votes
  where tool_id = p_tool_id and voter_ip = p_voter_ip;

  if v_existing_id is null then
    -- ── Add vote ──
    insert into tool_votes (tool_id, voter_ip) values (p_tool_id, p_voter_ip);
    update tools
      set votes = coalesce(votes, 0) + 1
      where id = p_tool_id
      returning votes into v_new_votes;
    v_voted := true;
  else
    -- ── Remove vote ──
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
