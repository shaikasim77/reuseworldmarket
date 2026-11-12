CREATE TYPE public.item_category AS ENUM ('furniture','clothes','electronics','books');
CREATE TABLE public.items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  description text NOT NULL DEFAULT '' CHECK (char_length(description) <= 1000),
  location text NOT NULL CHECK (char_length(location) BETWEEN 1 AND 100),
  category public.item_category NOT NULL,
  photo_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.items TO authenticated;
GRANT ALL ON public.items TO service_role;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view items" ON public.items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users insert own items" ON public.items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own items" ON public.items FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own items" ON public.items FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Public read item photos" ON storage.objects FOR SELECT USING (bucket_id = 'item-photos');
CREATE POLICY "Users upload own item photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'item-photos' AND (storage.foldername(name))[1] = auth.uid()::text);