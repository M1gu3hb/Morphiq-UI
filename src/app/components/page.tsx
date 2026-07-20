"use client";

import { SiteHeader } from "@/components/site-header";
import { ComponentCatalog } from "@/components/component-catalog";
import { registry } from "@/registry";
import { tr } from "@/lib/i18n";
import { useLocale } from "@/lib/client-locale";

export default function ComponentsPage() {
  const locale = useLocale();
  const t = (english: string, spanish: string) => tr(locale, english, spanish);
  const count = String(registry.length).padStart(3, "0");

  return (
    <main className="inner-page">
      <SiteHeader locale={locale} />
      <header className="page-hero page-grid">
        <span className="section-kicker">
          {t(`The registry / ${count}`, `El registro / ${count}`)}
        </span>
        <h1>{t("Components you own, not components you rent.", "Componentes que posees, no que alquilas.")}</h1>
        <p>
          {t(
            "Every entry here is a real source file you can read, copy, and keep. Each one carries its own material recipe inside the component, so nothing breaks when you paste it into a project that has never heard of Morphiq. This registry is deliberately small and growing one production-grade component at a time.",
            "Cada entrada aquí es un archivo fuente real que puedes leer, copiar y quedarte. Cada uno lleva su receta de material dentro del propio componente, así que nada se rompe al pegarlo en un proyecto que nunca ha oído hablar de Morphiq. Este registro es deliberadamente pequeño y crece de a un componente de producción a la vez.",
          )}
        </p>
      </header>
      <ComponentCatalog locale={locale} />
    </main>
  );
}
