import { InteractiveGridPreview } from "@/registry/previews/interactive-grid-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "interactive-grid",
  name: "Interactive Grid",
  nameEs: "Rejilla Interactiva",
  category: "backgrounds",
  materials: ["adaptive"],
  description: "A two-layer CSS grid whose brighter cells are revealed by a radial mask following pointer coordinates stored in local custom properties; no per-cell DOM or animation library.",
  descriptionEs: "Una rejilla CSS de dos capas cuyas celdas más brillantes se revelan con una máscara radial que sigue coordenadas del puntero guardadas en propiedades locales; sin DOM por celda ni librería de animación.",
  variants: [{ id: "cool", label: "Cool", labelEs: "Fría" }, { id: "warm", label: "Warm", labelEs: "Cálida" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "Both grid layers are aria-hidden and pointer-transparent, so pointer tracking never blocks children or changes keyboard behavior. Without a pointer the highlight starts centered. prefers-reduced-motion replaces the tracking layer with a fixed centred glow; forced-colors removes every grid layer and restores CanvasText on Canvas.",
  a11yEs: "Ambas capas de rejilla llevan aria-hidden y dejan pasar el puntero, así que el seguimiento nunca bloquea hijos ni cambia el teclado. Sin puntero el realce inicia centrado. prefers-reduced-motion reemplaza la capa móvil por un brillo fijo centrado; forced-colors elimina todas las capas y restaura CanvasText sobre Canvas.",
  sourcePath: "src/registry/ui/interactive-grid.tsx",
  Preview: InteractiveGridPreview,
};
