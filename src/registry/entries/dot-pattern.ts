import { DotPatternPreview } from "@/registry/previews/dot-pattern-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Dot Pattern background. */
export const entry: RegistryEntry = {
  slug: "dot-pattern",
  name: "Dot Pattern",
  nameEs: "Patrón de Puntos",
  category: "backgrounds",
  materials: ["adaptive"],
  description:
    "A full-bleed container tiled with a dot grid behind its content in pure CSS — a single repeated radial-gradient, with a faded variant that dissolves the dots toward the edges through a radial mask. Material-agnostic single style; static, and clears under forced colors.",
  descriptionEs:
    "Un contenedor full-bleed con una cuadrícula de puntos detrás de su contenido en CSS puro — un radial-gradient repetido, con una variante desvanecida que disuelve los puntos hacia los bordes mediante una máscara radial. Estilo único agnóstico al material; estático, y se limpia con forced-colors.",
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
    "A decorative full-bleed background. The dots are an aria-hidden layer behind the content, so reading order, focus and activation never depend on them, and children sit on a z-indexed content layer that carries its own contrast. The pattern is static, so there is nothing for prefers-reduced-motion to stop; forced-colors removes the dots entirely and restores a system Canvas surface with CanvasText content. The base and dot colours flip with the colour scheme so the pattern reads in both. Being material-agnostic it ships a single fixed palette; the demo content is chosen to stay at least 4.5:1 against the surface, and callers own the contrast of their own content, which the effect never overrides because it sits behind an opaque base.",
  a11yEs:
    "Un fondo decorativo full-bleed. Los puntos son una capa con aria-hidden detrás del contenido, así que el orden de lectura, el foco y la activación nunca dependen de ellos, y los hijos van en una capa de contenido con z-index que lleva su propio contraste. El patrón es estático, así que no hay nada que prefers-reduced-motion deba detener; forced-colors quita los puntos por completo y restaura una superficie Canvas del sistema con contenido CanvasText. La base y el color de los puntos se voltean con el esquema de color para que el patrón se lea en ambos. Al ser agnóstico al material entrega una paleta fija única; el contenido de demostración se elige para mantener al menos 4,5:1 contra la superficie, y quien lo usa es dueño del contraste de su propio contenido, que el efecto nunca pisa porque va detrás de una base opaca.",
  sourcePath: "src/registry/ui/dot-pattern.tsx",
  Preview: DotPatternPreview,
};
