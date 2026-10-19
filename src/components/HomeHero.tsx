import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import hero from "@/assets/sanctuary-hero.png.asset.json";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

const DIRECTIONS_URL = "https://maps.app.goo.gl/sDAiezFQyjTDzrf96";

export function HomeHero() {
  const { t } = useLang();

  return (
    <section id="top" className="relative isolate flex min-h-[680px] scroll-mt-28 items-end overflow-hidden bg-wood-dark px-6 pb-16 pt-32 md:min-h-[760px] md:items-center md:pb-24 md:pt-32">
      <img
        src={hero.url}
        alt="Gospel for Generation Church sanctuary with a glowing cross on stage and rows of chairs"
        className="absolute inset-0 -z-20 h-full w-full bg-wood-dark object-contain object-[50%_68px] md:object-cover md:object-center"
      />
      <div className="absolute inset-0 -z-10 bg-wood-dark/25 md:bg-wood-dark/40" aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-wood-dark via-wood-dark/80 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 -z-10 hidden h-24 bg-gradient-to-b from-wood-dark/70 to-transparent md:block"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-[1100px]">
        <div className="max-w-3xl">
          <p
            aria-label={t("hero.badge")}
            className="mb-6 inline-flex max-w-full items-center gap-2 border border-parchment-2/35 bg-wood-dark/55 px-4 py-2 text-sm text-parchment-2 backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-amber" aria-hidden="true" />
            <span>{t("hero.badge").replace(/^✨\s*/, "")}</span>
          </p>
          <h1 className="display text-5xl leading-[1.02] text-parchment md:text-7xl lg:text-8xl">
            {t("hero.title")}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-parchment-2 md:text-lg">{t("hero.lede")}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 bg-amber px-6 text-accent-foreground hover:bg-amber/90">
              <Link to="/" hash="about">
                {t("hero.cta1")}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-parchment-2/60 bg-wood-dark/35 px-6 text-parchment hover:bg-parchment-2 hover:text-wood-dark"
            >
              <a href={DIRECTIONS_URL} target="_blank" rel="noreferrer">
                <MapPin aria-hidden="true" />
                {t("hero.cta2")}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}