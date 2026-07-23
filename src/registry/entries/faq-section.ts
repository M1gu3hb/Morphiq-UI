import { FaqSectionPreview } from "@/registry/previews/faq-section-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "faq-section",
  name: "FAQ Section",
  nameEs: "Sección de preguntas frecuentes",
  category: "blocks",
  materials: ["adaptive"],
  description: "A responsive FAQ section with native disclosure buttons, associated answer regions, single or multiple expansion, and motion-safe transitions.",
  descriptionEs: "Una sección responsive de preguntas frecuentes con botones de divulgación nativos, regiones de respuesta asociadas, expansión única o múltiple y transiciones seguras.",
  variants: [
    { id: "cards", label: "Cards", labelEs: "Tarjetas" },
    { id: "divided", label: "Divided", labelEs: "Dividida" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "lucide-react", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "The section is labelled by its h2. Every question is a native button with aria-expanded and aria-controls, and every answer is a labelled region. Enter and Space work through native button behavior; all triggers remain in document order. Collapsed content is aria-hidden, reduced motion removes grid and chevron transitions, forced colors restores system boundaries, and text and controls maintain at least 4.5:1 contrast.",
  a11yEs: "La sección está etiquetada por su h2. Cada pregunta es un botón nativo con aria-expanded y aria-controls, y cada respuesta es una región etiquetada. Enter y Espacio funcionan mediante el comportamiento nativo; todos los disparadores conservan el orden del documento. El contenido colapsado usa aria-hidden, movimiento reducido elimina las transiciones de rejilla y chevron, forced colors restaura límites del sistema y textos y controles mantienen al menos 4,5:1 de contraste.",
  sourcePath: "src/registry/ui/faq-section.tsx",
  Preview: FaqSectionPreview,
};
