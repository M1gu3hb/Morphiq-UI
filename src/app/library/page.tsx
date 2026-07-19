"use client";

import { Boxes, Code2, Download, Sparkles } from "lucide-react";
import { LibraryExplorer } from "@/components/library/library-explorer";
import { SiteHeader } from "@/components/site-header";
import { tr } from "@/lib/i18n";
import { useLocale } from "@/lib/client-locale";

export default function LibraryPage() {
  const locale = useLocale();
  const t = (english: string, spanish: string) => tr(locale, english, spanish);

  return (
    <main className="site-shell library-page">
      <SiteHeader locale={locale} />
      <section className="library-hero page-grid">
        <div>
          <span className="section-kicker">{t("Animated object library", "Biblioteca de objetos animados")}</span>
          <h1>{t("Pick it. Tune it. Ship it.", "Elige. Personaliza. Publica.")}</h1>
          <p>{t(
            "Twenty-four tactile components ready to customize, copy into a project, hand to an AI, or download as code and visual assets.",
            "Veinticuatro componentes táctiles listos para personalizar, copiar a un proyecto, entregar a una IA o descargar como código y recursos visuales.",
          )}</p>
        </div>
        <div className="library-hero-console" aria-hidden="true">
          <div className="library-hero-orb"><Boxes size={35} /></div>
          <div><strong>24</strong><span>{t("live objects", "objetos vivos")}</span></div>
          <i />
          <Sparkles size={19} />
        </div>
      </section>
      <section className="library-benefits page-grid" aria-label={t("Library features", "Funciones de la biblioteca")}>
        <span><Code2 size={15} /> React + CSS</span>
        <span><Sparkles size={15} /> {t("AI-ready prompt", "Prompt listo para IA")}</span>
        <span><Download size={15} /> TSX / CSS / SVG</span>
      </section>
      <LibraryExplorer locale={locale} />
    </main>
  );
}
