import { FeatureGridPreview } from "@/registry/previews/feature-grid-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "feature-grid",
  name: "Feature Grid",
  nameEs: "Rejilla de funciones",
  category: "blocks",
  materials: ["adaptive"],
  description: "A responsive one-to-three-column feature grid with equal or bento rhythm, replaceable Lucide icon slots and tactile self-contained cards.",
  descriptionEs: "Una rejilla responsive de una a tres columnas con ritmo uniforme o bento, espacios de íconos Lucide reemplazables y tarjetas táctiles autocontenidas.",
  variants: [
    { id: "bento", label: "Bento", labelEs: "Bento" },
    { id: "equal", label: "Equal", labelEs: "Uniforme" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "lucide-react", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The section owns an ordered heading hierarchy followed by a real unordered list; each card uses a heading and paragraph rather than invented interactive semantics. Icons are decorative and aria-hidden because the adjacent title states the feature. The source stays in reading order when the bento spans change at breakpoints. Hover only reinforces a visible boundary, reduced motion removes its transition, forced colors restores CanvasText borders, and primary and muted copy exceed 4.5:1 in both adaptive schemes.",
  a11yEs: "La sección conserva jerarquía ordenada de encabezados seguida de una lista no ordenada real; cada tarjeta usa titular y párrafo sin inventar semántica interactiva. Los íconos son decorativos y usan aria-hidden porque el título adyacente nombra la función. El código fuente mantiene el orden de lectura cuando los spans bento cambian en breakpoints. Hover solo refuerza un límite visible, movimiento reducido elimina su transición, forced colors restaura bordes CanvasText y el texto principal y atenuado supera 4,5:1 en ambos esquemas adaptive.",
  sourcePath: "src/registry/ui/feature-grid.tsx",
  Preview: FeatureGridPreview,
};
