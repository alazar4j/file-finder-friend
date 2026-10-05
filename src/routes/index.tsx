import { createFileRoute } from "@tanstack/react-router";
import { ContactLocation } from "@/components/ContactLocation";
import { HomeGive } from "@/components/HomeGive";
import { HomeHero } from "@/components/HomeHero";
import { Card } from "@/components/Section";
import { useLang } from "@/lib/i18n";
import { useSession } from "@/hooks/useSession";
import { AboutSection } from "@/components/AboutSection";
import { EventsSection } from "@/components/EventsSection";
import { SermonsSection } from "@/components/SermonsSection";
import { GiveSection } from "@/components/GiveSection";
import { AuthSection } from "@/components/AuthSection";
import { PortalSection } from "@/components/PortalSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gospel for Generation Church — Addis Ababa" },
      {
        name: "description",
        content:
          "A Bible-teaching church family in Addis Ababa. Daily morning prayer, Wednesday service, Friday prayers, Saturday children's and youth ministry, and Sunday worship from 11:00 to 5:30 (Ethiopian Time) — events, sermons and a member portal.",
      },
      { property: "og:title", content: "Gospel for Generation Church — Addis Ababa" },
      {
        property: "og:description",
        content: "Worship, learn and serve together. Weekly services, sermons, events and giving.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const weeklyItems = [
  { h: "schedule.daily.h", tag: "schedule.daily.tag", p: "schedule.daily.p" },
  { h: "schedule.wed.h", tag: "schedule.wed.tag", p: "schedule.wed.p" },
  { h: "schedule.friam.h", tag: "schedule.friam.tag", p: "schedule.friam.p" },
  { h: "schedule.fripm.h", tag: "schedule.fripm.tag", p: "schedule.fripm.p" },
  { h: "schedule.satam.h", tag: "schedule.satam.tag", p: "schedule.satam.p" },
  { h: "schedule.satpm.h", tag: "schedule.satpm.tag", p: "schedule.satpm.p" },
  { h: "schedule.sun.h", tag: "schedule.sun.tag", p: "schedule.sun.p" },
] as const;

function WeeklySchedule() {
  const { t } = useLang();
  return (
    <div className="min-w-0">
      <h2 className="text-3xl">{t("schedule.weekly.h")}</h2>
      <hr className="rule-gold my-4" />
      <p className="mb-6 text-muted-foreground">{t("schedule.weekly.p")}</p>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        {weeklyItems.map((item) => (
          <div key={item.h} className="card-ledger border-l-wood">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gold">{t(item.tag)}</p>
            <h3 className="text-xl">{t(item.h)}</h3>
            <p>{t(item.p)}</p>
          </div>
        ))}
      </div>
      <div className="card-ledger border-l-wood">
        <h3 className="text-xl">{t("home.new.h")}</h3>
        <p>{t("home.new.p")}</p>
      </div>
    </div>
  );
}

function Home() {
  const { t } = useLang();
  const { user } = useSession();

  return (
    <>
      <HomeHero />

      <section id="services" className="w-full min-w-0 scroll-mt-24 overflow-x-clip border-t border-border bg-secondary px-4 py-14 sm:px-6 md:py-20">
        <div className="mx-auto w-full max-w-[1100px] min-w-0">
          <div className="mb-10 min-w-0 max-w-2xl">
            <h2 className="text-3xl">{t("home.welcome.h")}</h2>
            <hr className="rule-gold my-4" />
            <p className="text-muted-foreground">{t("home.welcome.p")}</p>
          </div>

          <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="min-w-0">
              <WeeklySchedule />
            </div>
            <div className="min-w-0 lg:pt-24">
              <Card accent="ruby">
                <h3 className="text-xl">{t("home.recent.h")}</h3>
                <p>{t("home.recent.p")}</p>
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
        </div>
      </section>
      <AboutSection />
      <EventsSection />
      <SermonsSection />
      <HomeGive />
      <GiveSection />
      <ContactLocation />
      {user ? <PortalSection embedded /> : <AuthSection embedded />}
    </>
  );
}
