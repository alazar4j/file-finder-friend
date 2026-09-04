CREATE TYPE public.app_role AS ENUM ('admin','member');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_label text NOT NULL,
  month_label text NOT NULL,
  title_en text NOT NULL,
  title_am text NOT NULL,
  description_en text NOT NULL DEFAULT '',
  description_am text NOT NULL DEFAULT '',
  meta_en text NOT NULL DEFAULT '',
  meta_am text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events public read" ON public.events FOR SELECT USING (true);
CREATE POLICY "events admin write" ON public.events FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.sermons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL,
  title_am text NOT NULL,
  speaker_en text NOT NULL,
  speaker_am text NOT NULL,
  date_en text NOT NULL,
  date_am text NOT NULL,
  reference_en text NOT NULL DEFAULT '',
  reference_am text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  description_am text NOT NULL DEFAULT '',
  media_url text,
  preached_on date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sermons TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sermons TO authenticated;
GRANT ALL ON public.sermons TO service_role;
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sermons public read" ON public.sermons FOR SELECT USING (true);
CREATE POLICY "sermons admin write" ON public.sermons FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER sermons_updated_at BEFORE UPDATE ON public.sermons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text,
  address text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name',''))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'member')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.prayer_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prayer_requests TO authenticated;
GRANT ALL ON public.prayer_requests TO service_role;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own prayer select" ON public.prayer_requests FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own prayer insert" ON public.prayer_requests FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own prayer update" ON public.prayer_requests FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "own prayer delete" ON public.prayer_requests FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE TRIGGER prayer_updated_at BEFORE UPDATE ON public.prayer_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fund text NOT NULL DEFAULT 'general',
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.donations TO authenticated;
GRANT ALL ON public.donations TO service_role;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own donations select" ON public.donations FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own donations insert" ON public.donations FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

INSERT INTO public.events (day_label,month_label,title_en,title_am,description_en,description_am,meta_en,meta_am,sort_order) VALUES
('14','SEP','Fall Kickoff Potluck','የመኸር መክፈቻ የምግብ ግብዣ','Bring a dish and meet new faces as we kick off the fall ministry season.','አንድ ምግብ አምጡና የመኸር አገልግሎት ወቅት ስንጀምር አዳዲስ ሰዎችን ይተዋወቁ።','12:30 PM · Fellowship Hall','ከቀኑ 12:30 · የኅብረት አዳራሽ',1),
('20','SEP','Youth Night','የወጣቶች ምሽት','Games, worship, and a short teaching for grades 6-12.','ጨዋታዎች፣ አምልኮ እና ለ6ኛ-12ኛ ክፍል ተማሪዎች አጭር ትምህርት።','6:00 PM · Youth Room','ከቀኑ 6:00 · የወጣቶች ክፍል',2),
('27','SEP','Baptism Sunday','የጥምቀት እሁድ','Join us as we celebrate several members taking this next step of faith.','ብዙ አባላት ይህን የእምነት ቀጣይ እርምጃ ሲወስዱ አብረውን ይክበሩ።','9:00 AM & 11:00 AM · Sanctuary','ጠዋት 9:00 እና 11:00 · ቤተ መቅደስ',3),
('04','OCT','Missions Sunday','የተልእኮ እሁድ','Hear from our partners serving overseas and how to get involved.','ከውጭ ሀገር የሚያገለግሉ አጋሮቻችንን ያዳምጡ፣ እንዴት መሳተፍ እንደሚችሉም ይወቁ።','11:00 AM · Sanctuary','ጠዋት 11:00 · ቤተ መቅደስ',4),
('11','OCT','Men''s Breakfast','የወንዶች ቁርስ','A morning of food, fellowship, and a short devotional.','የምግብ፣ የኅብረትና የአጭር ትምህርት ጠዋት።','8:00 AM · Fellowship Hall','ጠዋት 8:00 · የኅብረት አዳራሽ',5);

INSERT INTO public.sermons (title_en,title_am,speaker_en,speaker_am,date_en,date_am,reference_en,reference_am,description_en,description_am,preached_on) VALUES
('Rooted, Not Shaken','ሥር የሰደደ፣ የማይናወጥ','Pastor James Okafor','ፓስተር ጄምስ ኦካፎር','Aug 31, 2026','ነሐሴ 31, 2026','Colossians 2:6-7','ቆላስይስ 2:6-7','Part of the "Rooted" series - what it means to stand firm when life shifts under you.','ከ"ሥር የሰደደ" ተከታታይ ትምህርት ውስጥ አንዱ — ህይወት በሚናወጥበት ጊዜ ጸንቶ መቆም ማለት ምን ማለት እንደሆነ።','2026-08-31'),
('The Weight of Grace','የጸጋ ክብደት','Pastor James Okafor','ፓስተር ጄምስ ኦካፎር','Aug 24, 2026','ነሐሴ 24, 2026','Ephesians 2:1-10','ኤፌሶን 2:1-10','Why grace changes not just where we are headed, but how we walk today.','ጸጋ የምንሄድበትን አቅጣጫ ብቻ ሳይሆን ዛሬ የምንኖርበትን መንገድ እንዴት እንደሚቀይር።','2026-08-24'),
('A People Set Apart','የተለዩ ሕዝብ','Elder Grace Mensah','ሽማግሌ ግሬስ ሜንሳ','Aug 17, 2026','ነሐሴ 17, 2026','1 Peter 2:9-12','1ኛ ጴጥሮስ 2:9-12','What it looks like to live distinctly in an ordinary week.','በተራ ሳምንት ውስጥ በተለየ መንገድ መኖር ምን እንደሚመስል።','2026-08-17'),
('Prayer That Waits','የሚጠብቅ ጸሎት','Pastor James Okafor','ፓስተር ጄምስ ኦካፎር','Aug 10, 2026','ነሐሴ 10, 2026','Luke 18:1-8','ሉቃስ 18:1-8','Persistence in prayer, and why God is not in a hurry the way we are.','በጸሎት መጽናት፣ እና እግዚአብሔር እንደ እኛ ለምን የማይቸኩል እንደሆነ።','2026-08-10');