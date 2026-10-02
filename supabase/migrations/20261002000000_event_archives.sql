-- ==============================================================================
-- TECH CLUB (RAMAIAH UNIVERSITY OF APPLIED SCIENCES)
-- Event Archives Migration
-- ==============================================================================

-- 1. EVENT ARCHIVES TABLE
CREATE TABLE IF NOT EXISTS public.event_archives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL UNIQUE REFERENCES public.events(id) ON DELETE RESTRICT,
    title TEXT,
    description TEXT,
    event_date DATE,
    venue TEXT,
    event_poster_url TEXT,
    winner_team_name TEXT,
    winner_photo_url TEXT,
    snapshot_scoreboard JSONB NOT NULL DEFAULT '{}'::jsonb,
    snapshot_teams JSONB NOT NULL DEFAULT '[]'::jsonb,
    published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for public queries
CREATE INDEX IF NOT EXISTS idx_event_archives_published ON public.event_archives(published);

-- 2. EVENT ARCHIVE MEDIA TABLE
CREATE TABLE IF NOT EXISTS public.event_archive_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    archive_id UUID NOT NULL REFERENCES public.event_archives(id) ON DELETE CASCADE,
    media_type TEXT NOT NULL CHECK (media_type IN ('event_poster', 'winner_photo', 'event_photo', 'round_submission')),
    round_number INTEGER NULL CHECK (round_number IS NULL OR round_number IN (1, 2, 3)),
    team_name TEXT NULL,
    title TEXT NULL,
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_event_archive_media_archive_id ON public.event_archive_media(archive_id);

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.event_archives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_archive_media ENABLE ROW LEVEL SECURITY;

-- EVENT ARCHIVES POLICIES
DROP POLICY IF EXISTS "Public can view published archives" ON public.event_archives;
CREATE POLICY "Public can view published archives"
    ON public.event_archives FOR SELECT TO public
    USING (published = true);

DROP POLICY IF EXISTS "Admins have full access to archives" ON public.event_archives;
CREATE POLICY "Admins have full access to archives"
    ON public.event_archives FOR ALL TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());

-- EVENT ARCHIVE MEDIA POLICIES
DROP POLICY IF EXISTS "Public can view published archive media" ON public.event_archive_media;
CREATE POLICY "Public can view published archive media"
    ON public.event_archive_media FOR SELECT TO public
    USING (EXISTS (
        SELECT 1 FROM public.event_archives
        WHERE id = public.event_archive_media.archive_id AND published = true
    ));

DROP POLICY IF EXISTS "Admins have full access to archive media" ON public.event_archive_media;
CREATE POLICY "Admins have full access to archive media"
    ON public.event_archive_media FOR ALL TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ==============================================================================
-- 4. STORAGE BUCKET
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-archives', 'event-archives', true) 
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for event-archives bucket
DROP POLICY IF EXISTS "Public can view event-archives" ON storage.objects;
CREATE POLICY "Public can view event-archives"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'event-archives');

DROP POLICY IF EXISTS "Admins can insert event-archives" ON storage.objects;
CREATE POLICY "Admins can insert event-archives"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'event-archives' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update event-archives" ON storage.objects;
CREATE POLICY "Admins can update event-archives"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'event-archives' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete event-archives" ON storage.objects;
CREATE POLICY "Admins can delete event-archives"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'event-archives' AND public.is_admin());

