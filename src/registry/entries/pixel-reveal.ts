import { PixelRevealPreview } from "@/registry/previews/pixel-reveal-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "pixel-reveal",
  name: "Pixel Reveal",
  nameEs: "Revelado de Píxeles",
  category: "effects",
  materials: ["adaptive"],
  description: "A bounded pixel grid dissolves to reveal an accessible, space-reserved image without touching its semantics.",
  descriptionEs: "Una cuadrícula acotada de píxeles se disuelve para revelar una imagen accesible con espacio reservado sin alterar su semántica.",
  variants: [
    { id: "mosaic", label: "Mosaic", labelEs: "Mosaico" },
    { id: "luminous", label: "Luminous", labelEs: "Luminoso" },
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
  a11y: "The real image owns meaningful alt text and fixed dimensions from the first render. Pixel cells live in an aria-hidden, pointer-transparent overlay; reduced motion and forced colors remove that overlay immediately while the image and optional caption remain.",
  a11yEs: "La imagen real conserva texto alt significativo y dimensiones fijas desde el primer render. Las celdas viven en una capa aria-hidden que deja pasar el puntero; movimiento reducido y colores forzados eliminan esa capa de inmediato y mantienen imagen y leyenda.",
  sourcePath: "src/registry/ui/pixel-reveal.tsx",
  Preview: PixelRevealPreview,
};
