import { supabase } from "@/integrations/supabase/client";
import { signItems } from "./available-items";
export async function fetchRequests(userId: string) {
  const {data,error}=await supabase.from("requests").select("*").or(`owner_id.eq.${userId},requester_id.eq.${userId}`).order("created_at",{ascending:false});
  if(error) throw error;
  if(!data.length) return [];
  const ids=[...new Set(data.flatMap(r=>r.offer_item_id?[r.item_id,r.offer_item_id]:[r.item_id]))];
  const users=[...new Set(data.flatMap(r=>[r.owner_id,r.requester_id]))];
  const [items,profiles]=await Promise.all([supabase.from("items").select("*,item_photos(storage_path,sort_order)").in("id",ids),supabase.from("profiles").select("id,display_name").in("id",users)]);
  if(items.error) throw items.error;
  if(profiles.error) throw profiles.error;
  const signed=await signItems(items.data);
  return data.map(r=>({...r,item:signed.find(i=>i.id===r.item_id),offer:signed.find(i=>i.id===r.offer_item_id),owner:profiles.data.find(p=>p.id===r.owner_id),requester:profiles.data.find(p=>p.id===r.requester_id)}));
}