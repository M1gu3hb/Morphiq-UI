import { CircularTextPreview } from "@/registry/previews/circular-text-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "circular-text",
  name: "Circular Text",
  nameEs: "Texto circular",
  category: "text",
  materials: ["adaptive"],
  description: "A complete phrase arranged around a configurable circle and rotated clockwise or counterclockwise with CSS.",
  descriptionEs: "Una frase completa dispuesta alrededor de un círculo configurable y girada con CSS en sentido horario o antihorario.",
  variants: [
    { id: "clockwise", label: "Clockwise", labelEs: "Horario" },
    { id: "counterclockwise", label: "Counterclockwise", labelEs: "Antihorario" },
  ],
  sizes: [{ id: "inherit", label: "Inherit", labelEs: "Heredado" }],
  dependencies: { npm: ["clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The root exposes the unsplit phrase through aria-label and the circular glyph construction is aria-hidden. An explicit width and height reserve the final diameter, preventing layout shift. prefers-reduced-motion freezes the ring without hiding text; forced-colors also stops rotation and preserves CanvasText.",
  a11yEs: "La raíz expone la frase sin dividir mediante aria-label y la construcción circular de glifos usa aria-hidden. Un ancho y alto explícitos reservan el diámetro final y evitan desplazamiento de layout. prefers-reduced-motion congela el anillo sin ocultar texto; forced-colors también detiene el giro y conserva CanvasText.",
  sourcePath: "src/registry/ui/circular-text.tsx",
  Preview: CircularTextPreview,
};
