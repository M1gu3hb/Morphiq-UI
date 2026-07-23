import { BlobBackgroundPreview } from "@/registry/previews/blob-background-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "blob-background",
  name: "Blob Background",
  nameEs: "Fondo de blobs",
  category: "backgrounds",
  materials: ["adaptive"],
  description: "Three large blurred color blobs that drift and merge behind content, with bounded intensity and custom palette controls.",
  descriptionEs: "Tres blobs grandes y desenfocados que flotan y se funden detrás del contenido, con intensidad acotada y paleta configurable.",
  variants: [
    { id: "pastel", label: "Pastel", labelEs: "Pastel" },
    { id: "neon", label: "Neon", labelEs: "Neón" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The gooey blob field and scrim are aria-hidden and never intercept pointer input. Foreground content is structurally independent and protected by a dark scrim for at least 4.5:1 contrast. prefers-reduced-motion stops all three transforms at their initial composition; forced colors hides blur and translucency while preserving layout and CanvasText.",
  a11yEs: "El campo de blobs y la capa oscura son aria-hidden y nunca interceptan el puntero. El contenido frontal es independiente y queda protegido para al menos 4,5:1. prefers-reduced-motion detiene las tres transformaciones en su composición inicial; forced colors oculta desenfoque y translucidez preservando layout y CanvasText.",
  sourcePath: "src/registry/ui/blob-background.tsx",
  Preview: BlobBackgroundPreview,
};
