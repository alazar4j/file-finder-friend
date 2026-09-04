import { createFileRoute } from "@tanstack/react-router";
import { ContactLocation } from "@/components/ContactLocation";
import { HomeHero } from "@/components/HomeHero";
import { Card } from "@/components/Section";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gospel for Generation Church — Addis Ababa" },
      {
        name: "description",
        content:
          "A Bible-teaching church family in Addis Ababa. Sunday worship at 9 and 11 AM, Wednesday Bible study, events, sermons and a member portal.",
      },
      { property: "og:title", content: "Gospel for Generation Church — Addis Ababa" },
      {
        property: "og:description",
        content: "Worship, learn and serve together. Sunday services, sermons, events and giving.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { t } = useLang();

  return (
    <>
      <HomeHero />

      <main className="mx-auto max-w-[1100px] px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl">{t("home.welcome.h")}</h2>
            <hr className="rule-gold my-4" />
            <p className="mb-6 text-muted-foreground">{t("home.welcome.p")}</p>
            <Card>
              <h3 className="text-xl">{t("home.sunday.h")}</h3>
              <p>{t("home.sunday.p")}</p>
            </Card>
            <Card>
              <h3 className="text-xl">{t("home.wed.h")}</h3>
              <p>{t("home.wed.p")}</p>
            </Card>
            <Card>
              <h3 className="text-xl">{t("home.new.h")}</h3>
              <p>{t("home.new.p")}</p>
            </Card>
          </div>
          <div className="md:pt-24">
            <Card accent="ruby">
              <h3 className="text-xl">{t("home.thissun.h")}</h3>
              <p>{t("home.thissun.p")}</p>
            </Card>
            <Card>
              <h3 className="text-xl">{t("home.contact.h")}</h3>
              <p>{t("home.contact.p")}</p>
            </Card>
          </div>
        </div>

        <blockquote className="mt-14 border-y border-border py-10 text-center">
          <p className="display text-2xl italic md:text-3xl">{t("home.verse.text")}</p>
          <cite className="mt-3 block text-sm not-italic tracking-wide text-muted-foreground">
            {t("home.verse.ref")}
          </cite>
        </blockquote>
      </main>
      <ContactLocation />
    </>
  );
}
