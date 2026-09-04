import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import hero from "@/assets/hero.jpg.asset.json";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

const DIRECTIONS_URL = "https://maps.app.goo.gl/sDAiezFQyjTDzrf96";

export function HomeHero() {
  const { t } = useLang();

  return (
    <section className="relative isolate flex min-h-[680px] items-end overflow-hidden bg-wood-dark px-6 pb-16 pt-28 md:min-h-[760px] md:items-center md:py-24">
      <img
        src={hero.url}
        alt="Stained glass inside Gospel for Generation Church"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-wood-dark/70" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-52 bg-gradient-to-t from-wood-dark to-transparent" aria-hidden="true" />

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
              <Link to="/about">
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