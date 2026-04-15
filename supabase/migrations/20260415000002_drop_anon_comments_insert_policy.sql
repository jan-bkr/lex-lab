-- Drop the anon INSERT policy on tool_comments.
--
-- Migration 20260415000000_tool_comments_rls.sql created an RLS policy that
-- allows anon clients to INSERT directly into tool_comments. This is obsolete
-- and unsafe: the /api/tools/[id]/comments route handler uses adminSupabase and
-- enforces all security checks itself (same-origin, rate limit, validation,
-- hardcoded status='pending', approved-tool check). An open anon INSERT policy
-- bypasses all of these.
--
-- This migration removes the policy. RLS stays enabled on the table; there is
-- simply no open write path for anon any more.

DROP POLICY IF EXISTS "Anon can insert pending comments" ON tool_comments;
