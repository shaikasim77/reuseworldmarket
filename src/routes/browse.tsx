import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Check, ImageOff, MapPin, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { itemConditions } from "@/lib/item-form";
import {
  browseCategoryLabel,
  browseFilterCategories,
  filterItems,
  type BrowseCategory,
} from "@/lib/item-browse";

const browseSearchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  cat: fallback(z.string(), "all").default("all"),
});

export const Route = createFileRoute("/browse")({
  validateSearch: zodValidator(browseSearchSchema),
  head: () => ({
    meta: [
      { title: "Browse Items – Reuse World" },
      {
        name: "description",
        content:
          "Search and filter furniture, clothes, electronics, books and toys shared on Reuse World, then request the ones you want.",
      },
      { property: "og:title", content: "Browse Items – Reuse World" },
      { property: "og:description", content: "Find free reusable items near you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Browse,
});

async function fetchItems() {
  const { data, error } = await supabase
    .from("items")
    .select("*")
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

async function fetchMyRequests() {
  const { data, error } = await supabase.from("item_requests").select("item_id");
  if (error) throw error;
  return new Set(data.map((r) => r.item_id));
}

function conditionLabel(condition: string) {
  return itemConditions.find((c) => c.value === condition)?.label ?? condition;
}

function Browse() {
  const { q, cat } = Route.useSearch();
  const navigate = useNavigate({ from: "/browse" });
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({ queryKey: ["items"], queryFn: fetchItems });
  const { data: requested } = useQuery({
    queryKey: ["item-requests", user?.id],
    queryFn: fetchMyRequests,
    enabled: !!user,
  });

  const category: BrowseCategory = (browseFilterCategories as readonly string[]).includes(cat)
    ? (cat as BrowseCategory)
    : "all";
  const visible = filterItems(data ?? [], { query: q, category });

  const setQuery = (value: string) =>
    navigate({ search: (prev) => ({ ...prev, q: value }), replace: true });
  const setCategory = (value: BrowseCategory) =>
    navigate({ search: (prev) => ({ ...prev, cat: value }) });

  const requestItem = async (itemId: string) => {
    if (!user) {
      toast.error("Please log in to request an item");
      navigate({ to: "/login" });
      return;
    }
    if (busyId) return;
    setBusyId(itemId);
    const { error: insertError } = await supabase
      .from("item_requests")
      .insert({ item_id: itemId, requester_id: user.id });
    setBusyId(null);
    if (insertError) {
      if (insertError.code === "23505") {
        toast.error("You've already requested this item");
        return;
      }
      toast.error("Couldn't send your request. Please try again.");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["item-requests", user.id] });
    toast.success("Request sent! The item owner can see it now.");
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold">Browse Items</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Find something you need, free for the taking.
          </p>
        </div>
        <Button asChild>
          <Link to="/post">Post an Item</Link>
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-soft">
        <Search className="ml-1 h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, description or location"
          aria-label="Search items"
          className="h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {browseFilterCategories.map((value) => (
          <Button
            key={value}
            size="sm"
            variant={category === value ? "secondary" : "outline"}
            onClick={() => setCategory(value)}
          >
            {browseCategoryLabel(value)}
          </Button>
        ))}
      </div>

      {isLoading && <p className="text-muted-foreground">Loading items...</p>}
      {error && <p className="text-destructive">Couldn't load items.</p>}
      {!isLoading && !error && data && (
        <p className="mb-4 text-sm text-muted-foreground">
          {visible.length} {visible.length === 1 ? "item" : "items"}
          {category !== "all" && ` in ${browseCategoryLabel(category)}`}
          {q && ` matching "${q.trim()}"`}
        </p>
      )}

      {!isLoading && !error && data && visible.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-soft">
          <p className="font-display text-xl font-bold">No items match your search</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try another word or pick a different category.
          </p>
          <Button
            className="mt-5"
            variant="outline"
            onClick={() => navigate({ search: () => ({ q: "", cat: "all" }) })}
          >
            Clear search and filters
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => {
          const isMine = !!user && item.user_id === user.id;
          const isRequested = !!requested?.has(item.id);
          return (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
            >
              <div className="aspect-[4/3] bg-muted">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
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
                  {isMine ? (
                    <Button variant="outline" className="w-full" disabled>
                      Your item
                    </Button>
                  ) : isRequested ? (
                    <Button variant="secondary" className="w-full" disabled>
                      <Check /> Requested
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      disabled={busyId === item.id}
                      onClick={() => requestItem(item.id)}
                    >
                      {busyId === item.id ? "Sending..." : "Request Item"}
                    </Button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
