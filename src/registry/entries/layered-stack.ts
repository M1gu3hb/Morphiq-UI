import { LayeredStackPreview } from "@/registry/previews/layered-stack-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Layered Stack. */
export const entry: RegistryEntry = {
  slug: "layered-stack",
  name: "Layered Stack",
  nameEs: "Pila por capas",
  category: "media",
  materials: ["adaptive"],
  description:
    "A spring-driven card pile that accepts a horizontal swipe or an explicit button before revealing the next named layer.",
  descriptionEs:
    "Una pila de tarjetas con resorte que acepta un swipe horizontal o un botón explícito antes de revelar la siguiente capa nombrada.",
  variants: [
    { id: "swipe", label: "Swipe", labelEs: "Deslizar" },
    { id: "button", label: "Button only", labelEs: "Solo botón" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["motion", "class-variance-authority", "clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "The current card is a semantic article with a heading and description, while decorative cards beneath are aria-hidden and inert. Every swipe action has an equivalent native button with a specific accessible name, and a polite live region announces the new card and position. prefers-reduced-motion disables drag listening and replaces spring/exit motion with immediate updates. forced-colors removes shadows and restores system boundaries, surfaces and focus. Owned primary and secondary text exceed 11.5:1 against the card.",
  a11yEs:
    "La tarjeta actual es un artículo semántico con encabezado y descripción, mientras las tarjetas decorativas inferiores llevan aria-hidden e inert. Cada swipe tiene un botón nativo equivalente con nombre específico y una región live cortés anuncia tarjeta y posición. prefers-reduced-motion desactiva el arrastre y reemplaza el resorte/salida por cambios inmediatos. forced-colors quita sombras y recupera límites, superficies y foco del sistema. Los textos propios superan 11,5:1 sobre la tarjeta.",
  sourcePath: "src/registry/ui/layered-stack.tsx",
  Preview: LayeredStackPreview,
};
