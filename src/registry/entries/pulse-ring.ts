import { PulseRingPreview } from "@/registry/previews/pulse-ring-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "pulse-ring", name: "Pulse Ring", nameEs: "Anillo Pulsante", category: "effects", materials: ["adaptive"],
  description: "Three staggered rings pulse around a focal element for live or recording status, always paired with a visible textual status label.",
  descriptionEs: "Tres anillos escalonados laten alrededor de un elemento focal para estado en vivo o grabando, siempre acompañados por una etiqueta textual visible.",
  variants: [{ id: "live", label: "Live", labelEs: "En vivo" }, { id: "recording", label: "Recording", labelEs: "Grabando" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The wrapper is a status region with a visible statusLabel, so meaning never depends on pulse or colour. All three rings are aria-hidden and pointer-transparent; focal children retain their semantics. Reduced motion stops expansion and leaves a quiet static ring. Forced colors keeps a CanvasText boundary, the textual label and the same reading order.",
  a11yEs: "El wrapper es una región de estado con statusLabel visible, así que el significado nunca depende del pulso o color. Los tres anillos llevan aria-hidden y dejan pasar el puntero; los hijos conservan semántica. Movimiento reducido detiene la expansión y deja un anillo estático. Forced-colors mantiene borde CanvasText, etiqueta textual y orden de lectura.",
  sourcePath: "src/registry/ui/pulse-ring.tsx", Preview: PulseRingPreview,
};
