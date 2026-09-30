-- Migration to safely expose only team member names for a validated team

CREATE OR REPLACE FUNCTION public.get_team_participants(p_team_id UUID, p_team_code TEXT)
RETURNS TABLE (
    registration_id UUID,
    full_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Verify the team exists and the code matches before exposing names
    IF NOT EXISTS (
        SELECT 1 FROM public.teams 
        WHERE id = p_team_id AND team_code = p_team_code
    ) THEN
        RAISE EXCEPTION 'Invalid team credentials';
    END IF;

    RETURN QUERY
    SELECT 
        tm.registration_id,
        r.full_name
    FROM public.team_members tm
    JOIN public.registrations r ON r.id = tm.registration_id
    WHERE tm.team_id = p_team_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_team_participants(UUID, TEXT) TO anon, authenticated;
