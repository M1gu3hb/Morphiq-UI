import { ImageTrailPreview } from "@/registry/previews/image-trail-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "image-trail",
  name: "Image Trail",
  nameEs: "Rastro de Imágenes",
  category: "effects",
  materials: ["adaptive"],
  description: "A bounded stream of decorative images follows a fine pointer while the wrapped content stays interactive.",
  descriptionEs: "Un flujo acotado de imágenes decorativas sigue un puntero fino mientras el contenido envuelto conserva su interacción.",
  variants: [
    { id: "tiles", label: "Tiles", labelEs: "Mosaicos" },
    { id: "glow", label: "Glow", labelEs: "Brillo" },
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
  a11y: "Trail images use empty alt text inside an aria-hidden, pointer-transparent layer. The native cursor remains visible, the wrapper adds no focus stop, and coarse pointers, reduced motion and forced colors disable the effect without hiding content.",
  a11yEs: "Las imágenes del rastro usan alt vacío dentro de una capa aria-hidden que deja pasar el puntero. El cursor nativo sigue visible, el contenedor no añade foco y punteros gruesos, movimiento reducido y colores forzados desactivan el efecto sin ocultar contenido.",
  sourcePath: "src/registry/ui/image-trail.tsx",
  Preview: ImageTrailPreview,
};
