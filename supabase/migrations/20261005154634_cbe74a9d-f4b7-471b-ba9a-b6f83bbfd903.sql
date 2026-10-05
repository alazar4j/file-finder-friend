ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'poster';

CREATE OR REPLACE FUNCTION public.can_post(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role::text IN ('admin','poster'))
$$;

ALTER TABLE public.sermons ADD COLUMN IF NOT EXISTS audio_url text, ADD COLUMN IF NOT EXISTS audio_path text;

DROP POLICY IF EXISTS "sermons admin write" ON public.sermons;
CREATE POLICY "sermons posters write" ON public.sermons FOR ALL TO authenticated
  USING (public.can_post(auth.uid())) WITH CHECK (public.can_post(auth.uid()));

DROP POLICY IF EXISTS "events admin write" ON public.events;
CREATE POLICY "events posters write" ON public.events FOR ALL TO authenticated
  USING (public.can_post(auth.uid())) WITH CHECK (public.can_post(auth.uid()));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name',''))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'member') ON CONFLICT DO NOTHING;
  IF lower(NEW.email) = 'alazarginbaru1@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $function$;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE lower(email) = 'alazarginbaru1@gmail.com'
ON CONFLICT DO NOTHING;