import { ShineBorderPreview } from "@/registry/previews/shine-border-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Shine Border. */
export const entry: RegistryEntry = {
  slug: "shine-border",
  name: "Shine Border",
  nameEs: "Borde brillante",
  category: "effects",
  materials: ["adaptive"],
  description:
    "A continuously rotating conic gradient masked to a configurable border while children stay on an opaque content surface.",
  descriptionEs:
    "Un degradado cónico en rotación continua enmascarado a un borde configurable mientras los children permanecen sobre una superficie opaca.",
  variants: [{ id: "spectrum", label: "Spectrum", labelEs: "Espectro" }],
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
    "The conic ring is pointer-ignoring and aria-hidden. Children stay in normal order on an opaque layer above the mask, so the shine never supplies meaning, focus or text contrast. The wrapper has no invented control semantics. prefers-reduced-motion freezes the registered angle property into one static frame; forced-colors removes the gradient and restores a Canvas surface with a CanvasText border. The owned foreground/surface pair exceeds 4.5:1 and custom content remains the caller's responsibility.",
  a11yEs:
    "El anillo cónico ignora el puntero y es aria-hidden. Los children permanecen en orden normal sobre una capa opaca encima de la máscara, así que el brillo nunca aporta significado, foco ni contraste textual. El wrapper no inventa semántica de control. prefers-reduced-motion congela la propiedad de ángulo registrada en un cuadro estático; forced-colors elimina el degradado y restaura una superficie Canvas con borde CanvasText. El par primer plano/superficie propio supera 4,5:1 y el contenido personalizado sigue siendo responsabilidad de quien integra.",
  sourcePath: "src/registry/ui/shine-border.tsx",
  Preview: ShineBorderPreview,
};
