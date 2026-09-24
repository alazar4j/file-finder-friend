import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png.asset.json";
import { useLang } from "@/lib/i18n";

const tabs = [
  { to: "/", key: "nav.home" },
  { to: "/about", key: "nav.about" },
  { to: "/events", key: "nav.events" },
  { to: "/sermons", key: "nav.sermons" },
  { to: "/give", key: "nav.give" },
  { to: "/portal", key: "nav.portal" },
] as const;

export function SiteHeader() {
  const { lang, setLang, t } = useLang();

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-gold bg-wood-dark">
      <div className="mx-auto grid w-full max-w-[1100px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:px-6 md:flex md:flex-wrap md:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img src={logo.url} alt="Gospel for Generation Church logo" className="h-11 w-11 shrink-0 rounded-full" />
          <span className="display min-w-0 text-lg leading-tight text-parchment sm:text-xl">{t("brand.name")}</span>
        </Link>

        <nav className="order-3 col-span-2 grid w-full grid-cols-3 gap-1 md:order-none md:flex md:w-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              activeOptions={{ exact: tab.to === "/" }}
              className="min-w-0 border-b-2 border-transparent px-1 py-2 text-center text-sm text-parchment-2 transition-colors hover:text-parchment sm:px-3 sm:text-[0.95rem]"
              activeProps={{ className: "border-b-2 !border-amber !text-parchment" }}
            >
              {t(tab.key)}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setLang(lang === "en" ? "am" : "en")}
          className="rounded-sm border-[1.5px] border-parchment-2 px-3.5 py-2 text-sm text-parchment-2 transition-colors hover:border-parchment hover:text-parchment"
        >
          {lang === "en" ? "አማርኛ" : "English"}
        </button>
      </div>
    </header>
  );
}
