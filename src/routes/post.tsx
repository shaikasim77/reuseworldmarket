import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { itemCategories, itemConditions, itemFormSchema } from "@/lib/item-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/post")({
  head: () => ({
    meta: [
      { title: "Post an Item – Reuse World" },
      { name: "description", content: "Post an item you no longer need on Reuse World." },
      { property: "og:title", content: "Post an Item – Reuse World" },
      { property: "og:description", content: "Share an item with your community." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PostItem,
});

function PostItem() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const photoInput = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: "", description: "", location: "", category: "", condition: "" });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>();
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!file) { setPreview(undefined); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (loading) return <main className="p-10 text-center text-muted-foreground">Loading...</main>;
  if (!user)
    return (
      <main className="bg-hero flex min-h-[calc(100vh-57px)] items-center justify-center px-4">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
          <h1 className="font-display text-2xl font-bold">Sign in to post an item</h1>
          <div className="mt-5 flex justify-center gap-3">
            <Button asChild><Link to="/login">Login</Link></Button>
            <Button asChild variant="outline"><Link to="/signup">Sign up</Link></Button>
          </div>
        </div>
      </main>
    );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const parsed = itemFormSchema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Invalid input"); return; }
    if (!file) { toast.error("Please add a photo"); return; }
    if (!file.type.startsWith("image/")) { toast.error("Photo must be an image"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Photo must be under 5MB"); return; }
    setBusy(true);
    try {
    const path = `${user.id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const up = await supabase.storage.from("item-photos").upload(path, file);
    if (up.error) { setBusy(false); toast.error(up.error.message); return; }
    const { error } = await supabase.from("items").insert({ ...parsed.data, user_id: user.id, photo_url: path });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    await queryClient.invalidateQueries({ queryKey: ["items"] });
    toast.success("Your item is now live!");
    navigate({ to: "/browse" });
    } catch {
      toast.error("Couldn't post your item. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="bg-hero min-h-[calc(100vh-57px)] px-4 py-12">
      <form onSubmit={submit} className="mx-auto max-w-lg space-y-5 rounded-2xl border border-border bg-card p-8 shadow-soft">
        <h1 className="font-display text-3xl font-bold">Post an Item</h1>
        <div className="space-y-2"><Label htmlFor="name">Item name</Label><Input id="name" maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger id="category" className="w-full"><SelectValue placeholder="Choose a category" /></SelectTrigger>
            <SelectContent>
              {itemCategories.map((category) => <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="condition">Item condition</Label>
          <Select value={form.condition} onValueChange={(condition) => setForm({ ...form, condition })}>
            <SelectTrigger id="condition" className="w-full"><SelectValue placeholder="Choose a condition" /></SelectTrigger>
            <SelectContent>{itemConditions.map((condition) => <SelectItem key={condition.value} value={condition.value}>{condition.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label htmlFor="desc">Description</Label><Textarea id="desc" maxLength={1000} rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div className="space-y-2"><Label htmlFor="loc">Location</Label><Input id="loc" maxLength={100} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
        <div className="space-y-2">
          <Label htmlFor="photo">Photo</Label>
          <Input ref={photoInput} id="photo" className="hidden" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <Button type="button" variant="outline" className="w-full" onClick={() => photoInput.current?.click()}><Upload />{file ? "Change photo" : "Upload photo"}</Button>
          {file && <p className="break-all text-sm text-muted-foreground">{file.name}</p>}
        </div>
        {preview && <img src={preview} alt="Item preview" className="h-48 w-full rounded-lg object-cover" />}
        <Button type="submit" size="lg" className="h-14 w-full text-base" disabled={busy}>{busy ? "Posting..." : "Post Item"}</Button>
      </form>
    </main>
  );
}
