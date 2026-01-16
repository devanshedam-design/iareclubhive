
-- Rename image_url to poster_url in events table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='image_url') THEN
    ALTER TABLE public.events RENAME COLUMN image_url TO poster_url;
  END IF;
END $$;

-- Add deleted_at and image_url to announcements
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS image_url text;

-- Add checked_in_at to event_registrations
ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS checked_in_at timestamp with time zone;

-- Ensure is_completed exists (feature support)
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_completed boolean DEFAULT false;

-- Ensure roll_number exists in profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS roll_number text;
