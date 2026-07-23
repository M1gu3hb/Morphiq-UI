import { BlogGridPreview } from "@/registry/previews/blog-grid-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "blog-grid",
  name: "Blog Grid",
  nameEs: "Rejilla de blog",
  category: "blocks",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description: "A responsive editorial grid with tactile article cards, stable images, categories, dates, reading time, and descriptive links.",
  descriptionEs: "Una rejilla editorial responsive con tarjetas táctiles, imágenes estables, categorías, fechas, tiempo de lectura y enlaces descriptivos.",
  variants: [
    { id: "editorial", label: "Editorial", labelEs: "Editorial" },
    { id: "compact", label: "Compact", labelEs: "Compacta" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "lucide-react", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "Each post is an article with an h3 and a descriptive native link. Images include meaningful alt text, intrinsic width and height, and a reserved aspect ratio to prevent layout shift. Dates use time with machine-readable dateTime, while reading duration stays visible text. Reduced motion removes image scale and card transitions, forced colors restores boundaries, and titles, metadata, and excerpts maintain at least 4.5:1 contrast on every material.",
  a11yEs: "Cada publicación es un article con h3 y enlace nativo descriptivo. Las imágenes incluyen alt significativo, ancho y alto intrínsecos y aspect ratio reservado para evitar layout shift. Las fechas usan time con dateTime legible por máquina y la duración queda visible. Movimiento reducido elimina escala y transiciones, forced colors restaura límites y títulos, metadatos y extractos mantienen al menos 4,5:1 en cada material.",
  sourcePath: "src/registry/ui/blog-grid.tsx",
  Preview: BlogGridPreview,
};
