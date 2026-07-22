import { OrbitingCirclesPreview } from "@/registry/previews/orbiting-circles-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Orbiting Circles. */
export const entry: RegistryEntry = {
  slug: "orbiting-circles",
  name: "Orbiting Circles",
  nameEs: "Círculos orbitales",
  category: "effects",
  materials: ["adaptive"],
  description:
    "A configurable ring that distributes children around a center and keeps them upright while radius, direction and speed animate.",
  descriptionEs:
    "Un anillo configurable que distribuye children alrededor de un centro y los mantiene verticales mientras radio, dirección y velocidad se animan.",
  variants: [
    { id: "clockwise", label: "Clockwise", labelEs: "Horario" },
    { id: "counterclockwise", label: "Counterclockwise", labelEs: "Antihorario" },
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
  a11y:
    "The orbit path is aria-hidden while each child remains exactly once in source order, so labels are available without visual duplication. Movement never changes focus order or meaning; continuously moving interactive controls are discouraged. A supplied center remains ordinary semantic content. prefers-reduced-motion disables the keyframe and uses each item's inline angle to distribute a stable ring instead of stacking the items. forced-colors also stops motion and restores Canvas surfaces with CanvasText boundaries. The owned foreground/surface pairs exceed 4.5:1.",
  a11yEs:
    "La trayectoria orbital es aria-hidden mientras cada child permanece exactamente una vez en el orden fuente, así que las etiquetas están disponibles sin duplicación visual. El movimiento nunca cambia el orden de foco ni el significado; se desaconsejan controles interactivos en movimiento continuo. El centro proporcionado permanece como contenido semántico normal. prefers-reduced-motion desactiva el keyframe y usa el ángulo inline de cada elemento para distribuir un anillo estable en vez de apilarlos. forced-colors también detiene el movimiento y restaura superficies Canvas con límites CanvasText. Los pares primer plano/superficie propios superan 4,5:1.",
  sourcePath: "src/registry/ui/orbiting-circles.tsx",
  Preview: OrbitingCirclesPreview,
};
