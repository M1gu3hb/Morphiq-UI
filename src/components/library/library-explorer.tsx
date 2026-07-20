"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Code2,
  Copy,
  Download,
  FileCode2,
  ImageDown,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { LibraryPreview } from "@/components/library/library-preview";
import { tr, type Locale } from "@/lib/i18n";
import {
  libraryComponents,
  type LibraryCategory,
  type LibraryComponent,
} from "@/lib/library-data";
import type { StyleSlug } from "@/lib/component-data";

type StyleFilter = "all" | StyleSlug;
type CategoryFilter = "all" | LibraryCategory;

const styleFilters: StyleFilter[] = ["all", "clay", "glass", "skeuo", "adaptive"];
const categoryFilters: CategoryFilter[] = ["all", "actions", "cards", "navigation", "feedback", "media", "loaders"];

function componentCss(item: LibraryComponent, accent: string, speed: number) {
  const surface = item.style === "glass"
    ? `background: color-mix(in srgb, ${accent} 22%, transparent);\n  backdrop-filter: blur(18px) saturate(135%);\n  border: 1px solid rgba(255,255,255,.62);\n  box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 18px 36px rgba(35,30,62,.18);`
    : item.style === "clay"
      ? `background: ${accent};\n  border: 1px solid rgba(70,30,22,.1);\n  box-shadow: inset 0 4px 4px rgba(255,255,255,.45), inset 0 -5px 7px rgba(90,28,18,.18), 0 9px 0 color-mix(in srgb, ${accent} 72%, #57251c), 0 17px 24px rgba(66,38,31,.18);`
      : item.style === "skeuo"
        ? `background: linear-gradient(145deg, #f1efe9, #aaa79f);\n  border: 1px solid rgba(25,25,23,.18);\n  box-shadow: inset 0 2px 1px white, inset 0 -3px 4px rgba(0,0,0,.12), 0 9px 15px rgba(38,36,31,.22);`
        : `color: white;\n  background: #20211f;\n  border: 1px solid rgba(0,0,0,.22);\n  box-shadow: inset 0 2px 1px rgba(255,255,255,.15), 0 8px 0 color-mix(in srgb, ${accent} 45%, #32351f);`;

  const keyframes = item.motion === "orbit"
    ? `transform: rotate(360deg);`
    : item.motion === "shimmer"
      ? `filter: brightness(1.18); transform: translateY(-2px);`
      : item.motion === "slide"
        ? `transform: translateX(5px);`
        : item.motion === "tilt"
          ? `transform: perspective(600px) rotateX(3deg) rotateY(-4deg) translateY(-3px);`
          : item.motion === "morph"
            ? `border-radius: 34px 18px 36px 20px; transform: scale(1.025);`
            : item.motion === "pulse" || item.motion === "breathe"
              ? `transform: scale(1.04); filter: saturate(1.18);`
              : item.motion === "wave"
                ? `transform: translateY(-4px);`
                : `transform: translateY(-5px);`;

  return `.morphiq-${item.slug} {\n  min-height: 54px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n  padding: 14px 20px;\n  border-radius: 18px;\n  font: 800 14px/1 system-ui, sans-serif;\n  transition: transform 180ms ease, filter 180ms ease;\n  animation: morphiq-${item.motion} ${Math.max(.45, 2.2 - speed).toFixed(2)}s ease-in-out infinite alternate;\n  ${surface}\n}\n\n@keyframes morphiq-${item.motion} {\n  to { ${keyframes} }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .morphiq-${item.slug} { animation: none; }\n}`;
}

function componentCode(item: LibraryComponent, text: string) {
  const componentName = item.slug.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("");
  return `import type { ButtonHTMLAttributes } from "react";\n\ntype ${componentName}Props = ButtonHTMLAttributes<HTMLButtonElement> & {\n  label?: string;\n};\n\nexport function ${componentName}({\n  label = ${JSON.stringify(text)},\n  className,\n  type = "button",\n  ...props\n}: ${componentName}Props) {\n  return (\n    <button\n      {...props}\n      className={["morphiq-${item.slug}", className].filter(Boolean).join(" ")}\n      type={type}\n    >\n      <span>{label}</span>\n      <span aria-hidden="true">↗</span>\n    </button>\n  );\n}`;
}

