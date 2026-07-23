import { ParallaxImagePreview } from "@/registry/previews/parallax-image-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "parallax-image",
  name: "Parallax Image",
  nameEs: "Imagen parallax",
  category: "media",
  materials: ["adaptive"],
  description: "A responsive image frame that derives a subtle bounded vertical offset from scroll without rerendering React.",
  descriptionEs: "Un marco de imagen responsivo que deriva un desplazamiento vertical sutil y acotado del scroll sin rerenderizar React.",
  variants: [{ id: "subtle", label: "Subtle", labelEs: "Sutil" }, { id: "deep", label: "Deep", labelEs: "Profundo" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The real image keeps meaningful alt text and an optional semantic figcaption. Scroll work is batched in requestAnimationFrame and capped; prefers-reduced-motion skips listeners and fixes the image at zero offset. Forced colors keeps the frame and caption legible.",
  a11yEs: "La imagen real conserva alt significativo y figcaption opcional. El trabajo de scroll se agrupa en requestAnimationFrame y se acota; prefers-reduced-motion omite listeners y fija desplazamiento cero. Colores forzados mantiene marco y pie legibles.",
  sourcePath: "src/registry/ui/parallax-image.tsx",
  Preview: ParallaxImagePreview,
};
