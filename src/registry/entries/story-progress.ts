import { StoryProgressPreview } from "@/registry/previews/story-progress-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "story-progress",
  name: "Story Progress",
  nameEs: "Progreso de historias",
  category: "media",
  materials: ["adaptive"],
  description: "Segmented story progress with named direct-selection tabs, optional timed advance and a textual current-state readout.",
  descriptionEs: "Progreso segmentado de historias con pestañas nombradas, avance temporizado opcional y lectura textual del estado actual.",
  variants: [{ id: "bars", label: "Bars", labelEs: "Barras" }, { id: "blocks", label: "Blocks", labelEs: "Bloques" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "Every segment is a named native tab with aria-selected and a labelled panel. The current label and fraction are visible and announced, so progress never depends on bar width or color alone. Reduced motion removes timed animation and leaves the active segment complete; forced colors uses Highlight.",
  a11yEs: "Cada segmento es una pestaña nativa nombrada con aria-selected y panel etiquetado. La etiqueta y fracción actuales son visibles y anunciadas, por lo que el progreso no depende solo del ancho o color. Movimiento reducido elimina el tiempo y deja completo el segmento activo; colores forzados usa Highlight.",
  sourcePath: "src/registry/ui/story-progress.tsx",
  Preview: StoryProgressPreview,
};
