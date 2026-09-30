-- ==============================================================================
-- TECH CLUB GAME SCHEMA & PROFILES: COOKED WITHOUT CODE
-- ==============================================================================

-- ==============================================================================
-- 1. PROFILES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    college TEXT,
    course TEXT,
    year TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access on profiles" ON public.profiles TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ==============================================================================
-- 2. REGISTRATIONS MODIFICATION (Safe Migration)
-- ==============================================================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='registrations' AND column_name='profile_id') THEN
        ALTER TABLE public.registrations ADD COLUMN profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
    END IF;
END $$;

-- ==============================================================================
-- 3. TEAMS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    team_name TEXT NOT NULL,
    team_code TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_team_name_per_event UNIQUE (event_id, team_name)
);

-- ==============================================================================
-- 4. TEAM MEMBERS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.team_members (
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (team_id, registration_id),
    CONSTRAINT unique_participant_per_team UNIQUE (registration_id)
);

-- ==============================================================================
-- 5. ROUNDS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'active', 'submission_closed', 'voting', 'voting_closed', 'completed')),
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_round_per_event UNIQUE (event_id, round_number)
);

-- ==============================================================================
-- 6. SUBMISSIONS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_id UUID NOT NULL REFERENCES public.rounds(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    hero_name TEXT,
    superpower TEXT,
    description TEXT,
    image_path TEXT,
    chosen_option TEXT,
    interpretation_1 TEXT,
    interpretation_2 TEXT,
    interpretation_3 TEXT,
    opposing_instruction_1 TEXT,
    opposing_instruction_2 TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_submission_per_team_round UNIQUE (round_id, team_id)
);

