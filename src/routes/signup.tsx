import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton } from "@/components/GoogleButton";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up – Reuse World" },
      { name: "description", content: "Create a free Reuse World account." },
      { property: "og:title", content: "Sign up – Reuse World" },
      { property: "og:description", content: "Create a free Reuse World account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: window.location.origin } });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    if (data.session) {
      toast.success("Account created!");
      navigate({ to: "/browse" });
      return;
    }
    setSent(true);
  };
  return (
    <main className="bg-hero flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-soft">
        {sent ? (
          <div className="space-y-3 text-center">
            <h1 className="font-display text-3xl font-bold">Check your email</h1>
            <p className="text-muted-foreground">We sent a confirmation link to {email}. Click it to finish signing up.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <h1 className="font-display text-3xl font-bold">Sign up</h1>
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="pw">Password</Label><Input id="pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <Button type="submit" className="w-full" disabled={busy}>{busy ? "Creating..." : "Create account"}</Button>
            <GoogleButton />
            <p className="text-center text-sm text-muted-foreground">Have an account? <Link to="/login" className="font-semibold text-primary">Login</Link></p>
          </form>
        )}
      </div>
    </main>
  );
}
