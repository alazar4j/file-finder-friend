import { ArrowUpRight, MapPin, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png.asset.json";
import { useLang } from "@/lib/i18n";

const DIRECTIONS_URL = "https://maps.app.goo.gl/sDAiezFQyjTDzrf96";
const PLACE_ID = "ChIJxTimk_-RSxYRDCd9_Il1mH4";
const PHONE = "+251 11 000 0000";
const PHONE_HREF = "tel:+251110000000";
const RATING = "5.0";
const REVIEWS = "3";

const browserKey = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"] as string | undefined;
const embedUrl = browserKey
  ? `https://www.google.com/maps/embed/v1/place?key=${browserKey}&q=place_id:${PLACE_ID}&zoom=16`
  : null;

export function ContactLocation() {
  const { t } = useLang();

  return (
    <section id="contact" className="bg-wood-dark text-parchment-2" aria-labelledby="location-heading">
      {/* Header banner */}
      <div className="border-b border-parchment-2/15 px-6 py-8">
        <div className="mx-auto grid max-w-[1100px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber">{t("location.eyebrow")}</p>
            <h2 id="location-heading" className="mt-2 truncate text-2xl text-parchment md:text-4xl">
              {t("location.title")}
            </h2>
          </div>
          <Button asChild className="h-11 shrink-0 bg-amber px-5 text-accent-foreground hover:bg-amber/90">
            <a href={PHONE_HREF}>
              <Phone aria-hidden="true" />
              <span className="hidden sm:inline">{PHONE}</span>
              <span className="sm:hidden">{t("contact.call")}</span>
            </a>
          </Button>
        </div>
      </div>

      {/* Map with overlay card */}
      <div className="relative">
        {embedUrl ? (
          <iframe
            title={t("location.mapLabel")}
            src={embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[360px] w-full border-0 md:h-[460px]"
          />
        ) : (
          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noreferrer"
            className="grid h-[360px] w-full place-items-center bg-parchment-2/10 md:h-[460px]"
          >
            <MapPin className="h-10 w-10 text-amber" aria-hidden="true" />
          </a>
        )}

        <div className="px-6 md:absolute md:bottom-6 md:left-1/2 md:w-full md:max-w-[1100px] md:-translate-x-1/2 md:px-6">
          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noreferrer"
            className="-mt-10 flex max-w-sm items-center gap-4 border border-border bg-card p-4 shadow-soft transition-transform hover:-translate-y-0.5 md:mt-0"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-amber text-accent-foreground">
              <MapPin className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold text-foreground">{t("brand.name")}</span>
              <span className="block truncate text-sm text-muted-foreground">{t("home.address.p")}</span>
              <span className="mt-1 flex items-center gap-1 text-sm text-foreground">
                <Star className="h-4 w-4 fill-amber text-amber" aria-hidden="true" />
                {RATING}
                <span className="text-muted-foreground">({REVIEWS})</span>
              </span>
            </span>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Details */}
      <div className="px-6 py-14 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <div className="flex items-center gap-3">
            <img src={logo.url} alt="" className="h-12 w-12 rounded-full" />
            <span className="display text-2xl uppercase tracking-[0.2em] text-parchment">{t("contact.wordmark")}</span>
          </div>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-parchment-2">{t("location.body")}</p>
          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wide text-amber">{t("home.address.h")}</dt>
              <dd className="mt-1 text-parchment">{t("home.address.p")}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wide text-amber">{t("home.contact.h")}</dt>
              <dd className="mt-1 text-parchment">{t("home.contact.p")}</dd>
            </div>
          </dl>

          <Button
            asChild
            size="lg"
            className="mt-10 h-14 w-full bg-ruby text-base text-parchment hover:bg-ruby/90"
          >
            <a href={DIRECTIONS_URL} target="_blank" rel="noreferrer">
              {t("contact.openMaps")}
              <ArrowUpRight aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
