import { AvatarCirclesPreview } from "@/registry/previews/avatar-circles-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Avatar Circles. */
export const entry: RegistryEntry = {
  slug: "avatar-circles",
  name: "Avatar Circles",
  nameEs: "Círculos de avatares",
  category: "media",
  materials: ["adaptive"],
  description:
    "An overlapping, size-aware avatar list with resilient initials fallbacks and an accessible overflow count for larger groups.",
  descriptionEs:
    "Una lista solapada de avatares adaptable por tamaño, con iniciales de respaldo y contador accesible para grupos más grandes.",
  variants: [
    { id: "stacked", label: "Stacked", labelEs: "Apilados" },
    { id: "roomy", label: "Roomy", labelEs: "Espaciados" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeños" },
    { id: "md", label: "Medium", labelEs: "Medianos" },
    { id: "lg", label: "Large", labelEs: "Grandes" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "The component is a named semantic list. Every image requires alt text; missing or failed sources become an initials fallback with role=img and the full name as its accessible label. The visible +N glyph is aria-hidden while its list item announces the exact number of additional people, so meaning never depends on the visual shorthand. prefers-reduced-motion removes hover lift, and forced-colors restores Canvas, CanvasText and explicit circular boundaries. Fallback text reaches 13.9:1 against its owned surface.",
  a11yEs:
    "El componente es una lista semántica nombrada. Cada imagen requiere alt; una fuente ausente o fallida se convierte en iniciales con role=img y el nombre completo como etiqueta accesible. El glifo visible +N lleva aria-hidden mientras su elemento anuncia la cantidad exacta de personas adicionales, así que el significado no depende de la abreviatura visual. prefers-reduced-motion elimina la elevación y forced-colors recupera Canvas, CanvasText y límites circulares. El texto de respaldo alcanza 13,9:1 sobre su superficie.",
  sourcePath: "src/registry/ui/avatar-circles.tsx",
  Preview: AvatarCirclesPreview,
};
