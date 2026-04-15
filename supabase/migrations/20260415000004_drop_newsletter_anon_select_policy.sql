-- Drop the public SELECT policy on newsletter_subscribers.
--
-- Background: newsletter_subscribers currently has a SELECT policy with
-- roles = {public} / qual = true (no WHERE clause), meaning any client
-- holding the anon key can read the full subscriber list — including every
-- stored email address. This is a privacy violation (DSGVO Art. 5 I lit. f —
-- Integrität und Vertraulichkeit).
--
-- Current state: every read and write on this table goes through adminSupabase
-- (service-role key, bypasses RLS entirely):
--   • /api/newsletter/subscribe  — duplicate-check SELECT + INSERT
--   • /api/newsletter/unsubscribe — DELETE (HMAC-verified)
--   • /app/admin/actions.ts      — fetchAllSubscribers, deleteSubscriber
--
-- There is no legitimate anon SELECT path. The policy must be removed, not
-- replaced with a more restrictive one — no anonymous read access is
-- correct here.
--
-- After this migration: SELECT on newsletter_subscribers is only possible for
-- the service-role key (adminSupabase). Anon and authenticated JWT holders have
-- no read access. RLS stays enabled.
--
-- NOTE: Supabase may have named this policy differently. Common auto-generated
-- names are listed below; "Service role can read" was the confirmed live name
-- (roles={public}, qual=true) from the 2026-04-15 audit. Run
-- `SELECT policyname FROM pg_policies WHERE tablename =
-- 'newsletter_subscribers' AND cmd = 'SELECT';` to confirm no SELECT policies
-- remain.

DROP POLICY IF EXISTS "Service role can read" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Enable read access for all users" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Public can view subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can view subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Public read" ON newsletter_subscribers;
