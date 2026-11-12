import { createFileRoute, Link } from "@tanstack/react-router";
import { Recycle, Sofa, Shirt, Laptop, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reuse World – Waste kadhu, Avakasam!" },
      { name: "description", content: "Share furniture, clothes, electronics and books you no longer need with people nearby." },
      { property: "og:title", content: "Reuse World – Waste kadhu, Avakasam!" },
      { property: "og:description", content: "Share items you no longer need with people nearby." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const cats = [
  { icon: Sofa, label: "Furniture" },
  { icon: Shirt, label: "Clothes" },
  { icon: Laptop, label: "Electronics" },
  { icon: BookOpen, label: "Books" },
];

function Index() {
  return (
    <main className="bg-hero min-h-[calc(100vh-57px)]">
      <section className="mx-auto max-w-4xl px-4 pt-20 pb-16 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft">
          <Recycle className="h-8 w-8" />
        </div>
        <h1 className="font-display text-4xl font-extrabold leading-tight text-foreground sm:text-6xl">
          Reuse World – <span className="text-primary">Waste kadhu, Avakasam!</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
          Don't throw it away — give it to someone who needs it.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="shadow-soft"><Link to="/post">Post an Item</Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/browse">Browse Items</Link></Button>
        </div>
      </section>
      <section className="mx-auto grid max-w-4xl grid-cols-2 gap-4 px-4 pb-20 sm:grid-cols-4">
        {cats.map(({ icon: Icon, label }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5 text-center">
            <Icon className="mx-auto h-7 w-7 text-primary" />
            <p className="mt-2 font-semibold">{label}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
