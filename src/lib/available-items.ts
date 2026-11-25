import { supabase } from "@/integrations/supabase/client";

export async function fetchItems() {
  const { data, error } = await supabase
    .from("items")
    .select("*, item_photos(storage_path,sort_order)")
    .eq("is_available", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return signItems(data);
}
export async function signItems<T extends { photo_url: string | null; item_photos?: { storage_path: string; sort_order: number }[] }>(data: T[]) {
  const photoPaths = (i: T) => i.item_photos?.length ? [...i.item_photos].sort((a,b)=>a.sort_order-b.sort_order).map(p=>p.storage_path) : i.photo_url ? [i.photo_url] : [];
  const paths = [...new Set(data.flatMap(photoPaths))];
  const urls: Record<string, string> = {};
  if (paths.length) {
    const { data: signed, error } = await supabase.storage
      .from("item-photos")
      .createSignedUrls(paths, 3600);
    if (error) throw error;
    signed?.forEach((s) => {
      if (s.path && s.signedUrl) urls[s.path] = s.signedUrl;
    });
  }
  return data.map((i) => {
    const itemPaths = photoPaths(i);
    const first = itemPaths[0];
    return { ...i, image: first ? urls[first] : undefined, images: itemPaths.map((p) => urls[p]).filter(Boolean) };
  });
}

