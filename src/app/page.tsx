"use client";

import Link from "next/link";
import {
  ArrowRight,
  Box,
  Braces,
  Layers3,
  MousePointer2,
  Sparkles,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SurfacePreview } from "@/components/surface-preview";
import { componentLibrary, styleFamilies } from "@/lib/component-data";
import { tr } from "@/lib/i18n";
import { useLocale } from "@/lib/client-locale";

export default function Home() {
  const locale = useLocale();
  const t = (english: string, spanish: string) => tr(locale, english, spanish);

  return (
    <main className="site-shell overflow-hidden">
      <SiteHeader locale={locale} />

      <section className="hero-section page-grid">
        <div className="hero-copy">
          <div className="eyebrow clay-chip">
            <Sparkles size={14} aria-hidden="true" />
            {t("A tactile component foundry", "Una fundición de componentes táctiles")}
          </div>
          <h1>
            {t("Interfaces you can", "Interfaces que casi")}
            <span className="hero-emphasis"> {t("almost touch.", "puedes tocar.")}</span>
          </h1>
          <p className="hero-lede">
            {t(
              "A React component library and visual studio for expressive surfaces. Clay, glass, physical controls, and adaptive components—without the flat, interchangeable look.",
              "Una biblioteca de componentes React y un estudio visual para superficies expresivas. Arcilla, vidrio, controles físicos y componentes adaptativos, sin la apariencia plana e intercambiable.",
            )}
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/components">
              {t("Explore components", "Explorar componentes")} <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link className="button button-ghost" href="/studio">
              {t("Open the studio", "Abrir el estudio")}
            </Link>
          </div>
          <div className="hero-proof" aria-label="Product foundations">
            <span>{t("Open code", "Código abierto")}</span>
            <i />
            <span>React + TypeScript</span>
            <i />
            <span>{t("Accessible primitives", "Primitivas accesibles")}</span>
          </div>
        </div>

        <div className="hero-object" aria-label="Tactile interface preview">
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />
          <div className="hero-console glass-panel">
            <div className="console-topline">
              <span className="console-status"><i /> {t("Live surface", "Superficie activa")}</span>
              <span>01 / 04</span>
            </div>
            <div className="console-stage">
              <div className="clay-sculpture">
                <div className="clay-sculpture-gloss" />
                <Box size={54} strokeWidth={1.25} aria-hidden="true" />
              </div>
              <div className="console-label">
                <span>CLAY / ACTION</span>
                <strong>{t("Soft launch", "Lanzamiento suave")}</strong>
              </div>
            </div>
            <div className="console-controls">
              <button className="skeuo-knob" aria-label="Previous surface">
                <span>−</span>
              </button>
              <div className="console-meter">
                <span>{t("Depth", "Profundidad")}</span>
                <div><i /></div>
              </div>
              <button className="clay-play" aria-label="Preview interaction">
                <ArrowRight size={22} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="floating-pill glass-panel">
            <MousePointer2 size={14} aria-hidden="true" />
            {t("Drag it. Tune it. Own it.", "Muévelo. Ajústalo. Hazlo tuyo.")}
          </div>
        </div>
      </section>

      <section className="statement-band">
        <p>
          {t("Most UI libraries give you ", "La mayoría de las bibliotecas UI te dan ")}
          <span>{t("structure.", "estructura.")}</span>{" "}
          {t("We give structure a material, a weight, and a point of view.", "Nosotros le damos material, peso y un punto de vista.")}
        </p>
      </section>

      <section className="page-grid section-block" id="styles">
        <div className="section-heading split-heading">
          <div>
            <span className="section-kicker">{t("Surface languages", "Lenguajes de superficie")}</span>
            <h2>{t("Four systems. One coherent grammar.", "Cuatro sistemas. Una gramática coherente.")}</h2>
          </div>
          <p>
            {t(
              "Switch the material without rebuilding the component. The behavior stays dependable; the personality changes completely.",
              "Cambia el material sin reconstruir el componente. El comportamiento sigue siendo confiable; la personalidad cambia por completo.",
            )}
          </p>
        </div>

        <div className="style-grid">
          {styleFamilies.map((style) => (
            <article className={`style-card style-card-${style.slug}`} key={style.slug}>
              <div className="style-card-copy">
                <span>{style.number}</span>
                <h3>{style.name}</h3>
                <p>{locale === "es" ? style.descriptionEs : style.description}</p>
              </div>
              <SurfacePreview variant={style.slug} compact />
            </article>
          ))}
        </div>
      </section>

      <section className="page-grid section-block components-section">
        <div className="section-heading split-heading">
          <div>
            <span className="section-kicker">{t("Component collection", "Colección de componentes")}</span>
            <h2>{t("Not screenshots. Working React.", "No son capturas. Es React funcional.")}</h2>
          </div>
          <Link className="text-link" href="/components">
            {t("View the collection", "Ver la colección")} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="component-showcase-grid">
          {componentLibrary.slice(0, 3).map((component) => (
            <Link
              className="component-showcase-card"
              href={`/components#${component.slug}`}
              key={component.slug}
            >
              <div className={`component-preview component-preview-${component.style}`}>
                <SurfacePreview variant={component.style} specimen={component.specimen} />
              </div>
              <div className="component-card-meta">
                <div>
                  <span>{component.style}</span>
                  <h3>{locale === "es" ? component.nameEs : component.name}</h3>
                </div>
                <ArrowRight size={19} aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="library-landing page-grid">
        <div className="library-landing-copy">
          <span className="section-kicker">{t("Copy-ready library", "Biblioteca lista para copiar")}</span>
          <h2>{t("24 animated objects. Every detail is yours.", "24 objetos animados. Cada detalle es tuyo.")}</h2>
          <p>{t(
            "Change the words, accent, and motion speed. Copy production code, create an AI-ready implementation prompt, or download TSX, CSS, and SVG assets.",
            "Cambia las palabras, el acento y la velocidad. Copia código de producción, crea un prompt listo para IA o descarga recursos TSX, CSS y SVG.",
          )}</p>
          <Link className="button button-primary" href="/library">
            {t("Open the library", "Abrir la biblioteca")} <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="library-landing-stack" aria-hidden="true">
          <div className="landing-object landing-object-glass"><span>GLASS / CARD</span><strong>{t("Prism memory", "Memoria prismática")}</strong></div>
          <div className="landing-object landing-object-clay"><Sparkles size={19} /><strong>{t("Soft action", "Acción suave")}</strong><ArrowRight size={18} /></div>
          <div className="landing-object landing-object-adaptive"><i /><span>MORPHIQ MOTION</span></div>
        </div>
      </section>

      <section className="studio-callout page-grid">
        <div className="studio-callout-panel">
          <div className="studio-callout-copy">
            <span className="section-kicker">{t("Visual studio", "Estudio visual")}</span>
            <h2>{t("Shape the component, then take the code.", "Diseña el componente y llévate el código.")}</h2>
            <p>
              {t(
                "Start with a primitive, tune its material and geometry, arrange it on a responsive canvas, and export production-ready JSX and CSS.",
                "Parte de una primitiva, ajusta su material y geometría, acomódala en un lienzo responsivo y exporta JSX y CSS listos para producción.",
              )}
            </p>
            <Link className="button button-ink" href="/studio">
              {t("Build in the studio", "Construir en el estudio")} <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="studio-miniature glass-panel" aria-hidden="true">
            <div className="miniature-toolbar">
              <span><i /><i /><i /></span>
              <div />
            </div>
            <div className="miniature-body">
              <div className="miniature-layers">
                <span />
                <span />
                <span />
              </div>
              <div className="miniature-canvas">
                <div className="miniature-node">{t("Build yours", "Crea el tuyo")}</div>
              </div>
              <div className="miniature-inspector">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-grid principles" id="principles">
        <div className="principle-card">
          <Layers3 size={22} aria-hidden="true" />
          <h3>{t("Material tokens", "Tokens de material")}</h3>
          <p>{t("Depth, light, blur, borders, and texture behave like a system—not decoration.", "Profundidad, luz, desenfoque, bordes y textura se comportan como sistema, no como decoración.")}</p>
        </div>
        <div className="principle-card">
          <Braces size={22} aria-hidden="true" />
          <h3>{t("Code ownership", "Código que te pertenece")}</h3>
          <p>{t("Copy the source into your project. No visual lock-in and no mystery wrappers.", "Copia el código en tu proyecto. Sin bloqueo visual ni envolturas misteriosas.")}</p>
        </div>
        <div className="principle-card">
          <MousePointer2 size={22} aria-hidden="true" />
          <h3>{t("Real interaction", "Interacción real")}</h3>
          <p>{t("Keyboard, focus, reduced motion, contrast, and touch targets are first-class.", "Teclado, foco, movimiento reducido, contraste y objetivos táctiles son de primera clase.")}</p>
        </div>
      </section>

      <footer className="site-footer page-grid">
        <div className="footer-brand-lockup">
          <div className="brand-mark morphiq-mark brand-mark-footer"><span>Morphiq</span><b>UI</b></div>
          <span className="mh97-signature" aria-label="Created by MH97">MH97</span>
        </div>
        <p>{t("A surface system for interfaces with a pulse.", "Un sistema de superficies para interfaces con pulso.")}</p>
        <div>
          <Link href="/components">{t("Components", "Componentes")}</Link>
          <Link href="/library">{t("Library", "Biblioteca")}</Link>
          <Link href="/studio">{t("Studio", "Estudio")}</Link>
        </div>
      </footer>
    </main>
  );
}
