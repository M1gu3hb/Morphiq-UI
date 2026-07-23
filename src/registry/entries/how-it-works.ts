import { HowItWorksPreview } from "@/registry/previews/how-it-works-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "how-it-works",
  name: "How It Works",
  nameEs: "Cómo funciona",
  category: "blocks",
  materials: ["adaptive"],
  description: "A numbered process section with horizontal or vertical layouts, semantic ordered steps, supporting copy, and decorative connectors.",
  descriptionEs: "Una sección de proceso numerado con layouts horizontal o vertical, pasos ordenados semánticos, texto de apoyo y conectores decorativos.",
  variants: [
    { id: "horizontal", label: "Horizontal", labelEs: "Horizontal" },
    { id: "vertical", label: "Vertical", labelEs: "Vertical" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "lucide-react", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The process is a native ordered list within a section labelled by its h2. Every step includes a visible number, h3 title, and explanation, so meaning never depends on connectors, icons, or color. The component is motion-free by default and therefore already presents its final state under reduced motion. Decorative connectors and icons are aria-hidden, forced colors restores boundaries, and all copy meets at least 4.5:1 contrast.",
  a11yEs: "El proceso es una lista ordenada nativa dentro de una sección etiquetada por su h2. Cada paso incluye número visible, título h3 y explicación, así que el significado nunca depende de conectores, iconos o color. El componente no usa movimiento por defecto y ya presenta su estado final con movimiento reducido. Conectores e iconos son aria-hidden, forced colors restaura límites y todo el texto cumple al menos 4,5:1.",
  sourcePath: "src/registry/ui/how-it-works.tsx",
  Preview: HowItWorksPreview,
};
