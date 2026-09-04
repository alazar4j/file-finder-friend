import { Link } from "@tanstack/react-router";
import { ArrowRight, HandCoins, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

export function HomeGive() {
  const { t } = useLang();

  return (
    <section id="give" className="bg-secondary px-6 py-14 md:py-20" aria-labelledby="give-heading">
      <div className="mx-auto grid max-w-[1100px] gap-10 md:grid-cols-2 md:items-center">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wide text-wood">{t("give.h")}</p>
          <h2 id="give-heading" className="mt-2 text-3xl md:text-4xl">
            {t("home.give.h")}
          </h2>
          <hr className="rule-gold my-4" />
          <p className="max-w-xl text-muted-foreground">{t("home.give.p")}</p>
          <Button asChild size="lg" className="mt-7 h-12 bg-wood-dark px-6 text-parchment hover:bg-wood">
            <Link to="/give">
              {t("give.makeagift")}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="card-ledger border-l-amber">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber/20 text-wood-dark">
              <Landmark className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="text-xl">{t("home.give.bank.h")}</h3>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{t("home.give.bank.name")}</dt>
              <dd className="text-right font-medium">{t("home.give.bank.nameV")}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{t("home.give.bank.acct")}</dt>
              <dd className="text-right font-medium">{t("home.give.bank.acctV")}</dd>
            </div>
            <div className="flex justify-between gap-4">
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
