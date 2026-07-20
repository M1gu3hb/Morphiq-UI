"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { registry } from "@/registry";
import { findRegistryEntry, type PreviewState } from "@/registry/schema";
import { useLocale } from "@/lib/client-locale";
import { tr } from "@/lib/i18n";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Client island for `/components/[slug]`.
 *
 * The source string is read from disk by the server page and passed in, so what
 * is displayed and copied is always the real file.
 */

const STATES: PreviewState[] = ["default", "focus", "loading", "disabled"];

/**
 * Each material is shown over a backdrop that makes it legible on its own
 * terms. Glass in particular is meaningless over flat white — it needs real
 * context behind it to be judged (see `docs/style-research.md`).
 */
const STAGE: Record<StyleSlug, string> = {
  clay: "bg-[radial-gradient(circle_at_25%_20%,#ffd0c2,transparent_55%),#ffb09d]",
  glass:
    "bg-[radial-gradient(circle_at_18%_18%,#eaff79,transparent_45%),radial-gradient(circle_at_82%_78%,#a889ff,transparent_55%),#6fcfff]",
  skeuo: "bg-[linear-gradient(160deg,#dedbd2,#b4b1a8)]",
  adaptive: "bg-[linear-gradient(160deg,#f4f2ec,#d8ff66)]",
};

const CHIP =
  "min-h-[32px] rounded-[10px] border border-[rgba(23,24,23,0.13)] bg-[rgba(255,255,255,0.4)] " +
  "px-[13px] text-[10px] font-extrabold tracking-[0.04em] text-[#6b6a64] uppercase cursor-pointer " +
  "transition-colors duration-150 hover:bg-[rgba(255,255,255,0.75)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171817]";

const CHIP_ON =
  "border-transparent bg-[#171817] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_3px_0_#5f5d57] " +
  "hover:bg-[#171817]";

/** One labelled row of switcher chips. Module scope so it is not remounted. */
function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[9px]">
      <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#65645c]">
        {label}
      </span>
      <div className="flex flex-wrap gap-[7px]">{children}</div>
    </div>
  );
}

function aiPrompt(
  name: string,
  material: string,
  source: string,
  npm: string[],
  internal: string[],
  locale: "en" | "es",
) {
  const deps = `npm install ${npm.join(" ")}`;
  const files = internal.join(", ");
  return tr(
    locale,
    `Add this Morphiq UI ${name} to my existing project. It is self-contained: the ${material} material recipe lives inside the component, so do not move its styles into a global stylesheet and do not swap the values for my design tokens unless I ask. Keep the accessibility behaviour exactly as written — the focus ring, aria-busy on loading, and the reduced-motion handling are part of the component, not decoration. Adapt only the import paths and the component name to my stack.\n\nInstall: ${deps}\nAlso copy these files: ${files}\n\nSource:\n\n${source}`,
    `Agrega este ${name} de Morphiq UI a mi proyecto existente. Es autocontenido: la receta del material ${material} vive dentro del componente, así que no muevas sus estilos a una hoja global ni cambies sus valores por mis tokens de diseño salvo que te lo pida. Conserva el comportamiento de accesibilidad tal cual está escrito — el anillo de foco, aria-busy en carga y el manejo de movimiento reducido son parte del componente, no decoración. Adapta solo las rutas de import y el nombre del componente a mi stack.\n\nInstalar: ${deps}\nCopia también estos archivos: ${files}\n\nCódigo fuente:\n\n${source}`,
  );
}

