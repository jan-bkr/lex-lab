-- Allow anonymous users to submit new comments (status must be 'pending').
-- Approved/rejected status changes are handled server-side via adminSupabase.
-- Reading approved comments is done server-side too (adminSupabase in route handler).

ALTER TABLE tool_comments ENABLE ROW LEVEL SECURITY;

-- Drop policy if it was already created to make this script idempotent
DROP POLICY IF EXISTS "Anon can insert pending comments" ON tool_comments;

CREATE POLICY "Anon can insert pending comments"
  ON tool_comments
  FOR INSERT
  TO anon
  WITH CHECK (status = 'pending');