-- ==============================================================================
-- 7. VOTES (Participant-Based)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_id UUID NOT NULL REFERENCES public.rounds(id) ON DELETE CASCADE,
    submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
    voter_registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_vote_per_participant_submission UNIQUE (round_id, submission_id, voter_registration_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_submissions_round ON public.submissions(round_id);
CREATE INDEX IF NOT EXISTS idx_votes_round ON public.votes(round_id);
CREATE INDEX IF NOT EXISTS idx_votes_participant ON public.votes(voter_registration_id);


-- ==============================================================================
-- 8. SECURE RPC FUNCTIONS FOR PUBLIC WRITES
-- ==============================================================================

-- Secure Submission Function
CREATE OR REPLACE FUNCTION public.submit_game_entry(
    p_round_id UUID,
    p_team_id UUID,
    p_image_path TEXT DEFAULT NULL,
    p_hero_name TEXT DEFAULT NULL,
    p_superpower TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_chosen_option TEXT DEFAULT NULL,
    p_interpretation_1 TEXT DEFAULT NULL,
    p_interpretation_2 TEXT DEFAULT NULL,
    p_interpretation_3 TEXT DEFAULT NULL,
    p_opposing_instruction_1 TEXT DEFAULT NULL,
    p_opposing_instruction_2 TEXT DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    r_event_id UUID;
    r_status TEXT;
    t_event_id UUID;
    has_members BOOLEAN;
BEGIN
    -- Verify round
    SELECT event_id, status INTO r_event_id, r_status FROM public.rounds WHERE id = p_round_id;
    IF r_event_id IS NULL THEN RAISE EXCEPTION 'Round not found'; END IF;
    IF r_status != 'active' THEN RAISE EXCEPTION 'Submissions are only allowed when round status is active'; END IF;
    
    -- Verify team
    SELECT event_id INTO t_event_id FROM public.teams WHERE id = p_team_id;
    IF t_event_id IS NULL THEN RAISE EXCEPTION 'Team not found'; END IF;
    IF t_event_id != r_event_id THEN RAISE EXCEPTION 'Team does not belong to this event'; END IF;
    
    -- Verify team members exist
    SELECT EXISTS (SELECT 1 FROM public.team_members WHERE team_id = p_team_id) INTO has_members;
    IF NOT has_members THEN RAISE EXCEPTION 'Team has no registered participants'; END IF;
    
    -- Insert (Uniqueness constraint unique_submission_per_team_round will prevent duplicates)
    INSERT INTO public.submissions (
        round_id, team_id, image_path, hero_name, superpower, description, 
        chosen_option, interpretation_1, interpretation_2, interpretation_3, 
        opposing_instruction_1, opposing_instruction_2
    ) VALUES (
        p_round_id, p_team_id, p_image_path, p_hero_name, p_superpower, p_description, 
        p_chosen_option, p_interpretation_1, p_interpretation_2, p_interpretation_3, 
        p_opposing_instruction_1, p_opposing_instruction_2
    );
END;
$$;


-- Secure Voting Function
CREATE OR REPLACE FUNCTION public.submit_game_vote(
    p_round_id UUID,
    p_submission_id UUID,
    p_voter_registration_id UUID,
    p_score INTEGER
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    r_event_id UUID;
    r_status TEXT;
    s_team_id UUID;
    v_event_id UUID;
    voter_team_id UUID;
BEGIN
    -- Validate score
    IF p_score < 1 OR p_score > 10 THEN RAISE EXCEPTION 'Score must be between 1 and 10'; END IF;

    -- Verify round
    SELECT event_id, status INTO r_event_id, r_status FROM public.rounds WHERE id = p_round_id;
    IF r_event_id IS NULL THEN RAISE EXCEPTION 'Round not found'; END IF;
    IF r_status != 'voting' THEN RAISE EXCEPTION 'Voting is only allowed when round status is voting'; END IF;

    -- Verify submission
    SELECT team_id INTO s_team_id FROM public.submissions WHERE id = p_submission_id AND round_id = p_round_id;
    IF s_team_id IS NULL THEN RAISE EXCEPTION 'Submission not found in this round'; END IF;

    -- Verify voter registration
    SELECT event_id INTO v_event_id FROM public.registrations WHERE id = p_voter_registration_id;
    IF v_event_id IS NULL THEN RAISE EXCEPTION 'Voter registration not found'; END IF;
    IF v_event_id != r_event_id THEN RAISE EXCEPTION 'Voter is not registered for this event'; END IF;

    -- Verify voter is assigned to a team in this event
    SELECT team_id INTO voter_team_id FROM public.team_members tm 
    JOIN public.teams t ON t.id = tm.team_id 
    WHERE tm.registration_id = p_voter_registration_id AND t.event_id = r_event_id;
    
    IF voter_team_id IS NULL THEN RAISE EXCEPTION 'Voter does not belong to any team for this event'; END IF;

    -- Prevent self-voting
    IF voter_team_id = s_team_id THEN RAISE EXCEPTION 'Participants cannot vote for their own teams submissions'; END IF;

    -- Insert Vote (Uniqueness constraint unique_vote_per_participant_submission prevents duplicates)
    INSERT INTO public.votes (
        round_id, submission_id, voter_registration_id, score
    ) VALUES (
        p_round_id, p_submission_id, p_voter_registration_id, p_score
    );
END;
$$;


-- ==============================================================================
-- 9. STORAGE BUCKET
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cooked-without-code', 'cooked-without-code', true)
ON CONFLICT (id) DO NOTHING;


-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Admins full access with CHECK on modifications
CREATE POLICY "Admins full access on teams" ON public.teams TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access on team_members" ON public.team_members TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access on rounds" ON public.rounds TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access on submissions" ON public.submissions TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full access on votes" ON public.votes TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Public (players) Read Access (NO RAW INSERT/UPDATE access. They must use the secure RPCs above)
CREATE POLICY "Public can read teams" ON public.teams FOR SELECT TO public USING (true);
CREATE POLICY "Public can read team_members" ON public.team_members FOR SELECT TO public USING (true);
CREATE POLICY "Public can read rounds" ON public.rounds FOR SELECT TO public USING (true);
CREATE POLICY "Public can read submissions" ON public.submissions FOR SELECT TO public USING (true);
-- Votes are entirely hidden from public. Scores are calculated by the Admin UI.

-- Storage RLS (Images remain public to allow players to view them during voting)
CREATE POLICY "Public can upload to cooked-without-code bucket" 
ON storage.objects FOR INSERT TO public 
WITH CHECK (bucket_id = 'cooked-without-code');

CREATE POLICY "Public can read cooked-without-code bucket" 
ON storage.objects FOR SELECT TO public 
USING (bucket_id = 'cooked-without-code');
