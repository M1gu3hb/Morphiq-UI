import { CtaSectionPreview } from "@/registry/previews/cta-section-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "cta-section",
  name: "CTA Section",
  nameEs: "Sección CTA",
  category: "blocks",
  materials: ["adaptive"],
  description: "A full-width call-to-action band with strong hierarchy, two real links, an elevated accent surface and responsive stacking.",
  descriptionEs: "Una banda de llamada a la acción a todo el ancho con jerarquía fuerte, dos enlaces reales, superficie de acento elevada y apilado responsive.",
  variants: [
    { id: "gradient", label: "Gradient", labelEs: "Degradado" },
    { id: "solid", label: "Solid", labelEs: "Sólido" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeña" },
    { id: "md", label: "Medium", labelEs: "Mediana" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "lucide-react", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "Uses a native section with one h2, supporting paragraph and two anchors whose labels describe their destinations. The ornament is aria-hidden and never covers content. Focus is visible on both actions, mobile stacking preserves DOM and tab order, reduced motion freezes the pulse and removes control transitions, and forced colors replaces the gradient, shadows and boundaries with system colors. White and muted lavender copy remain above 4.5:1 on both owned dark surfaces; the large heading is also above 3:1.",
  a11yEs: "Usa una sección nativa con un h2, párrafo de apoyo y dos enlaces cuyas etiquetas describen sus destinos. El adorno usa aria-hidden y nunca cubre contenido. El foco es visible en ambas acciones, el apilado móvil conserva orden DOM y de tabulación, movimiento reducido congela el pulso y elimina transiciones de controles, y forced colors sustituye degradado, sombras y límites con colores del sistema. El texto blanco y lavanda atenuado permanece sobre 4,5:1 en ambas superficies oscuras propias; el titular grande también supera 3:1.",
  sourcePath: "src/registry/ui/cta-section.tsx",
  Preview: CtaSectionPreview,
};
