import { RollingTextPreview } from "@/registry/previews/rolling-text-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "rolling-text",
  name: "Rolling Text",
  nameEs: "Texto rodante",
  category: "text",
  materials: ["adaptive"],
  description: "Split-flap-inspired glyphs roll vertically together or in sequence on hover and intentional focus.",
  descriptionEs: "Glifos inspirados en tableros split-flap ruedan verticalmente juntos o en secuencia con hover y foco intencional.",
  variants: [
    { id: "together", label: "Together", labelEs: "Al unísono" },
    { id: "staggered", label: "Staggered", labelEs: "Escalonado" },
  ],
  sizes: [{ id: "inherit", label: "Inherit", labelEs: "Heredado" }],
  dependencies: { npm: ["clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "One whole aria-label names the component and the duplicated rolling glyphs are aria-hidden. Fixed one-em cells reserve the final word and avoid CLS. The real transform property is explicitly covered by transition-[transform]; reduced motion and forced colors lock the first readable face in place. No decorative tab stop is added by default.",
  a11yEs: "Un aria-label completo nombra el componente y los glifos rodantes duplicados usan aria-hidden. Celdas fijas de un em reservan la palabra final y evitan CLS. La propiedad transform real está cubierta explícitamente por transition-[transform]; movimiento reducido y forced colors fijan la primera cara legible. No se agrega una parada decorativa por defecto.",
  sourcePath: "src/registry/ui/rolling-text.tsx",
  Preview: RollingTextPreview,
};
