import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LocaleSwitch } from "@/components/locale-switch";
import { tr, type Locale } from "@/lib/i18n";

export function SiteHeader({ locale }: { locale: Locale }) {
  return (
    <header className="site-header page-grid">
      <Link className="brand-mark morphiq-mark" href="/" aria-label="Morphiq UI home">
        <span>Morphiq</span><b>UI</b>
      </Link>
      <nav aria-label={tr(locale, "Main navigation", "Navegación principal")}>
        <Link href="/components">{tr(locale, "Components", "Componentes")}</Link>
        <Link href="/library">{tr(locale, "Library", "Biblioteca")}</Link>
        <Link href="/studio">{tr(locale, "Studio", "Estudio")}</Link>
        <Link href="/#styles">{tr(locale, "Styles", "Estilos")}</Link>
      </nav>
      <div className="header-actions">
        <LocaleSwitch locale={locale} />
        <Link className="header-cta" href="/studio">
          {tr(locale, "Start creating", "Crear ahora")} <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
