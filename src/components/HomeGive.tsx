import { Link } from "@tanstack/react-router";
import { ArrowRight, HandCoins, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

export function HomeGive() {
  const { t } = useLang();

  return (
    <section id="give" className="scroll-mt-24 border-t border-border bg-secondary px-4 py-14 sm:px-6 md:py-20" aria-labelledby="give-heading">
      <div className="mx-auto grid max-w-[1100px] gap-10 md:grid-cols-2 md:items-center">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">{t("give.h")}</p>
          <h2 id="give-heading" className="mt-2 text-3xl md:text-4xl">
            {t("home.give.h")}
          </h2>
          <hr className="rule-gold my-4" />
          <p className="max-w-xl text-muted-foreground">{t("home.give.p")}</p>
          <Button asChild size="lg" className="mt-7 h-12 bg-accent px-6 text-accent-foreground hover:bg-accent/90">
            <Link to="/" hash="donate">
              {t("give.makeagift")}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="card-ledger min-w-0 border-l-amber">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber/20 text-gold">
              <Landmark className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="text-xl">{t("home.give.bank.h")}</h3>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-4">
              <dt className="text-muted-foreground">{t("home.give.bank.name")}</dt>
              <dd className="text-right font-medium">{t("home.give.bank.nameV")}</dd>
            </div>
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-4">
              <dt className="text-muted-foreground">{t("home.give.bank.acct")}</dt>
              <dd className="text-right font-medium">{t("home.give.bank.acctV")}</dd>
            </div>
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-4">
              <dt className="text-muted-foreground">{t("home.give.bank.holder")}</dt>
              <dd className="text-right font-medium">{t("brand.name")}</dd>
            </div>
          </dl>
          <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
            <HandCoins className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {t("give.other.p")}
          </p>
        </div>
      </div>
    </section>
  );
}
