import { FooterSectionPreview } from "@/registry/previews/footer-section-preview";
import type { RegistryEntry } from "@/registry/schema";

export const entry: RegistryEntry = {
  slug: "footer-section",
  name: "Footer Section",
  nameEs: "Sección Footer",
  category: "blocks",
  materials: ["adaptive"],
  description: "A responsive multi-column site footer with brand summary, named link-group navigation, social actions and a separate legal row.",
  descriptionEs: "Un footer responsive multicolumna con resumen de marca, navegación de grupos etiquetada, acciones sociales y fila legal separada.",
  variants: [
    { id: "light", label: "Light", labelEs: "Claro" },
    { id: "dark", label: "Dark", labelEs: "Oscuro" },
  ],
  sizes: [
    { id: "sm", label: "Small", labelEs: "Pequeño" },
    { id: "md", label: "Medium", labelEs: "Mediano" },
    { id: "lg", label: "Large", labelEs: "Grande" },
  ],
  dependencies: { npm: ["class-variance-authority", "clsx", "lucide-react", "tailwind-merge"], internal: ["src/lib/cn.ts"] },
  a11y: "Uses a native footer and separate nav landmarks with unique accessible names for every product group, legal links and social media. All interactions are anchors in logical DOM order; responsive columns never reorder them. Icon-only social links carry explicit aria-label values, while their Lucide glyphs are subordinate to the link name. Focus indicators are visible, reduced motion removes decorative color transitions, forced colors restores system borders and link colors, and both light and dark muted copy remain above 4.5:1 on the owned footer surface.",
  a11yEs: "Usa footer nativo y landmarks nav separados con nombres accesibles únicos para cada grupo de producto, enlaces legales y redes sociales. Todas las interacciones son enlaces en orden DOM lógico; las columnas responsive nunca los reordenan. Los enlaces sociales solo con ícono llevan aria-label explícito y sus glifos Lucide quedan subordinados al nombre del enlace. Los indicadores de foco son visibles, movimiento reducido elimina transiciones decorativas de color, forced colors restaura bordes y colores de enlace del sistema, y el texto atenuado claro y oscuro permanece sobre 4,5:1 en la superficie propia del footer.",
  sourcePath: "src/registry/ui/footer-section.tsx",
  Preview: FooterSectionPreview,
};
