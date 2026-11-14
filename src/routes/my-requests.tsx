import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Inbox, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/my-requests")({
  head: () => ({
    meta: [
      { title: "My Requests – Reuse World" },
      { name: "description", content: "See who requested your items on Reuse World." },
      { property: "og:title", content: "My Requests – Reuse World" },
      { property: "og:description", content: "See who requested your items on Reuse World." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MyRequests,
});

async function fetchRequestsForMyItems(userId: string) {
  const { data, error } = await supabase
    .from("item_requests")
    .select("id, requester_name, requester_phone, created_at, items!inner(id, name, category, user_id)")
    .eq("items.user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

function MyRequests() {
  const { user, loading } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["requests-for-my-items", user?.id],
    queryFn: () => fetchRequestsForMyItems(user!.id),
    enabled: !!user,
  });

  if (loading) {
    return <main className="mx-auto max-w-4xl px-4 py-10 text-muted-foreground">Loading...</main>;
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-soft">
          <h1 className="font-display text-2xl font-bold">Log in to see your requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">Requests for your items will show up here.</p>
          <Button asChild className="mt-5">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6">
        <h1 className="font-display text-4xl font-bold">My Requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          People who asked for your items — call them to arrange pickup.
        </p>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading requests...</p>}
      {error && <p className="text-destructive">Couldn't load requests.</p>}

      {!isLoading && !error && data && data.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-soft">
          <Inbox className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-display text-xl font-bold">No requests yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            When someone requests one of your items, their name and phone number will appear here.
          </p>
          <Button asChild variant="outline" className="mt-5">
            <Link to="/my-posts">See my posts</Link>
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {data?.map((req) => (
          <article
            key={req.id}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-lg font-bold leading-tight">{req.items.name}</h2>
                <Badge className="capitalize">{req.items.category}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Requested on {new Date(req.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col gap-1 text-sm sm:items-end">
              <span className="flex items-center gap-2 font-medium">
                <User className="h-4 w-4 text-primary" />
                {req.requester_name}
              </span>
              <a
                href={`tel:${req.requester_phone}`}
                className="flex items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline"
              >
                <Phone className="h-4 w-4" />
                {req.requester_phone}
              </a>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
