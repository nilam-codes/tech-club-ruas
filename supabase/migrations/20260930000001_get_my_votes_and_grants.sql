-- Migration: Add get_my_votes RPC and grant base SELECT privileges to authenticated role

-- 1. Create secure RPC for fetching a participant's own votes
CREATE OR REPLACE FUNCTION public.get_my_votes(
    p_team_id UUID,
    p_team_code TEXT,
    p_registration_id UUID,
    p_round_id UUID
)
RETURNS TABLE (
    submission_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Verify the team exists and the code matches
    IF NOT EXISTS (
        SELECT 1 FROM public.teams 
        WHERE id = p_team_id AND team_code = p_team_code
    ) THEN
        RAISE EXCEPTION 'Invalid team credentials';
    END IF;

    -- Verify the registration_id belongs to that team
    IF NOT EXISTS (
        SELECT 1 FROM public.team_members 
        WHERE team_id = p_team_id AND registration_id = p_registration_id
    ) THEN
        RAISE EXCEPTION 'Participant does not belong to this team';
    END IF;

    -- Verify the requested round exists
    IF NOT EXISTS (
        SELECT 1 FROM public.rounds 
        WHERE id = p_round_id
    ) THEN
        RAISE EXCEPTION 'Round not found';
    END IF;

    -- Return only the submission IDs the participant voted on in the specified round
    RETURN QUERY
    SELECT v.submission_id 
    FROM public.votes v
    WHERE v.voter_registration_id = p_registration_id 
      AND v.round_id = p_round_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_votes(UUID, TEXT, UUID, UUID) TO anon, authenticated;

-- 2. Grant base SELECT privileges to authenticated role for Admin access
-- Note: RLS policies already exist and strictly enforce access control
GRANT SELECT ON public.teams TO authenticated;
GRANT SELECT ON public.team_members TO authenticated;
GRANT SELECT ON public.rounds TO authenticated;
GRANT SELECT ON public.submissions TO authenticated;
GRANT SELECT ON public.votes TO authenticated;
