import { MagnetLinesPreview } from "@/registry/previews/magnet-lines-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "magnet-lines",
  name: "Magnet Lines",
  nameEs: "Líneas Magnéticas",
  category: "effects",
  materials: ["adaptive"],
  description: "A bounded line grid rotates each decorative needle toward a fine pointer with direct CSS rotate transitions.",
  descriptionEs: "Una rejilla acotada rota cada aguja decorativa hacia un puntero fino mediante transiciones directas de rotate en CSS.",
  variants: [
    { id: "field", label: "Field", labelEs: "Campo" },
    { id: "compass", label: "Compass", labelEs: "Brújula" },
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
  a11y: "The line field is aria-hidden and pointer-transparent, never replaces the native cursor and adds no focus stop. Coarse pointers keep the static field; reduced motion resets rotation and forced colors uses CanvasText while all wrapped content remains interactive.",
  a11yEs: "El campo de líneas lleva aria-hidden, deja pasar el puntero, nunca reemplaza el cursor nativo ni añade foco. Punteros gruesos conservan el campo estático; movimiento reducido reinicia la rotación y colores forzados usan CanvasText mientras el contenido sigue interactivo.",
  sourcePath: "src/registry/ui/magnet-lines.tsx",
  Preview: MagnetLinesPreview,
};
