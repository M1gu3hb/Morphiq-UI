import { SpotlightPreview } from "@/registry/previews/spotlight-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "spotlight", name: "Spotlight", nameEs: "Reflector", category: "effects", materials: ["adaptive"],
  description: "A focused radial highlight inside a panel that follows local pointer coordinates, revealing a brighter zone without becoming an ambient outer glow.",
  descriptionEs: "Un realce radial enfocado dentro de un panel que sigue coordenadas locales del puntero y revela una zona más brillante sin convertirse en resplandor ambiental exterior.",
  variants: [{ id: "cool", label: "Cool", labelEs: "Frío" }, { id: "warm", label: "Warm", labelEs: "Cálido" }],
  sizes: [{ id: "sm", label: "Small", labelEs: "Pequeño" }, { id: "md", label: "Medium", labelEs: "Mediano" }, { id: "lg", label: "Large", labelEs: "Grande" }],
  dependencies: { npm: ["class-variance-authority", "clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The spotlight is aria-hidden and pointer-transparent inside the opaque panel; it never supplies meaning, focus or contrast. Pointer events still reach descendants and coordinates reset to centre on leave. Reduced motion prevents tracking and keeps the focused light centred; forced colors removes it and preserves CanvasText, native child interaction and the focus-within outline.",
  a11yEs: "El reflector lleva aria-hidden y deja pasar el puntero dentro del panel opaco; nunca aporta significado, foco ni contraste. Los eventos llegan a los descendientes y las coordenadas vuelven al centro al salir. Movimiento reducido impide seguimiento y centra la luz; forced-colors la elimina y conserva CanvasText, interacción nativa y contorno focus-within.",
  sourcePath: "src/registry/ui/spotlight.tsx", Preview: SpotlightPreview,
};
