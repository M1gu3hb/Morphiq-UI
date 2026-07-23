import { GradientMeshPreview } from "@/registry/previews/gradient-mesh-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "gradient-mesh",
  name: "Gradient Mesh",
  nameEs: "Malla de gradientes",
  category: "backgrounds",
  materials: ["adaptive"],
  description: "A drifting four-point radial gradient mesh with configurable colors, height, and intensity behind a protected foreground layer.",
  descriptionEs: "Una malla de cuatro gradientes radiales a la deriva con colores, altura e intensidad configurables detrás de una capa frontal protegida.",
  variants: [
    { id: "aurora", label: "Aurora", labelEs: "Aurora" },
    { id: "ember", label: "Ember", labelEs: "Brasa" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The mesh and contrast scrim are pointer-transparent aria-hidden layers; children remain in a separate foreground layer. A dark scrim protects at least 4.5:1 white-text contrast across every mesh position. prefers-reduced-motion freezes all background positions and opacity at a stable frame, while forced colors removes the decoration and restores CanvasText on Canvas.",
  a11yEs: "La malla y la capa de contraste son capas aria-hidden que dejan pasar el puntero; el contenido queda en una capa frontal separada. Una capa oscura protege al menos 4,5:1 para texto blanco en toda posición. prefers-reduced-motion congela posiciones y opacidad y forced colors elimina la decoración y restaura CanvasText sobre Canvas.",
  sourcePath: "src/registry/ui/gradient-mesh.tsx",
  Preview: GradientMeshPreview,
};
