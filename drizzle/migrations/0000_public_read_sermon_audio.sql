DROP POLICY IF EXISTS "sermon audio public read" ON storage.objects;
CREATE POLICY "sermon audio public read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'sermon-audio');