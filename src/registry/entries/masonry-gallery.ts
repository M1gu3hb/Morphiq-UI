import { MasonryGalleryPreview } from "@/registry/previews/masonry-gallery-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "masonry-gallery",
  name: "Masonry Gallery",
  nameEs: "Galería masonry",
  category: "media",
  materials: ["adaptive"],
  description: "A responsive CSS-column masonry gallery that preserves every image ratio and avoids layout jumps through explicit dimensions.",
  descriptionEs: "Una galería masonry responsiva con columnas CSS que conserva la proporción de cada imagen y evita saltos mediante dimensiones explícitas.",
  variants: [{ id: "balanced", label: "Balanced", labelEs: "Equilibrado" }, { id: "editorial", label: "Editorial", labelEs: "Editorial" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The gallery is a named section of semantic figures. Each image requires meaningful alt text, captions remain associated through figcaption, explicit width and height reserve layout space, and forced colors preserves figure boundaries and readable text.",
  a11yEs: "La galería es una sección nombrada de figuras semánticas. Cada imagen requiere alt significativo, los pies siguen asociados mediante figcaption, width y height reservan espacio y colores forzados conserva límites y texto legible.",
  sourcePath: "src/registry/ui/masonry-gallery.tsx",
  Preview: MasonryGalleryPreview,
};
