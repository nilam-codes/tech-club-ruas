-- ==============================================================================
-- TECH CLUB (RAMAIAH UNIVERSITY OF APPLIED SCIENCES)
-- Supabase Schema & Row-Level Security Migration: Phase 1 Foundation
-- ==============================================================================

-- 1. ADMINS TABLE
-- Maps Supabase auth.users to an admin role
CREATE TABLE IF NOT EXISTS public.club_admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Secure Admin check function for RLS (Security Definer allows it to bypass RLS to check the table)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.club_admins
    WHERE id = auth.uid()
  );
$$;

-- 2. EVENTS TABLE
-- Holds official club events, schedules, status, and registration limits
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TEXT,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'past', 'cancelled')),
    registration_limit INTEGER DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for chronological queries and status lookups
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events (event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events (status);

-- 3. REGISTRATIONS TABLE
-- Captures verified student registrations linked to specific events
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    college TEXT NOT NULL,
    course TEXT NOT NULL,
    year TEXT NOT NULL,
    student_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_event_registration UNIQUE (event_id, email)
);

-- Indexes for event lookups and registration queries
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON public.registrations (event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations (email);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.club_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to make script re-runnable)
DROP POLICY IF EXISTS "Admins can view admins" ON public.club_admins;
DROP POLICY IF EXISTS "Public can view events" ON public.events;
DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
DROP POLICY IF EXISTS "Students can submit registrations" ON public.registrations;
DROP POLICY IF EXISTS "Admins can view registrations" ON public.registrations;
DROP POLICY IF EXISTS "Admins can update registrations" ON public.registrations;
DROP POLICY IF EXISTS "Admins can delete registrations" ON public.registrations;

-- CLUB_ADMINS POLICIES
-- Only admins can see who other admins are
CREATE POLICY "Admins can view admins"
    ON public.club_admins
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- EVENTS POLICIES
-- Any visitor can view events on the public website
CREATE POLICY "Public can view events"
    ON public.events
    FOR SELECT
    TO public
    USING (true);

-- Event creation and modification restricted to verified admins
CREATE POLICY "Admins can insert events"
    ON public.events
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update events"
    ON public.events
    FOR UPDATE
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can delete events"
    ON public.events
    FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- REGISTRATIONS POLICIES
-- Students can submit registration forms
CREATE POLICY "Students can submit registrations"
    ON public.registrations
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Students must NOT be able to read the complete registrations table.
-- Only authenticated verified administrators can view registrations.
CREATE POLICY "Admins can view registrations"
    ON public.registrations
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can update registrations"
    ON public.registrations
    FOR UPDATE
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can delete registrations"
    ON public.registrations
    FOR DELETE
    TO authenticated
    USING (public.is_admin());

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
