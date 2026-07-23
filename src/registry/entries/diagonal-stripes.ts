import { DiagonalStripesPreview } from "@/registry/previews/diagonal-stripes-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "diagonal-stripes",
  name: "Diagonal Stripes",
  nameEs: "Franjas diagonales",
  category: "backgrounds",
  materials: ["adaptive"],
  description: "A configurable barber-pole background made from one repeating linear gradient with controlled tile size, speed, and intensity.",
  descriptionEs: "Un fondo tipo barber-pole hecho con un gradiente lineal repetido y tamaño, velocidad e intensidad controlables.",
  variants: [
    { id: "subtle", label: "Subtle", labelEs: "Sutil" },
    { id: "bold", label: "Bold", labelEs: "Intensa" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The repeating stripe layer and scrim are aria-hidden and pointer-transparent, with no DOM node per stripe. Foreground content keeps at least 4.5:1 contrast through a stable dark veil. Reduced motion stops background-position at the first tile; forced colors hides the pattern and restores CanvasText without changing dimensions.",
  a11yEs: "La capa repetida y el velo son aria-hidden y dejan pasar el puntero, sin un nodo por franja. El contenido mantiene al menos 4,5:1 mediante un velo oscuro. Movimiento reducido detiene background-position y forced colors oculta el patrón sin cambiar dimensiones.",
  sourcePath: "src/registry/ui/diagonal-stripes.tsx",
  Preview: DiagonalStripesPreview,
};
