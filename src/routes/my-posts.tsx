import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ImageOff, MapPin, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { itemConditions } from "@/lib/item-form";

export const Route = createFileRoute("/my-posts")({
  head: () => ({
    meta: [
      { title: "My Posts – Reuse World" },
      { name: "description", content: "See and manage the items you posted on Reuse World." },
      { property: "og:title", content: "My Posts – Reuse World" },
      { property: "og:description", content: "See and manage the items you posted on Reuse World." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MyPosts,
});

async function fetchMyItems(userId: string) {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  const paths = data.map((i) => i.photo_url).filter((p): p is string => !!p);
  const urls: Record<string, string> = {};
  if (paths.length) {
    const { data: signed } = await supabase.storage.from("item-photos").createSignedUrls(paths, 3600);
    signed?.forEach((s) => {
      if (s.path && s.signedUrl) urls[s.path] = s.signedUrl;
    });
  }
  return data.map((i) => ({ ...i, image: i.photo_url ? urls[i.photo_url] : undefined }));
}

function conditionLabel(condition: string) {
  return itemConditions.find((c) => c.value === condition)?.label ?? condition;
}

function MyPosts() {
  const { user, loading } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-items", user?.id],
    queryFn: () => fetchMyItems(user!.id),
    enabled: !!user,
  });

  if (loading) {
    return <main className="mx-auto max-w-6xl px-4 py-10 text-muted-foreground">Loading...</main>;
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-soft">
          <h1 className="font-display text-2xl font-bold">Log in to see your posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your posted items will show up here.</p>
          <Button asChild className="mt-5">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold">My Posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">Everything you've shared on Reuse World.</p>
        </div>
        <Button asChild>
          <Link to="/post">
            <Plus /> Post an Item
          </Link>
        </Button>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading your items...</p>}
      {error && <p className="text-destructive">Couldn't load your items.</p>}

      {!isLoading && !error && data && data.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-soft">
          <p className="font-display text-xl font-bold">You haven't posted anything yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Share something you no longer need.</p>
          <Button asChild className="mt-5">
            <Link to="/post">Post your first item</Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((item) => (
          <article
            key={item.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
          >
            <div className="aspect-[4/3] bg-muted">
              {item.image ? (
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <ImageOff className="h-7 w-7" />
                  <span className="text-xs">No photo</span>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-display text-xl font-bold leading-tight">{item.name}</h2>
                <Badge className="shrink-0 capitalize">{item.category}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                  {conditionLabel(item.condition)}
                </span>
                <span className="flex items-center gap-1 text-primary">
                  <MapPin className="h-4 w-4" />
                  {item.location}
                </span>
              </div>
              {item.description && (
                <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
              )}
              <div className="mt-auto pt-1">
                {item.is_available ? (
                  <span className="text-sm font-medium text-primary">Available</span>
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">No longer available</span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
