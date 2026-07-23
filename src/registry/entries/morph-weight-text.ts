import { MorphWeightTextPreview } from "@/registry/previews/morph-weight-text-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "morph-weight-text",
  name: "Morph Weight Text",
  nameEs: "Texto de peso variable",
  category: "text",
  materials: ["adaptive"],
  description: "Variable-font weight morphing that responds to hover/focus or resolves once on entrance with configurable endpoints.",
  descriptionEs: "Cambio de peso de fuente variable que responde a hover/foco o se resuelve una vez al entrar con extremos configurables.",
  variants: [
    { id: "interactive", label: "Interactive", labelEs: "Interactivo" },
    { id: "entrance", label: "Entrance", labelEs: "Entrada" },
  ],
  sizes: [{ id: "inherit", label: "Inherit", labelEs: "Heredado" }],
  dependencies: { npm: ["clsx", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "A single real text node carries the accessible name; font weight changes neither content nor line box, and the variable font stack is literal and self-contained. Interactive mode adds no tab stop unless requested. CSS declares font-variation-settings as its exact transition property. Reduced motion and forced colors jump directly to the final readable weight.",
  a11yEs: "Un único nodo de texto real porta el nombre accesible; el peso no cambia contenido ni caja de línea y la pila de fuente variable es literal y self-contained. El modo interactivo no agrega tabulación salvo que se solicite. CSS declara font-variation-settings como propiedad exacta de transición. Movimiento reducido y forced colors saltan directamente al peso final legible.",
  sourcePath: "src/registry/ui/morph-weight-text.tsx",
  Preview: MorphWeightTextPreview,
};
