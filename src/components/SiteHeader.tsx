import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function SiteHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const tab = (path: string) => (pathname === path ? "secondary" : "ghost") as "secondary" | "ghost";
  return (
    <header className="border-b border-border bg-background/90 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
          <Leaf className="h-6 w-6" /> Reuse World
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2 text-sm">
          <Button asChild variant={tab("/")} size="sm"><Link to="/">Home</Link></Button>
          <Button asChild variant={tab("/browse")} size="sm"><Link to="/browse">Browse</Link></Button>
          <Button asChild variant={tab("/post")} size="sm"><Link to="/post">Post</Link></Button>
          {user ? (
            <Button variant="outline" size="sm" onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}>
              Log out
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/login">Login</Link></Button>
              <Button asChild size="sm"><Link to="/signup">Sign up</Link></Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
