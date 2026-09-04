import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { PageSection, Card } from "@/components/Section";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/give")({
  head: () => ({
    meta: [
      { title: "Give — Gospel for Generation Church" },
      {
        name: "description",
        content:
          "Support the ministries, missions partners and building of Gospel for Generation Church. Record a gift to the general, missions, building or benevolence fund.",
      },
      { property: "og:title", content: "Give — Gospel for Generation Church" },
      { property: "og:description", content: "Thank you for your generosity toward our ministries and missions." },
    ],
  }),
  component: Give,
});

const funds = [
  { id: "general", key: "give.fund.general" },
  { id: "missions", key: "give.fund.missions" },
  { id: "building", key: "give.fund.building" },
  { id: "benevolence", key: "give.fund.benevolence" },
];

function Give() {
  const { t } = useLang();
  const { user, loading } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [fund, setFund] = useState("general");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!user) {
      void navigate({ to: "/auth" });
      return;
    }
    const value = Number(amount);
    if (!value || value <= 0) return;
    setSaving(true);
    setStatus(null);
    const { error } = await supabase
      .from("donations")
      .insert({ user_id: user.id, fund, amount: value, note: note || null });
    setSaving(false);
    if (error) {
      setStatus(error.message);
      return;
    }
    setStatus(t("give.thanks"));
    setAmount("");
    setNote("");
    void queryClient.invalidateQueries({ queryKey: ["donations"] });
  }

  return (
    <PageSection title={t("give.h")} lede={t("give.p")}>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="border border-border bg-card p-6 shadow-soft">
          <h2 className="mb-4 text-2xl">{t("give.makeagift")}</h2>

          <fieldset className="mb-5 space-y-2">
            {funds.map((f) => (
              <label key={f.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="fund"
                  checked={fund === f.id}
                  onChange={() => setFund(f.id)}
                  className="accent-wood"
                />
                <span>{t(f.key)}</span>
              </label>
            ))}
          </fieldset>

          <div className="mb-4 flex flex-wrap gap-2">
            {[250, 500, 1000, 2500].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setAmount(String(v))}
                className={`rounded-sm border px-4 py-2 transition-colors ${
                  amount === String(v)
                    ? "border-wood-dark bg-wood-dark text-parchment"
                    : "border-border bg-background hover:border-wood"
                }`}
              >
                {v} ETB
              </button>
            ))}
          </div>

          <label className="mb-1 block text-sm text-muted-foreground" htmlFor="amount">
            {t("give.custom")}
          </label>
          <input
            id="amount"
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mb-4 w-full border border-border bg-background px-3 py-2"
          />

          <label className="mb-1 block text-sm text-muted-foreground" htmlFor="note">
            {t("give.note")}
          </label>
          <input
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mb-5 w-full border border-border bg-background px-3 py-2"
          />

          <button
            type="button"
            disabled={saving || loading}
            onClick={submit}
            className="w-full rounded-sm bg-wood-dark px-6 py-3 font-medium text-parchment transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {user ? t("give.now") : t("give.signin")}
          </button>
          {status ? <p className="mt-3 text-sm text-wood">{status}</p> : null}
        </div>

        <div>
          <h2 className="mb-3 text-2xl">{t("give.other.h")}</h2>
          <p className="mb-6">{t("give.other.p")}</p>
          <Card accent="amber">
            <p className="text-sm text-muted-foreground">{t("give.processor")}</p>
          </Card>
          <Link to="/portal" className="underline">
            {t("portal.history.h")}
          </Link>
        </div>
      </div>
    </PageSection>
  );
}
