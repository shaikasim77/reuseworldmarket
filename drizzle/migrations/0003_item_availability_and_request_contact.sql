ALTER TABLE public.items ADD COLUMN is_available boolean NOT NULL DEFAULT true;
ALTER TABLE public.item_requests ADD COLUMN requester_name text NOT NULL DEFAULT '';
ALTER TABLE public.item_requests ADD COLUMN requester_phone text NOT NULL DEFAULT '';
ALTER TABLE public.item_requests ADD CONSTRAINT item_requests_name_len CHECK (char_length(requester_name) <= 80);
ALTER TABLE public.item_requests ADD CONSTRAINT item_requests_phone_fmt CHECK (requester_phone = '' OR requester_phone ~ '^\+?[0-9 ()-]{7,20}$');