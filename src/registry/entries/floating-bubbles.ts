import { FloatingBubblesPreview } from "@/registry/previews/floating-bubbles-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "floating-bubbles",
  name: "Floating Bubbles",
  nameEs: "Burbujas flotantes",
  category: "backgrounds",
  materials: ["adaptive"],
  description: "A bounded deterministic set of translucent bubbles rising at varied sizes, delays, drift, and speed.",
  descriptionEs: "Un conjunto determinista y acotado de burbujas translúcidas que ascienden con tamaños, retrasos, deriva y velocidad variados.",
  variants: [
    { id: "soft", label: "Soft", labelEs: "Suave" },
    { id: "iridescent", label: "Iridescent", labelEs: "Iridiscente" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The decorative bubble field is aria-hidden, pointer-transparent, deterministic, and clamped to 4–18 nodes. Foreground content remains separate behind a contrast veil. prefers-reduced-motion stops every rise at a quiet static opacity; forced colors removes the bubbles and restores CanvasText without changing the component's dimensions.",
  a11yEs: "El campo decorativo usa aria-hidden, deja pasar el puntero, es determinista y se limita a 4–18 nodos. El contenido queda separado tras un velo de contraste. prefers-reduced-motion detiene el ascenso con opacidad estática y forced colors elimina las burbujas sin cambiar dimensiones.",
  sourcePath: "src/registry/ui/floating-bubbles.tsx",
  Preview: FloatingBubblesPreview,
};
