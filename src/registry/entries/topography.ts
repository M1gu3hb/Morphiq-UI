import { TopographyPreview } from "@/registry/previews/topography-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "topography",
  name: "Topography",
  nameEs: "Topografía",
  category: "backgrounds",
  materials: ["adaptive"],
  description: "Layered SVG contour lines with restrained dash and position drift, plus configurable line color, speed, height, and intensity.",
  descriptionEs: "Líneas de contorno SVG en capas con deriva contenida, más color, velocidad, altura e intensidad configurables.",
  variants: [
    { id: "contours", label: "Contours", labelEs: "Contornos" },
    { id: "terrain", label: "Terrain", labelEs: "Terreno" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The complete SVG contour map is aria-hidden, pointer-transparent, and uses vector-effect so responsive scaling stays crisp. Foreground content is independent and protected by a dark scrim. prefers-reduced-motion freezes dash and positional drift; forced colors hides the SVG and scrim while restoring CanvasText and preserving layout.",
  a11yEs: "El mapa SVG completo usa aria-hidden, deja pasar el puntero y vector-effect para escalar con nitidez. El contenido frontal es independiente y está protegido por una capa oscura. prefers-reduced-motion congela dash y deriva; forced colors oculta SVG y decoración preservando CanvasText y layout.",
  sourcePath: "src/registry/ui/topography.tsx",
  Preview: TopographyPreview,
};
