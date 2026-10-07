-- ==============================================================================
-- 1. EXTEND EXISTING EVENTS TABLE
-- ==============================================================================

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS club TEXT NOT NULL DEFAULT 'tech' CHECK (club IN ('tech', 'cultural', 'sports'));
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_type TEXT NOT NULL DEFAULT 'individual' CHECK (registration_type IN ('individual', 'team', 'both'));
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS team_formation TEXT CHECK (team_formation IN ('student', 'admin'));
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS min_team_size INTEGER;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS max_team_size INTEGER;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_fields JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS eligibility_rules JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS approval_mode TEXT NOT NULL DEFAULT 'automatic' CHECK (approval_mode IN ('automatic', 'manual'));
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_start_date TIMESTAMPTZ;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_end_date TIMESTAMPTZ;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_manual_status TEXT NOT NULL DEFAULT 'auto' CHECK (registration_manual_status IN ('open', 'closed', 'auto'));
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS lifecycle_status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (lifecycle_status IN ('DRAFT', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'ONGOING', 'COMPLETED', 'ARCHIVED'));
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS venue TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS rules TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS features_config JSONB NOT NULL DEFAULT '{"has_registration": true, "has_teams": false, "has_rounds": false, "has_submissions": false, "has_voting": false, "has_scores": false, "has_results": false, "has_gallery": false, "has_winners": false}'::jsonb;

-- ==============================================================================
-- 2. CREATE NEW GENERIC EVENT REGISTRATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    registration_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_generic_event_registration UNIQUE (event_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);

-- ==============================================================================
-- 3. CREATE NEW GENERIC EVENT TEAMS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.event_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_generic_event_team_name UNIQUE (event_id, name)
);

CREATE INDEX IF NOT EXISTS idx_event_teams_event_id ON public.event_teams(event_id);

-- ==============================================================================
-- 4. CREATE NEW GENERIC EVENT TEAM MEMBERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.event_team_members (
    team_id UUID NOT NULL REFERENCES public.event_teams(id) ON DELETE CASCADE,
    registration_id UUID NOT NULL REFERENCES public.event_registrations(id) ON DELETE CASCADE,
    role TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (team_id, registration_id)
);

CREATE INDEX IF NOT EXISTS idx_event_team_members_registration_id ON public.event_team_members(registration_id);

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_team_members ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins have full access to event_registrations" ON public.event_registrations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to event_teams" ON public.event_teams FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins have full access to event_team_members" ON public.event_team_members FOR ALL USING (auth.role() = 'authenticated');

-- Public can read teams and team members (for public event display), but NOT raw registrations which contain PII.
CREATE POLICY "Public can read event_teams" ON public.event_teams FOR SELECT USING (true);
CREATE POLICY "Public can read event_team_members" ON public.event_team_members FOR SELECT USING (true);

-- Public can insert registrations
CREATE POLICY "Public can insert event_registrations" ON public.event_registrations FOR INSERT WITH CHECK (true);
-- Public can insert teams and members if student_created teams is enabled, but RLS on that level is tricky. We'll allow public insert and rely on app-level validation.
CREATE POLICY "Public can insert event_teams" ON public.event_teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert event_team_members" ON public.event_team_members FOR INSERT WITH CHECK (true);
