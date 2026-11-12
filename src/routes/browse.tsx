import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "Browse Items – Reuse World" },
      { name: "description", content: "Browse furniture, clothes, electronics and books shared on Reuse World." },
      { property: "og:title", content: "Browse Items – Reuse World" },
      { property: "og:description", content: "Find free reusable items near you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Browse,
});

async function fetchItems() {
  const { data, error } = await supabase.from("items").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  const paths = data.map((i) => i.photo_url).filter((p): p is string => !!p);
  const urls: Record<string, string> = {};
  if (paths.length) {
    const { data: signed } = await supabase.storage.from("item-photos").createSignedUrls(paths, 3600);
    signed?.forEach((s) => { if (s.path && s.signedUrl) urls[s.path] = s.signedUrl; });
  }
  return data.map((i) => ({ ...i, image: i.photo_url ? urls[i.photo_url] : undefined }));
}

function Browse() {
  const { data, isLoading, error } = useQuery({ queryKey: ["items"], queryFn: fetchItems });
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h1 className="font-display text-4xl font-bold">Browse Items</h1>
        <Button asChild><Link to="/post">Post an Item</Link></Button>
      </div>
      {isLoading && <p className="text-muted-foreground">Loading items...</p>}
      {error && <p className="text-destructive">Couldn't load items.</p>}
      {data && data.length === 0 && <p className="text-muted-foreground">No items yet — be the first to post!</p>}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="aspect-[4/3] bg-muted">
              {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />}
            </div>
            <div className="space-y-2 p-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-xl font-bold">{item.name}</h2>
                <Badge variant="secondary" className="capitalize">{item.category}</Badge>
              </div>
              {item.description && <p className="line-clamp-3 text-sm text-muted-foreground">{item.description}</p>}
              <p className="flex items-center gap-1 text-sm text-primary"><MapPin className="h-4 w-4" />{item.location}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
