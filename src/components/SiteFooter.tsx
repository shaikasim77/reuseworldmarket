import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-gold/35 px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-semibold">Rebuy - One person's spare, another's need.</p>
          <p className="mt-2 text-sm text-muted-foreground">Everything is free. Reuse instead of waste.</p>
        </div>
        <nav aria-label="Footer navigation" className="flex gap-1">
          <Button asChild variant="ghost" size="sm"><Link to="/">Home</Link></Button>
          <Button asChild variant="ghost" size="sm"><Link to="/browse">Browse</Link></Button>
          <Button asChild variant="ghost" size="sm"><Link to="/post">Post</Link></Button>
        </nav>
      </div>
    </footer>
  );
}