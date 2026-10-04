import { Link } from "@tanstack/react-router";
import { Globe, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

const tabs = [
  { hash: "top", key: "nav.home" },
  { hash: "services", key: "home.welcome.h" },
  { hash: "about", key: "nav.about" },
  { hash: "events", key: "nav.events" },
  { hash: "sermons", key: "nav.sermons" },
  { hash: "give", key: "nav.give" },
  { hash: "contact", key: "home.contact.h" },
  { hash: "members", key: "nav.portal" },
] as const;

export function SiteHeader() {
  const { lang, setLang, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-gold/50 bg-primary/95 shadow-soft backdrop-blur-md">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 px-4 py-3 sm:px-6 lg:flex lg:gap-6">
        <Link to="/" hash="top" onClick={closeMenu} className="flex min-w-0 items-center gap-3 lg:mr-auto">
          <img src="/favicon.png" alt="Gospel for Generation Church logo" className="h-11 w-11 shrink-0 rounded-full ring-2 ring-gold/70" />
          <span className="display min-w-0 truncate text-lg leading-tight text-primary-foreground sm:text-xl">{t("brand.name")}</span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center lg:flex">
          {tabs.map((tab) => (
            <Link
              key={tab.hash}
              to="/"
              hash={tab.hash}
              activeOptions={{ exact: true, includeHash: true }}
              className="border-b-2 border-transparent px-2 py-2 text-center text-sm text-muted-foreground transition-colors hover:border-gold/50 hover:text-primary-foreground"
              activeProps={{ className: "border-b-2 !border-gold !text-gold" }}
            >
              {t(tab.key)}
            </Link>
          ))}
        </nav>

        <Button
          type="button"
          onClick={() => setLang(lang === "en" ? "am" : "en")}
          variant="outline"
          className="h-9 shrink-0 gap-2 rounded-full border-gold/40 bg-gold/10 px-4 text-sm font-medium text-primary-foreground transition-colors hover:border-gold/70 hover:bg-gold/25 hover:text-gold"
        >
          <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />
          {lang === "en" ? "አማርኛ" : "English"}
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="h-10 w-10 shrink-0 text-primary-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>
      </div>

    </header>

      {/* Mobile slide-over drawer */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${menuOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <div
          className={`absolute inset-0 bg-wood-dark/60 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMenu}
        />
        <div
          id="mobile-navigation"
          className={`absolute inset-y-0 right-0 flex w-72 max-w-[85vw] flex-col border-l border-gold/30 bg-primary shadow-2xl transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-gold/20 px-5 py-4">
            <span className="display text-base text-gold">{t("brand.name")}</span>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Close navigation menu"
              onClick={closeMenu}
              className="h-11 w-11 shrink-0 rounded-full text-gold hover:bg-gold/15 hover:text-gold"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
          <nav aria-label="Mobile navigation" className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-5">
            {tabs.map((tab) => (
              <Link
                key={tab.hash}
                to="/"
                hash={tab.hash}
                onClick={closeMenu}
                className="min-w-0 rounded-lg border-l-2 border-transparent px-4 py-3.5 text-base text-primary-foreground/80 transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold"
                activeProps={{ className: "!border-gold !bg-gold/15 !text-gold" }}
              >
                {t(tab.key)}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
