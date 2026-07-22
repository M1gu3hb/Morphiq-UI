import { RetroGridPreview } from "@/registry/previews/retro-grid-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Retro Grid background. */
export const entry: RegistryEntry = {
  slug: "retro-grid",
  name: "Retro Grid",
  nameEs: "Rejilla Retro",
  category: "backgrounds",
  materials: ["adaptive"],
  description:
    "A full-bleed container with a perspective grid that scrolls toward the horizon in pure CSS — a rotated plane, a repeating linear-gradient grid and a mask that fades the far edge, scrolled by a local keyframe. Material-agnostic single style; freezes under reduced motion and clears under forced colors.",
  descriptionEs:
    "Un contenedor full-bleed con una rejilla en perspectiva que se desplaza hacia el horizonte en CSS puro — un plano rotado, una cuadrícula de linear-gradient repetida y una máscara que desvanece el borde lejano, desplazada por un keyframe local. Estilo único agnóstico al material; se congela con movimiento reducido y se limpia con forced-colors.",
  variants: [{ id: "default", label: "Default", labelEs: "Por defecto" }],
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
    "A decorative full-bleed background. The grid is an aria-hidden layer behind the content, so reading order, focus and activation never depend on it, and children sit on a z-indexed content layer that carries its own contrast. The scroll keyframe travels with the component and is deduplicated. prefers-reduced-motion freezes the scroll to a static grid, and forced-colors removes the grid entirely and restores a system Canvas surface with CanvasText content. Being material-agnostic it ships a single fixed palette; the demo content is chosen to stay at least 4.5:1 against the surface, and callers own the contrast of their own content, which the effect never overrides because it sits behind an opaque base.",
  a11yEs:
    "Un fondo decorativo full-bleed. La rejilla es una capa con aria-hidden detrás del contenido, así que el orden de lectura, el foco y la activación nunca dependen de ella, y los hijos van en una capa de contenido con z-index que lleva su propio contraste. El keyframe de desplazamiento viaja con el componente y se deduplica. prefers-reduced-motion congela el desplazamiento en una rejilla estática, y forced-colors quita la rejilla por completo y restaura una superficie Canvas del sistema con contenido CanvasText. Al ser agnóstico al material entrega una paleta fija única; el contenido de demostración se elige para mantener al menos 4,5:1 contra la superficie, y quien lo usa es dueño del contraste de su propio contenido, que el efecto nunca pisa porque va detrás de una base opaca.",
  sourcePath: "src/registry/ui/retro-grid.tsx",
  Preview: RetroGridPreview,
};
