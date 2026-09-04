import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageSection } from "@/components/Section";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useSession } from "@/hooks/useSession";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Member Sign In — Gospel for Generation Church" },
      {
        name: "description",
        content: "Sign in or create a member account to view your giving history, household details and prayer requests.",
      },
      { property: "og:title", content: "Member Sign In — Gospel for Generation Church" },
      { property: "og:description", content: "Access the member portal of Gospel for Generation Church." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { user } = useSession();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) void navigate({ to: "/portal" });
  }, [user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/portal` },
          });
    setBusy(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    void navigate({ to: "/portal" });
  }

  async function google() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setError(String(result.error));
      return;
    }
    if (result.redirected) return;
    void navigate({ to: "/portal" });
  }

  return (
    <PageSection title={t("auth.h")} lede={t("auth.p")}>
      <form onSubmit={submit} className="max-w-md border border-border bg-card p-6 shadow-soft">
        {mode === "signup" ? (
          <>
            <label className="mb-1 block text-sm text-muted-foreground" htmlFor="name">
              {t("auth.name")}
            </label>
            <input
              id="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mb-4 w-full border border-border bg-background px-3 py-2"
            />
          </>
        ) : null}

        <label className="mb-1 block text-sm text-muted-foreground" htmlFor="email">
          {t("auth.email")}
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full border border-border bg-background px-3 py-2"
        />

        <label className="mb-1 block text-sm text-muted-foreground" htmlFor="password">
          {t("auth.password")}
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-5 w-full border border-border bg-background px-3 py-2"
        />

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-sm bg-wood-dark px-6 py-3 font-medium text-parchment transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {mode === "signin" ? t("auth.signin") : t("auth.signup")}
        </button>

        <div className="my-4 text-center text-sm text-muted-foreground">{t("auth.or")}</div>

        <button
          type="button"
          onClick={google}
          className="w-full rounded-sm border border-wood px-6 py-3 font-medium text-wood-dark transition-colors hover:bg-secondary"
        >
          {t("auth.google")}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-sm underline"
        >
          {mode === "signin" ? t("auth.toSignup") : t("auth.toSignin")}
        </button>

        {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      </form>
    </PageSection>
  );
}
