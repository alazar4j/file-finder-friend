import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageSection } from "@/components/Section";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Upcoming Events — Gospel for Generation Church" },
      {
        name: "description",
        content: "Potlucks, youth nights, baptism Sundays and missions gatherings happening at our church this season.",
      },
      { property: "og:title", content: "Upcoming Events at Gospel for Generation Church" },
      { property: "og:description", content: "Everything happening across the church family this season." },
    ],
  }),
  component: Events,
});

function Events() {
  const { t, pick } = useLang();
  const { data, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <PageSection title={t("events.h")} lede={t("events.p")}>
      {isLoading ? <p className="text-muted-foreground">{t("common.loading")}</p> : null}
      {data?.length === 0 ? <p className="text-muted-foreground">{t("events.empty")}</p> : null}
      <div className="divide-y divide-border border-y border-border">
        {data?.map((e) => (
          <article key={e.id} className="flex gap-6 py-6">
            <div className="w-16 shrink-0 border-r border-border pr-4 text-center">
              <div className="display text-3xl leading-none text-wood-dark">{e.day_label}</div>
              <div className="text-xs tracking-widest text-muted-foreground">{e.month_label}</div>
            </div>
            <div>
              <h2 className="text-2xl">{pick(e.title_en, e.title_am)}</h2>
              <p className="mt-1">{pick(e.description_en, e.description_am)}</p>
              <p className="mt-2 text-sm tracking-wide text-muted-foreground">{pick(e.meta_en, e.meta_am)}</p>
            </div>
          </article>
        ))}
      </div>
    </PageSection>
  );
}
