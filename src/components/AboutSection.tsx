import { PageSection } from "@/components/Section";
import { useLang } from "@/lib/i18n";

export function AboutSection() {
  const { t } = useLang();
  return (
    <PageSection id="about" title={t("about.h")}>
      <div className="grid min-w-0 gap-10 md:grid-cols-2">
        <div className="min-w-0">
          <h2 className="mb-3 text-2xl">{t("about.who.h")}</h2>
          <p className="mb-4">{t("about.who.p1")}</p>
          <p>{t("about.who.p2")}</p>
        </div>
        <div className="min-w-0">
          <h2 className="mb-3 text-2xl">{t("about.believe.h")}</h2>
          <p className="mb-6">{t("about.believe.p")}</p>
          <h2 className="mb-3 text-2xl">{t("about.lead.h")}</h2>
          <p>{t("about.lead.p")}</p>
        </div>
      </div>
    </PageSection>
  );
}
