ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS source_url text;

COMMENT ON COLUMN public.events.source_url IS 'Official announcement or news URL used to verify AI-scraped events.';
