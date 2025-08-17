
-- Add image_url column to success_stories table if it doesn't exist
ALTER TABLE public.success_stories 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update the table to ensure we have proper indexing for image URLs
CREATE INDEX IF NOT EXISTS idx_success_stories_image_url ON public.success_stories(image_url) WHERE image_url IS NOT NULL;
