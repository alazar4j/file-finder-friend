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
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo.url} alt="Gospel for Generation Church logo" className="h-11 w-11 rounded-full" />
          <span className="display text-xl leading-tight text-parchment">{t("brand.name")}</span>
        </Link>

        <nav className="order-3 flex w-full gap-1 overflow-x-auto md:order-none md:w-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              activeOptions={{ exact: tab.to === "/" }}
              className="whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-[0.95rem] text-parchment-2 transition-colors hover:text-parchment"
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
