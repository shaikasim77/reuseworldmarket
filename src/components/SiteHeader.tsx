import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { to: "/", label: "Home", exact: true },
  { to: "/browse", label: "Browse Items", exact: false },
  { to: "/post", label: "Post Item", exact: false },
  { to: "/about", label: "About", exact: false },
] as const;

const linkClass =
  "rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary data-[active=true]:bg-secondary data-[active=true]:text-primary";

export function SiteHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    setOpen(false);
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link
          to="/"
          className="font-display text-xl font-extrabold tracking-tight text-primary sm:text-2xl"
        >
          Reuse World ♻️
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              data-active
              activeOptions={{ exact: item.exact }}
              className={linkClass}
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <Button variant="outline" size="sm" className="ml-2" onClick={signOut}>
              Log out
            </Button>
          ) : (
            <Button asChild size="sm" className="ml-2">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-input bg-card text-foreground md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border bg-background px-4 py-3 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              data-active
              activeOptions={{ exact: item.exact }}
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <Button variant="outline" size="sm" className="mt-2 w-full" onClick={signOut}>
              Log out
            </Button>
          ) : (
            <Button asChild size="sm" className="mt-2 w-full">
              <Link to="/login" onClick={() => setOpen(false)}>
                Login
              </Link>
            </Button>
          )}
        </nav>
      )}
    </header>
  );
}
