import { ScrollStackPreview } from "@/registry/previews/scroll-stack-preview";
import type { RegistryEntry } from "@/registry/schema";

/** Registry metadata for the copy-and-own Scroll Stack. */
export const entry: RegistryEntry = {
  slug: "scroll-stack",
  name: "Scroll Stack",
  nameEs: "Pila al desplazarse",
  category: "media",
  materials: ["adaptive"],
  description:
    "A semantic sequence of cards that progressively pins and layers through native sticky positioning as its container scrolls.",
  descriptionEs:
    "Una secuencia semántica de tarjetas que se fija y apila progresivamente mediante posicionamiento sticky nativo al desplazar su contenedor.",
  variants: [
    { id: "compact", label: "Compact", labelEs: "Compacta" },
    { id: "spacious", label: "Spacious", labelEs: "Amplia" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: {
    npm: ["class-variance-authority", "clsx", "tailwind-merge"],
    internal: ["src/lib/cn.ts"],
  },
  a11y:
    "The stack remains a named region containing a semantic list in document order; every card is an article with a real heading, so sticky positioning never changes reading order. The root can receive keyboard focus when it is the scrolling viewport. Scale is decorative and removed by prefers-reduced-motion. forced-colors removes shadows and restores Canvas, CanvasText and explicit card boundaries. Owned primary text reaches 16.9:1 and secondary text 11.6:1 against the card surface.",
  a11yEs:
    "La pila permanece como región nombrada con una lista semántica en orden de documento; cada tarjeta es un artículo con encabezado real, por lo que sticky nunca cambia el orden de lectura. La raíz puede recibir foco cuando funciona como viewport desplazable. La escala es decorativa y prefers-reduced-motion la elimina. forced-colors quita sombras y recupera Canvas, CanvasText y límites explícitos. El texto principal propio alcanza 16,9:1 y el secundario 11,6:1 sobre la tarjeta.",
  sourcePath: "src/registry/ui/scroll-stack.tsx",
  Preview: ScrollStackPreview,
};
