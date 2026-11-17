import { useState } from "react";
import { toast } from "sonner";
import type { Coordinates } from "@/lib/rebuy";
export function useLocation() {
  const [location,setLocation]=useState<Coordinates|null>(null);
  const [locating,setLocating]=useState(false);
  const locate=()=>new Promise<Coordinates|null>((resolve)=>{
    if(!navigator.geolocation){toast.error("Location is unavailable on this device");resolve(null);return;}
    setLocating(true);
    navigator.geolocation.getCurrentPosition(p=>{const next={latitude:p.coords.latitude,longitude:p.coords.longitude};setLocation(next);setLocating(false);resolve(next);},()=>{toast.error("Location wasn't shared. You can still use your typed location.");setLocating(false);resolve(null);},{timeout:10000});
  });
  return {location,locating,locate};
}