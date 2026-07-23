import { LightboxGalleryPreview } from "@/registry/previews/lightbox-gallery-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "lightbox-gallery",
  name: "Lightbox Gallery",
  nameEs: "Galería lightbox",
  category: "media",
  materials: ["adaptive"],
  description: "A responsive thumbnail gallery that opens a true modal lightbox with cyclic navigation, focus trapping and predictable dismissal.",
  descriptionEs: "Una galería responsiva de miniaturas que abre un lightbox modal real con navegación cíclica, foco atrapado y cierre predecible.",
  variants: [{ id: "grid", label: "Grid", labelEs: "Rejilla" }, { id: "filmstrip", label: "Filmstrip", labelEs: "Tira" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "Every thumbnail is a named native button. The native modal dialog is labelled, traps Tab and Shift+Tab, accepts Left/Right arrows and Escape, announces position politely, and returns focus to the exact opener. Full images require meaningful alt text; reduced motion removes dialog animation and forced colors restores system boundaries.",
  a11yEs: "Cada miniatura es un botón nativo con nombre. El diálogo modal nativo está etiquetado, atrapa Tab y Shift+Tab, acepta flechas izquierda/derecha y Escape, anuncia la posición y devuelve el foco al disparador exacto. Las imágenes requieren alt significativo; movimiento reducido elimina la animación y colores forzados recupera límites del sistema.",
  sourcePath: "src/registry/ui/lightbox-gallery.tsx",
  Preview: LightboxGalleryPreview,
};
