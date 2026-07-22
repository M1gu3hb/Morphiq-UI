import { BorderBeamPreview } from "@/registry/previews/border-beam-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Border Beam. */
export const entry: RegistryEntry = {
  slug: "border-beam",
  name: "Border Beam",
  nameEs: "Haz de borde",
  category: "effects",
  materials: ["adaptive"],
  description:
    "A configurable light packet that follows an offset path around a masked container border while content stays on an opaque layer.",
  descriptionEs:
    "Un paquete de luz configurable que recorre un offset-path alrededor del borde enmascarado de un contenedor mientras el contenido permanece sobre una capa opaca.",
  variants: [
    { id: "forward", label: "Forward", labelEs: "Adelante" },
    { id: "reverse", label: "Reverse", labelEs: "Reversa" },
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
    "The beam and its border mask are pointer-ignoring and aria-hidden. Children remain in normal source order on an opaque z-indexed content layer, so the light cannot change reading, focus, activation or contrast. The wrapper adds no interactive semantics. prefers-reduced-motion freezes offset-distance at the start of the path; forced-colors removes the beam and restores a Canvas surface with a CanvasText boundary. The owned foreground/surface pair exceeds 4.5:1 and callers remain responsible for custom children.",
  a11yEs:
    "El haz y su máscara de borde ignoran el puntero y son aria-hidden. Los children permanecen en el orden fuente normal sobre una capa opaca con z-index, así que la luz no puede cambiar lectura, foco, activación ni contraste. El wrapper no añade semántica interactiva. prefers-reduced-motion congela offset-distance al inicio de la ruta; forced-colors elimina el haz y restaura una superficie Canvas con límite CanvasText. El par primer plano/superficie propio supera 4,5:1 y quien integra sigue siendo responsable de sus children personalizados.",
  sourcePath: "src/registry/ui/border-beam.tsx",
  Preview: BorderBeamPreview,
};
