-- This migration updates the foreign key for user_id in the event_registrations table.
-- Instead of pointing to the private auth.users table, it will now point directly to the public.profiles table.
-- This makes the relationship explicit and allows the Supabase API to automatically join them in queries.

-- Drop the existing foreign key constraint that points to auth.users
ALTER TABLE public.event_registrations
DROP CONSTRAINT IF EXISTS event_registrations_user_id_fkey;

-- Add a new foreign key constraint that points directly to public.profiles
-- This makes the relationship explicit for the PostgREST API
ALTER TABLE public.event_registrations
ADD CONSTRAINT event_registrations_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
