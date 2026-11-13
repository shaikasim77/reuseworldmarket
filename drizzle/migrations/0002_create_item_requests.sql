CREATE TABLE public.item_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  message TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT item_requests_status_check CHECK (status IN ('pending', 'accepted', 'declined')),
  CONSTRAINT item_requests_unique_request UNIQUE (item_id, requester_id)
);

CREATE INDEX item_requests_requester_idx ON public.item_requests (requester_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.item_requests TO authenticated;
GRANT ALL ON public.item_requests TO service_role;

ALTER TABLE public.item_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Requesters can read their own requests"
ON public.item_requests FOR SELECT TO authenticated
USING (requester_id = auth.uid());

CREATE POLICY "Item owners can read requests for their items"
ON public.item_requests FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.items i
  WHERE i.id = item_requests.item_id AND i.user_id = auth.uid()
));

CREATE POLICY "Users can request items they do not own"
ON public.item_requests FOR INSERT TO authenticated
WITH CHECK (
  requester_id = auth.uid()
  AND NOT EXISTS (
    SELECT 1 FROM public.items i
    WHERE i.id = item_requests.item_id AND i.user_id = auth.uid()
  )
);

CREATE POLICY "Requesters can update their own requests"
ON public.item_requests FOR UPDATE TO authenticated
USING (requester_id = auth.uid())
WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Requesters can withdraw their own requests"
ON public.item_requests FOR DELETE TO authenticated
USING (requester_id = auth.uid());