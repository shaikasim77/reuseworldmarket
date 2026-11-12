import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password – Reuse World" },
      { name: "description", content: "Reset your Reuse World password with an email link." },
      { property: "og:title", content: "Forgot password – Reuse World" },
      { property: "og:description", content: "Reset your Reuse World password with an email link." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
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
            <p className="text-muted-foreground">
              If {email} has a Reuse World account, we sent a link to reset your password.
            </p>
            <p className="text-center text-sm text-muted-foreground">
              <Link to="/login" className="font-semibold text-primary">Back to login</Link>
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <h1 className="font-display text-3xl font-bold">Forgot password</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and we'll send you a link to choose a new password.
            </p>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                maxLength={255}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Sending..." : "Send reset link"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Remembered it? <Link to="/login" className="font-semibold text-primary">Login</Link>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
