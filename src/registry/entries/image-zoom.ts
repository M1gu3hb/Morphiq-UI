import { ImageZoomPreview } from "@/registry/previews/image-zoom-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "image-zoom",
  name: "Image Zoom",
  nameEs: "Zoom de imagen",
  category: "media",
  materials: ["adaptive"],
  description: "A keyboard-operable image inspector with in-place zoom or a pointer-following magnifier, using the original image as its accessible content.",
  descriptionEs: "Un inspector de imagen operable con teclado, con zoom en sitio o lupa que sigue al puntero, usando la imagen original como contenido accesible.",
  variants: [{ id: "inline", label: "Inline", labelEs: "En sitio" }, { id: "lens", label: "Lens", labelEs: "Lupa" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "A native toggle button exposes aria-pressed and a changing Zoom/Reset name, so Enter and Space match pointer interaction. The real image carries meaningful alt text; the magnifier is decorative. Reduced motion removes scale transitions and the lens, while forced colors preserves focus and status copy.",
  a11yEs: "Un botón nativo expone aria-pressed y nombre Zoom/Restablecer, por lo que Enter y Espacio equivalen al puntero. La imagen real lleva alt significativo y la lupa es decorativa. Movimiento reducido elimina transición y lupa; colores forzados conserva foco y estado.",
  sourcePath: "src/registry/ui/image-zoom.tsx",
  Preview: ImageZoomPreview,
};
