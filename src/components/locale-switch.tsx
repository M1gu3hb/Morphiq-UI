import type { Locale } from "@/lib/i18n";
import { setClientLocale } from "@/lib/client-locale";

export function LocaleSwitch({ locale }: { locale: Locale }) {
  return (
    <div className="locale-switch" aria-label={locale === "es" ? "Cambiar idioma" : "Change language"}>
      <button aria-pressed={locale === "es"} onClick={() => setClientLocale("es")} type="button">ES</button>
      <button aria-pressed={locale === "en"} onClick={() => setClientLocale("en")} type="button">EN</button>
    </div>
  );
}
