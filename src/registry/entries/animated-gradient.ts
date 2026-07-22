import { AnimatedGradientPreview } from "@/registry/previews/animated-gradient-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "animated-gradient",
  name: "Animated Gradient",
  nameEs: "Gradiente Animado",
  category: "backgrounds",
  materials: ["adaptive"],
  description: "A moving multicolour mesh built from three crisp radial gradients, background-position and a restrained hue drift. A uniform dark scrim protects foreground contrast at every frame.",
  descriptionEs: "Una malla multicolor móvil hecha con tres gradientes radiales nítidos, background-position y una deriva de tono contenida. Una capa oscura uniforme protege el contraste frontal en cada cuadro.",
  variants: [{ id: "ocean", label: "Ocean", labelEs: "Océano" }, { id: "sunset", label: "Sunset", labelEs: "Atardecer" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The mesh and contrast scrim are aria-hidden behind a stable content layer. The scrim guarantees the supplied foreground remains legible regardless of gradient position. prefers-reduced-motion freezes background-position and hue at a deterministic frame; forced-colors removes both decorative layers and restores CanvasText on Canvas.",
  a11yEs: "La malla y la capa de contraste llevan aria-hidden detrás de una capa de contenido estable. La capa oscura garantiza que el color frontal provisto siga legible sin importar la posición del gradiente. prefers-reduced-motion congela posición y tono en un cuadro determinista; forced-colors elimina ambas capas decorativas y restaura CanvasText sobre Canvas.",
  sourcePath: "src/registry/ui/animated-gradient.tsx",
  Preview: AnimatedGradientPreview,
};
