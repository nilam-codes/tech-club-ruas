-- ==============================================================================
-- Add student_id to registrations table
-- ==============================================================================

ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS student_id TEXT NOT NULL DEFAULT 'PENDING';
-- Remove default after adding column to existing records
ALTER TABLE public.registrations ALTER COLUMN student_id DROP DEFAULT;
