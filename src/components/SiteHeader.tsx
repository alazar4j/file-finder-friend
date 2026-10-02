import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
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
          className="h-10 shrink-0 border-gold/60 bg-transparent px-3 text-primary-foreground hover:bg-accent hover:text-accent-foreground"
        >
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

      <div
        id="mobile-navigation"
        className={`grid overflow-hidden border-t border-gold/20 bg-primary transition-[grid-template-rows,opacity] duration-300 lg:hidden ${
          menuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <nav aria-label="Mobile navigation" className="min-h-0 overflow-hidden px-4 sm:px-6">
          <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-1 py-3 sm:grid-cols-3">
            {tabs.map((tab) => (
              <Link
                key={tab.hash}
                to="/"
                hash={tab.hash}
                onClick={closeMenu}
                className="min-w-0 border-l-2 border-transparent px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:border-gold hover:bg-secondary hover:text-primary-foreground"
                activeProps={{ className: "!border-gold !bg-secondary !text-gold" }}
              >
                {t(tab.key)}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
