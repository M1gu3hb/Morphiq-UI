import { FlickeringGridPreview } from "@/registry/previews/flickering-grid-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "flickering-grid",
  name: "Flickering Grid",
  nameEs: "Rejilla Centelleante",
  category: "backgrounds",
  materials: ["adaptive"],
  description: "A deterministic CSS grid whose bounded set of cells flickers through staggered delays, with sparse and dense recipes and no random hydration or unbounded particle cost.",
  descriptionEs: "Una rejilla CSS determinista cuyo conjunto acotado de celdas parpadea con retrasos escalonados, con recetas dispersa y densa, sin hidratación aleatoria ni costo de partículas sin límite.",
  variants: [{ id: "subtle", label: "Subtle", labelEs: "Sutil" }, { id: "dense", label: "Dense", labelEs: "Densa" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "Every cell belongs to one aria-hidden decorative layer; children and focusable controls remain above it. Cell timing is deterministic and never announced. prefers-reduced-motion removes all flicker and leaves a fixed low-opacity matrix; forced-colors removes the matrix and uses CanvasText on Canvas.",
  a11yEs: "Cada celda pertenece a una capa decorativa con aria-hidden; los hijos y controles enfocables permanecen encima. El tiempo de las celdas es determinista y nunca se anuncia. prefers-reduced-motion elimina todo parpadeo y deja una matriz fija de baja opacidad; forced-colors elimina la matriz y usa CanvasText sobre Canvas.",
  sourcePath: "src/registry/ui/flickering-grid.tsx",
  Preview: FlickeringGridPreview,
};
