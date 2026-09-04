import { ArrowUpRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

const DIRECTIONS_URL = "https://maps.app.goo.gl/sDAiezFQyjTDzrf96";

export function ContactLocation() {
  const { t } = useLang();

  return (
    <section className="bg-wood-dark px-6 py-16 text-parchment-2 md:py-24" aria-labelledby="location-heading">
      <div className="mx-auto grid max-w-[1100px] gap-12 md:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] md:items-center">
        <div className="min-w-0">
          <p className="mb-4 text-sm font-semibold uppercase text-amber">{t("location.eyebrow")}</p>
          <h2 id="location-heading" className="max-w-2xl text-4xl leading-tight text-parchment md:text-6xl">
            {t("location.title")}
          </h2>
          <p className="mt-5 max-w-xl leading-8 text-parchment-2">{t("location.body")}</p>
          <Button asChild size="lg" className="mt-8 h-12 bg-amber px-6 text-accent-foreground hover:bg-amber/90">
            <a href={DIRECTIONS_URL} target="_blank" rel="noreferrer">
              {t("hero.cta2")}
              <ArrowUpRight aria-hidden="true" />
            </a>
          </Button>
        </div>

        <a
          href={DIRECTIONS_URL}
          target="_blank"
          rel="noreferrer"
          aria-label={t("location.mapLabel")}
          className="group relative grid min-h-80 place-items-center overflow-hidden border border-parchment-2/25 bg-parchment-2/10 p-8 transition-colors hover:bg-parchment-2/15"
        >
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:32px_32px]" aria-hidden="true" />
          <div className="relative text-center">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-amber text-accent-foreground shadow-soft transition-transform group-hover:-translate-y-1">
              <MapPin className="h-9 w-9" aria-hidden="true" />
            </span>
            <p className="mt-6 text-sm font-semibold text-parchment">{t("home.address.p")}</p>
            <p className="mt-2 text-sm text-parchment-2">{t("location.mapLabel")}</p>
          </div>
        </a>
      </div>
    </section>
  );
}