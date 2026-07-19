"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { componentLibrary, type StyleSlug } from "@/lib/component-data";
import { SurfacePreview } from "@/components/surface-preview";
import { tr, type Locale } from "@/lib/i18n";

type Filter = "all" | StyleSlug;

const filters: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "All surfaces" },
  { value: "clay", label: "Clay" },
  { value: "glass", label: "Glass" },
  { value: "skeuo", label: "Skeuomorphic" },
  { value: "adaptive", label: "Adaptive" },
];

export function ComponentCatalog({ locale }: { locale: Locale }) {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const t = (english: string, spanish: string) => tr(locale, english, spanish);
  const visibleComponents = useMemo(
    () => componentLibrary.filter((item) => activeFilter === "all" || item.style === activeFilter),
    [activeFilter],
  );

  return (
    <section className="catalog-wrap page-grid">
      <div className="filter-row">
        <div className="filter-pills" aria-label={t("Filter component collection", "Filtrar colección de componentes")}>
          {filters.map((filter) => (
            <button
              aria-pressed={activeFilter === filter.value}
              className={`filter-pill ${activeFilter === filter.value ? "filter-pill-active" : ""}`}
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              type="button"
            >
              {filter.value === "all" ? t("All surfaces", "Todas") : filter.value === "clay" ? t("Clay", "Arcilla") : filter.value === "skeuo" ? t("Skeuomorphic", "Esqueuomórfico") : filter.value === "adaptive" ? t("Adaptive", "Adaptativo") : filter.label}
            </button>
          ))}
        </div>
        <span className="filter-count">{visibleComponents.length} {t("objects", "objetos")}</span>
      </div>

      <div className="catalog-grid">
        {visibleComponents.map((component) => (
          <article className="catalog-card" id={component.slug} key={component.slug}>
            <div className={`catalog-preview catalog-preview-${component.style}`}>
              <SurfacePreview variant={component.style} specimen={component.specimen} />
            </div>
            <div className="catalog-card-body">
              <div className="catalog-card-top">
                <div>
                  <h2>{locale === "es" ? component.nameEs : component.name}</h2>
                  <p>{locale === "es" ? component.descriptionEs : component.description}</p>
                </div>
                <Link className="catalog-action" href={`/studio?starter=${component.slug}`} aria-label={t(`Edit ${component.name} in studio`, `Editar ${component.nameEs} en el estudio`)}>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </div>
              <div className="tag-row">
                <span>{component.style}</span>
                {component.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
