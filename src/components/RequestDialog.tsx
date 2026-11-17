import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery,useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "./ui/select";
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription } from "./ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { requestMessageSchema } from "@/lib/item-form";
type Item={id:string;user_id:string;name:string;listing_type:"give"|"exchange";wants:string|null};
export function RequestDialog({item,open,onOpenChange}:{item:Item;open:boolean;onOpenChange:(open:boolean)=>void}) {
 const {user}=useAuth(); const qc=useQueryClient();
 const [message,setMessage]=useState("");const [name,setName]=useState("");const [phone,setPhone]=useState("");const [offer,setOffer]=useState("");const [busy,setBusy]=useState(false);
 const exchange=item.listing_type==="exchange";
 const {data:ownItems=[],isPending,error}=useQuery({queryKey:["offer-items",user?.id,item.id],enabled:open&&!!user&&exchange,queryFn:async()=>{if(!user)return [];const {data,error}=await supabase.from("items").select("id,name").eq("user_id",user.id).eq("is_available",true).neq("id",item.id);if(error)throw error;return data;}});
 async function submit(e:React.FormEvent){e.preventDefault();if(!user||busy)return;const parsed=requestMessageSchema.safeParse(message);if(!parsed.success){toast.error(parsed.error.issues[0]?.message);return;}if(exchange&&!offer){toast.error("Choose an item to offer");return;}if(phone&&!/^\+?[0-9 ()-]{7,20}$/.test(phone)){toast.error("Please enter a valid phone number");return;}setBusy(true);try{const {error}=await supabase.from("requests").insert({item_id:item.id,owner_id:item.user_id,requester_id:user.id,message:parsed.data,offer_item_id:exchange?offer:null,requester_name:name||user.user_metadata?.full_name||"",requester_phone:phone});if(error)throw error;await qc.invalidateQueries({queryKey:["requests"]});toast.success("Request Sent!");onOpenChange(false);setMessage("");}catch(e){toast.error(e instanceof Error?e.message:"Couldn't send your request. You may already have requested it.");}finally{setBusy(false);}}
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>{exchange?"Offer an exchange":"Request this item"}</DialogTitle><DialogDescription>{item.name}{exchange&&item.wants?` · Wants: ${item.wants}`:""}</DialogDescription></DialogHeader>{!user?<Button asChild><Link to="/login">Login to request</Link></Button>:<form onSubmit={submit} className="space-y-4">{exchange&&(isPending?<p>Finding your items…</p>:error?<p className="text-destructive">Couldn't load your items.</p>:ownItems.length?<div className="space-y-2"><Label>Your offered item</Label><Select value={offer} onValueChange={setOffer}><SelectTrigger className="w-full"><SelectValue placeholder="Choose your item"/></SelectTrigger><SelectContent>{ownItems.map(i=><SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}</SelectContent></Select></div>:<p>You need at least one item of your own to offer. <Link className="underline" to="/post">Post one first.</Link></p>)}<div className="space-y-2"><Label htmlFor="rq-name">Your name (optional)</Label><Input id="rq-name" maxLength={80} value={name} onChange={e=>setName(e.target.value)}/></div><div className="space-y-2"><Label htmlFor="rq-phone">Phone number (optional)</Label><Input id="rq-phone" type="tel" maxLength={20} value={phone} onChange={e=>setPhone(e.target.value)}/></div><div className="space-y-2"><Label htmlFor="rq-message">Message (optional)</Label><Textarea id="rq-message" maxLength={500} value={message} onChange={e=>setMessage(e.target.value)}/></div><Button className="w-full" disabled={busy||(exchange&&(!offer||!!error))}>{busy?"Sending…":"Send Request"}</Button></form>}</DialogContent></Dialog>;
}