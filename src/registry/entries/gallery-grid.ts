import { GalleryGridPreview } from "@/registry/previews/gallery-grid-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "gallery-grid",
  name: "Gallery Grid",
  nameEs: "Rejilla de galería",
  category: "media",
  materials: ["adaptive"],
  description: "A responsive semantic image grid with optional captions, stable aspect ratios and card or edge-to-edge presentation.",
  descriptionEs: "Una rejilla semántica y responsiva de imágenes con pies opcionales, proporciones estables y presentación en cards o al borde.",
  variants: [{ id: "cards", label: "Cards", labelEs: "Tarjetas" }, { id: "edge", label: "Edge", labelEs: "Al borde" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "A named section contains real figure and figcaption pairs. Every image requires meaningful alt text and explicit dimensions, captions remain separate from alt, and forced colors restores card boundaries and readable copy. The static layout introduces no motion.",
  a11yEs: "Una sección nombrada contiene pares reales figure/figcaption. Cada imagen requiere alt significativo y dimensiones explícitas, los pies se mantienen separados del alt y colores forzados restaura límites y texto. El layout estático no introduce movimiento.",
  sourcePath: "src/registry/ui/gallery-grid.tsx",
  Preview: GalleryGridPreview,
};
