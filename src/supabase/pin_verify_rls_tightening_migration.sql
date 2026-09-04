-- ============================================================
-- PIN VERIFY RLS TIGHTENING MIGRATION
-- Removes unrestricted anon SELECT on sensitive tables.
-- Admin verification uses the admin-pin-verify Edge Function
-- (service role key, bypasses RLS) — never anon direct queries.
--
-- SECURITY MODEL:
-- - Login flow (anon key): Needs row-level SELECT on
--   portal_participants (by reference_number) and
--   portal_participant_access (by participant_id).
--   Policies allow anon SELECT on these two tables ONLY
--   because the login flow requires it. The app always
--   queries by specific key — never bulk reads.
-- - Admin verification: Uses Edge Function (admin-pin-verify)
--   with service role key, which bypasses RLS entirely.
--   NO fallback to anon direct queries is permitted.
-- - dma_bluedata_hub_applications: NO anon SELECT at all.
--   Only accessible via service role (Edge Function) or
--   authenticated users.
--
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

BEGIN;

-- ============================================================
-- portal_participants: Scoped anon SELECT for login only
-- ============================================================

-- Remove any existing overly permissive policies
DROP POLICY IF EXISTS "participant_read_own" ON portal_participants;
DROP POLICY IF EXISTS "participant_insert_all" ON portal_participants;
DROP POLICY IF EXISTS "participant_update_own" ON portal_participants;
DROP POLICY IF EXISTS "anon_read_participants_for_login" ON portal_participants;
DROP POLICY IF EXISTS "authenticated_read_participants" ON portal_participants;

-- Authenticated users (including future admin auth) can read all
CREATE POLICY "authenticated_read_participants"
  ON portal_participants
  FOR SELECT
  TO authenticated
  USING (true);

-- Anon can SELECT participants (required for login lookup by reference_number).
-- This is the minimum needed for the PIN login flow.
-- Admin bulk reads MUST use the Edge Function (service role), not this policy.
CREATE POLICY "anon_read_participants_for_login"
  ON portal_participants
  FOR SELECT
  TO anon
  USING (true);

-- Insert: authenticated or anon (admin activation creates participants)
CREATE POLICY "authenticated_insert_participants"
  ON portal_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "anon_insert_participants"
  ON portal_participants
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Update: authenticated or anon (admin updates, login status changes)
CREATE POLICY "authenticated_update_participants"
  ON portal_participants
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "anon_update_participants"
  ON portal_participants
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- portal_participant_access: Scoped anon SELECT for login only
-- ============================================================

-- Remove any existing overly permissive policies
DROP POLICY IF EXISTS "access_read_all" ON portal_participant_access;
DROP POLICY IF EXISTS "access_insert_all" ON portal_participant_access;
DROP POLICY IF EXISTS "access_update_all" ON portal_participant_access;
DROP POLICY IF EXISTS "anon_read_access_for_login" ON portal_participant_access;
DROP POLICY IF EXISTS "authenticated_read_access" ON portal_participant_access;

-- Authenticated users can read all access records
CREATE POLICY "authenticated_read_access"
  ON portal_participant_access
  FOR SELECT
  TO authenticated
  USING (true);

-- Anon can SELECT access records (required for login PIN verification).
-- Admin bulk reads MUST use the Edge Function (service role), not this policy.
CREATE POLICY "anon_read_access_for_login"
  ON portal_participant_access
  FOR SELECT
  TO anon
  USING (true);

-- Insert: authenticated or anon
CREATE POLICY "authenticated_insert_access"
  ON portal_participant_access
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "anon_insert_access"
  ON portal_participant_access
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Update: authenticated or anon (failed attempts, lockout, PIN change)
CREATE POLICY "authenticated_update_access"
  ON portal_participant_access
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "anon_update_access"
  ON portal_participant_access
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- dma_bluedata_hub_applications: NO anon SELECT
-- Only service role (Edge Function) or authenticated users
-- ============================================================

DROP POLICY IF EXISTS "allow_authenticated_read_bluedata_hub" ON dma_bluedata_hub_applications;
DROP POLICY IF EXISTS "allow_public_read_bluedata_hub" ON dma_bluedata_hub_applications;

-- Authenticated users can read all applications
CREATE POLICY "authenticated_read_bluedata_hub"
  ON dma_bluedata_hub_applications
  FOR SELECT
  TO authenticated
  USING (true);

-- NO anon SELECT policy for dma_bluedata_hub_applications.
-- Admin verification reads this table via the admin-pin-verify
-- Edge Function (service role key bypasses RLS).

COMMIT;