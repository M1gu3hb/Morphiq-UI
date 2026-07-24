import { FireworksPreview } from "@/registry/previews/fireworks-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "fireworks",
  name: "Fireworks",
  nameEs: "Fuegos Artificiales",
  category: "effects",
  materials: ["adaptive"],
  description: "Three bounded CSS particle bursts repeat around readable content with configurable density and duration.",
  descriptionEs: "Tres ráfagas acotadas de partículas CSS se repiten alrededor de contenido legible con densidad y duración configurables.",
  variants: [
    { id: "festival", label: "Festival", labelEs: "Festival" },
    { id: "sunset", label: "Sunset", labelEs: "Atardecer" },
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
  a11y: "Every particle is inside an aria-hidden, pointer-transparent layer; visible copy carries the meaning instead of the animation. Reduced motion and forced colors remove all bursts while keeping the content surface and focus behavior intact.",
  a11yEs: "Cada partícula está dentro de una capa aria-hidden que deja pasar el puntero; el texto visible comunica el significado en lugar de la animación. Movimiento reducido y colores forzados eliminan las ráfagas y mantienen superficie y foco.",
  sourcePath: "src/registry/ui/fireworks.tsx",
  Preview: FireworksPreview,
};
