import { GridPatternPreview } from "@/registry/previews/grid-pattern-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Grid Pattern background. */
export const entry: RegistryEntry = {
  slug: "grid-pattern",
  name: "Grid Pattern",
  nameEs: "Patrón de Rejilla",
  category: "backgrounds",
  materials: ["adaptive"],
  description:
    "A full-bleed container tiled with a fine ruled grid behind its content in pure CSS — two repeated 1px linear-gradients, with a faded variant that vignettes the grid toward the edges through a radial mask. Material-agnostic single style; static, and clears under forced colors.",
  descriptionEs:
    "Un contenedor full-bleed con una rejilla fina detrás de su contenido en CSS puro — dos linear-gradients de 1px repetidos, con una variante desvanecida que hace viñeta de la rejilla hacia los bordes mediante una máscara radial. Estilo único agnóstico al material; estático, y se limpia con forced-colors.",
  variants: [
    { id: "default", label: "Solid", labelEs: "Sólido" },
    { id: "faded", label: "Faded", labelEs: "Desvanecido" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "A decorative full-bleed background. The grid is an aria-hidden layer behind the content, so reading order, focus and activation never depend on it, and children sit on a z-indexed content layer that carries its own contrast. The pattern is static, so there is nothing for prefers-reduced-motion to stop; forced-colors removes the grid entirely and restores a system Canvas surface with CanvasText content. The base and line colours flip with the colour scheme so the grid reads in both. Being material-agnostic it ships a single fixed palette; the demo content is chosen to stay at least 4.5:1 against the surface, and callers own the contrast of their own content, which the effect never overrides because it sits behind an opaque base.",
  a11yEs:
    "Un fondo decorativo full-bleed. La rejilla es una capa con aria-hidden detrás del contenido, así que el orden de lectura, el foco y la activación nunca dependen de ella, y los hijos van en una capa de contenido con z-index que lleva su propio contraste. El patrón es estático, así que no hay nada que prefers-reduced-motion deba detener; forced-colors quita la rejilla por completo y restaura una superficie Canvas del sistema con contenido CanvasText. La base y el color de las líneas se voltean con el esquema de color para que la rejilla se lea en ambos. Al ser agnóstico al material entrega una paleta fija única; el contenido de demostración se elige para mantener al menos 4,5:1 contra la superficie, y quien lo usa es dueño del contraste de su propio contenido, que el efecto nunca pisa porque va detrás de una base opaca.",
  sourcePath: "src/registry/ui/grid-pattern.tsx",
  Preview: GridPatternPreview,
};