function aiPrompt(item: LibraryComponent, text: string, css: string, code: string, locale: Locale) {
  return tr(
    locale,
    `Add this Morphiq UI component to my existing interface. Preserve its tactile ${item.style} material and ${item.motion} animation, adapt imports and naming to my stack, keep it accessible, and do not redesign it.\n\nReact component:\n\n${code}\n\nCSS:\n\n${css}`,
    `Agrega este componente de Morphiq UI a mi interfaz existente. Conserva su material táctil ${item.style} y su animación ${item.motion}, adapta imports y nombres a mi stack, mantenlo accesible y no lo rediseñes.\n\nComponente React:\n\n${code}\n\nCSS:\n\n${css}`,
  );
}

function downloadFile(filename: string, contents: string, type: string) {
  const href = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(href);
}

function svgAsset(item: LibraryComponent, text: string, accent: string) {
  const safeText = text.replace(/[<>&'"]/g, "");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720">\n  <defs><filter id="shadow"><feDropShadow dx="0" dy="24" stdDeviation="22" flood-opacity=".18"/></filter></defs>\n  <rect width="1200" height="720" rx="72" fill="#f1efe9"/>\n  <circle cx="960" cy="110" r="250" fill="${accent}" opacity=".24"/>\n  <g filter="url(#shadow)"><rect x="310" y="255" width="580" height="210" rx="54" fill="${accent}"/><rect x="328" y="270" width="544" height="46" rx="23" fill="white" opacity=".24"/></g>\n  <text x="600" y="385" text-anchor="middle" font-family="system-ui,sans-serif" font-size="42" font-weight="800" fill="#171817">${safeText}</text>\n  <text x="600" y="620" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" font-weight="700" letter-spacing="4" fill="#77766f">MORPHIQ UI / ${item.slug.toUpperCase()}</text>\n</svg>`;
}

export function LibraryExplorer({ locale }: { locale: Locale }) {
  const [query, setQuery] = useState("");
  const [styleFilter, setStyleFilter] = useState<StyleFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [selected, setSelected] = useState<LibraryComponent | null>(null);
  const [customText, setCustomText] = useState("");
  const [accent, setAccent] = useState("#ff8068");
  const [speed, setSpeed] = useState(1);
  const [copied, setCopied] = useState<"code" | "ai" | null>(null);
  const [copyError, setCopyError] = useState("");
  const t = (english: string, spanish: string) => tr(locale, english, spanish);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return libraryComponents.filter((item) => {
      const localizedName = locale === "es" ? item.nameEs : item.name;
      const matchesQuery = !normalizedQuery || `${localizedName} ${item.style} ${item.category}`.toLowerCase().includes(normalizedQuery);
      return matchesQuery && (styleFilter === "all" || item.style === styleFilter) && (categoryFilter === "all" || item.category === categoryFilter);
    });
  }, [categoryFilter, locale, query, styleFilter]);

  useEffect(() => {
    if (!selected) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selected]);

  function openCustomizer(item: LibraryComponent) {
    setSelected(item);
    setCustomText(locale === "es" ? item.defaultTextEs : item.defaultText);
    setAccent(item.accent);
    setSpeed(1);
    setCopied(null);
    setCopyError("");
  }

  async function copy(contents: string, kind: "code" | "ai") {
    try {
      await navigator.clipboard.writeText(contents);
      setCopyError("");
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
      setCopyError(t("Clipboard unavailable. Download the bundle instead.", "Portapapeles no disponible. Descarga el paquete."));
    }
  }

  const css = selected ? componentCss(selected, accent, speed) : "";
  const code = selected ? componentCode(selected, customText) : "";
  const prompt = selected ? aiPrompt(selected, customText, css, code, locale) : "";

  return (
    <section className="library-explorer page-grid">
      <div className="library-controls">
        <label className="library-search">
          <Search size={16} aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("Search 24 components", "Buscar 24 componentes")} />
        </label>
        <span>{visibleItems.length} {t("results", "resultados")}</span>
      </div>
      <div className="library-filter-stack">
        <div className="filter-pills">
          {styleFilters.map((filter) => (
            <button className={`filter-pill ${styleFilter === filter ? "filter-pill-active" : ""}`} key={filter} onClick={() => setStyleFilter(filter)} type="button">
              {filter === "all" ? t("All materials", "Todos los materiales") : filter}
            </button>
          ))}
        </div>
        <div className="category-pills">
          {categoryFilters.map((filter) => (
            <button aria-pressed={categoryFilter === filter} key={filter} onClick={() => setCategoryFilter(filter)} type="button">
              {filter === "all" ? t("Everything", "Todo") : t(filter, filter === "actions" ? "Acciones" : filter === "cards" ? "Tarjetas" : filter === "navigation" ? "Navegación" : filter === "feedback" ? "Feedback" : filter === "media" ? "Multimedia" : "Cargadores")}
            </button>
          ))}
        </div>
      </div>

      <div className="motion-library-grid">
        {visibleItems.map((item) => {
          const text = locale === "es" ? item.defaultTextEs : item.defaultText;
          return (
            <article className="motion-library-card" key={item.slug}>
              <div className={`motion-library-preview preview-bg-${item.style}`}>
                <LibraryPreview item={item} text={text} accent={item.accent} />
                <span className="motion-badge">{item.motion}</span>
              </div>
              <div className="motion-library-meta">
                <div>
                  <span>{item.style} / {item.category}</span>
                  <h2>{locale === "es" ? item.nameEs : item.name}</h2>
                  <p>{locale === "es" ? item.descriptionEs : item.description}</p>
                </div>
                <button onClick={() => openCustomizer(item)} type="button">
                  {t("Customize", "Personalizar")} <Sparkles size={14} />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {selected ? (
        <div className="customizer-backdrop" role="presentation" onMouseDown={() => setSelected(null)}>
          <section className="library-customizer" role="dialog" aria-modal="true" aria-labelledby="customizer-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="customizer-head">
              <div><span>Morphiq object / {selected.slug}</span><h2 id="customizer-title">{locale === "es" ? selected.nameEs : selected.name}</h2></div>
              <button onClick={() => setSelected(null)} aria-label={t("Close", "Cerrar")} type="button"><X size={18} /></button>
            </div>
            <div className={`customizer-preview preview-bg-${selected.style}`}>
              <LibraryPreview item={selected} text={customText} accent={accent} speed={speed} />
            </div>
            <div className="customizer-body">
              <div className="customizer-fields">
                <label><span>{t("Text", "Texto")}</span><input value={customText} onChange={(event) => setCustomText(event.target.value)} /></label>
                <label className="customizer-color"><span>{t("Accent", "Acento")}</span><div><input type="color" value={accent} onChange={(event) => setAccent(event.target.value)} /><code>{accent}</code></div></label>
                <label><span>{t("Animation speed", "Velocidad de animación")} <b>{speed.toFixed(1)}×</b></span><input min="0.5" max="2" step="0.1" type="range" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} /></label>
              </div>
              <div className="customizer-code">
                <div><span>React / TSX</span><button onClick={() => copy(`${code}\n\n${css}`, "code")} type="button">{copied === "code" ? <Check size={13} /> : <Copy size={13} />}</button></div>
                <pre>{code}</pre>
              </div>
            </div>
            <div className="customizer-actions">
              <button className="ai-copy-button" onClick={() => copy(prompt, "ai")} type="button"><Sparkles size={15} /> {copied === "ai" ? t("Prompt copied", "Prompt copiado") : t("Copy for AI", "Copiar para IA")}</button>
              <button onClick={() => downloadFile(`${selected.slug}.tsx`, code, "text/typescript")} type="button"><FileCode2 size={15} /> TSX</button>
              <button onClick={() => downloadFile(`${selected.slug}.css`, css, "text/css")} type="button"><Code2 size={15} /> CSS</button>
              <button onClick={() => downloadFile(`${selected.slug}.svg`, svgAsset(selected, customText, accent), "image/svg+xml")} type="button"><ImageDown size={15} /> SVG</button>
              <button onClick={() => downloadFile(`${selected.slug}-bundle.txt`, `${prompt}\n\n--- SOURCE ---\n${code}\n\n--- STYLES ---\n${css}`, "text/plain")} type="button"><Download size={15} /> {t("Bundle", "Paquete")}</button>
              <span className="customizer-copy-status" role="status">{copyError}</span>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
