import { AnimatedBeamPreview } from "@/registry/previews/animated-beam-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Animated Beam. */
export const entry: RegistryEntry = {
  slug: "animated-beam",
  name: "Animated Beam",
  nameEs: "Haz animado",
  category: "effects",
  materials: ["adaptive"],
  description:
    "A responsive SVG connector that measures two refs, draws a straight or curved path and flows a gradient dash between them.",
  descriptionEs:
    "Un conector SVG responsivo que mide dos refs, dibuja una ruta recta o curva y hace fluir un trazo degradado entre ellas.",
  variants: [
    { id: "curved", label: "Curved", labelEs: "Curvo" },
    { id: "straight", label: "Straight", labelEs: "Recto" },
  ],
  sizes: [
    { id: "sm", label: "Thin", labelEs: "Delgado" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Bold", labelEs: "Grueso" },
  ],
  dependencies: {
    npm: ["clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "The SVG connector is pointer-ignoring and aria-hidden because it only visualizes a relationship; the referenced source and destination elements retain their own semantics, focus and source order. ResizeObserver tracks all three boxes and disconnects on unmount. prefers-reduced-motion freezes the gradient dash on the real measured path, and forced-colors stops it and uses CanvasText for both strokes. No content or accessible name is derived from geometry, so callers should describe the relationship in nearby text when it carries meaning. Preview node labels exceed 4.5:1 on their opaque surfaces.",
  a11yEs:
    "El conector SVG ignora el puntero y es aria-hidden porque solo visualiza una relación; los elementos origen y destino referenciados conservan su propia semántica, foco y orden fuente. ResizeObserver sigue las tres cajas y se desconecta al desmontar. prefers-reduced-motion congela el trazo degradado sobre la ruta realmente medida, y forced-colors lo detiene y usa CanvasText para ambos trazos. Ningún contenido ni nombre accesible se deriva de la geometría, así que quien integra debe describir la relación en texto cercano cuando tenga significado. Las etiquetas de nodos de la preview superan 4,5:1 sobre sus superficies opacas.",
  sourcePath: "src/registry/ui/animated-beam.tsx",
  Preview: AnimatedBeamPreview,
};
