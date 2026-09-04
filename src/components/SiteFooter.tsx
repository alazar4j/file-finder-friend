import { useLang } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useLang();

  return (
    <footer className="mt-16 bg-wood-dark px-6 pt-11 pb-7 text-parchment-2">
      <div className="mx-auto flex max-w-[1100px] flex-wrap justify-between gap-8">
        <div className="max-w-xs">
          <h4 className="mb-2 text-xl !text-parchment">{t("brand.name")}</h4>
          <p className="text-sm">{t("home.address.p")}</p>
        </div>
        <div className="max-w-xs">
          <h4 className="mb-2 text-xl !text-parchment">{t("footer.times.h")}</h4>
          <p className="text-sm">{t("footer.times.p")}</p>
        </div>
        <div className="max-w-xs">
          <h4 className="mb-2 text-xl !text-parchment">{t("footer.connect.h")}</h4>
          <p className="text-sm">{t("home.contact.p")}</p>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-[1100px] border-t border-parchment-2/15 pt-5 text-xs text-parchment-2/70">
        {t("footer.copyright")}
      </div>
    </footer>
  );
}
