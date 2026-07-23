import { SplitFeaturePreview } from "@/registry/previews/split-feature-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "split-feature",
  name: "Split Feature",
  nameEs: "Función dividida",
  category: "blocks",
  materials: ["adaptive"],
  description: "A responsive series of text-and-visual feature rows with alternating desktop composition and stable mobile reading order.",
  descriptionEs: "Una serie responsive de filas de texto y visual con composición alternada en escritorio y orden de lectura móvil estable.",
  variants: [
    { id: "alternating", label: "Alternating", labelEs: "Alternada" },
    { id: "stacked", label: "Stacked", labelEs: "Apilada" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "lucide-react", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The section is labelled by an h2 and each feature has an h3 plus a real bullet list. Text always precedes its visual in source order; desktop alternation uses CSS order only, so mobile and assistive reading order stay predictable. Visual panels and charts are decorative and aria-hidden, the component has no required motion, forced colors restores panel boundaries, and all copy meets at least 4.5:1 contrast.",
  a11yEs: "La sección está etiquetada por h2 y cada función tiene h3 y lista real. El texto siempre precede al visual en el orden fuente; la alternancia de escritorio usa solo orden CSS, así que móvil y tecnologías de asistencia conservan lectura predecible. Paneles y gráficas son decorativos y aria-hidden, no hay movimiento obligatorio, forced colors restaura límites y todo el texto cumple al menos 4,5:1.",
  sourcePath: "src/registry/ui/split-feature.tsx",
  Preview: SplitFeaturePreview,
};
