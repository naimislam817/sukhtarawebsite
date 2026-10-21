-- ============================================================
-- COMPLETE MIGRATION: Fix all missing columns & Storage RLS
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/isveeimfwjvcykpgjxhv/sql
-- ============================================================

-- 1. Add all facility & settings columns to homepage_settings
ALTER TABLE homepage_settings
  ADD COLUMN IF NOT EXISTS contact jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS cta jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS rasun jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS banquet jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS skylight jsonb DEFAULT '{}'::jsonb;

-- 2. Add sort_order and multiple images to rooms
ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'::jsonb;

-- 3. Storage Policies for 'hotel-images' bucket
DROP POLICY IF EXISTS "Public Uploads" ON storage.objects;
CREATE POLICY "Public Uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'hotel-images');

DROP POLICY IF EXISTS "Public Updates" ON storage.objects;
CREATE POLICY "Public Updates"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'hotel-images');

DROP POLICY IF EXISTS "Public Reads" ON storage.objects;
CREATE POLICY "Public Reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'hotel-images');

DROP POLICY IF EXISTS "Public Deletes" ON storage.objects;
CREATE POLICY "Public Deletes"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'hotel-images');

-- 4. Enable public read and write policies on homepage_settings
ALTER TABLE homepage_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read homepage_settings" ON homepage_settings;
CREATE POLICY "Allow public read homepage_settings" 
ON homepage_settings FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Allow public update homepage_settings" ON homepage_settings;
CREATE POLICY "Allow public update homepage_settings" 
ON homepage_settings FOR UPDATE 
TO public 
USING (true)
WITH CHECK (true);

-- 5. Enable public read, insert, update, delete policies on rooms
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read rooms" ON rooms;
CREATE POLICY "Allow public read rooms" 
ON rooms FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Allow public insert rooms" ON rooms;
CREATE POLICY "Allow public insert rooms" 
ON rooms FOR INSERT 
TO public 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update rooms" ON rooms;
CREATE POLICY "Allow public update rooms" 
ON rooms FOR UPDATE 
TO public 
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete rooms" ON rooms;
CREATE POLICY "Allow public delete rooms" 
ON rooms FOR DELETE 
TO public 
USING (true);
