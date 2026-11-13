ALTER TYPE public.item_category ADD VALUE IF NOT EXISTS 'toys';
ALTER TYPE public.item_category ADD VALUE IF NOT EXISTS 'other';
ALTER TABLE public.items ADD COLUMN condition text NOT NULL DEFAULT 'used' CONSTRAINT items_condition_check CHECK (condition IN ('new', 'like_new', 'used', 'needs_repair'));
ALTER TABLE public.items ADD CONSTRAINT items_name_length CHECK (char_length(btrim(name)) BETWEEN 1 AND 100) NOT VALID;
ALTER TABLE public.items ADD CONSTRAINT items_description_length CHECK (char_length(description) <= 1000) NOT VALID;
ALTER TABLE public.items ADD CONSTRAINT items_location_length CHECK (char_length(btrim(location)) BETWEEN 1 AND 100) NOT VALID;