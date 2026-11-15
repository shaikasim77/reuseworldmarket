import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Recycle, PackageCheck, Users, MapPin, Sofa, Shirt, Laptop, BookOpen, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchItems } from "@/lib/available-items";

const itemsOptions = { queryKey: ["items"], queryFn: fetchItems };
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Rebuy — One person's spare, another's need." },
    { name: "description", content: "Post what you no longer need. Find free furniture, clothes, electronics and books nearby on Rebuy." },
    { property: "og:title", content: "Rebuy — Waste kadhu, Avakasam." },
    { property: "og:description", content: "One person's spare, another's need. Give your unused things a second life with Rebuy." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});
const cats = [
  { icon: Sofa, label: "Furniture", value: "furniture" },
  { icon: Shirt, label: "Clothes", value: "clothes" },
  { icon: Laptop, label: "Electronics", value: "electronics" },
  { icon: BookOpen, label: "Books", value: "books" },
];

function Index() {
  const { data: items = [], isLoading, error } = useQuery(itemsOptions);
  const item = items[0];
  const givers = new Set(items.map((i) => i.user_id)).size;
  const cities = new Set(items.map((i) => i.location.trim().toLowerCase())).size;
  const stats = [{ icon: PackageCheck, value: "500+", label: "Items Reused" }, { icon: Users, value: givers, label: "Givers" }, { icon: MapPin, value: cities, label: "Cities" }];
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <section className="grid gap-10 rounded-2xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:px-12 lg:py-12">
        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold text-gold">BUY . SELL . SHARE . GIVE</p>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.12] sm:text-6xl">Waste kadhu,<br /><span className="text-gold italic">Avakasam.</span></h1>
          <div className="my-6 flex max-w-xs items-center gap-3 text-gold" aria-hidden="true"><span className="h-px flex-1 bg-gold/65" /><span className="text-xs">◆</span><span className="h-px flex-1 bg-gold/65" /></div>
          <p className="font-display text-xl leading-relaxed text-gold italic">One person's spare, another's need.</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-hero-muted">Post what you no longer need - someone nearby gives it a second life.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12"><Link to="/post">Post an Item <ArrowRight /></Link></Button>
            <Button asChild size="lg" variant="heroOutline" className="h-12"><Link to="/browse">Browse Items</Link></Button>
          </div>
        </div>
        <div className="min-w-0 lg:border-l lg:border-gold/35 lg:pl-10">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-primary-foreground/10">
            {item?.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center px-6 text-center text-hero-muted">{item ? <ImageOff className="h-12 w-12" /> : <p className="font-display text-xl">{isLoading ? "Loading featured item..." : error ? "Featured item unavailable" : "No items yet - be the first to post!"}</p>}</div>}
            <span className="absolute left-4 top-4 rounded-md bg-gold px-3 py-1.5 text-xs font-semibold text-gold-foreground">FEATURED</span>
            <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-gold bg-primary text-gold"><Recycle className="h-6 w-6" /></span>
          </div>
          {item && <><h2 className="mt-5 break-words font-display text-2xl font-semibold">{item.name}</h2><p className="mt-2 text-xs text-hero-muted">{item.location} - <span className="capitalize">{item.category}</span> - Free</p></>}
          <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-t border-gold/45 pt-4 text-sm">
            <div><p className="mb-1 text-xs text-gold">FROM</p><p>Someone nearby</p><p className="mt-1 text-xs text-hero-muted">A second life</p></div><ArrowRight className="h-5 w-5 text-gold" /><div><p className="mb-1 text-xs text-gold">TO</p><p>anyone nearby</p></div>
          </div>
          <Button asChild className="mt-5 w-full"><Link to={item ? "/browse" : "/post"}>{item ? "Request item" : "Post an Item"}<ArrowRight /></Link></Button>
        </div>
      </section>
      <section aria-label="Rebuy community" className="grid grid-cols-1 gap-4 py-7 sm:grid-cols-3">
        {stats.map(({ icon: Icon, value, label }) => <div key={label} className="flex items-center gap-4 rounded-2xl border border-border border-b-gold bg-card px-6 py-5 shadow-soft"><Icon className="h-7 w-7 shrink-0 text-gold-deep" /><div><p className="font-display text-3xl font-semibold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div></div>)}
      </section>
      <section aria-label="Categories" className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cats.map(({ icon: Icon, label, value }) => <Button key={value} asChild variant="outline" className="h-28 flex-col gap-3 rounded-2xl border-border bg-card shadow-soft"><Link to="/browse" search={{ cat: value, q: "" }}><Icon className="size-6 text-gold-deep" /><span>{label}</span></Link></Button>)}
      </section>
      <section className="my-9 flex flex-col items-start justify-between gap-5 border-y border-gold/65 py-7 sm:flex-row sm:items-center"><h2 className="font-display text-2xl leading-snug">Your unused things are someone's treasure.</h2><Button asChild className="shrink-0"><Link to="/post">Post an Item <ArrowRight /></Link></Button></section>
      <section className="pb-10"><h2 className="mb-7 text-center font-display text-3xl">How it works</h2><div className="grid gap-6 sm:grid-cols-3">{["Post it", "Someone finds it", "Hand it over"].map((step, i) => <div key={step} className="flex items-center justify-center gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold font-display text-lg text-gold-deep">{["I", "II", "III"][i]}</span><h3 className="font-display text-lg">{step}</h3></div>)}</div></section>
    </main>
  );
}
