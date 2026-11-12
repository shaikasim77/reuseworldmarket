import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe, Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reuse World – Waste Kadhu, Avakasam!" },
      {
        name: "description",
        content: "Give away what you don't need. Find what you do. Save the planet.",
      },
      { property: "og:title", content: "Reuse World – Waste Kadhu, Avakasam!" },
      {
        property: "og:description",
        content: "Give away what you don't need. Find what you do. Save the planet.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const steps = [
  {
    n: "1",
    icon: Upload,
    title: "Post your item",
    body: "Photograph what you no longer use, add a short note, your location and a category. It takes a minute.",
  },
  {
    n: "2",
    icon: Search,
    title: "Browse items",
    body: "See everything people nearby are giving away — furniture, clothes, electronics and books.",
  },
  {
    n: "3",
    icon: Globe,
    title: "Reuse and save the planet",
    body: "Hand it over, keep it out of the bin, and give it a second life with someone who needs it.",
  },
];

function Index() {
  return (
    <main className="flex flex-1 flex-col bg-hero">
      <section className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 pt-16 pb-20 text-center sm:pt-24">
        <span className="rounded-full border border-primary/25 bg-secondary px-4 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
          Free to give · Free to take
        </span>
        <h1 className="mt-6 font-display text-5xl leading-[1.05] font-extrabold tracking-tight text-foreground sm:text-7xl">
          Waste <span className="text-primary">Kadhu</span>, Avakasam!
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
          Give away what you don't need. Find what you do. Save the planet.
        </p>
        <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button asChild size="lg" className="h-14 px-8 text-base shadow-soft">
            <Link to="/post">Post an Item</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base">
            <Link to="/browse">Browse Items</Link>
          </Button>
        </div>
      </section>

      <section className="flex-1 border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Three simple steps between the things you don't use and the people who do.
            </p>
          </div>
          <ol className="mt-12 grid gap-6 sm:grid-cols-3">
            {steps.map(({ n, icon: Icon, title, body }) => (
              <li
                key={n}
                className="relative overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-soft"
              >
                <span className="absolute top-4 right-5 font-display text-5xl font-extrabold text-secondary">
                  {n}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
