"use client";

import { SiteHeader } from "@/components/site-header";
import { ComponentCatalog } from "@/components/component-catalog";
import { tr } from "@/lib/i18n";
import { useLocale } from "@/lib/client-locale";

export default function ComponentsPage() {
  const locale = useLocale();
  const t = (english: string, spanish: string) => tr(locale, english, spanish);

  return (
    <main className="inner-page">
      <SiteHeader locale={locale} />
      <header className="page-hero page-grid">
        <span className="section-kicker">{t("The collection / 006", "La colección / 006")}</span>
        <h1>{t("Small pieces with a strong point of view.", "Pequeñas piezas con un punto de vista fuerte.")}</h1>
        <p>
          {t(
            "Each component is built as editable React source over accessible primitives. Copy it, tune the material tokens, and make it belong to the product around it.",
            "Cada componente está construido como código React editable sobre primitivas accesibles. Cópialo, ajusta sus tokens materiales y haz que pertenezca al producto que lo rodea.",
          )}
        </p>
      </header>
      <ComponentCatalog locale={locale} />
    </main>
  );
}
