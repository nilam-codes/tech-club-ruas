-- ==============================================================================
-- TECH CLUB - CLUB TEAM SCHEMA
-- ==============================================================================

-- 1. TABLE CREATION
CREATE TABLE IF NOT EXISTS public.club_team (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    registration_number TEXT NOT NULL,
    year TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Tech Club Coordinator',
    photo_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. RLS POLICIES
ALTER TABLE public.club_team ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
DROP POLICY IF EXISTS "Admins have full access to club_team" ON public.club_team;
CREATE POLICY "Admins have full access to club_team"
    ON public.club_team FOR ALL TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 3. PUBLIC VIEW (Hides registration_number)
DROP VIEW IF EXISTS public.public_club_team;
CREATE VIEW public.public_club_team AS
SELECT 
    id,
    name,
    year,
    role,
    photo_url,
    display_order,
    is_active
FROM public.club_team
WHERE is_active = true;

-- Grant select on view to public/anon
GRANT SELECT ON public.public_club_team TO anon, authenticated;

-- 4. STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public) 
VALUES ('team-profiles', 'team-profiles', true) 
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for team-profiles bucket
DROP POLICY IF EXISTS "Public can view team-profiles" ON storage.objects;
CREATE POLICY "Public can view team-profiles"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'team-profiles');

DROP POLICY IF EXISTS "Admins can insert team-profiles" ON storage.objects;
CREATE POLICY "Admins can insert team-profiles"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'team-profiles' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update team-profiles" ON storage.objects;
CREATE POLICY "Admins can update team-profiles"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'team-profiles' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete team-profiles" ON storage.objects;
CREATE POLICY "Admins can delete team-profiles"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'team-profiles' AND public.is_admin());
