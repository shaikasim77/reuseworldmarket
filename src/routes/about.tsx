import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Laptop, Shirt, Sofa } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About – Reuse World" },
      {
        name: "description",
        content: "Why Reuse World exists: keep usable things out of the bin by connecting givers and takers.",
      },
      { property: "og:title", content: "About – Reuse World" },
      {
        property: "og:description",
        content: "Why Reuse World exists: keep usable things out of the bin by connecting givers and takers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: About,
});

const categories = [
  { icon: Sofa, label: "Furniture" },
  { icon: Shirt, label: "Clothes" },
  { icon: Laptop, label: "Electronics" },
  { icon: BookOpen, label: "Books" },
];

function About() {
  return (
    <main className="flex flex-1 flex-col bg-hero">
      <section className="mx-auto w-full max-w-3xl px-4 pt-16 pb-12 text-center">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          About <span className="text-primary">Reuse World</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Most of what we throw away still works. Reuse World is a simple place to give those
          things to someone nearby instead of sending them to the bin.
        </p>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 pb-12">
        <div className="space-y-6 rounded-2xl border border-border bg-card p-8 shadow-soft">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Why we built it</h2>
            <p className="mt-3 text-muted-foreground">
              A working chair, a read-twice book, a phone that only needs a new owner — none of
              them are waste. When giving things away is as easy as posting a photo, less ends up
              in landfill and less gets bought new.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">What you can share</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {categories.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="rounded-xl border border-border bg-background p-4 text-center"
                >
                  <Icon className="mx-auto h-6 w-6 text-primary" />
                  <p className="mt-2 text-sm font-semibold text-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">How to start</h2>
            <p className="mt-3 text-muted-foreground">
              Make an account, post an item with a photo and your location, or browse what others
              are giving away and arrange to pick it up.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild className="shadow-soft">
              <Link to="/post">Post an Item</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/browse">Browse Items</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
