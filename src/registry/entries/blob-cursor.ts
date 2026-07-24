import { BlobCursorPreview } from "@/registry/previews/blob-cursor-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "blob-cursor",
  name: "Blob Cursor",
  nameEs: "Cursor de Gota",
  category: "effects",
  materials: ["adaptive"],
  description: "A bounded SVG-goo blob follows a fine pointer with a lightweight requestAnimationFrame spring.",
  descriptionEs: "Una gota acotada con filtro SVG sigue un puntero fino mediante un resorte ligero con requestAnimationFrame.",
  variants: [
    { id: "aqua", label: "Aqua", labelEs: "Aqua" },
    { id: "plasma", label: "Plasma", labelEs: "Plasma" },
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
  a11y: "The SVG filter and blob are aria-hidden and pointer-transparent, and the native cursor is never hidden. Coarse pointers, reduced motion and forced colors remove the blob; wrapped links and controls retain native keyboard focus and activation.",
  a11yEs: "El filtro SVG y la gota llevan aria-hidden y dejan pasar el puntero; el cursor nativo nunca se oculta. Punteros gruesos, movimiento reducido y colores forzados eliminan la gota; enlaces y controles conservan foco y activación nativos.",
  sourcePath: "src/registry/ui/blob-cursor.tsx",
  Preview: BlobCursorPreview,
};
