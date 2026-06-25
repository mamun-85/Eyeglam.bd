-- ============================================================================
-- EyeGlam — Security & Configuration Patch
-- Run this in the Supabase SQL Editor AFTER supabase-migration.sql.
-- Safe to run multiple times.
-- ============================================================================

-- 1) HARDEN ADMIN CHECK ------------------------------------------------------
-- Previously is_admin() read user_metadata, which a logged-in user can edit on
-- themselves via supabase.auth.updateUser({ data: { is_admin: true } }) — a
-- privilege-escalation hole. app_metadata can ONLY be set by the service role
-- (Supabase dashboard / admin API), so we switch to it.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false);
$$;

-- 2) ALLOW CUSTOMERS TO PLACE ORDERS ----------------------------------------
-- orders has RLS enabled but no public INSERT policy, so anonymous checkout is
-- blocked. Allow INSERT only (NOT select/update/delete) so customers can place
-- orders but cannot read anyone's orders. Admins keep full access via the
-- existing "Admin full access on orders" policy.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='orders'
      AND policyname='Public can create orders'
  ) THEN
    CREATE POLICY "Public can create orders" ON orders
      FOR INSERT TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- 3) LET THE STOREFRONT READ SITE SETTINGS ----------------------------------
-- site_settings has RLS enabled but no public read policy, so anonymous
-- visitors fall back to defaults (admin's saved marketing copy, shipping,
-- WhatsApp number, promo popup, etc. would not show). These values are all
-- meant to be public, so allow public SELECT. Writes stay admin-only.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='site_settings'
      AND policyname='Public can read site settings'
  ) THEN
    CREATE POLICY "Public can read site settings" ON site_settings
      FOR SELECT USING (true);
  END IF;
END $$;

-- ============================================================================
-- AFTER RUNNING THIS, set your admin user's app_metadata (see ADMIN_SETUP.md):
--   Supabase Dashboard → Authentication → Users → (your user) → Edit
--   → app_metadata → { "is_admin": true }
-- ============================================================================