export function ComponentDetail({ slug, source }: { slug: string; source: string }) {
  const locale = useLocale();
  const t = (english: string, spanish: string) => tr(locale, english, spanish);
  const entry = findRegistryEntry(registry, slug);

  const [material, setMaterial] = useState<StyleSlug>(entry?.materials[0] ?? "clay");
  const [variant, setVariant] = useState(entry?.variants[0]?.id ?? "primary");
  const [size, setSize] = useState(entry?.sizes[1]?.id ?? entry?.sizes[0]?.id ?? "md");
  const [state, setState] = useState<PreviewState>("default");
  const [copied, setCopied] = useState<"code" | "ai" | null>(null);
  const [copyError, setCopyError] = useState("");
  // `copied` is a single shared slot for both buttons, so a second copy inside
  // the 1.5s window must restart the timer rather than inherit the first one's
  // remaining time (which would clear the new confirmation early).
  const copiedTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(copiedTimer.current), []);

  const prompt = useMemo(
    () =>
      entry
        ? aiPrompt(
            entry.name,
            material,
            source,
            entry.dependencies.npm,
            entry.dependencies.internal,
            locale,
          )
        : "",
    [entry, locale, material, source],
  );

  // The route only builds slugs that exist, but the island must still be honest
  // if it is ever rendered with an unknown one.
  if (!entry) {
    return (
      <main className="inner-page">
        <SiteHeader locale={locale} />
        <section className="page-grid py-24">
          <p className="text-[15px] text-[#696a66]">
            {t("This component is not in the registry.", "Este componente no está en el registro.")}
          </p>
        </section>
      </main>
    );
  }

  const Preview = entry.Preview;

  async function copy(contents: string, kind: "code" | "ai") {
    try {
      await navigator.clipboard.writeText(contents);
      setCopyError("");
      setCopied(kind);
      window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(null), 1500);
    } catch {
      window.clearTimeout(copiedTimer.current);
      setCopied(null);
      setCopyError(
        t(
          "Clipboard unavailable. Select the code and copy it manually.",
          "Portapapeles no disponible. Selecciona el código y cópialo manualmente.",
        ),
      );
    }
  }

  return (
    <main className="inner-page">
      <SiteHeader locale={locale} />

      <header className="page-hero page-grid">
        <Link
          className="mb-[18px] inline-flex items-center gap-[7px] text-[11px] font-extrabold text-[#696a66] transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171817]"
          href="/components"
        >
          <ArrowLeft aria-hidden="true" size={14} />
          {t("All components", "Todos los componentes")}
        </Link>
        <h1>{locale === "es" ? entry.nameEs : entry.name}</h1>
        <p>{locale === "es" ? entry.descriptionEs : entry.description}</p>
      </header>

      <section className="page-grid grid grid-cols-1 gap-[18px] pt-[42px] pb-[120px] lg:grid-cols-[1.05fr_0.95fr]">
        {/* ---------------------------------------------------------- preview */}
        <div className="flex flex-col gap-[18px]">
          <div className="overflow-hidden rounded-[33px] border border-[rgba(23,24,23,0.13)] bg-[rgba(255,255,255,0.3)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_15px_30px_rgba(27,25,22,0.06)]">
            <div className={`grid min-h-[320px] place-items-center p-[32px] ${STAGE[material]}`}>
              <Preview material={material} variant={variant} size={size} state={state} />
            </div>
            <div className="flex flex-col gap-[18px] p-[25px]">
              <Group label={t("Material", "Material")}>
                {entry.materials.map((value) => (
                  <button
                    aria-pressed={material === value}
                    className={`${CHIP} ${material === value ? CHIP_ON : ""}`}
                    key={value}
                    onClick={() => setMaterial(value)}
                    type="button"
                  >
                    {value}
                  </button>
                ))}
              </Group>
              <Group label={t("Variant", "Variante")}>
                {entry.variants.map((option) => (
                  <button
                    aria-pressed={variant === option.id}
                    className={`${CHIP} ${variant === option.id ? CHIP_ON : ""}`}
                    key={option.id}
                    onClick={() => setVariant(option.id)}
                    type="button"
                  >
                    {locale === "es" ? option.labelEs : option.label}
                  </button>
                ))}
              </Group>
              <Group label={t("Size", "Tamaño")}>
                {entry.sizes.map((option) => (
                  <button
                    aria-pressed={size === option.id}
                    className={`${CHIP} ${size === option.id ? CHIP_ON : ""}`}
                    key={option.id}
                    onClick={() => setSize(option.id)}
                    type="button"
                  >
                    {locale === "es" ? option.labelEs : option.label}
                  </button>
                ))}
              </Group>
              <Group label={t("State", "Estado")}>
                {STATES.map((value) => (
                  <button
                    aria-pressed={state === value}
                    className={`${CHIP} ${state === value ? CHIP_ON : ""}`}
                    key={value}
                    onClick={() => setState(value)}
                    type="button"
                  >
                    {value}
                  </button>
                ))}
              </Group>
              <p className="m-0 text-[11px] leading-[1.6] text-[#65645c]">
                {t(
                  "Hover and press the component itself — those states are live, not simulated.",
                  "Pasa el cursor y presiona el componente — esos estados son reales, no simulados.",
                )}
              </p>
            </div>
          </div>

          {/* ------------------------------------------------------ a11y + deps */}
          <div className="rounded-[26px] border border-[rgba(23,24,23,0.13)] bg-[rgba(255,255,255,0.42)] p-[25px]">
            <h2 className="m-0 text-[13px] font-extrabold uppercase tracking-[0.1em] text-[#171817]">
              {t("Accessibility", "Accesibilidad")}
            </h2>
            <p className="mt-[10px] mb-0 text-[12px] leading-[1.75] text-[#5c5b55]">
              {locale === "es" ? entry.a11yEs : entry.a11y}
            </p>

            <h2 className="mt-[24px] mb-0 text-[13px] font-extrabold uppercase tracking-[0.1em] text-[#171817]">
              {t("Dependencies", "Dependencias")}
            </h2>
            <dl className="mt-[10px] mb-0 grid grid-cols-[auto_1fr] gap-x-[14px] gap-y-[8px] text-[11px]">
              <dt className="font-extrabold text-[#65645c]">npm</dt>
              <dd className="m-0 font-mono text-[#3d3c37]">
                {entry.dependencies.npm.join(" · ")}
              </dd>
              <dt className="font-extrabold text-[#65645c]">{t("files", "archivos")}</dt>
              <dd className="m-0 font-mono text-[#3d3c37]">
                {[entry.sourcePath, ...entry.dependencies.internal].join(" · ")}
              </dd>
            </dl>
          </div>
        </div>

        {/* ------------------------------------------------------------- source */}
        <div className="flex min-w-0 flex-col gap-[12px]">
          <div className="flex flex-wrap items-center gap-[8px]">
            <button
              className={`${CHIP} inline-flex items-center gap-[7px] normal-case tracking-normal`}
              onClick={() => copy(source, "code")}
              type="button"
            >
              {copied === "code" ? <Check aria-hidden="true" size={13} /> : <Copy aria-hidden="true" size={13} />}
              {copied === "code" ? t("Copied", "Copiado") : t("Copy code", "Copiar código")}
            </button>
            <button
              className={`${CHIP} inline-flex items-center gap-[7px] normal-case tracking-normal`}
              onClick={() => copy(prompt, "ai")}
              type="button"
            >
              {copied === "ai" ? <Check aria-hidden="true" size={13} /> : <Sparkles aria-hidden="true" size={13} />}
              {copied === "ai" ? t("Prompt copied", "Prompt copiado") : t("Copy for AI", "Copiar para IA")}
            </button>
            <span className="text-[10px] font-bold text-[#9c4a3e]" role="status">
              {copyError}
            </span>
          </div>
          <div className="min-w-0 overflow-hidden rounded-[26px] border border-[rgba(23,24,23,0.13)] bg-[#1b1c1a]">
            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.1)] px-[20px] py-[13px]">
              <span className="font-mono text-[10px] text-[#8f8e86]">{entry.sourcePath}</span>
              <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#8f8e86]">
                {t("Real source", "Código real")}
              </span>
            </div>
            <pre className="m-0 max-h-[720px] overflow-auto p-[20px] font-mono text-[11px] leading-[1.75] text-[#dcdad2]">
              <code>{source}</code>
            </pre>
          </div>
        </div>
      </section>
    </main>
  );
}
