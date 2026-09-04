import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageSection, Card } from "@/components/Section";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Member Portal — Gospel for Generation Church" },
      {
        name: "description",
        content: "Members: review your giving history, keep your household details current and submit prayer requests.",
      },
      { property: "og:title", content: "Member Portal — Gospel for Generation Church" },
      { property: "og:description", content: "Giving history, household details and prayer requests for members." },
    ],
  }),
  component: Portal,
});

function Portal() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { user, loading } = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const profile = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const donations = useQuery({
    queryKey: ["donations", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const prayers = useQuery({
    queryKey: ["prayers", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prayer_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const [form, setForm] = useState({ full_name: "", phone: "", address: "" });
  const [saved, setSaved] = useState(false);
  const [prayerText, setPrayerText] = useState("");

  useEffect(() => {
    if (profile.data) {
      setForm({
        full_name: profile.data.full_name ?? "",
        phone: profile.data.phone ?? "",
        address: profile.data.address ?? "",
      });
    }
  }, [profile.data]);

  if (loading || !user) {
    return <PageSection title={t("portal.h")}>{t("common.loading")}</PageSection>;
  }

  const total = (donations.data ?? []).reduce((sum, d) => sum + Number(d.amount), 0);
  const openPrayers = (prayers.data ?? []).filter((p) => p.status === "open").length;

  async function saveProfile() {
    setSaved(false);
    const { error } = await supabase.from("profiles").upsert({ id: user!.id, ...form });
    if (!error) {
      setSaved(true);
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  }

  async function addPrayer() {
    if (!prayerText.trim()) return;
    const { error } = await supabase
      .from("prayer_requests")
      .insert({ user_id: user!.id, body: prayerText.trim() });
    if (!error) {
      setPrayerText("");
      void queryClient.invalidateQueries({ queryKey: ["prayers"] });
    }
  }

  async function closePrayer(id: string) {
    await supabase.from("prayer_requests").update({ status: "answered" }).eq("id", id);
    void queryClient.invalidateQueries({ queryKey: ["prayers"] });
  }

  return (
    <PageSection title={t("portal.h")} lede={t("portal.p")}>
      <p className="mb-6">
        {t("portal.welcome")} <strong>{form.full_name || user.email}</strong>
      </p>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {[
          { num: `${total.toLocaleString()} ETB`, lbl: t("portal.giving") },
          { num: String(donations.data?.length ?? 0), lbl: t("portal.groups") },
          { num: String(openPrayers), lbl: t("portal.prayer") },
        ].map((c) => (
          <div key={c.lbl} className="border-l-[3px] border-amber bg-secondary p-5">
            <div className="display text-3xl text-wood-dark">{c.num}</div>
            <div className="text-sm text-muted-foreground">{c.lbl}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Card>
            <h2 className="mb-3 text-2xl">{t("portal.household.h")}</h2>
            {(["full_name", "phone", "address"] as const).map((field) => (
              <div key={field} className="mb-3">
                <label className="mb-1 block text-sm text-muted-foreground" htmlFor={field}>
                  {t(field === "full_name" ? "portal.name" : field === "phone" ? "portal.phone" : "portal.address")}
                </label>
                <input
                  id={field}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full border border-border bg-background px-3 py-2"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={saveProfile}
              className="rounded-sm bg-wood-dark px-5 py-2.5 text-parchment transition-opacity hover:opacity-90"
            >
              {t("portal.household.save")}
            </button>
            {saved ? <span className="ml-3 text-sm text-wood">{t("portal.saved")}</span> : null}
          </Card>

          <Card accent="ruby">
            <h2 className="mb-2 text-2xl">{t("portal.prayerreq.h")}</h2>
            <p className="mb-3 text-sm text-muted-foreground">{t("portal.prayerreq.p")}</p>
            <textarea
              value={prayerText}
              onChange={(e) => setPrayerText(e.target.value)}
              placeholder={t("portal.prayer.placeholder")}
              rows={3}
              className="mb-3 w-full border border-border bg-background px-3 py-2"
            />
            <button
              type="button"
              onClick={addPrayer}
              className="rounded-sm bg-wood-dark px-5 py-2.5 text-parchment transition-opacity hover:opacity-90"
            >
              {t("portal.prayer.submit")}
            </button>
            <ul className="mt-4 space-y-2">
              {prayers.data?.length === 0 ? (
                <li className="text-sm text-muted-foreground">{t("portal.prayer.none")}</li>
              ) : null}
              {prayers.data?.map((p) => (
                <li key={p.id} className="flex items-start justify-between gap-3 border-t border-border pt-2 text-sm">
                  <span className={p.status === "answered" ? "text-muted-foreground line-through" : ""}>{p.body}</span>
                  {p.status === "open" ? (
                    <button type="button" onClick={() => closePrayer(p.id)} className="shrink-0 underline">
                      {t("portal.prayer.close")}
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div>
          <Card accent="amber">
            <h2 className="mb-3 text-2xl">{t("portal.history.h")}</h2>
            {donations.data?.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("portal.history.none")}</p>
            ) : (
              <ul className="divide-y divide-border">
                {donations.data?.map((d) => (
                  <li key={d.id} className="flex justify-between py-2 text-sm">
                    <span>
                      {t(`give.fund.${d.fund}`)} · {new Date(d.created_at).toLocaleDateString()}
                    </span>
                    <span className="font-medium">{Number(d.amount).toLocaleString()} ETB</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              void navigate({ to: "/" });
            }}
            className="rounded-sm border border-wood px-5 py-2.5 text-wood-dark transition-colors hover:bg-secondary"
          >
            {t("portal.signout")}
          </button>
        </div>
      </div>
    </PageSection>
  );
}
