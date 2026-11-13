import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton } from "@/components/GoogleButton";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login – Reuse World" },
      { name: "description", content: "Log in to Reuse World to post and share items." },
      { property: "og:title", content: "Login – Reuse World" },
      { property: "og:description", content: "Log in to Reuse World." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({ redirect: typeof s.redirect === "string" && s.redirect.startsWith("/") && !s.redirect.startsWith("//") ? s.redirect : undefined }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      toast.error(
        error.message === "Email not confirmed"
          ? "Please confirm your email first — check your inbox for the link we sent."
          : error.message,
      );
      return;
    }
    toast.success("Welcome back!");
    navigate({ to: redirect ?? "/browse" });
  };
  return (
    <main className="bg-hero flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-12">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-8 shadow-soft">
        <h1 className="font-display text-3xl font-bold">Login</h1>
        {redirect === "/post" && <p className="text-sm text-muted-foreground">Please log in to post an item.</p>}
        <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="pw">Password</Label><Input id="pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <Button type="submit" className="w-full" disabled={busy}>{busy ? "Logging in..." : "Login"}</Button>
        <GoogleButton />
        <p className="text-center text-sm"><Link to="/forgot-password" className="font-medium text-primary hover:underline">Forgot password?</Link></p>
        <p className="text-center text-sm text-muted-foreground">New here? <Link to="/signup" className="font-semibold text-primary">Sign up</Link></p>
      </form>
    </main>
  );
}
