import { createFileRoute } from "@tanstack/react-router";
import { PageSection } from "@/components/Section";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Gospel for Generation Church" },
      {
        name: "description",
        content:
          "Who we are, what we believe, and who leads Gospel for Generation Church — an evangelical, Bible-teaching congregation in Addis Ababa.",
      },
      { property: "og:title", content: "About Gospel for Generation Church" },
      { property: "og:description", content: "Our story, our convictions and our leadership team." },
    ],
  }),
  component: About,
});

function About() {
  const { t } = useLang();
  return (
    <PageSection title={t("about.h")}>
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-2xl">{t("about.who.h")}</h2>
          <p className="mb-4">{t("about.who.p1")}</p>
          <p>{t("about.who.p2")}</p>
        </div>
        <div>
          <h2 className="mb-3 text-2xl">{t("about.believe.h")}</h2>
          <p className="mb-6">{t("about.believe.p")}</p>
          <h2 className="mb-3 text-2xl">{t("about.lead.h")}</h2>
          <p>{t("about.lead.p")}</p>
        </div>
      </div>
    </PageSection>
  );
}
