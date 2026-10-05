REVOKE EXECUTE ON FUNCTION public.can_post(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.can_post(uuid) TO authenticated;

CREATE POLICY "sermon audio public read" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'sermon-audio');
CREATE POLICY "sermon audio posters insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'sermon-audio' AND public.can_post(auth.uid()));
CREATE POLICY "sermon audio posters update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'sermon-audio' AND public.can_post(auth.uid()));
CREATE POLICY "sermon audio posters delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'sermon-audio' AND public.can_post(auth.uid()));