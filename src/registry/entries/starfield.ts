import { StarfieldPreview } from "@/registry/previews/starfield-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "starfield",
  name: "Starfield",
  nameEs: "Campo de estrellas",
  category: "backgrounds",
  materials: ["adaptive"],
  description: "A deterministic multi-depth star field built from layered CSS radial gradients with slow drift and twinkle.",
  descriptionEs: "Un campo de estrellas determinista y multicapa creado con gradientes radiales CSS, deriva lenta y parpadeo.",
  variants: [
    { id: "deep", label: "Deep", labelEs: "Profundo" },
    { id: "dawn", label: "Dawn", labelEs: "Amanecer" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "Every star layer is deterministic, pointer-transparent, and aria-hidden, so SSR and hydration produce the same decoration without adding content noise. The foreground sits above a stable dark veil and keeps at least 4.5:1 contrast. Reduced motion freezes drift and twinkle; forced colors removes the star layers and preserves CanvasText and layout.",
  a11yEs: "Cada capa de estrellas es determinista, deja pasar el puntero y usa aria-hidden, así que SSR e hidratación producen la misma decoración. El frente queda sobre un velo oscuro con al menos 4,5:1. Movimiento reducido congela deriva y parpadeo; forced colors elimina las estrellas y preserva CanvasText y layout.",
  sourcePath: "src/registry/ui/starfield.tsx",
  Preview: StarfieldPreview,
};
