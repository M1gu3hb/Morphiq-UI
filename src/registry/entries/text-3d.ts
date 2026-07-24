import { Text3DPreview } from "@/registry/previews/text-3d-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "text-3d",
  name: "Text 3D",
  nameEs: "Texto 3D",
  category: "text",
  materials: ["adaptive"],
  description: "Layered text-shadow extrusion with slab or chromatic depth and a small perspective shift on hover.",
  descriptionEs: "Extrusión por capas de text-shadow con profundidad sólida o cromática y un pequeño cambio de perspectiva al pasar el cursor.",
  variants: [
    { id: "slab", label: "Slab", labelEs: "Sólido" },
    { id: "chromatic", label: "Chromatic", labelEs: "Cromático" },
  ],
  sizes: [{ id: "inherit", label: "Inherit", labelEs: "Heredado" }],
  dependencies: { npm: ["clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The actual text node remains readable and accessible; extrusion is a paint-only text shadow and does not affect layout or reading order. Hover changes the standard transform property and transition-[transform] covers it. Reduced motion removes perspective movement, while forced-colors removes both transform and shadow and retains CanvasText.",
  a11yEs: "El nodo de texto real permanece legible y accesible; la extrusión es una sombra pintada que no afecta layout ni orden de lectura. Hover cambia la propiedad transform estándar y transition-[transform] la cubre. Movimiento reducido elimina el cambio de perspectiva, mientras forced-colors elimina transformación y sombra y conserva CanvasText.",
  sourcePath: "src/registry/ui/text-3d.tsx",
  Preview: Text3DPreview,
};
