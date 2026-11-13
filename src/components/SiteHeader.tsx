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
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-2 gap-y-2 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 whitespace-nowrap font-display text-xl font-bold text-primary">
          <Leaf className="h-6 w-6" /> Reuse World
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm sm:gap-2">
          <Button asChild variant={tab("/")} size="sm"><Link to="/">Home</Link></Button>
          <Button asChild variant={tab("/browse")} size="sm"><Link to="/browse">Browse</Link></Button>
          <Button asChild variant={tab("/post")} size="sm"><Link to="/post">Post</Link></Button>
          {user ? (
            <>
            <span className="max-w-[10rem] truncate px-2 font-medium text-foreground">Hi, {(user.user_metadata?.["full_name"] as string) || (user.user_metadata?.["name"] as string) || user.email?.split("@")[0]}</span>
            <Button variant="outline" size="sm" onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}>
              Logout
            </Button>
            </>
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
