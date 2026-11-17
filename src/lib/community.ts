import { supabase } from "@/integrations/supabase/client";
export async function fetchCommunity() {
  const [totals, leaders] = await Promise.all([supabase.rpc("rebuy_community_totals"), supabase.from("profiles").select("id,display_name,points,avatar_url").order("points",{ascending:false}).limit(5)]);
  if(totals.error) throw totals.error;
  if(leaders.error) throw leaders.error;
  const values = totals.data as { items: number; handovers: number; donors: number };
  return { ...values, leaders: leaders.data };
}