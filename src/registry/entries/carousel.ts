import { CarouselPreview } from "@/registry/previews/carousel-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Carousel. */
export const entry: RegistryEntry = {
  slug: "carousel",
  name: "Carousel",
  nameEs: "Carrusel",
  category: "media",
  materials: ["clay", "glass", "skeuo", "adaptive"],
  description:
    "A tactile image carousel with named controls, position dots, optional paused autoplay, arrow-key navigation and pointer swipe gestures.",
  descriptionEs:
    "Un carrusel táctil de imágenes con controles nombrados, puntos de posición, reproducción opcional con pausa, flechas de teclado y gestos de deslizamiento.",
  variants: [
    { id: "slide", label: "Slide", labelEs: "Deslizamiento" },
    { id: "fade", label: "Fade", labelEs: "Fundido" },
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
  a11y:
    "The section is named and exposes aria-roledescription=carousel. Native previous/next and dot buttons have accessible names, the root accepts Left/Right arrows, and the current position is announced politely when autoplay is off. Inactive slides are aria-hidden and inert. Autoplay pauses on hover and whenever focus is inside, and every transition is removed by prefers-reduced-motion. Images require meaningful alt text; forced-colors restores system surfaces, boundaries and focus outlines. Owned captions remain at least 12.5:1 against their dark scrim, while material foregrounds stay above 4.5:1.",
  a11yEs:
    "La sección tiene nombre y expone aria-roledescription=carousel. Los botones nativos anterior/siguiente y los puntos tienen nombres accesibles, la raíz acepta flechas izquierda/derecha y la posición actual se anuncia cortésmente cuando no hay autoplay. Las diapositivas inactivas llevan aria-hidden e inert. El autoplay se pausa al pasar el cursor y mientras el foco está dentro, y prefers-reduced-motion elimina cada transición. Las imágenes requieren alt significativo; forced-colors recupera superficies, límites y foco del sistema. Los pies propios mantienen al menos 12,5:1 sobre su velo oscuro y los textos de material superan 4,5:1.",
  sourcePath: "src/registry/ui/carousel.tsx",
  Preview: CarouselPreview,
};
