import { PlusPatternPreview } from "@/registry/previews/plus-pattern-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "plus-pattern",
  name: "Plus Pattern",
  nameEs: "Patrón de cruces",
  category: "backgrounds",
  materials: ["adaptive"],
  description: "A tiled plus-sign mask with configurable cell size, color, intensity, and a restrained drift distinct from dot or line grids.",
  descriptionEs: "Una máscara teselada de signos plus con celda, color, intensidad y deriva configurables, distinta de rejillas de puntos o líneas.",
  variants: [
    { id: "drift", label: "Drift", labelEs: "Deriva" },
    { id: "pulse", label: "Pulse", labelEs: "Pulso" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The tessellated SVG mask is a single pointer-transparent aria-hidden layer rather than repeated semantic nodes. Content remains in a separate foreground layer with inherited high-contrast text. Reduced motion freezes mask position and opacity; forced colors removes the mask entirely and preserves CanvasText and layout.",
  a11yEs: "La máscara SVG teselada es una sola capa aria-hidden que deja pasar el puntero, no nodos semánticos repetidos. El contenido queda en una capa frontal con alto contraste. Movimiento reducido congela posición y opacidad; forced colors elimina la máscara preservando CanvasText y layout.",
  sourcePath: "src/registry/ui/plus-pattern.tsx",
  Preview: PlusPatternPreview,
};
