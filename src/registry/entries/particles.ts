import { ParticlesPreview } from "@/registry/previews/particles-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "particles",
  name: "Particles",
  nameEs: "Partículas",
  category: "backgrounds",
  materials: ["adaptive"],
  description: "A lightweight deterministic field of CSS dots that drift and fade behind content. Count is configurable but clamped to 4–40 nodes, and speed is adjustable without an animation library.",
  descriptionEs: "Un campo ligero y determinista de puntos CSS que derivan y se desvanecen detrás del contenido. La cantidad es configurable pero limitada a 4–40 nodos, y la velocidad se ajusta sin librería de animación.",
  variants: [{ id: "soft", label: "Soft", labelEs: "Suave" }, { id: "bright", label: "Bright", labelEs: "Brillante" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The entire particle field is aria-hidden and pointer-transparent; particle positions are deterministic across SSR and hydration. Content remains in an independent foreground layer. prefers-reduced-motion freezes the bounded dots at a quiet opacity; forced-colors removes them and restores CanvasText on Canvas.",
  a11yEs: "Todo el campo de partículas lleva aria-hidden y deja pasar el puntero; sus posiciones son deterministas entre SSR e hidratación. El contenido permanece en una capa frontal independiente. prefers-reduced-motion congela los puntos acotados con una opacidad suave; forced-colors los elimina y restaura CanvasText sobre Canvas.",
  sourcePath: "src/registry/ui/particles.tsx",
  Preview: ParticlesPreview,
};
