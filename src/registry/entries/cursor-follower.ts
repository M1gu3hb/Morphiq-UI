import { CursorFollowerPreview } from "@/registry/previews/cursor-follower-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "cursor-follower",
  name: "Cursor Follower",
  nameEs: "Seguidor de Cursor",
  category: "effects",
  materials: ["adaptive"],
  description: "A point and delayed ring accompany a fine pointer inside a bounded surface without replacing the native cursor.",
  descriptionEs: "Un punto y un anillo con retraso acompañan al puntero fino dentro de una superficie acotada sin reemplazar el cursor nativo.",
  variants: [
    { id: "ring", label: "Ring", labelEs: "Anillo" },
    { id: "crosshair", label: "Crosshair", labelEs: "Retícula" },
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
  a11y: "Follower marks are aria-hidden and pointer-transparent, and the native cursor remains visible. The wrapper never adds focus or changes descendants; coarse pointers, reduced motion and forced colors disable the marks while keyboard interaction is unaffected.",
  a11yEs: "Las marcas seguidoras llevan aria-hidden y dejan pasar el puntero, y el cursor nativo sigue visible. El contenedor no añade foco ni cambia descendientes; punteros gruesos, movimiento reducido y colores forzados desactivan las marcas sin afectar el teclado.",
  sourcePath: "src/registry/ui/cursor-follower.tsx",
  Preview: CursorFollowerPreview,
};
