import { RippleEffectPreview } from "@/registry/previews/ripple-effect-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "ripple-effect", name: "Ripple Effect", nameEs: "Efecto de Onda", category: "effects", materials: ["adaptive"],
  description: "A pointer-origin ripple for any content surface, with bounded concurrent waves and a trigger prop for centred programmatic replay.",
  descriptionEs: "Una onda desde el punto del puntero para cualquier superficie, con ondas concurrentes acotadas y prop trigger para repetirla programáticamente desde el centro.",
  variants: [{ id: "soft", label: "Soft", labelEs: "Suave" }, { id: "vivid", label: "Vivid", labelEs: "Vívida" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "Ripples are aria-hidden, pointer-transparent and capped at six concurrent nodes; wrapper pointer handling preserves child events and adds no role or tab stop. Native descendants keep keyboard behavior and a focus-within outline. The trigger prop offers programmatic replay. Reduced motion swaps expansion for a 160ms local highlight; forced colors suppresses creation and restores CanvasText on Canvas.",
  a11yEs: "Las ondas llevan aria-hidden, dejan pasar el puntero y se limitan a seis nodos concurrentes; el wrapper conserva eventos hijos y no añade rol ni parada de tabulación. Los descendientes nativos mantienen teclado y contorno focus-within. La prop trigger permite repetición programática. Movimiento reducido cambia la expansión por un realce local de 160 ms; forced-colors suprime la creación y restaura CanvasText sobre Canvas.",
  sourcePath: "src/registry/ui/ripple-effect.tsx", Preview: RippleEffectPreview,
};
