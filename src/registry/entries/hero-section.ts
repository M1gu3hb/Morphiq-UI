import { HeroSectionPreview } from "@/registry/previews/hero-section-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "hero-section",
  name: "Hero Section",
  nameEs: "Sección Hero",
  category: "blocks",
  materials: ["adaptive"],
  description: "A responsive split or centered page hero with eyebrow, fluid headline, supporting copy, two clear actions and a self-contained visual panel.",
  descriptionEs: "Un hero de página responsive, dividido o centrado, con eyebrow, titular fluido, texto de apoyo, dos acciones claras y panel visual autocontenido.",
  variants: [
    { id: "split", label: "Split", labelEs: "Dividido" },
    { id: "centered", label: "Centered", labelEs: "Centrado" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "lucide-react", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "Uses a native section with a configurable h1 or h2, descriptive prose and real links for both calls to action. Source order stays heading, copy, actions, then visual at every breakpoint, even when layout changes. Decorative dashboard geometry and pulsing light are aria-hidden; reduced motion stops the pulse without hiding the final visual. Focus rings are visible, forced colors restores system boundaries and text, and all light/dark text combinations exceed 4.5:1 (large headline exceeds 3:1).",
  a11yEs: "Usa una sección nativa con h1 o h2 configurable, texto descriptivo y enlaces reales para ambas llamadas a la acción. El orden fuente conserva titular, texto, acciones y visual en cada breakpoint, aun cuando cambia el layout. La geometría del dashboard y la luz pulsante son decorativas y usan aria-hidden; movimiento reducido detiene el pulso sin ocultar el visual final. Los anillos de foco son visibles, forced colors restaura límites y texto del sistema, y todas las combinaciones claras/oscuras superan 4,5:1 (el titular grande supera 3:1).",
  sourcePath: "src/registry/ui/hero-section.tsx",
  Preview: HeroSectionPreview,
};
