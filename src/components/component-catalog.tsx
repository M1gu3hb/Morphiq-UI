"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { registry } from "@/registry";
import type { StyleSlug } from "@/lib/component-data";
import { tr, type Locale } from "@/lib/i18n";

type Filter = "all" | StyleSlug;

const filters: Filter[] = ["all", "clay", "glass", "skeuo", "adaptive"];

function filterLabel(filter: Filter, locale: Locale) {
  switch (filter) {
    case "all":
      return tr(locale, "All materials", "Todos los materiales");
    case "clay":
      return tr(locale, "Clay", "Arcilla");
    case "glass":
      return tr(locale, "Glass", "Vidrio");
    case "skeuo":
      return tr(locale, "Skeuomorphic", "Esqueuomórfico");
    case "adaptive":
      return tr(locale, "Adaptive", "Adaptativo");
  }
}

/**
 * Catalog of production components, read straight from the registry.
 *
 * The material filter now selects the material a component is *previewed in*
 * rather than partitioning a list of one-material demos: a registry component
 * ships every material in `entry.materials`, so filtering by clay shows every
 * component that has a clay recipe, rendered in clay.
 */
export function ComponentCatalog({ locale }: { locale: Locale }) {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const t = (english: string, spanish: string) => tr(locale, english, spanish);

  const visibleComponents = useMemo(
    () =>
      registry.filter(
        (entry) => activeFilter === "all" || entry.materials.includes(activeFilter),
      ),
    [activeFilter],
  );

  return (
    <section className="catalog-wrap page-grid">
      <div className="filter-row">
        <div
          className="filter-pills"
          aria-label={t("Filter by material", "Filtrar por material")}
        >
          {filters.map((filter) => (
            <button
              aria-pressed={activeFilter === filter}
              className={`filter-pill ${activeFilter === filter ? "filter-pill-active" : ""}`}
              key={filter}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filterLabel(filter, locale)}
            </button>
          ))}
        </div>
        <span className="filter-count">
          {visibleComponents.length}{" "}
          {visibleComponents.length === 1
            ? t("component", "componente")
            : t("components", "componentes")}
        </span>
      </div>

      <div className="catalog-grid">
        {visibleComponents.map((entry) => {
          // In "all", show each component in the first material it declares.
          const material: StyleSlug =
            activeFilter === "all" ? entry.materials[0] : activeFilter;
          const Preview = entry.Preview;
          const name = locale === "es" ? entry.nameEs : entry.name;

          return (
            <article className="catalog-card" id={entry.slug} key={entry.slug}>
              <div className={`catalog-preview catalog-preview-${material}`}>
                <Preview
                  material={material}
                  variant={entry.variants[0]?.id ?? "primary"}
                  size={entry.sizes[1]?.id ?? entry.sizes[0]?.id ?? "md"}
                  state="default"
                />
              </div>
              <div className="catalog-card-body">
                <div className="catalog-card-top">
                  <div>
                    <h2>{name}</h2>
                    <p>{locale === "es" ? entry.descriptionEs : entry.description}</p>
                  </div>
                  <Link
                    aria-label={t(`Open ${entry.name} documentation`, `Abrir documentación de ${entry.nameEs}`)}
                    className="catalog-action"
                    href={`/components/${entry.slug}`}
                  >
                    <ArrowUpRight aria-hidden="true" size={18} />
                  </Link>
                </div>
                <div className="tag-row">
                  <span>{entry.category}</span>
                  {entry.materials.map((value) => (
                    <span key={value}>{value}</span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
