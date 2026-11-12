import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password – Reuse World" },
      { name: "description", content: "Choose a new password for your Reuse World account." },
      { property: "og:title", content: "Reset password – Reuse World" },
      { property: "og:description", content: "Choose a new password for your Reuse World account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPassword,
});

// Read at import time: the auth client strips the recovery params from the URL as
// soon as it initialises, which happens after this module is loaded.
const initialHash = typeof window === "undefined" ? "" : window.location.hash;
const openedWithRecoveryLink = initialHash.includes("type=recovery");

function ResetPassword() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [recovering, setRecovering] = useState(openedWithRecoveryLink);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecovering(true);
    });
    if (openedWithRecoveryLink) setRecovering(true);
    supabase.auth.getSession().then(() => setChecking(false));
    return () => data.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error(
        error.message === "New password should be different from the old password."
          ? "Choose a password you haven't used here before."
          : error.message,
      );
      return;
    }
    toast.success("Password updated — you're signed in.");
    navigate({ to: "/browse" });
  };

  if (checking) {
    return <main className="p-10 text-center text-muted-foreground">Loading...</main>;
  }

  if (!recovering) {
    return (
      <main className="bg-hero flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
          <h1 className="font-display text-3xl font-bold">Reset link needed</h1>
          <p className="text-muted-foreground">
            This page needs a fresh reset link from your email. Ask for a new one and click the link inside.
          </p>
          <Button asChild className="w-full"><Link to="/forgot-password">Send me a reset link</Link></Button>
          <p className="text-sm text-muted-foreground">
            <Link to="/login" className="font-semibold text-primary">Back to login</Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-hero flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-12">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-8 shadow-soft">
        <h1 className="font-display text-3xl font-bold">New password</h1>
        <p className="text-sm text-muted-foreground">Choose a new password for your account.</p>
        <div className="space-y-2">
          <Label htmlFor="pw">New password</Label>
          <Input id="pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Saving..." : "Update password"}
        </Button>
      </form>
    </main>
  );
}
