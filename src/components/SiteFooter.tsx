import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="bg-forest text-forest-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-10 text-center">
        <Link to="/" className="font-display text-lg font-extrabold tracking-tight">
          Reuse World ♻️
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-forest-foreground/85">
          <Link to="/" className="transition-colors hover:text-forest-foreground">
            Home
          </Link>
          <Link to="/browse" className="transition-colors hover:text-forest-foreground">
            Browse Items
          </Link>
          <Link to="/post" className="transition-colors hover:text-forest-foreground">
            Post Item
          </Link>
          <Link to="/about" className="transition-colors hover:text-forest-foreground">
            About
          </Link>
          <Link to="/login" className="transition-colors hover:text-forest-foreground">
            Login
          </Link>
        </nav>
        <div className="h-px w-full max-w-md bg-forest-foreground/20" />
        <p className="text-sm text-forest-foreground/85">
          Reuse World © 2025 - Build a sustainable future
        </p>
      </div>
    </footer>
  );
}
