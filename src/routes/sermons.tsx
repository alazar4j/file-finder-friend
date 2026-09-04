import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageSection } from "@/components/Section";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/sermons")({
  head: () => ({
    meta: [
      { title: "Sermons — Gospel for Generation Church" },
      {
        name: "description",
        content: "Listen again to recent messages from Pastor James Okafor and our teaching team, in English and Amharic.",
      },
      { property: "og:title", content: "Sermons — Gospel for Generation Church" },
      { property: "og:description", content: "Catch up on a message, or revisit one that stuck with you." },
    ],
  }),
  component: Sermons,
});

function Sermons() {
  const { t, pick } = useLang();
  const [openId, setOpenId] = useState<string | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["sermons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sermons")
        .select("*")
        .order("preached_on", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <PageSection title={t("sermons.h")} lede={t("sermons.p")}>
      {isLoading ? <p className="text-muted-foreground">{t("common.loading")}</p> : null}
      <div className="border-y border-border">
        {data?.map((s) => (
          <article key={s.id} className="border-b border-border last:border-b-0">
            <div className="flex items-center justify-between gap-4 py-5">
              <div>
                <h2 className="text-2xl">{pick(s.title_en, s.title_am)}</h2>
                <p className="text-sm text-muted-foreground">
                  {pick(s.speaker_en, s.speaker_am)} · {pick(s.date_en, s.date_am)} ·{" "}
                  {pick(s.reference_en, s.reference_am)}
                </p>
              </div>
              <button
                type="button"
                aria-label={t("sermons.watch")}
                onClick={() => setOpenId(openId === s.id ? null : s.id)}
                className="h-11 w-11 shrink-0 rounded-full bg-wood-dark text-parchment transition-colors hover:bg-wood"
              >
                ▶
              </button>
            </div>
            {openId === s.id ? (
              <div className="mb-5 bg-secondary p-5">
                <p>{pick(s.description_en, s.description_am)}</p>
                {s.media_url ? (
                  <a className="mt-3 inline-block underline" href={s.media_url} target="_blank" rel="noreferrer">
                    {t("sermons.watch")}
                  </a>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">{t("sermons.note")}</p>
                )}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </PageSection>
  );
}
