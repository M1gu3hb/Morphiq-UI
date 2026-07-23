import { GridBeamsPreview } from "@/registry/previews/grid-beams-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "grid-beams",
  name: "Grid Beams",
  nameEs: "Haces sobre rejilla",
  category: "backgrounds",
  materials: ["adaptive"],
  description: "A perspective synthwave grid with three staggered light beams, configurable grid and beam colors, and a stable foreground.",
  descriptionEs: "Una rejilla synthwave en perspectiva con tres haces escalonados, colores configurables y una capa frontal estable.",
  variants: [
    { id: "violet", label: "Violet", labelEs: "Violeta" },
    { id: "cyan", label: "Cyan", labelEs: "Cian" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The perspective grid, moving beams, and scrim are aria-hidden and cannot receive pointer input. Content stays above them with a dark veil that protects at least 4.5:1 text contrast. Reduced motion stops grid travel and all beam passes; forced colors hides the complete effect and keeps CanvasText on Canvas.",
  a11yEs: "La rejilla, los haces y la capa oscura son aria-hidden y no reciben puntero. El contenido queda encima con un velo que protege al menos 4,5:1. Movimiento reducido detiene rejilla y haces; forced colors oculta el efecto completo y conserva CanvasText sobre Canvas.",
  sourcePath: "src/registry/ui/grid-beams.tsx",
  Preview: GridBeamsPreview,
};
