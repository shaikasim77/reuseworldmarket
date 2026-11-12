import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
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

const schema = z.object({
  name: z.string().trim().min(1, "Item name is required").max(100),
  description: z.string().trim().max(1000),
  location: z.string().trim().min(1, "Location is required").max(100),
  category: z.enum(["furniture", "clothes", "electronics", "books"], { message: "Pick a category" }),
});

function PostItem() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "", location: "", category: "" });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

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
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    if (!file) return toast.error("Please add a photo");
    if (!file.type.startsWith("image/")) return toast.error("Photo must be an image");
    if (file.size > 5 * 1024 * 1024) return toast.error("Photo must be under 5MB");
    setBusy(true);
    const path = `${user.id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const up = await supabase.storage.from("item-photos").upload(path, file);
    if (up.error) { setBusy(false); return toast.error(up.error.message); }
    const { error } = await supabase.from("items").insert({ ...parsed.data, user_id: user.id, photo_url: path });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Item posted!");
    navigate({ to: "/browse" });
  };

  return (
    <main className="bg-hero min-h-[calc(100vh-57px)] px-4 py-12">
      <form onSubmit={submit} className="mx-auto max-w-lg space-y-5 rounded-2xl border border-border bg-card p-8 shadow-soft">
        <h1 className="font-display text-3xl font-bold">Post an Item</h1>
        <div className="space-y-2"><Label htmlFor="name">Item name</Label><Input id="name" maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="space-y-2"><Label htmlFor="photo">Photo</Label><Input id="photo" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></div>
        {file && <img src={URL.createObjectURL(file)} alt="Preview" className="h-48 w-full rounded-lg object-cover" />}
        <div className="space-y-2"><Label htmlFor="desc">Description</Label><Textarea id="desc" maxLength={1000} rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div className="space-y-2"><Label htmlFor="loc">Location</Label><Input id="loc" maxLength={100} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger><SelectValue placeholder="Choose a category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="furniture">Furniture</SelectItem>
              <SelectItem value="clothes">Clothes</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="books">Books</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy ? "Posting..." : "Post Item"}</Button>
      </form>
    </main>
  );
}
