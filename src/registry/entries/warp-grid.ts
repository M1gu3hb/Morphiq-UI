import { WarpGridPreview } from "@/registry/previews/warp-grid-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "warp-grid",
  name: "Warp Grid",
  nameEs: "Rejilla warp",
  category: "backgrounds",
  materials: ["adaptive"],
  description: "A CSS perspective grid flowing toward a glowing horizon with configurable cell size, color, speed, height, and intensity.",
  descriptionEs: "Una rejilla CSS en perspectiva que fluye hacia un horizonte luminoso con celda, color, velocidad, altura e intensidad configurables.",
  variants: [
    { id: "violet", label: "Violet", labelEs: "Violeta" },
    { id: "emerald", label: "Emerald", labelEs: "Esmeralda" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The perspective grid, horizon glow, and contrast scrim are aria-hidden and never block interaction. Foreground content stays in normal flow with at least 4.5:1 contrast. prefers-reduced-motion freezes perspective travel and deformation at its initial frame; forced colors removes the effect and preserves CanvasText and the chosen component height.",
  a11yEs: "La rejilla, brillo del horizonte y velo son aria-hidden y nunca bloquean interacción. El contenido queda en flujo normal con al menos 4,5:1. prefers-reduced-motion congela viaje y deformación en el cuadro inicial; forced colors elimina el efecto y preserva CanvasText y la altura elegida.",
  sourcePath: "src/registry/ui/warp-grid.tsx",
  Preview: WarpGridPreview,
};
