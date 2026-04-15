-- Revoke public/anon execute rights on toggle_tool_vote.
--
-- The function was created as SECURITY DEFINER, which means it runs with the
-- privileges of the owner (service role). Without an explicit REVOKE, Postgres
-- grants EXECUTE to PUBLIC by default — any client, including anon, can call it
-- directly and bypass the app-level rate limiter and IP-hashing entirely.
--
-- After this migration only the authenticated service role (used by the API route
-- handler via adminSupabase.rpc) can invoke the function.

REVOKE EXECUTE ON FUNCTION toggle_tool_vote(uuid, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION toggle_tool_vote(uuid, text) FROM anon;
REVOKE EXECUTE ON FUNCTION toggle_tool_vote(uuid, text) FROM authenticated;
