ALTER TABLE public.event_registrations
ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ;
