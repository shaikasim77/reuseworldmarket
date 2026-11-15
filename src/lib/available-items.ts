import { supabase } from "@/integrations/supabase/client";

export async function fetchItems() {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  const paths = data.map((i) => i.photo_url).filter((p): p is string => !!p);
  const urls: Record<string, string> = {};
  if (paths.length) {
    const { data: signed } = await supabase.storage
      .from("item-photos")
      .createSignedUrls(paths, 3600);
    signed?.forEach((s) => {
      if (s.path && s.signedUrl) urls[s.path] = s.signedUrl;
    });
  }
  return data.map((i) => ({ ...i, image: i.photo_url ? urls[i.photo_url] : undefined }));
}

