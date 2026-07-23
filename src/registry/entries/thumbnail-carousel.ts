import { ThumbnailCarouselPreview } from "@/registry/previews/thumbnail-carousel-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "thumbnail-carousel",
  name: "Thumbnail Carousel",
  nameEs: "Carrusel de miniaturas",
  category: "media",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description: "A tactile main-image viewer with bottom or side thumbnails, arrow-key selection and four self-contained material surfaces.",
  descriptionEs: "Un visor táctil de imagen principal con miniaturas abajo o al lado, selección por flechas y cuatro superficies autocontenidas.",
  variants: [{ id: "bottom", label: "Bottom", labelEs: "Inferior" }, { id: "side", label: "Side", labelEs: "Lateral" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The main image requires meaningful alt text. The thumbnail listbox uses named native buttons, aria-current, arrow-key roving focus and a polite position announcement. Reduced motion removes thumbnail scaling; forced colors restores button, focus and surface boundaries. All material text pairs exceed 4.5:1.",
  a11yEs: "La imagen principal requiere alt significativo. La lista de miniaturas usa botones nativos nombrados, aria-current, foco móvil con flechas y anuncio de posición. Movimiento reducido elimina escalado; colores forzados restaura botones, foco y límites. Todo texto material supera 4,5:1.",
  sourcePath: "src/registry/ui/thumbnail-carousel.tsx",
  Preview: ThumbnailCarouselPreview,
};
