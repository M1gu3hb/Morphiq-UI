import type { ComponentType } from "react";
import type { StyleSlug } from "@/lib/component-data";

/**
 * Registry schema — the contract every production component must satisfy to be
 * listed in `/components` and distributed as source code.
 *
 * The registry is the source of truth described in `docs/product-roadmap.md`:
 * the catalog, the detail route and (later) the studio all read from it. Adding
 * a component means appending one `RegistryEntry`; nothing else in the app has
 * to change.
 */

/** Categories used for grouping and filtering in the catalog. */
export type RegistryCategory =
  | "actions"
  | "cards"
  | "navigation"
  | "feedback"
  | "media"
  | "inputs";

/**
 * States a preview can be put into deterministically.
 *
 * Deliberately excludes `hover` and `active`: forcing those would mean writing
 * every material's hover/press recipe a second time behind a `data-*` selector,
 * and the duplicate could silently drift from the real one. They stay live —
 * the reader hovers and presses the actual component in the preview.
 */
export type PreviewState = "default" | "focus" | "loading" | "disabled";

/**
 * Props every preview component receives from the detail page switcher.
 * `variant` and `size` are opaque strings here: each entry declares the values
 * it accepts in `variants` / `sizes`, and its own preview narrows them.
 */
export type PreviewProps = {
  material: StyleSlug;
  variant: string;
  size: string;
  state: PreviewState;
};

export type PreviewComponent = ComponentType<PreviewProps>;

/** A selectable option on one of a component's axes (variant or size). */
export type RegistryOption = {
  id: string;
  label: string;
  labelEs: string;
};

/**
 * What a consumer must install/copy to own the component.
 *
 * - `npm` — packages the source file imports.
 * - `internal` — repo-relative files that must be copied alongside it
 *   (the shadcn "open code" model: the component is yours, but it may lean on
 *   a small shared helper such as `src/lib/cn.ts`).
 */
export type RegistryDependencies = {
  npm: string[];
  internal: string[];
};

export type RegistryEntry = {
  /** URL segment: `/components/<slug>`. Must be unique and kebab-case. */
  slug: string;
  name: string;
  nameEs: string;
  category: RegistryCategory;
  /** Materials the component ships recipes for. Drives the catalog filter. */
  materials: StyleSlug[];
  description: string;
  descriptionEs: string;
  /** The component's own variant axis (intent, tone, orientation, …). */
  variants: RegistryOption[];
  sizes: RegistryOption[];
  dependencies: RegistryDependencies;
  /** Accessibility contract: what the component guarantees. Shown verbatim. */
  a11y: string;
  a11yEs: string;
  /**
   * Repo-relative POSIX path to the source file, read at build time so the
   * detail page always shows the real code instead of a transcription.
   */
  sourcePath: string;
  /** Live preview rendered by the detail page and the catalog card. */
  Preview: PreviewComponent;
};

/** Narrowing helper used by the detail route. */
export function findRegistryEntry(
  entries: readonly RegistryEntry[],
  slug: string,
): RegistryEntry | undefined {
  return entries.find((entry) => entry.slug === slug);
}
